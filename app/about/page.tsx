'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/Layout/Navbar';
import Footer from '@/components/Layout/Footer';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="relative min-h-screen bg-surface-dim text-text-dark font-body selection:bg-accent-orange/20 overflow-x-hidden">
      <Navbar />
      
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[800px] h-[800px] bg-accent-purple/5 rounded-full blur-[140px]"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[700px] h-[700px] bg-accent-orange/10 rounded-full blur-[140px] animate-pulse"></div>
        <div className="absolute top-[30%] right-[10%] w-[400px] h-[400px] bg-accent-green/5 rounded-full blur-[100px]"></div>
        
        {/* Subtle Noise Texture */}
        <div className="absolute inset-0 opacity-[0.015] pointer-events-none mix-blend-overlay bg-noise"></div>

        {/* Floating Decorative Orbs */}
        <motion.div 
          animate={{ y: [0, -40, 0], x: [0, 20, 0] }} 
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] left-[15%] w-4 h-4 bg-accent-orange/40 rounded-full shadow-[0_0_20px_rgba(255,138,76,0.4)]"
        />
        <motion.div 
          animate={{ y: [0, 50, 0], x: [0, -20, 0] }} 
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[25%] right-[20%] w-3 h-3 bg-accent-purple/40 rounded-full shadow-[0_0_20px_rgba(168,133,255,0.4)]"
        />
      </div>

      <section className="pt-32 lg:pt-56 pb-32 px-6 md:px-12 max-w-[1400px] mx-auto relative z-10">
        
        {/* Hero Section */}
        <div className="text-center mb-32 lg:mb-56">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-flex items-center gap-2 px-5 py-2 bg-white border border-border/50 text-accent-purple rounded-full text-[12px] font-black uppercase tracking-[0.25em] mb-10 shadow-sm">
              <span className="material-symbols-outlined text-[18px] font-bold">auto_awesome</span>
              The Visionary Protocol
            </span>
            <h1 className="text-6xl md:text-8xl lg:text-[110px] font-black text-text-dark tracking-tighter leading-[0.82] mb-12">
              Architecting <br/><span className="text-accent-orange italic">the flow</span> <br/>of success.
            </h1>
            <p className="text-xl lg:text-2xl text-text-muted font-medium max-w-3xl mx-auto leading-relaxed opacity-80">
              Studiplify is a cognitive ecosystem engineered to harmonize your academic life, turning overwhelming data into actionable mastery.
            </p>
          </motion.div>
        </div>

        {/* Mission & Vision Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mb-32 lg:mb-56">
          {[
            { 
              title: 'Our Mission', 
              desc: 'We aim to deconstruct the complexity of modern education. By leveraging intuitive AI orchestration, we help students reclaim their time and focus on deep learning.', 
              icon: 'rocket_launch', 
              color: 'text-accent-orange', 
              bg: 'bg-accent-orange/10',
              delay: 0.2,
              orb: 'bg-accent-orange/5'
            },
            { 
              title: 'The Vision', 
              desc: 'A future where technology serves as a silent partner in your growth—anticipating bottlenecks and architecting the most efficient path to peak performance.', 
              icon: 'lightbulb', 
              color: 'text-accent-purple', 
              bg: 'bg-accent-purple/10',
              delay: 0.4,
              orb: 'bg-accent-purple/5'
            }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: item.delay }}
              whileHover={{ y: -10 }}
              className="bg-white/80 backdrop-blur-xl border border-border/60 rounded-[3.5rem] p-12 lg:p-16 shadow-soft hover:shadow-soft-lg transition-all relative overflow-hidden group"
            >
              <div className={`absolute top-0 right-0 w-64 h-64 ${item.orb} rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000`}></div>
              <div className={`w-16 h-16 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center mb-10 shadow-inner-sm group-hover:rotate-6 transition-transform duration-500`}>
                <span className="material-symbols-outlined text-[32px] font-bold">{item.icon}</span>
              </div>
              <h3 className="text-3xl lg:text-4xl font-black text-text-dark mb-6 tracking-tight">{item.title}</h3>
              <p className="text-lg text-text-muted font-medium leading-relaxed opacity-90">
                {item.desc}
              </p>
              <div className="mt-12 flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full ${item.color.replace('text', 'bg')} animate-pulse`}></div>
                <span className={`text-[11px] font-black ${item.color} uppercase tracking-widest`}>Strategic Intent</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Core Principles Section */}
        <div className="mb-32 lg:mb-56">
          <div className="text-center mb-24">
            <h2 className="text-4xl lg:text-6xl font-black text-text-dark tracking-tighter mb-6 leading-none">Core Foundations</h2>
            <p className="text-[13px] font-bold text-text-muted uppercase tracking-[0.4em] opacity-60">The DNA of Studiplify</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12">
            {[
              { title: 'Simplicity First', desc: 'Removing the noise so you can focus on the signal of your knowledge.', icon: 'filter_vintage', color: 'text-accent-orange', bg: 'bg-accent-orange/5' },
              { title: 'Student Centric', desc: 'Built by students, for students, with a deep understanding of academic pressure.', icon: 'groups', color: 'text-accent-purple', bg: 'bg-accent-purple/5' },
              { title: 'Ethical Intelligence', desc: 'Transparent, supportive technology that enhances human focus, never replaces it.', icon: 'verified_user', color: 'text-accent-green', bg: 'bg-accent-green/5' }
            ].map((principle, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/40 backdrop-blur-md border border-border/50 rounded-[3rem] p-12 text-center hover:bg-white hover:shadow-soft-lg transition-all group"
              >
                <div className={`w-20 h-20 rounded-[1.8rem] ${principle.bg} ${principle.color} flex items-center justify-center mx-auto mb-10 shadow-inner-sm group-hover:scale-110 transition-transform`}>
                  <span className="material-symbols-outlined text-[36px] font-bold">{principle.icon}</span>
                </div>
                <h4 className="text-2xl font-black text-text-dark mb-4 tracking-tight">{principle.title}</h4>
                <p className="text-text-muted font-medium leading-relaxed opacity-80">{principle.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Final CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-text-dark rounded-[4rem] p-12 lg:p-28 text-center overflow-hidden shadow-soft-2xl group"
        >
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-accent-orange/10 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-1000"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent-purple/10 rounded-full blur-[100px] pointer-events-none translate-y-1/2 -translate-x-1/2 group-hover:scale-110 transition-transform duration-1000"></div>
          
          <div className="relative z-10 max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter mb-10 leading-[0.95]">
              Ready to start your <br/>journey to <span className="text-accent-orange">mastery?</span>
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
              <Link href="/auth/signup" className="w-full sm:w-auto px-12 py-6 bg-accent-orange text-white rounded-full font-black text-[15px] uppercase tracking-widest shadow-glow-primary hover:scale-105 active:scale-95 transition-all">
                Get Started Now
              </Link>
              <Link href="/contact" className="w-full sm:w-auto px-12 py-6 bg-white/10 text-white border border-white/20 rounded-full font-black text-[15px] uppercase tracking-widest hover:bg-white/20 transition-all">
                Talk to the Team
              </Link>
            </div>
          </div>
        </motion.div>

      </section>

      <Footer />
    </main>
  );
}
