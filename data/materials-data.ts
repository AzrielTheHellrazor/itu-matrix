export type LatticeSystem = "BCC" | "FCC" | "HCP";

export interface AtomNode {
  position: [number, number, number];
  role: "host" | "solute";
}

export interface BondEdge {
  start: [number, number, number];
  end: [number, number, number];
  kind: "bond" | "cell";
}

export interface LatticeGeometryData {
  atoms: AtomNode[];
  edges: BondEdge[];
}

export interface LatticeSpec {
  id: LatticeSystem;
  name: string;
  materialExample: string;
  packingFactor: string;
  coordinationNumber: number;
  accentHex: string;
}

export interface ResearchProject {
  id: string;
  code: string;
  title: string;
  domain: string;
  summary: string;
  metrics: { label: string; value: string }[];
  accent: "cyan" | "violet" | "amber";
}

export interface SubteamDivision {
  id: string;
  name: string;
  focus: string;
  description: string;
  colSpan?: string;
}

export interface HeritageMilestone {
  id: string;
  year: string;
  title: string;
  context: string;
  outcome: string;
}

export interface LabFocusArea {
  id: string;
  name: string;
  scope: string;
}

export const CLUB_INFO = {
  name: "ITU MATRIX",
  subtitle: "MATERIALS & METALLURGY",
  institution: "Istanbul Technical University",
  institutionShort: "İTÜ",
  faculty: "Faculty of Chemical and Metallurgical Engineering",
  department: "Department of Metallurgical and Materials Engineering",
  campus: "Ayazağa Campus, Maslak, Istanbul",
  foundedUniversity: "1773",
  foundedChair: "1961–1962",
  mergedFaculty: "1982",
  renamedDepartment: "1998",
  institutionUrl: "https://www.itu.edu.tr",
  departmentUrl: "https://mme.itu.edu.tr",
} as const;

export const LATTICE_SPECS: LatticeSpec[] = [
  {
    id: "BCC",
    name: "Body-Centered Cubic (BCC)",
    materialExample: "α-Fe / β-Ti",
    packingFactor: "0.68",
    coordinationNumber: 8,
    accentHex: "#21D4FD",
  },
  {
    id: "FCC",
    name: "Face-Centered Cubic (FCC)",
    materialExample: "Al / Cu / γ-Fe",
    packingFactor: "0.74",
    coordinationNumber: 12,
    accentHex: "#AF52DE",
  },
  {
    id: "HCP",
    name: "Hexagonal Close-Packed (HCP)",
    materialExample: "α-Ti / Mg / Zn",
    packingFactor: "0.74",
    coordinationNumber: 12,
    accentHex: "#F59E0B",
  },
];

export function getLatticeSpec(latticeType: LatticeSystem): LatticeSpec {
  return LATTICE_SPECS.find((s) => s.id === latticeType) ?? LATTICE_SPECS[0];
}

function buildCubeEdges(s: number): BondEdge[] {
  const c: [number, number, number][] = [
    [-s, -s, -s],
    [s, -s, -s],
    [s, s, -s],
    [-s, s, -s],
    [-s, -s, s],
    [s, -s, s],
    [s, s, s],
    [-s, s, s],
  ];
  const pairs: [number, number][] = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 0],
    [4, 5],
    [5, 6],
    [6, 7],
    [7, 4],
    [0, 4],
    [1, 5],
    [2, 6],
    [3, 7],
  ];
  return pairs.map(([a, b]) => ({
    start: c[a],
    end: c[b],
    kind: "cell",
  }));
}

