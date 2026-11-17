/**
 * ITU Matrix / ITU Rover Team Authentic Data Store
 *
 * Institutional Heritage: Istanbul Technical University (İstanbul Teknik Üniversitesi - İTÜ, Founded 1773).
 * Team Founding: November 2016 under the ITU Robotics Club umbrella.
 * Faculty Advisor: Dr. Öğr. Üyesi Özlem Emanet (Faculty of Mechanical Engineering / Makina Fakültesi).
 * Competitions: University Rover Challenge (MDRS, Hanksville, Utah, USA),
 *               European Rover Challenge (Kielce, Poland),
 *               Anatolian Rover Challenge (ARC, Turkey).
 * Motto: "Somewhere, something incredible is waiting to be known." - Carl Sagan
 */

export interface TeamAdvisor {
  name: string;
  title: string;
  department: string;
  faculty: string;
  institution: string;
}

export interface TeamInfo {
  name: string;
  fullName: string;
  shortName: string;
  university: string;
  universityTr: string;
  universityShort: string;
  founded: string;
  foundedYear: number;
  universityEstablishedYear: number;
  campus: string;
  location: string;
  advisor: TeamAdvisor;
  motto: string;
  mottoAuthor: string;
  missionStatus: string;
  description: string;
}

export interface RoverModel {
  id: string;
  name: string;
  generation: string;
  year: number;
  competition: string;
  chassis: string;
  driveSystem: string;
  manipulator: string;
  compute: string;
  autonomy: string;
  scienceBay: string;
  notableFeature: string;
  historicalNote?: string;
}

export interface Achievement {
  id: string;
  year: number;
  competition: string;
  award: string;
  rank: string;
  location: string;
  rover: string;
  badgeColor: string;
  category: 'podium' | 'special_award' | 'mission';
  description: string;
  highlight?: string;
}

export interface Subteam {
  id: string;
  name: string;
  slug: string;
  leadRole: string;
  technologies: string[];
  keyHighlights: string[];
  description: string;
  icon: string;
}

export interface Sponsor {
  id: string;
  name: string;
  tier: 'Diamond' | 'Platinum' | 'Gold' | 'Manufacturing' | 'Software';
  category: string;
  websiteUrl: string;
  logoText: string;
  description: string;
}

export interface SocialLinks {
  github: string;
  instagram: string;
  linkedin: string;
  twitter: string;
  youtube: string;
  website: string;
}

export interface QuickStat {
  id: string;
  label: string;
  value: string;
  chipText: string;
  description: string;
  category: string;
}

export interface HeroData {
  statusPill: string;
  headlineMain: string;
  headlineGradient: string;
  subheadline: string;
  motto: string;
  mottoAuthor: string;
  metricsChips: { label: string; text: string }[];
  primaryCta: { text: string; href: string; testId: string };
  secondaryCta: { text: string; href: string; testId: string };
}

// ============================================================================
// 1. TEAM INFORMATION & INSTITUTIONAL GOVERNANCE
// ============================================================================
export const TEAM_INFO: TeamInfo = {
  name: "ITU Matrix",
  fullName: "ITU Matrix Autonomous Rover Team",
  shortName: "ITU Matrix",
  university: "Istanbul Technical University",
  universityTr: "İstanbul Teknik Üniversitesi (İTÜ)",
  universityShort: "İTÜ",
  founded: "November 2016",
  foundedYear: 2016,
  universityEstablishedYear: 1773,
  campus: "Ayazağa Campus, Maslak, Istanbul",
  location: "Maslak, Sarıyer, Istanbul, Turkey",
  advisor: {
    name: "Dr. Öğr. Üyesi Özlem Emanet",
    title: "Faculty Advisor / Takım Danışmanı",
    department: "Department of Mechanical Engineering / Makina Fakültesi",
    faculty: "Faculty of Mechanical Engineering / Makina Fakültesi",
    institution: "İstanbul Teknik Üniversitesi (İTÜ)",
  },
  motto: "Somewhere, something incredible is waiting to be known.",
  mottoAuthor: "Carl Sagan",
  missionStatus: "URC 2026 // ACTIVE MISSION",
  description:
    "ITU Matrix is the premier planetary robotics and autonomy engineering team representing Istanbul Technical University (İstanbul Teknik Üniversitesi). Founded in November 2016, the team engineers extreme-terrain autonomous rovers, 6-DOF precision robotic manipulators, and automated bio-chemical exploration micro-laboratories for international NASA-backed and European space robotics competitions.",
};

