'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { generateStudyPlan } from '@/lib/actions/aiPlanner';
import { useToast } from '@/hooks/useToast';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import DashboardSidebar from './Sidebar';
import DashboardHeader from './Header';
import MobileNav from './MobileNav';
import { ToastContainer } from '../Common/Toast';

export default function AIPlannerClient({ studyPlans }: { studyPlans: any[] }) {
  const { logout, user } = useAuth();
  const { showToast, toasts, removeToast } = useToast();
  const router = useRouter();

  const [formData, setFormData] = useState({
    subjects: '',
    examDate: '',
    studyHours: 4,
    weakSubjects: '',
    learningGoals: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [showGenerator, setShowGenerator] = useState(studyPlans.length === 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subjects || !formData.examDate) {
      showToast('Please fill in required fields', 'error');
      return;
    }

    setIsGenerating(true);
    try {
      const res = await generateStudyPlan(formData);
      if (res.success) {
        showToast('AI Study Plan generated successfully!', 'success');
        setShowGenerator(false);
        router.refresh();
      } else {
        showToast(res.error || 'Failed to generate plan', 'error');
      }
    } catch (error) {
      showToast('An unexpected error occurred', 'error');
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

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative bg-background">
        
        <DashboardHeader 
          title="Study Planner" 
          badge="Synced" 
          badgeColor="bg-accent-purple" 
        />

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto hide-scrollbar">
          <div className="max-w-[1400px] mx-auto px-8 lg:px-12 py-8 space-y-8">
            
            <AnimatePresence mode="wait">
              {showGenerator ? (
                /* AI GENERATOR FORM (Matches Screenshot 2) */
                <motion.div 
                  key="generator"
                  initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-surface-dim rounded-[3rem] p-10 lg:p-14 border border-border/30 relative overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-12">
                    <div className="space-y-6 max-w-2xl">
                      <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-accent-orange/10 text-accent-orange rounded-full text-[11px] font-black uppercase tracking-widest border border-accent-orange/20">
                        <span className="material-symbols-outlined text-[16px] font-bold">psychology</span>
                        Neural Engine
                      </div>
                      <h2 className="text-5xl lg:text-6xl font-black text-text-dark tracking-tighter leading-none">
                        Generate Your Path
                      </h2>
                      <p className="text-lg font-medium text-text-muted opacity-80 leading-relaxed">
                        Provide your parameters to instantly construct an optimized, workload-balanced study schedule.
                      </p>
                    </div>
                    
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowGenerator(false)}
                      className="bg-accent-orange text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-glow-orange hover:bg-accent-orange/90 transition-all flex items-center gap-3"
                    >
                      <span className="material-symbols-outlined text-lg">close</span>
                      Close AI Planner
                    </motion.button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-2">Subjects (Comma Separated)*</label>
                        <input 
                          type="text" 
                          required
                          placeholder="Math, Physics, Biology"
                          value={formData.subjects}
                          onChange={e => setFormData({...formData, subjects: e.target.value})}
                          className="w-full h-16 bg-white border border-border/60 rounded-[1.5rem] px-8 font-medium text-text-dark focus:border-accent-orange outline-none transition-all"
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-2">Exam Date*</label>
                        <input 
                          type="date" 
                          required
                          value={formData.examDate}
                          onChange={e => setFormData({...formData, examDate: e.target.value})}
                          className="w-full h-16 bg-white border border-border/60 rounded-[1.5rem] px-8 font-medium text-text-dark focus:border-accent-orange outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-2">Daily Study Hours</label>
                        <div className="relative flex items-center">
                          <input 
                            type="range" 
                            min="1" max="12" step="1"
                            value={formData.studyHours}
                            onChange={e => setFormData({...formData, studyHours: parseInt(e.target.value)})}
                            className="w-full h-2 bg-white border border-border/30 rounded-full appearance-none cursor-pointer accent-accent-orange"
                          />
                          <span className="absolute -right-16 font-black text-accent-orange">{formData.studyHours}h</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-2">Weak Subjects</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Organic Chemistry"
                          value={formData.weakSubjects}
                          onChange={e => setFormData({...formData, weakSubjects: e.target.value})}
                          className="w-full h-16 bg-white border border-border/60 rounded-[1.5rem] px-8 font-medium text-text-dark focus:border-accent-orange outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="pt-6">
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit" 
                        disabled={isGenerating}
                        className="btn-primary !h-16 !px-12 !text-lg group"
                      >
                        {isGenerating ? 'Synthesizing...' : 'Architect My Plan'}
                        <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">bolt</span>
                      </motion.button>
                    </div>
                  </form>
                </motion.div>
              ) : (
                /* PLANNER DASHBOARD VIEW (Already exists, but we'll clean it up) */
                <motion.div key="planner" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
                   <div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-black text-text-dark tracking-tighter">Your Active Plans</h3>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowGenerator(true)}
                      className="btn-secondary !h-12 !px-8 flex items-center gap-3"
                    >
                      <span className="material-symbols-outlined">add</span>
                      New AI Plan
                    </motion.button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {studyPlans.map((plan) => (
                      <motion.div 
                        key={plan.id} 
                        whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-white border border-border/40 rounded-[2.5rem] p-8 transition-all group cursor-pointer"
                      >
                        <motion.div 
                          whileHover={{ rotate: 12 }}
                          className="w-14 h-14 rounded-2xl bg-accent-orange/10 flex items-center justify-center text-accent-orange mb-6 transition-transform"
                        >
                          <span className="material-symbols-outlined text-[28px] font-black">event_note</span>
                        </motion.div>
                        <h4 className="text-xl font-black text-text-dark tracking-tighter mb-2">{plan.title || 'Custom Study Plan'}</h4>
                        <p className="text-sm font-medium text-text-muted opacity-60 mb-6">Generated on {new Date(plan.created_at).toLocaleDateString()}</p>
                        <div className="flex items-center gap-3 text-accent-orange font-black text-[10px] uppercase tracking-widest group-hover:gap-5 transition-all">
                          View Timeline <span className="material-symbols-outlined text-[16px] font-black">arrow_forward</span>
                        </div>
                      </motion.div>
                    ))}
                    {studyPlans.length === 0 && (
                      <div className="col-span-full py-20 flex flex-col items-center justify-center text-center opacity-30">
                        <span className="material-symbols-outlined text-[64px] mb-4">event_busy</span>
                        <p className="text-lg font-black uppercase tracking-widest">No plans yet</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>
        <ToastContainer toasts={toasts} onRemove={removeToast} />
        <MobileNav />
      </main>
    </div>
  );
}
