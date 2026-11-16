"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Terminal, Menu, X, Radio } from "lucide-react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-canvas/80 border-b border-white/10 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center space-x-3" data-testid="nav-brand">
          <div className="w-8 h-8 rounded bg-gradient-to-tr from-accent-yellow to-accent-pink flex items-center justify-center font-bold text-black text-sm">
            M
          </div>
          <span className="font-bold tracking-wider text-white whitespace-nowrap text-sm sm:text-base">
            ITU MATRIX
          </span>
        </div>

        <nav className="hidden md:flex items-center space-x-6 text-sm text-zinc-300">
          <Link href="#overview" className="hover:text-accent-yellow transition-colors">Overview</Link>
          <Link href="#rover-3d" className="hover:text-accent-yellow transition-colors">3D Rover</Link>
          <Link href="#subteams" className="hover:text-accent-yellow transition-colors">Subteams</Link>
          <Link href="#telemetry" className="hover:text-accent-yellow transition-colors">Telemetry</Link>
          <Link href="#competitions" className="hover:text-accent-yellow transition-colors">Competitions</Link>
          <Link href="#sponsors" className="hover:text-accent-yellow transition-colors">Sponsors</Link>
        </nav>

        <div className="flex items-center space-x-4">
          <div data-testid="status-beacon" className="flex items-center space-x-2 px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-mono">5.8 GHz ONLINE</span>
          </div>

          <Link
            href="#telemetry"
            data-testid="nav-cta-console"
            className="hidden sm:inline-flex items-center space-x-2 px-3 py-1.5 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-zinc-200 transition-all hover:border-accent-yellow/50"
          >
            <Terminal className="w-3.5 h-3.5 text-accent-yellow" />
            <span>Launch Console</span>
          </Link>

          <button
            data-testid="mobile-menu-button"
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md hover:bg-white/5 text-zinc-400 hover:text-white"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div data-testid="mobile-nav-drawer" className="md:hidden border-b border-white/10 bg-surface/95 backdrop-blur-xl px-4 pt-2 pb-6 space-y-3">
          <Link href="#overview" onClick={() => setIsOpen(false)} className="block py-2 text-sm text-zinc-200 hover:text-accent-yellow">Overview</Link>
          <Link href="#rover-3d" onClick={() => setIsOpen(false)} className="block py-2 text-sm text-zinc-200 hover:text-accent-yellow">3D Rover</Link>
          <Link href="#subteams" onClick={() => setIsOpen(false)} className="block py-2 text-sm text-zinc-200 hover:text-accent-yellow">Subteams</Link>
          <Link href="#telemetry" onClick={() => setIsOpen(false)} className="block py-2 text-sm text-zinc-200 hover:text-accent-yellow">Telemetry</Link>
          <Link href="#competitions" onClick={() => setIsOpen(false)} className="block py-2 text-sm text-zinc-200 hover:text-accent-yellow">Competitions</Link>
          <Link href="#sponsors" onClick={() => setIsOpen(false)} className="block py-2 text-sm text-zinc-200 hover:text-accent-yellow">Sponsors</Link>
        </div>
      )}
    </header>
  );
}
