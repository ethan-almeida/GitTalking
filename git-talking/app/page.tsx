import pool from '../lib/db';
import Link from 'next/link';
import CreateChannelForm from './CreateChannelForm';
import { revalidatePath } from 'next/cache';
import VoteButtons from '../components/VoteButtons';

interface Channel {
  id: string;
  name: string;
  description: string | null;
}


export async function vote(targetType: 'post' | 'reply', targetId: string, value: 1 | -1, currentPath: string) {
  const userResult = await pool.query('SELECT id FROM users LIMIT 1');
  const userId = userResult.rows[0]?.id;
  if (!userId) {
    console.error('No user found');
    return;
  }

  try {
    const existingVote = await pool.query(
      'SELECT * FROM votes WHERE user_id = $1 AND target_type = $2 AND target_id = $3',
      [userId, targetType, targetId]
    );

    if (existingVote.rows.length > 0) {
      const currentVote = existingVote.rows[0];
      if (currentVote.value === value) {
        await pool.query('DELETE FROM votes WHERE id = $1', [currentVote.id]);
      } else {
        await pool.query('UPDATE votes SET value = $1 WHERE id = $2', [value, currentVote.id]);
      }
    } else {
      await pool.query(
        'INSERT INTO votes (user_id, target_type, target_id, value) VALUES ($1, $2, $3, $4)',
        [userId, targetType, targetId, value]
      );
    }
    revalidatePath(currentPath);
    
  } catch (error) {
    console.error('Voting failed:', error);
  }
}

export default async function Home(){
  let channels: Channel[] = [];

  try {
    const result = await pool.query('SELECT * FROM channels');
    channels = result.rows;
  } catch (error) {
    console.error('failed to fetch the channel: ', error);
  }

    return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4">Programming Q&A Tool</h1>
        <p className="text-lg text-gray-600">
          A channel-based system for programming questions and threaded discussion.
        </p>
      </div>

      <div className="w-full max-w-2xl mb-8">
        <CreateChannelForm />
      </div>

      <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Available Channels</h2>
        
        {channels.length === 0 ? (
          <p className="text-gray-500">No channels found. Check your database seed data.</p>
        ) : (
          <ul className="space-y-4">
            {channels.map((channel) => (
              <li key={channel.id} className="border p-4 rounded hover:bg-gray-50 transition-colors">
                <Link href={`/channels/${channel.id}`}>
                <h3 className="font-bold text-xl text-blue-700">{channel.name}</h3>
                <p className="text-gray-600 mt-1">
                  {channel.description || 'No description available.'}
                </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

    </main>
  );
}

