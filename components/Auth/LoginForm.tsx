'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { signIn } from '@/lib/actions/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
      setError(result.error || 'Invalid email or password');
    }
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md"
    >
      <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-[3rem] p-10 lg:p-12 shadow-soft-2xl">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-black text-text-dark tracking-tighter leading-none mb-3">Welcome Back</h1>
          <p className="text-text-muted font-medium">Continue your academic journey.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-text-muted px-2">Email Address</label>
            <input
              name="email"
              type="email"
              required
              placeholder="name@email.com"
              className="w-full h-14 bg-white/50 border border-border/40 rounded-2xl px-6 font-medium focus:ring-2 focus:ring-accent-orange/20 focus:border-accent-orange transition-all outline-none"
            />
          </div>

          <div className="space-y-2 relative">
            <div className="flex justify-between items-center px-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-text-muted">Password</label>
              <Link href="/auth/reset-password" className="text-[11px] font-black text-accent-orange uppercase tracking-widest hover:underline">Forgot?</Link>
            </div>
            <input
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="w-full h-14 bg-white/50 border border-border/40 rounded-2xl px-6 font-medium focus:ring-2 focus:ring-accent-orange/20 focus:border-accent-orange transition-all outline-none"
            />
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-bold flex items-center gap-3 animate-shake">
              <span className="material-symbols-outlined text-[18px]">error_outline</span>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary h-16 text-lg group"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
            ) : (
              <span className="flex items-center justify-center gap-2">
                Authorize Session
                <span className="material-symbols-outlined group-hover:rotate-12 transition-transform">bolt</span>
              </span>
            )}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-border/30 text-center">
          <p className="text-text-muted font-medium">
            New to Studiplify? <Link href="/auth/signup" className="text-accent-orange font-bold hover:underline">Create Account</Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
