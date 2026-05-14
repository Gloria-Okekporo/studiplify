'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/Layout/Navbar';
import Footer from '@/components/Layout/Footer';
import Link from 'next/link';

export default function ContactPage() {
  return (
    <main className="relative min-h-screen bg-surface-dim text-text-dark font-body selection:bg-accent-orange/20 overflow-x-hidden">
      <Navbar />
      
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-accent-orange/10 rounded-full blur-[140px] animate-pulse"></div>
        <div className="absolute bottom-[10%] left-[-5%] w-[700px] h-[700px] bg-accent-purple/10 rounded-full blur-[140px]"></div>
        <div className="absolute top-[40%] right-[15%] w-[400px] h-[400px] bg-accent-green/5 rounded-full blur-[120px]"></div>
        
        {/* Subtle Noise Texture */}
        <div className="absolute inset-0 opacity-[0.015] pointer-events-none mix-blend-overlay bg-noise"></div>

        {/* Floating Decorative Orbs */}
        <motion.div 
          animate={{ y: [0, -30, 0] }} 
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[15%] left-[10%] w-4 h-4 bg-accent-orange/40 rounded-full shadow-[0_0_20px_rgba(255,138,76,0.5)]"
        />
        <motion.div 
          animate={{ y: [0, 35, 0] }} 
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-[55%] right-[25%] w-3 h-3 bg-accent-purple/40 rounded-full shadow-[0_0_20px_rgba(168,133,255,0.5)]"
        />
      </div>

      <section className="pt-32 lg:pt-56 pb-32 px-6 md:px-12 max-w-[1400px] mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-24 lg:mb-40">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-flex items-center gap-2 px-5 py-2 bg-white border border-border/50 text-accent-orange rounded-full text-[12px] font-black uppercase tracking-[0.25em] mb-10 shadow-sm">
              <span className="material-symbols-outlined text-[18px] font-bold">mail</span>
              Direct Connection
            </span>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-text-dark tracking-tighter leading-[0.85] mb-12">
              Let's craft your <br/><span className="text-accent-orange italic">success.</span>
            </h1>
            <p className="text-xl lg:text-2xl text-text-muted font-medium max-w-2xl mx-auto leading-relaxed opacity-80">
              Have questions about our tools or need support with your workflow? Our team is here to help you achieve peak performance.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-stretch">
          
          {/* Contact Info Cards */}
          <div className="lg:col-span-5 flex flex-col gap-10">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex-1 bg-white/80 backdrop-blur-xl border border-border/60 rounded-[3.5rem] p-12 lg:p-14 shadow-soft hover:shadow-soft-lg transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent-purple/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000"></div>
              
              <h3 className="text-[12px] font-black text-text-muted uppercase tracking-[0.3em] mb-16 flex items-center gap-4 opacity-60">
                <span className="w-10 h-[2px] bg-accent-orange/40"></span>
                Global Channels
              </h3>
              
              <div className="space-y-12">
                {[
                  { label: 'Support & Success', value: 'hello@studiplify.com', icon: 'alternate_email', color: 'text-accent-orange', bg: 'bg-accent-orange/10' },
                  { label: 'Strategic Partnerships', value: 'partners@studiplify.com', icon: 'handshake', color: 'text-accent-purple', bg: 'bg-accent-purple/10' },
                  { label: 'Innovation HQ', value: 'San Francisco, CA', icon: 'location_on', color: 'text-accent-green', bg: 'bg-accent-green/10' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-8 items-center group/item">
                    <div className={`w-16 h-16 rounded-[1.8rem] ${item.bg} ${item.color} flex items-center justify-center shrink-0 shadow-inner-sm group-hover/item:rotate-12 transition-transform duration-500`}>
                      <span className="material-symbols-outlined text-[28px] font-bold">{item.icon}</span>
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-2 opacity-50">{item.label}</div>
                      <div className="text-xl lg:text-2xl font-black text-text-dark tracking-tight hover:text-accent-orange cursor-pointer transition-colors leading-none">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-20 pt-12 border-t border-border/40">
                <div className="flex items-center gap-6">
                  <div className="flex -space-x-4">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-surface-variant flex items-center justify-center overflow-hidden shadow-sm">
                        <img src={`https://i.pravatar.cc/100?u=${i+10}`} alt="User" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                  <p className="text-[14px] font-bold text-text-muted leading-tight">Join <span className="text-text-dark">50+ global teams</span> <br/>optimizing with us.</p>
                </div>
              </div>
            </motion.div>

            {/* Social Proof / Trust Card */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-text-dark text-white rounded-[3.5rem] p-12 lg:p-14 shadow-soft-2xl overflow-hidden relative group"
            >
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent-orange/20 rounded-full blur-[80px] translate-x-1/3 -translate-y-1/3 group-hover:scale-110 transition-transform duration-1000"></div>
              <div className="relative z-10">
                <h4 className="text-3xl lg:text-4xl font-black mb-6 leading-[1.05] tracking-tighter">Scale your focus <br/>with Studiplify.</h4>
                <p className="text-white/70 font-medium mb-12 max-w-[320px] leading-relaxed text-lg">Experience the future of academic orchestration today.</p>
                <Link href="/auth/signup" className="inline-flex items-center gap-4 bg-accent-orange text-white px-10 py-5 rounded-full font-black text-[13px] uppercase tracking-widest hover:bg-white hover:text-accent-orange shadow-glow-primary transition-all active:scale-95">
                  Get Started Free <span className="material-symbols-outlined text-[20px] font-bold">rocket_launch</span>
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Contact Form Card */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lg:col-span-7 bg-white/70 backdrop-blur-2xl border border-border/60 rounded-[4rem] p-12 lg:p-20 shadow-soft-2xl relative overflow-hidden group flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent-orange/5 blur-[120px] rounded-full pointer-events-none group-hover:scale-110 transition-transform duration-1000"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent-purple/5 blur-[100px] rounded-full pointer-events-none"></div>
            
            <form className="space-y-12 relative z-10 h-full flex flex-col">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="group/field space-y-4">
                  <label className="text-[11px] font-black text-text-muted uppercase tracking-[0.3em] ml-6 group-focus-within/field:text-accent-orange transition-colors">Full Identity</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="e.g. Alex Rivers" 
                      className="w-full h-[72px] bg-white border border-border/40 focus:border-accent-orange focus:ring-4 focus:ring-accent-orange/5 rounded-full px-10 text-text-dark focus:outline-none transition-all text-[16px] font-bold shadow-soft-sm placeholder:text-text-muted/30" 
                    />
                    <span className="material-symbols-outlined absolute right-8 top-1/2 -translate-y-1/2 text-text-muted/30 group-focus-within/field:text-accent-orange transition-colors">person</span>
                  </div>
                </div>
                <div className="group/field space-y-4">
                  <label className="text-[11px] font-black text-text-muted uppercase tracking-[0.3em] ml-6 group-focus-within/field:text-accent-orange transition-colors">Digital Address</label>
                  <div className="relative">
                    <input 
                      type="email" 
                      placeholder="alex@example.com" 
                      className="w-full h-[72px] bg-white border border-border/40 focus:border-accent-orange focus:ring-4 focus:ring-accent-orange/5 rounded-full px-10 text-text-dark focus:outline-none transition-all text-[16px] font-bold shadow-soft-sm placeholder:text-text-muted/30" 
                    />
                    <span className="material-symbols-outlined absolute right-8 top-1/2 -translate-y-1/2 text-text-muted/30 group-focus-within/field:text-accent-orange transition-colors">mail</span>
                  </div>
                </div>
              </div>

              <div className="group/field space-y-4">
                <label className="text-[11px] font-black text-text-muted uppercase tracking-[0.3em] ml-6 group-focus-within/field:text-accent-orange transition-colors">Inquiry Protocol</label>
                <div className="relative">
                  <select className="w-full h-[72px] bg-white border border-border/40 focus:border-accent-orange focus:ring-4 focus:ring-accent-orange/5 rounded-full px-10 text-text-dark focus:outline-none transition-all text-[16px] font-bold shadow-soft-sm appearance-none cursor-pointer">
                    <option>Product Orchestration</option>
                    <option>Technical Support</option>
                    <option>Billing & Tiers</option>
                    <option>Other</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-8 top-1/2 -translate-y-1/2 text-text-muted group-focus-within/field:text-accent-orange transition-colors pointer-events-none">expand_more</span>
                </div>
              </div>

              <div className="group/field space-y-4 flex-1">
                <label className="text-[11px] font-black text-text-muted uppercase tracking-[0.3em] ml-6 group-focus-within/field:text-accent-orange transition-colors">Detailed Context</label>
                <textarea 
                  rows={5} 
                  placeholder="How can we support your growth?" 
                  className="w-full bg-white border border-border/40 focus:border-accent-orange focus:ring-4 focus:ring-accent-orange/5 rounded-[3rem] px-10 py-10 text-text-dark focus:outline-none transition-all text-[16px] font-bold shadow-soft-sm resize-none placeholder:text-text-muted/30 min-h-[220px]"
                ></textarea>
              </div>

              <div className="pt-10">
                <button className="w-full h-[80px] bg-text-dark text-white rounded-full font-black text-[18px] uppercase tracking-[0.25em] hover:bg-accent-orange hover:shadow-glow-primary active:scale-[0.98] transition-all flex items-center justify-center gap-4 group/btn overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-accent-orange to-accent-purple opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"></div>
                  <span className="relative z-10 flex items-center gap-4">
                    Initialize Transmission 
                    <span className="material-symbols-outlined group-hover/btn:translate-x-2 group-hover/btn:-translate-y-2 transition-transform text-[22px] font-bold">send</span>
                  </span>
                </button>

                <div className="flex items-center justify-center gap-8 mt-12 opacity-50">
                  <p className="text-[11px] font-black text-text-muted uppercase tracking-[0.3em]">Encrypted Channel</p>
                  <div className="h-[1px] w-12 bg-border"></div>
                  <p className="text-[11px] font-black text-text-muted uppercase tracking-[0.3em]">24h Response Goal</p>
                </div>
              </div>
            </form>
          </motion.div>
        </div>

      </section>

      <Footer />
    </main>
  );
}
