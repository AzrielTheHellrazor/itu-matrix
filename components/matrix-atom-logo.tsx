"use client";

import React, { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

interface OrbitalRingSpec {
  id: string;
  baseAngle: number;
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  initialPhaseDeg: number;
  speedDegPerSec: number;
  electronRadius: number;
  path: string;
}

/**
 * Vectorized orbital ellipses centered at (0, 0) before rotation,
 * each carrying an electron orbiting smoothly along its elliptical midline.
 */
const ORBITAL_RINGS: readonly OrbitalRingSpec[] = [
  {
    id: "outer-steep",
    baseAngle: 22,
    cx: 0.7,
    cy: 0.075,
    rx: 36.0,
    ry: 115.0,
    initialPhaseDeg: 28,
    speedDegPerSec: 95,
    electronRadius: 5.2,
    path: "M 37.9 0 A 37.9 117.2 0 1 1 -37.9 0 A 37.9 117.2 0 1 1 37.9 0 Z M 35.5 0.15 A 34.1 112.8 0 1 0 -32.7 0.15 A 34.1 112.8 0 1 0 35.5 0.15 Z",
  },
  {
    id: "wide-horizontal",
    baseAngle: 18,
    cx: 0.225,
    cy: -0.375,
    rx: 97.5,
    ry: 22.6,
    initialPhaseDeg: 145,
    speedDegPerSec: -120,
    electronRadius: 4.8,
    path: "M 99.1 0 A 99.1 24.15 0 1 1 -99.1 0 A 99.1 24.15 0 1 1 99.1 0 Z M 96.35 -0.75 A 95.9 21.05 0 1 0 -95.45 -0.75 A 95.9 21.05 0 1 0 96.35 -0.75 Z",
  },
  {
    id: "inner-vertical",
    baseAngle: -1,
    cx: 0.225,
    cy: 0.225,
    rx: 18.6,
    ry: 60.4,
    initialPhaseDeg: 235,
    speedDegPerSec: 150,
    electronRadius: 4.4,
    path: "M 19.85 0 A 19.85 61.65 0 1 1 -19.85 0 A 19.85 61.65 0 1 1 19.85 0 Z M 17.8 0.45 A 17.35 59.15 0 1 0 -16.9 0.45 A 17.35 59.15 0 1 0 17.8 0.45 Z",
  },
  {
    id: "inner-diagonal",
    baseAngle: -22,
    cx: -0.125,
    cy: -0.25,
    rx: 63.3,
    ry: 19.7,
    initialPhaseDeg: 315,
    speedDegPerSec: -135,
    electronRadius: 4.4,
    path: "M 64.5 0 A 64.5 20.9 0 1 1 -64.5 0 A 64.5 20.9 0 1 1 64.5 0 Z M 61.85 -0.5 A 62.1 18.5 0 1 0 -62.35 -0.5 A 62.1 18.5 0 1 0 61.85 -0.5 Z",
  },
];

const NUCLEUS_STAR_PATH =
  "M 0 -9.9 Q 1.24 -9.9 2.00 -9.25 Q 4.15 -4.15 9.25 -2.00 Q 9.9 -1.24 9.9 0 Q 9.9 1.24 9.25 2.00 Q 4.15 4.15 2.00 9.25 Q 1.24 9.9 0 9.9 Q -1.24 9.9 -2.00 9.25 Q -4.15 4.15 -9.25 2.00 Q -9.9 1.24 -9.9 0 Q -9.9 -1.24 -9.25 -2.00 Q -4.15 -4.15 -2.00 -9.25 Q -1.24 -9.9 0 -9.9 Z";

export interface MatrixAtomLogoProps
  extends Omit<React.SVGProps<SVGSVGElement>, "children"> {
  /** Enables continuous electron orbital motion and subtle nucleus pulse. */
  animated?: boolean;
  /** Playback speed multiplier when animated is enabled. */
  speed?: number;
  className?: string;
}

function getElectronCoords(ring: OrbitalRingSpec, phaseDeg: number) {
  const rad = (phaseDeg * Math.PI) / 180;
  return {
    x: ring.cx + ring.rx * Math.cos(rad),
    y: ring.cy + ring.ry * Math.sin(rad),
  };
}

/**
 * Scalable ITU Matrix atomic orbital mark rendered with currentColor
 * so it adapts automatically between dark and light themes.
 */
export function MatrixAtomLogo({
  animated = true,
  speed = 0.7,
  className = "",
  width,
  height,
  ...svgProps
}: MatrixAtomLogoProps) {
  const framerReducedMotion = useReducedMotion();
  const [mediaReducedMotion, setMediaReducedMotion] = useState(false);

  const electronRefs = useRef<Array<SVGGElement | null>>([]);
  const coreRef = useRef<SVGGElement | null>(null);
  const phasesRef = useRef<number[]>(
    ORBITAL_RINGS.map((ring) => ring.initialPhaseDeg)
  );
  const elapsedRef = useRef<number>(0);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => setMediaReducedMotion(mediaQuery.matches);
    syncPreference();

    mediaQuery.addEventListener("change", syncPreference);
    return () => mediaQuery.removeEventListener("change", syncPreference);
  }, []);

  const shouldAnimate = animated && !framerReducedMotion && !mediaReducedMotion;

  useEffect(() => {
    const resetRestingPose = () => {
      phasesRef.current = ORBITAL_RINGS.map((ring) => ring.initialPhaseDeg);
      elapsedRef.current = 0;
      ORBITAL_RINGS.forEach((ring, idx) => {
        const pos = getElectronCoords(ring, ring.initialPhaseDeg);
        electronRefs.current[idx]?.setAttribute(
          "transform",
          `translate(${pos.x.toFixed(2)} ${pos.y.toFixed(2)})`
        );
      });
      coreRef.current?.setAttribute("transform", "translate(128 128) scale(1)");
    };

    if (!shouldAnimate) {
      resetRestingPose();
      return;
    }

    let rafId = 0;
    let lastTimestamp: number | null = null;

    const tick = (timestamp: number) => {
      if (lastTimestamp === null) {
        lastTimestamp = timestamp;
      }
      const dtSec = Math.min((timestamp - lastTimestamp) / 1000, 0.1);
      lastTimestamp = timestamp;

      elapsedRef.current += dtSec * speed;

      ORBITAL_RINGS.forEach((ring, idx) => {
        const nextPhase =
          (phasesRef.current[idx] + ring.speedDegPerSec * speed * dtSec + 360) %
          360;
        phasesRef.current[idx] = nextPhase;
        const pos = getElectronCoords(ring, nextPhase);
        electronRefs.current[idx]?.setAttribute(
          "transform",
          `translate(${pos.x.toFixed(2)} ${pos.y.toFixed(2)})`
        );
      });

      const pulseScale =
        1 + 0.055 * Math.sin(elapsedRef.current * ((2 * Math.PI) / 3.6));
      coreRef.current?.setAttribute(
        "transform",
        `translate(128 128) scale(${pulseScale.toFixed(4)})`
      );

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [shouldAnimate, speed]);

  const hasAccessibleLabel = Boolean(
    svgProps["aria-label"] || svgProps["aria-labelledby"]
  );

  return (
    <svg
      viewBox="0 0 256 256"
      width={width ?? 128}
      height={height ?? 128}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role={hasAccessibleLabel ? "img" : undefined}
      aria-hidden={hasAccessibleLabel ? undefined : true}
      data-animated={shouldAnimate ? "true" : "false"}
      className={`inline-block shrink-0 ${className}`.trim()}
      {...svgProps}
    >
      {ORBITAL_RINGS.map((ring, idx) => {
        const initialPos = getElectronCoords(ring, ring.initialPhaseDeg);
        return (
          <g
            key={ring.id}
            data-orbit-ring={ring.id}
            transform={`translate(128 128) rotate(${ring.baseAngle})`}
          >
            <path d={ring.path} fill="currentColor" fillRule="evenodd" />
            <g
              ref={(el) => {
                electronRefs.current[idx] = el;
              }}
              data-electron={ring.id}
              transform={`translate(${initialPos.x.toFixed(2)} ${initialPos.y.toFixed(2)})`}
            >
              <circle
                r={ring.electronRadius * 2}
                fill="currentColor"
                opacity="0.22"
              />
              <circle r={ring.electronRadius} fill="currentColor" />
            </g>
          </g>
        );
      })}
      <g
        ref={coreRef}
        data-orbit-core="nucleus"
        transform="translate(128 128) scale(1)"
      >
        <path d={NUCLEUS_STAR_PATH} fill="currentColor" />
      </g>
    </svg>
  );
}
