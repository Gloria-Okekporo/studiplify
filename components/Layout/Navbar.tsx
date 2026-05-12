'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '@/components/Common/Logo';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Features', href: '/#features' },
    { name: 'AI Planner', href: '/planner' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Pricing', href: '/#pricing' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' }
  ];

  return (
    <nav className="fixed top-0 w-full z-[100] bg-white/60 backdrop-blur-xl border-b border-border/40 transition-all duration-200">
      <div className="flex justify-between items-center px-6 md:px-12 py-5 max-w-[1400px] mx-auto">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Logo />
        </motion.div>
        
        {/* Desktop Links */}
        <div className="hidden xl:flex items-center gap-10">
          {navLinks.map((item, i) => (
            <Link key={item.name} href={item.href}>
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-text-muted font-semibold hover:text-accent-orange transition-colors text-sm tracking-wide relative group cursor-pointer" 
              >
                {item.name}
                <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-accent-orange group-hover:w-full transition-all duration-200"></span>
              </motion.div>
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          <Link href="/auth/login" className="hidden lg:block text-text-dark font-bold hover:text-accent-orange transition-colors text-sm">Login</Link>
          <Link href="/auth/signup">
            <button className="btn-primary text-sm px-4 md:px-6 py-2 md:py-2.5">
              Get Started
            </button>
          </Link>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="xl:hidden w-10 h-10 flex items-center justify-center text-text-dark hover:text-accent-orange transition-colors"
          >
            <span className="material-symbols-outlined text-[28px]">
              {isOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="xl:hidden bg-white border-b border-border overflow-hidden"
          >
            <div className="flex flex-col p-6 space-y-4">
              {navLinks.map((item) => (
                <Link 
                  key={item.name} 
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="text-text-muted font-semibold hover:text-accent-orange transition-colors text-base"
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-border flex flex-col space-y-4">
                <Link 
                  href="/auth/login" 
                  onClick={() => setIsOpen(false)}
                  className="text-text-dark font-bold hover:text-accent-orange transition-colors text-base"
                >
                  Login
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
