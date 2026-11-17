"use client";

import React from "react";
import { CrystalLatticeCanvas } from "@/components/crystal-lattice-canvas";
import {
  CrystalLatticeModel,
  type StageModelType,
} from "@/components/crystal-lattice-model";

export interface CrystalLatticeViewportProps {
  latticeType: StageModelType;
  resetNonce: number;
  isPaused: boolean;
  exploded?: boolean;
  accentHex: string;
}

export default function CrystalLatticeViewport({
  latticeType,
  resetNonce,
  isPaused,
  exploded = false,
  accentHex,
}: CrystalLatticeViewportProps) {
  return (
    <CrystalLatticeCanvas latticeType={latticeType} onResetNonce={resetNonce}>
      <CrystalLatticeModel
        latticeType={latticeType}
        isPaused={isPaused}
        exploded={exploded}
        accentHex={accentHex}
      />
    </CrystalLatticeCanvas>
  );
}
