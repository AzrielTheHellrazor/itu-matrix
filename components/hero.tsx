"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Pause, Play, RotateCcw } from "lucide-react";
import { useSitePreferences } from "@/components/site-preferences";
import { TRANSLATIONS } from "@/data/i18n";
import {
  LATTICE_SPECS,
  getLatticeSpec,
  type LatticeSystem,
} from "@/data/materials-data";

const CrystalLatticeViewport = dynamic(
  () => import("@/components/crystal-lattice-viewport"),
  {
    ssr: false,
    loading: () => (
      <div
        data-testid="lattice-ssr-placeholder"
        className="w-full h-full flex flex-col items-center justify-center bg-surface rounded-xl p-8"
      >
        <div className="h-6 w-6 rounded-full border border-white/15 border-t-accent-cyan animate-spin mb-3" />
        <span className="font-mono text-xs tracking-widest uppercase text-zinc-400">
          Loading Unit Cell
        </span>
      </div>
    ),
  }
);

export function Hero() {
  const [activeLattice, setActiveLattice] = useState<LatticeSystem>("BCC");
  const [resetNonce, setResetNonce] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const { lang } = useSitePreferences();
  const t = TRANSLATIONS[lang].hero;

  const currentSpec = getLatticeSpec(activeLattice);

  return (
    <section
      id="overview"
      data-testid="hero-section"
      className="min-h-[calc(100vh-4rem)] flex items-center py-12 lg:py-20"
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Editorial Copy Column */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="lg:col-span-5 max-w-full break-words"
          >
            <div className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.14em] uppercase text-zinc-400 mb-6">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full bg-accent-cyan"
              />
              <span>{t.eyebrow}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold tracking-[-0.03em] leading-[1.08] text-zinc-100 mb-5">
              {t.headline}
            </h1>

            <p className="text-base text-zinc-400 leading-relaxed max-w-md mb-8">
              {t.subcopy}
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#research"
                data-testid="hero-cta-research"
                className="inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 rounded-md bg-zinc-100 text-[#0B0B0E] text-sm font-medium hover:bg-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
              >
                {t.ctaResearch}
              </a>
              <a
                href="#subteams"
                data-testid="hero-cta-subteams"
                className="inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 rounded-md border border-white/[0.12] bg-surface text-sm font-medium text-zinc-200 hover:border-white/[0.24] hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
              >
                {t.ctaSubteams}
              </a>
            </div>
          </motion.div>

          {/* 3D Crystal Lattice Stage */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08, ease: "easeOut" }}
            className="lg:col-span-7"
          >
            <div
              data-testid="crystal-lattice-stage"
              data-lattice-type={activeLattice}
              className="relative h-[380px] sm:h-[460px] lg:h-[500px] w-full rounded-xl border border-white/[0.08] bg-surface overflow-hidden"
            >
              {/* Single restrained ambient radial highlight */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-15"
                style={{
                  background: `radial-gradient(circle at 50% 45%, ${currentSpec.accentHex}, transparent 68%)`,
                }}
              />

              {/* Top-left Lattice System Switcher & Controls */}
              <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2">
                <div
                  role="group"
                  aria-label="Crystal lattice unit cell selector"
                  className="inline-flex items-center p-1 rounded-md border border-white/[0.1] bg-[#0B0B0E]/85 backdrop-blur-md"
                >
                  {LATTICE_SPECS.map((spec) => {
                    const isSelected = activeLattice === spec.id;
                    return (
                      <button
                        key={spec.id}
                        type="button"
                        data-testid={`lattice-btn-${spec.id}`}
                        aria-pressed={isSelected}
                        onClick={() => setActiveLattice(spec.id)}
                        className={`relative min-h-[28px] min-w-[44px] px-2.5 py-1 rounded text-xs font-mono font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan ${
                          isSelected
                            ? "text-zinc-100"
                            : "text-zinc-400 hover:text-zinc-200"
                        }`}
                      >
                        {isSelected && (
                          <motion.span
                            layoutId="lattice-pill"
                            transition={{
                              type: "spring",
                              stiffness: 400,
                              damping: 32,
                            }}
                            className="pointer-events-none absolute inset-0 rounded bg-white/[0.1] border border-white/[0.16]"
                          />
                        )}
                        <span className="relative z-10">{spec.id}</span>
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  data-testid="lattice-reset-btn"
                  onClick={() => setResetNonce((n) => n + 1)}
                  aria-label={t.resetCamera}
                  className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-md border border-white/[0.1] bg-[#0B0B0E]/85 backdrop-blur-md text-zinc-300 hover:text-white hover:border-white/[0.22] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  data-testid="lattice-pause-btn"
                  aria-pressed={isPaused}
                  onClick={() => setIsPaused((p) => !p)}
                  aria-label={isPaused ? t.resumeRotation : t.pauseRotation}
                  className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-md border border-white/[0.1] bg-[#0B0B0E]/85 backdrop-blur-md text-zinc-300 hover:text-white hover:border-white/[0.22] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
                >
                  {isPaused ? (
                    <Play className="w-3.5 h-3.5" />
                  ) : (
                    <Pause className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {/* Top-right Material Spec Readout */}
              <div
                data-testid="lattice-spec-readout"
                className="hidden sm:flex items-center gap-2 absolute top-4 right-4 z-10 px-3 py-1.5 rounded-md border border-white/[0.08] bg-[#0B0B0E]/80 backdrop-blur-md font-mono text-[11px] text-zinc-300"
              >
                <span>{currentSpec.materialExample}</span>
                <span className="text-zinc-400">·</span>
                <span>APF {currentSpec.packingFactor}</span>
                <span className="text-zinc-400">·</span>
                <span>CN {currentSpec.coordinationNumber}</span>
              </div>

              {/* 3D Canvas */}
              <CrystalLatticeViewport
                latticeType={activeLattice}
                resetNonce={resetNonce}
                isPaused={isPaused}
                accentHex={currentSpec.accentHex}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
