'use client';

import Link from 'next/link';
import {
  Banknote,
  ArrowLeftRight,
  User,
  LogOut,
  Home,
  CreditCard,
  Settings,
} from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  return (
    <aside className="w-64 sticky top-0 bg-gradient-to-b from-blue-900 to-blue-800 p-6 h-screen flex flex-col text-white z-10">
      <div className="mb-10">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Banknote className="w-6 h-6 text-blue-300" />
          <span>AngkorBank</span>
        </h2>
        <p className="text-xs text-blue-200 mt-1">Premium Banking</p>
      </div>

      <nav className="flex flex-col space-y-2 flex-grow">
        <Link 
          href="/dashboard" 
          className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
            isActive('/dashboard')
              ? 'bg-blue-700 shadow-md'
              : 'hover:bg-blue-700/50'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Dashboard</span>
        </Link>

        <Link 
          href="/dashboard/transfer" 
          className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
            isActive('/dashboard/transfer')
              ? 'bg-blue-700 shadow-md'
              : 'hover:bg-blue-700/50'
          }`}
        >
          <ArrowLeftRight className="w-5 h-5" />
          <span>Transfer Funds</span>
        </Link>

        <Link 
          href="/dashboard/transactions" 
          className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
            isActive('/dashboard/transactions')
              ? 'bg-blue-700 shadow-md'
              : 'hover:bg-blue-700/50'
          }`}
        >
          <CreditCard className="w-5 h-5" />
          <span>Transactions</span>
        </Link>

        <Link 
          href="/dashboard/admin" 
          className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
            isActive('/dashboard/admin')
              ? 'bg-blue-700 shadow-md'
              : 'hover:bg-blue-700/50'
          }`}
        >
          <User className="w-5 h-5" />
          <span>Notifications</span>
        </Link>

        <Link 
          href="/dashboard/settings" 
          className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
            isActive('/dashboard/settings')
              ? 'bg-blue-700 shadow-md'
              : 'hover:bg-blue-700/50'
          }`}
        >
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </Link>
      </nav>

      <div className="mt-auto">
        <Link 
          href="/logout" 
          className="flex items-center gap-3 p-3 rounded-lg text-red-300 hover:bg-blue-700/50 hover:text-red-200 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </Link>
        <div className="text-xs text-blue-300 mt-4">
          <p>AngkorBank v2.0</p>
          <p>Secure Banking System</p>
        </div>
      </div>
    </aside>
  );
}
