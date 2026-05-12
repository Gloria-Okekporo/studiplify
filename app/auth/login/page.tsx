'use client';

import Link from 'next/link';
import LoginForm from '@/components/Auth/LoginForm';
import { motion } from 'framer-motion';
import Logo from '@/components/Common/Logo';

export default function LoginPage() {
  return (
    <main className="min-h-screen w-full flex flex-col md:flex-row bg-background overflow-hidden relative selection:bg-accent-orange/20">
      
      {/* Left Side: Friendly Brand Vision */}
      <section className="hidden lg:flex w-1/2 relative flex-col justify-between p-20 overflow-hidden bg-surface-dim">
        {/* Soft Ambient Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-accent-orange/10 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-accent-purple/10 rounded-full blur-[100px]"></div>
        </div>

        <div className="relative z-10">
          <Logo className="group-hover:scale-105 transition-transform duration-500" textSize="text-3xl" iconContainerSize="w-12 h-12 rounded-[1rem]" iconSize="text-3xl" />
        </div>

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-accent-orange font-bold uppercase tracking-widest text-sm block mb-6">Welcome Back</span>
            <h2 className="text-6xl font-extrabold text-text-dark tracking-tight leading-[1.1] mb-8">
              Pick up right <br/><span className="text-text-muted italic">where you left off.</span>
            </h2>
            <p className="text-lg text-text-muted font-medium leading-relaxed max-w-lg">
              Join thousands of students who have organized their study life, reduced burnout, and improved their grades with Studiplify.
            </p>
          </motion.div>
        </div>

        <div className="relative z-10 flex gap-12">
          {[
            { label: 'Study Sessions', value: '1.2M+' },
            { label: 'Happy Students', value: '50k+' }
          ].map((stat, i) => (
            <div key={i}>
              <div className="text-3xl font-extrabold text-text-dark tracking-tight">{stat.value}</div>
              <div className="text-xs font-bold text-text-muted uppercase tracking-wider mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Right Side: Auth Form */}
      <section className="flex-1 flex flex-col items-center justify-center p-8 md:p-20 relative bg-background">
        <div className="lg:hidden absolute top-8 left-8">
          <Logo textSize="text-2xl" iconContainerSize="w-10 h-10 rounded-xl" iconSize="text-2xl" />
        </div>

        <motion.div 
          className="w-full max-w-[440px] flex flex-col gap-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="text-center space-y-3">
            <h1 className="text-4xl font-extrabold text-text-dark tracking-tight">Log in to your account</h1>
            <p className="text-base font-medium text-text-muted">Enter your details below to access your dashboard.</p>
          </div>

          <div className="bg-white rounded-3xl p-10 shadow-soft border border-border relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-40 h-40 bg-accent-orange/5 blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <LoginForm />
          </div>

          <p className="text-center font-medium text-text-muted text-sm">
            By logging in, you agree to our <Link href="/terms" className="text-text-dark hover:text-accent-orange transition-colors font-bold">Terms of Service</Link> & <Link href="/privacy" className="text-text-dark hover:text-accent-orange transition-colors font-bold">Privacy Policy</Link>.
          </p>
        </motion.div>
      </section>
    </main>
  );
}
