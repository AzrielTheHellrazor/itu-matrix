"use client";

import React from "react";
import { motion } from "framer-motion";
import { CLUB_INFO } from "@/data/materials-data";

export function MinimalFooter() {
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
              Academic Affiliation &amp; Sponsorship Inquiry
            </p>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-zinc-100 mb-3">
              Partner with ITU Matrix
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-xl">
              Operating within the academic ecosystem of {CLUB_INFO.institution}{" "}
              ({CLUB_INFO.institutionShort}, est. {CLUB_INFO.foundedUniversity})
              — {CLUB_INFO.faculty}, {CLUB_INFO.department}, {CLUB_INFO.campus}.
            </p>
          </div>
        </motion.div>

        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono text-zinc-400">
          <span>ITU Matrix — Metallurgy &amp; Materials Science</span>
          <span>{CLUB_INFO.campus}</span>
        </div>
      </div>
    </footer>
  );
}
