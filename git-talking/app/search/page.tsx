import pool from '../../lib/db';
import Link from 'next/link';

const ITEMS_IN_PAGE = 10;

export default async function SearchPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ q?: string; page?: string }> 
}) {

  const params = await searchParams;
  const query = params.q || "";
  const curr_page = Number(params.page) || 1;
  const offset = (curr_page-1)*ITEMS_IN_PAGE;
  let posts: any[] = [];
  let replies: any[] = [];
  let topUser: any = null;
  let leastUser: any = null;
  let topPost: any = null;

  try {
    const topUserRes = await pool.query(`
      SELECT u.display_name, COUNT(p.id) as post_count 
      FROM users u 
      JOIN posts p ON u.id = p.author_id 
      GROUP BY u.id 
      ORDER BY post_count DESC 
      LIMIT 1
    `);
    topUser = topUserRes.rows[0];

    const leastUserRes = await pool.query(`
      SELECT u.display_name, COUNT(p.id) as post_count 
      FROM users u 
      LEFT JOIN posts p ON u.id = p.author_id 
      GROUP BY u.id 
      ORDER BY post_count ASC 
      LIMIT 1
    `);
    leastUser = leastUserRes.rows[0];

    const topPostRes = await pool.query(`
      SELECT p.title, p.id, COALESCE(SUM(v.value), 0) as score 
      FROM posts p 
      LEFT JOIN votes v ON v.target_type = 'post' AND v.target_id = p.id 
      GROUP BY p.id 
      ORDER BY score DESC 
      LIMIT 1
    `);
    topPost = topPostRes.rows[0];

    if (query.trim() !== "") {
      const postsQuery = `
        SELECT p.id, p.title, p.body, c.name as channel_name, p.channel_id
        FROM posts p
        JOIN channels c ON p.channel_id = c.id
        WHERE p.title ILIKE $1 OR p.body ILIKE $1
        ORDER BY p.created_at DESC
        LIMIT $2 OFFSET $3
      `;
      const postsResult = await pool.query(postsQuery, [`%${query}%`, ITEMS_IN_PAGE, offset]);
      posts = postsResult.rows;

      const repliesQuery = `
        SELECT r.id, r.body, p.title as post_title, p.id as post_id
        FROM replies r
        JOIN posts p ON r.post_id = p.id
        WHERE r.body ILIKE $1
        ORDER BY r.created_at DESC
        LIMIT $2 OFFSET $3
      `;
      const repliesResult = await pool.query(repliesQuery, [`%${query}%`, ITEMS_IN_PAGE, offset]);
      replies = repliesResult.rows;
    }

  } catch (error) {
    console.error("Search error:", error);
  }

  const getPageUrl = (pageNum: number) => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    params.set('page', pageNum.toString());
    return `/search?${params.toString()}`;
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Search & Statistics</h1>

        <form className="mb-8 flex gap-2">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search for posts or replies..."
            className="flex-1 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-semibold"
          >
            Search
          </button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded shadow border-l-4 border-green-500">
            <h3 className="font-bold text-gray-700 text-sm uppercase">Top Poster</h3>
            {topUser ? (
              <>
                <p className="text-xl font-semibold text-gray-900">{topUser.display_name}</p>
                <p className="text-gray-600">{topUser.post_count} posts</p>
              </>
            ) : <p className="text-gray-500">No data</p>}
          </div>

          <div className="bg-white p-4 rounded shadow border-l-4 border-red-500">
            <h3 className="font-bold text-gray-700 text-sm uppercase">Least Active</h3>
            {leastUser ? (
              <>
                <p className="text-xl font-semibold text-gray-900">{leastUser.display_name}</p>
                <p className="text-gray-600">{leastUser.post_count} posts</p>
              </>
            ) : <p className="text-gray-500">No data</p>}
          </div>

          <div className="bg-white p-4 rounded shadow border-l-4 border-blue-500">
            <h3 className="font-bold text-gray-700 text-sm uppercase">Highest Ranked Post</h3>
            {topPost ? (
              <>
                <Link href={`/posts/${topPost.id}`} className="text-lg font-semibold text-blue-600 hover:underline">
                  {topPost.title}
                </Link>
                <p className="text-gray-600">Score: {topPost.score}</p>
              </>
            ) : <p className="text-gray-500">No data</p>}
          </div>
        </div>

          {query.trim() !== "" && (
          <div className="space-y-8">
            
            <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">
              Search Results for "{query}"
            </h2>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Posts ({posts.length} on this page)
              </h3>
              {posts.length === 0 ? (
                <p className="text-gray-500">No posts found.</p>
              ) : (
                <ul className="space-y-4">
                  {posts.map((post) => (
                     <li key={post.id} className="bg-white p-4 rounded shadow">
                       <div className="text-xs text-blue-600 font-semibold mb-1">in #{post.channel_name}</div>
                       <Link href={`/posts/${post.id}`} className="text-lg font-semibold text-gray-900 hover:underline">
                         {post.title}
                       </Link>
                       <p className="text-gray-600 text-sm mt-1 line-clamp-2">{post.body}</p>
                     </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Replies ({replies.length} on this page)
              </h3>
               {replies.length === 0 ? (
                <p className="text-gray-500">No replies found.</p>
              ) : (
                <ul className="space-y-4">
                  {replies.map((reply) => (
                     <li key={reply.id} className="bg-white p-4 rounded shadow">
                       <div className="text-xs text-gray-500 mb-1">Reply to: 
                         <span className="text-blue-600 font-semibold ml-1">{reply.post_title}</span>
                       </div>
                       <p className="text-gray-800">{reply.body}</p>
                       <Link href={`/posts/${reply.post_id}`} className="text-sm text-blue-600 hover:underline mt-2 inline-block">
                         View Context
                       </Link>
                     </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex justify-center gap-4 mt-8 pt-4 border-t">
              {curr_page > 1 && (
                <Link 
                  href={getPageUrl(curr_page - 1)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  ← Previous Page
                </Link>
              )}
              
              {(posts.length === ITEMS_IN_PAGE || replies.length === ITEMS_IN_PAGE) && (
                <Link 
                  href={getPageUrl(curr_page + 1)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Next Page →
                </Link>
              )}
            </div>

          </div>
        )}


      </div>
    </main>
  );
}