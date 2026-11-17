"use client";

import React from "react";
import { motion } from "framer-motion";
import { HERITAGE_MILESTONES, LAB_FOCUS_AREAS } from "@/data/materials-data";

export function AchievementsSection() {
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
            Institutional Heritage
          </p>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.025em] text-zinc-100 mb-4">
            Grounded in İTÜ Metallurgy Tradition
          </h2>
          <p className="text-base text-zinc-400 leading-relaxed">
            Built within Turkey&apos;s oldest engineering university and its
            pioneering Department of Metallurgical and Materials Engineering.
          </p>
        </motion.div>

        <div className="border-t border-white/[0.08]">
          {HERITAGE_MILESTONES.map((item, idx) => (
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
            Departmental Laboratory Domains
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {LAB_FOCUS_AREAS.map((area) => (
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
