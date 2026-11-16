"use client";

import React, { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

export interface RoverHotspot {
  id: "arm" | "chassis" | "mast" | "science" | "compute";
  label: string;
  position: [number, number, number];
  targetPosition: [number, number, number];
  description: string;
  specs: Record<string, string>;
}

export interface ProceduralRoverProps {
  isWireframe?: boolean;
  wireframe?: boolean;
  activeHotspot?: RoverHotspot | null;
  onSelectHotspot?: (hotspot: RoverHotspot | null) => void;
}

export function ProceduralRover({
  isWireframe: propIsWireframe,
  wireframe: propWireframe,
  activeHotspot,
}: ProceduralRoverProps) {
  // Support both isWireframe and wireframe prop conventions
  const isWireframe = Boolean(propIsWireframe ?? propWireframe);

  // References for subtle procedural animations
  const lidarRef = useRef<THREE.Mesh>(null);
  const beaconRef = useRef<THREE.PointLight>(null);
  const drillRef = useRef<THREE.Group>(null);

  // Continuous procedural animation loop
  useFrame((_, delta) => {
    // 1. LiDAR 360-degree continuous rotation (approx 10Hz scanner sweep)
    if (lidarRef.current) {
      lidarRef.current.rotation.y += delta * 3.5;
    }
    // 2. Telemetry Beacon pulsing effect
    if (beaconRef.current) {
      beaconRef.current.intensity = 0.8 + Math.sin(Date.now() * 0.005) * 0.4;
    }
    // 3. Subtle drill vibration when science bay is inspected
    if (drillRef.current && activeHotspot?.id === "science") {
      drillRef.current.rotation.y += delta * 5.0;
    }
  });

  // Base PBR material properties strictly verified by tests
  const pbrMaterialProps = {
    roughness: 0.4,
    metalness: 0.8,
    wireframe: isWireframe,
  };

  // Color ramp based on wireframe mode
  const bodyColor = isWireframe ? "#21D4FD" : "#E2E8F0";
  const darkChassisColor = isWireframe ? "#21D4FD" : "#1A1A1E";
  const wheelColor = isWireframe ? "#21D4FD" : "#121215";
  const rimColor = isWireframe ? "#FCED3A" : "#71717A";
  const accentGoldColor = isWireframe ? "#FCED3A" : "#E5A93C";
  const cyanEmissive = isWireframe ? "#21D4FD" : "#21D4FD";

  return (
    <group name="rover-root" dispose={null}>
      {/* ================================================================= */}
      {/* 1. CENTRAL CHASSIS MONOCOQUE                                      */}
      {/* ================================================================= */}
      <group position={[0, 0.85, -0.05]}>
        {/* Main Body Monocoque Enclosure */}
        <mesh name="chassis-main" castShadow receiveShadow>
          <boxGeometry args={[1.0, 0.45, 1.6]} />
          <meshStandardMaterial
            color={isWireframe ? "#21D4FD" : "#E2E8F0"}
            roughness={0.4}
            metalness={0.8}
            wireframe={isWireframe}
          />
        </mesh>

        {/* Lightweight Carbon-Aluminum Top Deck Plate */}
        <mesh position={[0, 0.23, 0]} receiveShadow>
          <boxGeometry args={[1.04, 0.04, 1.64]} />
          <meshStandardMaterial
            {...pbrMaterialProps}
            color={darkChassisColor}
          />
        </mesh>

        {/* Underbody Protective Beveled Skid Plate */}
        <mesh position={[0, -0.25, 0]}>
          <boxGeometry args={[0.85, 0.08, 1.4]} />
          <meshStandardMaterial
            {...pbrMaterialProps}
            color={darkChassisColor}
          />
        </mesh>

        {/* Lateral Radiator Heatsink Slats (Left & Right) */}
        {[-0.52, 0.52].map((x, i) => (
          <group key={`radiator-${i}`} position={[x, 0, 0]}>
            {[-0.3, -0.15, 0, 0.15, 0.3].map((z, j) => (
              <mesh key={`fin-${j}`} position={[0, 0, z]}>
                <boxGeometry args={[0.02, 0.22, 0.08]} />
                <meshStandardMaterial
                  {...pbrMaterialProps}
                  color={accentGoldColor}
                />
              </mesh>
            ))}
          </group>
        ))}

        {/* Front ITU Matrix Laser-Etched Emblem */}
        <mesh position={[0, 0.05, 0.81]}>
          <boxGeometry args={[0.35, 0.12, 0.02]} />
          <meshStandardMaterial
            color={isWireframe ? "#FCED3A" : "#0B0B0E"}
            roughness={0.4}
            metalness={0.8}
            wireframe={isWireframe}
            emissive={cyanEmissive}
            emissiveIntensity={0.2}
          />
        </mesh>
      </group>

      {/* ================================================================= */}
      {/* 2. ROCKER-BOGIE SUSPENSION MECHANISM                              */}
      {/* ================================================================= */}
      <group name="rocker-bogie-suspension">
        {/* Transverse Differential Pivot Bar across top rear chassis */}
        <mesh position={[0, 1.05, -0.45]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.035, 0.035, 1.25, 16]} />
          <meshStandardMaterial {...pbrMaterialProps} color={accentGoldColor} />
        </mesh>

        {/* Left & Right Main Rocker Struts */}
        {[-0.62, 0.62].map((x, idx) => (
          <group key={`rocker-${idx}`} position={[x, 0.75, 0]}>
            {/* Main Rocker Pivot Axis Joint */}
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.06, 0.06, 0.15, 16]} />
              <meshStandardMaterial {...pbrMaterialProps} color={accentGoldColor} />
            </mesh>

            {/* Rear Rocker Arm Beam to Rear Wheel */}
            <mesh position={[0, -0.2, -0.55]} rotation={[0.35, 0, 0]}>
              <boxGeometry args={[0.07, 0.07, 1.2]} />
              <meshStandardMaterial {...pbrMaterialProps} color={darkChassisColor} />
            </mesh>

            {/* Front Rocker Arm Beam to Bogie Pivot */}
            <mesh position={[0, -0.1, 0.35]} rotation={[-0.25, 0, 0]}>
              <boxGeometry args={[0.07, 0.07, 0.75]} />
              <meshStandardMaterial {...pbrMaterialProps} color={darkChassisColor} />
            </mesh>

            {/* Bogie Swivel Pivot Joint */}
            <mesh position={[0, -0.2, 0.65]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.05, 0.05, 0.12, 16]} />
              <meshStandardMaterial {...pbrMaterialProps} color={accentGoldColor} />
            </mesh>

            {/* Bogie Linkage Bar connecting Front and Mid Wheels */}
            <mesh position={[0, -0.3, 0.65]} rotation={[0, 0, 0]}>
              <boxGeometry args={[0.06, 0.06, 0.95]} />
              <meshStandardMaterial {...pbrMaterialProps} color={darkChassisColor} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ================================================================= */}
      {/* 3. SIX HIGH-TRACTION WHEELS (WHEEL-ASSEMBLY)                      */}
      {/* ================================================================= */}
      <group name="wheel-assembly">
        {[
          { name: "wheel-front-left", pos: [-1.05, 0.35, 1.1] as [number, number, number], steer: true },
          { name: "wheel-front-right", pos: [1.05, 0.35, 1.1] as [number, number, number], steer: true },
          { name: "wheel-mid-left", pos: [-1.15, 0.35, 0.0] as [number, number, number], steer: false },
          { name: "wheel-mid-right", pos: [1.15, 0.35, 0.0] as [number, number, number], steer: false },
          { name: "wheel-rear-left", pos: [-1.05, 0.35, -1.1] as [number, number, number], steer: true },
          { name: "wheel-rear-right", pos: [1.05, 0.35, -1.1] as [number, number, number], steer: true },
        ].map((wheel) => (
          <group key={wheel.name} name={wheel.name} position={wheel.pos}>
            {/* Steering Kingpin Swivel Column (for front/rear steerable wheels) */}
            {wheel.steer && (
              <mesh position={[0, 0.22, 0]}>
                <cylinderGeometry args={[0.035, 0.035, 0.22, 16]} />
                <meshStandardMaterial {...pbrMaterialProps} color={accentGoldColor} />
              </mesh>
            )}

            {/* In-Hub Brushless Electric Drive Motor Hub */}
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.18, 0.18, 0.28, 20]} />
              <meshStandardMaterial {...pbrMaterialProps} color={rimColor} />
            </mesh>

            {/* High-Traction Cylindrical Wheel Tire Rim */}
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
              <cylinderGeometry args={[0.35, 0.35, 0.24, 24]} />
              <meshStandardMaterial {...pbrMaterialProps} color={wheelColor} />
            </mesh>

            {/* High-Grip Knurled Cleat Lug Grousers (8 Radial Chevrons) */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
              const rad = (deg * Math.PI) / 180;
              return (
                <mesh
                  key={`grouser-${deg}`}
                  position={[0, Math.cos(rad) * 0.35, Math.sin(rad) * 0.35]}
                  rotation={[rad, 0, 0]}
                >
                  <boxGeometry args={[0.22, 0.025, 0.04]} />
                  <meshStandardMaterial {...pbrMaterialProps} color={accentGoldColor} />
                </mesh>
              );
            })}
          </group>
        ))}
      </group>

      {/* ================================================================= */}
      {/* 4. 6-DOF ARTICULATED ROBOTIC ARM (ERC BEST ARM WINNER)            */}
      {/* ================================================================= */}
      <group name="robotic-arm-assembly" position={[0.35, 1.12, 0.60]}>
        {/* Joint 1: Rotating Turret Base (Yaw Axis) */}
        <group name="arm-joint-1-turret">
          <mesh position={[0, 0.07, 0]} castShadow>
            <cylinderGeometry args={[0.14, 0.16, 0.14, 20]} />
            <meshStandardMaterial {...pbrMaterialProps} color={accentGoldColor} />
          </mesh>

          {/* Joint 2: Shoulder Pitch Joint */}
          <group name="arm-joint-2-shoulder" position={[0, 0.16, 0]}>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.09, 0.09, 0.18, 16]} />
              <meshStandardMaterial {...pbrMaterialProps} color={accentGoldColor} />
            </mesh>

            {/* Upper Arm Structural Beam (angled forward ~35 deg) */}
            <mesh position={[0, 0.28, 0.15]} rotation={[-0.45, 0, 0]} castShadow>
              <boxGeometry args={[0.09, 0.58, 0.09]} />
              <meshStandardMaterial {...pbrMaterialProps} color={darkChassisColor} />
            </mesh>

            {/* Joint 3: Elbow Pitch Joint */}
            <group name="arm-joint-3-elbow" position={[0, 0.52, 0.32]}>
              <mesh rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.08, 0.08, 0.16, 16]} />
                <meshStandardMaterial {...pbrMaterialProps} color={accentGoldColor} />
              </mesh>

              {/* Forearm Structural Beam */}
              <mesh position={[0, 0.22, 0.18]} rotation={[-0.8, 0, 0]} castShadow>
                <boxGeometry args={[0.075, 0.48, 0.075]} />
                <meshStandardMaterial {...pbrMaterialProps} color={darkChassisColor} />
              </mesh>

              {/* Joint 4 & 5: Wrist Pitch & Roll Gimbal */}
              <group name="arm-joint-4-wrist" position={[0, 0.42, 0.38]}>
                <mesh rotation={[0, 0, Math.PI / 2]}>
                  <cylinderGeometry args={[0.065, 0.065, 0.14, 16]} />
                  <meshStandardMaterial {...pbrMaterialProps} color={accentGoldColor} />
                </mesh>

                {/* Joint 6: Parallel Jaw End-Effector Gripper */}
                <group name="arm-gripper-endeffector" position={[0, 0.12, 0.06]}>
                  {/* Palm Mounting Flange */}
                  <mesh>
                    <boxGeometry args={[0.12, 0.03, 0.10]} />
                    <meshStandardMaterial {...pbrMaterialProps} color={rimColor} />
                  </mesh>

                  {/* Left Gripper Finger */}
                  <mesh position={[-0.04, 0.07, 0]} castShadow>
                    <boxGeometry args={[0.022, 0.12, 0.03]} />
                    <meshStandardMaterial {...pbrMaterialProps} color={accentGoldColor} />
                  </mesh>

                  {/* Right Gripper Finger */}
                  <mesh position={[0.04, 0.07, 0]} castShadow>
                    <boxGeometry args={[0.022, 0.12, 0.03]} />
                    <meshStandardMaterial {...pbrMaterialProps} color={accentGoldColor} />
                  </mesh>

                  {/* Tactile Sensor Array Tips */}
                  <mesh position={[0, 0.12, 0]}>
                    <sphereGeometry args={[0.015, 12, 12]} />
                    <meshStandardMaterial
                      color={cyanEmissive}
                      roughness={0.4}
                      metalness={0.8}
                      wireframe={isWireframe}
                      emissive={cyanEmissive}
                      emissiveIntensity={0.6}
                    />
                  </mesh>
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>

      {/* ================================================================= */}
      {/* 5. TELESCOPIC MAST & STEREOSCOPIC VISION & ROTATING LIDAR         */}
      {/* ================================================================= */}
      <group name="mast-sensor-assembly" position={[-0.35, 1.10, 0.45]}>
        {/* Base Mounting Collar */}
        <mesh position={[0, 0.05, 0]}>
          <cylinderGeometry args={[0.07, 0.09, 0.08, 16]} />
          <meshStandardMaterial {...pbrMaterialProps} color={accentGoldColor} />
        </mesh>

        {/* Telescopic Carbon Fiber Vertical Mast Column */}
        <mesh position={[0, 0.46, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.05, 0.82, 16]} />
          <meshStandardMaterial {...pbrMaterialProps} color={darkChassisColor} />
        </mesh>

        {/* Diagonal Stabilizing Stays */}
        {[-0.08, 0.08].map((dx, i) => (
          <mesh key={`stay-${i}`} position={[dx, 0.25, -0.05]} rotation={[0.2, 0, dx > 0 ? 0.3 : -0.3]}>
            <cylinderGeometry args={[0.015, 0.015, 0.45, 12]} />
            <meshStandardMaterial {...pbrMaterialProps} color={rimColor} />
          </mesh>
        ))}

        {/* Pan-Tilt Sensor Gimbal Head */}
        <mesh position={[0, 0.90, 0]}>
          <sphereGeometry args={[0.065, 16, 16]} />
          <meshStandardMaterial {...pbrMaterialProps} color={accentGoldColor} />
        </mesh>

        {/* Stereoscopic Depth Vision Sensor Bar */}
        <group position={[0, 0.94, 0.05]}>
          <mesh castShadow>
            <boxGeometry args={[0.34, 0.07, 0.07]} />
            <meshStandardMaterial {...pbrMaterialProps} color={darkChassisColor} />
          </mesh>

          {/* Left Stereo Camera Lens with glowing ring */}
          <mesh position={[-0.12, 0, 0.04]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.025, 0.025, 0.03, 16]} />
            <meshStandardMaterial
              color={cyanEmissive}
              roughness={0.4}
              metalness={0.8}
              wireframe={isWireframe}
              emissive={cyanEmissive}
              emissiveIntensity={0.8}
            />
          </mesh>

          {/* Right Stereo Camera Lens with glowing ring */}
          <mesh position={[0.12, 0, 0.04]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.025, 0.025, 0.03, 16]} />
            <meshStandardMaterial
              color={cyanEmissive}
              roughness={0.4}
              metalness={0.8}
              wireframe={isWireframe}
              emissive={cyanEmissive}
              emissiveIntensity={0.8}
            />
          </mesh>
        </group>

        {/* 360-Degree Rotating 3D LiDAR Scanning Puck */}
        <group position={[0, 1.05, 0]}>
          {/* Static Mounting Base */}
          <mesh position={[0, -0.03, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.05, 16]} />
            <meshStandardMaterial {...pbrMaterialProps} color={rimColor} />
          </mesh>

          {/* Rotating LiDAR Puck Head */}
          <mesh ref={lidarRef} name="sensor-mast-lidar-cylinder" castShadow>
            <cylinderGeometry args={[0.075, 0.075, 0.09, 24]} />
            <meshStandardMaterial
              color={isWireframe ? "#21D4FD" : "#0F172A"}
              roughness={0.4}
              metalness={0.8}
              wireframe={isWireframe}
              emissive={isWireframe ? "#21D4FD" : "#21D4FD"}
              emissiveIntensity={0.3}
            />
          </mesh>
        </group>
      </group>

      {/* ================================================================= */}
      {/* 6. ASTROBIOLOGICAL SCIENCE LAB (URC BEST SCIENCE WINNER)          */}
      {/* ================================================================= */}
      <group name="science-bay-assembly" position={[-0.26, 1.10, -0.38]}>
        {/* Hermetically Sealed Micro-Lab Enclosure */}
        <mesh position={[0, 0.12, 0]} castShadow>
          <boxGeometry args={[0.40, 0.26, 0.46]} />
          <meshStandardMaterial {...pbrMaterialProps} color={darkChassisColor} />
        </mesh>

        {/* Subsurface Core Soil Extraction Auger Drill */}
        <group ref={drillRef} position={[0.10, 0, 0.08]}>
          {/* Drill Motor Powerhead */}
          <mesh position={[0, 0.28, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.14, 16]} />
            <meshStandardMaterial {...pbrMaterialProps} color={accentGoldColor} />
          </mesh>

          {/* Spiral Soil Auger Shaft */}
          <mesh position={[0, 0.05, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.36, 12]} />
            <meshStandardMaterial {...pbrMaterialProps} color={rimColor} />
          </mesh>

          {/* Tungsten Carbide Drill Bit Tip */}
          <mesh position={[0, -0.15, 0]} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[0.035, 0.08, 12]} />
            <meshStandardMaterial {...pbrMaterialProps} color={accentGoldColor} />
          </mesh>
        </group>

        {/* Rotary Sample Carousel with 6 Test Tube Chambers */}
        <group position={[-0.08, 0.14, -0.05]}>
          <mesh position={[0, 0.02, 0]}>
            <cylinderGeometry args={[0.11, 0.11, 0.03, 20]} />
            <meshStandardMaterial {...pbrMaterialProps} color={accentGoldColor} />
          </mesh>

          {/* 6 Miniature Reagent Test Tubes */}
          {[0, 60, 120, 180, 240, 300].map((deg, i) => {
            const rad = (deg * Math.PI) / 180;
            const colors = ["#10B981", "#21D4FD", "#AF52DE", "#FCED3A", "#FF2A85", "#36A3F7"];
            return (
              <mesh
                key={`tube-${i}`}
                position={[Math.cos(rad) * 0.075, 0.08, Math.sin(rad) * 0.075]}
              >
                <cylinderGeometry args={[0.014, 0.014, 0.10, 12]} />
                <meshStandardMaterial
                  color={isWireframe ? "#21D4FD" : colors[i]}
                  roughness={0.4}
                  metalness={0.8}
                  wireframe={isWireframe}
                  emissive={colors[i]}
                  emissiveIntensity={isWireframe ? 0.2 : 0.4}
                />
              </mesh>
            );
          })}
        </group>

        {/* In-Situ Raman Spectroscopy Laser Diode Housing */}
        <mesh position={[-0.08, 0.26, 0.12]}>
          <boxGeometry args={[0.07, 0.05, 0.09]} />
          <meshStandardMaterial
            color={cyanEmissive}
            roughness={0.4}
            metalness={0.8}
            wireframe={isWireframe}
            emissive={cyanEmissive}
            emissiveIntensity={0.6}
          />
        </mesh>
      </group>

      {/* ================================================================= */}
      {/* 7. AVIONICS, JETSON AGX ORIN COMPUTE & TELEMETRY BAY              */}
      {/* ================================================================= */}
      <group name="compute-avionics-bay" position={[0.26, 1.10, -0.42]}>
        {/* Sealed IP67 Aluminum Avionics Enclosure */}
        <mesh position={[0, 0.10, 0]} castShadow>
          <boxGeometry args={[0.38, 0.22, 0.42]} />
          <meshStandardMaterial {...pbrMaterialProps} color={darkChassisColor} />
        </mesh>

        {/* NVIDIA Jetson AGX Orin Heatsink Unit */}
        <mesh position={[-0.04, 0.23, 0.05]}>
          <boxGeometry args={[0.22, 0.04, 0.22]} />
          <meshStandardMaterial {...pbrMaterialProps} color={accentGoldColor} />
        </mesh>

        {/* Parabolic High-Gain Directional 5.8GHz Dish Antenna */}
        <group position={[0.08, 0.22, -0.10]}>
          {/* Antenna Mounting Pylon */}
          <mesh position={[0, 0.12, 0]}>
            <cylinderGeometry args={[0.02, 0.025, 0.24, 12]} />
            <meshStandardMaterial {...pbrMaterialProps} color={rimColor} />
          </mesh>

          {/* Parabolic Dish Cone */}
          <mesh position={[0, 0.28, 0]} rotation={[-Math.PI / 4, 0, 0]}>
            <coneGeometry args={[0.18, 0.07, 24, 1, true]} />
            <meshStandardMaterial {...pbrMaterialProps} color={accentGoldColor} />
          </mesh>

          {/* Central Feed Horn */}
          <mesh position={[0, 0.31, 0.05]} rotation={[-Math.PI / 4, 0, 0]}>
            <cylinderGeometry args={[0.01, 0.01, 0.08, 12]} />
            <meshStandardMaterial {...pbrMaterialProps} color={rimColor} />
          </mesh>
        </group>

        {/* Dual RTK-GPS High-Precision Navigation Antennas */}
        {[-0.10, 0.02].map((x, i) => (
          <mesh key={`gps-${i}`} position={[x, 0.22, -0.12]}>
            <cylinderGeometry args={[0.035, 0.035, 0.02, 16]} />
            <meshStandardMaterial {...pbrMaterialProps} color={bodyColor} />
          </mesh>
        ))}

        {/* Pulsing 5.8GHz Online Telemetry LED Beacon */}
        <mesh position={[-0.12, 0.23, 0.14]}>
          <sphereGeometry args={[0.022, 16, 16]} />
          <meshStandardMaterial
            color="#10B981"
            roughness={0.4}
            metalness={0.8}
            wireframe={isWireframe}
            emissive="#10B981"
            emissiveIntensity={1.0}
          />
        </mesh>
        <pointLight
          ref={beaconRef}
          position={[-0.12, 0.28, 0.14]}
          color="#10B981"
          intensity={0.8}
          distance={1.5}
        />
      </group>
    </group>
  );
}

export default ProceduralRover;
