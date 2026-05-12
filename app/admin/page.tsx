'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function AdminLoginPage() {
  return (
    <main className="relative min-h-screen flex items-center justify-center p-8 bg-[#0d0c12] overflow-hidden">
      {/* Background Architecture */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute inset-0 bg-noise opacity-[0.03]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-pastel-purple/10 rounded-full blur-[160px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl"
      >
        <div className="text-center mb-16">
          <Link href="/" className="inline-flex items-center gap-5 group mb-12">
            <div className="w-16 h-16 rounded-[1.5rem] bg-pastel-purple flex items-center justify-center shadow-glow-primary group-hover:scale-110 transition-all">
              <span className="material-symbols-outlined text-background text-4xl font-black">admin_panel_settings</span>
            </div>
            <div className="font-display text-5xl font-black text-white tracking-tighter">Admin.</div>
          </Link>
          <h1 className="text-2xl font-black text-white uppercase tracking-[0.5em] opacity-40">Command Center Login</h1>
        </div>

        <div className="glass-card p-16 rounded-[4rem] border-white/5 relative overflow-hidden">
          <form className="space-y-10">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] ml-2">Operator ID</label>
              <input type="text" placeholder="Admin Username" className="w-full bg-white/5 border border-white/10 rounded-3xl px-8 py-6 text-white focus:outline-none focus:border-pastel-purple/50 transition-all text-lg font-medium" />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] ml-2">Secure Protocol (Password)</label>
              <input type="password" placeholder="••••••••" className="w-full bg-white/5 border border-white/10 rounded-3xl px-8 py-6 text-white focus:outline-none focus:border-pastel-purple/50 transition-all text-lg font-medium" />
            </div>
            <button className="w-full bg-pastel-purple text-background py-6 rounded-full font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-glow-primary">
              Authorize Access
            </button>
          </form>
        </div>

        <div className="mt-12 text-center">
          <Link href="/" className="text-on-surface-variant font-bold hover:text-white transition-all text-sm opacity-40">Return to Terminal</Link>
        </div>
      </motion.div>
    </main>
  );
}
