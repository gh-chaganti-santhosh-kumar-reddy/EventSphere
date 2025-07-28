
"use client";

import Link from 'next/link';

import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';


export default function Navbar() {
  const router = useRouter();
  const { isLoggedIn, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50">
      <div className="flex justify-between items-center px-8 pt-2 bg-white bg-opacity-50">
        <h1 className="text-2xl font-bold" style={{ color: '#b12c00' }}>
          EventSphere
        </h1>
        <ul className="flex gap-4 text-black items-center">
          <li>
            <Link href="/" className="px-4 py-1 rounded font-medium bg-black text-white hover:bg-blue-600 hover:text-white transition-colors duration-200 cursor-pointer">Home</Link>
          </li>
          <li>
            <Link href="/event/create_event" className="px-4 py-1 rounded font-medium bg-green-600 text-white hover:bg-green-800 hover:text-white transition-colors duration-200 cursor-pointer">Create Event</Link>
          </li>
          {isLoggedIn ? (
            <>
              <li>
                <button onClick={handleLogout} className="px-4 py-1 rounded font-medium bg-red-600 text-white hover:bg-red-800 hover:text-white transition-colors duration-200 cursor-pointer">Logout</button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link href="/login" className="px-4 py-1 rounded font-medium bg-black text-white hover:bg-blue-600 hover:text-white transition-colors duration-200 cursor-pointer">Login</Link>
              </li>
              <li>
                <Link href="/signup" className="px-4 py-1 rounded font-medium bg-black text-white hover:bg-blue-600 hover:text-white transition-colors duration-200 cursor-pointer">Sign Up</Link>
              </li>
            </>
          )}
        </ul>
      </div>
      <hr className="h-px my-3 bg-gray-200 border-0 dark:bg-gray-700" />
    </nav>
  );
}