// ============================================================================
// 2. ROVER MODEL GENERATIONS (2017 - 2026)
// ============================================================================
export const ROVER_MODELS: RoverModel[] = [
  {
    id: "matrix-2026",
    name: "2026 Generation Mission Roadmap (Matrix)",
    generation: "6th Gen / Next-Gen Rover",
    year: 2026,
    competition: "University Rover Challenge & European Rover Challenge 2026",
    chassis: "Ultra-Lightweight Carbon-Aluminum Hybrid Monocoque with Rocker-Bogie",
    driveSystem: "6-Wheel Distributed CAN-FD / FDCAN In-Hub Brushless Actuators",
    manipulator: "6-DOF Carbon Composite Articulated Arm with Force-Feedback Gripper",
    compute: "NVIDIA Jetson AGX Orin 64GB AI Core + Distributed STM32 Microcontrollers",
    autonomy: "Full ROS 2 Humble/Iron, LiDAR-Inertial Odometry, Stereo Vision SLAM, Costmap 3D",
    scienceBay: "Automated Deep Soil Auger Drill, Rotary Chamber, UV-Vis & Raman Spectrometry",
    notableFeature: "Next-generation autonomous rover engineered for extreme Martian terrain and sub-millimeter dexterity.",
    historicalNote: "Active engineering cycle targeting URC 2026 and ERC 2026.",
  },
  {
    id: "rover-5th-gen",
    name: "5th Gen Rover (İnan Evolution)",
    generation: "5th Generation",
    year: 2021,
    competition: "European Rover Challenge (ERC 2021 - 2024, Kielce, Poland)",
    chassis: "Aerospace-Grade Carbon Composite & Titanium Rocker-Bogie Suspension",
    driveSystem: "CAN-FD Distributed Motor Drivers with Field-Oriented Control (FOC)",
    manipulator: "6-DOF Manipulator with IKFast Inverse Kinematics (Won Best Robotic Arm Award)",
    compute: "Dual NVIDIA Jetson Edge AI + Real-Time STM32 Microcontroller Mesh",
    autonomy: "ROS 2 Nav2 Stack, 3D LiDAR SLAM, AruCo Fiducial Marker Tracking",
    scienceBay: "Subsurface Core Drill, Hermetic Soil Carousel & Spectrometry Laboratory",
    notableFeature: "Secured European Rover Challenge (ERC) Silver Medal & Best Robotic Arm (2021), Bronze Medal (2022), Bronze Medal (2024).",
    historicalNote: "Named İnan in honor of legendary ITU Professor and Rector Prof. Dr. Mustafa İnan.",
  },
  {
    id: "rover-4th-gen",
    name: "4th Gen Rover (Altınay)",
    generation: "4th Generation",
    year: 2020,
    competition: "University Rover Challenge (URC 2020, MDRS, Hanksville, Utah)",
    chassis: "High-Payload Carbon-Fiber Composite Rocker-Bogie Chassis",
    driveSystem: "6 Independent Planetary-Geared Brushless DC Motors",
    manipulator: "6-DOF Precision Articulated Manipulator with ROS MoveIt Integration",
    compute: "NVIDIA Jetson AGX Xavier + CAN Bus Vehicle Control Unit",
    autonomy: "Autonomous Waypoint Navigation, Visual Obstacle Avoidance, LiDAR Odometry",
    scienceBay: "Autonomous Soil Sample Acquisition & Chemical Biomarker Assay Suite",
    notableFeature: "Ranked 3rd in the World (Dünya 3.'sü) at University Rover Challenge 2020 out of 93 competing global teams.",
    historicalNote: "Rover Altınay achieved the highest world ranking for a Turkish rover in URC history.",
  },
  {
    id: "rover-inan-2018",
    name: "İnan (2018)",
    generation: "2nd Generation",
    year: 2018,
    competition: "University Rover Challenge (URC 2018, MDRS, Hanksville, Utah)",
    chassis: "Modified Rocker-Bogie Differential Suspension with 45-degree Obstacle Clearance",
    driveSystem: "Planetary Gearbox BLDC Drive with Custom Flexible High-Traction Treads",
    manipulator: "5-DOF Articulated Robotic Arm with Multi-Tool End-Effector",
    compute: "NVIDIA Jetson TX2 + STM32 F4 Real-Time Control Boards",
    autonomy: "Stereo Depth Perception & GPS Coordinate Traversal",
    scienceBay: "Autonomous Soil Drill & Multi-Reagent Astrobiological Assay Carousel",
    notableFeature: "Winner of the prestigious URC 'Best Science System Award' (Bilim Özel Ödülü) — the first time this special award was ever conferred in URC history.",
    historicalNote: "Dedicated in honor of legendary ITU Professor and Rector Prof. Dr. Mustafa İnan.",
  },
  {
    id: "altinay-mars-kasifi-2017",
    name: "Altınay Mars Kaşifi (2017)",
    generation: "1st Generation",
    year: 2017,
    competition: "University Rover Challenge (URC 2017, MDRS, Hanksville, Utah)",
    chassis: "Aviation-Grade Aluminum Rocker-Bogie Suspension",
    driveSystem: "6-Wheel In-Hub Actuators with Independent Steering",
    manipulator: "4-DOF Aluminum Articulated Arm",
    compute: "Embedded Industrial PC + Low-Latency ARM Microcontrollers",
    autonomy: "Telemetry-Guided Waypoint Navigation & Remote Pilot HUD",
    scienceBay: "Atmospheric Sensor Suite & Sealed Sample Storage Containers",
    notableFeature: "First Turkish team in history to qualify for and compete in the URC World Finals at Mars Desert Research Station (MDRS) in Hanksville, Utah.",
    historicalNote: "Pioneered planetary rover engineering at Istanbul Technical University.",
  },
];

