'use client';

import Link from 'next/link';
import LoginForm from '@/components/Auth/LoginForm';
import { motion } from 'framer-motion';
import Logo from '@/components/Common/Logo';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen relative z-10 bg-[#F7F3EE] selection:bg-accent-orange/20 overflow-hidden">
      
      {/* Left Section - The "Experience" Side (Visible on Desktop) */}
      <section className="hidden lg:flex w-1/2 p-20 flex-col justify-between relative overflow-hidden bg-white border-r border-border/40">
        
        {/* Dynamic Mesh Background Overlay */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <motion.div 
            className="absolute top-[-20%] left-[-20%] w-[100%] h-[100%] bg-accent-purple/5 rounded-full blur-[120px]"
            animate={{ 
              scale: [1, 1.15, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div 
            className="absolute bottom-[-20%] right-[-20%] w-[100%] h-[100%] bg-accent-orange/5 rounded-full blur-[120px]"
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          />
        </div>

        {/* Brand Identity */}
        <motion.div
          className="relative z-10"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Logo textSize="text-3xl" iconContainerSize="w-12 h-12 rounded-2xl" iconSize="text-3xl" />
        </motion.div>

        {/* Core Value Proposition */}
        <div className="relative z-10 max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-accent-purple/10 text-accent-purple rounded-full text-[11px] font-black uppercase tracking-[0.2em] mb-8 border border-accent-purple/20 shadow-sm">
              <span className="material-symbols-outlined text-[16px] font-black">sync</span>
              Session Reconnection
            </span>
            <h1 className="font-display text-7xl xl:text-8xl font-black tracking-tight leading-[0.85] text-text-dark mb-10">
              Pick up <br/>
              <span className="text-accent-purple italic">where you</span> <br/>
              left off.
            </h1>
            <p className="font-medium text-xl text-text-muted leading-relaxed opacity-80 mb-12 max-w-md">
              Your neural flow is waiting. Re-authorize your session to continue your academic orchestration.
            </p>
          </motion.div>
        </div>

        {/* Dynamic Analytics Card Placeholder */}
        <motion.div
          className="relative z-10"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="bg-white/40 backdrop-blur-xl p-10 rounded-[3rem] max-w-md border border-white shadow-soft-2xl relative overflow-hidden group">
            <div className="flex items-center justify-between mb-8">
              <div className="w-12 h-12 rounded-2xl bg-accent-purple/10 text-accent-purple flex items-center justify-center">
                <span className="material-symbols-outlined font-black">trending_up</span>
              </div>
              <span className="text-[10px] font-black text-text-muted uppercase tracking-widest opacity-40">System Status: Active</span>
            </div>
            <div className="space-y-4">
              <div className="h-2 w-full bg-border/20 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-accent-purple"
                  initial={{ width: 0 }}
                  animate={{ width: '85%' }}
                  transition={{ duration: 2, delay: 1 }}
                />
              </div>
              <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-text-muted">
                <span>Session Mastery</span>
                <span className="text-accent-purple">85%</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Right Section - The Form (Full Width on Mobile) */}
      <section className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 lg:p-20 relative overflow-hidden">
        
        {/* Background Visuals for Mobile */}
        <div className="lg:hidden absolute inset-0 -z-10 bg-surface-dim">
          <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-accent-purple/10 rounded-full blur-[80px]"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-accent-orange/10 rounded-full blur-[80px]"></div>
        </div>

        {/* Mobile Header */}
        <div className="lg:hidden w-full max-w-md mb-12 flex items-center justify-between">
          <Logo textSize="text-2xl" iconContainerSize="w-10 h-10 rounded-xl" iconSize="text-2xl" />
          <Link href="/auth/signup" className="text-[11px] font-black uppercase tracking-widest text-text-muted hover:text-accent-purple transition-colors">Initialize New</Link>
        </div>

        <motion.div
          className="w-full max-w-lg lg:bg-white lg:rounded-[4rem] lg:p-16 lg:shadow-soft-2xl lg:border lg:border-border/40 relative z-10"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Header */}
          <div className="mb-12">
            <h2 className="font-display text-4xl lg:text-5xl font-black mb-4 text-text-dark tracking-tighter leading-none">Portal Access</h2>
            <p className="text-text-muted font-medium text-lg opacity-60">Authorize your secure node connection.</p>
          </div>

          {/* Login Form */}
          <LoginForm />
        </motion.div>

        {/* Minimal Footer */}
        <div className="mt-12 text-center">
          <p className="text-[10px] font-black text-text-muted/40 uppercase tracking-[0.4em]">Studiplify Neural Interface v1.0.4</p>
        </div>
      </section>

      {/* Global Background Decorations */}
      <div className="fixed inset-0 pointer-events-none -z-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-noise opacity-[0.015] mix-blend-overlay"></div>
      </div>
    </main>
  );
}
