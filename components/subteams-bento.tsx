"use client";

import React, { useState } from "react";
import { Cpu, Cog, Zap, FlaskConical, Users, ArrowUpRight } from "lucide-react";

interface SubteamBentoItem {
  id: string;
  name: string;
  leadRole: string;
  colSpan: string;
  icon: React.ElementType;
  description: string;
  highlights: string[];
  tags: string[];
  accentGlow: string;
}

const SUBTEAMS: SubteamBentoItem[] = [
  {
    id: "software",
    name: "Autonomous Software Systems",
    leadRole: "Autonomy & Perception",
    colSpan: "col-span-1 md:col-span-2",
    icon: Cpu,
    description:
      "Architects full-stack planetary autonomy: LiDAR Odometry and SLAM mapping, ROS 2 Nav2 waypoint navigation, and edge neural perception on NVIDIA Jetson Orin.",
    highlights: [
      "ROS 2 Humble Navigation & Path Planning",
      "3D LiDAR SLAM & Real-Time Costmap Fusion",
      "NVIDIA Jetson Orin Edge AI Compute",
    ],
    tags: ["ROS 2", "SLAM", "Jetson Orin", "LiDAR Odometry", "Nav2", "Python / C++"],
    accentGlow: "rgba(252, 237, 58, 0.14)",
  },
  {
    id: "mechanical",
    name: "Mechanical & Structural Engineering",
    leadRole: "Chassis & Manipulator",
    colSpan: "col-span-1 md:col-span-1",
    icon: Cog,
    description:
      "Designs extreme-terrain mobility featuring lightweight carbon composite Rocker-Bogie suspension and the award-winning 6-DOF Arm manipulator.",
    highlights: [
      "Passive Rocker-Bogie 6WD Suspension",
      "6-DOF Arm with Harmonic Drive Actuation",
      "Carbon Composite & Aerospace Aluminum Frame",
    ],
    tags: ["Rocker-Bogie", "6-DOF Arm", "Carbon Composite", "SolidWorks", "Ansys FEA"],
    accentGlow: "rgba(33, 212, 253, 0.14)",
  },
  {
    id: "electronics",
    name: "Electronics & Avionics Engineering",
    leadRole: "Embedded Hardware & Bus",
    colSpan: "col-span-1 md:col-span-1",
    icon: Zap,
    description:
      "Engineers high-reliability rover avionics: multi-layer Custom PCB boards designed in Altium, real-time CAN-FD / FDCAN bus telemetry, and 24V smart BMS power.",
    highlights: [
      "Multi-Layer Custom PCB Architecture in Altium",
      "Redundant Automotive CAN-FD / FDCAN Bus",
      "STM32 Real-Time Motor & BMS Controllers",
    ],
    tags: ["Custom PCB", "Altium", "CAN-FD", "FDCAN", "STM32", "24V BMS"],
    accentGlow: "rgba(175, 82, 222, 0.14)",
  },
  {
    id: "science",
    name: "Science & Astrobiology",
    leadRole: "Life-Detection Payload",
    colSpan: "col-span-1 md:col-span-1",
    icon: FlaskConical,
    description:
      "Spearheads in-situ astrobiology research using automated deep-soil drills, sealed rotary sample carousels, and Raman Spectrometry for biomarker analysis.",
    highlights: [
      "In-situ 532nm Raman Laser Spectrometry",
      "Automated Deep-Soil Sample Auger Drill",
      "URC Best Science System Award Heritage",
    ],
    tags: ["Spectrometry", "Raman Laser", "Biomarkers", "Soil Auger", "Wet Chemistry"],
    accentGlow: "rgba(16, 185, 129, 0.14)",
  },
  {
    id: "operations",
    name: "PR, Sponsorship & Operations",
    leadRole: "Alliances & Expeditions",
    colSpan: "col-span-1 md:col-span-1",
    icon: Users,
    description:
      "Builds strategic partnerships with corporate Sponsors, coordinates international logistics to Utah and Poland, and leads aerospace STEM Outreach.",
    highlights: [
      "Strategic Corporate Sponsors & Industry Alliances",
      "MDRS Utah & ERC Poland Expedition Logistics",
      "Media Relations & National STEM Outreach",
    ],
    tags: ["Sponsors", "Outreach", "Logistics", "Media Relations", "Governance"],
    accentGlow: "rgba(255, 42, 133, 0.14)",
  },
];

export function SubteamsBento() {
  const [spotlight, setSpotlight] = useState<{
    id: string;
    x: number;
    y: number;
  } | null>(null);

  const handleMouseMove = (
    e: React.MouseEvent<HTMLDivElement>,
    id: string
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setSpotlight({
      id,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <section
      id="subteams"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-canvas border-t border-white/10"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-2 w-2 rounded-full bg-accent-purple" />
            <span className="font-mono text-xs text-accent-yellow tracking-widest uppercase">
              {"// MULTIDISCIPLINARY ARCHITECTURE"}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight">
            Engineering Subteams &amp; Divisions
          </h2>
          <p className="mt-2 text-zinc-400 text-sm max-w-2xl leading-relaxed">
            Five specialized engineering divisions collaborate at Istanbul Technical University to deliver integrated planetary exploration systems.
          </p>
        </div>

        {/* Bento Grid */}
        <div
          data-testid="subteams-bento"
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {SUBTEAMS.map((team) => {
            const Icon = team.icon;
            const isHovered = spotlight?.id === team.id;

            return (
              <div
                key={team.id}
                data-testid="subteam-card"
                tabIndex={0}
                onMouseMove={(e) => handleMouseMove(e, team.id)}
                onMouseLeave={() => setSpotlight(null)}
                className={`group relative rounded-xl border border-white/10 bg-surface p-6 sm:p-8 overflow-hidden transition-all duration-300 hover:border-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-yellow/60 shadow-xl ${team.colSpan}`}
                style={{
                  backgroundImage: isHovered
                    ? `radial-gradient(360px circle at ${spotlight.x}px ${spotlight.y}px, ${team.accentGlow}, transparent 65%)`
                    : undefined,
                }}
              >
                <div className="relative z-10 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="h-10 w-10 rounded-lg border border-white/10 bg-canvas flex items-center justify-center group-hover:border-accent-yellow/40 transition-colors">
                        <Icon className="h-5 w-5 text-accent-yellow" />
                      </div>
                      <span className="font-mono text-[10px] tracking-wider text-zinc-500 uppercase">
                        {team.leadRole}
                      </span>
                    </div>

                    <h3 className="font-mono font-bold text-lg sm:text-xl text-white mb-2 group-hover:text-accent-yellow transition-colors flex items-center gap-1.5">
                      <span>{team.name}</span>
                      <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    </h3>

                    <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed mb-5">
                      {team.description}
                    </p>

                    <div className="space-y-1.5 mb-6">
                      {team.highlights.map((hl, hlIdx) => (
                        <div
                          key={hlIdx}
                          className="flex items-start gap-2 text-xs text-zinc-300"
                        >
                          <span className="text-accent-cyan mt-0.5">•</span>
                          <span>{hl}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tech Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-4 border-t border-white/5">
                    {team.tags.map((tag, tagIdx) => (
                      <span
                        key={tagIdx}
                        className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-white/5 border border-white/10 text-zinc-300 group-hover:border-white/20 transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