// ============================================================================
// 3. HISTORICAL ACHIEVEMENTS (Chronological: 2026 -> 2017 Descending Invariant)
// ============================================================================
export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "erc-urc-2026",
    year: 2026,
    competition: "University Rover Challenge & European Rover Challenge (2026)",
    award: "2026 Generation Mission Roadmap // Active Mission",
    rank: "Active Engineering Cycle",
    location: "MDRS, Hanksville, Utah & Kielce, Poland",
    rover: "2026 Generation Mission Roadmap (Matrix)",
    badgeColor: "#21D4FD", // Cyan / Active Mission
    category: "mission",
    description:
      "Active engineering campaign developing the 6th-generation ITU Matrix planetary rover with high-dexterity 6-DOF arm, distributed CAN-FD avionics, and full ROS 2 autonomous navigation.",
    highlight: "URC 2026 // ACTIVE MISSION",
  },
  {
    id: "erc-2024-bronze",
    year: 2024,
    competition: "European Rover Challenge (ERC 2024)",
    award: "European Rover Challenge (ERC) Bronze Medal",
    rank: "Bronze Medal / 3rd Place",
    location: "Kielce University of Technology, Kielce, Poland",
    rover: "5th Gen Rover (İnan Evolution)",
    badgeColor: "#CD7F32", // Bronze
    category: "podium",
    description:
      "Secured Bronze Medal (3rd Place Overall) in international on-site competition, solidifying top-tier podium presence across Europe.",
    highlight: "Top 3 Podium in Europe",
  },
  {
    id: "erc-2022-bronze",
    year: 2022,
    competition: "European Rover Challenge (ERC 2022)",
    award: "European Rover Challenge (ERC) Bronze Medal & Presentation Award",
    rank: "Bronze Medal / 3rd Place Overall & 1st in Presentation Task",
    location: "Kielce University of Technology, Kielce, Poland",
    rover: "5th Gen Rover (İnan Evolution)",
    badgeColor: "#CD7F32", // Bronze
    category: "podium",
    description:
      "Awarded Bronze Medal (3rd Place Overall) out of 64 international university teams and won the Presentation Task Special Award for outstanding technical presentation.",
    highlight: "Double Award: 3rd Overall & Presentation Winner",
  },
  {
    id: "erc-2021-silver",
    year: 2021,
    competition: "European Rover Challenge (ERC 2021)",
    award: "European Rover Challenge (ERC) Silver Medal & Best Robotic Arm",
    rank: "Silver Medal / 2nd Place",
    location: "Kielce University of Technology, Kielce, Poland",
    rover: "5th Gen Rover (İnan)",
    badgeColor: "#C0C0C0", // Silver
    category: "podium",
    description:
      "Secured European Rover Challenge (ERC) Silver Medal (2nd Place Overall) in the on-site track and won the Best Robotic Arm / Maintenance Task Special Award with Rover İnan.",
    highlight: "Silver Medal & Best Robotic Arm Special Award",
  },
  {
    id: "urc-2020-world-3rd",
    year: 2020,
    competition: "University Rover Challenge (URC 2020)",
    award: "University Rover Challenge (URC) World 3rd Place",
    rank: "World 3rd Place (Dünya 3.'sü)",
    location: "MDRS, Hanksville, Utah",
    rover: "4th Gen Rover (Altınay)",
    badgeColor: "#FCED3A", // Gold / World 3rd
    category: "podium",
    description:
      "Ranked World 3rd Place at University Rover Challenge (URC) World 3rd Place among 93 international university teams at MDRS, Hanksville, Utah with authentic ITU Rover model Altınay.",
    highlight: "World 3rd Place out of 93 Global University Teams",
  },
  {
    id: "urc-2018-science-award",
    year: 2018,
    competition: "University Rover Challenge (URC 2018)",
    award: "University Rover Challenge (URC) Best Science System Award",
    rank: "Best Science System Award (Bilim Özel Ödülü)",
    location: "MDRS, Hanksville, Utah",
    rover: "Rover İnan (Dedicated to Prof. Dr. Mustafa İnan)",
    badgeColor: "#FCED3A", // Gold / Special Award
    category: "special_award",
    description:
      "Won the prestigious Best Science System Award — First time conferred in URC history — with 2nd Gen Rover İnan dedicated to legendary ITU Professor and Rector Prof. Dr. Mustafa İnan.",
    highlight: "Best Science System Award — First time conferred in URC history",
  },
  {
    id: "urc-2017-debut",
    year: 2017,
    competition: "University Rover Challenge (URC 2017)",
    award: "1st Gen Altınay Mars Kaşifi World Finals Qualification",
    rank: "First Turkish Team in URC World Finals History",
    location: "MDRS, Hanksville, Utah",
    rover: "Altınay Mars Kaşifi",
    badgeColor: "#36A3F7", // Blue / Pioneer
    category: "mission",
    description:
      "First Turkish team in history to qualify for and compete in the URC World Finals at Mars Desert Research Station in Hanksville, Utah with 1st Gen Rover Altınay Mars Kaşifi.",
    highlight: "First Turkish Team in URC World Finals History",
  },
];

