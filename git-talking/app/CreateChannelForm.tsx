import { createChannel } from './actions';

export default function CreateChannelForm() {
  return (
    <form action={createChannel} className="bg-white p-6 rounded shadow-md mb-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Create a New Channel</h2>
      
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Channel Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          required
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., JavaScript Help"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          name="description"
          id="description"
          rows={2}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="What is this channel about?"
        />
      </div>

      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-semibold transition-colors"
      >
        Create Channel
      </button>
    </form>
  );
}