'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { startFocusSession, completeFocusSession, getFocusStats } from '@/lib/actions/focus';
import { useToast } from '@/hooks/useToast';
import DashboardSidebar from './Sidebar';
import DashboardHeader from './Header';
import MobileNav from './MobileNav';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function FocusClient({ initialStats }: { initialStats: any }) {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [stats, setStats] = useState(initialStats);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleToggle = async () => {
    if (isActive) {
      // Pause logic (optional, for now we just clear)
      if (timerRef.current) clearInterval(timerRef.current);
      setIsActive(false);
      showToast("Focus session paused.", "info");
    } else {
      // Start Session
      setIsActive(true);
      try {
        const res = await startFocusSession(25);
        if (res.success) {
          setCurrentSessionId(res.data.id);
          showToast("Focus protocol initiated.", "success");
        }
      } catch (error) {
        showToast("Failed to sync session.", "error");
      }
    }
  };

  const handleReset = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsActive(false);
    setTimeLeft(25 * 60);
    setCurrentSessionId(null);
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      handleComplete();
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft]);

  const handleComplete = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsActive(false);
    
    if (currentSessionId) {
      try {
        await completeFocusSession(currentSessionId, 25);
        const newStats = await getFocusStats();
        setStats(newStats);
        showToast("Deep work cycle completed!", "success");
        handleReset();
      } catch (error) {
        showToast("Failed to save session results.", "error");
      }
    }
  };

  const handleSignOut = async () => {
    await logout();
    router.push('/auth/login');
  };

  return (
    <div className="flex h-screen bg-background text-text-dark font-body selection:bg-accent-orange/30 selection:text-text-dark overflow-hidden">
      
      <DashboardSidebar user={user} onSignOut={handleSignOut} />

      <main className="flex-1 flex flex-col h-full overflow-hidden relative bg-background">
        
        <DashboardHeader title="Focus Hub" badge="High Intensity" />

        <div className="flex-1 overflow-y-auto hide-scrollbar">
          <div className="max-w-[1400px] mx-auto px-8 lg:px-12 py-8 space-y-12">
            
            {/* Timer Hero Section */}
            <motion.section 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-[3rem] p-10 lg:p-20 border transition-all duration-700 relative overflow-hidden flex flex-col items-center justify-center min-h-[500px] ${
                isActive ? 'bg-text-dark border-transparent shadow-soft-2xl' : 'bg-white border-border/40'
              }`}
            >
              <div className="relative z-10 text-center space-y-12 w-full max-w-xl">
                <div className="space-y-4">
                  <div className={`inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest border transition-colors ${
                    isActive ? 'bg-white/10 text-white border-white/10' : 'bg-accent-orange/10 text-accent-orange border-accent-orange/20'
                  }`}>
                    <span className="material-symbols-outlined text-[16px] font-bold">bolt</span>
                    {isActive ? 'System Active' : 'Ready for Deep Work'}
                  </div>
                  <h2 className={`text-2xl lg:text-3xl font-black tracking-tighter transition-colors ${isActive ? 'text-white/60' : 'text-text-muted'}`}>
                    Pomodoro Protocol
                  </h2>
                </div>

                <div className="relative">
                  <motion.div 
                    key={timeLeft}
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`text-[120px] lg:text-[180px] font-black tracking-tighter leading-none tabular-nums drop-shadow-2xl transition-colors ${
                      isActive ? 'text-white' : 'text-text-dark'
                    }`}
                  >
                    {formatTime(timeLeft)}
                  </motion.div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <button 
                    onClick={handleToggle}
                    className={`h-16 px-12 rounded-full font-black text-lg transition-all group relative overflow-hidden ${
                      isActive 
                        ? 'bg-white text-text-dark hover:scale-105' 
                        : 'bg-accent-orange text-white shadow-glow-primary hover:scale-105'
                    }`}
                  >
                    <span className="flex items-center gap-3 relative z-10">
                      <span className="material-symbols-outlined font-black">{isActive ? 'pause' : 'play_arrow'}</span>
                      {isActive ? 'Pause Session' : 'Start Focus Session'}
                    </span>
                  </button>
                  {isActive && (
                    <button 
                      onClick={handleReset}
                      className="h-16 px-12 rounded-full font-black text-lg text-white/40 hover:text-white transition-colors"
                    >
                      Interrupt
                    </button>
                  )}
                </div>
              </div>

              {/* Background Visuals for Active State */}
              <AnimatePresence>
                {isActive && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 pointer-events-none"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-accent-orange/10 to-transparent"></div>
                    <motion.div 
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.1, 0.2, 0.1]
                      }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-orange rounded-full blur-[120px]"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.section>

            {/* Live Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { label: 'Total Deep Work', value: stats?.totalHours || 0, unit: 'Hours', icon: 'timer', color: 'text-accent-purple', bg: 'bg-accent-purple/5' },
                { label: 'Focus Streak', value: stats?.streak || 0, unit: 'Days', icon: 'local_fire_department', color: 'text-accent-orange', bg: 'bg-accent-orange/5' },
                { label: 'Weekly Precision', value: Math.round(stats?.weeklyConsistency || 0), unit: '%', icon: 'bolt', color: 'text-accent-green', bg: 'bg-accent-green/5' },
              ].map((stat, i) => (
                <div key={i} className="bg-white border border-border/40 rounded-[2.5rem] p-10 flex flex-col group hover:shadow-lg transition-all">
                  <div className="flex items-center justify-between mb-10">
                    <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <span className="material-symbols-outlined text-[28px] font-black">{stat.icon}</span>
                    </div>
                    <span className="text-[10px] font-black text-text-muted uppercase tracking-widest opacity-40">{stat.label}</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-text-dark tracking-tighter tabular-nums leading-none">{stat.value}</span>
                    <span className="text-sm font-black text-text-muted uppercase tracking-widest opacity-40">{stat.unit}</span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

        <MobileNav />
      </main>
    </div>
  );
}
