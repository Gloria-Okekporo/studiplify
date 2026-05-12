'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';

type Screen = 'onboarding' | 'dashboard' | 'planner' | 'tasks' | 'timer' | 'stats' | 'profile';

export default function MobilePreviewPage() {
  const [activeScreen, setActiveScreen] = useState<Screen>('dashboard');
  const [isOnboarded, setIsOnboarded] = useState(true);

  const screens: Record<Screen, React.ReactNode> = {
    onboarding: (
      <div className="h-full flex flex-col p-10 justify-between">
        <div className="mt-20">
          <div className="w-20 h-20 bg-pastel-purple rounded-3xl flex items-center justify-center mb-10 shadow-glow">
            <span className="material-symbols-outlined text-white text-4xl font-black">psychology</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter leading-none mb-6">Master your <br/>Learning OS.</h1>
          <p className="text-on-surface-variant opacity-60 leading-relaxed">Let AI architect your study schedule and reach your peak cognitive potential.</p>
        </div>
        <button 
          onClick={() => { setIsOnboarded(true); setActiveScreen('dashboard'); }}
          className="w-full bg-white text-background py-5 rounded-[2rem] font-black text-xl shadow-glow"
        >
          Initialize Sync
        </button>
      </div>
    ),
    dashboard: (
      <div className="p-6 space-y-8">
        <header className="flex justify-between items-center mt-4">
          <div>
            <h2 className="text-3xl font-black text-white tracking-tighter">Hi, Alex</h2>
            <p className="text-xs font-black text-pastel-purple uppercase tracking-widest opacity-60">Neural Status: Optimal</p>
          </div>
          <div className="w-12 h-12 rounded-full border border-white/10 p-0.5">
            <img src="https://i.pravatar.cc/100?u=alex" className="w-full h-full rounded-full" alt="Profile" />
          </div>
        </header>

        <div className="grid grid-cols-2 gap-4">
          <div className="glass-card rounded-[2.5rem] p-6 border-pastel-pink/20">
            <span className="material-symbols-outlined text-pastel-pink mb-4">local_fire_department</span>
            <div className="text-3xl font-black text-white tracking-tighter">42</div>
            <p className="text-[10px] font-bold text-on-surface-variant opacity-40 uppercase tracking-widest">Cycles</p>
          </div>
          <div className="glass-card rounded-[2.5rem] p-6 border-pastel-blue/20">
            <span className="material-symbols-outlined text-pastel-blue mb-4">star</span>
            <div className="text-3xl font-black text-white tracking-tighter">3.98</div>
            <p className="text-[10px] font-bold text-on-surface-variant opacity-40 uppercase tracking-widest">Peak GPA</p>
          </div>
        </div>

        <div className="glass-card rounded-[3rem] p-8 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-black text-white tracking-tight">Active Mission</h3>
            <span className="text-[10px] font-black text-pastel-purple uppercase tracking-widest">In Progress</span>
          </div>
          <div className="space-y-4">
            <div className="text-lg font-bold text-white">Quantum Synthesis Phase II</div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: '65%' }} className="h-full bg-pastel-purple shadow-glow" />
            </div>
          </div>
        </div>
      </div>
    ),
    planner: (
      <div className="p-6 space-y-8">
        <h2 className="text-3xl font-black text-white tracking-tighter mt-4">Timeline</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, i) => (
            <div key={day} className={`min-w-[70px] py-6 rounded-3xl border flex flex-col items-center gap-2 ${i === 2 ? 'bg-pastel-purple text-background border-pastel-purple' : 'bg-white/5 border-white/5 text-on-surface-variant'}`}>
              <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{day}</span>
              <span className="text-xl font-black">{10 + i}</span>
            </div>
          ))}
        </div>
        <div className="space-y-4">
          {[
            { time: '09:00', title: 'Advanced Logic', type: 'Lecture' },
            { time: '11:30', title: 'Deep Focus', type: 'Self' },
            { time: '14:00', title: 'Neural Systems', type: 'Lab' }
          ].map((item, i) => (
            <div key={i} className="flex gap-6 items-start">
              <div className="text-xs font-black text-on-surface-variant opacity-40 w-12 pt-1">{item.time}</div>
              <div className="flex-1 glass-card rounded-[2rem] p-6 border-white/5">
                <div className="font-black text-white mb-1">{item.title}</div>
                <div className="text-[10px] font-bold text-on-surface-variant opacity-40 uppercase tracking-widest">{item.type}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    tasks: (
      <div className="p-6 space-y-8">
        <h2 className="text-3xl font-black text-white tracking-tighter mt-4">Missions</h2>
        <div className="space-y-4">
          {[
            { title: 'Finish Logic Proofs', priority: 'High', color: 'text-pastel-purple' },
            { title: 'Read Physics Ch. 4', priority: 'Med', color: 'text-pastel-pink' },
            { title: 'Team Sync', priority: 'Low', color: 'text-pastel-blue' }
          ].map((task, i) => (
            <div key={i} className="glass-card rounded-[2.5rem] p-6 border-white/5 flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="w-6 h-6 rounded-full border-2 border-white/10 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-pastel-purple opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <span className="font-bold text-white">{task.title}</span>
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${task.color}`}>{task.priority}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    timer: (
      <div className="h-full flex flex-col items-center justify-center p-10 space-y-12">
        <span className="text-[10px] font-black text-pastel-pink uppercase tracking-[0.4em] mb-4">Deep Focus</span>
        <div className="relative w-72 h-72 flex items-center justify-center">
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle cx="50%" cy="50%" r="45%" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
            <motion.circle 
              cx="50%" cy="50%" r="45%" 
              fill="transparent" 
              stroke="#ffb4e1" 
              strokeWidth="4" 
              strokeDasharray="280"
              strokeDashoffset="70"
              strokeLinecap="round"
            />
          </svg>
          <div className="text-center">
            <div className="text-6xl font-black text-white tracking-tighter">24:59</div>
            <div className="text-[10px] font-black text-on-surface-variant opacity-40 uppercase tracking-widest mt-2">Neural Syncing</div>
          </div>
        </div>
        <button className="px-12 py-5 rounded-full bg-pastel-pink text-background font-black text-xl shadow-glow-primary">Pause Mission</button>
      </div>
    ),
    stats: (
      <div className="p-6 space-y-8">
        <h2 className="text-3xl font-black text-white tracking-tighter mt-4">Insights</h2>
        <div className="glass-card rounded-[3rem] p-10 flex flex-col items-center gap-6">
          <div className="w-48 h-48 rounded-full border-[15px] border-white/5 relative flex items-center justify-center">
             <div className="text-center">
                <div className="text-4xl font-black text-white">84%</div>
                <div className="text-[10px] font-black text-on-surface-variant opacity-40 uppercase tracking-widest">Efficiency</div>
             </div>
          </div>
          <div className="text-center">
            <p className="text-on-surface-variant font-medium opacity-60">Neural flow peaked at <span className="text-pastel-purple font-black">14:00 PM</span> today.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="glass-card rounded-[2rem] p-6 border-white/5">
            <div className="text-2xl font-black text-white">12.4h</div>
            <p className="text-[10px] font-bold text-on-surface-variant opacity-40 uppercase tracking-widest">Focus Time</p>
          </div>
          <div className="glass-card rounded-[2rem] p-6 border-white/5">
            <div className="text-2xl font-black text-white">92%</div>
            <p className="text-[10px] font-bold text-on-surface-variant opacity-40 uppercase tracking-widest">Task Clear</p>
          </div>
        </div>
      </div>
    ),
    profile: (
      <div className="p-6 space-y-8 text-center">
        <div className="mt-10 flex flex-col items-center">
          <div className="w-28 h-28 rounded-[2.5rem] bg-gradient-to-tr from-pastel-purple to-pastel-blue p-1 mb-6 shadow-glow">
            <img src="https://i.pravatar.cc/200?u=alex" className="w-full h-full rounded-[2.2rem] object-cover" alt="Alex" />
          </div>
          <h2 className="text-3xl font-black text-white tracking-tighter">Alex Sterling</h2>
          <p className="text-sm font-bold text-pastel-purple uppercase tracking-widest opacity-60">Intelligence Tier: Pro</p>
        </div>

        <div className="space-y-3">
          {['Profile Settings', 'Neural Preferences', 'Notification Sync', 'Security Protocols', 'Support Forge'].map((item) => (
            <div key={item} className="glass-card rounded-2xl p-5 flex justify-between items-center border-white/5 cursor-pointer hover:bg-white/5 transition-all group">
              <span className="font-bold text-on-surface-variant group-hover:text-white transition-colors">{item}</span>
              <span className="material-symbols-outlined text-sm opacity-20">chevron_right</span>
            </div>
          ))}
        </div>

        <button className="w-full py-5 rounded-2xl bg-white/5 border border-white/10 text-on-error font-black uppercase tracking-widest text-xs mt-10">Deactivate Node</button>
      </div>
    )
  };

  return (
    <div className="min-h-screen bg-[#0d0c12] flex items-center justify-center p-8 overflow-hidden relative">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-pastel-purple/5 blur-[180px] rounded-full"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-pastel-blue/5 blur-[160px] rounded-full"></div>

      <div className="flex flex-col items-center gap-12 max-w-4xl w-full">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-black text-white tracking-tighter">Mobile Simulation</h1>
          <p className="text-on-surface-variant font-medium opacity-60">Interactive iOS-inspired Studiplify Experience</p>
        </div>

        {/* iPhone 15 Pro Max Frame (CSS-based) */}
        <div className="relative w-[400px] h-[820px] bg-[#1a1a1e] rounded-[4.5rem] border-[12px] border-[#2c2c2e] shadow-[0_0_120px_rgba(0,0,0,0.8)] overflow-hidden scale-[0.85] md:scale-100 transition-transform origin-center">
          {/* Dynamic Island */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-9 bg-black rounded-full z-[100] flex items-center justify-between px-4">
            <div className="w-2 h-2 rounded-full bg-[#1a1a1e]"></div>
            <div className="w-8 h-2 rounded-full bg-[#1a1a1e]"></div>
          </div>

          {/* Screen Content */}
          <div className="h-full bg-[#0d0c12] overflow-y-auto overflow-x-hidden pt-12 pb-24 scrollbar-hide relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeScreen}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="h-full"
              >
                {screens[activeScreen]}
              </motion.div>
            </AnimatePresence>

            {/* Bottom Tab Bar (Floating Glass) */}
            {isOnboarded && activeScreen !== 'onboarding' && (
              <div className="absolute bottom-6 left-6 right-6 h-20 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] flex items-center justify-around px-2 z-[90] shadow-2xl">
                {[
                  { id: 'dashboard', icon: 'grid_view' },
                  { id: 'planner', icon: 'event_repeat' },
                  { id: 'timer', icon: 'timer' },
                  { id: 'tasks', icon: 'task_alt' },
                  { id: 'profile', icon: 'person' }
                ].map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => setActiveScreen(item.id as Screen)}
                    className={`w-14 h-14 flex items-center justify-center rounded-2xl transition-all ${activeScreen === item.id ? 'bg-pastel-purple text-background shadow-glow' : 'text-on-surface-variant hover:text-white'}`}
                  >
                    <span className="material-symbols-outlined font-black text-[28px]">{item.icon}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Home Indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-white/20 rounded-full z-[100]"></div>
        </div>

        <div className="flex gap-4">
          <Link href="/dashboard" className="px-8 py-3 rounded-full bg-white/5 border border-white/10 text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all">Back to Web Dashboard</Link>
          <Link href="/" className="px-8 py-3 rounded-full bg-white/5 border border-white/10 text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all">Landing Page</Link>
        </div>
      </div>
    </div>
  );
}
