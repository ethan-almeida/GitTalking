import pool from '../../lib/db';
import { getCurrentUser } from '../../lib/auth/session';
import { redirect } from 'next/navigation';
import { deleteChannel } from '../actions';
import DeleteButton from '../../components/DeleteButton';

interface User {
  id: string;
  display_name: string;
  email: string;
  role: string;
}

interface Channel {
  id: string;
  name: string;
}

interface Post {
  id: string;
  title: string;
}

interface Reply {
  id: string;
  body: string;
}

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') redirect('/');

  const users = (await pool.query('SELECT id, display_name, email, role FROM users')).rows as User[];
  const channels = (await pool.query('SELECT * FROM channels')).rows as Channel[];
  const posts = (await pool.query('SELECT * FROM posts')).rows as Post[];
  const replies = (await pool.query('SELECT * FROM replies')).rows as Reply[];

  return (
    <main className="min-h-screen bg-gray-100 p-8 text-gray-900">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-2">Users</h2>
          <ul>
            {users.map((u) => (
              <li key={u.id} className="flex justify-between p-2 border-b items-center">
                <span>{u.display_name} ({u.role})</span>
                <DeleteButton action="user" id={u.id} />
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-2">Channels</h2>
          <ul>
            {channels.map((c) => (
              <li key={c.id} className="flex justify-between p-2 border-b items-center">
                <span>{c.name}</span>
                <DeleteButton action="channel" id={c.id} />
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-2">Posts</h2>
          <ul>
            {posts.map((p) => (
              <li key={p.id} className="flex justify-between p-2 border-b items-center">
                <span>{p.title}</span>
                <DeleteButton action="post" id={p.id} />
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-2">Replies</h2>
          <ul>
            {replies.map((r) => (
              <li key={r.id} className="flex justify-between p-2 border-b items-center">
                <span>{r.body.substring(0, 30)}...</span>
                <DeleteButton action="reply" id={r.id} />
              </li>
            ))}
          </ul>
        </div>

      </div>
    </main>
  );
}