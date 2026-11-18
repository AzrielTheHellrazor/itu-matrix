"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { MatrixAtomLogo } from "@/components/matrix-atom-logo";

export type IntroPhase = "playing" | "exiting" | "done";

export interface IntroSequenceContextValue {
  phase: IntroPhase;
  isRevealed: boolean;
}

interface IntroInternalContextValue extends IntroSequenceContextValue {
  isOverlayMounted: boolean;
  completeIntro: () => void;
}

const DEFAULT_PUBLIC_CONTEXT: IntroSequenceContextValue = {
  phase: "done",
  isRevealed: true,
};

const DEFAULT_INTERNAL_CONTEXT: IntroInternalContextValue = {
  phase: "done",
  isRevealed: true,
  isOverlayMounted: false,
  completeIntro: () => {},
};

const IntroSequenceContext = createContext<IntroSequenceContextValue>(
  DEFAULT_PUBLIC_CONTEXT
);

const IntroInternalContext = createContext<IntroInternalContextValue>(
  DEFAULT_INTERNAL_CONTEXT
);

const INTRO_PLAYING_DURATION_MS = 1550;
const INTRO_FALLBACK_DONE_MS = 2350;
const ATOM_ENTRANCE_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const OVERLAY_EXIT_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * Coordinates the initial atomic orbital intro splash timeline without
 * conditionally gating or unmounting page children during SSR or hydration.
 */
export function IntroProvider({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<IntroPhase>("playing");
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [isOverlayMounted, setIsOverlayMounted] = useState<boolean>(true);

  const completeIntro = useCallback(() => {
    setPhase("done");
    setIsRevealed(true);
    setIsOverlayMounted(false);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery =
      typeof window.matchMedia === "function"
        ? window.matchMedia("(prefers-reduced-motion: reduce)")
        : null;

    if (mediaQuery?.matches) {
      const immediateTimer = window.setTimeout(completeIntro, 0);
      return () => window.clearTimeout(immediateTimer);
    }

    const exitTimer = window.setTimeout(() => {
      setPhase((current) => (current === "playing" ? "exiting" : current));
      setIsRevealed(true);
    }, INTRO_PLAYING_DURATION_MS);

    const fallbackDoneTimer = window.setTimeout(() => {
      completeIntro();
    }, INTRO_FALLBACK_DONE_MS);

    const handleMotionPreferenceChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        completeIntro();
      }
    };

    mediaQuery?.addEventListener("change", handleMotionPreferenceChange);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(fallbackDoneTimer);
      mediaQuery?.removeEventListener("change", handleMotionPreferenceChange);
    };
  }, [completeIntro]);

  useEffect(() => {
    if (phase !== "exiting" || !isOverlayMounted) {
      return;
    }
    const rafId = window.requestAnimationFrame(() => {
      setIsOverlayMounted(false);
    });
    return () => window.cancelAnimationFrame(rafId);
  }, [phase, isOverlayMounted]);

  const publicValue = useMemo<IntroSequenceContextValue>(
    () => ({ phase, isRevealed }),
    [phase, isRevealed]
  );

  const internalValue = useMemo<IntroInternalContextValue>(
    () => ({ phase, isRevealed, isOverlayMounted, completeIntro }),
    [phase, isRevealed, isOverlayMounted, completeIntro]
  );

  return (
    <IntroSequenceContext.Provider value={publicValue}>
      <IntroInternalContext.Provider value={internalValue}>
        {children}
      </IntroInternalContext.Provider>
    </IntroSequenceContext.Provider>
  );
}

/**
 * Exposes the intro sequence state (`phase`, `isRevealed`).
 * Defaults to `{ phase: "done", isRevealed: true }` outside `IntroProvider`.
 */
export function useIntroSequence(): IntroSequenceContextValue {
  return useContext(IntroSequenceContext);
}

/**
 * Full-screen compositor-only splash overlay featuring the orbiting ITU Matrix
 * atom logo that dissolves smoothly as site choreography sweeps in.
 */
export function IntroSplashOverlay() {
  const { phase, isOverlayMounted, completeIntro } =
    useContext(IntroInternalContext);
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion && phase === "done") {
    return null;
  }

  return (
    <AnimatePresence onExitComplete={completeIntro}>
      {isOverlayMounted && (
        <motion.div
          key="intro-splash-overlay"
          data-testid="intro-splash-overlay"
          data-intro-phase={phase}
          aria-hidden="true"
          initial={{ opacity: 1, scale: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={
            prefersReducedMotion
              ? { opacity: 0, transition: { duration: 0 } }
              : {
                  opacity: 0,
                  scale: 1.04,
                  transition: {
                    duration: 0.5,
                    ease: OVERLAY_EXIT_EASE,
                  },
                }
          }
          className={`fixed inset-0 z-[100] flex items-center justify-center bg-canvas text-zinc-100 ${
            phase === "playing" ? "" : "pointer-events-none"
          }`.trim()}
        >
          <motion.div
            initial={
              prefersReducedMotion ? false : { opacity: 0, scale: 0.72 }
            }
            animate={{ opacity: 1, scale: 1 }}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : { duration: 0.48, ease: ATOM_ENTRANCE_EASE }
            }
            className="will-change-transform"
          >
            <MatrixAtomLogo speed={0.7} className="w-36 h-36 sm:w-44 sm:h-44" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
