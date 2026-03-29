'use client';

import { deleteChannel, deletePost, deleteReply, deleteUser } from "../app/actions";

interface DeleteButtonProps {
  action: 'channel' | 'post' | 'reply' | 'user';
  id: string;
}

export default function DeleteButton({ action, id }: DeleteButtonProps) {
  
  const handleClick = async () => {
    const confirm = window.confirm("Are you sure you want to delete this? This cannot be undone.");
    if (!confirm) return;

    if (action === 'channel') await deleteChannel(id);
    if (action === 'post') await deletePost(id);
    if (action === 'reply') await deleteReply(id);
    if (action === 'user') await deleteUser(id);
  };

  return (
    <button 
      onClick={handleClick}
      className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-700"
    >
      Delete
    </button>
  );
}