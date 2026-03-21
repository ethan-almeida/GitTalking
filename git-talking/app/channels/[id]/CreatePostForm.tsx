import { create_post } from "./actions";

interface CreatePostFormProps {
    channel_id: string;
}

export default function CreatePostForm({channel_id}: CreatePostFormProps){
    return (
    <form action={create_post} className="bg-white p-6 rounded shadow mb-6">
      <input type="hidden" name="channel_id" value={channel_id} />
      
      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          type="text"
          name="title"
          id="title"
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your question title..."
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-1">
          Body
        </label>
        <textarea
          name="body"
          id="body"
          rows={4}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Describe your question in detail..."
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-semibold"
      >
        Post Question
      </button>
    </form>
  );
}