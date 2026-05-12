'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { sendMessage } from '@/lib/actions/chat';
import { useToast } from '@/hooks/useToast';
import { useAuth } from '@/hooks/useAuth';

export default function AssistantClient({ initialHistory }: { initialHistory: any[] }) {
  const { logout, user } = useAuth();
  const { showToast } = useToast();
  const [messages, setMessages] = useState<any[]>(initialHistory);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  type NavItem = {
    icon: string;
    label: string;
    href?: string;
    active?: boolean;
    isAction?: boolean;
    action?: () => Promise<void> | void;
  };

  const navItems: NavItem[] = [
    { icon: 'grid_view', label: 'Dashboard', href: '/dashboard' },
    { icon: 'event_note', label: 'Planner', href: '/dashboard/study-plan' },
    { icon: 'auto_awesome', label: 'Assistant', active: true, href: '/dashboard/assistant' },
    { icon: 'task_alt', label: 'Tasks', href: '/dashboard/tasks' },
    { icon: 'logout', label: 'Sign Out', action: logout, isAction: true },
  ];

  const desktopNavItems: NavItem[] = [
    { icon: 'grid_view', label: 'Dashboard', href: '/dashboard' },
    { icon: 'event_note', label: 'Study Plans', href: '/dashboard/study-plan' },
    { icon: 'summarize', label: 'Summarizer', href: '/dashboard/summarizer' },
    { icon: 'quiz', label: 'Quizzes', href: '/dashboard/quiz' },
    { icon: 'task_alt', label: 'Tasks', href: '/dashboard/tasks' },
    { icon: 'insights', label: 'Analytics', href: '/dashboard/analytics' },
    { icon: 'auto_awesome', label: 'AI Assistant', active: true, href: '/dashboard/assistant' },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e?: React.FormEvent, customMsg?: string) => {
    if (e) e.preventDefault();
    const msgToSend = customMsg || input;
    if (!msgToSend.trim() || isTyping) return;

    const userMsg = msgToSend.trim();
    setInput('');
    
    // Optimistic UI update
    const optimisticMsg = {
      id: Date.now().toString(),
      role: 'user',
      content: userMsg,
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, optimisticMsg]);
    setIsTyping(true);

    try {
      const res = await sendMessage(userMsg, messages);
      if (res.success && res.aiMessage) {
        setMessages(prev => {
          const filtered = prev.filter(m => m.id !== optimisticMsg.id);
          return [...filtered, res.userMessage, res.aiMessage];
        });
      } else {
        showToast(res.error || 'Failed to get response', 'error');
        // Remove optimistic message if failed
        setMessages(prev => prev.filter(m => m.id !== optimisticMsg.id));
      }
    } catch (error) {
      showToast('An unexpected error occurred', 'error');
      setMessages(prev => prev.filter(m => m.id !== optimisticMsg.id));
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex h-screen bg-background text-text-dark font-body selection:bg-accent-orange/30 selection:text-text-dark overflow-hidden">

      {/* Unified Sidebar */}
      <aside className="sidebar-container hidden lg:flex">
        <Link href="/" className="mb-14 group">
          <div className="w-14 h-14 rounded-xl bg-text-dark flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-all duration-500">
            <span className="material-symbols-outlined text-[28px] font-bold">orbit</span>
          </div>
        </Link>
        
        <nav className="flex-1 flex flex-col gap-md">
          {desktopNavItems.map((item, i) => (
            item.isAction ? (
              <button 
                key={i} 
                onClick={item.action} 
                className="w-14 h-14 rounded-xl flex flex-col items-center justify-center text-text-muted hover:text-red-500 hover:bg-red-50 transition-all group"
              >
                <span className="material-symbols-outlined text-[26px] font-bold">{item.icon}</span>
                <span className="text-[8px] font-black uppercase tracking-widest mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Exit</span>
              </button>
            ) : (
              <Link 
                key={i} 
                href={item.href || '#'} 
                className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center transition-all group relative ${item.active ? 'bg-accent-orange text-white shadow-glow-orange' : 'text-text-muted hover:text-text-dark hover:bg-surface-muted'}`}
              >
                <span className="material-symbols-outlined text-[26px] font-bold">{item.icon}</span>
                {item.active && <motion.div layoutId="nav-pill" className="absolute -left-1 w-1 h-8 bg-accent-orange rounded-full" />}
              </Link>
            )
          ))}
        </nav>

        <div className="mt-auto">
          <div className="btn-icon bg-surface-muted border border-border/40 text-accent-orange font-black italic shadow-inner-sm overflow-hidden">
            {user?.full_name?.charAt(0) || 'S'}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative bg-background pb-20 lg:pb-0">
        
        {/* Unified Top Header */}
        <header className="header-container">
          <div className="flex flex-col">
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 rounded-full bg-accent-orange shadow-sm animate-pulse"></div>
              <h1 className="text-3xl lg:text-4xl font-black text-text-dark tracking-tighter leading-none">Neural Assistant</h1>
            </div>
            <p className="text-[11px] lg:text-[12px] font-black text-text-muted mt-3 uppercase tracking-[0.4em] ml-7 opacity-60">Cognitive Link Active</p>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="btn-icon bg-white shadow-sm">
              <span className="material-symbols-outlined text-[26px]">more_vert</span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-hidden px-4 md:px-8 lg:px-14 pb-14 flex flex-col">
          <div className="flex-1 card-premium !rounded-[3.5rem] flex flex-col overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-accent-orange/[0.03] to-transparent pointer-events-none animate-pulse-glow"></div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-8 lg:p-14 space-y-10 hide-scrollbar relative z-10">
              {messages.length === 0 ? (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 rounded-[2rem] bg-accent-orange/5 flex items-center justify-center text-accent-orange mb-8 shadow-inner-sm">
                    <span className="material-symbols-outlined text-[40px] font-bold">auto_awesome</span>
                  </div>
                  <h2 className="text-4xl lg:text-5xl font-black text-text-dark tracking-tighter mb-4 leading-none">Initialize <span className="text-accent-orange italic">Intelligence.</span></h2>
                  <p className="text-lg font-medium text-text-muted max-w-lg leading-relaxed opacity-80">Your neural study companion is synchronized and ready for complex synthesis.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-14 w-full max-w-2xl">
                    {[
                      { icon: 'psychology', text: 'Explain Quantum Entanglement', bg: 'bg-accent-orange/5', color: 'text-accent-orange' },
                      { icon: 'edit_note', text: 'Draft my Research Hypothesis', bg: 'bg-accent-purple/5', color: 'text-accent-purple' },
                      { icon: 'history_edu', text: 'Summarize the Napoleonic Wars', bg: 'bg-accent-green/5', color: 'text-accent-green' },
                      { icon: 'quiz', text: 'Generate a Calculus Drill', bg: 'bg-accent-orange/5', color: 'text-accent-orange' }
                    ].map((suggestion, i) => (
                      <button 
                        key={i} 
                        onClick={() => handleSend(undefined, suggestion.text)}
                        className="card-interactive p-8 !rounded-[2.5rem] flex flex-col items-start text-left"
                      >
                        <div className={`w-12 h-12 rounded-2xl ${suggestion.bg} ${suggestion.color} flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform`}>
                          <span className="material-symbols-outlined text-[24px] font-bold">{suggestion.icon}</span>
                        </div>
                        <span className="text-[16px] font-black text-text-dark mb-2 tracking-tight">{suggestion.text}</span>
                        <span className="text-[11px] font-black text-text-muted uppercase tracking-widest opacity-60">Neural Request</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <AnimatePresence initial={false}>
                  {messages.map((msg, index) => (
                    <motion.div 
                      key={msg.id || index}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className={`flex items-start gap-5 lg:gap-8 w-full ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                      <div className={`w-12 h-12 lg:w-14 lg:h-14 shrink-0 rounded-2xl flex items-center justify-center mt-1 shadow-sm ${msg.role === 'user' ? 'bg-accent-orange text-white shadow-glow-orange' : 'bg-white border border-border/40 text-accent-orange'}`}>
                        <span className="material-symbols-outlined text-[24px] lg:text-[28px] font-bold">
                          {msg.role === 'user' ? 'person_filled' : 'smart_toy'}
                        </span>
                      </div>
                      <div className={`flex flex-col max-w-[85%] lg:max-w-[75%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className={`p-6 lg:p-8 rounded-[2.5rem] text-[16px] lg:text-[17px] font-medium leading-relaxed shadow-sm ${
                          msg.role === 'user' 
                            ? 'bg-accent-orange text-white rounded-tr-[0.5rem]' 
                            : 'bg-surface-muted/50 border border-border/30 text-text-dark rounded-tl-[0.5rem]'
                        }`}>
                          {msg.content}
                        </div>
                        <div className="mt-3 flex items-center gap-3 px-4">
                          <span className="text-[11px] font-black text-text-muted uppercase tracking-widest opacity-60">
                            {msg.role === 'user' ? 'Verified Input' : 'Neural Echo'}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-border"></span>
                          <span className="text-[11px] font-black text-text-muted opacity-40 uppercase tracking-widest">{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-surface-muted/50 p-6 rounded-[2.5rem] border border-border/30 flex items-center gap-5 shadow-inner-sm">
                    <div className="flex gap-2">
                      <motion.div animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1 }} className="w-2.5 h-2.5 rounded-full bg-accent-orange" />
                      <motion.div animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-2.5 h-2.5 rounded-full bg-accent-orange" />
                      <motion.div animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-2.5 h-2.5 rounded-full bg-accent-orange" />
                    </div>
                    <span className="text-[11px] font-black text-text-muted uppercase tracking-widest opacity-60">Synthesizing Response...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-8 lg:p-10 bg-surface-muted/30 border-t border-border/40 relative z-20">
              <form onSubmit={handleSend} className="relative group/input">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask your neural assistant..." 
                  className="w-full h-[80px] bg-white border border-border/40 rounded-full pl-10 pr-44 text-[16px] lg:text-[17px] text-text-dark font-black placeholder:text-text-muted/30 focus:outline-none focus:border-accent-orange transition-all shadow-inner-sm"
                  disabled={isTyping}
                />
                <div className="absolute right-3 top-3 bottom-3 flex items-center gap-2">
                  <button type="button" className="btn-icon text-text-muted hover:text-accent-orange">
                    <span className="material-symbols-outlined text-[24px] font-bold">attach_file</span>
                  </button>
                  <button type="submit" disabled={!input.trim() || isTyping} className="btn-primary !h-full !px-10 !text-[14px] disabled:opacity-30">
                    Initialize
                  </button>
                </div>
              </form>
              
              <div className="mt-8 flex flex-wrap items-center justify-center gap-10">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-accent-green shadow-glow-green"></span>
                  <span className="text-[10px] font-black text-text-muted uppercase tracking-widest opacity-60">Gemini 1.5 Pro</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-accent-purple shadow-glow-purple"></span>
                  <span className="text-[10px] font-black text-text-muted uppercase tracking-widest opacity-60">Neural Encryption</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-accent-orange shadow-glow-orange"></span>
                  <span className="text-[10px] font-black text-text-muted uppercase tracking-widest opacity-60">Context Aware</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Bottom Nav */}
        <nav className="fixed bottom-6 left-6 right-6 glass-effect shadow-2xl rounded-full p-2.5 flex items-center justify-around z-50 lg:hidden pointer-events-auto">
          {navItems.map((item, i) => (
            item.isAction ? (
              <button key={i} onClick={item.action} className="btn-icon text-text-muted hover:text-red-500">
                <span className="material-symbols-outlined text-[28px] font-bold">{item.icon}</span>
              </button>
            ) : (
              <Link key={i} href={item.href || '#'} className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${item.active ? 'bg-accent-orange text-white shadow-glow-orange' : 'text-text-muted hover:bg-surface-muted'}`}>
                <span className="material-symbols-outlined text-[28px] font-bold">{item.icon}</span>
              </Link>
            )
          ))}
        </nav>
      </main>
    </div>
  );
}
