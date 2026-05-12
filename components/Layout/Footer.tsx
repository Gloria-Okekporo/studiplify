'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="bg-surface-dim border-t border-border py-16 md:py-20 px-6 md:px-12 relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-20">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="col-span-1 md:col-span-2"
        >
          <div className="flex items-center gap-4 mb-8 group cursor-pointer">
            <Link href="/" className="flex items-center gap-4">
              <motion.div 
                whileHover={{ rotate: 10, scale: 1.05 }}
                className="w-10 h-10 rounded-[0.8rem] bg-accent-orange flex items-center justify-center text-white"
              >
                <span className="material-symbols-outlined text-xl font-black">auto_awesome</span>
              </motion.div>
              <div className="font-display text-2xl font-extrabold text-text-dark tracking-tight">
                Studiplify<span className="text-accent-orange">.</span>
              </div>
            </Link>
          </div>
          <p className="text-text-muted max-w-xs font-medium leading-relaxed">
            Helping students achieve academic success without the burnout. Plan smarter, study better.
          </p>
        </motion.div>
        
        {[
          { title: 'Platform', links: ['Features', 'AI Planner', 'Dashboard', 'Pricing'] },
          { title: 'Company', links: ['About', 'Contact', 'Privacy', 'Terms'] },
        ].map((col, idx) => (
          <motion.div 
            key={col.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 + idx * 0.1 }}
          >
            <h4 className="font-bold text-text-dark text-sm uppercase tracking-wider mb-8">{col.title}</h4>
            <ul className="space-y-4 text-text-muted">
              {col.links.map(item => (
                <li key={item}>
                  <Link 
                    href={
                      item === 'Features' ? '/#features' : 
                      item === 'AI Planner' ? '/planner' :
                      item === 'Pricing' ? '/#pricing' :
                      item === 'Dashboard' ? '/dashboard' :
                      `/${item.toLowerCase()}`
                    } 
                    className="hover:text-accent-orange inline-block transition-colors font-medium text-sm"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
      
      <div className="max-w-[1400px] mx-auto mt-20 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-text-muted text-sm font-medium">© {new Date().getFullYear()} Studiplify AI Labs. All rights reserved.</p>
        <div className="flex gap-4">
          {/* Social Icons Placeholders */}
          {['share', 'thumb_up', 'forum'].map(icon => (
            <div key={icon} className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center text-text-muted hover:bg-accent-orange hover:text-white transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-[18px]">{icon}</span>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
