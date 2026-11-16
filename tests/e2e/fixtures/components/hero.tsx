"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Compass, ShieldCheck, Cpu, Award, Activity } from "lucide-react";

export function Hero() {
  return (
    <section id="overview" className="relative w-full pt-16 pb-20 md:pt-24 md:pb-32 flex flex-col items-center text-center">
      {/* Pill Badge */}
      <div data-testid="hero-pill" className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-zinc-300 mb-8 backdrop-blur-md">
        <span className="w-2 h-2 rounded-full bg-accent-yellow"></span>
        <span>ITU MATRIX // AUTONOMOUS PLANETARY ROVER</span>
      </div>

      {/* Main Headline */}
      <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight max-w-5xl text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-500 mb-6">
        Autonomous Robotics for the Final Frontier
      </h1>

      {/* Motto */}
      <blockquote data-testid="carl-sagan-motto" className="max-w-3xl text-lg sm:text-xl text-zinc-400 italic font-mono mb-10 px-4">
        &ldquo;Somewhere, something incredible is waiting to be known.&rdquo;
        <span className="block text-sm not-italic font-sans text-accent-yellow mt-2 font-medium">
          &mdash; Carl Sagan
        </span>
      </blockquote>

      {/* Metric Chips */}
      <div data-testid="hero-stat-chips" className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl w-full mb-12 px-4">
        <div className="p-4 rounded-xl bg-surface/50 border border-white/5 backdrop-blur-sm text-left">
          <div className="flex items-center space-x-2 text-accent-yellow mb-1">
            <Cpu className="w-4 h-4" />
            <span className="text-xs font-mono">ROBOTIC ARM</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-white">6-DOF</div>
          <div className="text-xs text-zinc-400">Carbon Fiber Manipulator</div>
        </div>

        <div className="p-4 rounded-xl bg-surface/50 border border-white/5 backdrop-blur-sm text-left">
          <div className="flex items-center space-x-2 text-accent-cyan mb-1">
            <Activity className="w-4 h-4" />
            <span className="text-xs font-mono">AUTONOMY</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-white">99.4%</div>
          <div className="text-xs text-zinc-400">Autonomous Navigation</div>
        </div>

        <div className="p-4 rounded-xl bg-surface/50 border border-white/5 backdrop-blur-sm text-left">
          <div className="flex items-center space-x-2 text-accent-purple mb-1">
            <Award className="w-4 h-4" />
            <span className="text-xs font-mono">WORLD RANK</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-white">URC World 3rd</div>
          <div className="text-xs text-zinc-400">Utah Mars Desert Station</div>
        </div>

        <div className="p-4 rounded-xl bg-surface/50 border border-white/5 backdrop-blur-sm text-left">
          <div className="flex items-center space-x-2 text-accent-pink mb-1">
            <Compass className="w-4 h-4" />
            <span className="text-xs font-mono">TELEMETRY</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-white">12+ Streams</div>
          <div className="text-xs text-zinc-400">LiDAR, IMU & Spectrometry</div>
        </div>
      </div>

      {/* Dual CTAs */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Link
          href="#rover-3d"
          data-testid="hero-cta-inspect-3d"
          className="w-full sm:w-auto px-6 py-3 rounded-lg bg-accent-yellow hover:bg-yellow-300 text-black font-semibold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-accent-yellow/20 transition-all"
        >
          <span>Inspect Rover 3D</span>
          <ArrowRight className="w-4 h-4" />
        </Link>

        <Link
          href="#telemetry"
          data-testid="hero-cta-console"
          className="w-full sm:w-auto px-6 py-3 rounded-lg bg-surface border border-white/10 hover:border-accent-cyan/50 text-white font-medium text-sm flex items-center justify-center space-x-2 transition-all hover:bg-white/5 font-mono"
        >
          <span>Open Matrix Console</span>
        </Link>
      </div>
    </section>
  );
}
