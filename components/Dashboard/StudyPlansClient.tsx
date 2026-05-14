'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateAIStudyPlan, updatePlanProgress, deleteStudyPlan } from '@/lib/actions/studyPlans';
import { useToast } from '@/hooks/useToast';
import DashboardSidebar from './Sidebar';
import DashboardHeader from './Header';
import MobileNav from './MobileNav';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { ToastContainer } from '@/components/Common/Toast';
import Link from 'next/link';

export default function StudyPlansClient({ initialPlans }: { initialPlans: any[] }) {
  const { user, logout } = useAuth();
  const { showToast, toasts, removeToast } = useToast();
  const router = useRouter();
  const [plans, setPlans] = useState(initialPlans);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showNewPlanModal, setShowNewPlanModal] = useState(false);

  // Sync state when server data changes (e.g. after revalidatePath)
  React.useEffect(() => {
    setPlans(initialPlans);
  }, [initialPlans]);

  const handleCreatePlan = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsGenerating(true);
    const formData = new FormData(e.currentTarget);
    const subject = formData.get('subject') as string;
    const difficulty = formData.get('difficulty') as string;

    try {
      const res = await generateAIStudyPlan(subject, difficulty);
      if (res.success && res.data) {
        setPlans([res.data, ...plans]);
        setShowNewPlanModal(false);
        showToast("AI Study Plan initialized!", "success");
      } else {
        showToast(res.error || "Failed to generate plan.", "error");
      }
    } catch (error) {
      showToast("Neural sync failed.", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUpdateProgress = async (id: string, current: number) => {
    const nextProgress = Math.min(100, current + 10);
    try {
      const res = await updatePlanProgress(id, nextProgress);
      if (res.success) {
        setPlans(plans.map(p => p.id === id ? { ...p, progress: nextProgress } : p));
        showToast("Progress captured.", "success");
      }
    } catch (error) {
      showToast("Failed to update progress.", "error");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to archive this plan?")) return;
    try {
      const res = await deleteStudyPlan(id);
      if (res.success) {
        setPlans(plans.filter(p => p.id !== id));
        showToast("Plan archived.", "info");
      }
    } catch (error) {
      showToast("Failed to archive plan.", "error");
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
        
        <DashboardHeader title="Study Plans" badge={`${plans.length} Active`} />

        <div className="flex-1 overflow-y-auto hide-scrollbar">
          <div className="max-w-[1400px] mx-auto px-8 lg:px-12 py-8 space-y-12">
            
            {/* Hero Section */}
            <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-accent-orange/10 text-accent-orange rounded-full text-[11px] font-black uppercase tracking-widest border border-accent-orange/20">
                  <span className="material-symbols-outlined text-[16px] font-bold">auto_awesome</span>
                  AI Goal Orchestration
                </div>
                <h2 className="text-4xl lg:text-5xl font-black text-text-dark tracking-tighter leading-none">
                  Your Academic Roadmaps
                </h2>
                <p className="text-lg font-medium text-text-muted opacity-80 max-w-xl leading-relaxed">
                  Generate personalized, AI-driven study schedules tailored to your exams and learning goals.
                </p>
              </div>
              <button 
                onClick={() => setShowNewPlanModal(true)}
                className="btn-primary !h-16 !px-12 !text-lg shadow-glow-primary group shrink-0"
              >
                Initialize New Goal
                <span className="material-symbols-outlined group-hover:rotate-12 transition-transform">bolt</span>
              </button>
            </section>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-32">
              <AnimatePresence mode="popLayout">
                {plans.map((plan) => (
                  <motion.div 
                    key={plan.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white border border-border/40 rounded-[3rem] p-10 lg:p-12 relative overflow-hidden group shadow-soft hover:shadow-lg transition-all"
                  >
                    <div className="relative z-10 space-y-10">
                      <div className="flex items-start justify-between">
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                              plan.difficulty === 'Expert' ? 'bg-red-50 text-red-500 border-red-100' :
                              plan.difficulty === 'Advanced' ? 'bg-accent-orange/10 text-accent-orange border-accent-orange/20' :
                              'bg-accent-green/10 text-accent-green border-accent-green/20'
                            }`}>
                              {plan.difficulty || 'Standard'}
                            </span>
                          </div>
                          <h3 className="text-3xl font-black text-text-dark tracking-tighter leading-none">{plan.title}</h3>
                        </div>
                        <button 
                          onClick={() => handleDelete(plan.id)}
                          className="w-12 h-12 rounded-2xl bg-surface-dim flex items-center justify-center text-text-muted hover:bg-red-50 hover:text-red-500 transition-all"
                        >
                          <span className="material-symbols-outlined text-[20px]">archive</span>
                        </button>
                      </div>


                      <div className="bg-surface-dim rounded-3xl p-6 border border-border/30">
                        <p className="text-[13px] font-bold text-text-dark/80 leading-relaxed italic">
                          "{plan.description}"
                        </p>
                      </div>

                      <div className="flex items-center justify-between gap-4 pt-4">
                        <Link 
                          href={`/dashboard/study-plan/${plan.id}`}
                          className="flex-1 h-14 rounded-2xl border border-border/40 font-black text-[11px] uppercase tracking-widest hover:bg-surface-dim transition-all flex items-center justify-center"
                        >
                          View Full Schedule
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

          </div>
        </div>

        {/* New Plan Modal */}
        <AnimatePresence>
          {showNewPlanModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowNewPlanModal(false)}
                className="absolute inset-0 bg-text-dark/40 backdrop-blur-md"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="relative z-10 bg-white w-full max-w-lg rounded-[3.5rem] p-10 lg:p-14 shadow-soft-2xl border border-white/60 overflow-hidden"
              >
                <div className="mb-10 text-center">
                  <div className="w-20 h-20 bg-accent-orange/10 text-accent-orange rounded-[2.2rem] flex items-center justify-center mx-auto mb-6">
                    <span className="material-symbols-outlined text-[40px] font-black">auto_awesome</span>
                  </div>
                  <h3 className="text-4xl font-black text-text-dark tracking-tighter leading-none mb-3">Goal Initialization</h3>
                  <p className="text-text-muted font-medium">Let AI architect your study roadmap.</p>
                </div>

                <form onSubmit={handleCreatePlan} className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-text-muted px-2">Subject / Topic</label>
                    <input 
                      name="subject" 
                      required 
                      placeholder="e.g., Organic Chemistry Finals"
                      className="w-full h-16 bg-surface-dim border border-border/30 rounded-2xl px-6 font-medium focus:ring-2 focus:ring-accent-orange/20 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-text-muted px-2">Complexity Level</label>
                    <div className="relative">
                      <select 
                        name="difficulty" 
                        className="w-full h-16 bg-surface-dim border border-border/30 rounded-2xl px-6 font-medium focus:ring-2 focus:ring-accent-orange/20 outline-none appearance-none"
                      >
                        <option value="Beginner">Beginner (Foundation)</option>
                        <option value="Intermediate">Intermediate (Core)</option>
                        <option value="Advanced">Advanced (Expertise)</option>
                        <option value="Expert">Expert (Mastery)</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">expand_more</span>
                    </div>
                  </div>
                  <button 
                    type="submit"
                    disabled={isGenerating}
                    className="w-full btn-primary h-18 text-xl group"
                  >
                    {isGenerating ? 'Architecting Plan...' : 'Generate Roadmap'}
                    <span className="material-symbols-outlined group-hover:rotate-12 transition-transform">bolt</span>
                  </button>
                </form>

                <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-accent-orange/[0.04] rounded-full blur-[60px] pointer-events-none" />
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <MobileNav />
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </main>
    </div>
  );
}
