'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getReminders, StudyReminder } from '@/lib/actions/notifications';
import { useToast } from '@/hooks/useToast';

export default function NotificationCenter() {
  const [reminders, setReminders] = useState<StudyReminder[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const { showToast } = useToast();
  const toastedRef = useRef<Set<string>>(new Set());
  const initialFetchRef = useRef(false);

  useEffect(() => {
    fetchReminders(true);
    // Auto-refresh reminders every 2 minutes
    const interval = setInterval(() => fetchReminders(false), 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchReminders = async (isInitial = false) => {
    if (!isInitial) setIsSyncing(true);
    try {
      const res = await getReminders();
      if (res.success) {
        const newReminders = res.data as StudyReminder[];
        setReminders(newReminders);

        // Proactive Automation: Toast high-priority notifications
        newReminders.forEach(r => {
          if (r.priority === 'high' && !r.is_read && !toastedRef.current.has(r.id)) {
            showToast(r.message, 'info');
            toastedRef.current.add(r.id);
          }
        });

        // Show a "Ready" toast on initial load to confirm automation is active
        if (isInitial && !initialFetchRef.current) {
          showToast("Study Intel Automation is Active", "success");
          initialFetchRef.current = true;
        }
      }
    } catch (error) {
      console.error('Failed to fetch reminders:', error);
    } finally {
      setLoading(false);
      setTimeout(() => setIsSyncing(false), 2000);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'upcoming': return 'event_available';
      case 'missed': return 'event_busy';
      case 'streak': return 'local_fire_department';
      case 'exam': return 'rocket_launch';
      case 'system': return 'hub';
      default: return 'notifications';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'upcoming': return 'text-accent-purple bg-accent-purple/10';
      case 'missed': return 'text-red-500 bg-red-50';
      case 'streak': return 'text-accent-orange bg-accent-orange/10';
      case 'exam': return 'text-accent-green bg-accent-green/10';
      case 'system': return 'text-blue-500 bg-blue-50';
      default: return 'text-text-muted bg-surface-muted';
    }
  };

  const unreadCount = reminders.filter(r => !r.is_read).length;

  return (
    <div className="relative">
      <div className="flex items-center gap-3">
        {/* Syncing Indicator */}
        <AnimatePresence>
          {isSyncing && (
            <motion.div 
              initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
              className="flex items-center gap-2 px-3 py-1 bg-surface-dim rounded-full border border-border/30"
            >
              <div className="w-1.5 h-1.5 bg-accent-orange rounded-full animate-pulse" />
              <span className="text-[9px] font-black text-text-muted uppercase tracking-widest">Syncing Intel</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notification Toggle Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-11 h-11 rounded-full bg-white border border-border/50 flex items-center justify-center text-text-muted hover:text-accent-orange hover:border-accent-orange/30 shadow-sm transition-all relative"
        >
          <span className="material-symbols-outlined text-[24px]">notifications</span>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent-orange text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Notification Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-4 w-[380px] md:w-[420px] bg-white border border-border/40 rounded-[2.5rem] shadow-soft-xl z-50 overflow-hidden"
            >
              <div className="p-8 border-b border-border/30 bg-surface-dim/30">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-black text-text-dark tracking-tighter">Study Intel</h3>
                    <p className="text-[10px] font-black text-text-muted uppercase tracking-widest opacity-60">Automation Active</p>
                  </div>
                  <button 
                    onClick={() => setReminders(reminders.map(r => ({ ...r, is_read: true })))}
                    className="text-[10px] font-black text-accent-orange uppercase tracking-widest hover:underline"
                  >
                    Mark all read
                  </button>
                </div>
              </div>

              <div className="max-h-[500px] overflow-y-auto hide-scrollbar p-4 space-y-3">
                {loading ? (
                  <div className="py-12 flex flex-col items-center justify-center space-y-4 opacity-40">
                    <div className="w-8 h-8 border-3 border-accent-orange border-t-transparent rounded-full animate-spin" />
                    <p className="text-xs font-bold uppercase tracking-widest">Analyzing behavior...</p>
                  </div>
                ) : reminders.length > 0 ? (
                  reminders.map((reminder, i) => (
                    <motion.div
                      key={reminder.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`group flex gap-4 p-5 rounded-[1.5rem] hover:bg-surface-dim border border-transparent hover:border-border/40 transition-all cursor-pointer relative ${!reminder.is_read ? 'bg-accent-orange/[0.02]' : ''}`}
                    >
                      <div className={`w-12 h-12 rounded-xl shrink-0 flex items-center justify-center ${getTypeColor(reminder.type)}`}>
                        <span className="material-symbols-outlined text-[24px] font-bold">
                          {getTypeIcon(reminder.type)}
                        </span>
                      </div>
                      
                      <div className="space-y-1 pr-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-black text-text-dark tracking-tight leading-none group-hover:text-accent-orange transition-colors">
                            {reminder.title}
                          </h4>
                          <span className="text-[9px] font-black text-text-muted uppercase opacity-40">
                            {new Date(reminder.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-[13px] font-medium text-text-muted leading-relaxed opacity-80">
                          {reminder.message}
                        </p>
                      </div>

                      {reminder.priority === 'high' && !reminder.is_read && (
                        <div className="absolute right-3 top-3 w-1.5 h-1.5 rounded-full bg-accent-orange animate-pulse" />
                      )}
                    </motion.div>
                  ))
                ) : (
                  <div className="py-20 flex flex-col items-center justify-center text-center space-y-6 opacity-30">
                    <div className="w-16 h-16 rounded-full border-2 border-dashed border-text-muted flex items-center justify-center">
                      <span className="material-symbols-outlined text-[32px]">notifications_off</span>
                    </div>
                    <div>
                      <p className="text-sm font-black uppercase tracking-widest">Clear Orbit</p>
                      <p className="text-[11px] font-medium max-w-[200px] mt-2">Your neural engine is balanced. No reminders needed.</p>
                    </div>
                  </div>
                )}
              </div>

              {reminders.length > 0 && (
                <div className="p-6 bg-surface-dim/30 border-t border-border/30 text-center">
                  <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] opacity-40">
                    Stay Focused, Stay Inspired.
                  </p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
