import Link from 'next/link';
import { getCurrentUser } from '../lib/auth/session';
import { LogoutButton } from './LogoutButton'; 

export default async function Navbar() {
  const user = await getCurrentUser();

  return (
    <nav className="bg-white shadow-sm border-b mb-6">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-blue-600">
          Git-Talking
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/search" className="text-gray-600 hover:text-gray-900">
            Search
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-700 font-medium">
                Welcome, {user.display_name}
              </span>
              <LogoutButton />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="text-blue-600 hover:underline">
                Log In
              </Link>
              <Link href="/signup" className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}