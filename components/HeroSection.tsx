'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export function HeroSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="text-center mb-12"
    >
      {/* Logo/Brand */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex items-center justify-center gap-3 mb-8"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full" />
          <Sparkles className="w-10 h-10 text-emerald-400 relative z-10" />
        </div>
        <span className="text-3xl font-bold bg-linear-to-r from-emerald-400 to-green-300 bg-clip-text text-transparent">
          PromptVibe
        </span>
      </motion.div>

      {/* Main Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
      >
        Transform Your{' '}
        <span className="relative">
          <span className="bg-linear-to-r from-emerald-400 via-green-400 to-emerald-300 bg-clip-text text-transparent neon-text">
            Rough Ideas
          </span>
        </span>
        <br />
        Into{' '}
        <span className="bg-linear-to-r from-green-300 to-emerald-400 bg-clip-text text-transparent">
          Refined Prompts
        </span>
      </motion.h1>

      {/* Subheadline */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed"
      >
        Have a website concept but struggling to articulate it? Let AI elevate your ideas 
        with precision and clarity. Just describe your vision, and watch it transform.
      </motion.p>

      {/* Floating orbs for visual interest */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-40 right-10 w-96 h-96 bg-green-500/5 rounded-full blur-3xl pointer-events-none" />
    </motion.div>
  );
}
