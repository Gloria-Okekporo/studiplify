'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createTask, toggleTask, deleteTask } from '@/lib/actions/tasks';
import { useToast } from '@/hooks/useToast';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import DashboardSidebar from './Sidebar';
import DashboardHeader from './Header';
import MobileNav from './MobileNav';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { ToastContainer } from '@/components/Common/Toast';

export default function TasksClient({ initialTasks }: { initialTasks: any[] }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const { showToast, toasts, removeToast } = useToast();
  const { user, logout } = useAuth();
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    setIsAdding(true);
    
    // Optimistic Update
    const optimisticTask = {
      id: crypto.randomUUID(),
      title: newTaskTitle,
      completed: false,
      priority: 'Medium',
      created_at: new Date().toISOString()
    };
    
    setTasks(prev => [optimisticTask, ...prev]);
    const previousTitle = newTaskTitle;
    setNewTaskTitle('');

    try {
      const res = await createTask(previousTitle);
      if (res.success) {
        // Replace optimistic task with real data
        if (res.data) {
          setTasks(prev => prev.map(t => t.id === optimisticTask.id ? res.data : t));
        }
        showToast("Task synchronized.", "success");
        router.refresh();
      } else {
        // Rollback on failure
        setTasks(prev => prev.filter(t => t.id !== optimisticTask.id));
        setNewTaskTitle(previousTitle);
        showToast(res.error || "Failed to add task.", "error");
      }
    } catch (error: any) {
      // Rollback on exception
      setTasks(prev => prev.filter(t => t.id !== optimisticTask.id));
      setNewTaskTitle(previousTitle);
      showToast("An unexpected error occurred.", "error");
    } finally {
      setIsAdding(false);
    }
  };

  const handleToggle = async (id: string, completed: boolean) => {
    // Optimistic update
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !completed } : t));
    
    try {
      await toggleTask(id, !completed);
      if (!completed) showToast("Goal achieved!", "success");
      router.refresh();
    } catch (error) {
      showToast("Failed to sync state.", "error");
      // Rollback if error
      setTasks(prev => prev.map(t => t.id === id ? { ...t, completed } : t));
    }
  };

  const handleDelete = async (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    try {
      await deleteTask(id);
      showToast("Task archived.", "info");
      router.refresh();
    } catch (error) {
      showToast("Failed to archive task.", "error");
    }
  };

  const handleSignOut = async () => {
    await logout();
    router.push('/auth/login');
  };

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  return (
    <div className="flex h-screen bg-background text-text-dark font-body selection:bg-accent-orange/30 selection:text-text-dark overflow-hidden">
      
      <DashboardSidebar user={user} onSignOut={handleSignOut} />

      <main className="flex-1 flex flex-col h-full overflow-hidden relative bg-background">
        
        <DashboardHeader title="Tasks & Milestones" badge={`${tasks.filter(t => !t.completed).length} Pending`} />

        <div className="flex-1 overflow-y-auto hide-scrollbar">
          <div className="max-w-[1000px] mx-auto px-8 lg:px-12 py-12 space-y-12 pb-32">
            
            {/* Header section */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-accent-orange/10 text-accent-orange rounded-full text-[11px] font-black uppercase tracking-widest border border-accent-orange/20">
                <span className="material-symbols-outlined text-[16px] font-bold">assignment_turned_in</span>
                Execution Flow
              </div>
              <h2 className="text-4xl font-black text-text-dark tracking-tighter leading-none">
                Task Management
              </h2>
              <p className="text-lg font-medium text-text-muted opacity-80 max-w-xl">
                Break down your academic goals into actionable steps and track your progress in real-time.
              </p>
            </div>

            {/* Quick Add Interface */}
            <form onSubmit={handleAddTask} className="relative group">
              <div className="absolute inset-0 bg-accent-orange/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <input 
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Deploy a new study milestone..."
                className="w-full h-20 bg-white border border-border/40 rounded-[2rem] px-8 pr-40 font-medium text-lg focus:ring-4 focus:ring-accent-orange/5 focus:border-accent-orange outline-none transition-all shadow-soft relative z-10"
              />
              <button 
                type="submit"
                disabled={isAdding || !newTaskTitle.trim()}
                className="absolute right-3 top-3 bottom-3 px-8 bg-accent-orange text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-glow-orange hover:bg-accent-orange/90 active:scale-95 transition-all z-20 disabled:opacity-50"
              >
                {isAdding ? 'Syncing...' : 'Add Milestone'}
              </button>
            </form>

            {/* Tasks List */}
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {tasks.map((task) => (
                  <motion.div 
                    key={task.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`group flex items-center gap-6 p-6 rounded-[2.5rem] border transition-all ${
                      task.completed ? 'bg-surface-dim/40 border-transparent' : 'bg-white border-border/40 hover:border-accent-orange/30 shadow-sm'
                    }`}
                  >
                    <button 
                      onClick={() => handleToggle(task.id, task.completed)}
                      className={`shrink-0 w-10 h-10 rounded-2xl border-2 flex items-center justify-center transition-all ${
                        task.completed 
                          ? 'bg-accent-orange border-accent-orange text-white' 
                          : 'bg-white border-border/40 hover:border-accent-orange text-transparent'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[20px] font-black">check</span>
                    </button>

                    <div className="flex-1 min-w-0">
                      <span className={`text-lg font-bold block truncate transition-all ${
                        task.completed ? 'text-text-muted/50 line-through' : 'text-text-dark'
                      }`}>
                        {task.title}
                      </span>
                      <div className="flex items-center gap-4 mt-1.5">
                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${
                          task.priority === 'Urgent' ? 'bg-red-50 text-red-500' :
                          task.priority === 'High' ? 'bg-accent-orange/10 text-accent-orange' : 'bg-surface-dim text-text-muted/60'
                        }`}>
                          {task.priority}
                        </span>
                        {task.due_date && (
                          <span className="text-[10px] font-black text-text-muted/40 uppercase tracking-widest flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                            {new Date(task.due_date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>

                    <button 
                      onClick={() => handleDelete(task.id)}
                      className="opacity-0 group-hover:opacity-40 hover:opacity-100 w-12 h-12 rounded-2xl flex items-center justify-center text-text-muted hover:bg-red-50 hover:text-red-500 transition-all"
                    >
                      <span className="material-symbols-outlined text-[22px]">delete</span>
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>

              {tasks.length === 0 && (
                <div className="text-center py-24 bg-surface-dim/30 rounded-[3.5rem] border border-dashed border-border/40">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 text-text-muted/20">
                    <span className="material-symbols-outlined text-[32px]">task_alt</span>
                  </div>
                  <p className="text-[11px] font-black text-text-muted uppercase tracking-[0.4em] opacity-30">Zero Tasks Pending</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <MobileNav />
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </main>
    </div>
  );
}

