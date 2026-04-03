'use client'; 

import { useRef, useState } from 'react';
import { createReply } from './actions';

interface ReplyFormProps {
  postId: string;
  parentReplyId?: string | null; 
}

export default function ReplyForm({ postId, parentReplyId = null }: ReplyFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);
    const result = await createReply(formData);

    if (result?.error) {
      setError(result.error);
      return;
    }

    formRef.current?.reset();
    if (parentReplyId) {
      setIsOpen(false);
    }
  }

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
    <>
      <form ref={formRef} action={handleSubmit} className="mt-2">
        <input type="hidden" name="postId" value={postId} />
        <input type="hidden" name="parentReplyId" value={parentReplyId || ''} />
        <textarea 
          name="body"
          required
          className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          rows={2}
          placeholder="Write a reply..."
        />

        <div className="my-2">
          <input 
            type="file" 
            name="image" 
            accept="image/png, image/jpeg, image/jpg, image/gif"
            className="text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
        
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
    </>
  );
}