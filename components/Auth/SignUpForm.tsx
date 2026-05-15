'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { signUp } from '@/lib/actions/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignUpForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const router = useRouter();

  useEffect(() => {
    // Basic password strength logic
    let strength = 0;
    if (password.length > 5) strength += 25;
    if (password.match(/[A-Z]/)) strength += 25;
    if (password.match(/[0-9]/)) strength += 25;
    if (password.match(/[^A-Za-z0-9]/)) strength += 25;
    setPasswordStrength(strength);
  }, [password]);

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
        className="text-center space-y-8 p-10 bg-white/60 backdrop-blur-2xl border border-white/80 rounded-[3rem] shadow-soft-2xl"
      >
        <div className="w-24 h-24 bg-accent-green/10 text-accent-green rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner-sm">
          <span className="material-symbols-outlined text-[48px] font-black">mark_email_read</span>
        </div>
        <div className="space-y-3">
          <h2 className="text-3xl font-black text-text-dark tracking-tighter">Transmission Sent</h2>
          <p className="text-text-muted font-medium max-w-[280px] mx-auto leading-relaxed">
            We've beamed a verification link to your neural node. Please confirm your identity.
          </p>
        </div>
        <Link 
          href="/auth/login"
          className="btn-secondary w-full h-16 flex items-center justify-center text-sm font-black uppercase tracking-widest hover:shadow-lg transition-all"
        >
          Return to Portal
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Full Name Input */}
        <div className="space-y-2 group">
          <label className="text-[11px] font-black uppercase tracking-widest text-text-muted px-2 transition-colors group-focus-within:text-accent-orange">Full Name</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-text-muted/40 group-focus-within:text-accent-orange transition-colors">person</span>
            <input 
              name="fullName" 
              type="text" 
              required 
              placeholder="Student Name"
              className="w-full h-16 bg-white/50 border border-border/40 rounded-2xl pl-14 pr-6 font-medium focus:ring-4 focus:ring-accent-orange/5 focus:border-accent-orange transition-all outline-none shadow-sm"
            />
          </div>
        </div>

        {/* Study Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2 group">
            <label className="text-[11px] font-black uppercase tracking-widest text-text-muted px-2 transition-colors group-focus-within:text-accent-purple">Level</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-text-muted/40 group-focus-within:text-accent-purple transition-colors">school</span>
              <select 
                name="studyLevel" 
                required
                className="w-full h-16 bg-white/50 border border-border/40 rounded-2xl pl-14 pr-6 font-medium focus:ring-4 focus:ring-accent-purple/5 focus:border-accent-purple transition-all outline-none appearance-none shadow-sm cursor-pointer"
              >
                <option value="University">University</option>
                <option value="High School">High School</option>
                <option value="College">College</option>
                <option value="Post-Grad">Post-Grad</option>
              </select>
              <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 text-text-muted/40 pointer-events-none">expand_more</span>
            </div>
          </div>
          <div className="space-y-2 group">
            <label className="text-[11px] font-black uppercase tracking-widest text-text-muted px-2 transition-colors group-focus-within:text-accent-purple">School</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-text-muted/40 group-focus-within:text-accent-purple transition-colors">account_balance</span>
              <input 
                name="school" 
                type="text" 
                required 
                placeholder="MIT / Stanford"
                className="w-full h-16 bg-white/50 border border-border/40 rounded-2xl pl-14 pr-6 font-medium focus:ring-4 focus:ring-accent-purple/5 focus:border-accent-purple transition-all outline-none shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Email Input */}
        <div className="space-y-2 group">
          <label className="text-[11px] font-black uppercase tracking-widest text-text-muted px-2 transition-colors group-focus-within:text-accent-orange">Email Node</label>
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
        <div className="space-y-2 group">
          <label className="text-[11px] font-black uppercase tracking-widest text-text-muted px-2 transition-colors group-focus-within:text-accent-orange">Security Key</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-text-muted/40 group-focus-within:text-accent-orange transition-colors">lock</span>
            <input 
              name="password" 
              type={showPassword ? "text" : "password"} 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
          {/* Password Strength Indicator */}
          <div className="px-2 pt-1 flex gap-1.5 h-1.5">
            {[25, 50, 75, 100].map((step) => (
              <div 
                key={step}
                className={`flex-1 rounded-full transition-all duration-500 ${
                  passwordStrength >= step 
                    ? passwordStrength <= 25 ? 'bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.3)]' :
                      passwordStrength <= 50 ? 'bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.3)]' :
                      passwordStrength <= 75 ? 'bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.3)]' :
                      'bg-accent-green shadow-[0_0_8px_rgba(76,175,132,0.3)]'
                    : 'bg-border/30'
                }`}
              />
            ))}
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
            {loading ? 'Initializing...' : 'Initialize Account'}
            {!loading && <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">bolt</span>}
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
        </button>


      </form>

      <div className="mt-10 pt-8 border-t border-border/30 text-center">
        <p className="text-text-muted font-medium text-sm">
          Existing user? <Link href="/auth/login" className="text-accent-orange font-bold hover:underline decoration-2 underline-offset-4">Access Portal</Link>
        </p>
      </div>
    </div>
  );
}
