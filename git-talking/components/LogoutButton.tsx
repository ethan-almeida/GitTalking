// 'use client';

// import { logout } from '../lib/auth/session';
// import { useRouter } from 'next/navigation';

// export function LogoutButton() {
//   const router = useRouter();

//   const handleLogout = async () => {
//     await logout();
//     router.refresh(); 
//   };

//   return (
//     <button 
//       onClick={handleLogout}
//       className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300 text-sm font-medium"
//     >
//       Log Out
//     </button>
//   );
// }

'use client';

import { logout } from '../app/actions';

export function LogoutButton() {
  return (
    // We use a form to call the server action
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