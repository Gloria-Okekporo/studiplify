'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { generateAIProductivityInsights } from '@/lib/actions/insights';
import DashboardSidebar from './Sidebar';
import DashboardHeader from './Header';
import MobileNav from './MobileNav';
import { ToastContainer } from '../Common/Toast';
import { useToast } from '@/hooks/useToast';

export default function AnalyticsClient({ analyticsData }: { analyticsData: any[] }) {
  const { logout, user } = useAuth();
  const { showToast, toasts, removeToast } = useToast();
  const router = useRouter();
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiInsights, setAiInsights] = useState<{insights: string[], recommendations: string[]} | null>(null);

  // Simulated data if analyticsData is empty for demo purposes
  const data = analyticsData.length > 0 ? analyticsData : [
    { date: '2024-05-01', study_time_minutes: 120, tasks_completed: 5, focus_score: 85 },
    { date: '2024-05-02', study_time_minutes: 180, tasks_completed: 8, focus_score: 90 },
    { date: '2024-05-03', study_time_minutes: 90, tasks_completed: 3, focus_score: 70 },
    { date: '2024-05-04', study_time_minutes: 240, tasks_completed: 12, focus_score: 95 },
    { date: '2024-05-05', study_time_minutes: 150, tasks_completed: 6, focus_score: 80 },
    { date: '2024-05-06', study_time_minutes: 200, tasks_completed: 9, focus_score: 88 },
    { date: '2024-05-07', study_time_minutes: 160, tasks_completed: 7, focus_score: 82 },
  ];

  const totalStudyTime = data.reduce((acc, curr) => acc + (curr.study_time_minutes || 0), 0);
  const totalTasks = data.reduce((acc, curr) => acc + (curr.tasks_completed || 0), 0);
  const avgFocus = Math.round(data.reduce((acc, curr) => acc + (curr.focus_score || 0), 0) / data.length);

  const handleGenerateInsights = async () => {
    setIsGenerating(true);
    try {
      const res = await generateAIProductivityInsights();
      if (res.success) {
        setAiInsights(res.data);
        showToast("Personal insights generated!", "success");
      } else {
        showToast("Could not generate insights.", "error");
      }
    } catch (error) {
      showToast("An unexpected error occurred.", "error");
    } finally {
      setIsGenerating(false);
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
        
        <DashboardHeader title="Analytics" badge="Daily Sync Active" />

        <div className="flex-1 overflow-y-auto hide-scrollbar">
          <div className="max-w-[1400px] mx-auto px-8 lg:px-12 py-8 space-y-12">
            
            {/* AI Insights Section */}
            <motion.section 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-surface-dim rounded-[3rem] p-10 lg:p-14 border border-border/30 relative overflow-hidden"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 relative z-10">
                <div className="space-y-6 max-w-2xl">
                  <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-accent-purple/10 text-accent-purple rounded-full text-[11px] font-black uppercase tracking-widest border border-accent-purple/20">
                    <span className="material-symbols-outlined text-[16px] font-bold">psychology</span>
                    AI Study Intel
                  </div>
                  <h2 className="text-4xl lg:text-5xl font-black text-text-dark tracking-tighter leading-none">
                    Performance Analysis
                  </h2>
                  <p className="text-lg font-medium text-text-muted opacity-80 leading-relaxed">
                    Our AI analyzes your study habits, focus sessions, and task velocity to provide personalized growth paths.
                  </p>
                </div>
                
                <button 
                  onClick={handleGenerateInsights}
                  disabled={isGenerating}
                  className="btn-primary !h-16 !px-12 !text-lg group shrink-0"
                >
                  {isGenerating ? 'Analyzing Flow...' : 'Generate New Insights'}
                  <span className="material-symbols-outlined group-hover:rotate-12 transition-transform">bolt</span>
                </button>
              </div>

              <AnimatePresence>
                {aiInsights && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-12 pt-12 border-t border-border/30 grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10"
                  >
                    <div className="space-y-6">
                      <h3 className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] opacity-60">Personal Insights</h3>
                      <ul className="space-y-4">
                        {aiInsights.insights.map((insight, i) => (
                          <motion.li 
                            key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                            className="flex gap-4 items-start"
                          >
                            <span className="material-symbols-outlined text-accent-green font-bold">check_circle</span>
                            <p className="text-sm font-bold text-text-dark opacity-90">{insight}</p>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-6">
                      <h3 className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] opacity-60">Growth Recommendations</h3>
                      <div className="space-y-4">
                        {aiInsights.recommendations.map((rec, i) => (
                          <motion.div 
                            key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                            className="p-5 bg-white border border-border/40 rounded-2xl shadow-sm flex gap-4 items-center"
                          >
                            <div className="w-10 h-10 rounded-xl bg-accent-orange/10 text-accent-orange flex items-center justify-center shrink-0">
                              <span className="material-symbols-outlined font-bold">lightbulb</span>
                            </div>
                            <p className="text-sm font-bold text-text-dark">{rec}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Decorative Background Orb */}
              <div className="absolute -right-20 -bottom-20 w-[400px] h-[400px] bg-accent-purple/[0.05] rounded-full blur-[100px] pointer-events-none"></div>
            </motion.section>

            {/* KPI GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { label: 'Study Time', value: `${Math.floor(totalStudyTime / 60)}h ${totalStudyTime % 60}m`, icon: 'timer', color: 'text-accent-purple', bg: 'bg-accent-purple/5' },
                { label: 'Tasks Done', value: totalTasks, icon: 'check_circle', color: 'text-accent-green', bg: 'bg-accent-green/5' },
                { label: 'Avg Focus', value: `${avgFocus}%`, icon: 'bolt', color: 'text-accent-orange', bg: 'bg-accent-orange/5' },
              ].map((kpi, i) => (
                <div key={i} className="bg-white border border-border/40 rounded-[2.5rem] p-10 flex flex-col group hover:shadow-lg transition-all">
                  <div className={`w-14 h-14 rounded-2xl ${kpi.bg} ${kpi.color} flex items-center justify-center mb-10 group-hover:scale-110 transition-transform`}>
                    <span className="material-symbols-outlined text-[28px] font-black">{kpi.icon}</span>
                  </div>
                  <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 opacity-40">{kpi.label}</p>
                  <h3 className="text-4xl font-black text-text-dark tracking-tighter tabular-nums leading-none">{kpi.value}</h3>
                </div>
              ))}
            </div>

            {/* Main Visualizations Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Daily Study Distribution */}
              <div className="lg:col-span-8 bg-white border border-border/40 rounded-[3rem] p-10 lg:p-14 relative overflow-hidden group">
                <div className="flex items-center justify-between mb-16">
                  <div>
                    <h3 className="text-2xl font-black text-text-dark tracking-tighter">Study Distribution</h3>
                    <p className="text-sm font-medium text-text-muted opacity-60">Daily study minutes for the last 7 days.</p>
                  </div>
                </div>
                
                <div className="h-80 flex items-end justify-between gap-4 px-4">
                  {data.map((item, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-6 group/bar h-full justify-end">
                      <div className="w-full relative flex flex-col items-center justify-end h-full">
                        <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height: `${(item.study_time_minutes / 240) * 100}%` }}
                          transition={{ delay: 0.2 + i * 0.05, duration: 1 }}
                          className={`w-full max-w-[48px] rounded-full transition-all ${item.study_time_minutes > 180 ? 'bg-accent-orange shadow-glow-orange' : 'bg-surface-muted hover:bg-accent-orange/30'}`}
                        />
                      </div>
                      <span className="text-[10px] font-black text-text-muted uppercase tracking-widest group-hover/bar:text-text-dark transition-colors">
                        {new Date(item.date).toLocaleDateString(undefined, { weekday: 'short' })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Consistency Meter */}
              <div className="lg:col-span-4 bg-white border border-border/40 rounded-[3rem] p-10 flex flex-col justify-between relative overflow-hidden">
                <div className="mb-14">
                  <h3 className="text-2xl font-black text-text-dark tracking-tighter">Focus Pulse</h3>
                  <p className="text-sm font-medium text-text-muted opacity-60">Weekly concentration quality.</p>
                </div>
                
                <div className="flex-1 flex flex-col justify-center gap-8">
                  {data.slice(-4).map((item, i) => (
                    <div key={i} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-text-dark uppercase tracking-widest opacity-60">
                          {new Date(item.date).toLocaleDateString(undefined, { weekday: 'long' })}
                        </span>
                        <span className="text-lg font-black text-accent-orange">{item.focus_score}%</span>
                      </div>
                      <div className="h-3 bg-surface-dim rounded-full overflow-hidden p-[2px]">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${item.focus_score}%` }}
                          transition={{ delay: 0.5 + i * 0.1, duration: 1 }}
                          className="h-full bg-accent-orange rounded-full shadow-glow-orange/20"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>

        <ToastContainer toasts={toasts} onRemove={removeToast} />
        <MobileNav />
      </main>
    </div>
  );
}