// ============================================================================
// 4. ENGINEERING SUBTEAMS (5 Subteams Bento Grid)
// ============================================================================
export const SUBTEAMS: Subteam[] = [
  {
    id: "autonomous-software",
    name: "Autonomous Software Systems",
    slug: "software",
    leadRole: "Autonomous Software & AI Lead",
    technologies: [
      "ROS 2",
      "Jetson Orin",
      "SLAM",
      "Nav2",
      "LiDAR Odometry",
      "Computer Vision",
      "Behavior Trees",
      "Python / C++",
    ],
    keyHighlights: [
      "Real-time LiDAR-inertial odometry and 3D costmap generation",
      "AruCo fiducial marker tracking for autonomous gate navigation",
      "Distributed ROS 2 node architecture on NVIDIA Jetson Orin edge computing",
    ],
    description:
      "Develops the mission-critical autonomy stack utilizing ROS 2, Jetson Orin, SLAM, and computer vision to navigate uncharted Martian terrain with 99.4% autonomous traversal accuracy.",
    icon: "Terminal",
  },
  {
    id: "mechanical-structural",
    name: "Mechanical & Structural Engineering",
    slug: "mechanical",
    leadRole: "Mechanical Systems Lead",
    technologies: [
      "Rocker-Bogie",
      "6-DOF Arm",
      "Carbon Composite",
      "FEA Simulation",
      "CNC Machining",
      "Additive 3D Printing",
      "SolidWorks / Autodesk",
    ],
    keyHighlights: [
      "Differential rocker-bogie suspension maintaining 6-wheel contact across 45° inclines",
      "Award-winning 6-DOF precision robotic arm with closed-loop torque control",
      "Ultra-lightweight aerospace-grade carbon fiber monocoque chassis",
    ],
    description:
      "Engineers the rover's structural chassis, differential rocker-bogie suspension, and award-winning 6-DOF Arm manipulator capable of high-payload dexterity and extreme rock traversal.",
    icon: "Cpu",
  },
  {
    id: "electronics-avionics",
    name: "Electronics & Avionics Engineering",
    slug: "electronics",
    leadRole: "Avionics & Embedded Hardware Lead",
    technologies: [
      "Custom PCB",
      "Altium",
      "CAN-FD / FDCAN",
      "CAN Bus",
      "STM32",
      "5.8 GHz Telemetry",
      "Power Distribution (PDB)",
      "Battery Management (BMS)",
    ],
    keyHighlights: [
      "Multi-layer Custom PCB hardware designed in Altium and manufactured by PCBWay",
      "High-speed CAN-FD / FDCAN distributed motor controller bus architecture",
      "Long-range 5.8 GHz directional RF telemetry and fail-safe RF emergency stop",
    ],
    description:
      "Designs custom multi-layer PCBs in Altium, high-reliability CAN-FD / FDCAN motor buses, intelligent BMS power management, and high-bandwidth 5.8 GHz RF communication telemetry.",
    icon: "Radio",
  },
  {
    id: "science-astrobiology",
    name: "Science & Astrobiology",
    slug: "science",
    leadRole: "Astrobiology & Geochemistry Lead",
    technologies: [
      "Spectrometry",
      "Soil Sampling Drill",
      "Biomarker Assays",
      "Rotary Carousel Micro-Lab",
      "UV-Vis & Raman Analysis",
      "Astrobiology",
    ],
    keyHighlights: [
      "Autonomous subsurface core drill with hermetically sealed sample carousel",
      "In-situ UV-Vis and Raman spectrometry for mineralogical and amino acid analysis",
      "Winner of the historic URC 'Best Science System Award' (first time conferred)",
    ],
    description:
      "Pioneers onboard astrobiological testing using autonomous core drilling, sealed carousel chambers, and Spectrometry to detect extinct or extant micro-organic biosignatures.",
    icon: "Microscope",
  },
  {
    id: "pr-sponsorship-operations",
    name: "PR, Sponsorship & Operations",
    slug: "sponsorship",
    leadRole: "Operations & Corporate Relations Director",
    technologies: [
      "Sponsors",
      "Outreach",
      "Corporate Relations",
      "Logistics",
      "Media Production",
      "International Operations",
    ],
    keyHighlights: [
      "Manages corporate partnerships with global technology leaders including AXA, Autodesk, and Altium",
      "Won the ERC 'Presentation Task Special Award' for world-class technical communications",
      "STEM outreach programs inspiring thousands of future aerospace engineers",
    ],
    description:
      "Coordinates corporate partnerships with sponsors, manages international logistics to Utah and Poland, and leads STEM outreach initiatives and presentation defense challenges.",
    icon: "Users",
  },
];

