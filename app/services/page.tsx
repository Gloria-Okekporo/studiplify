'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/Layout/Navbar';
import Footer from '@/components/Layout/Footer';

export default function ServicesPage() {
  const services = [
    { title: 'AI Study Planner', desc: 'Autonomous scheduling that evolves with your progress and adapts to your exam cycles.', icon: 'event_repeat', color: 'text-accent-orange', bg: 'bg-accent-orange/10' },
    { title: 'Neural Tasks', desc: 'Deep task deconstruction and prioritization logic using advanced logic engines.', icon: 'psychology', color: 'text-accent-purple', bg: 'bg-accent-purple/10' },
    { title: 'Focus Analytics', desc: 'Real-time monitoring of your cognitive performance and mastery retention.', icon: 'analytics', color: 'text-accent-green', bg: 'bg-accent-green/10' },
    { title: 'Smart Sync', desc: 'Seamless integration across all your digital nodes with encrypted synchronization.', icon: 'sync', color: 'text-accent-orange', bg: 'bg-accent-orange/10' },
  ];

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
      </div>

      <section className="pt-32 lg:pt-56 pb-32 px-6 md:px-12 max-w-[1400px] mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-32 lg:mb-56">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-flex items-center gap-2 px-5 py-2 bg-white border border-border/50 text-accent-orange rounded-full text-[12px] font-black uppercase tracking-[0.25em] mb-10 shadow-sm">
              <span className="material-symbols-outlined text-[18px] font-bold">hub</span>
              System Architecture
            </span>
            <h1 className="text-6xl md:text-8xl lg:text-[110px] font-black text-text-dark tracking-tighter leading-[0.82] mb-12">
              Advanced Neural <br/><span className="text-accent-orange italic">Orchestration.</span>
            </h1>
            <p className="text-xl lg:text-2xl text-text-muted font-medium max-w-3xl mx-auto leading-relaxed opacity-80">
              Every module of Studiplify is precision-engineered to maximize cognitive velocity and academic mastery.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
          {services.map((service, i) => (
            <motion.div 
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              whileHover={{ y: -10 }}
              className="bg-white/80 backdrop-blur-xl border border-border/60 rounded-[3.5rem] p-12 lg:p-16 shadow-soft hover:shadow-soft-lg transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-surface-dim rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000"></div>
              
              <div className={`w-20 h-20 rounded-[1.8rem] ${service.bg} ${service.color} flex items-center justify-center mb-10 shadow-inner-sm group-hover:rotate-6 transition-transform duration-500`}>
                <span className="material-symbols-outlined text-[36px] font-bold">{service.icon}</span>
              </div>
              <h3 className="text-3xl lg:text-4xl font-black text-text-dark mb-6 tracking-tight">{service.title}</h3>
              <p className="text-lg lg:text-xl text-text-muted font-medium leading-relaxed opacity-80">
                {service.desc}
              </p>
              
              <div className="mt-12 flex items-center gap-4">
                <span className={`w-2 h-2 rounded-full ${service.color.replace('text', 'bg')} shadow-glow-primary animate-pulse`}></span>
                <span className="text-[11px] font-black text-text-muted uppercase tracking-widest opacity-60">Module Synchronized</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
