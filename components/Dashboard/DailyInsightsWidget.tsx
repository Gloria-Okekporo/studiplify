'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { getLatestPersonalizedInsight, generatePersonalizedAIInsight } from '@/lib/actions/insights';
import { useToast } from '@/hooks/useToast';

export default function DailyInsightsWidget({ initialInsight = null }: { initialInsight?: any }) {
  const [insight, setInsight] = useState<any>(initialInsight);
  const [loading, setLoading] = useState(!initialInsight);
  const [isGenerating, setIsGenerating] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);
  const supabase = createClientComponentClient();
  const { showToast } = useToast();

  const fetchInsight = async () => {
    setLoading(true);
    const res = await getLatestPersonalizedInsight();
    if (res.success) {
      setInsight(res.data);
    } else {
      setDbError(res.message || 'Connection failed');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!initialInsight) {
      fetchInsight();
    }

    const channel = supabase
      .channel('personalized-insights')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'daily_ai_insights' 
      }, () => {
        fetchInsight();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await generatePersonalizedAIInsight();
      if (res.success) {
        showToast("Intelligence update complete!", "success");
      } else {
        showToast(res.message || "Failed to generate engine update.", "error");
      }
    } catch (error) {
      showToast("Neural sync failed.", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-28 bg-white/40 backdrop-blur-md rounded-[2.5rem] border border-white/60 flex items-center justify-center gap-4 shadow-soft">
        <div className="w-5 h-5 border-2 border-accent-orange border-t-transparent rounded-full animate-spin" />
        <span className="text-[10px] font-black text-text-dark/40 uppercase tracking-widest">Orchestrating Neural Pulse...</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {insight ? (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="group relative w-full p-8 lg:p-10 rounded-[3rem] overflow-hidden transition-all shadow-soft-xl border border-white/80"
          >
            {/* Real Glassmorphism Card */}
            <div className="absolute inset-0 bg-white/60 backdrop-blur-xl z-0" />
            
            <div className="relative z-10 space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                    insight.insight?.insight_type === 'focus' ? 'bg-accent-orange/10 text-accent-orange border-accent-orange/20' : 
                    insight.insight?.insight_type === 'knowledge' ? 'bg-accent-green/10 text-accent-green border-accent-green/20' :
                    'bg-accent-purple/10 text-accent-purple border-accent-purple/20'
                  }`}>
                    <span className="material-symbols-outlined text-[16px] font-black">
                      {insight.insight?.insight_type === 'focus' ? 'bolt' : 
                       insight.insight?.insight_type === 'knowledge' ? 'school' : 'psychology'}
                    </span>
                    Daily AI Insight
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-accent-green/10 rounded-full border border-accent-green/20">
                    <div className="w-1.5 h-1.5 bg-accent-green rounded-full animate-pulse shadow-glow-green" />
                    <span className="text-[9px] font-black text-accent-green uppercase tracking-widest">Neural Sync active</span>
                  </div>
                </div>
                <div className="text-[10px] font-black text-text-muted/60 uppercase tracking-[0.2em] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[14px]">schedule</span>
                  {new Date(insight.created_at).toLocaleDateString()} at {new Date(insight.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl lg:text-3xl font-black text-text-dark tracking-tighter leading-tight group-hover:text-accent-orange transition-colors mb-4">
                    {insight.insight?.title || 'Daily Evolution'}
                  </h3>
                  <div className="p-6 bg-white/40 rounded-[2rem] border border-white/60 space-y-4">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-accent-orange/10 flex items-center justify-center text-accent-orange shrink-0">
                        <span className="material-symbols-outlined text-[20px] font-bold">lightbulb</span>
                      </div>
                      <p className="text-[16px] font-medium text-text-dark/90 leading-relaxed">
                        {insight.insight?.today_insight || insight.insight?.insight}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Productivity Recommendation */}
                  <div className="p-6 bg-accent-purple/5 rounded-[2rem] border border-accent-purple/10 space-y-3">
                    <div className="flex items-center gap-2 text-accent-purple">
                      <span className="material-symbols-outlined text-[18px] font-black">rocket_launch</span>
                      <span className="text-[10px] font-black uppercase tracking-widest">Recommendation</span>
                    </div>
                    <p className="text-sm font-semibold text-text-dark/80 leading-relaxed">
                      {insight.insight?.productivity_recommendation || "Maintain your current focus blocks for optimal retention."}
                    </p>
                  </div>

                  {/* Consistency Feedback */}
                  <div className="p-6 bg-accent-green/5 rounded-[2rem] border border-accent-green/10 space-y-3">
                    <div className="flex items-center gap-2 text-accent-green">
                      <span className="material-symbols-outlined text-[18px] font-black">analytics</span>
                      <span className="text-[10px] font-black uppercase tracking-widest">Consistency</span>
                    </div>
                    <p className="text-sm font-semibold text-text-dark/80 leading-relaxed">
                      {insight.insight?.consistency_feedback || "Your study streak is stabilizing. Keep the momentum!"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6 flex items-center justify-between border-t border-border/10">
                <div onClick={handleGenerate} className="flex items-center gap-4 text-[10px] font-black text-accent-orange uppercase tracking-[0.3em] opacity-60 group-hover:opacity-100 group-hover:gap-6 transition-all cursor-pointer">
                  {isGenerating ? 'Recalculating Patterns...' : 'Refresh AI Analysis'} 
                  <span className={`material-symbols-outlined text-[18px] font-black ${isGenerating ? 'animate-spin' : ''}`}>
                    {isGenerating ? 'sync' : 'arrow_forward'}
                  </span>
                </div>
                <span className="text-[9px] font-black text-text-muted uppercase tracking-widest opacity-30">
                  REF: {insight.id.slice(0, 8)}
                </span>
              </div>
            </div>

            {/* Subtle Illustration background */}
            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-accent-orange/[0.04] rounded-full blur-[60px] pointer-events-none group-hover:scale-125 transition-transform duration-1000" />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full relative p-10 lg:p-14 rounded-[3.5rem] overflow-hidden shadow-soft-xl group"
          >
            <div className="absolute inset-0 bg-white/50 backdrop-blur-xl border border-white/80 z-0" />
            
            <div className="relative z-10 flex flex-col items-center text-center space-y-10">
              <div className="relative">
                <div className="w-20 h-20 rounded-[2.2rem] bg-white border border-border/40 shadow-soft-lg flex items-center justify-center text-accent-orange">
                  <span className="material-symbols-outlined text-[40px] font-bold">psychology</span>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent-orange text-white rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                  <span className="material-symbols-outlined text-[16px] font-black animate-pulse">bolt</span>
                </div>
              </div>

              <div className="space-y-4 max-w-lg">
                <h4 className="text-3xl font-black text-text-dark tracking-tighter leading-none">AI Study Engine Ready</h4>
                <p className="text-base font-medium text-text-dark/60 leading-relaxed">
                  The automation will populate this once your first study circle completes. Click below to initialize your personalized performance profile.
                </p>
              </div>

              <button 
                onClick={handleGenerate}
                disabled={isGenerating}
                className="btn-primary !h-16 !px-12 !text-lg !rounded-full shadow-glow-primary flex items-center gap-3 transition-all"
              >
                {isGenerating ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span className="material-symbols-outlined font-black">bolt</span>
                )}
                {isGenerating ? 'Orchestrating Pulse...' : 'Generate Personalized Insight'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
