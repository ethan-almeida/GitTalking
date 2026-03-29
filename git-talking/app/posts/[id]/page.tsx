import pool from '../../../lib/db';
import Link from 'next/link';
import ReplyForm from './ReplyForm';
import VoteButtons from '../../../components/VoteButtons';
import { getCurrentUser } from '@/lib/auth/session';

interface Reply {
  id: string;
  post_id: string;
  body: string;
  author_id: string;
  author_name: string;
  created_at: string;
  parent_reply_id: string | null;
  children: Reply[];
  score: number; 
}

function buildReplyTree(replies: Reply[]): Reply[] {
  const map = new Map<string, Reply>();
  const roots: Reply[] = [];

  replies.forEach(reply => {
    map.set(reply.id, { ...reply, children: [] });
  });

  replies.forEach(reply => {
    if (reply.parent_reply_id) {
      const parent = map.get(reply.parent_reply_id);
      if (parent) {
        parent.children.push(map.get(reply.id)!);
      }
    } else {
      roots.push(map.get(reply.id)!);
    }
  });

  return roots;
}

function ReplyItem({ reply, currentPath }: { reply: Reply, currentPath: string }) {
  return (
    <div className="ml-4 mt-4 border-l-2 border-gray-200 pl-4">
      <div className="bg-gray-50 p-3 rounded flex items-start gap-2">
        <VoteButtons 
          targetType="reply" 
          targetId={reply.id} 
          score={reply.score} 
          currentPath={currentPath} 
        />
        
        <div className="flex-1">
          <p className="text-gray-800">{reply.body}</p>
          <div className="text-xs text-gray-500 mt-2">
            <span className="font-semibold text-gray-700">{reply.author_name || 'Unknown'}</span>
            <span className="mx-2">•</span>
            <span>{new Date(reply.created_at).toLocaleString()}</span>
          </div>
        </div>
      </div>

      <ReplyForm postId={reply.post_id} parentReplyId={reply.id} />

      {reply.children.length > 0 && (
        <div className="mt-2">
          {reply.children.map(child => <ReplyItem key={child.id} reply={child} currentPath={currentPath} />)}
        </div>
      )}
    </div>
  );
}


export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  const { id } = await params;
  const postId = id;
  const currentPath = `/posts/${postId}`; 
  const postResult = await pool.query(`
    SELECT p.*, COALESCE(SUM(v.value), 0) as score 
    FROM posts p 
    LEFT JOIN votes v ON v.target_type = 'post' AND v.target_id = p.id 
    WHERE p.id = $1 
    GROUP BY p.id
  `, [postId]);
  
  const post = postResult.rows[0];

  if (!post) {
    return <div className="p-8 text-center text-red-500">Post not found.</div>;
  }

  const repliesResult = await pool.query(`
    SELECT r.*, u.display_name as author_name, COALESCE(SUM(v.value), 0) as score 
    FROM replies r 
    JOIN users u ON r.author_id = u.id
    LEFT JOIN votes v ON v.target_type = 'reply' AND v.target_id = r.id 
    WHERE r.post_id = $1 
    GROUP BY r.id, u.id
    ORDER BY r.created_at ASC
  `, [postId]);

  const replyTree = buildReplyTree(repliesResult.rows);

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        
        <Link href={`/channels/${post.channel_id}`} className="text-blue-600 hover:underline mb-4 inline-block">
          Back to Channel
        </Link>

        <div className="bg-white p-6 rounded shadow mb-6 flex gap-4">
          <VoteButtons 
            targetType="post" 
            targetId={post.id} 
            score={post.score} 
            currentPath={currentPath} 
          />
          
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>
            <p className="text-gray-700 text-lg">{post.body}</p>
            <div className="mt-4 text-sm text-gray-500">
              Posted: {new Date(post.created_at).toLocaleString()}
            </div>
          </div>
        </div>

        <div className="mb-6 bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2 text-gray-900">Leave a Reply</h3>
          {user ? (
            <ReplyForm postId={post.id} />
          ) : (
            <p className="text-gray-500">
              <Link href="/login" className="text-blue-600 hover:underline">Log in</Link> to reply.
            </p>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-xl text-gray-800">Replies</h3>
          {replyTree.length === 0 ? (
            <p className="text-gray-500">No replies yet.</p>
          ) : (
            replyTree.map(reply => <ReplyItem key={reply.id} reply={reply} currentPath={currentPath} />)
          )}
        </div>

      </div>
    </main>
  );
}