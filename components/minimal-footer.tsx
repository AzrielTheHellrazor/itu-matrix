"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
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
          <div className="lg:col-span-7">
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

          <div className="lg:col-span-5 flex flex-col items-start lg:items-end justify-center gap-4">
            <p className="text-xs font-mono text-zinc-300 lg:text-right max-w-sm leading-relaxed">
              Academic collaboration and laboratory sponsorship inquiries are
              coordinated through official İTÜ institutional channels.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href={CLUB_INFO.institutionUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="footer-itu-link"
                className="inline-flex items-center gap-1.5 min-h-[40px] px-3.5 py-2 rounded-md border border-white/[0.12] bg-canvas text-xs font-mono text-zinc-200 hover:text-white hover:border-white/[0.24] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
              >
                <span>İTÜ Portal</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
              <a
                href={CLUB_INFO.departmentUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="footer-mme-link"
                className="inline-flex items-center gap-1.5 min-h-[40px] px-3.5 py-2 rounded-md border border-white/[0.12] bg-canvas text-xs font-mono text-zinc-200 hover:text-white hover:border-white/[0.24] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
              >
                <span>Metallurgical &amp; Materials Eng.</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
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
