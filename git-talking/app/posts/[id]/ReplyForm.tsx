'use client'; 

import { useState } from 'react';
import { createReply } from './actions';

interface ReplyFormProps {
  postId: string;
  parentReplyId?: string | null; 
}

export default function ReplyForm({ postId, parentReplyId = null }: ReplyFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  if (parentReplyId && !isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="text-blue-600 text-sm hover:underline mt-2"
      >
        Reply
      </button>
    );
  }

  return (
    <form action={createReply} className="mt-2">
      <input type="hidden" name="postId" value={postId} />
      <input type="hidden" name="parentReplyId" value={parentReplyId || ''} />
      <textarea 
        name="body"
        required
        className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        rows={2}
        placeholder="Write a reply..."
      />
      
      <div className="flex gap-2 mt-1">
        <button 
          type="submit"
          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
        >
          Post Reply
        </button>
        {parentReplyId && (
          <button 
            type="button" 
            onClick={() => setIsOpen(false)}
            className="text-gray-600 text-sm hover:underline"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}