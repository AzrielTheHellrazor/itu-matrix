"use client";

import React from "react";
import { motion } from "framer-motion";
import { useSitePreferences } from "@/components/site-preferences";
import { TRANSLATIONS } from "@/data/i18n";

export function MinimalFooter() {
  const { lang } = useSitePreferences();
  const t = TRANSLATIONS[lang].footer;

  return (
    <footer
      id="partners"
      data-testid="minimal-footer"
      className="border-t border-white/[0.08] bg-surface/60 py-16 sm:py-20"
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-8 w-full">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-12 border-b border-white/[0.08]"
        >
          <div className="lg:col-span-12">
            <p className="font-mono text-xs tracking-[0.14em] uppercase text-zinc-400 mb-3">
              {t.eyebrow}
            </p>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-zinc-100 mb-3">
              {t.title}
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-xl">
              {t.description}
            </p>
          </div>
        </motion.div>

        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono text-zinc-400">
          <span>{t.brandLine}</span>
          <span>{t.campus}</span>
        </div>
      </div>
    </footer>
  );
}
