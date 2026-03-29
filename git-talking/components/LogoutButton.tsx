'use client';

import { logout } from '../app/actions';

export function LogoutButton() {
  return (
    <form action={logout}>
      <button 
        type="submit"
        className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300 text-sm font-medium"
      >
        Log Out
      </button>
    </form>
  );
}