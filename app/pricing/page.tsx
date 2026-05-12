'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/Layout/Navbar';
import Footer from '@/components/Layout/Footer';
import Link from 'next/link';

export default function PricingPage() {
  const plans = [
    { 
      name: 'Free Protocol', 
      price: '$0', 
      desc: 'Foundational tools for individual mastery.', 
      features: ['3 AI Study Plans/mo', 'Neural Task Management', 'Standard Focus Timer', 'Basic Analytics'], 
      btn: 'Initialize Free', 
      popular: false,
      color: 'text-text-muted',
      bg: 'bg-surface-dim/50'
    },
    { 
      name: 'Pro Protocol', 
      price: '$9', 
      desc: 'Advanced orchestration for high-velocity students.', 
      features: ['Unlimited AI Plans', 'Deep Retention Analytics', 'Neural Chat Assistant', 'Priority Synthesis', 'Custom Focus Environments'], 
      btn: 'Initialize Pro', 
      popular: true,
      color: 'text-accent-orange',
      bg: 'bg-accent-orange/10'
    },
    { 
      name: 'Team Protocol', 
      price: '$19', 
      desc: 'Collaborative intelligence for study collectives.', 
      features: ['Everything in Pro', 'Neural Study Groups', 'Collaborative Roadmaps', 'Shared Resource Nodes', 'Admin Logic Dashboard'], 
      btn: 'Initialize Team', 
      popular: false,
      color: 'text-accent-purple',
      bg: 'bg-accent-purple/10'
    }
  ];

  return (
    <main className="relative min-h-screen bg-surface-dim text-text-dark font-body selection:bg-accent-orange/20 overflow-x-hidden">
      <Navbar />
      
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-accent-orange/10 rounded-full blur-[140px] animate-pulse"></div>
        <div className="absolute bottom-[10%] left-[-5%] w-[700px] h-[700px] bg-accent-purple/10 rounded-full blur-[140px]"></div>
        
        {/* Subtle Noise Texture */}
        <div className="absolute inset-0 opacity-[0.015] pointer-events-none mix-blend-overlay bg-noise"></div>
      </div>

      <section className="pt-32 lg:pt-56 pb-32 px-6 md:px-12 max-w-[1400px] mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-32 lg:mb-48">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-flex items-center gap-2 px-5 py-2 bg-white border border-border/50 text-accent-purple rounded-full text-[12px] font-black uppercase tracking-[0.25em] mb-10 shadow-sm">
              <span className="material-symbols-outlined text-[18px] font-bold">payments</span>
              Tiered Orchestration
            </span>
            <h1 className="text-6xl md:text-8xl lg:text-[110px] font-black text-text-dark tracking-tighter leading-[0.82] mb-12">
              Invest in your <br/><span className="text-accent-orange italic">cognitive edge.</span>
            </h1>
            <p className="text-xl lg:text-2xl text-text-muted font-medium max-w-3xl mx-auto leading-relaxed opacity-80">
              Choose the level of intelligence that matches your academic ambition. No hidden nodes, just pure mastery.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14 items-stretch">
          {plans.map((plan, i) => (
            <motion.div 
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              className={`flex flex-col bg-white border rounded-[4rem] p-12 lg:p-16 transition-all relative overflow-hidden group ${plan.popular ? 'border-accent-orange/40 shadow-soft-2xl scale-105 z-20' : 'border-border/60 shadow-soft hover:shadow-soft-lg'}`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 px-8 py-3 bg-accent-orange text-white text-[10px] font-black uppercase tracking-[0.25em] rounded-bl-[2rem] shadow-glow-primary">
                  Neural Favorite
                </div>
              )}
              
              <div className="mb-12">
                <h3 className="text-2xl font-black text-text-dark mb-4 tracking-tight">{plan.name}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl lg:text-7xl font-black text-text-dark tracking-tighter">{plan.price}</span>
                  <span className="text-text-muted font-bold text-lg opacity-60">/cycle</span>
                </div>
              </div>

              <p className="text-lg text-text-muted font-medium mb-12 opacity-80 leading-relaxed">
                {plan.desc}
              </p>

              <div className="flex-1 space-y-8 mb-16">
                <div className="text-[11px] font-black text-text-muted uppercase tracking-[0.3em] opacity-40">Included Nodes</div>
                <ul className="space-y-6">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-4 text-text-dark font-bold text-[15px] leading-tight group/item">
                      <span className="material-symbols-outlined text-accent-green text-[22px] font-bold group-hover/item:scale-125 transition-transform">check_circle</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <Link href="/auth/signup" className="mt-auto">
                <button className={`w-full py-6 rounded-full font-black text-[14px] uppercase tracking-widest transition-all shadow-soft-sm ${plan.popular ? 'bg-accent-orange text-white shadow-glow-primary hover:scale-[1.02] active:scale-95' : 'bg-surface-dim text-text-dark hover:bg-border active:scale-95'}`}>
                  {plan.btn}
                </button>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section Placeholder */}
        <div className="mt-48 text-center">
          <p className="text-text-muted font-bold text-lg opacity-60 mb-8">Need a custom enterprise solution?</p>
          <Link href="/contact" className="text-accent-purple font-black text-[13px] uppercase tracking-widest hover:underline underline-offset-8 decoration-2">
            Talk to Neural Ops
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
