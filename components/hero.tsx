"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "framer-motion";
import { Layers, Pause, Play, RotateCcw } from "lucide-react";
import { useIntroSequence } from "@/components/intro-splash";
import { useSitePreferences } from "@/components/site-preferences";
import { TRANSLATIONS } from "@/data/i18n";
import { LATTICE_SPECS, getLatticeSpec } from "@/data/materials-data";
import type { StageModelType } from "@/components/crystal-lattice-model";

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
          Loading 3D Stage
        </span>
      </div>
    ),
  }
);

const STAGE_MODES: StageModelType[] = ["MFC", "BCC", "FCC", "HCP"];
const EDITORIAL_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function Hero() {
  const [activeLattice, setActiveLattice] = useState<StageModelType>("MFC");
  const [resetNonce, setResetNonce] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [exploded, setExploded] = useState<boolean>(false);
  const { isRevealed } = useIntroSequence();
  const prefersReducedMotion = useReducedMotion();
  const { lang } = useSitePreferences();
  const t = TRANSLATIONS[lang].hero;
  const shouldRevealHero = isRevealed || Boolean(prefersReducedMotion);

  const isComposite = activeLattice === "MFC";
  const currentSpec = isComposite
    ? {
        id: "MFC" as const,
        materialExample: t.mfcReadout,
        packingFactor: "rPET/PP",
        coordinationNumber: "Nanoclay",
        accentHex: "#21D4FD",
      }
    : getLatticeSpec(activeLattice);

  return (
    <section
      id="overview"
      data-testid="hero-section"
      className="min-h-[calc(100vh-4rem)] flex items-center py-12 lg:py-20"
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Editorial Copy Column */}
          <div className="lg:col-span-5 max-w-full break-words">
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
              animate={
                shouldRevealHero ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }
              }
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : { duration: 0.52, delay: 0.04, ease: EDITORIAL_EASE }
              }
              className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.14em] uppercase text-zinc-400 mb-6"
            >
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full bg-accent-cyan"
              />
              <span>{t.eyebrow}</span>
            </motion.div>

            <motion.h1
              initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
              animate={
                shouldRevealHero ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }
              }
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : { duration: 0.52, delay: 0.1, ease: EDITORIAL_EASE }
              }
              className="text-4xl sm:text-5xl font-bold tracking-[-0.03em] leading-[1.08] text-zinc-100 mb-5"
            >
              {t.headline}
            </motion.h1>

            <motion.p
              initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
              animate={
                shouldRevealHero ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }
              }
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : { duration: 0.52, delay: 0.16, ease: EDITORIAL_EASE }
              }
              className="text-base text-zinc-400 leading-relaxed max-w-md mb-8"
            >
              {t.subcopy}
            </motion.p>

            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
              animate={
                shouldRevealHero ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }
              }
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : { duration: 0.52, delay: 0.22, ease: EDITORIAL_EASE }
              }
              className="flex flex-wrap items-center gap-3"
            >
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
            </motion.div>
          </div>

          {/* 3D Materials & Crystal Lattice Stage */}
          <motion.div
            initial={
              prefersReducedMotion
                ? false
                : { opacity: 0, y: 18, scale: 0.97 }
            }
            animate={
              shouldRevealHero
                ? { opacity: 1, y: 0, scale: 1 }
                : { opacity: 0, y: 18, scale: 0.97 }
            }
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : { duration: 0.58, delay: 0.14, ease: EDITORIAL_EASE }
            }
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

              {/* Top-left Stage Mode Switcher & Controls */}
              <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2">
                <div
                  role="group"
                  aria-label="3D material structure selector"
                  className="inline-flex items-center p-1 rounded-md border border-white/[0.1] bg-[#0B0B0E]/85 backdrop-blur-md"
                >
                  {STAGE_MODES.map((mode) => {
                    const isSelected = activeLattice === mode;
                    const specExists =
                      mode === "MFC" || LATTICE_SPECS.some((s) => s.id === mode);
                    if (!specExists) return null;
                    return (
                      <button
                        key={mode}
                        type="button"
                        data-testid={`lattice-btn-${mode}`}
                        aria-pressed={isSelected}
                        onClick={() => setActiveLattice(mode)}
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
                        <span className="relative z-10">{mode}</span>
                      </button>
                    );
                  })}
                </div>

                {isComposite && (
                  <button
                    type="button"
                    data-testid="composite-explode-btn"
                    aria-pressed={exploded}
                    onClick={() => setExploded((v) => !v)}
                    aria-label={exploded ? t.collapseLayers : t.explodeLayers}
                    title={exploded ? t.collapseLayers : t.explodeLayers}
                    className={`min-h-[36px] min-w-[36px] px-2.5 flex items-center justify-center gap-1.5 rounded-md border backdrop-blur-md text-xs font-mono transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan ${
                      exploded
                        ? "border-accent-cyan/50 bg-[#0B0B0E]/90 text-accent-cyan"
                        : "border-white/[0.1] bg-[#0B0B0E]/85 text-zinc-300 hover:text-white hover:border-white/[0.22]"
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                  </button>
                )}

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
                {isComposite ? (
                  <span>{t.mfcReadout}</span>
                ) : (
                  <>
                    <span>{currentSpec.materialExample}</span>
                    <span className="text-zinc-400">·</span>
                    <span>APF {currentSpec.packingFactor}</span>
                    <span className="text-zinc-400">·</span>
                    <span>CN {currentSpec.coordinationNumber}</span>
                  </>
                )}
              </div>

              {/* Bottom-left Composite Legend when MFC is active */}
              {isComposite && (
                <div
                  data-testid="mfc-legend"
                  className="absolute bottom-4 left-4 z-10 flex flex-wrap items-center gap-3 px-3 py-1.5 rounded-md border border-white/[0.08] bg-[#0B0B0E]/80 backdrop-blur-md font-mono text-[11px] text-zinc-300"
                >
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-zinc-400" />
                    {t.mfcLegendMatrix}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-accent-cyan" />
                    {t.mfcLegendFibril}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-accent-amber" />
                    {t.mfcLegendClay}
                  </span>
                </div>
              )}

              {/* 3D Canvas */}
              <CrystalLatticeViewport
                latticeType={activeLattice}
                resetNonce={resetNonce}
                isPaused={isPaused}
                exploded={exploded}
                accentHex={currentSpec.accentHex}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
