"use client";

import React from "react";
import { Trophy, MapPin } from "lucide-react";

export interface TimelineAchievement {
  year: number;
  competition: string;
  award: string;
  rank: string;
  location: string;
  rover: string;
  badgeColor: string;
  description: string;
}

export const ACHIEVEMENTS: TimelineAchievement[] = [
  {
    year: 2026,
    competition: "URC 2026 & ERC 2026 Engineering Cycle",
    award: "2026 Generation Mission Roadmap",
    rank: "Active Mission Cycle",
    location: "Hanksville, Utah & Kielce, Poland",
    rover: "Matrix 6th Gen (2026)",
    badgeColor: "#FCED3A",
    description:
      "Active engineering development of our 2026 planetary rover featuring carbon-aluminum hybrid monocoque chassis, CAN-FD hub actuation, and ROS 2 edge autonomy.",
  },
  {
    year: 2024,
    competition: "European Rover Challenge (ERC 2024)",
    award: "European Rover Challenge (ERC) Bronze Medal",
    rank: "Bronze Medal / 3rd Place",
    location: "Kielce, Poland",
    rover: "5th Gen Rover (İnan Evolution)",
    badgeColor: "#CD7F32",
    description:
      "Secured 3rd place overall podium at the European Rover Challenge 2024 against top international university space robotics teams.",
  },
  {
    year: 2022,
    competition: "European Rover Challenge (ERC 2022)",
    award: "European Rover Challenge (ERC) Bronze Medal & Presentation Award",
    rank: "Bronze Medal / 3rd Place",
    location: "Kielce, Poland",
    rover: "5th Gen Rover (İnan Evolution)",
    badgeColor: "#CD7F32",
    description:
      "Achieved 3rd place overall European podium alongside the Special Award for Technical Presentation.",
  },
  {
    year: 2021,
    competition: "European Rover Challenge (ERC 2021)",
    award: "European Rover Challenge (ERC) Silver Medal & Best Robotic Arm",
    rank: "Silver Medal / 2nd Place",
    location: "Kielce, Poland",
    rover: "5th Gen Rover (İnan)",
    badgeColor: "#C0C0C0",
    description:
      "Awarded European Rover Challenge (ERC) Silver Medal and Best Robotic Arm Special Award with Rover İnan, demonstrating sub-millimeter 6-DOF dexterity.",
  },
  {
    year: 2020,
    competition: "University Rover Challenge (URC 2020)",
    award: "University Rover Challenge (URC) World 3rd Place",
    rank: "World 3rd Place",
    location: "MDRS, Hanksville, Utah",
    rover: "4th Gen Rover (Altınay)",
    badgeColor: "#FCED3A",
    description:
      "Ranked World 3rd Place out of 93 global university teams at MDRS, Hanksville, Utah with 4th generation Rover Altınay.",
  },
  {
    year: 2018,
    competition: "University Rover Challenge (URC 2018)",
    award: "Best Science System Award",
    rank: "First time conferred in URC history",
    location: "MDRS, Hanksville, Utah",
    rover: "2nd Gen Rover (İnan)",
    badgeColor: "#FCED3A",
    description:
      "Conferred the Best Science System Award — First time conferred in URC history. Rover İnan was dedicated in honor of Prof. Dr. Mustafa İnan.",
  },
  {
    year: 2017,
    competition: "University Rover Challenge (URC 2017)",
    award: "First Turkish Team in URC History",
    rank: "Pioneer World Finalist",
    location: "MDRS, Hanksville, Utah",
    rover: "1st Gen Rover Altınay Mars Kaşifi",
    badgeColor: "#CD7F32",
    description:
      "Competed at MDRS, Hanksville, Utah with the 1st Gen Rover Altınay Mars Kaşifi as the first Turkish robotics team in URC history.",
  },
];

export function AchievementsTimeline() {
  return (
    <section
      id="competitions"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-canvas border-t border-white/10"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-14">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-2 w-2 rounded-full bg-accent-yellow" />
            <span className="font-mono text-xs text-accent-yellow tracking-widest uppercase">
              {"// COMPETITIONS & PODIUM HERITAGE"}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight">
            International Podium Roadmap
          </h2>
          <p className="mt-2 text-zinc-400 text-sm max-w-2xl leading-relaxed">
            From our pioneering Utah debut to world and European podiums, ITU Matrix has set benchmarks for Turkish planetary robotics.
          </p>
        </div>

        {/* Vertical Timeline Spine */}
        <div
          data-testid="achievements-timeline"
          className="relative border-l border-white/10 ml-4 md:ml-32 space-y-10 pb-4"
        >
          {ACHIEVEMENTS.map((item, idx) => (
            <div key={idx} className="relative pl-6 md:pl-10 group">
              {/* Desktop Year Label */}
              <div className="hidden md:block absolute -left-28 top-1 font-mono text-sm font-bold text-zinc-400 group-hover:text-accent-yellow transition-colors text-right w-20">
                {item.year}
              </div>

              {/* Timeline Marker Node */}
              <div
                className="absolute -left-[9px] top-1.5 h-4 w-4 rounded-full border-2 border-canvas group-hover:scale-125 group-hover:border-accent-yellow/40 transition-all duration-300 shadow-md flex items-center justify-center"
                style={{ backgroundColor: item.badgeColor }}
              >
                <div className="h-1.5 w-1.5 rounded-full bg-canvas" />
              </div>

              {/* Milestone Card */}
              <div className="rounded-xl border border-white/10 bg-surface p-6 group-hover:border-accent-yellow/40 transition-all duration-300 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="md:hidden font-mono text-xs font-bold text-accent-yellow">
                      {item.year}
                    </span>
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-mono font-bold uppercase tracking-wider"
                      style={{
                        backgroundColor: `${item.badgeColor}20`,
                        color: item.badgeColor,
                        border: `1px solid ${item.badgeColor}40`,
                      }}
                    >
                      <Trophy className="h-3 w-3" />
                      {item.rank}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 font-mono text-xs text-zinc-400">
                    <MapPin className="h-3.5 w-3.5 text-zinc-400" />
                    <span>{item.location}</span>
                  </div>
                </div>

                <h3 className="font-mono text-base sm:text-lg font-bold text-white mb-2 group-hover:text-accent-yellow transition-colors">
                  {item.award}
                </h3>

                <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed mb-4">
                  {item.description}
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pt-3 border-t border-white/5 font-mono text-xs text-zinc-400">
                  <span>
                    Rover: <strong className="text-zinc-200">{item.rover}</strong>
                  </span>
                  <span className="text-zinc-400">{item.competition}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
