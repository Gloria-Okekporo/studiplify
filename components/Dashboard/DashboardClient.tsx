'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/Common/Toast';
import DashboardSidebar from './Sidebar';
import DashboardHeader from './Header';
import MobileNav from './MobileNav';

import DailyInsightsWidget from './DailyInsightsWidget';

export default function DashboardClient({ 
  user, 
  studyPlans = [], 
  tasks: initialTasks = [], 
  analytics = [],
  initialInsight = null
}: { 
  user?: any; 
  studyPlans?: any[]; 
  tasks?: any[]; 
  analytics?: any[];
  initialInsight?: any;
}) {
  const [tasks, setTasks] = useState<any[]>(initialTasks);
  const [loading, setLoading] = useState(initialTasks.length === 0);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1500); // 25 mins
  const [isActive, setIsActive] = useState(false);
  const supabase = createClientComponentClient();
  const router = useRouter();
  const { showToast, toasts, removeToast } = useToast();

  useEffect(() => {
    // Only fetch if initialTasks is empty to avoid double fetching
    if (initialTasks.length === 0) {
      fetchTasks();
    }
  }, [initialTasks]);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      showToast("Great job! Time for a short break.", "info");
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (error: any) {
      console.error('Error fetching tasks:', error.message);
    } finally {
      setLoading(false);
    }
  };

  // 1. Calculate Realtime Stats
  const completedTasksCount = tasks.filter(t => t && t.completed === true).length;
  const pendingTasksCount = tasks.filter(t => t && t.completed === false).length;
  
  const totalStudyMinutes = analytics.reduce((acc, curr) => acc + (curr.study_time_minutes || 0), 0);
  const totalStudyHours = Math.round(totalStudyMinutes / 60);

  // Simple streak calculation from analytics dates
  let streak = 0;
  const sortedAnalytics = [...analytics].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const today = new Date().toISOString().split('T')[0];
  
  for (let i = 0; i < sortedAnalytics.length; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    if (sortedAnalytics.some(a => a.date === dateStr && (a.study_time_minutes > 0 || a.tasks_completed > 0))) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    setIsCreatingTask(true);
    
    // Optimistic Update
    const optimisticTask = {
      id: crypto.randomUUID(),
      title: newTaskTitle,
      user_id: user.id,
      completed: false,
      priority: 'Medium',
      created_at: new Date().toISOString()
    };
    
    setTasks(prev => [optimisticTask, ...prev]);
    const previousTitle = newTaskTitle;
    setNewTaskTitle('');

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{ 
          title: previousTitle, 
          user_id: user.id,
          completed: false,
          priority: 'Medium'
        }])
        .select();

      if (error) throw error;

      if (data && data[0]) {
        // Replace optimistic task with real data to get the real ID
        setTasks(prev => prev.map(t => t.id === optimisticTask.id ? data[0] : t));
        showToast("Task captured in your neural flow.", "success");
      }
    } catch (error: any) {
      // Rollback
      setTasks(prev => prev.filter(t => t.id !== optimisticTask.id));
      setNewTaskTitle(previousTitle);
      showToast(error.message, "error");
    } finally {
      setIsCreatingTask(false);
    }
  };

  const handleFinishFocus = async () => {
    setIsActive(false);
    const actualMinutes = Math.floor((1500 - timeLeft) / 60);
    if (actualMinutes < 1) {
      setTimeLeft(1500);
      return;
    }

    try {
      // In a full implementation, we'd have a sessionId from startFocusSession
      // For this widget, we'll directly update daily analytics
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: existing } = await supabase
        .from('productivity_analytics')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('date', today)
        .single();

      if (existing) {
        await supabase
          .from('productivity_analytics')
          .update({ 
            study_time_minutes: (existing.study_time_minutes || 0) + actualMinutes,
            focus_score: Math.min(100, (existing.focus_score || 0) + 5)
          })
          .eq('id', existing.id);
      } else {
        await supabase
          .from('productivity_analytics')
          .insert([{
            user_id: session.user.id,
            date: today,
            study_time_minutes: actualMinutes,
            focus_score: 80
          }]);
      }

      showToast(`Session complete! +${actualMinutes}m logged.`, "success");
      setTimeLeft(1500);
      router.refresh();
    } catch (error) {
      console.error('Focus sync error:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  return (
    <div className="flex h-screen bg-background text-text-dark font-body selection:bg-accent-orange/30 selection:text-text-dark overflow-hidden">
      
      <DashboardSidebar user={user} onSignOut={handleSignOut} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative bg-background">
        
        <DashboardHeader title="Overview" />

        {/* Scrollable Dashboard Content */}
        <div className="flex-1 overflow-y-auto hide-scrollbar">
          <div className="max-w-[1400px] mx-auto px-8 lg:px-12 py-8 space-y-8">
            
            {/* Hero Section */}
            <motion.section 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-surface-dim rounded-[3rem] p-10 lg:p-14 border border-border/30 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10"
            >
              <div className="relative z-10 space-y-6">
                <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-accent-orange/10 text-accent-orange rounded-full text-[11px] font-black uppercase tracking-widest border border-accent-orange/20">
                  <span className="material-symbols-outlined text-[16px] font-bold">rocket_launch</span>
                  Productivity Mode
                </div>
                <div>
                  <h2 className="text-5xl lg:text-6xl font-black text-text-dark tracking-tighter leading-none mb-4">
                    {user?.user_metadata?.full_name ? `Welcome back, ${user.user_metadata.full_name.split(' ')[0]}.` : "You're doing great."}
                  </h2>
                  <p className="text-xl font-medium text-text-muted opacity-80">
                    You have <span className="text-accent-orange font-bold">{pendingTasksCount} pending</span> tasks today.
                  </p>
                </div>
              </div>

              {/* Task Quick Add */}
              <div className="w-full md:w-[450px] relative z-10 group">
                <form onSubmit={handleCreateTask} className="relative">
                  <input 
                    type="text" 
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Capture a new task..." 
                    className="w-full h-16 bg-white border border-border/60 rounded-full pl-8 pr-32 font-medium text-text-dark shadow-sm focus:border-accent-orange focus:ring-4 focus:ring-accent-orange/5 outline-none transition-all"
                    disabled={isCreatingTask}
                  />
                  <button 
                    type="submit" 
                    disabled={isCreatingTask || !newTaskTitle.trim()} 
                    className="absolute right-2 top-2 bottom-2 bg-accent-orange text-white px-8 rounded-full font-black text-sm uppercase tracking-widest shadow-glow-orange hover:bg-accent-orange/90 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isCreatingTask ? '...' : 'Add'}
                  </button>
                </form>
              </div>

              {/* Decorative Background Orb */}
              <div className="absolute -right-20 -top-20 w-[400px] h-[400px] bg-accent-orange/[0.05] rounded-full blur-[100px] pointer-events-none"></div>
            </motion.section>

            {/* Daily Insight Featured Widget */}
            <DailyInsightsWidget initialInsight={initialInsight} />

            {/* Stats & Focus Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Stats Cards Column */}
              <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: 'Streak', value: streak.toString(), unit: 'days', icon: 'local_fire_department', color: 'text-accent-orange', bg: 'bg-accent-orange/5' },
                  { label: 'Tasks', value: completedTasksCount.toString(), unit: 'done', icon: 'check_circle', color: 'text-accent-green', bg: 'bg-accent-green/5' },
                  { label: 'Study Time', value: totalStudyHours.toString(), unit: 'h', icon: 'schedule', color: 'text-accent-purple', bg: 'bg-accent-purple/5' }
                ].map((stat, i) => (
                  <div key={i} className="bg-white border border-border/40 rounded-[2.5rem] p-8 flex flex-col justify-between hover:shadow-md transition-all group">
                    <div className="flex items-center justify-between mb-8">
                      <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                        <span className="material-symbols-outlined font-bold text-[24px]">{stat.icon}</span>
                      </div>
                      <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] opacity-40">{stat.label}</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-black text-text-dark tracking-tighter tabular-nums">{stat.value}</span>
                      <span className="text-sm font-black text-text-muted uppercase tracking-widest opacity-40">{stat.unit}</span>
                    </div>
                  </div>
                ))}

                <Link href="/dashboard/study-plan" className="w-full">
                  <motion.div 
                    whileHover={{ y: -5, borderColor: 'rgba(255, 138, 76, 0.4)' }}
                    whileTap={{ scale: 0.98 }}
                    className="md:col-span-3 bg-white border border-border/40 rounded-[3rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8 hover:shadow-lg transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-8">
                      <motion.div 
                        whileHover={{ rotate: 12 }}
                        className="w-16 h-16 rounded-[1.5rem] bg-accent-orange/10 flex items-center justify-center text-accent-orange group-hover:rotate-6 transition-transform"
                      >
                        <span className="material-symbols-outlined text-[32px] font-black">event_note</span>
                      </motion.div>
                      <div>
                        <h3 className="text-2xl font-black text-text-dark tracking-tighter mb-1">Study Plans</h3>
                        <p className="text-sm font-medium text-text-muted opacity-70">
                          {studyPlans.length > 0 
                            ? `You have ${studyPlans.length} active roadmaps.` 
                            : 'Adaptive roadmap synced with your goals.'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-accent-orange font-black text-xs uppercase tracking-widest group-hover:gap-5 transition-all">
                      {studyPlans.length > 0 ? 'View Roadmaps' : 'Generate Your Path'} <span className="material-symbols-outlined font-bold">arrow_forward</span>
                    </div>
                  </motion.div>
                </Link>
              </div>

              {/* Focus Timer Card */}
              <div className="lg:col-span-4">
                <div className="bg-white border border-border/40 rounded-[3rem] p-10 text-center h-full flex flex-col justify-between relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-accent-orange/[0.03] rounded-full blur-[40px] pointer-events-none group-hover:scale-150 transition-transform duration-1000"></div>
                  
                  <div>
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-surface-dim text-text-muted rounded-full text-[10px] font-black uppercase tracking-widest mb-8 border border-border/30">
                      <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-accent-green' : 'bg-accent-orange'} animate-pulse`}></div>
                      {isActive ? 'Deep Work Phase' : 'Ready to Focus'}
                    </div>
                    
                    <div className="relative w-56 h-56 mx-auto mb-8 flex items-center justify-center">
                      <svg className="absolute inset-0 w-full h-full -rotate-90">
                        <circle cx="50%" cy="50%" r="44%" fill="transparent" stroke="#F0EDE8" strokeWidth="8" />
                        <motion.circle 
                          cx="50%" cy="50%" r="44%" 
                          fill="transparent" 
                          stroke="#FF8A4C" 
                          strokeWidth="8" 
                          strokeDasharray="276"
                          strokeDashoffset={276 * (1 - (timeLeft / 1500))}
                          strokeLinecap="round"
                          transition={{ ease: "linear" }}
                        />
                      </svg>
                      <div className="flex flex-col items-center relative z-10">
                        <span className="text-6xl font-black text-text-dark tracking-tighter tabular-nums leading-none">{formatTime(timeLeft)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <button 
                      onClick={() => setIsActive(!isActive)}
                      className={`w-full h-16 rounded-full font-black text-sm uppercase tracking-widest transition-all active:scale-95 shadow-md flex items-center justify-center gap-3 ${
                        isActive 
                          ? 'bg-white border-2 border-accent-orange text-accent-orange' 
                          : 'bg-accent-orange text-white shadow-glow-orange hover:bg-accent-orange/90'
                      }`}
                    >
                      <span className="material-symbols-outlined font-black">{isActive ? 'pause_circle' : 'play_circle'}</span>
                      {isActive ? 'Pause Session' : 'Start Focus'}
                    </button>
                    
                    {timeLeft < 1500 && (
                      <button 
                        onClick={handleFinishFocus}
                        className="w-full h-12 text-xs font-black text-text-muted uppercase tracking-widest hover:text-text-dark transition-colors"
                      >
                        Finish & Log Time
                      </button>
                    )}
                  </div>
                </div>
              </div>

            </div>

            {/* AI Tools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Link href="/dashboard/summarizer" className="block">
                <motion.div 
                  whileHover={{ y: -5, borderColor: 'rgba(255, 138, 76, 0.4)' }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white border border-border/40 rounded-[3rem] p-10 hover:shadow-lg transition-all group h-full"
                >
                  <motion.div 
                    whileHover={{ rotate: 12 }}
                    className="w-14 h-14 rounded-2xl bg-accent-orange/10 flex items-center justify-center text-accent-orange mb-6 group-hover:scale-110 transition-transform"
                  >
                    <span className="material-symbols-outlined text-[28px] font-black">summarize</span>
                  </motion.div>
                  <h3 className="text-2xl font-black text-text-dark tracking-tighter mb-2">Note Summarizer</h3>
                  <p className="text-sm font-medium text-text-muted opacity-70 mb-6 leading-relaxed">Compress lengthy lecture notes into key concepts instantly.</p>
                  <div className="text-accent-orange font-black text-[10px] uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all">
                    Try Now <span className="material-symbols-outlined text-[16px] font-black">arrow_forward</span>
                  </div>
                </motion.div>
              </Link>

              <Link href="/dashboard/quizzes" className="block">
                <motion.div 
                  whileHover={{ y: -5, borderColor: 'rgba(255, 138, 76, 0.4)' }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white border border-border/40 rounded-[3rem] p-10 hover:shadow-lg transition-all group h-full"
                >
                  <motion.div 
                    whileHover={{ rotate: 12 }}
                    className="w-14 h-14 rounded-2xl bg-accent-orange/10 flex items-center justify-center text-accent-orange mb-6 group-hover:scale-110 transition-transform"
                  >
                    <span className="material-symbols-outlined text-[28px] font-black">quiz</span>
                  </motion.div>
                  <h3 className="text-2xl font-black text-text-dark tracking-tighter mb-2">Quiz Generator</h3>
                  <p className="text-sm font-medium text-text-muted opacity-70 mb-6 leading-relaxed">Test your knowledge with AI-generated practice questions.</p>
                  <div className="text-accent-orange font-black text-[10px] uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all">
                    Try Now <span className="material-symbols-outlined text-[16px] font-black">arrow_forward</span>
                  </div>
                </motion.div>
              </Link>
            </div>
            
          </div>
        </div>

        <ToastContainer toasts={toasts} onRemove={removeToast} />
        <MobileNav />
      </main>
    </div>
  );
}
