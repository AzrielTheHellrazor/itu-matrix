"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useIntroSequence } from "@/components/intro-splash";
import { useSitePreferences } from "@/components/site-preferences";
import { TRANSLATIONS } from "@/data/i18n";

export interface NavbarProps {
  className?: string;
}

export function Navbar({ className = "" }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeHref, setActiveHref] = useState<string>("#research");
  const pendingScrollIdRef = useRef<string | null>(null);
  const { isRevealed } = useIntroSequence();
  const prefersReducedMotion = useReducedMotion();
  const { lang, setLang, theme, toggleTheme } = useSitePreferences();
  const t = TRANSLATIONS[lang].nav;
  const shouldRevealNav = isRevealed || Boolean(prefersReducedMotion);

  const navLinks = [
    { href: "#research", label: t.research },
    { href: "#subteams", label: t.subteams },
    { href: "#achievements", label: t.achievements },
    { href: "#partners", label: t.partners },
  ];

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

  const controls = (
    <div className="flex items-center gap-2">
      {/* TR / EN Language Switcher */}
      <div
        role="group"
        aria-label="Language selector"
        data-testid="lang-toggle"
        className="inline-flex items-center p-0.5 rounded-md border border-white/[0.12] bg-surface"
      >
        <button
          type="button"
          data-testid="lang-toggle-tr"
          aria-pressed={lang === "tr"}
          onClick={() => setLang("tr")}
          className={`min-h-[30px] px-2.5 py-1 rounded text-xs font-mono font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan ${
            lang === "tr"
              ? "bg-white/[0.1] text-zinc-100"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          TR
        </button>
        <button
          type="button"
          data-testid="lang-toggle-en"
          aria-pressed={lang === "en"}
          onClick={() => setLang("en")}
          className={`min-h-[30px] px-2.5 py-1 rounded text-xs font-mono font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan ${
            lang === "en"
              ? "bg-white/[0.1] text-zinc-100"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          EN
        </button>
      </div>

      {/* Light / Dark Theme Toggle */}
      <button
        type="button"
        data-testid="theme-toggle"
        onClick={toggleTheme}
        aria-label={theme === "dark" ? t.switchToLight : t.switchToDark}
        className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-md border border-white/[0.12] bg-surface text-zinc-200 hover:border-white/[0.24] hover:text-white transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
      >
        {theme === "dark" ? (
          <Sun className="w-4 h-4" />
        ) : (
          <Moon className="w-4 h-4" />
        )}
      </button>
    </div>
  );

  return (
    <motion.header
      data-testid="matrix-navbar"
      initial={false}
      animate={{
        y: shouldRevealNav ? 0 : -12,
        opacity: shouldRevealNav ? 1 : 0,
      }}
      transition={
        prefersReducedMotion
          ? { duration: 0 }
          : { duration: 0.48, ease: [0.16, 1, 0.3, 1] }
      }
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
            className="h-9 w-9 rounded-md border border-white/[0.14] bg-surface flex items-center justify-center p-1"
          >
            <Image
              src={
                theme === "dark"
                  ? "/itu-matrix-logo-light.png"
                  : "/itu-matrix-logo-dark.png"
              }
              alt="ITU MATRIX"
              width={28}
              height={28}
              unoptimized
              data-testid="navbar-brand-logo"
              className="h-7 w-7 object-contain"
            />
          </span>
          <span className="flex flex-col">
            <span className="font-mono font-semibold tracking-wider text-sm text-zinc-100 group-hover:text-white transition-colors whitespace-nowrap">
              ITU MATRIX
            </span>
            <span className="font-mono text-[10px] tracking-[0.16em] text-zinc-400 uppercase whitespace-nowrap">
              {t.subtitle}
            </span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex flex-wrap items-center justify-center min-w-0 gap-1"
        >
          {navLinks.map((link) => {
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

        {/* Desktop Right Controls (TR/EN + Theme) */}
        <div className="hidden md:flex items-center shrink-0">
          {controls}
        </div>

        {/* Mobile Controls & Hamburger */}
        <div className="flex md:hidden items-center gap-2">
          {controls}
          <button
            type="button"
            data-testid="mobile-menu-button"
            aria-expanded={isOpen}
            aria-controls="mobile-nav-drawer"
            onClick={() => setIsOpen(!isOpen)}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-md text-zinc-300 hover:text-white hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
            aria-label={t.toggleMenu}
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
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden absolute inset-x-0 top-full overflow-hidden border-b border-white/[0.08] bg-[#0B0B0E]/95 backdrop-blur-xl px-6 pt-3 pb-6 space-y-2 z-50"
          >
            <div className="grid grid-cols-1 gap-1.5">
              <a
                href="#overview"
                onClick={(e) => handleMobileAnchorClick(e, "#overview")}
                className="min-h-[44px] px-3 py-2.5 flex items-center rounded-md font-mono text-xs text-zinc-200 hover:text-white hover:bg-white/[0.06] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
              >
                {t.overview}
              </a>
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleMobileAnchorClick(e, link.href)}
                  className="min-h-[44px] px-3 py-2.5 flex items-center rounded-md font-mono text-xs text-zinc-200 hover:text-white hover:bg-white/[0.06] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
