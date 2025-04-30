// components/Navbar.tsx
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-blue-600 p-4 shadow-md text-white">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-semibold">AngkorBank</h1>
        <div className="space-x-4">
          <Link href="/dashboard" className="hover:text-gray-200">Dashboard</Link>
          <Link href="/logout" className="hover:text-gray-200">Logout</Link>
        </div>
      </div>
    </nav>
  );
}
