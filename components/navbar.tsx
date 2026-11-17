"use client";

import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <header
      data-testid="matrix-navbar"
      className={`sticky top-0 z-50 w-full border-b border-white/10 bg-canvas/80 backdrop-blur-md transition-all duration-300 ${className}`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 min-h-16 py-2 flex items-center justify-between gap-2 lg:gap-3">
        {/* Brand Logo */}
        <Link
          href="#overview"
          className="flex items-center gap-2.5 group shrink-0 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
        >
          <div className="h-8 w-8 sm:h-9 sm:w-9 rounded border border-white/20 bg-surface flex items-center justify-center font-mono font-black text-accent-yellow shadow-[0_0_10px_rgba(252,237,58,0.2)]">
            M
          </div>
          <div className="flex flex-col">
            <span className="font-mono font-bold tracking-wider text-[clamp(12px,0.9rem,16px)] text-white group-hover:text-accent-yellow transition-colors whitespace-nowrap">
              ITU MATRIX
            </span>
            <span className="font-mono text-[clamp(9px,0.6rem,11px)] tracking-widest text-zinc-400 whitespace-nowrap">
              ROVER TEAM
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex flex-wrap items-center justify-center min-w-0 flex-1 gap-x-0.5 lg:gap-x-1 gap-y-1">
          <a
            href="#overview"
            className="px-1.5 lg:px-2.5 py-1 rounded text-[clamp(10px,0.72rem,12.5px)] font-mono font-medium text-zinc-300 hover:text-white hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan transition-all whitespace-nowrap"
          >
            Overview
          </a>
          <a
            href="#rover-3d"
            className="px-1.5 lg:px-2.5 py-1 rounded text-[clamp(10px,0.72rem,12.5px)] font-mono font-medium text-zinc-300 hover:text-white hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan transition-all whitespace-nowrap"
          >
            3D Rover
          </a>
          <a
            href="#ide"
            className="px-1.5 lg:px-2.5 py-1 rounded text-[clamp(10px,0.72rem,12.5px)] font-mono font-medium text-zinc-300 hover:text-white hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan transition-all whitespace-nowrap"
          >
            IDE
          </a>
          <a
            href="#subteams"
            className="px-1.5 lg:px-2.5 py-1 rounded text-[clamp(10px,0.72rem,12.5px)] font-mono font-medium text-zinc-300 hover:text-white hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan transition-all whitespace-nowrap"
          >
            Subteams
          </a>
          <a
            href="#telemetry"
            className="px-1.5 lg:px-2.5 py-1 rounded text-[clamp(10px,0.72rem,12.5px)] font-mono font-medium text-zinc-300 hover:text-white hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan transition-all whitespace-nowrap"
          >
            Telemetry
          </a>
          <a
            href="#competitions"
            className="px-1.5 lg:px-2.5 py-1 rounded text-[clamp(10px,0.72rem,12.5px)] font-mono font-medium text-zinc-300 hover:text-white hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan transition-all whitespace-nowrap"
          >
            Competitions
          </a>
          <a
            href="#sponsors"
            className="px-1.5 lg:px-2.5 py-1 rounded text-[clamp(10px,0.72rem,12.5px)] font-mono font-medium text-zinc-300 hover:text-white hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan transition-all whitespace-nowrap"
          >
            Sponsors
          </a>
        </nav>

        {/* Right Section: Status Beacon + Action CTA */}
        <div className="hidden md:flex items-center gap-2 lg:gap-3 shrink-0">
          {/* 5.8 GHz Status Beacon */}
          <div
            data-testid="status-beacon"
            className={`hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-full border ${isOnline ? "border-emerald-500/30 bg-emerald-950/20 text-emerald-400" : "border-zinc-500/30 bg-zinc-950/20 text-zinc-400"} font-mono text-[clamp(10px,0.72rem,12px)] whitespace-nowrap`}
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
            className="inline-flex items-center gap-1.5 px-2.5 lg:px-3.5 py-1.5 rounded bg-accent-yellow text-canvas font-mono font-semibold text-[clamp(11px,0.75rem,13px)] hover:bg-accent-yellow/90 hover:shadow-[0_0_12px_rgba(252,237,58,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan transition-all whitespace-nowrap shrink-0"
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
            aria-expanded={isOpen}
            aria-controls="mobile-nav-drawer"
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded text-zinc-400 hover:text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div
          id="mobile-nav-drawer"
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
              href="#ide"
              onClick={() => setIsOpen(false)}
              className="px-3 py-2 rounded font-mono text-xs text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              PyCharm IDE
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
