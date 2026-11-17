"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Terminal, Menu, X } from "lucide-react";

export interface NavbarProps {
  statusText?: string;
  isOnline?: boolean;
  onLaunchConsole?: () => void;
  className?: string;
}

export function Navbar({
  statusText = "5.8 GHz ONLINE",
  isOnline = true,
  onLaunchConsole,
  className = "",
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header
      data-testid="matrix-navbar"
      className={`sticky top-0 z-50 w-full border-b border-white/10 bg-canvas/80 backdrop-blur-md transition-all duration-300 ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="#overview"
          className="flex items-center gap-3 group focus:outline-none"
        >
          <div className="h-9 w-9 rounded border border-white/20 bg-surface flex items-center justify-center font-mono font-black text-accent-yellow shadow-[0_0_10px_rgba(252,237,58,0.2)]">
            M
          </div>
          <div className="flex flex-col">
            <span className="font-mono font-bold tracking-wider text-sm sm:text-base text-white group-hover:text-accent-yellow transition-colors">
              ITU MATRIX
            </span>
            <span className="font-mono text-[10px] tracking-widest text-zinc-400">
              ROVER TEAM
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-0.5 lg:space-x-2">
          <a
            href="#overview"
            className="px-2 lg:px-3 py-1.5 rounded text-[11px] lg:text-xs font-mono font-medium text-zinc-300 hover:text-white hover:bg-white/5 transition-all whitespace-nowrap"
          >
            Overview
          </a>
          <a
            href="#rover-3d"
            className="px-2 lg:px-3 py-1.5 rounded text-[11px] lg:text-xs font-mono font-medium text-zinc-300 hover:text-white hover:bg-white/5 transition-all whitespace-nowrap"
          >
            3D Rover
          </a>
          <a
            href="#subteams"
            className="px-2 lg:px-3 py-1.5 rounded text-[11px] lg:text-xs font-mono font-medium text-zinc-300 hover:text-white hover:bg-white/5 transition-all whitespace-nowrap"
          >
            Subteams
          </a>
          <a
            href="#telemetry"
            className="px-2 lg:px-3 py-1.5 rounded text-[11px] lg:text-xs font-mono font-medium text-zinc-300 hover:text-white hover:bg-white/5 transition-all whitespace-nowrap"
          >
            Telemetry
          </a>
          <a
            href="#competitions"
            className="px-2 lg:px-3 py-1.5 rounded text-[11px] lg:text-xs font-mono font-medium text-zinc-300 hover:text-white hover:bg-white/5 transition-all whitespace-nowrap"
          >
            Competitions
          </a>
          <a
            href="#sponsors"
            className="px-2 lg:px-3 py-1.5 rounded text-[11px] lg:text-xs font-mono font-medium text-zinc-300 hover:text-white hover:bg-white/5 transition-all whitespace-nowrap"
          >
            Sponsors
          </a>
        </nav>

        {/* Right Section: Status Beacon + Action CTA */}
        <div className="hidden md:flex items-center gap-2 lg:gap-4 shrink-0">
          {/* 5.8 GHz Status Beacon */}
          <div
            data-testid="status-beacon"
            className={`hidden lg:flex items-center gap-2 px-3 py-1 rounded-full border ${isOnline ? "border-emerald-500/30 bg-emerald-950/20 text-emerald-400" : "border-zinc-500/30 bg-zinc-950/20 text-zinc-400"} font-mono text-xs`}
          >
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isOnline ? "bg-emerald-400 opacity-75" : "opacity-0"}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isOnline ? "bg-emerald-500 animate-pulse" : "bg-zinc-500"}`}></span>
            </span>
            <span>{statusText}</span>
          </div>

          {/* Console CTA Button */}
          <a
            href="#telemetry"
            data-testid="header-cta-console"
            onClick={onLaunchConsole}
            className="inline-flex items-center gap-2 px-3 lg:px-3.5 py-1.5 rounded bg-accent-yellow text-canvas font-mono font-semibold text-xs hover:bg-accent-yellow/90 hover:shadow-[0_0_12px_rgba(252,237,58,0.4)] transition-all whitespace-nowrap"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Launch Console</span>
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            type="button"
            data-testid="mobile-menu-button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded text-zinc-400 hover:text-white hover:bg-white/10 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div
          data-testid="mobile-nav-drawer"
          className="md:hidden border-b border-white/10 bg-canvas/95 backdrop-blur-xl px-4 pt-2 pb-6 space-y-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/5">
            <div className={`flex items-center gap-2 px-2.5 py-1 rounded-full border ${isOnline ? "border-emerald-500/30 bg-emerald-950/20 text-emerald-400" : "border-zinc-500/30 bg-zinc-950/20 text-zinc-400"} font-mono text-xs`}>
              <span className={`h-2 w-2 rounded-full ${isOnline ? "bg-emerald-500 animate-pulse" : "bg-zinc-500"}`}></span>
              <span>{statusText}</span>
            </div>
            <a
              href="#telemetry"
              onClick={() => {
                if (onLaunchConsole) onLaunchConsole();
                setIsOpen(false);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-accent-yellow text-canvas font-mono text-xs font-semibold"
            >
              <Terminal className="w-3 h-3" />
              Launch Console
            </a>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <a
              href="#overview"
              onClick={() => setIsOpen(false)}
              className="px-3 py-2 rounded font-mono text-xs text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              Overview
            </a>
            <a
              href="#rover-3d"
              onClick={() => setIsOpen(false)}
              className="px-3 py-2 rounded font-mono text-xs text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              3D Rover
            </a>
            <a
              href="#subteams"
              onClick={() => setIsOpen(false)}
              className="px-3 py-2 rounded font-mono text-xs text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              Subteams
            </a>
            <a
              href="#telemetry"
              onClick={() => setIsOpen(false)}
              className="px-3 py-2 rounded font-mono text-xs text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              Telemetry
            </a>
            <a
              href="#competitions"
              onClick={() => setIsOpen(false)}
              className="px-3 py-2 rounded font-mono text-xs text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              Competitions
            </a>
            <a
              href="#sponsors"
              onClick={() => setIsOpen(false)}
              className="px-3 py-2 rounded font-mono text-xs text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              Sponsors
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
