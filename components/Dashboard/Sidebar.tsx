'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

interface NavItem {
  icon: string;
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { icon: 'grid_view', label: 'Dashboard', href: '/dashboard' },
  { icon: 'assignment_turned_in', label: 'Tasks & Milestones', href: '/dashboard/tasks' },
  { icon: 'schedule', label: 'Focus Hub', href: '/dashboard/focus' },
  { icon: 'military_tech', label: 'Rank & Progress', href: '/dashboard/rank' },
  { icon: 'event_note', label: 'Study Plans', href: '/dashboard/study-plan' },
  { icon: 'summarize', label: 'Summarizer', href: '/dashboard/summarizer' },
  { icon: 'quiz', label: 'Quizzes', href: '/dashboard/quizzes' },
  { icon: 'insights', label: 'Analytics', href: '/dashboard/analytics' },
];

export default function DashboardSidebar({ user, onSignOut }: { user?: any, onSignOut?: () => void }) {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex w-64 lg:w-72 bg-white border-r border-border/40 flex-col h-full z-30 shrink-0">
      <div className="p-8 pb-10">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-accent-orange/10 flex items-center justify-center text-accent-orange group-hover:bg-accent-orange group-hover:text-white transition-all">
            <span className="material-symbols-outlined font-black text-[22px]">auto_awesome</span>
          </div>
          <span className="text-2xl font-black text-text-dark tracking-tighter">Studiplify<span className="text-accent-orange">.</span></span>
        </Link>
      </div>

      <div className="flex-1 px-4 overflow-y-auto hide-scrollbar">
        <div className="mb-6 px-4">
          <h3 className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] opacity-50">Main Menu</h3>
        </div>
        
        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 group relative ${
                  isActive 
                    ? 'bg-accent-orange text-white shadow-glow-orange' 
                    : 'text-text-muted hover:text-text-dark hover:bg-surface-dim'
                }`}
              >
                <span className={`material-symbols-outlined text-[24px] ${isActive ? 'font-bold' : 'group-hover:scale-110'}`}>
                  {item.icon}
                </span>
                <span className="font-bold text-[15px] tracking-tight">{item.label}</span>
                {isActive && (
                  <motion.div 
                    layoutId="sidebar-active"
                    className="absolute -right-1 w-1 h-8 bg-accent-orange rounded-full"
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-6 mt-auto border-t border-border/30">
        <div className="bg-surface-dim rounded-[2rem] p-4 flex items-center gap-4 mb-4 border border-border/20">
          <div className="w-12 h-12 rounded-full bg-white border border-border/40 flex items-center justify-center text-accent-orange font-black text-lg shadow-sm">
            {(user?.full_name || user?.user_metadata?.full_name || user?.email || 'S').charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-black text-text-dark truncate leading-none mb-1">
              {user?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Student User'}
            </h4>
            <span className="text-[10px] font-black text-accent-orange uppercase tracking-widest bg-accent-orange/10 px-2 py-0.5 rounded-full">
              PRO PLAN
            </span>
          </div>
        </div>

        
        <button 
          onClick={onSignOut}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-text-muted hover:text-red-500 hover:bg-red-50 transition-all group"
        >
          <span className="material-symbols-outlined text-[22px] group-hover:translate-x-1 transition-transform">logout</span>
          <span className="font-bold text-sm">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
