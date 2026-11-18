"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import { useSitePreferences } from "@/components/site-preferences";
import { TRANSLATIONS } from "@/data/i18n";
import type { ResearchProject } from "@/data/materials-data";
import { AshbyMatrix } from "@/components/ashby-matrix";

const ACCENT_DOT: Record<ResearchProject["accent"], string> = {
  cyan: "bg-accent-cyan",
  violet: "bg-accent-purple",
  amber: "bg-accent-amber",
};

const REVEAL_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function MaterialsShowcase() {
  const [isCaseStudyOpen, setIsCaseStudyOpen] = useState(false);
  const { lang } = useSitePreferences();
  const t = TRANSLATIONS[lang].research;

  useEffect(() => {
    if (!isCaseStudyOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsCaseStudyOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isCaseStudyOpen]);

  return (
    <section
      id="research"
      data-testid="research-section"
      className="py-24 sm:py-32 border-t border-white/[0.08]"
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-8 w-full">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.52, ease: REVEAL_EASE }}
          className="max-w-2xl mb-14"
        >
          <p className="font-mono text-xs tracking-[0.14em] uppercase text-zinc-400 mb-3">
            {t.eyebrow}
          </p>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.025em] text-zinc-100 mb-4">
            {t.title}
          </h2>
          <p className="text-base text-zinc-400 leading-relaxed">
            {t.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {t.projects.map((project, idx) => {
            const isMat01 = project.code === "MAT-01";
            return (
              <motion.article
                key={project.id}
                data-testid={`research-card-${project.code}`}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.48,
                  delay: idx * 0.06,
                  ease: REVEAL_EASE,
                }}
                whileHover={{
                  y: -3,
                  transition: { duration: 0.2, delay: 0, ease: REVEAL_EASE },
                }}
                className="rounded-xl border border-white/[0.08] bg-surface p-6 sm:p-8 hover:border-white/[0.18] transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-4 mb-5">
                    <span className="inline-flex items-center gap-2 font-mono text-xs tracking-wider text-zinc-300">
                      <span
                        aria-hidden="true"
                        className={`h-1.5 w-1.5 rounded-full ${ACCENT_DOT[project.accent]}`}
                      />
                      {project.code}
                    </span>
                    <span className="font-mono text-xs text-zinc-400">
                      {project.domain}
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold tracking-tight text-zinc-100 mb-3">
                    {project.title}
                  </h3>

                  <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                    {project.summary}
                  </p>
                </div>

                <div className="pt-5 border-t border-white/[0.08] flex items-end justify-between gap-4">
                  <div className="grid grid-cols-2 gap-4 flex-1">
                    {project.metrics.slice(0, 2).map((metric) => (
                      <div key={metric.label}>
                        <div className="font-mono text-[11px] uppercase tracking-wider text-zinc-400 mb-1">
                          {metric.label}
                        </div>
                        <div className="font-mono text-sm font-medium text-zinc-200 tabular-nums">
                          {metric.value}
                        </div>
                      </div>
                    ))}
                  </div>

                  {isMat01 && (
                    <button
                      type="button"
                      data-testid="mat01-case-study-btn"
                      onClick={() => setIsCaseStudyOpen(true)}
                      className="inline-flex items-center gap-1 min-h-[36px] px-3 py-1.5 rounded-md border border-white/[0.12] bg-canvas text-xs font-mono text-accent-cyan hover:border-accent-cyan/50 transition-colors cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
                    >
                      <span>{t.caseStudyCta}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* Conceptual Ashby Materials Selection Matrix */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.52, delay: 0.1, ease: REVEAL_EASE }}
        >
          <AshbyMatrix />
        </motion.div>
      </div>

      {/* MAT-01 EELISA Case Study Modal */}
      <AnimatePresence>
        {isCaseStudyOpen && (
          <motion.div
            key="case-study-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: REVEAL_EASE }}
            onClick={() => setIsCaseStudyOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="case-study-title"
              data-testid="mat01-case-study-modal"
              initial={{ opacity: 0, scale: 0.97, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 8 }}
              transition={{ duration: 0.24, ease: REVEAL_EASE }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl rounded-xl border border-white/[0.16] bg-surface p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between gap-4 mb-5">
                <span className="font-mono text-xs text-accent-cyan">
                  {t.caseStudy.badge}
                </span>
                <button
                  type="button"
                  data-testid="mat01-case-study-close"
                  onClick={() => setIsCaseStudyOpen(false)}
                  aria-label={t.caseStudy.close}
                  className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-md border border-white/[0.1] text-zinc-400 hover:text-zinc-100 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <h3
                id="case-study-title"
                className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-100 mb-6"
              >
                {t.caseStudy.title}
              </h3>

              <div className="space-y-4">
                <div className="rounded-lg border border-white/[0.08] bg-canvas/60 p-4">
                  <div className="font-mono text-xs uppercase tracking-wider text-zinc-400 mb-1.5">
                    {t.caseStudy.problemLabel}
                  </div>
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    {t.caseStudy.problem}
                  </p>
                </div>

                <div className="rounded-lg border border-white/[0.08] bg-canvas/60 p-4">
                  <div className="font-mono text-xs uppercase tracking-wider text-accent-cyan mb-1.5">
                    {t.caseStudy.methodLabel}
                  </div>
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    {t.caseStudy.method}
                  </p>
                </div>

                <div className="rounded-lg border border-white/[0.08] bg-canvas/60 p-4">
                  <div className="font-mono text-xs uppercase tracking-wider text-accent-amber mb-1.5">
                    {t.caseStudy.resultLabel}
                  </div>
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    {t.caseStudy.result}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/[0.08]">
                  <div>
                    <div className="font-mono text-[11px] uppercase tracking-wider text-zinc-400 mb-1">
                      {t.caseStudy.teamLabel}
                    </div>
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      {t.caseStudy.team}
                    </p>
                  </div>
                  <div>
                    <div className="font-mono text-[11px] uppercase tracking-wider text-zinc-400 mb-1">
                      {t.caseStudy.guidanceLabel}
                    </div>
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      {t.caseStudy.guidance}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
