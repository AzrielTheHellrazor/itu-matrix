"use client";

import React from "react";
import { motion } from "framer-motion";
import { useSitePreferences } from "@/components/site-preferences";
import { TRANSLATIONS } from "@/data/i18n";

export function AchievementsSection() {
  const { lang } = useSitePreferences();
  const t = TRANSLATIONS[lang].achievements;

  return (
    <section
      id="achievements"
      data-testid="achievements-section"
      className="py-24 sm:py-32 border-t border-white/[0.08]"
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-8 w-full">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="max-w-2xl mb-12"
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

        <div className="border-t border-white/[0.08]">
          {t.milestones.map((item, idx) => (
            <motion.div
              key={item.id}
              data-testid={`heritage-row-${item.id}`}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.35, delay: idx * 0.04, ease: "easeOut" }}
              className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-6 py-6 border-b border-white/[0.08] items-baseline"
            >
              <div className="md:col-span-2 font-mono text-sm font-medium text-accent-cyan tabular-nums">
                {item.year}
              </div>
              <div className="md:col-span-4">
                <h3 className="text-base font-semibold text-zinc-100">
                  {item.title}
                </h3>
                <p className="font-mono text-xs text-zinc-400 mt-1">
                  {item.context}
                </p>
              </div>
              <div className="md:col-span-6 text-sm text-zinc-400 leading-relaxed">
                {item.outcome}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Verified Departmental Research Focus Areas */}
        <div className="mt-12">
          <div className="font-mono text-xs tracking-[0.14em] uppercase text-zinc-400 mb-4">
            {t.labDomainsLabel}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {t.labAreas.map((area) => (
              <div
                key={area.id}
                data-testid={`lab-area-card-${area.id}`}
                className="rounded-lg border border-white/[0.08] bg-surface px-4 py-3.5"
              >
                <div className="text-sm font-medium text-zinc-200">
                  {area.name}
                </div>
                <div className="font-mono text-xs text-zinc-400 mt-1">
                  {area.scope}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
