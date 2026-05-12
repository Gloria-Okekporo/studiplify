'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/Layout/Navbar';
import Footer from '@/components/Layout/Footer';

export default function PrivacyPage() {
  return (
    <main className="relative min-h-screen selection:bg-pastel-purple/30 overflow-x-hidden bg-[#0d0c12] text-on-background">
      <Navbar />
      
      {/* Background Architecture */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[#0d0c12]"></div>
        <div className="absolute inset-0 bg-noise opacity-[0.03] mix-blend-overlay"></div>
        <div className="absolute top-[-10%] left-[-10%] w-[1200px] h-[1200px] bg-pastel-purple/5 rounded-full blur-[180px]"></div>
      </div>

      <section className="pt-60 pb-40 px-8 md:px-16 max-w-[1000px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-24"
        >
          <span className="text-pastel-purple font-black uppercase tracking-[0.6em] text-xs block mb-8 opacity-60">Legal Protocol</span>
          <h1 className="font-display text-7xl font-black tracking-tighter text-white mb-10 leading-tight">
            Privacy Policy
          </h1>
          <p className="text-xl text-on-surface-variant font-medium opacity-60">
            Last Updated: May 2024
          </p>
        </motion.div>

        <div className="space-y-16 text-on-surface-variant/80 text-lg leading-relaxed font-medium">
          <section>
            <h3 className="text-2xl font-black text-white mb-6 uppercase tracking-widest">1. Data Encryption</h3>
            <p>
              Studiplify utilizes end-to-end neural encryption for all user data. Your cognitive workload and study patterns are architected within a secure silo, accessible only by your verified operator ID.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-black text-white mb-6 uppercase tracking-widest">2. AI Orchestration</h3>
            <p>
              Our neural engine processes task metadata to optimize your learning path. This processing occurs locally within our high-velocity clusters and is never sold to third-party data brokers.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-black text-white mb-6 uppercase tracking-widest">3. User Sovereignty</h3>
            <p>
              You maintain total sovereignty over your digital footprint. At any point, an operator may request a full de-initialization of their profile and immediate purging of all stored neural weights.
            </p>
          </section>
        </div>
      </section>

      <Footer />
    </main>
  );
}
