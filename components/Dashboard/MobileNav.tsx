'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { icon: 'grid_view', label: 'Home', href: '/dashboard' },
  { icon: 'military_tech', label: 'Rank', href: '/dashboard/rank' },
  { icon: 'schedule', label: 'Focus', href: '/dashboard/focus' },
  { icon: 'event_note', label: 'Plan', href: '/dashboard/study-plan' },
  { icon: 'insights', label: 'Data', href: '/dashboard/analytics' },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-6 left-4 right-4 bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl rounded-full p-2 flex items-center justify-around z-50 lg:hidden overflow-hidden">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link 
            key={item.href} 
            href={item.href} 
            className={`w-12 h-12 rounded-full flex flex-col items-center justify-center transition-all ${
              isActive 
                ? 'bg-accent-orange text-white shadow-glow-orange' 
                : 'text-text-muted hover:bg-surface-dim'
            }`}
          >
            <span className="material-symbols-outlined text-[22px] font-bold">{item.icon}</span>
          </Link>
        );
      })}
    </nav>
  );
}
