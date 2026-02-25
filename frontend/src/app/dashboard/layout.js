'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function DashboardLayout({ children }) {
  const { user, initializing, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!initializing && !isAuthenticated) {
      router.replace('/login');
    }
  }, [initializing, isAuthenticated, router]);

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted">
        Loading your dashboard…
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const navLinks =
    user.role === 'freelancer'
      ? [
          { href: '/dashboard/freelancer', label: 'Overview' },
          { href: '/dashboard/freelancer/history', label: 'History' },
          { href: '/dashboard/freelancer/profile', label: 'Profile' }
        ]
      : [
          { href: '/dashboard/client', label: 'Overview' },
          { href: '/dashboard/client/pay', label: 'Send Payment' },
          { href: '/dashboard/client/history', label: 'History' }
        ];

  return (
    <div className="min-h-screen flex">
      <aside className="hidden md:flex flex-col w-64 border-r border-white/10 bg-black/30 backdrop-blur-md">
        <div className="px-6 py-4 border-b border-white/10">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-emerald-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">FP</span>
            </div>
            <span className="font-semibold text-sm text-slate-100">RafikiPay</span>
          </Link>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-1">
          {navLinks.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center px-3 py-2 rounded-md text-sm ${
                  active ? 'bg-white/10 text-white' : 'text-muted hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="px-4 py-4 border-t border-white/10 text-xs text-muted flex items-center justify-between">
          <span>{user.email}</span>
          <button type="button" onClick={logout} className="text-red-400 hover:text-red-300">
            Log out
          </button>
        </div>
      </aside>

      <main className="flex-1 px-4 md:px-8 py-6">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}

