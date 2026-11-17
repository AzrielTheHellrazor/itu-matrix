"use client";

import React from "react";
import { motion } from "framer-motion";
import { useSitePreferences } from "@/components/site-preferences";
import { TRANSLATIONS } from "@/data/i18n";
import type { ResearchProject } from "@/data/materials-data";

const ACCENT_DOT: Record<ResearchProject["accent"], string> = {
  cyan: "bg-accent-cyan",
  violet: "bg-accent-purple",
  amber: "bg-accent-amber",
};

export function MaterialsShowcase() {
  const { lang } = useSitePreferences();
  const t = TRANSLATIONS[lang].research;

  return (
    <section
      id="research"
      data-testid="research-section"
      className="py-24 sm:py-32 border-t border-white/[0.08]"
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-8 w-full">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
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
          {t.projects.map((project, idx) => (
            <motion.article
              key={project.id}
              data-testid={`research-card-${project.code}`}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.4, delay: idx * 0.05, ease: "easeOut" }}
              whileHover={{ y: -2 }}
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

              <div className="grid grid-cols-2 gap-4 pt-5 border-t border-white/[0.08]">
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
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
