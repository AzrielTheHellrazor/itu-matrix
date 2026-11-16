"use client";

import React from "react";
import { Trophy, Award, Medal, Star } from "lucide-react";

export const ACHIEVEMENTS = [
  {
    year: "2024",
    title: "European Rover Challenge (ERC) Bronze Medal",
    location: "Kielce, Poland",
    rank: "Bronze Medal / 3rd Place",
    description: "Podium finish among top global robotics teams competing in extreme simulated Mars environments.",
    color: "#CD7F32",
    badge: "ERC 2024",
  },
  {
    year: "2022",
    title: "European Rover Challenge (ERC) Bronze Medal",
    location: "Kielce, Poland",
    rank: "Bronze Medal / 3rd Place",
    description: "Exceptional performance in navigation, presentation, and geological scientific sampling.",
    color: "#CD7F32",
    badge: "ERC 2022",
  },
  {
    year: "2021",
    title: "European Rover Challenge (ERC) Silver Medal & Best Robotic Arm",
    location: "Kielce, Poland",
    rank: "Silver Medal / 2nd Place",
    description: "Awarded 2nd in the World and Best Robotic Arm Special Award for 6-DOF manipulation precision.",
    color: "#C0C0C0",
    badge: "ERC 2021",
  },
  {
    year: "2020",
    title: "University Rover Challenge (URC) World 3rd Place",
    location: "MDRS, Hanksville, Utah, USA",
    rank: "World 3rd Place",
    description: "Historic achievement placing 3rd in the world out of 93 international university rover teams.",
    color: "#FCED3A",
    badge: "URC 2020",
  },
  {
    year: "2018",
    title: "University Rover Challenge (URC) Best Science System Award",
    location: "MDRS, Hanksville, Utah, USA",
    rank: "Special Science Award",
    description: "First time conferred in URC history for the autonomous soil analysis and life-detection payload.",
    color: "#10B981",
    badge: "URC 2018",
  },
  {
    year: "2017",
    title: "University Rover Challenge (URC) Finalist & European Rover Challenge Debut",
    location: "Utah, USA & Poland",
    rank: "International Finalist",
    description: "First Turkish university robotics team to qualify and compete as finalists in both URC and ERC.",
    color: "#21D4FD",
    badge: "URC 2017",
  },
];

export function AchievementsTimeline() {
  return (
    <section id="competitions" data-testid="achievements-timeline" className="w-full py-16">
      <div className="text-center mb-12">
        <h2 className="text-2xl sm:text-4xl font-bold font-mono text-white mb-3">
          Competitions & Global Achievements
        </h2>
        <p className="text-sm text-zinc-400 font-mono max-w-2xl mx-auto">
          Proven international podium success across the University Rover Challenge (Utah) and European Rover Challenge (Poland).
        </p>
      </div>

      <div className="relative border-l border-white/10 ml-4 md:ml-32 space-y-8 sm:space-y-12">
        {ACHIEVEMENTS.map((item) => (
          <div
            key={item.badge}
            data-testid="timeline-card"
            data-timeline-event={item.badge.toLowerCase().replace(" ", "-")}
            className="relative pl-6 sm:pl-8 group"
          >
            {/* Timeline Node Icon */}
            <div
              style={{ borderColor: item.color }}
              className="absolute -left-3 top-1.5 w-6 h-6 rounded-full bg-canvas border-2 flex items-center justify-center transition-transform group-hover:scale-125"
            >
              <Trophy className="w-3 h-3 text-white" />
            </div>

            <div className="p-5 sm:p-6 rounded-xl bg-surface border border-white/10 group-hover:border-accent-yellow/40 transition-all">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/5 text-accent-yellow font-bold">
                  {item.year} &mdash; {item.badge}
                </span>
                <span className="text-xs font-mono text-zinc-400">{item.location}</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold font-mono text-white mb-1">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 font-mono leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
