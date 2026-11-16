"use client";

import React, { useState } from "react";
import { RoverCanvas, RoverHotspot } from "@/components/rover-canvas";
import { ProceduralRover } from "@/components/procedural-rover";
import {
  Box,
  RotateCcw,
  Layers,
  Activity,
  Cpu,
  Eye,
  FlaskConical,
  X,
  Sparkles,
  ChevronRight,
  Terminal,
} from "lucide-react";

export const ROVER_HOTSPOTS: RoverHotspot[] = [
  {
    id: "arm",
    label: "Robotic Arm",
    position: [0.5, 0.9, 0.9],
    targetPosition: [1.2, 1.2, 1.5],
    description:
      "6-DOF articulated robotic arm designed for dexterous sample acquisition, panel servicing, and precision instrument placement in extreme Martian environments.",
    specs: {
      "Degrees of Freedom": "6-DOF",
      "Payload Capacity": "3.5 kg",
      "Reach": "1.15 m spherical workspace",
      "End-Effector": "Interchangeable parallel jaw gripper & drill interface",
      "Actuation": "Harmonic Drive brushless DC motors with CAN-FD bus",
    },
  },
  {
    id: "chassis",
    label: "Rocker-Bogie Chassis",
    position: [0, 0.5, 0],
    targetPosition: [0, 0.8, 2.8],
    description:
      "Passive rocker-bogie differential suspension system engineered with a carbon-aluminum hybrid monocoque frame for high obstacle climbability.",
    specs: {
      "Frame Material": "Carbon-aluminum hybrid monocoque frame",
      "Suspension System": "Passive Rocker-Bogie with Differential Pivot",
      "Ground Clearance": "320 mm",
      "Traction": "6-Wheel Independent In-Hub BLDC Motors",
      "Climb Limit": "45° slope obstacle traversal",
    },
  },
  {
    id: "mast",
    label: "Mast & LiDAR",
    position: [-0.4, 1.2, 0.7],
    targetPosition: [-0.8, 1.5, 1.8],
    description:
      "Articulated sensor mast hosting high-resolution stereo vision cameras, environmental sensing package, and 360-degree LiDAR cylinder.",
    specs: {
      "Perception": "3D Flash LiDAR & Stereo Vision Sensors",
      "Elevation": "1.2 m above ground",
      "Pan/Tilt Range": "360° Pan / 120° Tilt Articulation",
      "Data Rate": "100 Mbps real-time point-cloud streaming",
      "Range Sensor": "360-degree Solid-State LiDAR (200m range)",
    },
  },
  {
    id: "science",
    label: "Science Subsystem",
    position: [0.3, 0.6, -0.5],
    targetPosition: [0.8, 1.0, -1.2],
    description:
      "Automated onboard astrobiology scientific laboratory with Raman laser spectrometer, hermetic soil carousel, and micro-reagent wet chemistry lab.",
    specs: {
      "Spectrometry": "Raman laser spectrometer with 532 nm excitation",
      "Award Heritage": "URC Best Science System Award winning design",
      "Sampling System": "Automated Auger Drill & Hermetic Soil Carousel",
      "Assay Capability": "Deep organic compound and biosignature detection",
      "Sample Carousel": "6 hermetically sealed sample test tubes",
    },
  },
  {
    id: "compute",
    label: "Autonomous Compute",
    position: [-0.2, 0.7, -0.3],
    targetPosition: [-0.6, 1.1, -1.0],
    description:
      "Dual redundant mission compute avionics running ROS2 Humble on NVIDIA Jetson AGX Orin with real-time FDCAN bus communication.",
    specs: {
      "SoC Architecture": "NVIDIA Jetson AGX Orin 64GB (275 TOPS AI compute)",
      "Robotics Middleware": "ROS2 Humble Hawksbill on RT-Linux",
      "Bus Architecture": "Redundant FDCAN / CAN-FD network at 8 Mbps",
      "Power System": "24V 30Ah LiFePO4 battery pack with intelligent BMS",
      "Telemetry Link": "5.8 GHz COFDM video & 915 MHz long-range telemetry",
    },
  },
];

export interface RoverStudioProps {
  className?: string;
}

