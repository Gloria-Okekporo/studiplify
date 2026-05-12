'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createTask, toggleTask, deleteTask } from '@/lib/actions/tasks';
import { useToast } from '@/hooks/useToast';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function TasksClient({ initialTasks }: { initialTasks: any[] }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const { showToast } = useToast();
  const supabase = createClientComponentClient();

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    setIsAdding(true);
    try {
      const res = await createTask(newTaskTitle);
      if (res.success) {
        setNewTaskTitle('');
        showToast("Task synchronized.", "success");
      }
    } catch (error) {
      showToast("Failed to add task.", "error");
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
    } catch (error) {
      showToast("Failed to archive task.", "error");
    }
  };

  useEffect(() => {
    const channel = supabase
      .channel('realtime-tasks')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'tasks' 
      }, async () => {
        // Simple re-fetch or manual update if needed
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="w-full space-y-8">
      {/* Quick Add Interface */}
      <form onSubmit={handleAddTask} className="relative group">
        <div className="absolute inset-0 bg-accent-orange/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
        <input 
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Deploy a new study milestone..."
          className="w-full h-16 bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl px-8 pr-32 font-medium text-lg focus:ring-2 focus:ring-accent-orange/20 outline-none transition-all shadow-soft relative z-10"
        />
        <button 
          type="submit"
          disabled={isAdding || !newTaskTitle.trim()}
          className="absolute right-3 top-3 bottom-3 px-6 bg-accent-orange text-white rounded-xl font-black text-[11px] uppercase tracking-widest shadow-glow-primary hover:scale-105 active:scale-95 transition-all z-20 disabled:opacity-50"
        >
          {isAdding ? 'Syncing...' : 'Add Task'}
        </button>
      </form>

      {/* Tasks List */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {tasks.map((task) => (
            <motion.div 
              key={task.id}
              layout
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`group flex items-center gap-4 p-5 rounded-[1.8rem] border transition-all ${
                task.completed ? 'bg-surface-dim/40 border-transparent' : 'bg-white border-border/40 hover:border-accent-orange/30 shadow-sm'
              }`}
            >
              <button 
                onClick={() => handleToggle(task.id, task.completed)}
                className={`shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                  task.completed 
                    ? 'bg-accent-orange border-accent-orange text-white' 
                    : 'border-border/40 hover:border-accent-orange text-transparent'
                }`}
              >
                <span className="material-symbols-outlined text-[16px] font-black">check</span>
              </button>

              <div className="flex-1 min-w-0">
                <span className={`text-[15px] font-bold block truncate transition-all ${
                  task.completed ? 'text-text-muted/50 line-through' : 'text-text-dark'
                }`}>
                  {task.title}
                </span>
                <div className="flex items-center gap-3 mt-1">
                  <span className={`text-[9px] font-black uppercase tracking-widest ${
                    task.priority === 'Urgent' ? 'text-red-500' :
                    task.priority === 'High' ? 'text-accent-orange' : 'text-text-muted/60'
                  }`}>
                    {task.priority} Priority
                  </span>
                  {task.due_date && (
                    <span className="text-[9px] font-black text-text-muted/40 uppercase tracking-widest">
                      Due {new Date(task.due_date).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>

              <button 
                onClick={() => handleDelete(task.id)}
                className="opacity-0 group-hover:opacity-40 hover:opacity-100 w-10 h-10 rounded-xl flex items-center justify-center text-text-muted hover:bg-red-50 hover:text-red-500 transition-all"
              >
                <span className="material-symbols-outlined text-[20px]">delete</span>
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {tasks.length === 0 && (
          <div className="text-center py-12 bg-surface-dim/30 rounded-[2.5rem] border border-dashed border-border/40">
            <p className="text-[11px] font-black text-text-muted uppercase tracking-[0.3em] opacity-30">Clear for Deployment</p>
          </div>
        )}
      </div>
    </div>
  );
}
