"use client";

import React, { Component, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
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
  resetNonce?: number;
  className?: string;
  children?: React.ReactNode;
}

const DEFAULT_CAMERA_POS: [number, number, number] = [4.5, 3.2, 5.5];
const DEFAULT_CAMERA_TARGET: [number, number, number] = [0, 0.5, 0];

const emptySubscribe = () => () => {};

interface WebGLErrorBoundaryProps {
  children: React.ReactNode;
}

interface WebGLErrorBoundaryState {
  hasError: boolean;
}

class WebGLErrorBoundary extends Component<
  WebGLErrorBoundaryProps,
  WebGLErrorBoundaryState
> {
  constructor(props: WebGLErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): WebGLErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          data-testid="webgl-error-fallback"
          className="w-full h-full flex flex-col items-center justify-center bg-canvas/90 border border-red-500/30 rounded-2xl p-8 text-center"
        >
          <span className="font-mono text-xs uppercase tracking-widest text-red-400 mb-2">
            {"// WEBGL VIEWPORT UNAVAILABLE"}
          </span>
          <p className="font-sans text-xs sm:text-sm text-zinc-400 max-w-sm mb-4">
            3D hardware acceleration is currently unavailable or encountered a rendering exception.
          </p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false })}
            className="px-4 py-2 rounded-lg border border-accent-cyan/40 bg-accent-cyan/10 text-accent-cyan font-mono text-xs font-semibold hover:bg-accent-cyan/20 transition-colors cursor-pointer"
          >
            Retry 3D Viewport
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * CameraRig: Smoothly lerps camera position and controls target ONLY when activeHotspot or resetNonce changes,
 * and yields immediately when the user interacts with OrbitControls.
 */
function CameraRig({
  activeHotspot,
  resetNonce,
  controlsRef,
  isTransitioningRef,
}: {
  activeHotspot: RoverHotspot | null;
  resetNonce: number;
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
  isTransitioningRef: React.MutableRefObject<boolean>;
}) {
  const destPosRef = useRef(new THREE.Vector3(...DEFAULT_CAMERA_POS));
  const destTargetRef = useRef(new THREE.Vector3(...DEFAULT_CAMERA_TARGET));
  const hasMountedRef = useRef(false);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      if (activeHotspot !== null || resetNonce > 0) {
        isTransitioningRef.current = true;
      }
      return;
    }
    isTransitioningRef.current = true;
  }, [activeHotspot, resetNonce, isTransitioningRef]);

  useFrame((state, delta) => {
    if (!isTransitioningRef.current) return;

    if (activeHotspot) {
      destPosRef.current.set(...activeHotspot.targetPosition);
      destTargetRef.current.set(...activeHotspot.position);
    } else {
      destPosRef.current.set(...DEFAULT_CAMERA_POS);
      destTargetRef.current.set(...DEFAULT_CAMERA_TARGET);
    }

    const step = Math.min(delta * 4, 0.2);
    state.camera.position.lerp(destPosRef.current, step);

    if (controlsRef.current) {
      controlsRef.current.target.lerp(destTargetRef.current, step);
      controlsRef.current.update();
    }

    const camDist = state.camera.position.distanceTo(destPosRef.current);
    const targetDist = controlsRef.current
      ? controlsRef.current.target.distanceTo(destTargetRef.current)
      : 0;

    if (camDist < 0.01 && targetDist < 0.01) {
      state.camera.position.copy(destPosRef.current);
      if (controlsRef.current) {
        controlsRef.current.target.copy(destTargetRef.current);
        controlsRef.current.update();
      }
      isTransitioningRef.current = false;
    }
  });

  return null;
}

/**
 * HotspotProjector: Projects 3D hotspot world coordinates into 2D viewport pixel coordinates
 * without spawning nested ReactDOM roots inside R3F layout effects (React 19 StrictMode safe).
 */
function HotspotProjector({
  hotspots,
  onProjectHotspot,
}: {
  hotspots: RoverHotspot[];
  onProjectHotspot: (id: string, x: number, y: number, visible: boolean, canvasWidth: number) => void;
}) {
  const scratchVecRef = useRef(new THREE.Vector3());

  useFrame(({ camera, size }) => {
    const vec = scratchVecRef.current;
    for (const hs of hotspots) {
      vec.set(hs.position[0], hs.position[1], hs.position[2]);
      vec.project(camera);

      const isBehindOrClipped = vec.z > 1 || vec.z < -1;
      if (isBehindOrClipped) {
        onProjectHotspot(hs.id, 0, 0, false, size.width);
        continue;
      }

      const x = (vec.x * 0.5 + 0.5) * size.width;
      const y = (-vec.y * 0.5 + 0.5) * size.height;
      const inBounds =
        x >= -24 && x <= size.width + 24 && y >= -24 && y <= size.height + 24;

      onProjectHotspot(hs.id, x, y, inBounds, size.width);
    }
  });

  return null;
}

/**
 * RoverCanvas: R3F WebGL Canvas with OrbitControls, Studio Lighting, Ground Grid, and Projected 2D Hotspots.
 */
