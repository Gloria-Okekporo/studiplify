'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { signIn, signInWithGoogle } from '@/lib/actions/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await signIn(formData);

    if (result.success) {
      router.push('/');
      router.refresh();
    } else {
      setError(result.error || 'Invalid credentials detected');
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Input */}
        <div className="space-y-2 group">
          <label className="text-[11px] font-black uppercase tracking-widest text-text-muted px-2 transition-colors group-focus-within:text-accent-orange">Authorized Email</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-text-muted/40 group-focus-within:text-accent-orange transition-colors">alternate_email</span>
            <input
              name="email"
              type="email"
              required
              placeholder="name@email.com"
              className="w-full h-16 bg-white/50 border border-border/40 rounded-2xl pl-14 pr-6 font-medium focus:ring-4 focus:ring-accent-orange/5 focus:border-accent-orange transition-all outline-none shadow-sm"
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="space-y-2 group relative">
          <div className="flex justify-between items-center px-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-text-muted group-focus-within:text-accent-orange transition-colors">Security Key</label>
            <Link href="/auth/reset-password" className="text-[11px] font-black text-accent-orange uppercase tracking-widest hover:underline decoration-2 underline-offset-4">Forgot Link?</Link>
          </div>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-text-muted/40 group-focus-within:text-accent-orange transition-colors">lock</span>
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="••••••••"
              className="w-full h-16 bg-white/50 border border-border/40 rounded-2xl pl-14 pr-16 font-medium focus:ring-4 focus:ring-accent-orange/5 focus:border-accent-orange transition-all outline-none shadow-sm"
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-text-muted/40 hover:text-text-dark transition-colors"
            >
              <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
            </button>
          </div>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-xs font-bold flex items-center gap-3 shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">error</span>
            {error}
          </motion.div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full h-16 bg-accent-orange text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-glow-orange hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 relative overflow-hidden group"
        >
          <span className="relative z-10 flex items-center justify-center gap-3">
            {loading ? 'Authenticating...' : 'Authorize Session'}
            {!loading && <span className="material-symbols-outlined text-[20px] group-hover:rotate-12 transition-transform">bolt</span>}
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
        </button>

        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border/30"></div></div>
          <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest">
            <span className="bg-white px-4 text-text-muted/40">Alternative Gateways</span>
          </div>
        </div>

        <button 
          type="button"
          onClick={() => signInWithGoogle()}
          className="w-full h-16 bg-white border border-border/60 rounded-2xl flex items-center justify-center gap-4 hover:bg-surface-dim hover:border-accent-purple/30 transition-all active:scale-[0.98] shadow-sm group"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 grayscale group-hover:grayscale-0 transition-all" />
          <span className="text-sm font-black text-text-dark uppercase tracking-widest">Continue with Google</span>
        </button>
      </form>

      <div className="mt-10 pt-8 border-t border-border/30 text-center">
        <p className="text-text-muted font-medium text-sm">
          New Node? <Link href="/auth/signup" className="text-accent-orange font-bold hover:underline decoration-2 underline-offset-4">Initialize Account</Link>
        </p>
      </div>
    </div>
  );
}
