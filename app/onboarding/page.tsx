'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const router = useRouter();

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => Math.max(1, s - 1));

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-gutter relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -z-10"></div>
      
      <div className="w-full max-w-2xl relative z-10">
        {/* Progress Bar */}
        <div className="flex gap-2 mb-12 px-12">
          {[1, 2, 3].map(i => (
            <div 
              key={i} 
              className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                i <= step ? 'bg-primary shadow-[0_0_10px_#d0bcff]' : 'bg-white/10'
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-center space-y-lg"
            >
              <div className="w-24 h-24 bg-primary/20 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-glow-primary">
                <span className="material-symbols-outlined text-5xl text-primary">school</span>
              </div>
              <h2 className="font-display text-h2 text-white">What are you studying?</h2>
              <p className="text-on-surface-variant text-body-lg">This helps us calibrate your AI assistant for your specific field.</p>
              
              <div className="grid grid-cols-2 gap-md pt-8">
                {['Engineering', 'Medicine', 'Law', 'Computer Science', 'Arts', 'Other'].map(field => (
                  <button 
                    key={field}
                    onClick={nextStep}
                    className="p-md bg-surface-container/40 border border-white/5 rounded-2xl hover:border-primary/50 hover:bg-primary/5 transition-all text-on-surface font-bold text-lg"
                  >
                    {field}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-center space-y-lg"
            >
              <div className="w-24 h-24 bg-secondary/20 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-[0_0_20px_rgba(210,187,255,0.3)]">
                <span className="material-symbols-outlined text-5xl text-secondary">schedule</span>
              </div>
              <h2 className="font-display text-h2 text-white">Your Peak Hours?</h2>
              <p className="text-on-surface-variant text-body-lg">When do you feel most focused? We'll schedule your deep work then.</p>
              
              <div className="flex flex-col gap-sm pt-8">
                {['Early Morning (5am - 9am)', 'Morning (9am - 12pm)', 'Afternoon (1pm - 5pm)', 'Night Owl (8pm - 12am)'].map(time => (
                  <button 
                    key={time}
                    onClick={nextStep}
                    className="p-lg bg-surface-container/40 border border-white/5 rounded-2xl hover:border-secondary/50 hover:bg-secondary/5 transition-all text-on-surface font-bold text-lg text-left flex justify-between items-center group"
                  >
                    {time}
                    <span className="material-symbols-outlined opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
                  </button>
                ))}
              </div>
              <button onClick={prevStep} className="text-on-surface-variant hover:text-white transition-colors pt-4">Go Back</button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-center space-y-lg"
            >
              <div className="w-24 h-24 bg-tertiary/20 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-[0_0_20px_rgba(255,182,149,0.3)]">
                <span className="material-symbols-outlined text-5xl text-tertiary">auto_awesome</span>
              </div>
              <h2 className="font-display text-h2 text-white">Calibration Complete</h2>
              <p className="text-on-surface-variant text-body-lg">Your neural network is ready. Shall we begin your first session?</p>
              
              <div className="pt-12">
                <button 
                  onClick={() => router.push('/dashboard')}
                  className="px-16 py-6 bg-primary text-background font-black text-2xl rounded-2xl shadow-glow hover:scale-105 active:scale-95 transition-all"
                >
                  Enter Dashboard
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
