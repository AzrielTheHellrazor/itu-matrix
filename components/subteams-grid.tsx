"use client";

import React from "react";
import { motion } from "framer-motion";
import { useSitePreferences } from "@/components/site-preferences";
import { TRANSLATIONS } from "@/data/i18n";

export function SubteamsGrid() {
  const { lang } = useSitePreferences();
  const t = TRANSLATIONS[lang].subteams;

  return (
    <section
      id="subteams"
      data-testid="subteams-section"
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {t.divisions.map((division, idx) => (
            <motion.article
              key={division.id}
              data-testid={`subteam-card-${division.id}`}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.4, delay: idx * 0.04, ease: "easeOut" }}
              className={`rounded-xl border border-white/[0.08] bg-surface p-6 sm:p-8 hover:border-white/[0.18] transition-colors ${division.colSpan ?? ""}`}
            >
              <div className="font-mono text-xs uppercase tracking-wider text-accent-cyan mb-3">
                {division.focus}
              </div>
              <h3 className="text-lg font-semibold tracking-tight text-zinc-100 mb-2.5">
                {division.name}
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                {division.description}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
