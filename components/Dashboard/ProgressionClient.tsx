'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getProgressionData, ProgressionData, Achievement } from '@/lib/actions/progression';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import DashboardSidebar from './Sidebar';
import DashboardHeader from './Header';
import MobileNav from './MobileNav';
import { ToastContainer } from '../Common/Toast';
import { useToast } from '@/hooks/useToast';

export default function ProgressionClient({ initialData }: { initialData: ProgressionData }) {
  const { user, logout } = useAuth();
  const { showToast, toasts, removeToast } = useToast();
  const router = useRouter();
  const [data, setData] = useState<ProgressionData>(initialData);
  const [loading, setLoading] = useState(false);

  const progressPercentage = (data.currentLevelXP / data.totalXPForNextLevel) * 100;

  const handleSignOut = async () => {
    await logout();
    router.push('/auth/login');
  };

  const getRankName = (level: number) => {
    if (level < 5) return 'Novice Scholar';
    if (level < 10) return 'Knowledge Seeker';
    if (level < 20) return 'Focus Specialist';
    if (level < 50) return 'Academic Elite';
    return 'Master Polymath';
  };

  return (
    <div className="flex h-screen bg-background text-text-dark font-body selection:bg-accent-orange/30 selection:text-text-dark overflow-hidden">
      
      <DashboardSidebar user={user} onSignOut={handleSignOut} />

      <main className="flex-1 flex flex-col h-full overflow-hidden relative bg-background">
        
        <DashboardHeader title="Rank & Progression" badge={`Level ${data.level}`} badgeColor="bg-accent-purple" />

        <div className="flex-1 overflow-y-auto hide-scrollbar">
          <div className="max-w-[1400px] mx-auto px-8 lg:px-12 py-8 space-y-12">
            
            {/* Level Hero Section */}
            <motion.section 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-text-dark text-white rounded-[3rem] p-10 lg:p-14 border border-border/10 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12"
            >
              <div className="relative z-10 space-y-8 flex-1">
                <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-white/10 text-white rounded-full text-[11px] font-black uppercase tracking-widest border border-white/10">
                  <span className="material-symbols-outlined text-[16px] font-bold">military_tech</span>
                  Current Standing
                </div>
                <div>
                  <h2 className="text-5xl lg:text-7xl font-black tracking-tighter leading-none mb-4">
                    {getRankName(data.level)}
                  </h2>
                  <p className="text-xl font-medium text-white/60">
                    Level {data.level} • {data.xp.toLocaleString()} Total XP
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between px-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Next Rank Progress</span>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">{Math.round(data.xpToNextLevel).toLocaleString()} XP to Level {data.level + 1}</span>
                  </div>
                  <div className="h-4 bg-white/5 rounded-full overflow-hidden p-1 border border-white/5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercentage}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="h-full bg-accent-orange rounded-full shadow-glow-orange"
                    />
                  </div>
                </div>
              </div>

              {/* Giant Level Indicator */}
              <div className="relative w-64 h-64 lg:w-80 lg:h-80 flex items-center justify-center shrink-0">
                <svg className="absolute inset-0 w-full h-full -rotate-90 opacity-20">
                  <circle cx="50%" cy="50%" r="44%" fill="transparent" stroke="white" strokeWidth="2" strokeDasharray="10,10" />
                </svg>
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-48 h-48 lg:w-56 lg:h-56 rounded-full bg-gradient-to-br from-white/10 to-transparent border border-white/10 flex items-center justify-center shadow-2xl relative group"
                >
                  <div className="absolute inset-4 rounded-full border border-accent-orange/30 animate-pulse-glow" />
                  <span className="text-7xl lg:text-8xl font-black tracking-tighter text-white drop-shadow-xl">{data.level}</span>
                </motion.div>
              </div>

              <div className="absolute -left-20 -top-20 w-[400px] h-[400px] bg-accent-orange/[0.1] rounded-full blur-[100px] pointer-events-none"></div>
            </motion.section>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { label: 'Current Streak', value: data.streak, unit: 'Days', icon: 'local_fire_department', color: 'text-accent-orange', bg: 'bg-accent-orange/5' },
                { label: 'Tasks Mastered', value: data.totalTasks, unit: 'Completed', icon: 'verified', color: 'text-accent-green', bg: 'bg-accent-green/5' },
                { label: 'Focus Intensity', value: data.totalFocusHours, unit: 'Hours', icon: 'bolt', color: 'text-accent-purple', bg: 'bg-accent-purple/5' }
              ].map((stat, i) => (
                <div key={i} className="bg-white border border-border/40 rounded-[2.5rem] p-10 flex flex-col hover:shadow-lg transition-all group">
                  <div className="flex items-center justify-between mb-10">
                    <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <span className="material-symbols-outlined text-[28px] font-black">{stat.icon}</span>
                    </div>
                    <span className="text-[10px] font-black text-text-muted uppercase tracking-widest opacity-40">{stat.label}</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-text-dark tracking-tighter tabular-nums">{stat.value}</span>
                    <span className="text-sm font-black text-text-muted uppercase tracking-widest opacity-40">{stat.unit}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Achievements Collection */}
            <section className="space-y-8">
              <div className="flex items-center justify-between px-4">
                <div>
                  <h3 className="text-3xl font-black text-text-dark tracking-tighter">Achievement Vault</h3>
                  <p className="text-sm font-medium text-text-muted opacity-60">Milestones of your academic journey.</p>
                </div>
                <div className="px-6 py-2 bg-surface-dim rounded-full border border-border/40 text-[11px] font-black text-text-muted uppercase tracking-widest">
                  {data.achievements.filter(a => a.unlocked).length} / {data.achievements.length} Unlocked
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.achievements.map((achievement, i) => (
                  <motion.div 
                    key={achievement.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className={`p-8 rounded-[2rem] border transition-all relative overflow-hidden group ${
                      achievement.unlocked 
                        ? 'bg-white border-border/40 hover:shadow-md' 
                        : 'bg-surface-dim/30 border-dashed border-border/60 grayscale'
                    }`}
                  >
                    {!achievement.unlocked && (
                      <div className="absolute inset-0 flex items-center justify-center z-10 bg-surface-dim/40 backdrop-blur-[2px]">
                         <span className="material-symbols-outlined text-text-muted/40 text-[32px]">lock</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-6 relative z-10">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${
                        achievement.unlocked ? 'bg-accent-orange/10 text-accent-orange' : 'bg-text-muted/10 text-text-muted'
                      }`}>
                        <span className="material-symbols-outlined text-[32px] font-black">{achievement.icon}</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-text-dark tracking-tight leading-none mb-2">{achievement.title}</h4>
                        <p className="text-[13px] font-medium text-text-muted leading-tight opacity-70">{achievement.description}</p>
                      </div>
                    </div>

                    {achievement.unlocked && (
                      <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-accent-orange/[0.03] rounded-full blur-[20px]" />
                    )}
                  </motion.div>
                ))}
              </div>
            </section>

          </div>
        </div>

        <ToastContainer toasts={toasts} onRemove={removeToast} />
        <MobileNav />
      </main>
    </div>
  );
}