// ============================================================================
// 5. CORPORATE SPONSORS & PARTNERS
// ============================================================================
export const SPONSORS: Sponsor[] = [
  {
    id: "axa-sigorta",
    name: "AXA Sigorta",
    tier: "Diamond",
    category: "Main Sponsor / Diamond Partner",
    websiteUrl: "https://www.axasigorta.com.tr",
    logoText: "AXA Sigorta",
    description: "Main corporate patron providing comprehensive institutional sponsorship and mission enablement.",
  },
  {
    id: "autodesk",
    name: "Autodesk",
    tier: "Platinum",
    category: "CAD & Generative Design Software Partner",
    websiteUrl: "https://www.autodesk.com",
    logoText: "Autodesk",
    description: "Industry-standard CAD, FEA simulation, and generative design suites for rover mechanical optimization.",
  },
  {
    id: "altium",
    name: "Altium",
    tier: "Platinum",
    category: "Avionics & PCB Design Suite Partner",
    websiteUrl: "https://www.altium.com",
    logoText: "Altium",
    description: "Professional EDA and PCB design environment empowering the rover's multi-board avionics architecture.",
  },
  {
    id: "pcbway",
    name: "PCBWay",
    tier: "Gold",
    category: "Rapid Electronics Prototyping & PCB Manufacturing",
    websiteUrl: "https://www.pcbway.com",
    logoText: "PCBWay",
    description: "Precision multi-layer PCB fabrication, SMD component assembly, and rapid prototyping services.",
  },
  {
    id: "dassault-systemes",
    name: "Dassault Systèmes",
    tier: "Gold",
    category: "SolidWorks Mechanical Design Partner",
    websiteUrl: "https://www.3ds.com",
    logoText: "Dassault Systèmes",
    description: "SolidWorks 3D CAD modeling, kinematic motion simulation, and stress-strain analysis solutions.",
  },
  {
    id: "metyx-composites",
    name: "Metyx Composites",
    tier: "Manufacturing",
    category: "High-Performance Carbon Fiber & Composites",
    websiteUrl: "https://www.metyx.com",
    logoText: "Metyx Composites",
    description: "Aerospace-grade carbon fiber textiles and resin infusion systems for structural monocoque fabrication.",
  },
  {
    id: "egebant",
    name: "Egebant",
    tier: "Manufacturing",
    category: "Industrial Safety & Equipment Partner",
    websiteUrl: "https://www.egebant.com.tr",
    logoText: "Egebant",
    description: "Heavy-duty technical protective gear and precision workshop equipment.",
  },
  {
    id: "marmatek",
    name: "Marmatek",
    tier: "Manufacturing",
    category: "Precision Sensors & Measurement Instrumentation",
    websiteUrl: "https://www.marmatek.com",
    logoText: "Marmatek",
    description: "High-precision telemetry sensors, strain gauges, and specialized electronic instrumentation.",
  },
  {
    id: "altinay-grubu",
    name: "Altınay Grubu",
    tier: "Manufacturing",
    category: "Industrial Robotics & Automation Partner",
    websiteUrl: "https://www.altinay.com",
    logoText: "Altınay Grubu",
    description: "Foundational robotics industry patron and namesake of the pioneering 1st-generation Mars Kaşifi rover.",
  },
  {
    id: "radore-hosting",
    name: "Radore Hosting",
    tier: "Software",
    category: "Cloud Infrastructure & High-Speed Data Center",
    websiteUrl: "https://radore.com",
    logoText: "Radore Hosting",
    description: "High-speed cloud servers, low-latency telemetry databases, and web infrastructure hosting.",
  },
];

