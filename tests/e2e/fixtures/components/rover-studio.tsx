"use client";

import React, { useState } from "react";
import { ProceduralRover, RoverHotspot } from "./procedural-rover";
import { Eye, Box, RotateCcw, X, Info } from "lucide-react";

export const ROVER_HOTSPOTS: RoverHotspot[] = [
  {
    id: "arm",
    label: "Robotic Arm",
    position: [0.5, 0.9, 0.9],
    targetPosition: [0.5, 0.7, 0.8],
    description: "6-DOF Carbon Fiber Articulated Arm with interchangeable end-effector.",
    specs: {
      "Degrees of Freedom": "6-DOF",
      "Payload Capacity": "3.5 kg",
      "Reach": "1.2 meters",
      "IK Solver": "IKFast & MoveIt2",
    },
  },
  {
    id: "chassis",
    label: "Rocker-Bogie Chassis",
    position: [0, 0.5, 0],
    targetPosition: [0, 0.5, 0],
    description: "Differential rocker-bogie passive suspension with 6 independent in-hub brushless motors.",
    specs: {
      "Suspension": "Passive Rocker-Bogie",
      "Obstacle Clearance": "280 mm",
      "Drive System": "6WD Independent Hubs",
      "Turn Radius": "Zero-Turn (Differential)",
    },
  },
  {
    id: "mast",
    label: "Mast & LiDAR",
    position: [-0.4, 1.2, 0.7],
    targetPosition: [-0.4, 0.9, 0.7],
    description: "Elevated perception mast featuring 360-degree LiDAR and stereo depth vision cameras.",
    specs: {
      "Sensors": "Velodyne Puck LiDAR + Dual Stereo Vision",
      "IMU": "9-DOF High-Precision IMU",
      "GNSS": "RTK Sub-Decimeter Positioning",
    },
  },
  {
    id: "science",
    label: "Science Subsystem",
    position: [0, 0.7, -0.6],
    targetPosition: [0, 0.65, -0.6],
    description: "Autonomous deep-soil drill, rotary carousel, and in-situ Raman laser spectrometer.",
    specs: {
      "Award": "URC Best Science System Award",
      "Drill Depth": "100 mm Auger Core",
      "Assay": "Spectrometry & Chemical Reagent Carousel",
    },
  },
  {
    id: "compute",
    label: "Autonomous Compute",
    position: [0, 0.7, 0.1],
    targetPosition: [0, 0.65, 0.1],
    description: "NVIDIA Jetson Orin Edge AI compute module executing ROS2 Humble autonomy stack.",
    specs: {
      "Compute Module": "NVIDIA Jetson AGX Orin (275 TOPS)",
      "OS / Framework": "Ubuntu 22.04 LTS / ROS2 Humble",
      "Comms": "Dual-Band 2.4/5.8GHz High-Gain Ubiquiti",
    },
  },
];

export function RoverStudio() {
  const [wireframe, setWireframe] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState<RoverHotspot | null>(null);

  return (
    <section id="rover-3d" className="relative w-full py-16 flex flex-col items-center">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-4xl font-bold font-mono text-white mb-2">
          3D Interactive Rover Studio
        </h2>
        <p className="text-sm text-zinc-400 font-mono">
          Explore the fully articulated procedural rover and subsystem telemetry hotspots.
        </p>
      </div>

      {/* 3D Canvas Container */}
      <div
        data-testid="rover-canvas"
        className="relative w-full h-[450px] sm:h-[550px] lg:h-[650px] rounded-2xl bg-surface/80 border border-white/10 overflow-hidden backdrop-blur-xl flex items-center justify-center"
      >
        {/* Simulated WebGL Scene Render */}
        <div className="absolute inset-0 flex items-center justify-center">
          <ProceduralRover isWireframe={wireframe} activeHotspot={activeHotspot} onSelectHotspot={setActiveHotspot} />
        </div>

        {/* OrbitControls Overlay HUD */}
        <div className="absolute top-4 left-4 flex items-center space-x-2 z-10">
          <button
            data-testid="wireframe-toggle"
            onClick={() => setWireframe(!wireframe)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all flex items-center space-x-2 ${
              wireframe
                ? "bg-accent-cyan/20 border-accent-cyan text-accent-cyan"
                : "bg-surface/80 border-white/10 text-zinc-300 hover:border-white/30"
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>{wireframe ? "Wireframe Active" : "Toggle Wireframe"}</span>
          </button>
        </div>

        {/* 5 Hotspots Pins Navigation Bar */}
        <div data-testid="rover-hotspots" className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2 justify-center z-10">
          {ROVER_HOTSPOTS.map((hs) => (
            <button
              key={hs.id}
              data-testid={`hotspot-${hs.id}`}
              onClick={() => setActiveHotspot(activeHotspot?.id === hs.id ? null : hs)}
              className={`px-3 py-1.5 rounded-full text-xs font-mono border transition-all ${
                activeHotspot?.id === hs.id
                  ? "bg-accent-yellow text-black border-accent-yellow font-semibold"
                  : "bg-canvas/80 text-zinc-300 border-white/10 hover:border-accent-yellow/50"
              }`}
            >
              {hs.label}
            </button>
          ))}
        </div>

        {/* Subsystem Detail Drawer */}
        {activeHotspot && (
          <div
            data-testid="hotspot-drawer"
            className="absolute top-4 right-4 w-80 max-w-[calc(100%-2rem)] rounded-xl bg-surface-elevated/95 border border-white/15 p-5 backdrop-blur-xl z-20 shadow-2xl"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
              <span className="font-mono font-bold text-sm text-accent-yellow">
                {activeHotspot.label}
              </span>
              <button
                onClick={() => setActiveHotspot(null)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-zinc-300 mb-4 font-mono leading-relaxed">
              {activeHotspot.description}
            </p>
            <div className="space-y-2">
              {Object.entries(activeHotspot.specs).map(([key, val]) => (
                <div key={key} className="flex justify-between text-xs font-mono">
                  <span className="text-zinc-500">{key}:</span>
                  <span className="text-zinc-200 font-medium">{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
