"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import { Box, Terminal, Award, Cpu, Wifi, Compass, Sparkles } from "lucide-react";

export interface HeroProps {
  className?: string;
}

const HERO_CONTAINER: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.04 },
  },
};

const HERO_ITEM: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function Hero({ className = "" }: HeroProps) {
  return (
    <section
      id="overview"
      className={`relative min-h-[90vh] flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 py-16 sm:py-24 overflow-hidden ${className}`}
    >
      {/* Background JetBrains Grid & Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(175,82,222,0.15),transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <motion.div
        variants={HERO_CONTAINER}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center"
      >
        {/* JetBrains Style Mission Status Pill Badge */}
        <motion.div
          variants={HERO_ITEM}
          data-testid="hero-status-pill"
          className="inline-flex flex-wrap justify-center max-w-full min-w-0 break-words [overflow-wrap:anywhere] text-center items-center gap-x-2.5 gap-y-1 px-3 sm:px-4 py-1.5 rounded-full border border-white/10 bg-surface/80 backdrop-blur-md text-[clamp(10px,0.75rem,13px)] font-mono text-zinc-300 shadow-[0_0_15px_rgba(255,255,255,0.05)] mb-6 hover:border-accent-yellow/40 transition-colors"
        >
          <span className="h-2 w-2 rounded-full bg-accent-yellow animate-pulse" />
          <span className="font-semibold text-accent-yellow">URC 2026 // ACTIVE MISSION</span>
          <span className="text-zinc-400">|</span>
          <span className="tracking-wide">ITU MATRIX // AUTONOMOUS PLANETARY ROVER</span>
        </motion.div>

        {/* Electric Neon Gradient Mask H1 */}
        <motion.h1
          variants={HERO_ITEM}
          data-testid="hero-headline"
          style={{ fontSize: "clamp(1.5rem, 8.5vw, 4.5rem)" }}
          className="text-4xl sm:text-6xl md:text-7xl max-w-full min-w-0 break-words [overflow-wrap:anywhere] font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-100 to-zinc-400 mb-6 leading-[1.1]"
        >
          Engineered for the Uncharted:
          <span className="block mt-2 pb-1 bg-clip-text text-transparent bg-gradient-to-r from-accent-yellow via-accent-purple to-accent-cyan">
            Autonomous Robotics by Istanbul Technical University
          </span>
          <span className="sr-only">AUTONOMOUS PLANETARY ROVER</span>
        </motion.h1>

        {/* Subtitle / Positioning Statement */}
        <motion.p
          variants={HERO_ITEM}
          className="max-w-2xl text-base sm:text-lg text-zinc-400 font-sans leading-relaxed mb-8"
        >
          Next-generation extraterrestrial exploration platform designed for extreme Martian terrains, 
          powered by ROS 2 autonomy, custom 6-DOF kinematics, and deep planetary science payload systems.
        </motion.p>

        {/* Carl Sagan Inspirational Motto Blockquote */}
        <motion.blockquote
          variants={HERO_ITEM}
          data-testid="hero-motto"
          className="relative px-6 py-4 rounded-xl border border-white/10 bg-surface/50 backdrop-blur-sm max-w-xl mx-auto mb-10 shadow-lg"
        >
          <div className="flex items-center justify-center gap-2 text-accent-cyan mb-1.5">
            <Sparkles className="w-4 h-4" />
            <span className="font-mono text-xs uppercase tracking-widest text-zinc-400">Team Philosophy</span>
          </div>
          <p className="text-sm sm:text-base italic text-zinc-200 font-sans">
            “Somewhere, something incredible is waiting to be known.”
          </p>
          <footer className="mt-2 text-xs font-mono text-zinc-400">
            — <cite className="text-accent-yellow not-italic">Carl Sagan</cite>
          </footer>
        </motion.blockquote>

        {/* Action CTAs with Hover Glow */}
        <motion.div
          variants={HERO_ITEM}
          className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-4 mb-16"
        >
          <motion.a
            href="#rover-3d"
            data-testid="hero-cta-inspect-3d"
            whileHover={{ y: -2, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 360, damping: 24 }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-lg bg-accent-yellow text-canvas font-mono font-bold text-sm tracking-wide shadow-[0_0_20px_rgba(252,237,58,0.35)] hover:bg-accent-yellow/90 hover:shadow-[0_0_30px_rgba(252,237,58,0.5)] transition-colors"
          >
            <Box className="w-4 h-4" />
            <span>Inspect Rover 3D</span>
          </motion.a>

          <motion.a
            href="#telemetry"
            data-testid="hero-cta-console"
            whileHover={{ y: -2, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 360, damping: 24 }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-lg border border-white/20 bg-surface/60 backdrop-blur-md text-white font-mono font-medium text-sm hover:border-accent-cyan/60 hover:text-accent-cyan hover:shadow-[0_0_20px_rgba(33,212,253,0.25)] transition-colors"
          >
            <Terminal className="w-4 h-4 text-accent-cyan" />
            <span>Open Matrix Console</span>
          </motion.a>
        </motion.div>

        {/* Quick Metrics Chips Grid (2x2 on mobile, 4-col on md+) */}
        <motion.div
          variants={HERO_ITEM}
          data-testid="hero-metrics-chips"
          className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 w-full max-w-4xl"
        >
          {/* Metric Chip 1: 6-DOF */}
          <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 360, damping: 24 }}
            className="p-4 rounded-xl border border-white/10 bg-surface/40 backdrop-blur-sm flex flex-col items-center text-center hover:border-accent-yellow/30 transition-colors"
          >
            <Cpu className="w-5 h-5 text-accent-yellow mb-1.5" />
            <span className="font-mono font-bold text-lg sm:text-xl text-white">6-DOF</span>
            <span className="text-xs font-mono text-zinc-400 mt-0.5">6-DOF Manipulator</span>
          </motion.div>

          {/* Metric Chip 2: 99.4% */}
          <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 360, damping: 24 }}
            className="p-4 rounded-xl border border-white/10 bg-surface/40 backdrop-blur-sm flex flex-col items-center text-center hover:border-accent-cyan/30 transition-colors"
          >
            <Compass className="w-5 h-5 text-accent-cyan mb-1.5" />
            <span className="font-mono font-bold text-lg sm:text-xl text-white">99.4%</span>
            <span className="text-xs font-mono text-zinc-400 mt-0.5">99.4% Autonomous Nav</span>
          </motion.div>

          {/* Metric Chip 3: URC World 3rd & ERC Silver */}
          <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 360, damping: 24 }}
            className="p-4 rounded-xl border border-white/10 bg-surface/40 backdrop-blur-sm flex flex-col items-center text-center hover:border-accent-purple/30 transition-colors"
          >
            <Award className="w-5 h-5 text-accent-purple mb-1.5" />
            <span className="font-mono font-bold text-base sm:text-lg text-white">URC World 3rd</span>
            <span className="text-xs font-mono text-zinc-400 mt-0.5">ERC Silver</span>
          </motion.div>

          {/* Metric Chip 4: 5.8 GHz & Sensors */}
          <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 360, damping: 24 }}
            className="p-4 rounded-xl border border-white/10 bg-surface/40 backdrop-blur-sm flex flex-col items-center text-center hover:border-emerald-400/30 transition-colors"
          >
            <Wifi className="w-5 h-5 text-emerald-400 mb-1.5" />
            <span className="font-mono font-bold text-lg sm:text-xl text-white">5.8 GHz</span>
            <span className="text-xs font-mono text-zinc-400 mt-0.5">12+ Live Sensor Streams</span>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