export function getLatticeGeometry(latticeType: LatticeSystem): LatticeGeometryData {
  const s = 0.85;

  if (latticeType === "FCC") {
    const corners: [number, number, number][] = [];
    for (const x of [-s, s]) {
      for (const y of [-s, s]) {
        for (const z of [-s, s]) {
          corners.push([x, y, z]);
        }
      }
    }

    const faces: [number, number, number][] = [
      [s, 0, 0],
      [-s, 0, 0],
      [0, s, 0],
      [0, -s, 0],
      [0, 0, s],
      [0, 0, -s],
    ];

    const atoms: AtomNode[] = [
      ...corners.map((position): AtomNode => ({ position, role: "host" })),
      ...faces.map((position): AtomNode => ({ position, role: "solute" })),
    ];

    const bondEdges: BondEdge[] = [];
    for (const face of faces) {
      for (const corner of corners) {
        const sharesFaceAxis =
          (face[0] !== 0 && face[0] === corner[0]) ||
          (face[1] !== 0 && face[1] === corner[1]) ||
          (face[2] !== 0 && face[2] === corner[2]);
        if (sharesFaceAxis) {
          bondEdges.push({ start: face, end: corner, kind: "bond" });
        }
      }
    }

    return {
      atoms,
      edges: [...buildCubeEdges(s), ...bondEdges],
    };
  }

  if (latticeType === "HCP") {
    // HCP: Top & bottom hexagonal basal planes + 3 AB-stacking mid-plane atoms
    const r = 0.95;
    const rm = 0.55;
    const h = 0.85;

    const topRing: [number, number, number][] = [];
    const bottomRing: [number, number, number][] = [];
    for (let k = 0; k < 6; k++) {
      const angle = (k * Math.PI) / 3;
      const x = Number((r * Math.cos(angle)).toFixed(4));
      const z = Number((r * Math.sin(angle)).toFixed(4));
      topRing.push([x, h, z]);
      bottomRing.push([x, -h, z]);
    }

    const topCenter: [number, number, number] = [0, h, 0];
    const bottomCenter: [number, number, number] = [0, -h, 0];

    const midAngles = [Math.PI / 6, (5 * Math.PI) / 6, (3 * Math.PI) / 2];
    const midAtoms: [number, number, number][] = midAngles.map((angle) => [
      Number((rm * Math.cos(angle)).toFixed(4)),
      0,
      Number((rm * Math.sin(angle)).toFixed(4)),
    ]);

    const atoms: AtomNode[] = [
      ...topRing.map((position): AtomNode => ({ position, role: "host" })),
      { position: topCenter, role: "host" },
      ...bottomRing.map((position): AtomNode => ({ position, role: "host" })),
      { position: bottomCenter, role: "host" },
      ...midAtoms.map((position): AtomNode => ({ position, role: "solute" })),
    ];

    const edges: BondEdge[] = [];
    for (let k = 0; k < 6; k++) {
      const next = (k + 1) % 6;
      edges.push({ start: topRing[k], end: topRing[next], kind: "cell" });
      edges.push({ start: bottomRing[k], end: bottomRing[next], kind: "cell" });
      edges.push({ start: topRing[k], end: bottomRing[k], kind: "cell" });
      edges.push({ start: topCenter, end: topRing[k], kind: "bond" });
      edges.push({ start: bottomCenter, end: bottomRing[k], kind: "bond" });
    }

    midAtoms.forEach((mid, idx) => {
      const v1 = idx * 2;
      const v2 = (idx * 2 + 1) % 6;
      edges.push({ start: mid, end: topCenter, kind: "bond" });
      edges.push({ start: mid, end: bottomCenter, kind: "bond" });
      edges.push({ start: mid, end: topRing[v1], kind: "bond" });
      edges.push({ start: mid, end: topRing[v2], kind: "bond" });
      edges.push({ start: mid, end: bottomRing[v1], kind: "bond" });
      edges.push({ start: mid, end: bottomRing[v2], kind: "bond" });
    });

    return { atoms, edges };
  }

  // Default / BCC (consistent with getLatticeSpec fallback to BCC)
  const corners: [number, number, number][] = [];
  for (const x of [-s, s]) {
    for (const y of [-s, s]) {
      for (const z of [-s, s]) {
        corners.push([x, y, z]);
      }
    }
  }

  const atoms: AtomNode[] = [
    ...corners.map((position): AtomNode => ({ position, role: "host" })),
    { position: [0, 0, 0], role: "solute" },
  ];

  const edges: BondEdge[] = [
    ...buildCubeEdges(s),
    ...corners.map((corner): BondEdge => ({
      start: [0, 0, 0],
      end: corner,
      kind: "bond",
    })),
  ];

  return { atoms, edges };
}

