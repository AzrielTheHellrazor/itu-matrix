"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import * as THREE from "three";
import {
  getLatticeGeometry,
  type LatticeSystem,
} from "@/data/materials-data";

export interface CrystalLatticeModelProps {
  latticeType: LatticeSystem;
  isPaused?: boolean;
  accentHex?: string;
}

interface ComputedStrut {
  midpoint: [number, number, number];
  quaternion: [number, number, number, number];
  length: number;
  kind: "bond" | "cell";
}

const UP_AXIS = new THREE.Vector3(0, 1, 0);

export function CrystalLatticeModel({
  latticeType,
  isPaused = false,
  accentHex = "#21D4FD",
}: CrystalLatticeModelProps) {
  const groupRef = useRef<THREE.Group | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const geometries = useMemo(() => {
    const hostAtom = new THREE.SphereGeometry(0.115, 28, 28);
    const soluteAtom = new THREE.SphereGeometry(0.14, 32, 32);
    const bondStrut = new THREE.CylinderGeometry(0.018, 0.018, 1, 12);
    const cellStrut = new THREE.CylinderGeometry(0.011, 0.011, 1, 10);
    return { hostAtom, soluteAtom, bondStrut, cellStrut };
  }, []);

  useEffect(() => {
    return () => {
      geometries.hostAtom.dispose();
      geometries.soluteAtom.dispose();
      geometries.bondStrut.dispose();
      geometries.cellStrut.dispose();
    };
  }, [geometries]);

  const latticeData = useMemo(
    () => getLatticeGeometry(latticeType),
    [latticeType]
  );

  const struts = useMemo<ComputedStrut[]>(() => {
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
  }, [latticeData]);

  useFrame((state, delta) => {
    if (!groupRef.current || isPaused || prefersReducedMotion) return;
    groupRef.current.rotation.y += delta * 0.16;
    groupRef.current.rotation.x =
      Math.sin(state.clock.elapsedTime * 0.25) * 0.06;
  });

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

      {struts.map((strut, idx) => {
        const isBond = strut.kind === "bond";
        return (
          <mesh
            key={`strut-${latticeType}-${idx}`}
            position={strut.midpoint}
            quaternion={strut.quaternion}
            scale={[1, strut.length, 1]}
            geometry={isBond ? geometries.bondStrut : geometries.cellStrut}
          >
            {isBond ? (
              <meshStandardMaterial
                color="#71717A"
                metalness={0.7}
                roughness={0.35}
                transparent
                opacity={0.68}
              />
            ) : (
              <meshStandardMaterial
                color="#52525B"
                metalness={0.55}
                roughness={0.45}
                transparent
                opacity={0.45}
              />
            )}
          </mesh>
        );
      })}
    </group>
  );
}

export default CrystalLatticeModel;
