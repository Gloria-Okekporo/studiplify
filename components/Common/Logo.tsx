'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  textSize?: string;
  iconSize?: string;
  iconContainerSize?: string;
}

export default function Logo({ 
  className = '', 
  textSize = 'text-3xl lg:text-4xl', 
  iconSize = 'text-3xl',
  iconContainerSize = 'w-12 h-12 rounded-[1rem]'
}: LogoProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <Link href="/" className={`flex items-center gap-4 group relative ${className}`}>
      {/* Soft background glow orb (parallax effect on hover) */}
      <motion.div 
        className="absolute -left-2 -top-2 w-[150%] h-[150%] bg-accent-orange/20 blur-[20px] rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
        whileHover={shouldReduceMotion ? {} : { scale: 1.1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      />
      
      {/* Icon Container with subtle continuous floating */}
      <motion.div 
        className={`relative flex items-center justify-center bg-accent-orange/10 border border-accent-orange/20 group-hover:bg-accent-orange group-hover:text-white transition-all duration-300 z-10 ${iconContainerSize}`}
        animate={shouldReduceMotion ? {} : { 
          y: [-1, 1, -1]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        whileHover={{ scale: 1.05 }}
      >
        {/* Icon */}
        <span className={`material-symbols-outlined text-accent-orange group-hover:text-white font-black transition-colors duration-300 relative z-10 ${iconSize}`}>
          auto_awesome
        </span>
      </motion.div>

      {/* Stable Text */}
      <div className={`font-display font-extrabold text-text-dark tracking-tight relative z-10 ${textSize}`}>
        Studiplify<span className="text-accent-orange">.</span>
      </div>
    </Link>
  );
}
