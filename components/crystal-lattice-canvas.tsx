"use client";

import React, { Component, Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import type { LatticeSystem } from "@/data/materials-data";

export interface CrystalLatticeCanvasProps {
  latticeType: LatticeSystem;
  onResetNonce?: number;
  className?: string;
  children?: React.ReactNode;
}

const DEFAULT_CAMERA_POS: [number, number, number] = [3.6, 2.5, 3.8];
const DEFAULT_CAMERA_TARGET: [number, number, number] = [0, 0, 0];

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
          className="w-full h-full flex flex-col items-center justify-center bg-canvas/90 border border-white/10 rounded-xl p-8 text-center"
        >
          <span className="font-mono text-xs uppercase tracking-widest text-accent-amber mb-2">
            WebGL Viewport Unavailable
          </span>
          <p className="text-sm text-zinc-400 max-w-sm mb-4">
            3D hardware acceleration is unavailable in this browser session.
          </p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false })}
            className="px-4 py-2 rounded-md border border-white/15 bg-surface-elevated text-zinc-100 font-mono text-xs hover:border-white/30 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
          >
            Retry Viewport
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

function CameraRig({
  resetNonce,
  controlsRef,
  isTransitioningRef,
}: {
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
      return;
    }
    if (resetNonce > 0) {
      isTransitioningRef.current = true;
    }
  }, [resetNonce, isTransitioningRef]);

  useFrame((state, delta) => {
    if (!isTransitioningRef.current) return;

    destPosRef.current.set(...DEFAULT_CAMERA_POS);
    destTargetRef.current.set(...DEFAULT_CAMERA_TARGET);

    const step = Math.min(delta * 4.5, 0.22);
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

export function CrystalLatticeCanvas({
  latticeType,
  onResetNonce = 0,
  className = "",
  children,
}: CrystalLatticeCanvasProps) {
  const mounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const isTransitioningRef = useRef<boolean>(false);
  const cleanupContextListenersRef = useRef<(() => void) | null>(null);
  const [contextLost, setContextLost] = useState<boolean>(false);

  useEffect(() => {
    return () => {
      cleanupContextListenersRef.current?.();
    };
  }, []);

  if (!mounted) {
    return (
      <div
        data-testid="lattice-ssr-placeholder"
        className="w-full h-full flex flex-col items-center justify-center bg-surface rounded-xl p-8"
      >
        <div className="h-6 w-6 rounded-full border border-white/15 border-t-accent-cyan animate-spin mb-3" />
        <span className="font-mono text-xs tracking-widest uppercase text-zinc-400">
          Loading {latticeType} Unit Cell
        </span>
      </div>
    );
  }

  return (
    <div className={`w-full h-full relative ${className}`}>
      <WebGLErrorBoundary>
        <Canvas
          camera={{ position: DEFAULT_CAMERA_POS, fov: 38 }}
          dpr={[1, 2]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
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
              dom.removeEventListener(
                "webglcontextrestored",
                handleContextRestored
              );
            };
          }}
          className="w-full h-full"
        >
          <Suspense fallback={null}>
            {/* Calibrated Offline Studio Lighting (Zero external HDR fetch) */}
            <ambientLight intensity={0.45} color="#ffffff" />
            <directionalLight
              position={[5, 7, 5]}
              intensity={1.6}
              color="#ffffff"
            />
            <directionalLight
              position={[-5, 3, -4]}
              intensity={0.75}
              color="#21D4FD"
            />
            <directionalLight
              position={[3, -4, -3]}
              intensity={0.45}
              color="#F59E0B"
            />
            <directionalLight
              position={[-3, -3, 4]}
              intensity={0.35}
              color="#AF52DE"
            />

            <CameraRig
              resetNonce={onResetNonce}
              controlsRef={controlsRef}
              isTransitioningRef={isTransitioningRef}
            />

            <OrbitControls
              ref={controlsRef}
              target={DEFAULT_CAMERA_TARGET}
              minDistance={2.4}
              maxDistance={6.8}
              minPolarAngle={0.2}
              maxPolarAngle={Math.PI - 0.2}
              dampingFactor={0.06}
              enableDamping={true}
              enablePan={false}
              enableZoom={true}
              touches={{ ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN }}
              onStart={() => {
                isTransitioningRef.current = false;
              }}
            />

            {children}
          </Suspense>
        </Canvas>
      </WebGLErrorBoundary>

      {contextLost && (
        <div
          role="alert"
          data-testid="webgl-context-lost-fallback"
          className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-canvas/95 border border-white/15 rounded-xl p-8 text-center backdrop-blur-md"
        >
          <span className="font-mono text-xs uppercase tracking-widest text-accent-amber mb-2">
            WebGL Context Interrupted
          </span>
          <p className="text-sm text-zinc-300 max-w-sm">
            Graphics context was paused by the browser. Waiting for automatic restoration.
          </p>
        </div>
      )}
    </div>
  );
}

export default CrystalLatticeCanvas;