export function RoverStudio({ className = "" }: RoverStudioProps) {
  const [isWireframe, setIsWireframe] = useState<boolean>(false);
  const [activeHotspot, setActiveHotspot] = useState<RoverHotspot | null>(null);

  const getSubsystemIcon = (id: string) => {
    switch (id) {
      case "arm":
        return <Activity className="w-4 h-4 text-accent-pink" />;
      case "chassis":
        return <Box className="w-4 h-4 text-accent-cyan" />;
      case "mast":
        return <Eye className="w-4 h-4 text-accent-yellow" />;
      case "science":
        return <FlaskConical className="w-4 h-4 text-emerald-400" />;
      case "compute":
        return <Cpu className="w-4 h-4 text-accent-purple" />;
      default:
        return <Sparkles className="w-4 h-4 text-accent-yellow" />;
    }
  };

  return (
    <section
      id="rover-3d"
      data-testid="rover-studio"
      className={`relative min-h-screen py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-t border-white/10 bg-canvas overflow-hidden ${className}`}
    >
      {/* Background Matrix Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_20%,rgba(33,212,253,0.08),transparent_70%)] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="font-mono text-xs text-accent-cyan tracking-widest uppercase mb-2 block">
            {"// Milestone M3 Studio"}
          </span>
          <h2 className="text-3xl sm:text-5xl font-black font-mono tracking-tight text-white mb-4">
            3D Interactive Rover Studio
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base font-sans leading-relaxed">
            Three.js procedural articulated rover model with 5 subsystem hotspots and OrbitControls.
            Inspect 2026 generation Rocker-Bogie chassis, 6-DOF robotic manipulator, sensor mast, and science payload.
          </p>
        </div>

        {/* Studio Control Toolbar / HUD */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 p-3 rounded-xl border border-white/10 bg-surface/70 backdrop-blur-md">
          {/* Subsystem Presets */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto items-center">
            <span className="text-xs font-mono text-zinc-400 mr-1 hidden sm:inline">
              PRESETS:
            </span>

            {/* "All" Overview Preset */}
            <button
              type="button"
              onClick={() => setActiveHotspot(null)}
              className={`px-3 py-1.5 rounded text-xs font-mono font-medium transition-all cursor-pointer ${
                activeHotspot === null
                  ? "bg-accent-yellow text-canvas font-bold shadow-[0_0_12px_rgba(252,237,58,0.3)]"
                  : "bg-surface text-zinc-300 hover:text-white border border-white/10 hover:border-white/30"
              }`}
            >
              All View
            </button>

            {/* Individual Hotspot Presets */}
            {ROVER_HOTSPOTS.map((hs) => {
              const isSelected = activeHotspot?.id === hs.id;
              return (
                <button
                  key={hs.id}
                  type="button"
                  onClick={() => setActiveHotspot(activeHotspot?.id === hs.id ? null : hs)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-medium transition-all cursor-pointer ${
                    isSelected
                      ? "border border-accent-cyan bg-accent-cyan/15 text-accent-cyan shadow-[0_0_12px_rgba(33,212,253,0.3)]"
                      : "bg-surface text-zinc-300 hover:text-white border border-white/10 hover:border-white/30"
                  }`}
                >
                  {getSubsystemIcon(hs.id)}
                  <span>{hs.label}</span>
                </button>
              );
            })}
          </div>

          {/* HUD Actions: Wireframe Toggle & Reset View */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            {/* Wireframe Toggle Button */}
            <button
              type="button"
              data-testid="wireframe-toggle"
              onClick={() => setIsWireframe(prev => !prev)}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded text-xs font-mono font-medium transition-all cursor-pointer border ${
                isWireframe
                  ? "border-accent-cyan bg-accent-cyan/20 text-accent-cyan shadow-[0_0_15px_rgba(33,212,253,0.4)]"
                  : "border-white/10 bg-surface/80 text-zinc-300 hover:text-white hover:border-white/30"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{isWireframe ? "Wireframe: ON" : "Wireframe: OFF"}</span>
            </button>

            {/* Reset View Button */}
            <button
              type="button"
              data-testid="reset-view"
              onClick={() => setActiveHotspot(null)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-medium bg-surface/80 text-zinc-300 hover:text-white border border-white/10 hover:border-white/30 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset View</span>
            </button>
          </div>
        </div>

        {/* 3D Studio Stage & Subsystem Inspector Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main 3D Canvas Viewport (Span 8) */}
          <div className="lg:col-span-8 flex flex-col">
            <div
              data-testid="rover-canvas"
              className="w-full h-[450px] sm:h-[550px] lg:h-[650px] relative rounded-2xl border border-white/10 bg-surface/50 overflow-hidden shadow-2xl backdrop-blur-sm"
            >
              <RoverCanvas
                isWireframe={isWireframe}
                activeHotspot={activeHotspot}
                onSelectHotspot={(hs) => setActiveHotspot(activeHotspot?.id === hs?.id ? null : hs)}
                hotspots={ROVER_HOTSPOTS}
              >
                <ProceduralRover
                  isWireframe={isWireframe}
                  activeHotspot={activeHotspot}
                  onSelectHotspot={(hs) => setActiveHotspot(activeHotspot?.id === hs?.id ? null : hs)}
                />
              </RoverCanvas>

              {/* Viewport Overlay Hints */}
              <div className="absolute bottom-4 left-4 pointer-events-none hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface/80 border border-white/10 backdrop-blur-md text-[11px] font-mono text-zinc-400">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-cyan animate-pulse" />
                <span>Drag to Orbit • Scroll to Zoom • Click Hotspots to Focus</span>
              </div>
            </div>
          </div>

          {/* Subsystem Inspector Drawer / Card (Span 4) */}
          <div className="lg:col-span-4 flex flex-col">
            <div
              data-testid="hotspot-drawer"
              className="w-full rounded-2xl border border-white/10 bg-surface/80 backdrop-blur-xl overflow-hidden shadow-2xl transition-all duration-300"
            >
              {/* PyCharm IDE Tool Window Chrome Header */}
              <div className="px-4 py-3 border-b border-white/10 bg-surface-elevated flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
                  </div>
                  <span className="text-zinc-500 font-mono text-xs">|</span>
                  <span className="font-mono text-xs text-zinc-300 tracking-wide truncate max-w-[180px]">
                    {activeHotspot
                      ? `matrix://${activeHotspot.id}.py`
                      : "matrix://subsystems_overview.py"}
                  </span>
                </div>

                {activeHotspot && (
                  <button
                    type="button"
                    onClick={() => setActiveHotspot(null)}
                    className="p-1 rounded text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                    aria-label="Close Inspector"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Inspector Content */}
              {activeHotspot ? (
                <div className="p-6 space-y-6">
                  {/* Subsystem Title & Badge */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 rounded-md bg-white/5 border border-white/10">
                        {getSubsystemIcon(activeHotspot.id)}
                      </div>
                      <span className="font-mono text-xs uppercase tracking-widest text-accent-yellow">
                        Subsystem Inspection
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold font-mono text-white">
                      {activeHotspot.label}
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-400 font-sans mt-2 leading-relaxed">
                      {activeHotspot.description}
                    </p>
                  </div>

                  {/* Real-time Telemetry Status Bar */}
                  <div className="grid grid-cols-2 gap-2 p-3 rounded-xl border border-white/5 bg-canvas/60 font-mono text-xs">
                    <div>
                      <span className="text-zinc-500 block text-[10px]">LINK STATUS</span>
                      <span className="text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        NOMINAL
                      </span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-[10px]">BUS TELEMETRY</span>
                      <span className="text-accent-cyan font-bold mt-0.5 block">24.2 V // OK</span>
                    </div>
                  </div>

                  {/* Technical Specifications (PyCharm Darcula Highlighted) */}
                  <div>
                    <span className="font-mono text-xs text-zinc-400 uppercase tracking-wider block mb-3">
                      Technical Specifications:
                    </span>
                    <div className="space-y-2.5 rounded-xl border border-white/5 bg-canvas/40 p-4 font-mono text-xs">
                      {Object.entries(activeHotspot.specs).map(([key, value]) => (
                        <div
                          key={key}
                          className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 pb-2 border-b border-white/5 last:border-0 last:pb-0"
                        >
                          <span className="text-[#FFC66D] font-medium">{key}:</span>
                          <span className="text-[#6897BB] sm:text-right font-normal">
                            {value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Shortcuts */}
                  <div className="pt-2">
                    <a
                      href="#telemetry"
                      className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg border border-accent-cyan/30 bg-accent-cyan/10 hover:bg-accent-cyan/20 text-accent-cyan font-mono text-xs font-semibold transition-all"
                    >
                      <Terminal className="w-3.5 h-3.5" />
                      <span>Execute Telemetry Diagnostics</span>
                      <ChevronRight className="w-3.5 h-3.5 ml-auto" />
                    </a>
                  </div>
                </div>
              ) : (
                /* Idle Prompt State */
                <div className="p-8 text-center flex flex-col items-center justify-center min-h-[350px]">
                  <div className="p-4 rounded-2xl border border-white/10 bg-canvas/50 mb-4 text-accent-cyan">
                    <Layers className="w-8 h-8 animate-pulse" />
                  </div>
                  <h4 className="font-mono font-bold text-white text-base mb-1">
                    No Subsystem Selected
                  </h4>
                  <p className="text-xs text-zinc-400 font-sans max-w-xs leading-relaxed mb-6">
                    Click any interactive 3D beacon pin or use the preset HUD controls above to inspect live rover kinematics, sensors, and URC specifications.
                  </p>
                  <div className="flex flex-col gap-2 w-full max-w-xs">
                    {ROVER_HOTSPOTS.slice(0, 3).map((hs) => (
                      <button
                        key={hs.id}
                        type="button"
                        onClick={() => setActiveHotspot(hs)}
                        className="flex items-center justify-between p-2.5 rounded-lg border border-white/5 bg-surface-elevated hover:border-accent-cyan/40 text-xs font-mono text-zinc-300 hover:text-white transition-all text-left"
                      >
                        <span className="flex items-center gap-2">
                          {getSubsystemIcon(hs.id)}
                          <span>{hs.label}</span>
                        </span>
                        <ChevronRight className="w-3 h-3 text-zinc-500" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default RoverStudio;