export function RoverCanvas({
  isWireframe: _isWireframe = false,
  activeHotspot,
  onSelectHotspot,
  hotspots = [],
  resetNonce = 0,
  className = "",
  children,
}: RoverCanvasProps) {
  void _isWireframe;
  const mounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const isTransitioningRef = useRef<boolean>(false);
  const hotspotButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const hotspotTooltipRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const cleanupContextListenersRef = useRef<(() => void) | null>(null);
  const [contextLost, setContextLost] = useState<boolean>(false);

  const handleProjectHotspot = useCallback(
    (id: string, x: number, y: number, visible: boolean, canvasWidth: number) => {
      const el = hotspotButtonRefs.current[id];
      if (!el) return;
      if (!visible) {
        el.style.opacity = "0";
        el.style.pointerEvents = "none";
        el.tabIndex = -1;
        el.setAttribute("aria-hidden", "true");
        return;
      }
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -50%)`;
      el.style.opacity = "1";
      el.style.pointerEvents = "auto";
      el.tabIndex = 0;
      el.removeAttribute("aria-hidden");

      const tip = hotspotTooltipRefs.current[id];
      if (tip && canvasWidth > 0) {
        const tipWidth = tip.offsetWidth || 156;
        const margin = 8;
        const pinHalf = 16;
        if (x + pinHalf + 4 + tipWidth <= canvasWidth - margin) {
          tip.style.left = "1.75rem";
          tip.style.right = "auto";
          tip.style.top = "50%";
          tip.style.transform = "translateY(-50%)";
        } else if (x - pinHalf - 4 - tipWidth >= margin) {
          tip.style.left = "auto";
          tip.style.right = "1.75rem";
          tip.style.top = "50%";
          tip.style.transform = "translateY(-50%)";
        } else {
          const pinLeft = x - (el.offsetWidth || 26) / 2;
          const desiredScreenLeft = Math.max(margin, Math.min(canvasWidth - margin - tipWidth, x - tipWidth / 2));
          tip.style.right = "auto";
          tip.style.left = `${Math.round(desiredScreenLeft - pinLeft)}px`;
          tip.style.top = "calc(100% + 4px)";
          tip.style.transform = "translateY(0)";
        }
      }
    },
    []
  );

  useEffect(() => {
    return () => {
      cleanupContextListenersRef.current?.();
    };
  }, []);

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
        <span className="font-mono text-[11px] text-zinc-400 mt-1">
          Mounting WebGL viewport & 5.8GHz telemetry link...
        </span>
      </div>
    );
  }

  return (
    <div className={`w-full h-full relative ${className}`}>
      <WebGLErrorBoundary>
        <Canvas
          camera={{ position: DEFAULT_CAMERA_POS, fov: 42 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          onCreated={({ gl }) => {
            cleanupContextListenersRef.current?.();
            const dom = gl.domElement;
            const handleContextLost = (event: Event) => {
              event.preventDefault();
              setContextLost(true);
            };
            const handleContextRestored = () => {
              setContextLost(false);
            };
            dom.addEventListener("webglcontextlost", handleContextLost);
            dom.addEventListener("webglcontextrestored", handleContextRestored);
            cleanupContextListenersRef.current = () => {
              dom.removeEventListener("webglcontextlost", handleContextLost);
              dom.removeEventListener("webglcontextrestored", handleContextRestored);
            };
          }}
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
            <CameraRig
              activeHotspot={activeHotspot}
              resetNonce={resetNonce}
              controlsRef={controlsRef}
              isTransitioningRef={isTransitioningRef}
            />

            {/* 3D-to-2D Projected Hotspot Tracker */}
            <HotspotProjector
              hotspots={hotspots}
              onProjectHotspot={handleProjectHotspot}
            />

            {/* Constrained Studio OrbitControls */}
            <OrbitControls
              ref={controlsRef}
              target={DEFAULT_CAMERA_TARGET}
              minDistance={1.5}
              maxDistance={8.5}
              minPolarAngle={0.15}
              maxPolarAngle={Math.PI / 2.05}
              dampingFactor={0.06}
              enableDamping={true}
              enablePan={false}
              enableZoom={true}
              touches={{ ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN }}
              onStart={() => {
                isTransitioningRef.current = false;
              }}
            />

            {/* 3D Scene Geometry (Procedural Rover) */}
            {children}
          </Suspense>
        </Canvas>
      </WebGLErrorBoundary>

      {/* Projected 2D Interactive Hotspot Overlay */}
      {!contextLost && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden z-10">
          {hotspots.map((hs) => {
            const isSelected = activeHotspot?.id === hs.id;
            return (
              <button
                key={hs.id}
                ref={(el) => {
                  hotspotButtonRefs.current[hs.id] = el;
                }}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectHotspot(isSelected ? null : hs);
                }}
                tabIndex={-1}
                aria-hidden="true"
                style={{ left: 0, top: 0, opacity: 0, pointerEvents: "none" }}
                className="group absolute flex items-center justify-center p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-yellow rounded-full cursor-pointer transition-opacity duration-150"
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
                  ref={(el) => {
                    hotspotTooltipRefs.current[hs.id] = el;
                  }}
                  className={`absolute left-7 top-1/2 -translate-y-1/2 whitespace-nowrap px-2.5 py-1 rounded bg-surface/90 border border-white/20 backdrop-blur-md text-[11px] font-mono tracking-wider shadow-xl pointer-events-none transition-all duration-200 ${
                    isSelected
                      ? "opacity-100 translate-x-0 border-accent-yellow/60 text-accent-yellow"
                      : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 text-white"
                  }`}
                >
                  {hs.label}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* WebGL Context Lost Fallback Card */}
      {contextLost && (
        <div
          role="alert"
          data-testid="webgl-context-lost-fallback"
          className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-canvas/95 border border-accent-yellow/30 rounded-2xl p-8 text-center backdrop-blur-md"
        >
          <span className="font-mono text-xs uppercase tracking-widest text-accent-yellow mb-2">
            {"// WEBGL CONTEXT LOST"}
          </span>
          <p className="font-sans text-xs sm:text-sm text-zinc-300 max-w-sm">
            GPU rendering context was interrupted. Waiting for automatic WebGL context restoration...
          </p>
        </div>
      )}
    </div>
  );
}

export default RoverCanvas;
