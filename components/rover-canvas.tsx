"use client";

import React, { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";

export interface RoverHotspot {
  id: "arm" | "chassis" | "mast" | "science" | "compute";
  label: string;
  position: [number, number, number];
  targetPosition: [number, number, number];
  description: string;
  specs: Record<string, string>;
}

export interface RoverCanvasProps {
  isWireframe?: boolean;
  activeHotspot: RoverHotspot | null;
  onSelectHotspot: (hotspot: RoverHotspot | null) => void;
  hotspots?: RoverHotspot[];
  className?: string;
  children?: React.ReactNode;
}

const emptySubscribe = () => () => {};

/**
 * CameraRig: Smoothly lerps camera position and controls target when activeHotspot changes.
 */
function CameraRig({
  activeHotspot,
  controlsRef,
}: {
  activeHotspot: RoverHotspot | null;
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
}) {
  const defaultPos = useMemo(() => new THREE.Vector3(4.5, 3.2, 5.5), []);
  const defaultTarget = useMemo(() => new THREE.Vector3(0, 0.6, 0), []);

  useFrame((state, delta) => {
    const destPos = activeHotspot
      ? new THREE.Vector3(...activeHotspot.targetPosition)
      : defaultPos;
    const destTarget = activeHotspot
      ? new THREE.Vector3(...activeHotspot.position)
      : defaultTarget;

    const step = Math.min(delta * 4, 0.2);
    state.camera.position.lerp(destPos, step);

    if (controlsRef.current) {
      controlsRef.current.target.lerp(destTarget, step);
      controlsRef.current.update();
    }
  });

  return null;
}

/**
 * RoverCanvas: R3F WebGL Canvas with OrbitControls, Studio Lighting, Ground Grid, and Drei <Html> Hotspots.
 */
export function RoverCanvas({
  isWireframe: _isWireframe = false,
  activeHotspot,
  onSelectHotspot,
  hotspots = [],
  className = "",
  children,
}: RoverCanvasProps) {
  void _isWireframe;
  const mounted = React.useSyncExternalStore(emptySubscribe, () => true, () => false);
  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  // SSR hydration fallback
  if (!mounted) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-canvas/80 border border-white/5 rounded-2xl p-8">
        <div className="relative flex items-center justify-center w-12 h-12 mb-3">
          <div className="absolute inset-0 rounded-full border-2 border-accent-cyan/20 border-t-accent-cyan animate-spin" />
          <div className="h-2 w-2 rounded-full bg-accent-yellow animate-ping" />
        </div>
        <span className="font-mono text-xs uppercase tracking-widest text-accent-cyan">
          {"// INITIALIZING 3D ROVER STUDIO"}
        </span>
        <span className="font-mono text-[11px] text-zinc-500 mt-1">
          Mounting WebGL viewport & 5.8GHz telemetry link...
        </span>
      </div>
    );
  }

  return (
    <div className={`w-full h-full relative ${className}`}>
      <Canvas
        camera={{ position: [4.5, 3.2, 5.5], fov: 42 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        className="w-full h-full"
      >
        <Suspense fallback={null}>
          {/* Studio Multi-Point Lighting */}
          <ambientLight intensity={0.4} color="#ffffff" />
          
          {/* Key Studio Light */}
          <directionalLight
            position={[6, 8, 6]}
            intensity={1.5}
            color="#ffffff"
            castShadow
            shadow-mapSize={[1024, 1024]}
          />

          {/* Matrix Cyan Rim Fill Light */}
          <directionalLight
            position={[-6, 4, -4]}
            intensity={0.8}
            color="#21D4FD"
          />

          {/* JetBrains Yellow Top Accent Rim */}
          <directionalLight
            position={[0, 6, -6]}
            intensity={0.6}
            color="#FCED3A"
          />

          {/* Underbody Purple Bounce */}
          <directionalLight
            position={[0, -4, 2]}
            intensity={0.3}
            color="#AF52DE"
          />

          {/* Ground Studio Grid Plane */}
          <gridHelper args={[20, 20, 0x323238, 0x19191C]} position={[0, -0.01, 0]} />

          {/* Camera Smooth Transition Controller */}
          <CameraRig activeHotspot={activeHotspot} controlsRef={controlsRef} />

          {/* Constrained Studio OrbitControls */}
          <OrbitControls
            ref={controlsRef}
            minDistance={3.0}
            maxDistance={8.5}
            maxPolarAngle={Math.PI / 2.05}
            dampingFactor={0.06}
            enableDamping={true}
            enablePan={false}
            enableZoom={true}
            touches={{ ONE: 1, TWO: 2 }}
          />

          {/* 3D Scene Geometry (Procedural Rover) */}
          {children}

          {/* Drei <Html> Interactive Hotspots */}
          {hotspots.map((hs) => {
            const isSelected = activeHotspot?.id === hs.id;
            return (
              <Html key={hs.id} position={hs.position} distanceFactor={7} center>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectHotspot(isSelected ? null : hs);
                  }}
                  className="group relative flex items-center justify-center p-2 focus:outline-none cursor-pointer"
                  aria-label={`Inspect ${hs.label}`}
                >
                  {/* Pulsing Beacon Ring */}
                  <span className="absolute flex h-6 w-6 pointer-events-none">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-cyan opacity-75" />
                    <span className="relative inline-flex rounded-full h-6 w-6 bg-accent-cyan/20 border border-accent-cyan backdrop-blur-sm" />
                  </span>

                  {/* Glowing Core Dot */}
                  <span
                    className={`relative h-2.5 w-2.5 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(33,212,253,0.8)] ${
                      isSelected
                        ? "bg-accent-yellow scale-125 shadow-[0_0_12px_rgba(252,237,58,0.9)]"
                        : "bg-accent-cyan group-hover:bg-accent-yellow"
                    }`}
                  />

                  {/* Monospace Hover / Active Badge Pill */}
                  <div
                    className={`absolute left-7 top-1/2 -translate-y-1/2 whitespace-nowrap px-2.5 py-1 rounded bg-surface/90 border border-white/20 backdrop-blur-md text-[11px] font-mono tracking-wider shadow-xl pointer-events-none transition-all duration-200 ${
                      isSelected
                        ? "opacity-100 translate-x-0 border-accent-yellow/60 text-accent-yellow"
                        : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 text-white"
                    }`}
                  >
                    {hs.label}
                  </div>
                </button>
              </Html>
            );
          })}
        </Suspense>
      </Canvas>
    </div>
  );
}

export default RoverCanvas;
