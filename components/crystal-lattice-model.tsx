"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import * as THREE from "three";
import {
  getLatticeGeometry,
  type LatticeSystem,
} from "@/data/materials-data";

export type StageModelType = LatticeSystem | "MFC";

export interface CrystalLatticeModelProps {
  latticeType: StageModelType;
  isPaused?: boolean;
  exploded?: boolean;
  accentHex?: string;
}

interface ComputedStrut {
  midpoint: [number, number, number];
  quaternion: [number, number, number, number];
  length: number;
  kind: "bond" | "cell";
}

const UP_AXIS = new THREE.Vector3(0, 1, 0);

const FIBRIL_POSITIONS: [number, number, number][] = [
  [0, 0, 0],
  [0, 0.28, 0.34],
  [0, -0.28, -0.34],
  [0, 0.28, -0.34],
  [0, -0.28, 0.34],
];

const CLAY_PLATES: { pos: [number, number, number]; rot: [number, number, number] }[] = [
  { pos: [-0.55, 0.16, 0.18], rot: [0.22, 0.4, 0.15] },
  { pos: [0.48, 0.22, -0.16], rot: [-0.18, 0.9, -0.12] },
  { pos: [-0.22, -0.14, -0.44], rot: [0.15, -0.5, 0.2] },
  { pos: [0.28, -0.2, 0.42], rot: [-0.24, 0.2, -0.18] },
  { pos: [0.62, 0.02, 0.12], rot: [0.1, 1.1, 0.22] },
  { pos: [-0.62, -0.05, -0.1], rot: [-0.12, -0.8, -0.2] },
];