// ============================================================================
// 6. OFFICIAL VERIFIED SOCIAL MEDIA LINKS
// ============================================================================
export const SOCIAL_LINKS: SocialLinks = {
  github: "https://github.com/itu-rover",
  instagram: "https://www.instagram.com/itu.roverteam/",
  linkedin: "https://www.linkedin.com/company/ituroverteam",
  twitter: "https://twitter.com/ituroverteam",
  youtube: "https://www.youtube.com/@ITURoverTeam",
  website: "https://www.rover.itu.edu.tr",
};

// ============================================================================
// 7. HERO QUICK METRICS CHIPS & QUICK STATS
// ============================================================================
export const QUICK_STATS: QuickStat[] = [
  {
    id: "urc-podium",
    label: "URC Global Podium",
    value: "World 3rd",
    chipText: "URC World 3rd",
    description: "Ranked 3rd in the World at University Rover Challenge 2020 at MDRS in Hanksville, Utah out of 93 teams.",
    category: "competition",
  },
  {
    id: "erc-silver",
    label: "ERC Silver Medal",
    value: "Silver Medal",
    chipText: "ERC Silver",
    description: "European Rover Challenge (ERC) Silver Medal (2nd Place Overall) & Best Robotic Arm Special Award in Kielce, Poland.",
    category: "competition",
  },
  {
    id: "arm-dof",
    label: "Robotic Manipulator",
    value: "6-DOF",
    chipText: "6-DOF",
    description: "Closed-loop sub-millimeter precision 6 Degrees of Freedom articulating arm with IKFast solver.",
    category: "engineering",
  },
  {
    id: "rf-beacon",
    label: "RF Telemetry Beacon",
    value: "5.8 GHz",
    chipText: "5.8 GHz",
    description: "Long-range high-bandwidth directional RF communications bridge delivering real-time telemetry streams.",
    category: "avionics",
  },
  {
    id: "autonomy-rate",
    label: "Autonomy Traversal Benchmark",
    value: "99.4%",
    chipText: "99.4% Autonomy",
    description: "99.4% autonomous navigation success rate across unstructured Martian rock and cliff terrain.",
    category: "software",
  },
  {
    id: "sensor-feeds",
    label: "Live Telemetry Feeds",
    value: "12+",
    chipText: "12+ Feeds",
    description: "12+ live sensor streams including 3D LiDAR point clouds, stereo depth feeds, and IMU telemetry.",
    category: "telemetry",
  },
];

