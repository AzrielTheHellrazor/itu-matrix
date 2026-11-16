"use client";

import React, { useRef } from "react";
import * as THREE from "three";

export interface RoverHotspot {
  id: "arm" | "chassis" | "mast" | "science" | "compute";
  label: string;
  position: [number, number, number];
  targetPosition: [number, number, number];
  description: string;
  specs: Record<string, string>;
}

export interface RoverSceneProps {
  isWireframe?: boolean;
  activeHotspot?: RoverHotspot | null;
  onSelectHotspot?: (hotspot: RoverHotspot | null) => void;
}

export function ProceduralRover({ isWireframe = false, activeHotspot, onSelectHotspot }: RoverSceneProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Wireframe material configuration
  const materialProps = {
    wireframe: isWireframe,
    color: isWireframe ? "#21D4FD" : "#E2E8F0",
    roughness: 0.4,
    metalness: 0.8,
  };

  return (
    <group ref={groupRef} name="rover-root">
      {/* Rocker-Bogie Chassis Assembly */}
      <mesh name="chassis-main" position={[0, 0.5, 0]}>
        <boxGeometry args={[1.6, 0.4, 2.2]} />
        <meshStandardMaterial {...materialProps} />
      </mesh>

      {/* 6 Articulated Traction Wheels with Symmetrical Hubs */}
      <group name="wheel-assembly">
        <mesh name="wheel-front-left" position={[-0.9, 0.3, 0.8]}>
          <cylinderGeometry args={[0.3, 0.3, 0.25, 24]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>
        <mesh name="wheel-front-right" position={[0.9, 0.3, 0.8]}>
          <cylinderGeometry args={[0.3, 0.3, 0.25, 24]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>
        <mesh name="wheel-mid-left" position={[-0.95, 0.3, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.25, 24]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>
        <mesh name="wheel-mid-right" position={[0.95, 0.3, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.25, 24]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>
        <mesh name="wheel-rear-left" position={[-0.9, 0.3, -0.8]}>
          <cylinderGeometry args={[0.3, 0.3, 0.25, 24]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>
        <mesh name="wheel-rear-right" position={[0.9, 0.3, -0.8]}>
          <cylinderGeometry args={[0.3, 0.3, 0.25, 24]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>
      </group>

      {/* 6-DOF Robotic Arm Kinematic Chain */}
      <group name="robotic-arm-assembly" position={[0.5, 0.7, 0.8]}>
        <mesh name="arm-joint-1-turret">
          <cylinderGeometry args={[0.15, 0.15, 0.2, 16]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>
        <mesh name="arm-joint-2-shoulder" position={[0, 0.2, 0]}>
          <boxGeometry args={[0.12, 0.4, 0.12]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>
        <mesh name="arm-joint-3-elbow" position={[0, 0.5, 0.2]}>
          <boxGeometry args={[0.1, 0.4, 0.1]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>
        <mesh name="arm-joint-4-wrist" position={[0, 0.75, 0.35]}>
          <cylinderGeometry args={[0.08, 0.08, 0.15, 12]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>
        <mesh name="arm-gripper-endeffector" position={[0, 0.9, 0.45]}>
          <boxGeometry args={[0.15, 0.08, 0.12]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>
      </group>

      {/* Mast, Stereoscopic Cameras & 360 LiDAR */}
      <group name="mast-sensor-assembly" position={[-0.4, 0.7, 0.7]}>
        <mesh name="sensor-mast-pillar">
          <cylinderGeometry args={[0.06, 0.06, 0.8, 12]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>
        <mesh name="sensor-mast-camera-head" position={[0, 0.45, 0]}>
          <boxGeometry args={[0.25, 0.12, 0.15]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>
        <mesh name="sensor-mast-lidar-cylinder" position={[0, 0.55, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.1, 16]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>
      </group>

      {/* Science Carousel & In-Situ Spectrometry Bay */}
      <group name="science-bay-assembly" position={[0, 0.65, -0.6]}>
        <mesh name="science-carousel-module">
          <cylinderGeometry args={[0.35, 0.35, 0.25, 16]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>
      </group>

      {/* Edge Compute / Jetson Avionics Enclosure */}
      <mesh name="compute-avionics-bay" position={[0, 0.65, 0.1]}>
        <boxGeometry args={[0.6, 0.25, 0.5]} />
        <meshStandardMaterial {...materialProps} />
      </mesh>
    </group>
  );
}
