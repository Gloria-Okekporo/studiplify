'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/Layout/Navbar';
import Footer from '@/components/Layout/Footer';

export default function TermsPage() {
  return (
    <main className="relative min-h-screen selection:bg-pastel-purple/30 overflow-x-hidden bg-[#0d0c12] text-on-background">
      <Navbar />
      
      {/* Background Architecture */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[#0d0c12]"></div>
        <div className="absolute inset-0 bg-noise opacity-[0.03] mix-blend-overlay"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[1200px] h-[1200px] bg-pastel-blue/5 rounded-full blur-[180px]"></div>
      </div>

      <section className="pt-60 pb-40 px-8 md:px-16 max-w-[1000px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-24"
        >
          <span className="text-pastel-blue font-black uppercase tracking-[0.6em] text-xs block mb-8 opacity-60">Usage Protocol</span>
          <h1 className="font-display text-7xl font-black tracking-tighter text-white mb-10 leading-tight">
            Terms of Service
          </h1>
          <p className="text-xl text-on-surface-variant font-medium opacity-60">
            Last Updated: May 2024
          </p>
        </motion.div>

        <div className="space-y-16 text-on-surface-variant/80 text-lg leading-relaxed font-medium">
          <section>
            <h3 className="text-2xl font-black text-white mb-6 uppercase tracking-widest">1. Operator Eligibility</h3>
            <p>
              By initializing an account with Studiplify, you agree to abide by our cognitive integrity guidelines. We provide the architecture; you provide the effort. Misuse of AI orchestration for academic dishonesty is strictly prohibited.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-black text-white mb-6 uppercase tracking-widest">2. System Performance</h3>
            <p>
              While our neural engine is designed for high-velocity optimization, system performance may vary based on network conditions and cognitive load. Studiplify is provided "as-is" within the current development phase.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-black text-white mb-6 uppercase tracking-widest">3. Intellectual Property</h3>
            <p>
              The Studiplify neural architecture, visual system, and "Neural Mastery" protocols are the exclusive property of Studiplify AI Labs. Unauthorized cloning of the cognitive framework is a violation of our transmission protocols.
            </p>
          </section>
        </div>
      </section>

      <Footer />
    </main>
  );
}
