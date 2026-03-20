import pool from '../lib/db';

interface Channel {
  id: string;
  name: string;
  description: string | null;
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

      <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Available Channels</h2>
        
        {channels.length === 0 ? (
          <p className="text-gray-500">No channels found. Check your database seed data.</p>
        ) : (
          <ul className="space-y-4">
            {channels.map((channel) => (
              <li key={channel.id} className="border p-4 rounded hover:bg-gray-50 transition-colors cursor-pointer">
                <h3 className="font-bold text-xl text-blue-700">{channel.name}</h3>
                <p className="text-gray-600 mt-1">
                  {channel.description || 'No description available.'}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

    </main>
  );
}

