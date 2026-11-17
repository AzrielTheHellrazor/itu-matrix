"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useSitePreferences } from "@/components/site-preferences";
import { TRANSLATIONS } from "@/data/i18n";

type DomainId = "sustainability" | "aerospace" | "energy";

const DOMAIN_POSITIONS: Record<
  DomainId,
  { cx: number; cy: number; rx: number; ry: number; color: string }
> = {
  sustainability: { cx: 240, cy: 118, rx: 68, ry: 34, color: "#21D4FD" },
  aerospace: { cx: 145, cy: 58, rx: 64, ry: 30, color: "#AF52DE" },
  energy: { cx: 270, cy: 68, rx: 62, ry: 32, color: "#F59E0B" },
};

export function AshbyMatrix() {
  const [activeDomain, setActiveDomain] = useState<DomainId>("sustainability");
  const { lang } = useSitePreferences();
  const t = TRANSLATIONS[lang].research.ashby;

  const current =
    t.domains.find((d) => d.id === activeDomain) ?? t.domains[0];

  return (
    <div
      data-testid="ashby-matrix"
      className="mt-12 rounded-xl border border-white/[0.08] bg-surface p-6 sm:p-8"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Controls & Engineering Summary */}
        <div className="lg:col-span-5">
          <p className="font-mono text-xs tracking-[0.14em] uppercase text-zinc-400 mb-2">
            {t.eyebrow}
          </p>
          <h3 className="text-xl font-semibold tracking-tight text-zinc-100 mb-4">
            {t.title}
          </h3>

          <div
            role="group"
            aria-label={t.title}
            className="flex flex-wrap gap-2 mb-5"
          >
            {t.domains.map((domain) => {
              const isSelected = domain.id === activeDomain;
              return (
                <button
                  key={domain.id}
                  type="button"
                  data-testid={`ashby-btn-${domain.id}`}
                  aria-pressed={isSelected}
                  onClick={() => setActiveDomain(domain.id)}
                  className={`min-h-[36px] px-3 py-1.5 rounded-md border text-xs font-mono transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan ${
                    isSelected
                      ? "border-accent-cyan/60 bg-white/[0.06] text-zinc-100"
                      : "border-white/[0.08] text-zinc-400 hover:text-zinc-200 hover:border-white/[0.18]"
                  }`}
                >
                  {domain.label}
                </button>
              );
            })}
          </div>

          <div className="rounded-lg border border-white/[0.08] bg-canvas/60 p-4">
            <div className="font-mono text-xs text-accent-cyan mb-1">
              {current.material}
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed">
              {current.summary}
            </p>
          </div>
        </div>

        {/* Right Conceptual Ashby Coordinate Plot */}
        <div className="lg:col-span-7">
          <div className="rounded-lg border border-white/[0.08] bg-canvas/60 p-4">
            <svg
              viewBox="0 0 380 185"
              role="img"
              aria-label={`${t.yAxis} vs ${t.xAxis}`}
              className="w-full h-auto"
            >
              {/* Subtle Grid */}
              {[45, 90, 135].map((y) => (
                <line
                  key={`h-${y}`}
                  x1="44"
                  y1={y}
                  x2="360"
                  y2={y}
                  stroke="currentColor"
                  strokeOpacity="0.08"
                  strokeDasharray="3 3"
                />
              ))}
              {[120, 200, 280].map((x) => (
                <line
                  key={`v-${x}`}
                  x1={x}
                  y1="16"
                  x2={x}
                  y2="155"
                  stroke="currentColor"
                  strokeOpacity="0.08"
                  strokeDasharray="3 3"
                />
              ))}

              {/* Axes */}
              <line
                x1="44"
                y1="155"
                x2="360"
                y2="155"
                stroke="currentColor"
                strokeOpacity="0.28"
              />
              <line
                x1="44"
                y1="16"
                x2="44"
                y2="155"
                stroke="currentColor"
                strokeOpacity="0.28"
              />

              {/* Conceptual Envelopes */}
              {t.domains.map((domain) => {
                const pos = DOMAIN_POSITIONS[domain.id];
                const isSelected = domain.id === activeDomain;
                return (
                  <g
                    key={domain.id}
                    onClick={() => setActiveDomain(domain.id)}
                    className="cursor-pointer"
                  >
                    <motion.ellipse
                      cx={pos.cx}
                      cy={pos.cy}
                      rx={pos.rx}
                      ry={pos.ry}
                      fill={pos.color}
                      fillOpacity={isSelected ? 0.22 : 0.06}
                      stroke={pos.color}
                      strokeWidth={isSelected ? 1.75 : 1}
                      strokeOpacity={isSelected ? 0.95 : 0.35}
                      animate={{
                        scale: isSelected ? 1.03 : 1,
                      }}
                      transition={{ duration: 0.25 }}
                    />
                    <text
                      x={pos.cx}
                      y={pos.cy + 4}
                      textAnchor="middle"
                      fill="currentColor"
                      fontSize="10"
                      fontFamily="monospace"
                      opacity={isSelected ? 0.95 : 0.5}
                    >
                      {domain.label}
                    </text>
                  </g>
                );
              })}

              {/* Axis Labels */}
              <text
                x="202"
                y="175"
                textAnchor="middle"
                fill="currentColor"
                fontSize="9.5"
                fontFamily="monospace"
                opacity="0.6"
              >
                {t.xAxis} →
              </text>
              <text
                x="18"
                y="86"
                textAnchor="middle"
                fill="currentColor"
                fontSize="9.5"
                fontFamily="monospace"
                opacity="0.6"
                transform="rotate(-90 18 86)"
              >
                {t.yAxis} →
              </text>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
