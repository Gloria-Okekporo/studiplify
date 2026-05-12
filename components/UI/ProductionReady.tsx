import React from 'react';
import { motion } from 'framer-motion';

export const CardSkeleton = () => (
  <div className="w-full h-48 bg-white border border-border/20 rounded-[2.5rem] p-8 animate-pulse flex flex-col justify-between">
    <div className="space-y-4">
      <div className="h-6 w-1/3 bg-surface-dim rounded-full" />
      <div className="h-4 w-2/3 bg-surface-dim rounded-full" />
    </div>
    <div className="h-10 w-full bg-surface-dim rounded-2xl" />
  </div>
);

export const ChartSkeleton = () => (
  <div className="w-full h-80 bg-white border border-border/20 rounded-[3rem] p-10 animate-pulse flex items-end gap-4">
    {[...Array(7)].map((_, i) => (
      <div key={i} className="flex-1 bg-surface-dim rounded-t-xl" style={{ height: `${Math.random() * 60 + 20}%` }} />
    ))}
  </div>
);

export const EmptyState = ({ title, message, icon, actionText, onAction }: { 
  title: string; 
  message: string; 
  icon: string; 
  actionText?: string; 
  onAction?: () => void 
}) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="w-full py-20 px-10 bg-white/40 backdrop-blur-xl border border-white/80 rounded-[3.5rem] text-center space-y-6 shadow-soft"
  >
    <div className="w-20 h-20 bg-surface-dim rounded-[2.2rem] flex items-center justify-center text-text-muted/40 mx-auto">
      <span className="material-symbols-outlined text-[40px] font-black">{icon}</span>
    </div>
    <div className="space-y-2">
      <h3 className="text-2xl font-black text-text-dark tracking-tighter leading-none">{title}</h3>
      <p className="text-base font-medium text-text-muted/70 max-w-sm mx-auto leading-relaxed">{message}</p>
    </div>
    {actionText && onAction && (
      <button 
        onClick={onAction}
        className="btn-primary !h-14 !px-10 !text-sm shadow-glow-primary"
      >
        {actionText}
      </button>
    )}
  </motion.div>
);