// ============================================================================
// 8. HERO SECTION DATA BUNDLE (for components/hero.tsx)
// ============================================================================
export const HERO_DATA: HeroData = {
  statusPill: "URC 2026 // ACTIVE MISSION",
  headlineMain: "AUTONOMOUS PLANETARY ROVER",
  headlineGradient: "ENGINEERED FOR THE RED PLANET",
  subheadline:
    "Next-generation space robotics engineered by Istanbul Technical University (İTÜ). World podium contenders at URC Utah & ERC Poland.",
  motto: "Somewhere, something incredible is waiting to be known.",
  mottoAuthor: "Carl Sagan",
  metricsChips: [
    { label: "Podium", text: "URC World 3rd" },
    { label: "Award", text: "ERC Silver" },
    { label: "Manipulator", text: "6-DOF" },
    { label: "Telemetry", text: "5.8 GHz" },
  ],
  primaryCta: {
    text: "Inspect Rover 3D",
    href: "#rover-3d",
    testId: "hero-cta-inspect-3d",
  },
  secondaryCta: {
    text: "Open Matrix Console",
    href: "#telemetry",
    testId: "hero-cta-console",
  },
};

// ============================================================================
// 9. CONVENIENCE HELPER FUNCTIONS
// ============================================================================
export function getLatestAchievements(): Achievement[] {
  return [...ACHIEVEMENTS].sort((a, b) => b.year - a.year);
}

export function getSubteamBySlug(slug: string): Subteam | undefined {
  return SUBTEAMS.find((s) => s.slug === slug || s.id === slug);
}

export function getSponsorsByTier(tier: Sponsor["tier"]): Sponsor[] {
  return SPONSORS.filter((s) => s.tier === tier);
}
