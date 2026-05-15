'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateAIQuiz, saveQuizResult } from '@/lib/actions/quizzes';
import { useToast } from '@/hooks/useToast';
import DashboardSidebar from './Sidebar';
import DashboardHeader from './Header';
import MobileNav from './MobileNav';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function QuizClient({ initialQuizzes }: { initialQuizzes: any[] }) {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const [quizzes, setQuizzes] = useState(initialQuizzes);
  const [activeQuiz, setActiveQuiz] = useState<any>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [showStartModal, setShowStartModal] = useState(false);

  const handleCreateQuiz = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsGenerating(true);
    const formData = new FormData(e.currentTarget);
    const topic = formData.get('topic') as string;
    const notes = formData.get('notes') as string;

    try {
      const res = await generateAIQuiz(topic, notes);
      if (res.success) {
        setActiveQuiz(res.data);
        setCurrentQuestionIndex(0);
        setSelectedAnswers([]);
        setIsFinished(false);
        setShowStartModal(false);
        showToast("Neural Quiz generated!", "success");
      } else {
        showToast(res.error || "Failed to generate quiz.", "error");
      }
    } catch (error) {
      showToast("Neural sync failed.", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnswerSelect = (index: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = index;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < activeQuiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    let correctCount = 0;
    activeQuiz.questions.forEach((q: any, i: number) => {
      if (selectedAnswers[i] === q.correctAnswer) correctCount++;
    });

    const finalScore = Math.round((correctCount / activeQuiz.questions.length) * 100);
    
    try {
      await saveQuizResult(activeQuiz.id, finalScore);
      setQuizzes([{ ...activeQuiz, score: finalScore }, ...quizzes]);
      setIsFinished(true);
    } catch (error) {
      showToast("Failed to save result permanently, but here are your results.", "error");
      setIsFinished(true); // Still show results even if saving failed
    }
  };

  const handleReviewPastQuiz = (quiz: any) => {
    // Reconstruct selected answers if possible, or just show the quiz questions
    // Since we don't store individual answers in the DB (only the score), 
    // we can only show the questions and correct answers for historical quizzes.
    // However, if we want to show 'Review', we need to adapt the view.
    setActiveQuiz(quiz);
    setIsFinished(true);
    // For historical quizzes, we might not have the user's specific answers saved.
    // Let's assume for now we just show the correct ones or leave them blank.
    setSelectedAnswers([]); 
  };

  const handleSignOut = async () => {
    await logout();
    router.push('/auth/login');
  };

  return (
    <div className="flex h-screen bg-background text-text-dark font-body selection:bg-accent-orange/30 selection:text-text-dark overflow-hidden">
      <DashboardSidebar user={user} onSignOut={handleSignOut} />

      <main className="flex-1 flex flex-col h-full overflow-hidden relative bg-background">
        <DashboardHeader title="AI Quizzes" badge={`${quizzes.length} Attempts`} />

        <div className="flex-1 overflow-y-auto hide-scrollbar">
          <div className="max-w-[1400px] mx-auto px-8 lg:px-12 py-8 space-y-12 pb-32">

            {/* Hero Section */}
            {!activeQuiz && (
              <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-accent-green/10 text-accent-green rounded-full text-[11px] font-black uppercase tracking-widest border border-accent-green/20">
                    <span className="material-symbols-outlined text-[16px] font-bold">psychology</span>
                    Knowledge Pulse
                  </div>
                  <h2 className="text-4xl lg:text-5xl font-black text-text-dark tracking-tighter leading-none">
                    Intelligence Assessment
                  </h2>
                  <p className="text-lg font-medium text-text-muted opacity-80 max-w-xl leading-relaxed">
                    Generate instant assessments from your notes or topics to solidify your mastery.
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowStartModal(true)}
                  className="btn-primary !h-16 !px-12 !text-lg shadow-glow-primary group shrink-0"
                >
                  Generate New Quiz
                  <span className="material-symbols-outlined group-hover:rotate-12 transition-transform">bolt</span>
                </motion.button>
              </section>
            )}

            {/* Quiz Active View */}
            <AnimatePresence mode="wait">
              {activeQuiz ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="max-w-4xl mx-auto w-full"
                >
                  {!isFinished ? (
                    <div className="bg-white border border-border/40 rounded-[3.5rem] p-10 lg:p-16 shadow-soft-xl relative overflow-hidden">
                      <div className="relative z-10 space-y-12">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-black text-text-muted uppercase tracking-[0.3em] opacity-40">
                            Question {currentQuestionIndex + 1} of {activeQuiz.questions.length}
                          </span>
                          <button onClick={() => setActiveQuiz(null)} className="text-text-muted hover:text-text-dark font-black text-[10px] uppercase tracking-widest">Abort</button>
                        </div>

                        <div className="space-y-4">
                          <h3 className="text-3xl font-black text-text-dark tracking-tighter leading-tight">
                            {activeQuiz.questions[currentQuestionIndex].question}
                          </h3>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                          {activeQuiz.questions[currentQuestionIndex].options.map((option: string, i: number) => (
                            <motion.button
                              key={i}
                              whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 138, 76, 0.05)' }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleAnswerSelect(i)}
                              className={`p-8 rounded-3xl text-left font-bold transition-all border-2 ${selectedAnswers[currentQuestionIndex] === i
                                  ? 'bg-accent-orange/5 border-accent-orange text-accent-orange'
                                  : 'bg-surface-dim border-border/30 text-text-dark/70 hover:border-accent-orange/30'
                                }`}
                            >
                              <div className="flex items-center gap-6">
                                <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-[12px] font-black border-2 ${selectedAnswers[currentQuestionIndex] === i ? 'bg-accent-orange text-white border-accent-orange' : 'bg-white border-border/40 text-text-muted'
                                  }`}>
                                  {String.fromCharCode(65 + i)}
                                </span>
                                {option}
                              </div>
                            </motion.button>
                          ))}
                        </div>

                        <div className="pt-8 flex justify-end">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            disabled={selectedAnswers[currentQuestionIndex] === undefined}
                            onClick={handleNext}
                            className="btn-primary !h-16 !px-12 group"
                          >
                            {currentQuestionIndex === activeQuiz.questions.length - 1 ? 'Finalize Quiz' : 'Next Question'}
                            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white border border-border/40 rounded-[3.5rem] p-10 lg:p-16 shadow-soft-xl text-center space-y-12">
                      <div className="space-y-6">
                        <div className="w-24 h-24 bg-accent-green/10 text-accent-green rounded-[2.5rem] flex items-center justify-center mx-auto">
                          <span className="material-symbols-outlined text-[48px] font-black">verified</span>
                        </div>
                        <h2 className="text-5xl font-black text-text-dark tracking-tighter leading-none">Assessment Complete</h2>
                        <div className="flex items-center justify-center gap-4">
                          <span className="text-7xl font-black text-accent-green tracking-tighter tabular-nums">
                            {selectedAnswers.length > 0 
                              ? Math.round((selectedAnswers.filter((a, i) => a === activeQuiz.questions[i].correctAnswer).length / activeQuiz.questions.length) * 100)
                              : (activeQuiz.score || 0)}%
                          </span>
                          <span className="text-lg font-black text-text-muted uppercase tracking-widest opacity-40">Global Rank</span>
                        </div>
                      </div>

                      <div className="space-y-8 text-left border-t border-border/10 pt-10">
                        <h4 className="text-[11px] font-black text-text-muted uppercase tracking-[0.3em] px-2">Detailed Review</h4>
                        <div className="grid gap-6">
                          {activeQuiz.questions?.map((q: any, i: number) => {
                            const userAnswer = selectedAnswers[i];
                            const hasUserAnswer = userAnswer !== undefined;
                            const isCorrect = hasUserAnswer && userAnswer === q.correctAnswer;
                            
                            return (
                              <div
                                key={i}
                                className={`p-8 rounded-[2.5rem] border-2 transition-all ${
                                  !hasUserAnswer 
                                    ? 'bg-surface-dim border-border/20' 
                                    : isCorrect 
                                      ? 'bg-accent-green/5 border-accent-green/20' 
                                      : 'bg-red-500/5 border-red-500/20'
                                }`}
                              >
                                <div className="flex items-start gap-6">
                                  <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center text-[14px] font-black ${
                                    !hasUserAnswer
                                      ? 'bg-text-muted/20 text-text-muted'
                                      : isCorrect 
                                        ? 'bg-accent-green text-white' 
                                        : 'bg-red-500 text-white'
                                  }`}>
                                    {!hasUserAnswer ? (i + 1) : isCorrect ? '✓' : '×'}
                                  </div>
                                  <div className="space-y-4 flex-1">
                                    <p className="font-bold text-text-dark text-lg leading-tight">{q.question}</p>
                                    <div className="space-y-2">
                                      {hasUserAnswer && (
                                        <div className="flex items-center gap-2 text-sm">
                                          <span className="text-text-muted font-bold">Your answer:</span>
                                          <span className={isCorrect ? 'text-accent-green font-black' : 'text-red-500 font-black'}>
                                            {q.options[userAnswer]}
                                          </span>
                                        </div>
                                      )}
                                      <div className="flex items-center gap-2 text-sm">
                                        <span className="text-text-muted font-bold">Correct answer:</span>
                                        <span className="text-accent-green font-black">{q.options[q.correctAnswer]}</span>
                                      </div>
                                    </div>
                                    <div className="p-4 bg-white/50 rounded-2xl border border-border/10">
                                      <p className="text-sm text-text-muted italic leading-relaxed">
                                        <span className="font-black uppercase text-[10px] tracking-widest mr-2 not-italic opacity-50">Insight:</span>
                                        {q.explanation}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="pt-12">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setActiveQuiz(null);
                            setIsFinished(false);
                          }}
                          className="btn-primary w-full !h-16 !text-lg"
                        >
                          Back to Assessments
                          <span className="material-symbols-outlined">restart_alt</span>
                        </motion.button>
                      </div>
                    </div>
                  )}
                </motion.div>
              ) : (
                /* Historical List */
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-black text-text-dark tracking-tighter">Recent Assessments</h3>
                  </div>

                  {quizzes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {quizzes.map((q) => (
                        <motion.div
                          key={q.id}
                          whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleReviewPastQuiz(q)}
                          className="bg-white border border-border/40 rounded-[2.5rem] p-10 flex flex-col group transition-all relative overflow-hidden cursor-pointer"
                        >
                          <div className="relative z-10 flex flex-col h-full">
                            <div className="flex items-center justify-between mb-8">
                              <span className="px-3 py-1 bg-surface-dim border border-border/40 rounded-full text-[9px] font-black uppercase tracking-widest text-text-muted">
                                {new Date(q.created_at).toLocaleDateString()}
                              </span>
                              <span className={`text-2xl font-black tracking-tighter ${q.score >= 80 ? 'text-accent-green' : q.score >= 50 ? 'text-accent-orange' : 'text-red-500'}`}>
                                {q.score}%
                              </span>
                            </div>
                            <h3 className="text-xl font-black text-text-dark tracking-tighter mb-4 leading-snug">{q.topic}</h3>
                            <div className="mt-auto pt-6 border-t border-border/10 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-text-muted opacity-40">
                              <span>{q.questions?.length || 0} Concepts</span>
                              <div className="flex items-center gap-1 group-hover:text-accent-orange transition-colors">
                                <span>Review</span>
                                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white border-2 border-dashed border-border/40 rounded-[3rem] p-20 text-center space-y-6">
                      <div className="w-20 h-20 bg-surface-dim rounded-full flex items-center justify-center mx-auto text-text-muted/30">
                        <span className="material-symbols-outlined text-[40px]">history</span>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-xl font-black text-text-dark tracking-tighter">No assessments yet</h4>
                        <p className="text-text-muted font-medium">Your quiz history will appear here once you complete your first assessment.</p>
                      </div>
                      <button 
                        onClick={() => setShowStartModal(true)}
                        className="text-accent-green font-black text-xs uppercase tracking-[0.2em] hover:underline"
                      >
                        Generate your first quiz
                      </button>
                    </div>
                  )}
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Start Modal */}
        <AnimatePresence>
          {showStartModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowStartModal(false)} className="absolute inset-0 bg-text-dark/40 backdrop-blur-md" />
              <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative bg-white w-full max-w-xl rounded-[3.5rem] p-10 lg:p-14 shadow-soft-2xl border border-white/60">
                <div className="mb-10 text-center">
                  <div className="w-20 h-20 bg-accent-green/10 text-accent-green rounded-[2.2rem] flex items-center justify-center mx-auto mb-6">
                    <span className="material-symbols-outlined text-[40px] font-black">bolt</span>
                  </div>
                  <h3 className="text-4xl font-black text-text-dark tracking-tighter leading-none mb-3">Quiz Generation</h3>
                  <p className="text-text-muted font-medium">Initialize a knowledge assessment.</p>
                </div>

                <form onSubmit={handleCreateQuiz} className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-text-muted px-2">Assessment Topic</label>
                    <input name="topic" required placeholder="e.g., Quantum Mechanics Fundamentals" className="w-full h-16 bg-surface-dim border border-border/30 rounded-2xl px-6 font-medium outline-none focus:ring-2 focus:ring-accent-green/20" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-text-muted px-2">Additional Context (Optional)</label>
                    <textarea name="notes" placeholder="Paste your study notes or a summary here for a more targeted quiz..." className="w-full h-32 bg-surface-dim border border-border/30 rounded-2xl p-6 font-medium outline-none focus:ring-2 focus:ring-accent-green/20 resize-none" />
                  </div>
                  <button disabled={isGenerating} className="w-full btn-primary !bg-accent-green !shadow-glow-green h-18 text-xl group">
                    {isGenerating ? 'Synthesizing Quiz...' : 'Initialize Assessment'}
                    <span className="material-symbols-outlined group-hover:rotate-12 transition-transform">bolt</span>
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <MobileNav />
      </main>
    </div>
  );
}
