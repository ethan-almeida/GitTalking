import { notFound } from "next/navigation";
import pool from "../../../lib/db";
import CreatePostForm from "./CreatePostForm";
import Link from "next/link";
import ImageModal from "@/components/ImageModal";

interface Channel {
    id: string;
    name: string;
    description: string | null;
}

interface Post {
    id: string;
    title: string;
    body: string;
    created_at: string;
    author_id: string;
    author_name: string;
    file_path: string | null;
}

export default async function channel_page({params}: {params: Promise<{id: string}>}){
    const {id} = await params;
    const channel_id = id;
    const channel_result = await pool.query('SELECT * FROM channels WHERE id=$1', [channel_id]);
    const channel: Channel | undefined = channel_result.rows[0];
    const posts_result = await pool.query(`
      SELECT p.*, u.display_name as author_name, a.file_path 
      FROM posts p 
      JOIN users u ON p.author_id = u.id 
      LEFT JOIN attachments a ON a.target_type = 'post' AND a.target_id = p.id 
      WHERE p.channel_id = $1 
      ORDER BY p.created_at DESC
    `, [channel_id]);
    const posts: Post[] = posts_result.rows as Post[];

    if (!channel){      
        return (
            <div className="p-8 text-center text-red-500">
                Channel not notFound.
            </div>
        );
    }

    return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 border-b pb-4">
          <h1 className="text-4xl font-bold text-gray-800">{channel.name}</h1>
          <p className="text-gray-600 mt-2">
            {channel.description || 'No description available.'}
          </p>
        </div>

        <div className="mb-6">
          <CreatePostForm channel_id={channel_id} />
        </div>

        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="text-center text-gray-500 py-10 bg-white rounded shadow">
              No posts yet. Be the first to post!
            </div>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="bg-white p-6 rounded shadow hover:shadow-md transition">
                <Link href={`/posts/${post.id}`}>
                  <h2 className="text-xl font-semibold text-blue-800">{post.title}</h2>
                  <p className="text-gray-700 mt-2 line-clamp-2">{post.body}</p>
                </Link>

                {post.file_path && (
                  <div className="mt-3">
                    <ImageModal src={post.file_path} alt="Post attachment" />
                  </div>
                )}
                <div className="text-xs text-gray-400 mt-4">
                  <span className="font-semibold text-gray-600">Posted by: {post.author_name || 'Unknown'}</span>

                  <span className="mx-2">•</span>

                  Posted: {new Date(post.created_at).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </main>
  );
}