export const RESEARCH_PROJECTS: ResearchProject[] = [
  {
    id: "alloy-metallurgy",
    code: "MAT-01",
    title: "Alloy Design & Physical Metallurgy",
    domain: "Physical Metallurgy",
    summary:
      "Multi-component metallic alloy formulation, phase-diagram evaluation, solidification, and controlled heat-treatment routes.",
    metrics: [
      { label: "Focus", value: "Phase Stability" },
      { label: "Process", value: "Heat Treatment" },
    ],
    accent: "cyan",
  },
  {
    id: "matrix-composites",
    code: "MAT-02",
    title: "Metal & Polymer Matrix Composites",
    domain: "Composite Matrices",
    summary:
      "Particle- and fiber-reinforced matrix systems engineered for specific stiffness, interfacial bonding, and thermal resistance.",
    metrics: [
      { label: "Focus", value: "Interface Bonding" },
      { label: "Scope", value: "Matrix Laminates" },
    ],
    accent: "violet",
  },
  {
    id: "powder-ceramics",
    code: "MAT-03",
    title: "Powder Metallurgy & Ceramics",
    domain: "Particulate Processing",
    summary:
      "Metallic and ceramic fabrication through particulate blending, uniaxial compaction, and controlled-atmosphere sintering.",
    metrics: [
      { label: "Focus", value: "Densification" },
      { label: "Process", value: "Sintering Cycles" },
    ],
    accent: "amber",
  },
  {
    id: "characterization-analysis",
    code: "MAT-04",
    title: "Characterization & Phase Analysis",
    domain: "Microscopy & Testing",
    summary:
      "Structure-property correlation via optical metallography, electron microscopy, X-ray diffraction, and mechanical testing.",
    metrics: [
      { label: "Methods", value: "SEM / XRD" },
      { label: "Scope", value: "Tribology & Wear" },
    ],
    accent: "cyan",
  },
];

export const SUBTEAMS: SubteamDivision[] = [
  {
    id: "alloy-design",
    name: "Alloy Design & Physical Metallurgy",
    focus: "Thermodynamics & Casting",
    description:
      "Phase-equilibrium modeling, melting and casting workflows, and heat-treatment optimization.",
    colSpan: "md:col-span-2",
  },
  {
    id: "composites",
    name: "Composites & Polymer Matrices",
    focus: "Matrix Formulation",
    description:
      "Matrix-reinforcement selection, composite processing, and thermal-structural characterization.",
  },
  {
    id: "powder-ceramics",
    name: "Powder Metallurgy & Ceramics",
    focus: "Particulate Synthesis",
    description:
      "Powder preparation, compaction tooling, sintering kinetics, and technical ceramic systems.",
  },
  {
    id: "characterization",
    name: "Characterization & Phase Analysis",
    focus: "Microscopy & XRD",
    description:
      "Metallographic sample preparation, electron microscopy, phase identification, and hardness evaluation.",
  },
  {
    id: "operations",
    name: "Academic Coordination & Outreach",
    focus: "Lab & Industry Links",
    description:
      "Departmental laboratory coordination, material supply logistics, and academic-industry outreach.",
  },
];

export const HERITAGE_MILESTONES: HeritageMilestone[] = [
  {
    id: "itu-1773",
    year: "1773",
    title: "Foundation of Istanbul Technical University",
    context: "Institutional Heritage",
    outcome:
      "Over two and a half centuries of engineering education anchored at the Ayazağa Campus in Maslak, Istanbul.",
  },
  {
    id: "chair-1961",
    year: "1961–1962",
    title: "First Metallurgy Engineering Education in Turkey",
    context: "İTÜ Mining Faculty",
    outcome:
      "Pioneered formal metallurgy engineering instruction in Turkey, graduating its first cohort in 1963–1964.",
  },
  {
    id: "faculty-1982",
    year: "1982",
    title: "Faculty of Chemical and Metallurgical Engineering",
    context: "Kimya-Metalurji Fakültesi",
    outcome:
      "Consolidated Turkey's first Metallurgy Faculty (1977) and Chemical Engineering into an interdisciplinary faculty.",
  },
  {
    id: "dept-1998",
    year: "1998",
    title: "Department of Metallurgical and Materials Engineering",
    context: "Ayazağa Campus Laboratories",
    outcome:
      "Expanded research and teaching across physical metallurgy, particulate processing, ceramics, composites, and microscopy.",
  },
];

export const LAB_FOCUS_AREAS: LabFocusArea[] = [
  { id: "phys-met", name: "Physical Metallurgy & Heat Treatment", scope: "Alloys & Casting" },
  { id: "particulate", name: "Particulate Materials & Sintering", scope: "Powder & Ceramics" },
  { id: "composites-lab", name: "Composite & Polymer Matrices", scope: "Reinforced Systems" },
  { id: "sem-xrd", name: "Electron Microscopy & XRD", scope: "Phase Characterization" },
];
