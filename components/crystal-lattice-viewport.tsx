"use client";

import React from "react";
import type { LatticeSystem } from "@/data/materials-data";
import { CrystalLatticeCanvas } from "@/components/crystal-lattice-canvas";
import { CrystalLatticeModel } from "@/components/crystal-lattice-model";

export interface CrystalLatticeViewportProps {
  latticeType: LatticeSystem;
  resetNonce: number;
  isPaused: boolean;
  accentHex: string;
}

export default function CrystalLatticeViewport({
  latticeType,
  resetNonce,
  isPaused,
  accentHex,
}: CrystalLatticeViewportProps) {
  return (
    <CrystalLatticeCanvas latticeType={latticeType} onResetNonce={resetNonce}>
      <CrystalLatticeModel
        latticeType={latticeType}
        isPaused={isPaused}
        accentHex={accentHex}
      />
    </CrystalLatticeCanvas>
  );
}
