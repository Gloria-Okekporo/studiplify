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
      <section id="architecture" className="relative min-h-[75vh] md:min-h-[85vh] flex items-center justify-center pt-16 md:pt-20 pb-12 md:pb-24 px-6 md:px-12 overflow-hidden">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Left Side: Copy & CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-30"
          >

            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-[92px] leading-[0.95] font-extrabold tracking-tight text-text-dark mb-5 drop-shadow-sm">
              Study Smarter. <br className="hidden sm:block"/>
              <span className="relative inline-block mt-2">
                <span className="absolute -inset-2 bg-accent-orange/20 blur-2xl rounded-full opacity-40 animate-pulse-glow"></span>
                <span 
                  className="relative bg-gradient-to-r from-accent-orange via-accent-purple to-accent-orange bg-[length:200%_auto] animate-text-shimmer bg-clip-text text-transparent drop-shadow-2xl"
                  style={{ WebkitBackgroundClip: 'text' }}
                >
                  Stress Less.
                </span>
              </span>
            </h1>

            <p className="text-lg md:text-xl text-text-muted leading-relaxed font-medium mb-8 max-w-xl">
              Studiplify helps students generate personalized AI study plans, manage tasks, track goals, and stay productive without the burnout.
            </p>

            <div className="flex flex-col sm:flex-row gap-5">
              {mounted && (
                <Link 
                  href={isAuthenticated ? '/dashboard/study-plan' : '/auth/signup'} 
                  className="w-full sm:w-auto btn-primary text-lg px-8 py-4 transition-transform active:scale-95 text-center flex items-center justify-center"
                >
                  Create My Study Plan
                </Link>
              )}

              <Link 
                href="#features"
                className="w-full sm:w-auto btn-secondary text-lg px-8 py-4 flex items-center justify-center gap-3 transition-transform active:scale-95"
              >
                <span className="material-symbols-outlined">play_circle</span>
                See How It Works
              </Link>
            </div>

            {/* Social Proof */}
            <div className="mt-12 flex items-center gap-5">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-white overflow-hidden shadow-sm">
                    <img src={`https://i.pravatar.cc/100?img=${i+20}`} alt="Student" />
                  </div>
                ))}
              </div>
              <div className="text-sm font-medium text-text-muted">
                Joined by <span className="font-bold text-text-dark">12,000+</span> students.
              </div>
            </div>
          </motion.div>

          {/* Right Side: Floating Mockup */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, ease: "circOut", delay: 0.1 }}
            className="relative"
          >
            {/* Background Blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-accent-orange/10 rounded-full blur-[60px] md:blur-[80px] -z-10 animate-pulse"></div>
            
            {/* Main App Card */}
            <div className="relative bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-soft-lg border border-border">
              <div className="flex justify-between items-center mb-8 pb-6 border-b border-surface-variant">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-accent-orange/10 text-accent-orange flex items-center justify-center">
                    <span className="material-symbols-outlined">calendar_month</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-text-dark text-lg">Today's Focus</h3>
                    <p className="text-xs text-text-muted font-medium">3 Tasks Remaining</p>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center">
                  <span className="material-symbols-outlined text-text-muted text-sm">more_horiz</span>
                </div>
              </div>

              {/* Task List */}
              <div className="space-y-4">
                {[
                  { title: "Review Calculus Integration", time: "10:00 AM", tag: "High Priority", color: "text-accent-orange", bg: "bg-accent-orange/10", href: "/dashboard/tasks" },
                  { title: "Read Biology Chapter 4", time: "02:00 PM", tag: "Reading", color: "text-accent-purple", bg: "bg-accent-purple/10", href: "/dashboard/tasks" },
                  { title: "Complete Physics Lab", time: "05:30 PM", tag: "Assignment", color: "text-accent-green", bg: "bg-accent-green/10", href: "/dashboard/tasks" }
                ].map((task, i) => (
                  <Link key={i} href={task.href}>
                    <div className="group p-4 rounded-2xl hover:bg-surface-variant transition-colors flex items-center gap-4 cursor-pointer">
                      <div className="w-6 h-6 rounded-full border-2 border-border flex-shrink-0 group-hover:border-accent-orange transition-colors"></div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-text-dark">{task.title}</h4>
                        <p className="text-xs text-text-muted font-medium">{task.time}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase ${task.color} ${task.bg}`}>
                        {task.tag}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Floating Elements */}
            <Link href="/dashboard/analytics">
              <motion.div 
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -right-4 -top-8 md:-right-8 bg-white p-3 md:p-4 rounded-xl md:rounded-2xl shadow-soft-lg border border-border flex items-center gap-3 z-20 cursor-pointer hover:scale-105 transition-transform"
              >
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-accent-green/10 text-accent-green flex items-center justify-center">
                  <span className="material-symbols-outlined text-sm md:text-base">trending_up</span>
                </div>
                <div>
                  <p className="text-xs md:text-sm font-bold text-text-dark">85% Focus Score</p>
                  <p className="text-[10px] md:text-xs text-text-muted">Great job today!</p>
                </div>
              </motion.div>
            </Link>

            <Link href="/dashboard/study-plan">
              <motion.div 
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -left-4 -bottom-6 md:-left-10 bg-white p-4 md:p-5 rounded-xl md:rounded-2xl shadow-soft-lg border border-border z-20 cursor-pointer hover:scale-105 transition-transform"
              >
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1 md:mb-2">Weekly Goal</p>
                <div className="flex items-end gap-2">
                  <span className="text-2xl md:text-3xl font-extrabold text-text-dark">24</span>
                  <span className="text-[10px] md:text-sm text-text-muted font-medium mb-1">/ 30 hrs</span>
                </div>
                <div className="w-20 md:w-full h-1.5 md:h-2 bg-surface-variant rounded-full mt-2 md:mt-3 overflow-hidden">
                  <div className="h-full bg-accent-purple w-4/5 rounded-full"></div>
                </div>
              </motion.div>
            </Link>
          </motion.div>

        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32 px-6 md:px-12 relative bg-surface-dim border-t border-border/50">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-24">
            <span className="text-accent-orange font-black uppercase tracking-[0.3em] text-[11px] block mb-6">Omnichannel Mastery</span>
            <h2 className="text-4xl md:text-6xl font-black text-text-dark tracking-tighter leading-none mb-8">Ecosystem built for focus.</h2>
            <p className="text-text-muted font-medium max-w-2xl mx-auto text-lg opacity-80">Everything you need to orchestrate your academic life in one seamless environment.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
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
                  className="bg-white p-8 md:p-10 lg:p-12 rounded-[2rem] md:rounded-[3rem] shadow-soft border border-border/60 hover:shadow-soft-lg hover:-translate-y-2 transition-all group relative overflow-hidden h-full cursor-pointer"
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
      <section id="pricing" className="py-20 md:py-32 px-6 md:px-12 relative bg-background overflow-hidden">
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
                className={`p-8 md:p-12 lg:p-14 rounded-[2.5rem] md:rounded-[3.5rem] border transition-all flex flex-col justify-between ${plan.popular ? 'bg-white border-accent-orange/40 shadow-soft-2xl lg:scale-105 z-20' : 'bg-white border-border/60 shadow-soft hover:shadow-soft-md'}`}
              >
                <div>
                  {plan.popular && <span className="inline-block px-5 py-2 bg-accent-orange text-white text-[10px] font-black uppercase tracking-[0.25em] rounded-full mb-8 shadow-glow-primary">Protocol Favorite</span>}
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
                  href={isAuthenticated ? '/dashboard' : '/auth/signup'}
                  className={`w-full py-5 rounded-full font-black text-[13px] uppercase tracking-widest transition-all text-center ${plan.popular ? 'bg-accent-orange text-white shadow-glow-primary hover:scale-[1.02] active:scale-95' : 'bg-surface-dim text-text-dark hover:bg-border active:scale-95'}`}
                >
                  {plan.btn}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof / Testimonials */}
      <section className="py-20 md:py-32 px-6 md:px-12 relative overflow-hidden bg-background">
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
                className="bg-white p-8 md:p-10 lg:p-12 rounded-[2rem] md:rounded-[3rem] shadow-soft text-left border border-border/60 hover:shadow-soft-lg transition-all"
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
      <section className="py-20 md:py-32 px-6 md:px-12 relative">
        <div className="max-w-[1200px] mx-auto bg-text-dark rounded-[2.5rem] md:rounded-[4rem] p-10 md:p-32 text-center shadow-soft-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-accent-orange/10 to-accent-purple/10 opacity-50 group-hover:opacity-100 transition-opacity duration-1000"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl md:text-7xl font-black text-white tracking-tighter mb-10 leading-[0.95]">
              Ready to architect <br className="hidden sm:block"/>your <span className="text-accent-orange">success?</span>
            </h2>
            <p className="text-xl text-white/70 font-medium mb-14 max-w-2xl mx-auto leading-relaxed">
              Join thousands of students who are studying smarter, not harder. Initialize your protocol today.
            </p>
            <Link 
              href={isAuthenticated ? '/dashboard' : '/auth/signup'}
              className="bg-accent-orange text-white px-14 py-6 rounded-full font-black text-[16px] uppercase tracking-widest shadow-glow-primary hover:scale-105 active:scale-95 transition-all text-center inline-block"
            >
              Get Started for Free
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
