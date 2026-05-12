'use client';

import Link from 'next/link';
import SignUpForm from '@/components/Auth/SignUpForm';
import { motion } from 'framer-motion';
import Logo from '@/components/Common/Logo';

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen flex-col md:flex-row relative z-10 bg-background selection:bg-accent-orange/20">
      {/* Left Section - Branding */}
      <section className="flex w-full md:w-1/2 lg:w-3/5 p-8 py-12 md:p-20 flex-col justify-center md:justify-between relative overflow-hidden bg-surface-dim min-h-[50vh] md:min-h-0 gap-10 md:gap-0 border-r border-border">
        
        {/* Soft Background Effects wrapper */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
        >
          {/* Floating Warm Orbs */}
          <motion.div 
            className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-accent-orange/10 rounded-full blur-[100px]"
            animate={{ y: [0, 20, 0], x: [0, 15, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div 
            className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-accent-purple/10 rounded-full blur-[100px]"
            animate={{ y: [0, -30, 0], x: [0, -20, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          />
        </motion.div>

        {/* Top Header */}
        <motion.div
          className="relative z-10"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Logo textSize="text-3xl" iconContainerSize="w-12 h-12 rounded-[1rem]" iconSize="text-3xl" />
        </motion.div>

        {/* Central Content */}
        <motion.div
          className="relative z-10 max-w-lg"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
        >
          <div className="relative mb-6 md:mb-8">
            <h2 className="font-display text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] text-text-dark">
              Unlock your{' '}
              <span className="text-accent-orange">
                academic potential
              </span>
            </h2>
          </div>
          <p className="font-medium text-lg text-text-muted leading-relaxed max-w-[420px]">
            Join thousands of students who have transformed their study habits, reduced stress, and achieved top grades.
          </p>
          <div className="mt-10 md:mt-14 flex items-center gap-6 md:gap-10">
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-accent-orange shadow-[0_0_8px_rgba(255,138,76,0.5)]"></div>
                <span className="font-display text-3xl md:text-4xl font-extrabold text-text-dark tracking-tight">12k+</span>
              </div>
              <span className="text-text-muted text-[11px] md:text-xs font-bold uppercase tracking-widest pl-4">
                Active Students
              </span>
            </div>
            <div className="h-10 w-[1px] bg-border"></div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-accent-green shadow-[0_0_8px_rgba(76,175,132,0.5)]"></div>
                <span className="font-display text-3xl md:text-4xl font-extrabold text-text-dark tracking-tight">98%</span>
              </div>
              <span className="text-text-muted text-[11px] md:text-xs font-bold uppercase tracking-widest pl-4">
                Grade Improvement
              </span>
            </div>
          </div>
        </motion.div>

        {/* Footer Quote */}
        <motion.div
          className="relative z-10 hidden md:block"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        >
          <div className="bg-white/60 backdrop-blur-md p-6 rounded-2xl max-w-sm border border-white shadow-soft">
            <p className="italic text-text-muted font-medium text-sm leading-relaxed mb-4">
              "The AI study planner transformed my messy notes into a clear schedule overnight. I actually have free time now."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent-orange/20 border-2 border-white flex items-center justify-center text-accent-orange font-bold text-sm">
                SJ
              </div>
              <span className="font-bold text-text-dark text-sm">
                Sarah Jenkins, Medical Student
              </span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Right Section - Signup Form */}
      <section className="flex-1 flex items-center justify-center p-6 md:p-12 lg:p-20 bg-background relative w-full overflow-hidden">
        <motion.div
          className="w-full max-w-md bg-white rounded-3xl p-8 md:p-10 shadow-soft-lg border border-border relative z-10"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Form Header */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          >
            <h2 className="font-display text-3xl font-extrabold mb-2 text-text-dark tracking-tight">Create Account</h2>
            <p className="text-text-muted font-medium">
              Start studying smarter today. Free forever for students.
            </p>
          </motion.div>

          {/* Sign Up Form */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
          >
            <SignUpForm />
          </motion.div>
        </motion.div>
      </section>
    </main>
  );
}
