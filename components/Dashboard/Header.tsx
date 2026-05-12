'use client';

import React from 'react';
import NotificationCenter from './NotificationCenter';

interface HeaderProps {
  title: string;
  badge?: string;
  badgeColor?: string;
}

export default function DashboardHeader({ title, badge = "All Systems Go", badgeColor = "bg-accent-green" }: HeaderProps) {
  return (
    <header className="h-20 lg:h-24 flex items-center justify-between px-8 lg:px-12 z-20 shrink-0">
      <div className="flex items-center gap-8">
        <h1 className="text-3xl font-black text-text-dark tracking-tighter">{title}</h1>
        
        <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 bg-surface-muted rounded-full border border-border/30 shadow-inner-sm">
          <div className={`w-2 h-2 rounded-full ${badgeColor} animate-pulse shadow-sm`}></div>
          <span className="text-[11px] font-black text-text-muted uppercase tracking-widest">{badge}</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative hidden md:block group">
          <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-[20px] text-text-muted group-focus-within:text-accent-orange transition-colors">search</span>
          <input 
            type="text" 
            placeholder="Search tasks..." 
            className="w-64 lg:w-80 h-11 bg-surface-dim border border-border/60 rounded-full pl-14 pr-6 font-medium text-text-dark placeholder:text-text-muted/40 transition-all focus:bg-white focus:border-accent-orange focus:ring-4 focus:ring-accent-orange/5 outline-none" 
          />
        </div>
        
        <NotificationCenter />
      </div>
    </header>
  );
}
