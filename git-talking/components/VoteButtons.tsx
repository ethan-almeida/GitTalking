'use client';

import { vote } from '../app/actions';

interface VoteButtonsProps {
  targetType: 'post' | 'reply';
  targetId: string;
  score: number; 
  currentPath: string; 
}

export default function VoteButtons({ targetType, targetId, score, currentPath }: VoteButtonsProps) {
  return (
    <div className="flex items-center gap-1 text-sm text-gray-600">
      <form action={() => vote(targetType, targetId, 1, currentPath)}>
        <button type="submit" className="hover:text-green-600 px-1 font-bold">
          Upvote
        </button>
      </form>

      <span className="font-semibold min-w-[20px] text-center">
        {score}
      </span>

      <form action={() => vote(targetType, targetId, -1, currentPath)}>
        <button type="submit" className="hover:text-red-600 px-1 font-bold">
          Downvote
        </button>
      </form>
    </div>
  );
}