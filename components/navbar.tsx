"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

export interface NavbarProps {
  className?: string;
}

const NAV_LINKS = [
  { href: "#research", label: "Research" },
  { href: "#subteams", label: "Subteams" },
  { href: "#achievements", label: "Achievements" },
  { href: "#partners", label: "Partners" },
] as const;

export function Navbar({ className = "" }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeHref, setActiveHref] = useState<string>("#research");
  const pendingScrollIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    pendingScrollIdRef.current = null;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        pendingScrollIdRef.current = null;
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleMobileAnchorClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    const targetId = href.startsWith("#") ? href.slice(1) : href;
    pendingScrollIdRef.current = targetId;
    setActiveHref(href);
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", href);
    }
    setIsOpen(false);
  };

  const handleDrawerExitComplete = () => {
    const targetId = pendingScrollIdRef.current;
    pendingScrollIdRef.current = null;
    if (!targetId) return;

    const targetEl = document.getElementById(targetId);
    if (!targetEl) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const behavior: ScrollBehavior = prefersReducedMotion ? "auto" : "smooth";
    targetEl.scrollIntoView({ behavior, block: "start" });
  };

  return (
    <header
      data-testid="matrix-navbar"
      className={`sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#0B0B0E]/85 backdrop-blur-md ${className}`}
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-8 min-h-16 py-2 flex items-center justify-between gap-4">
        {/* Brand Monogram */}
        <Link
          href="#overview"
          onClick={(e) => {
            if (isOpen) {
              handleMobileAnchorClick(e, "#overview");
            } else {
              setActiveHref("#research");
            }
          }}
          className="flex items-center gap-3 group shrink-0 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
        >
          <span
            aria-hidden="true"
            className="h-8 w-8 rounded-md border border-white/[0.14] bg-surface flex items-center justify-center"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.5 13V3L8 8.5L13.5 3V13"
                stroke="#F4F4F5"
                strokeWidth="1.75"
                strokeLinecap="square"
                strokeLinejoin="miter"
              />
              <circle cx="8" cy="8.5" r="1.5" fill="#21D4FD" />
            </svg>
          </span>
          <span className="flex flex-col">
            <span className="font-mono font-semibold tracking-wider text-sm text-zinc-100 group-hover:text-white transition-colors whitespace-nowrap">
              ITU MATRIX
            </span>
            <span className="font-mono text-[10px] tracking-[0.16em] text-zinc-400 uppercase whitespace-nowrap">
              Materials Science
            </span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex flex-wrap items-center justify-center min-w-0 gap-1"
        >
          {NAV_LINKS.map((link) => {
            const isActive = activeHref === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setActiveHref(link.href)}
                className="relative px-3 py-1.5 rounded-md text-xs font-mono font-medium text-zinc-300 hover:text-white transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
              >
                {isActive && (
                  <motion.span
                    layoutId="navbar-active-pill"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    className="pointer-events-none absolute inset-0 -z-10 rounded-md bg-white/[0.06] border border-white/[0.1]"
                  />
                )}
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Desktop Right Action */}
        <div className="hidden md:flex items-center shrink-0">
          <a
            href="#partners"
            data-testid="header-cta-partners"
            onClick={() => setActiveHref("#partners")}
            className="inline-flex items-center justify-center min-h-[36px] px-3.5 py-1.5 rounded-md border border-white/[0.12] bg-surface text-xs font-mono font-medium text-zinc-200 hover:border-white/[0.24] hover:text-white transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
          >
            Partner Inquiry
          </a>
        </div>

        {/* Mobile Hamburger */}
        <div className="flex md:hidden items-center">
          <button
            type="button"
            data-testid="mobile-menu-button"
            aria-expanded={isOpen}
            aria-controls="mobile-nav-drawer"
            onClick={() => setIsOpen(!isOpen)}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-md text-zinc-300 hover:text-white hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence
        initial={false}
        onExitComplete={handleDrawerExitComplete}
      >
        {isOpen && (
          <motion.div
            key="mobile-nav-drawer"
            id="mobile-nav-drawer"
            data-testid="mobile-nav-drawer"
            initial={{ opacity: 0, height: 0, y: -6 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -6 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="md:hidden absolute inset-x-0 top-full overflow-hidden border-b border-white/[0.08] bg-[#0B0B0E]/95 backdrop-blur-xl px-6 pt-3 pb-6 space-y-2 z-50"
          >
            <div className="grid grid-cols-1 gap-1.5">
              <a
                href="#overview"
                onClick={(e) => handleMobileAnchorClick(e, "#overview")}
                className="min-h-[44px] px-3 py-2.5 flex items-center rounded-md font-mono text-xs text-zinc-200 hover:text-white hover:bg-white/[0.06] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
              >
                Overview
              </a>
              <a
                href="#research"
                onClick={(e) => handleMobileAnchorClick(e, "#research")}
                className="min-h-[44px] px-3 py-2.5 flex items-center rounded-md font-mono text-xs text-zinc-200 hover:text-white hover:bg-white/[0.06] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
              >
                Research
              </a>
              <a
                href="#subteams"
                onClick={(e) => handleMobileAnchorClick(e, "#subteams")}
                className="min-h-[44px] px-3 py-2.5 flex items-center rounded-md font-mono text-xs text-zinc-200 hover:text-white hover:bg-white/[0.06] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
              >
                Subteams
              </a>
              <a
                href="#achievements"
                onClick={(e) => handleMobileAnchorClick(e, "#achievements")}
                className="min-h-[44px] px-3 py-2.5 flex items-center rounded-md font-mono text-xs text-zinc-200 hover:text-white hover:bg-white/[0.06] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
              >
                Achievements
              </a>
              <a
                href="#partners"
                onClick={(e) => handleMobileAnchorClick(e, "#partners")}
                className="min-h-[44px] px-3 py-2.5 flex items-center rounded-md font-mono text-xs text-zinc-200 hover:text-white hover:bg-white/[0.06] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
              >
                Partners
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
