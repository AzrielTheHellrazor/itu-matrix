"use client";

import React from "react";
import { Cpu, Wrench, Zap, FlaskConical, Users, ArrowUpRight } from "lucide-react";

export const SUBTEAMS = [
  {
    id: "autonomy",
    title: "Autonomous Software Systems",
    icon: Cpu,
    colSpan: "md:col-span-2",
    accent: "text-accent-yellow",
    borderGlow: "hover:border-accent-yellow/50",
    description: "Developing full-stack planetary autonomy: ROS2 Humble, LiDAR-inertial odometry (LIO-SAM), Nav2 path planners, and YOLOv8 perception on NVIDIA Jetson AGX Orin.",
    tags: ["ROS 2", "SLAM", "Nav2", "Jetson Orin", "Python", "C++"],
  },
  {
    id: "mechanical",
    title: "Mechanical & Structural Engineering",
    icon: Wrench,
    colSpan: "md:col-span-1",
    accent: "text-accent-cyan",
    borderGlow: "hover:border-accent-cyan/50",
    description: "Designing lightweight carbon fiber rocker-bogie differential suspension, 6-DOF robotic arm with cycloidal gearboxes, and aerospace-grade chassis.",
    tags: ["Rocker-Bogie", "6-DOF Arm", "Carbon Fiber", "SolidWorks", "ANSYS FEA"],
  },
  {
    id: "electronics",
    title: "Electronics & Avionics Engineering",
    icon: Zap,
    colSpan: "md:col-span-1",
    accent: "text-accent-pink",
    borderGlow: "hover:border-accent-pink/50",
    description: "Custom PCB design in Altium Designer, CAN-bus motor controller mesh, 24V LiFePO4 BMS, power distribution board, and RF telemetry systems.",
    tags: ["Custom PCB", "Altium", "CAN Bus", "BMS 24V", "STM32"],
  },
  {
    id: "science",
    title: "Science & Astrobiology",
    icon: FlaskConical,
    colSpan: "md:col-span-2",
    accent: "text-accent-emerald",
    borderGlow: "hover:border-accent-emerald/50",
    description: "In-situ life detection payload with deep auger drill, rotary reagent test carousel, and 532nm Raman laser spectrometer for organic biomarker identification.",
    tags: ["Spectrometry", "Soil Assay", "Biomarkers", "Raman Laser", "Astrobiology"],
  },
  {
    id: "sponsorship",
    title: "PR, Sponsorship & Operations",
    icon: Users,
    colSpan: "md:col-span-3",
    accent: "text-accent-purple",
    borderGlow: "hover:border-accent-purple/50",
    description: "Managing corporate sponsorship partnerships, international competition logistics for URC Utah and ERC Poland, outreach, and multi-media operations.",
    tags: ["Sponsors", "Outreach", "Logistics", "Budgeting", "Media"],
  },
];

export function SubteamsBento() {
  return (
    <section id="subteams" data-testid="subteams-bento" className="w-full py-16">
      <div className="text-center mb-12">
        <h2 className="text-2xl sm:text-4xl font-bold font-mono text-white mb-3">
          Subteams & Engineering Innovation
        </h2>
        <p className="text-sm text-zinc-400 font-mono max-w-2xl mx-auto">
          Over 40 multidisciplinary engineering students pushing the frontiers of rover autonomy and robotics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {SUBTEAMS.map((team) => {
          const Icon = team.icon;
          return (
            <div
              key={team.id}
              data-testid="subteam-card"
              data-subteam={team.id}
              className={`${team.colSpan} p-6 sm:p-8 rounded-2xl bg-surface border border-white/10 ${team.borderGlow} transition-all duration-300 relative group overflow-hidden`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2.5 rounded-xl bg-white/5 ${team.accent}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold font-mono text-white mb-2">
                {team.title}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-6 font-mono">
                {team.description}
              </p>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {team.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-md bg-white/5 border border-white/5 text-[11px] font-mono text-zinc-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