export function CrystalLatticeModel({
  latticeType,
  isPaused = false,
  exploded = false,
  accentHex = "#21D4FD",
}: CrystalLatticeModelProps) {
  const groupRef = useRef<THREE.Group | null>(null);
  const matrixLayerRef = useRef<THREE.Group | null>(null);
  const fibrilLayerRef = useRef<THREE.Group | null>(null);
  const clayLayerRef = useRef<THREE.Group | null>(null);
  const explodeProgress = useRef(0);
  const prefersReducedMotion = useReducedMotion();

  const geometries = useMemo(() => {
    const hostAtom = new THREE.SphereGeometry(0.115, 28, 28);
    const soluteAtom = new THREE.SphereGeometry(0.14, 32, 32);
    const bondStrut = new THREE.CylinderGeometry(0.018, 0.018, 1, 12);
    const cellStrut = new THREE.CylinderGeometry(0.011, 0.011, 1, 10);
    const matrixBox = new THREE.BoxGeometry(1.75, 1.1, 1.25);
    const matrixEdges = new THREE.EdgesGeometry(matrixBox);
    const microfibril = new THREE.CylinderGeometry(0.055, 0.055, 1.68, 20);
    const nanoclay = new THREE.CylinderGeometry(0.19, 0.19, 0.028, 6);
    return {
      hostAtom,
      soluteAtom,
      bondStrut,
      cellStrut,
      matrixBox,
      matrixEdges,
      microfibril,
      nanoclay,
    };
  }, []);

  useEffect(() => {
    return () => {
      geometries.hostAtom.dispose();
      geometries.soluteAtom.dispose();
      geometries.bondStrut.dispose();
      geometries.cellStrut.dispose();
      geometries.matrixBox.dispose();
      geometries.matrixEdges.dispose();
      geometries.microfibril.dispose();
      geometries.nanoclay.dispose();
    };
  }, [geometries]);

  const latticeData = useMemo(
    () =>
      latticeType === "MFC"
        ? { atoms: [], edges: [] }
        : getLatticeGeometry(latticeType),
    [latticeType]
  );

  const struts = useMemo<ComputedStrut[]>(() => {
    if (latticeType === "MFC") return [];
    const startVec = new THREE.Vector3();
    const endVec = new THREE.Vector3();
    const dirVec = new THREE.Vector3();
    const midVec = new THREE.Vector3();
    const quat = new THREE.Quaternion();

    return latticeData.edges
      .map((edge) => {
        startVec.set(...edge.start);
        endVec.set(...edge.end);
        dirVec.subVectors(endVec, startVec);
        const length = dirVec.length();
        if (length <= 0.0001) return null;

        midVec.addVectors(startVec, endVec).multiplyScalar(0.5);
        dirVec.normalize();
        quat.setFromUnitVectors(UP_AXIS, dirVec);

        return {
          midpoint: [midVec.x, midVec.y, midVec.z] as [number, number, number],
          quaternion: [quat.x, quat.y, quat.z, quat.w] as [
            number,
            number,
            number,
            number,
          ],
          length,
          kind: edge.kind,
        };
      })
      .filter((s): s is ComputedStrut => s !== null);
  }, [latticeData, latticeType]);

  useFrame((state, delta) => {
    if (latticeType === "MFC") {
      const target = exploded ? 1 : 0;
      explodeProgress.current = prefersReducedMotion
        ? target
        : THREE.MathUtils.lerp(explodeProgress.current, target, Math.min(1, delta * 6));
      const p = explodeProgress.current;
      if (matrixLayerRef.current) matrixLayerRef.current.position.y = -0.55 * p;
      if (fibrilLayerRef.current) fibrilLayerRef.current.position.y = 0.05 * p;
      if (clayLayerRef.current) clayLayerRef.current.position.y = 0.65 * p;
    }

    if (!groupRef.current || isPaused || prefersReducedMotion) return;
    groupRef.current.rotation.y += delta * 0.16;
    groupRef.current.rotation.x =
      Math.sin(state.clock.elapsedTime * 0.25) * 0.06;
  });

  if (latticeType === "MFC") {
    return (
      <group ref={groupRef} name="composite-model-MFC">
        {/* PP Matrix Shell */}
        <group ref={matrixLayerRef}>
          <mesh geometry={geometries.matrixBox}>
            <meshStandardMaterial
              color="#71717A"
              transparent
              opacity={0.1}
              roughness={0.4}
              metalness={0.2}
              depthWrite={false}
            />
          </mesh>
          <lineSegments geometry={geometries.matrixEdges}>
            <lineBasicMaterial color="#71717A" transparent opacity={0.45} />
          </lineSegments>
        </group>

        {/* Aligned rPET Microfibrils */}
        <group ref={fibrilLayerRef}>
          {FIBRIL_POSITIONS.map((pos, idx) => (
            <mesh
              key={`fibril-${idx}`}
              position={pos}
              rotation={[0, 0, Math.PI / 2]}
              geometry={geometries.microfibril}
            >
              <meshStandardMaterial
                color="#21D4FD"
                emissive="#21D4FD"
                emissiveIntensity={0.22}
                metalness={0.65}
                roughness={0.2}
              />
            </mesh>
          ))}
        </group>

        {/* Intercalated Nanoclay Platelets */}
        <group ref={clayLayerRef}>
          {CLAY_PLATES.map((plate, idx) => (
            <mesh
              key={`clay-${idx}`}
              position={plate.pos}
              rotation={plate.rot}
              geometry={geometries.nanoclay}
            >
              <meshStandardMaterial
                color="#F59E0B"
                emissive="#F59E0B"
                emissiveIntensity={0.2}
                metalness={0.75}
                roughness={0.22}
              />
            </mesh>
          ))}
        </group>
      </group>
    );
  }

  return (
    <group ref={groupRef} name={`lattice-model-${latticeType}`}>
      {latticeData.atoms.map((atom, idx) => {
        const isSolute = atom.role === "solute";
        return (
          <mesh
            key={`atom-${latticeType}-${idx}`}
            position={atom.position}
            geometry={isSolute ? geometries.soluteAtom : geometries.hostAtom}
          >
            {isSolute ? (
              <meshStandardMaterial
                color="#F4F4F5"
                emissive={accentHex}
                emissiveIntensity={0.28}
                metalness={0.85}
                roughness={0.14}
              />
            ) : (
              <meshStandardMaterial
                color="#D4D4D8"
                metalness={0.88}
                roughness={0.18}
              />
            )}
          </mesh>
        );
      })}

      {struts.map((strut, idx) => (
        <mesh
          key={`strut-${latticeType}-${idx}`}
          position={strut.midpoint}
          quaternion={strut.quaternion}
          scale={[1, strut.length, 1]}
          geometry={
            strut.kind === "bond" ? geometries.bondStrut : geometries.cellStrut
          }
        >
          {strut.kind === "bond" ? (
            <meshStandardMaterial
              color="#71717A"
              metalness={0.65}
              roughness={0.3}
            />
          ) : (
            <meshStandardMaterial
              color="#3F3F46"
              metalness={0.45}
              roughness={0.45}
              transparent
              opacity={0.5}
            />
          )}
        </mesh>
      ))}
    </group>
  );
}
