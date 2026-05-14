'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { signUp } from '@/lib/actions/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignUpForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await signUp(formData);

    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.error || 'Something went wrong');
    }
    setLoading(false);
  };

  if (success) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-6 p-8 bg-white/60 backdrop-blur-xl border border-white/80 rounded-[3rem] shadow-soft-2xl"
      >
        <div className="w-20 h-20 bg-accent-green/10 text-accent-green rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-[40px] font-black">mark_email_read</span>
        </div>
        <h2 className="text-3xl font-black text-text-dark tracking-tighter">Check your email</h2>
        <p className="text-text-muted font-medium max-w-xs mx-auto">
          We've sent a verification link to your email. Please verify your account to continue.
        </p>
        <Link 
          href="/auth/login"
          className="btn-secondary w-full mt-8 flex items-center justify-center"
        >
          Back to Login
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md"
    >
      <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-[3rem] p-10 lg:p-12 shadow-soft-2xl">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-black text-text-dark tracking-tighter leading-none mb-3">Create Account</h1>
          <p className="text-text-muted font-medium">Join 12,000+ students today.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-text-muted px-2">Full Name</label>
            <input 
              name="fullName" 
              type="text" 
              required 
              placeholder="John Doe"
              className="w-full h-14 bg-white/50 border border-border/40 rounded-2xl px-6 font-medium focus:ring-2 focus:ring-accent-orange/20 focus:border-accent-orange transition-all outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-text-muted px-2">Study Level</label>
              <select 
                name="studyLevel" 
                required
                className="w-full h-14 bg-white/50 border border-border/40 rounded-2xl px-6 font-medium focus:ring-2 focus:ring-accent-orange/20 focus:border-accent-orange transition-all outline-none appearance-none"
              >
                <option value="University">University</option>
                <option value="High School">High School</option>
                <option value="College">College</option>
                <option value="Post-Grad">Post-Grad</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-text-muted px-2">School</label>
              <input 
                name="school" 
                type="text" 
                required 
                placeholder="MIT"
                className="w-full h-14 bg-white/50 border border-border/40 rounded-2xl px-6 font-medium focus:ring-2 focus:ring-accent-orange/20 focus:border-accent-orange transition-all outline-none"
              />
            </div>
          </div>

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

          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-text-muted px-2">Password</label>
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
              <span className="material-symbols-outlined text-[18px]">error</span>
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
                Initialize Account
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </span>
            )}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-border/30 text-center">
          <p className="text-text-muted font-medium">
            Already have an account? <Link href="/auth/login" className="text-accent-orange font-bold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
