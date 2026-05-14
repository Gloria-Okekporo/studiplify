'use client';

import Link from 'next/link';
import SignUpForm from '@/components/Auth/SignUpForm';
import { motion } from 'framer-motion';
import Logo from '@/components/Common/Logo';

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen relative z-10 bg-[#F7F3EE] selection:bg-accent-orange/20 overflow-hidden">
      
      {/* Left Section - The "Experience" Side (Visible on Desktop) */}
      <section className="hidden lg:flex w-1/2 p-20 flex-col justify-between relative overflow-hidden bg-white border-r border-border/40">
        
        {/* Dynamic Mesh Background Overlay */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <motion.div 
            className="absolute top-[-20%] left-[-20%] w-[100%] h-[100%] bg-accent-orange/5 rounded-full blur-[120px]"
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div 
            className="absolute bottom-[-20%] right-[-20%] w-[100%] h-[100%] bg-accent-purple/5 rounded-full blur-[120px]"
            animate={{ 
              scale: [1, 1.2, 1],
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
            <span className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-accent-orange/10 text-accent-orange rounded-full text-[11px] font-black uppercase tracking-[0.2em] mb-8 border border-accent-orange/20 shadow-sm">
              <span className="material-symbols-outlined text-[16px] font-black">bolt</span>
              The Neural Standard
            </span>
            <h1 className="font-display text-7xl xl:text-8xl font-black tracking-tight leading-[0.85] text-text-dark mb-10">
              Design your <br/>
              <span className="text-accent-orange italic">academic</span> <br/>
              destiny.
            </h1>
            <p className="font-medium text-xl text-text-muted leading-relaxed opacity-80 mb-12 max-w-md">
              Join a collective of high-velocity students orchestrating their growth with precision AI.
            </p>
          </motion.div>

          {/* Social & Growth Indicators */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="flex items-center gap-12"
          >
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-display text-4xl font-black text-text-dark tracking-tighter">12k+</span>
                <div className="w-2 h-2 rounded-full bg-accent-orange shadow-glow-orange animate-pulse"></div>
              </div>
              <span className="text-text-muted text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Active Nodes</span>
            </div>
            <div className="h-12 w-[1px] bg-border/40"></div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-display text-4xl font-black text-text-dark tracking-tighter">98%</span>
                <div className="w-2 h-2 rounded-full bg-accent-green shadow-[0_0_8px_rgba(76,175,132,0.4)]"></div>
              </div>
              <span className="text-text-muted text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Velocity Boost</span>
            </div>
          </motion.div>
        </div>

        {/* Premium Mockup Illustration */}
        <motion.div
          className="relative z-10"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          <div className="relative group">
            <div className="absolute -inset-4 bg-accent-orange/10 blur-3xl rounded-[4rem] group-hover:bg-accent-purple/10 transition-colors duration-1000"></div>
            <img 
              src="/studiplify_dashboard_mockup_1778733184782.png" 
              alt="Studiplify Neural Interface" 
              className="relative rounded-[3rem] shadow-soft-2xl border border-white/40 hover:scale-[1.02] transition-transform duration-700"
            />
          </div>
        </motion.div>

        {/* Glassmorphic Quote Card */}
        <motion.div
          className="relative z-10"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="bg-white/40 backdrop-blur-xl p-10 rounded-[3rem] max-w-md border border-white shadow-soft-2xl relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent-orange/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
            <p className="italic text-text-muted font-medium text-lg leading-relaxed mb-8 relative z-10">
              "Studiplify is not just a tool; it's a cognitive upgrade. My academic anxiety vanished once I let the neural flow guide my sessions."
            </p>
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-orange to-accent-purple p-[2px]">
                <div className="w-full h-full rounded-2xl bg-white flex items-center justify-center font-black text-accent-orange text-lg">SJ</div>
              </div>
              <div>
                <div className="font-black text-text-dark text-[15px]">Sarah Jenkins</div>
                <div className="text-[10px] font-black text-text-muted uppercase tracking-widest opacity-40">Stanford Medicine</div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Right Section - The Form (Full Width on Mobile) */}
      <section className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 lg:p-20 relative overflow-hidden">
        
        {/* Background Visuals for Mobile */}
        <div className="lg:hidden absolute inset-0 -z-10 bg-surface-dim">
          <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-accent-orange/10 rounded-full blur-[80px]"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-accent-purple/10 rounded-full blur-[80px]"></div>
        </div>

        {/* Mobile Header */}
        <div className="lg:hidden w-full max-w-md mb-12 flex items-center justify-between">
          <Logo textSize="text-2xl" iconContainerSize="w-10 h-10 rounded-xl" iconSize="text-2xl" />
          <Link href="/auth/login" className="text-[11px] font-black uppercase tracking-widest text-text-muted hover:text-accent-orange transition-colors">Portal Access</Link>
        </div>

        <motion.div
          className="w-full max-w-lg lg:bg-white lg:rounded-[4rem] lg:p-16 lg:shadow-soft-2xl lg:border lg:border-border/40 relative z-10"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Header */}
          <div className="mb-12">
            <h2 className="font-display text-4xl lg:text-5xl font-black mb-4 text-text-dark tracking-tighter leading-none">Initialize Identity</h2>
            <p className="text-text-muted font-medium text-lg opacity-60">Begin your high-velocity academic journey.</p>
          </div>

          {/* Sign Up Form */}
          <SignUpForm />
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
