'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from '@/components/Layout/Navbar';
import Footer from '@/components/Layout/Footer';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCTAClick = () => {
    const href = isAuthenticated ? '/dashboard/study-plan' : '/auth/signup';
    router.push(href);
  };

  if (!mounted) {
    return <div className="min-h-screen bg-background" />; // Simple skeleton/blank during hydration
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background">

      {/* Modern Warm Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section id="architecture" className="relative min-h-[95vh] lg:min-h-screen flex items-center justify-center pt-24 md:pt-32 pb-20 md:pb-20 px-6 md:px-12 overflow-hidden bg-background">
        
        {/* Background Decorative Elements */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-accent-orange/5 rounded-full blur-[100px] -z-10 animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-accent-purple/5 rounded-full blur-[120px] -z-10 animate-pulse-slow"></div>

        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 lg:gap-48 items-center relative z-10">
          
          {/* Left Side: Copy & CTAs */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative z-30"
          >
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-orange/10 border border-accent-orange/20 text-accent-orange text-xs font-black uppercase tracking-widest mb-4"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-orange opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-orange"></span>
              </span>
              Next-Gen AI Education
            </motion.div>

            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-[80px] leading-[1.05] font-black tracking-tighter text-text-dark mb-10 drop-shadow-sm">
              Study Smarter. <br className="hidden sm:block"/>
              <span className="relative inline-block mt-2">
                <span className="absolute -inset-2 bg-accent-orange/20 blur-3xl rounded-full opacity-30 animate-pulse-glow"></span>
                <span 
                  className="relative bg-gradient-to-r from-accent-orange via-accent-purple to-accent-orange bg-[length:200%_auto] animate-text-shimmer bg-clip-text text-transparent drop-shadow-2xl"
                  style={{ WebkitBackgroundClip: 'text' }}
                >
                  Stress Less.
                </span>
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-text-muted leading-relaxed font-medium mb-16 max-w-2xl opacity-90">
              The only AI-native study environment designed to harmonize your workflow, amplify focus, and eliminate academic burnout.
            </p>

            <div className="flex flex-col sm:flex-row gap-6">
              {mounted && (
                <Link 
                  href={isAuthenticated ? '/dashboard/study-plan' : '/auth/signup'} 
                  className="w-full sm:w-auto relative group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-accent-orange via-[#FF9F66] to-accent-orange bg-[length:200%_auto] animate-text-shimmer transition-transform duration-500 group-hover:scale-105"></div>
                  <div className="relative px-12 py-5 rounded-full flex items-center justify-center gap-3 text-white text-[16px] font-black uppercase tracking-[0.15em] shadow-glow-orange transition-all duration-300 group-hover:shadow-soft-2xl group-active:scale-95">
                    Start Your Protocol
                    <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </div>
                </Link>
              )}

              <Link 
                href="#features"
                className="w-full sm:w-auto bg-white/50 backdrop-blur-xl border border-border/50 text-text-dark text-[15px] font-black uppercase tracking-widest px-10 py-6 rounded-full flex items-center justify-center gap-3 hover:bg-white hover:shadow-soft-lg active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-accent-orange font-black">play_circle</span>
                Watch System Tour
              </Link>
            </div>

            {/* Social Proof */}
            <div className="mt-20 flex items-center gap-6">
              <div className="flex -space-x-4">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="w-12 h-12 rounded-full border-4 border-background bg-surface-variant overflow-hidden shadow-md ring-1 ring-black/5">
                    <img src={`https://i.pravatar.cc/150?img=${i+10}`} alt="Student" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <div>
                <div className="flex gap-0.5 text-accent-orange mb-1">
                  {[1,2,3,4,5].map(i => <span key={i} className="material-symbols-outlined text-[16px] font-black">star</span>)}
                </div>
                <div className="text-sm font-bold text-text-muted">
                  Trusted by <span className="text-text-dark">25k+</span> high-achievers.
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side: Lifestyle Student Scene */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, x: 40 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1.2, ease: "circOut" }}
            className="relative z-20 mt-20 lg:mt-0"
          >
            {/* Main Scene Image Container */}
            <div className="relative rounded-[3rem] md:rounded-[4rem] overflow-hidden shadow-2xl border border-white/40 ring-1 ring-black/5 group max-w-[92%] ml-auto">
              <img 
                src="/images/hero-scene.png" 
                alt="Student studying with Studiplify" 
                className="w-full h-auto object-cover transform transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-60"></div>
              
              {/* Overlay Glass Reflection Effect */}
              <div className="absolute -inset-[100%] bg-gradient-to-tr from-white/0 via-white/5 to-white/0 rotate-45 animate-glass-shimmer pointer-events-none"></div>
            </div>

            {/* Floating Glassmorphism Cards */}
            
            {/* 1. AI Study Planner */}
            <motion.div 
              animate={{ y: [-20, 20, -20], rotate: [-1, 1, -1] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-4 -top-14 md:-left-14 md:-top-20 p-5 rounded-3xl bg-white/40 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/40 z-40 max-w-[200px] hidden sm:block"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-accent-orange/10 text-accent-orange flex items-center justify-center">
                  <span className="material-symbols-outlined text-lg font-black">auto_awesome</span>
                </div>
                <div>
                  <h4 className="font-black text-text-dark text-[10px] uppercase tracking-widest">AI Planner</h4>
                  <p className="text-[9px] text-text-muted font-bold">Optimizing...</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-2 w-full bg-surface-variant rounded-full overflow-hidden">
                  <motion.div animate={{ width: ['40%', '85%', '40%'] }} transition={{ duration: 4, repeat: Infinity }} className="h-full bg-accent-orange"></motion.div>
                </div>
                <div className="h-2 w-2/3 bg-surface-variant rounded-full"></div>
              </div>
            </motion.div>

            {/* 2. Focus Timer */}
            <motion.div 
              animate={{ y: [15, -15, 15], rotate: [1, -1, 1] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-10 -top-10 md:-right-16 md:-top-16 p-5 rounded-3xl bg-white/40 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/40 z-30 hidden sm:block"
            >
              <div className="text-center">
                <div className="text-2xl font-black text-text-dark tracking-tighter mb-1">24:59</div>
                <p className="text-[9px] text-accent-green font-black uppercase tracking-widest">Focus Mode</p>
                <div className="flex gap-1 justify-center mt-3">
                  {[1,2,3,4].map(i => <div key={i} className={`w-1.5 h-1.5 rounded-full ${i <= 3 ? 'bg-accent-green' : 'bg-surface-variant'}`}></div>)}
                </div>
              </div>
            </motion.div>

            {/* 3. Weekly Stats */}
            <motion.div 
              animate={{ x: [-15, 15, -15] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-16 bottom-1/4 md:-right-24 p-4 rounded-3xl bg-white/40 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/40 z-20 hidden lg:block"
            >
              <h4 className="font-black text-text-dark text-[9px] uppercase tracking-widest mb-3">Focus Distribution</h4>
              <div className="flex items-end gap-1.5 h-12">
                {[40, 70, 45, 90, 60, 80, 50].map((h, i) => (
                  <motion.div 
                    key={i}
                    animate={{ height: [`${h}%`, `${h+10}%`, `${h}%`] }}
                    transition={{ duration: 3, delay: i * 0.2, repeat: Infinity }}
                    className="w-1.5 bg-accent-purple/20 rounded-full relative overflow-hidden"
                  >
                    <div className="absolute bottom-0 w-full bg-accent-purple rounded-full" style={{ height: '70%' }}></div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* 4. Roadmap Generator */}
            <motion.div 
              animate={{ y: [12, -12, 12] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-2 bottom-1/4 md:-left-20 p-4 rounded-3xl bg-text-dark/80 backdrop-blur-xl text-white shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-white/10 z-10 hidden lg:block"
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-xs">route</span>
                </div>
                <div>
                  <h4 className="font-black text-[9px] uppercase tracking-widest">Roadmap Gen</h4>
                  <p className="text-[8px] text-white/50 font-bold">Physics: Dynamics</p>
                </div>
              </div>
            </motion.div>

            {/* 5. Task Tracker */}
            <motion.div 
              animate={{ y: [18, -18, 18] }}
              transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-14 -bottom-14 md:-left-8 md:-bottom-20 p-5 rounded-3xl bg-white/60 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-white/40 z-30 max-w-[190px]"
            >
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-black text-text-dark text-[9px] uppercase tracking-widest">Next Task</h4>
                <span className="text-[9px] font-black text-accent-orange">2h</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full border-2 border-accent-orange flex items-center justify-center">
                  <div className="w-3.5 h-3.5 rounded-full bg-accent-orange"></div>
                </div>
                <p className="text-[11px] font-bold text-text-dark leading-tight">Calculus Review</p>
              </div>
            </motion.div>

            {/* 6. Streak Counter */}
            <motion.div 
              animate={{ scale: [1, 1.05, 1], y: [5, -5, 5] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute right-14 -bottom-14 md:right-8 md:-bottom-20 p-3.5 rounded-2xl bg-gradient-to-br from-accent-orange/90 to-accent-purple/90 backdrop-blur-lg text-white shadow-[0_20px_40px_rgba(255,138,76,0.3)] border border-white/20 z-40"
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined font-black text-xl">local_fire_department</span>
                <div>
                  <div className="text-lg font-black leading-none">12</div>
                  <div className="text-[7px] font-black uppercase tracking-widest opacity-80">Day Streak</div>
                </div>
              </div>
            </motion.div>

          </motion.div>

        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="pt-16 md:pt-20 pb-24 md:pb-32 px-6 md:px-12 relative bg-surface-dim border-t border-border/50 overflow-hidden scroll-mt-24 md:scroll-mt-32">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-24">
            <span className="text-accent-orange font-black uppercase tracking-[0.3em] text-[11px] block mb-6">Omnichannel Mastery</span>
            <h2 className="text-4xl md:text-6xl font-black text-text-dark tracking-tighter leading-none mb-8">Ecosystem built for focus.</h2>
            <p className="text-text-muted font-medium max-w-2xl mx-auto text-lg opacity-80">Everything you need to orchestrate your academic life in one seamless environment.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12 items-stretch">
            {[
              { title: 'AI Study Planner', desc: 'Instantly generate a study schedule that adapts to your exams and learning pace.', icon: 'auto_awesome', color: 'text-accent-orange', bg: 'bg-accent-orange/10', href: '/dashboard/study-plan' },
              { title: 'Smart To-Do List', desc: 'Break down large assignments into small, manageable tasks automatically.', icon: 'check_circle', color: 'text-accent-purple', bg: 'bg-accent-purple/10', href: '/dashboard/tasks' },
              { title: 'Focus Timer', desc: 'Built-in Pomodoro timer with aesthetic backgrounds to keep you in the zone.', icon: 'timer', color: 'text-accent-green', bg: 'bg-accent-green/10', href: '/dashboard/focus' },
              { title: 'Goal Tracker', desc: 'Set academic goals and watch your progress visually grow over the semester.', icon: 'emoji_events', color: 'text-accent-orange', bg: 'bg-accent-orange/10', href: '/dashboard/rank' },
              { title: 'Productivity Stats', desc: 'Beautiful charts showing your study habits, most productive times, and more.', icon: 'bar_chart', color: 'text-accent-purple', bg: 'bg-accent-purple/10', href: '/dashboard/analytics' },
              { title: 'Study Groups', desc: 'Invite friends, share schedules, and stay accountable together.', icon: 'group', color: 'text-accent-green', bg: 'bg-accent-green/10', href: '/dashboard/assistant' }
            ].map((feature, i) => (
              <Link key={i} href={feature.href}>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                   className="bg-white p-8 md:p-10 lg:p-12 rounded-[2rem] md:rounded-[3rem] shadow-soft border border-border/60 hover:shadow-soft-lg hover:-translate-y-2 active:scale-[0.98] transition-all group relative overflow-hidden h-full cursor-pointer flex flex-col"
                >
                  <div className={`w-16 h-16 rounded-2xl ${feature.bg} ${feature.color} flex items-center justify-center mb-10 group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-inner-sm`}>
                    <span className="material-symbols-outlined text-[32px] font-bold">{feature.icon}</span>
                  </div>
                  <h3 className="text-2xl font-black text-text-dark mb-4 tracking-tight">{feature.title}</h3>
                  <p className="text-text-muted font-medium leading-relaxed opacity-80 mb-6">
                    {feature.desc}
                  </p>
                  <div className={`${feature.color} font-black text-[10px] uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all mt-auto`}>
                    Launch Tool <span className="material-symbols-outlined text-[16px] font-black">arrow_forward</span>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 md:py-32 px-6 md:px-12 relative bg-background overflow-hidden scroll-mt-24 md:scroll-mt-32">
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-surface-dim/30 pointer-events-none"></div>
        <div className="max-w-[1400px] mx-auto relative z-10">
          <div className="text-center mb-24">
            <span className="text-accent-purple font-black uppercase tracking-[0.3em] text-[11px] block mb-6">Tiered Orchestration</span>
            <h2 className="text-4xl md:text-6xl font-black text-text-dark tracking-tighter leading-none mb-8">Pricing for every ambition.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12 items-stretch">
            {[
              { name: 'Free', price: '$0', desc: 'Perfect for getting started.', features: ['3 AI Study Plans/mo', 'Basic Task Management', 'Standard Focus Timer'], btn: 'Start Free', popular: false },
              { name: 'Pro', price: '$9', priceId: 'price_pro', desc: 'For serious high-achievers.', features: ['Unlimited AI Plans', 'Advanced Analytics', 'Custom Focus Scenes', 'Priority AI Support'], btn: 'Go Pro', popular: true },
              { name: 'Team', price: '$19', priceId: 'price_team', desc: 'Collaborative study groups.', features: ['Everything in Pro', 'Shared Study Groups', 'Collaborative Tasks', 'Admin Dashboard'], btn: 'Start Team', popular: false }
            ].map((plan, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                className={`p-8 md:p-12 lg:p-14 rounded-[2.5rem] md:rounded-[3.5rem] border transition-all flex flex-col h-full ${plan.popular ? 'bg-white border-accent-orange/40 shadow-soft-2xl lg:scale-105 z-20 relative' : 'bg-white border-border/60 shadow-soft hover:shadow-soft-md'}`}
              >
                <div className="flex-grow">
                  <div className="h-14">
                    {plan.popular && <span className="inline-block px-5 py-2 bg-accent-orange text-white text-[10px] font-black uppercase tracking-[0.25em] rounded-full shadow-glow-primary">Protocol Favorite</span>}
                  </div>
                  <h3 className="text-2xl font-black text-text-dark mb-3 tracking-tight">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-6xl font-black text-text-dark tracking-tighter">{plan.price}</span>
                    <span className="text-text-muted font-bold text-lg opacity-60">/mo</span>
                  </div>
                  <p className="text-text-muted font-medium mb-12 opacity-80">{plan.desc}</p>
                  <ul className="space-y-6 mb-16">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-center gap-4 text-text-muted font-semibold text-[15px]">
                        <span className="material-symbols-outlined text-accent-green text-[22px] font-bold">check_circle</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link 
                  href={isAuthenticated ? '/pricing' : '/auth/signup'}
                  className={`w-full py-5 rounded-full font-black text-[13px] uppercase tracking-widest transition-all text-center mt-10 ${plan.popular ? 'bg-accent-orange text-white shadow-glow-primary hover:scale-[1.02] active:scale-95' : 'bg-surface-dim text-text-dark hover:bg-border active:scale-95'}`}
                >
                  {plan.btn}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof / Testimonials */}
      <section className="py-24 md:py-32 px-6 md:px-12 relative overflow-hidden bg-background">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent-purple/5 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="max-w-[1400px] mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-black text-text-dark tracking-tighter mb-20 leading-none">Loved by visionaries worldwide.</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12">
            {[
              { quote: "Studiplify completely changed how I prep for finals. The AI broke down my syllabus perfectly.", name: "Alex P.", school: "Computer Science" },
              { quote: "Finally a study app that doesn't look like a messy spreadsheet. It's so calming to use.", name: "Sarah M.", school: "Medical Student" },
              { quote: "The focus timer and stats keep me so motivated. I actually look forward to studying now.", name: "Jordan K.", school: "Law School" }
            ].map((t, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 md:p-10 lg:p-12 rounded-[2rem] md:rounded-[3rem] shadow-soft text-left border border-border/60 hover:shadow-soft-lg transition-all h-full flex flex-col justify-between"
              >
                <div className="flex gap-1 mb-8 text-accent-orange">
                  {[1,2,3,4,5].map(star => <span key={star} className="material-symbols-outlined text-[20px] font-bold">star</span>)}
                </div>
                <p className="text-xl font-bold text-text-dark mb-10 leading-relaxed tracking-tight">"{t.quote}"</p>
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-full border-2 border-surface-variant bg-white overflow-hidden shadow-sm">
                    <img src={`https://i.pravatar.cc/100?img=${i+40}`} alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-black text-text-dark text-lg leading-none mb-1">{t.name}</h4>
                    <p className="text-[12px] text-text-muted font-bold uppercase tracking-widest opacity-60">{t.school}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pt-16 md:pt-20 pb-24 md:pb-40 px-6 md:px-12 relative overflow-hidden">
        <div className="max-w-[1200px] mx-auto bg-text-dark rounded-[2.5rem] md:rounded-[4rem] p-10 md:p-32 text-center shadow-soft-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-accent-orange/10 to-accent-purple/10 opacity-50 group-hover:opacity-100 transition-opacity duration-1000"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl md:text-7xl font-black text-white tracking-tighter mb-10 leading-[0.95]">
              Ready to architect <br className="hidden sm:block"/>your <span className="text-accent-orange">success?</span>
            </h2>
            <p className="text-xl text-white/70 font-medium mb-14 max-w-2xl mx-auto leading-relaxed">
              Join thousands of students who are studying smarter, not harder. Initialize your protocol today.
            </p>
            {mounted && (
              <Link 
                href={isAuthenticated ? '/dashboard' : '/auth/signup'}
                className="bg-accent-orange text-white px-14 py-6 rounded-full font-black text-[16px] uppercase tracking-widest shadow-glow-primary hover:scale-105 active:scale-95 transition-all text-center inline-block"
              >
                Get Started for Free
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
