'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '@/components/Common/Logo';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Navigation Links definition
  const navLinks = [
    { name: 'Features', href: '/#features' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Pricing', href: '/#pricing' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' }
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    await logout();
    router.refresh();
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ease-in-out px-6 py-4 ${
        scrolled ? "md:px-12 py-3" : "md:px-12 py-6"
      }`}
    >
      {/* Glass Container */}
      <div 
        className={`max-w-[1440px] mx-auto flex items-center justify-between px-6 md:px-10 h-16 md:h-20 rounded-[2rem] transition-all duration-500 ${
          scrolled 
            ? "bg-white/80 backdrop-blur-2xl border border-white/50 shadow-lg shadow-black/[0.03]" 
            : "bg-transparent border border-transparent"
        }`}
      >
        {/* Logo Section */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-shrink-0"
        >
          <Logo iconContainerSize="w-10 h-10 rounded-xl" textSize="text-xl md:text-2xl" />
        </motion.div>
        
        {/* Centered Navigation Links (Desktop) */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((item, i) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`relative px-5 py-2.5 rounded-full text-[13px] font-bold tracking-tight transition-all duration-300 group ${
                    isActive ? "text-accent-orange" : "text-text-muted hover:text-text-dark"
                  }`}
                >
                  <span className="relative z-10">{item.name}</span>
                  
                  {/* Hover Pill Background */}
                  <div className="absolute inset-0 bg-accent-orange/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                  
                  {/* Active Indicator */}
                  {isActive && (
                    <motion.div 
                      className="absolute inset-0 bg-accent-orange/10 rounded-full z-0"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </div>

        {/* Authentication Buttons (Right) */}
        <div className="flex items-center gap-3 md:gap-5">
          {mounted && (
            isAuthenticated ? (
              <div className="flex items-center gap-4">
                <button 
                  onClick={handleSignOut}
                  className="h-11 px-6 rounded-full bg-surface-muted text-text-dark font-black text-[11px] uppercase tracking-widest hover:bg-border transition-all border border-border/30 active:scale-95 shadow-sm"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 md:gap-4">
                <Link 
                  href="/auth/login" 
                  className="hidden sm:flex items-center h-11 px-6 text-[13px] font-black text-text-dark/60 hover:text-accent-orange uppercase tracking-widest transition-colors"
                >
                  Sign In
                </Link>
                <Link href="/auth/signup">
                  <button className="h-11 md:h-12 px-6 md:px-8 rounded-full bg-accent-orange text-white font-black text-[11px] uppercase tracking-widest hover:scale-[1.03] hover:shadow-glow-orange active:scale-95 transition-all shadow-md">
                    Get Started
                  </button>
                </Link>
              </div>
            )
          )}

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden w-10 h-10 rounded-full flex items-center justify-center bg-surface-dim hover:bg-accent-orange/10 hover:text-accent-orange transition-all border border-border/40"
          >
            <span className="material-symbols-outlined text-[24px] font-black">
              {isOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden absolute top-[calc(100%+8px)] left-6 right-6 p-6 rounded-[2.5rem] bg-white border border-border/40 shadow-2xl z-[110] overflow-hidden"
          >
            <div className="flex flex-col space-y-2">
              <div className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] mb-4 ml-4">Navigation</div>
              {navLinks.map((item) => (
                <Link 
                  key={item.name} 
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between p-4 rounded-2xl hover:bg-accent-orange/5 text-text-dark font-bold transition-all group"
                >
                  {item.name}
                  <span className="material-symbols-outlined text-[18px] opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
                </Link>
              ))}
              
              <div className="pt-6 mt-4 border-t border-border/40 flex flex-col gap-3">
                {!isAuthenticated ? (
                  <>
                    <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                      <button className="w-full h-14 rounded-2xl bg-surface-dim text-text-dark font-black text-[12px] uppercase tracking-widest border border-border/20">
                        Sign In
                      </button>
                    </Link>
                    <Link href="/auth/signup" onClick={() => setIsOpen(false)}>
                      <button className="w-full h-14 rounded-2xl bg-accent-orange text-white font-black text-[12px] uppercase tracking-widest shadow-glow-orange">
                        Get Started
                      </button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                      <button className="w-full h-14 rounded-2xl bg-surface-dim text-text-dark font-black text-[12px] uppercase tracking-widest border border-border/20">
                        Dashboard
                      </button>
                    </Link>
                    <button 
                      onClick={() => { handleSignOut(); setIsOpen(false); }}
                      className="w-full h-14 rounded-2xl bg-red-50 text-red-500 font-black text-[12px] uppercase tracking-widest border border-red-100"
                    >
                      Sign Out
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
