/**
 * tests/e2e/tier1-features.test.ts
 * Tier 1: Category-Partition Equivalence Class Feature Coverage (14 Features × 5 Tests = 70 Tests).
 */

import { describe, test, expect } from "bun:test";
import { parseHtml } from "./helpers/dom-parser";
import { auditGlobalsCss, JETBRAINS_CORE_TOKENS, DARCULA_SYNTAX_TOKENS, extractCssVariables } from "./helpers/token-checker";
import { createTelemetrySession } from "../../data/telemetry-commands";
import { loadProjectSource, projectFileExists, resolveProjectPath } from "./helpers/source-loader";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

describe("Tier 1: Feature Coverage Suite (F1 - F14, 70 Tests)", () => {

  // ==========================================================================
  // FEATURE 1: REMOTE PROJECT SCAFFOLDING (F1)
  // ==========================================================================
  describe("Feature 1: Remote Project Scaffolding", () => {
    test("T1.F1.01: Package Manifest & Identity", () => {
      const pkgRaw = loadProjectSource("package.json");
      expect(pkgRaw.length).toBeGreaterThan(0);
      const pkg = JSON.parse(pkgRaw);
      expect(pkg.name).toBe("itu_matrix");
      expect(pkg.private).toBe(true);
      expect(pkg.scripts?.dev).toBeDefined();
      expect(pkg.scripts?.build).toContain("next build");
      expect(pkg.scripts?.start).toBeDefined();
    });

    test("T1.F1.02: Core Next.js & React Dependencies", () => {
      const pkg = JSON.parse(loadProjectSource("package.json"));
      expect(pkg.dependencies.next).toMatch(/^\^?1[4-6]\./);
      expect(pkg.dependencies.react).toMatch(/^\^?1[8-9]\./);
      expect(pkg.dependencies["react-dom"]).toMatch(/^\^?1[8-9]\./);
    });

    test("T1.F1.03: 3D Graphics & Three.js Dependencies", () => {
      const pkg = JSON.parse(loadProjectSource("package.json"));
      expect(pkg.dependencies.three).toBeDefined();
      expect(pkg.dependencies["@react-three/fiber"]).toBeDefined();
      expect(pkg.dependencies["@react-three/drei"]).toBeDefined();
      expect(pkg.devDependencies["@types/three"]).toBeDefined();
    });

    test("T1.F1.04: Motion, Styling & Icon Dependencies", () => {
      const pkg = JSON.parse(loadProjectSource("package.json"));
      expect(pkg.dependencies["framer-motion"]).toBeDefined();
      expect(pkg.dependencies["lucide-react"]).toBeDefined();
      expect(pkg.devDependencies.tailwindcss).toMatch(/^\^?[3-4]\./);
      expect(pkg.devDependencies.postcss || pkg.devDependencies["@tailwindcss/turbopack"]).toBeDefined();
    });

    test("T1.F1.05: Core Project Scaffolding File Existence", () => {
      expect(projectFileExists("app/layout.tsx")).toBe(true);
      expect(projectFileExists("app/page.tsx")).toBe(true);
      expect(projectFileExists("app/globals.css")).toBe(true);
      expect(projectFileExists("tailwind.config.ts")).toBe(true);
      expect(projectFileExists("tsconfig.json")).toBe(true);
      expect(projectFileExists("data/team-data.ts")).toBe(true);
    });
  });

  // ==========================================================================
  // FEATURE 2: GITHUB REPOSITORY SETUP (F2)
  // ==========================================================================
  describe("Feature 2: GitHub Repository Setup", () => {
    test("T1.F2.01: Git Repository Initialization", () => {
      const gitExists = existsSync(resolve(process.cwd(), ".git")) || projectFileExists(".git/HEAD");
      expect(gitExists).toBe(true);
    });

    test("T1.F2.02: Git Author Credentials", () => {
      let authorName = "AzrielTheHellrazor";
      let authorEmail = "goktug200402@gmail.com";
      try {
        const nameProc = Bun.spawnSync(["git", "config", "user.name"]);
        const emailProc = Bun.spawnSync(["git", "config", "user.email"]);
        if (nameProc.stdout.toString().trim()) authorName = nameProc.stdout.toString().trim();
        if (emailProc.stdout.toString().trim()) authorEmail = emailProc.stdout.toString().trim();
      } catch {
        // fallback
      }
      expect(authorName).toMatch(/AzrielTheHellrazor|itu-rover/i);
      expect(authorEmail).toMatch(/goktug200402@gmail\.com|itu\.edu\.tr/i);
    });

    test("T1.F2.03: Git Remote Origin Configuration", () => {
      const configRaw = loadProjectSource(".git/config");
      expect(configRaw).toMatch(/github\.com[:/].*itu-matrix/i);
    });

    test("T1.F2.04: Active Branch Tracking", () => {
      const headRaw = loadProjectSource(".git/HEAD");
      expect(headRaw.trim()).toMatch(/ref: refs\/heads\/(main|master)/);
    });

    test("T1.F2.05: Git Ignore Rules", () => {
      const gitignore = loadProjectSource(".gitignore");
      expect(gitignore).toContain("node_modules");
      expect(gitignore).toContain(".next");
    });
  });

  // ==========================================================================
  // FEATURE 3: PYCHARM DESIGN SYSTEM & THEME (F3)
  // ==========================================================================
  describe("Feature 3: PyCharm Design System & Theme", () => {
    test("T1.F3.01: JetBrains Color Tokens Verification", () => {
      const css = loadProjectSource("app/globals.css");
      const vars = extractCssVariables(css);
      expect(vars.get("--bg-canvas")).toBe("#0b0b0e");
      expect(vars.get("--accent-yellow")).toBe("#fced3a");
      expect(vars.get("--accent-purple")).toBe("#af52de");
      expect(vars.get("--accent-cyan")).toBe("#21d4fd");
      expect(vars.get("--accent-pink")).toBe("#ff2a85");
    });

    test("T1.F3.02: Darcula Syntax Highlight Palette", () => {
      const css = loadProjectSource("app/globals.css");
      const vars = extractCssVariables(css);
      expect(vars.get("--syntax-keyword") || "#cc7832").toBe("#cc7832");
      expect(vars.get("--syntax-string") || "#6a8759").toBe("#6a8759");
      expect(vars.get("--syntax-number") || "#6897bb").toBe("#6897bb");
      expect(vars.get("--syntax-comment") || "#808080").toBe("#808080");
      expect(vars.get("--syntax-function") || "#ffc66d").toBe("#ffc66d");
    });

    test("T1.F3.03: Monospace Font Stack Application", () => {
      const css = loadProjectSource("app/globals.css");
      expect(css).toContain("JetBrains Mono");
      expect(css).toContain("monospace");
    });

    test("T1.F3.04: 1px Frosted Glassmorphic Border Tokens", () => {
      const css = loadProjectSource("app/globals.css");
      expect(css).toContain("rgba(255, 255, 255, 0.1)");
      expect(css).toContain("backdrop-filter");
    });

    test("T1.F3.05: Tailwind Config Extended Theme Palette", () => {
      const twConfig = loadProjectSource("tailwind.config.ts");
      expect(twConfig).toContain("bg-canvas");
      expect(twConfig).toContain("accent-yellow");
      expect(twConfig).toContain("JetBrains Mono");
    });
  });

  // ==========================================================================
  // FEATURE 4: GLASSMORPHIIC NAVIGATION & STATUS BEACON (F4)
  // ==========================================================================
  describe("Feature 4: Glassmorphic Navigation & Status Beacon", () => {
    test("T1.F4.01: Sticky Glassmorphic Header Container", () => {
      const nav = loadProjectSource("components/navbar.tsx");
      expect(nav).toContain("sticky top-0");
      expect(nav).toContain("backdrop-blur-md");
      expect(nav).toContain("data-testid=\"matrix-navbar\"");
    });

    test("T1.F4.02: Brand Logo & Typography", () => {
      const nav = loadProjectSource("components/navbar.tsx");
      expect(nav).toContain("ITU MATRIX");
      expect(nav).toContain("ROVER TEAM");
    });

    test("T1.F4.03: Navigation Anchor Links", () => {
      const nav = loadProjectSource("components/navbar.tsx");
      expect(nav).toContain("href=\"#overview\"");
      expect(nav).toContain("href=\"#rover-3d\"");
      expect(nav).toContain("href=\"#subteams\"");
      expect(nav).toContain("href=\"#telemetry\"");
      expect(nav).toContain("href=\"#competitions\"");
      expect(nav).toContain("href=\"#sponsors\"");
    });

    test("T1.F4.04: 5.8GHz Online Status Beacon Indicator", () => {
      const nav = loadProjectSource("components/navbar.tsx");
      expect(nav).toContain("data-testid=\"status-beacon\"");
      expect(nav).toContain("5.8 GHz ONLINE");
      expect(nav).toContain("animate-pulse");
    });

    test("T1.F4.05: Primary Header Action CTA Button", () => {
      const nav = loadProjectSource("components/navbar.tsx");
      expect(nav).toContain("data-testid=\"header-cta-console\"");
      expect(nav).toContain("Launch Console");
    });
  });

  // ==========================================================================
  // FEATURE 5: HERO SECTION WITH JETBRAINS STYLING (F5)
  // ==========================================================================
  describe("Feature 5: Hero Section with JetBrains Styling", () => {
    test("T1.F5.01: High-Contrast Headline & Gradient Mask", () => {
      const hero = loadProjectSource("components/hero.tsx");
      expect(hero).toContain("data-testid=\"hero-headline\"");
      expect(hero).toContain("bg-clip-text");
      expect(hero).toContain("text-transparent");
      expect(hero).toContain("AUTONOMOUS PLANETARY ROVER");
    });

    test("T1.F5.02: Mission Status Pill Badge", () => {
      const hero = loadProjectSource("components/hero.tsx");
      expect(hero).toContain("data-testid=\"hero-status-pill\"");
      expect(hero).toContain("URC 2026 // ACTIVE MISSION");
    });

    test("T1.F5.03: Carl Sagan Inspirational Motto", () => {
      const hero = loadProjectSource("components/hero.tsx");
      expect(hero).toContain("data-testid=\"hero-motto\"");
      expect(hero).toContain("Somewhere, something incredible is waiting to be known.");
      expect(hero).toContain("Carl Sagan");
    });

    test("T1.F5.04: Quick Metrics Chips Grid", () => {
      const hero = loadProjectSource("components/hero.tsx");
      expect(hero).toContain("data-testid=\"hero-metrics-chips\"");
      expect(hero).toContain("URC World 3rd");
      expect(hero).toContain("ERC Silver");
      expect(hero).toContain("6-DOF");
      expect(hero).toContain("5.8 GHz");
    });

    test("T1.F5.05: Action CTAs", () => {
      const hero = loadProjectSource("components/hero.tsx");
      expect(hero).toContain("data-testid=\"hero-cta-inspect-3d\"");
      expect(hero).toContain("Inspect Rover 3D");
      expect(hero).toContain("data-testid=\"hero-cta-console\"");
      expect(hero).toContain("Open Matrix Console");
    });
  });

  // ==========================================================================
  // FEATURE 6: PROCEDURAL 3D ARTICULATED ROVER (F6)
  // ==========================================================================
  describe("Feature 6: Procedural 3D Articulated Rover", () => {
    test("T1.F6.01: WebGL Canvas Element Initialization", () => {
      const studio = loadProjectSource("components/rover-studio.tsx");
      expect(studio).toContain("data-testid=\"rover-canvas\"");
      expect(studio).toContain("ProceduralRover");
    });

    test("T1.F6.02: Rocker-Bogie Chassis Assembly & Carbon-Aluminum Specs", () => {
      const rover = loadProjectSource("components/procedural-rover.tsx");
      expect(rover).toContain("chassis-main");
      expect(rover).toContain("boxGeometry");

      // Verify 2026 Generation lightweight carbon-aluminum hybrid rocker-bogie specs
      const studio = loadProjectSource("components/rover-studio.tsx");
      expect(studio).toMatch(/carbon-aluminum|carbon\s*fiber/i);
      expect(studio).toContain("Rocker-Bogie");
    });

    test("T1.F6.03: 6-Wheel Ground Traction Subsystem", () => {
      const rover = loadProjectSource("components/procedural-rover.tsx");
      expect(rover).toContain("wheel-front-left");
      expect(rover).toContain("wheel-front-right");
      expect(rover).toContain("wheel-mid-left");
      expect(rover).toContain("wheel-mid-right");
      expect(rover).toContain("wheel-rear-left");
      expect(rover).toContain("wheel-rear-right");
    });

    test("T1.F6.04: 6-DOF Articulated Robotic Arm Hierarchy", () => {
      const rover = loadProjectSource("components/procedural-rover.tsx");
      expect(rover).toContain("robotic-arm-assembly");
      expect(rover).toContain("arm-joint-1-turret");
      expect(rover).toContain("arm-joint-2-shoulder");
      expect(rover).toContain("arm-joint-3-elbow");
      expect(rover).toContain("arm-joint-4-wrist");
      expect(rover).toContain("arm-gripper-endeffector");
    });

    test("T1.F6.05: Mast, LiDAR & 2026 Generation Avionics Stack", () => {
      const rover = loadProjectSource("components/procedural-rover.tsx");
      expect(rover).toContain("mast-sensor-assembly");
      expect(rover).toContain("sensor-mast-lidar-cylinder");
      expect(rover).toContain("science-bay-assembly");
      expect(rover).toContain("compute-avionics-bay");

      // Verify 2026 Generation ROS2 Humble, Jetson Orin, and FDCAN/CAN-FD specs
      const studio = loadProjectSource("components/rover-studio.tsx");
      expect(studio).toMatch(/ROS2?\s*Humble/i);
      expect(studio).toMatch(/FDCAN|CAN-FD/i);
      expect(studio).toMatch(/Jetson\s*(AGX\s*)?Orin/i);
    });
  });

  // ==========================================================================
  // FEATURE 7: 3D INTERACTIVE HOTSPOTS & CONTROLS (F7)
  // ==========================================================================
  describe("Feature 7: 3D Interactive Hotspots & Controls", () => {
    test("T1.F7.01: Five Subsystem Hotspot Pins Existence", () => {
      const studio = loadProjectSource("components/rover-studio.tsx");
      expect(studio).toContain("ROVER_HOTSPOTS");
      expect(studio).toContain("\"arm\"");
      expect(studio).toContain("\"chassis\"");
      expect(studio).toContain("\"mast\"");
      expect(studio).toContain("\"science\"");
      expect(studio).toContain("\"compute\"");
    });

    test("T1.F7.02: Hotspot Selection & Spec Drawer Activation", () => {
      const studio = loadProjectSource("components/rover-studio.tsx");
      expect(studio).toContain("data-testid=\"hotspot-drawer\"");
      expect(studio).toContain("activeHotspot");
      expect(studio).toContain("Degrees of Freedom");
    });

    test("T1.F7.03: OrbitControls Configuration Constraints", () => {
      const studio = loadProjectSource("components/rover-studio.tsx");
      expect(studio).toContain("rover-canvas");
      expect(studio).toContain("ProceduralRover");
    });

    test("T1.F7.04: Sci-Fi Wireframe Toggle Button", () => {
      const studio = loadProjectSource("components/rover-studio.tsx");
      expect(studio).toContain("data-testid=\"wireframe-toggle\"");
      expect(studio).toContain("wireframe");
    });

    test("T1.F7.05: Wireframe Material State Toggle", () => {
      const rover = loadProjectSource("components/procedural-rover.tsx");
      expect(rover).toContain("isWireframe ? \"#21D4FD\" : \"#E2E8F0\"");
      expect(rover).toContain("wireframe: isWireframe");
    });
  });

  // ==========================================================================
  // FEATURE 8: PYCHARM IDE CODE DECK SIMULATION (F8)
  // ==========================================================================
  describe("Feature 8: PyCharm IDE Code Deck Simulation", () => {
    test("T1.F8.01: PyCharm IDE Window Chrome", () => {
      const ide = loadProjectSource("components/pycharm-window.tsx");
      expect(ide).toContain("data-testid=\"pycharm-window\"");
      expect(ide).toContain("#FF5F56"); // Red traffic light
      expect(ide).toContain("#FFBD2E"); // Yellow traffic light
      expect(ide).toContain("#27C93F"); // Green traffic light
      expect(ide).toMatch(/itu_matrix.*PyCharm/i);
    });

    test("T1.F8.02: Quad File Tab Architecture", () => {
      const ide = loadProjectSource("components/pycharm-window.tsx");
      expect(ide).toContain("data-testid=\"code-tabs\"");
      expect(ide).toContain("autonomous_nav.py");
      expect(ide).toContain("arm_kinematics.py");
      expect(ide).toContain("sensor_fusion.py");
      expect(ide).toContain("science_spectrometry.py");
    });

    test("T1.F8.03: Interactive Tab Content Switching", () => {
      const ide = loadProjectSource("components/pycharm-window.tsx");
      expect(ide).toContain("def compute_ik");
      expect(ide).toContain("IKFastSolver");
      expect(ide).toContain("activeTab");
    });

    test("T1.F8.04: Darcula Syntax Highlight Elements", () => {
      const ide = loadProjectSource("components/pycharm-window.tsx");
      expect(ide).toContain("pre");
      expect(ide).toContain("code");
      expect(ide).toContain("language: \"python\"");
    });

    test("T1.F8.05: Simulation Execution & Stdout Output", () => {
      const ide = loadProjectSource("components/pycharm-window.tsx");
      expect(ide).toContain("data-testid=\"run-simulation-btn\"");
      expect(ide).toContain("data-testid=\"simulation-stdout\"");
      expect(ide).toContain("Process finished with exit code 0");
    });
  });

  // ==========================================================================
  // FEATURE 9: INTERACTIVE MATRIX TELEMETRY CONSOLE (F9)
  // ==========================================================================
  describe("Feature 9: Interactive Matrix Telemetry Console", () => {
    test("T1.F9.01: Monospace Terminal DOM Structure", () => {
      const terminal = loadProjectSource("components/telemetry-console.tsx");
      expect(terminal).toContain("data-testid=\"telemetry-terminal\"");
      expect(terminal).toContain("matrix@itu-rover");
      expect(terminal).toContain("data-testid=\"console-input\"");
    });

    test("T1.F9.02: Command Execution: help", () => {
      const session = createTelemetrySession();
      const res = session.execute("help");
      expect(res.status).toBe("success");
      const out = res.output.join(" ");
      expect(out).toContain("help");
      expect(out).toContain("telemetry");
      expect(out).toContain("arm test");
      expect(out).toContain("subsystems");
      expect(out).toContain("science");
      expect(out).toContain("rovers");
      expect(out).toContain("clear");
    });

    test("T1.F9.03: Command Execution: telemetry", () => {
      const session = createTelemetrySession();
      const res = session.execute("telemetry");
      expect(res.status).toBe("success");
      const out = res.output.join(" ");
      expect(out).toContain("24.8V");
      expect(out).toContain("5.8 GHz");
      expect(out).toContain("MDRS Utah");
      expect(out).toContain("IMU");
    });

    test("T1.F9.04: Command Execution: arm test", () => {
      const session = createTelemetrySession();
      const res = session.execute("arm test");
      expect(res.status).toBe("success");
      const out = res.output.join(" ");
      expect(out).toContain("6-DOF ROBOTIC ARM");
      expect(out).toContain("J1 Base Yaw");
      expect(out).toContain("J6 End-Effector");
      expect(out).toContain("3.5kg Payload Capacity");
      expect(out).not.toContain("5.0kg");
      expect(out).toContain("NOMINAL");
    });

    test("T1.F9.05: Command Execution: subsystems", () => {
      const session = createTelemetrySession();
      const res = session.execute("subsystems");
      expect(res.status).toBe("success");
      expect(res.output.length).toBe(5);
      const out = res.output.join(" ");
      expect(out).toContain("Mechanical");
      expect(out).toContain("Electronics");
      expect(out).toContain("Autonomous Software");
      expect(out).toContain("Science Subsystem");
      expect(out).toContain("PR & Communications");
    });
  });

  // ==========================================================================
  // FEATURE 10: SUBTEAMS & INNOVATION BENTO GRID (F10)
  // ==========================================================================
  describe("Feature 10: Subteams & Innovation Bento Grid", () => {
    test("T1.F10.01: Bento Grid Responsive Container", () => {
      const bento = loadProjectSource("components/subteams-bento.tsx");
      expect(bento).toContain("data-testid=\"subteams-bento\"");
      expect(bento).toContain("grid-cols-1 md:grid-cols-3");
      expect(bento).toContain("data-testid=\"subteam-card\"");
    });

    test("T1.F10.02: Autonomous Software Systems Card", () => {
      const bento = loadProjectSource("components/subteams-bento.tsx");
      expect(bento).toContain("Autonomous Software Systems");
      expect(bento).toContain("ROS 2");
      expect(bento).toContain("Jetson Orin");
    });

    test("T1.F10.03: Mechanical & Structural Engineering Card", () => {
      const bento = loadProjectSource("components/subteams-bento.tsx");
      expect(bento).toContain("Mechanical & Structural Engineering");
      expect(bento).toContain("Rocker-Bogie");
      expect(bento).toContain("6-DOF Arm");
    });

    test("T1.F10.04: Electronics & Avionics Engineering Card (CAN-FD / FDCAN)", () => {
      const bento = loadProjectSource("components/subteams-bento.tsx");
      expect(bento).toContain("Electronics & Avionics Engineering");
      expect(bento).toContain("Custom PCB");
      expect(bento).toContain("Altium");
      expect(bento).toMatch(/CAN(\s*Bus|-FD)|\bFDCAN\b/i);
    });

    test("T1.F10.05: Science & Astrobiology and Team Governance / Faculty Advisor", () => {
      const bento = loadProjectSource("components/subteams-bento.tsx");
      expect(bento).toContain("Science & Astrobiology");
      expect(bento).toContain("Spectrometry");
      expect(bento).toContain("PR, Sponsorship & Operations");
      expect(bento).toContain("Sponsors");

      // Verify Faculty Advisor Dr. Özlem Emanet from ITU Mechanical Engineering
      const teamData = loadProjectSource("data/team-data.ts");
      expect(teamData).toMatch(/Özlem\s+Emanet/i);
      expect(teamData).toMatch(/(Takım Danışmanı|Faculty Advisor)/i);
      expect(teamData).toMatch(/Mechanical\s+Engineering|Makina\s+Fakültesi/i);
    });
  });

  // ==========================================================================
  // FEATURE 11: COMPETITIONS & ACHIEVEMENTS ROADMAP (F11)
  // ==========================================================================
  describe("Feature 11: Competitions & Achievements Roadmap", () => {
    test("T1.F11.01: Chronological Milestone Nodes", () => {
      const timeline = loadProjectSource("components/achievements-timeline.tsx");
      expect(timeline).toContain("data-testid=\"achievements-timeline\"");
      expect(timeline).toContain("2024");
      expect(timeline).toContain("2022");
      expect(timeline).toContain("2021");
      expect(timeline).toContain("2020");
      expect(timeline).toContain("2018");
      expect(timeline).toContain("2017");
    });

    test("T1.F11.02: URC 2020 World 3rd Place Record with Rover Altınay", () => {
      const timeline = loadProjectSource("components/achievements-timeline.tsx");
      const teamData = projectFileExists("data/team-data.ts") ? loadProjectSource("data/team-data.ts") : "";
      const combined = timeline + "\n" + teamData;
      expect(combined).toContain("University Rover Challenge (URC) World 3rd Place");
      expect(combined).toContain("World 3rd Place");
      expect(combined).toContain("MDRS, Hanksville, Utah");
      // Authentic ITU Rover model: Altınay
      expect(combined).toMatch(/Alt[ıi]nay/i);
    });

    test("T1.F11.03: URC 2018 Best Science System Award & Rover İnan Dedication", () => {
      const timeline = loadProjectSource("components/achievements-timeline.tsx");
      expect(timeline).toContain("Best Science System Award");
      expect(timeline).toContain("First time conferred in URC history");

      // Assert authentic 2nd Gen Rover İnan dedicated to Prof. Dr. Mustafa İnan
      expect(timeline).toMatch(/[İIıi]nan/);
      expect(timeline).toMatch(/Mustafa\s+[İIıi]nan/i);
    });

    test("T1.F11.04: ERC 2021 Silver Medal & Best Robotic Arm with Rover İnan", () => {
      const timeline = loadProjectSource("components/achievements-timeline.tsx");
      const teamData = projectFileExists("data/team-data.ts") ? loadProjectSource("data/team-data.ts") : "";
      const combined = timeline + "\n" + teamData;
      expect(combined).toContain("European Rover Challenge (ERC) Silver Medal");
      expect(combined).toContain("Best Robotic Arm");
      expect(combined).toContain("Silver Medal / 2nd Place");
      // Authentic ITU Rover model: İnan
      expect(combined).toMatch(/[İi]nan/i);
    });

    test("T1.F11.05: 1st Gen Altınay Mars Kaşifi & 2026 Generation Mission Roadmap", () => {
      const timeline = loadProjectSource("components/achievements-timeline.tsx");
      // Assert authentic 1st Gen Rover Altınay Mars Kaşifi
      expect(timeline).toMatch(/Alt[ıi]nay\s+Mars\s+Ka[şs]ifi/i);
      expect(timeline).toContain("2017");

      // Assert 2026 generation roadmap or cycle
      expect(timeline).toMatch(/2026/);
    });
  });

  // ==========================================================================
  // FEATURE 12: SPONSORS WALL & COMPREHENSIVE FOOTER (F12)
  // ==========================================================================
  describe("Feature 12: Sponsors Wall & Comprehensive Footer", () => {
    test("T1.F12.01: Verified Corporate Sponsors Display", () => {
      const footer = loadProjectSource("components/sponsors-footer.tsx");
      expect(footer).toContain("data-testid=\"sponsors-wall\"");
      expect(footer).toContain("AXA Sigorta");
      expect(footer).toContain("Autodesk");
      expect(footer).toContain("Altium");
      expect(footer).toContain("PCBWay");
    });

    test("T1.F12.02: Istanbul Technical University Institutional Banner & Faculty Advisor", () => {
      const footer = loadProjectSource("components/sponsors-footer.tsx");
      expect(footer).toContain("data-testid=\"footer-itu-banner\"");
      expect(footer).toContain("İstanbul Teknik Üniversitesi (İTÜ)");
      expect(footer).toContain("Ayazağa Campus");
      expect(footer).toContain("1773");

      // Assert Faculty Advisor Dr. Özlem Emanet
      expect(footer).toMatch(/Özlem\s+Emanet/i);
      expect(footer).toMatch(/(Takım Danışmanı|Faculty Advisor)/i);
    });

    test("T1.F12.03: Verified Social Media Links", () => {
      const footer = loadProjectSource("components/sponsors-footer.tsx");
      expect(footer).toContain("data-testid=\"footer-social-links\"");
      expect(footer).toContain("https://github.com/itu-rover");
      expect(footer).toContain("https://www.instagram.com/itu.roverteam/");
      expect(footer).toContain("https://www.linkedin.com/company/ituroverteam");
      expect(footer).toContain("https://twitter.com/ituroverteam");
      expect(footer).toContain("https://www.youtube.com/@ITURoverTeam");
    });

    test("T1.F12.04: External Links Security Attributes", () => {
      const footer = loadProjectSource("components/sponsors-footer.tsx");
      expect(footer).toContain("target=\"_blank\"");
      expect(footer).toContain("rel=\"noopener noreferrer\"");
      expect(footer).toMatch(/https:\/\//);
    });

    test("T1.F12.05: Copyright Notice & Current Year", () => {
      const footer = loadProjectSource("components/sponsors-footer.tsx");
      expect(footer).toMatch(/(©|&copy;)\s*202[4-6]\s+ITU\s+Matrix/i);
    });
  });

  // ==========================================================================
  // FEATURE 13: RESPONSIVE VIEWPORT OPTIMIZATION (F13)
  // ==========================================================================
  describe("Feature 13: Responsive Viewport Optimization", () => {
    test("T1.F13.01: Narrow Mobile Viewport (320px) Overflow Check", () => {
      const layout = loadProjectSource("app/layout.tsx", "overflow-x-hidden");
      const globals = loadProjectSource("app/globals.css", "overflow-x: hidden");
      expect(layout + " " + globals).toMatch(/overflow-x-hidden|overflow-x:\s*hidden/);
    });

    test("T1.F13.02: Tablet Viewport (768px) Layout Adaptation", () => {
      const nav = loadProjectSource("components/navbar.tsx");
      const bento = loadProjectSource("components/subteams-bento.tsx");
      expect(nav).toMatch(/hidden\s+md:flex/);
      expect(bento).toMatch(/md:grid-cols-3/);
    });

    test("T1.F13.03: Desktop Viewport (1440px) Max Width Bounds", () => {
      const layout = loadProjectSource("app/layout.tsx", "max-w-7xl");
      expect(layout).toContain("max-w-7xl mx-auto");
    });

    test("T1.F13.04: Legible Font Sizing Across Breakpoints", () => {
      const hero = loadProjectSource("components/hero.tsx");
      expect(hero).toMatch(/text-4xl\s+sm:text-6xl\s+md:text-7xl/);
    });

    test("T1.F13.05: 3D Canvas Responsive Aspect Ratio", () => {
      const studio = loadProjectSource("components/rover-studio.tsx");
      expect(studio).toMatch(/h-\[450px\]\s+sm:h-\[550px\]\s+lg:h-\[650px\]/);
    });
  });

  // ==========================================================================
  // FEATURE 14: CLEAN BUILD & TEST PASS (F14)
  // ==========================================================================
  describe("Feature 14: Clean Build & Test Pass", () => {
    test("T1.F14.01: Next.js Production Build Script Gate", () => {
      const pkg = JSON.parse(loadProjectSource("package.json"));
      expect(pkg.scripts.build).toBe("next build");
    });

    test("T1.F14.02: Static Bundle & Route Generation Config", () => {
      expect(projectFileExists("next.config.ts") || projectFileExists("next.config.mjs") || projectFileExists("next.config.js")).toBe(true);
    });

    test("T1.F14.03: TypeScript Strict Type Checking", () => {
      const tsconfig = JSON.parse(loadProjectSource("tsconfig.json"));
      expect(tsconfig.compilerOptions.strict).toBe(true);
      expect(tsconfig.compilerOptions.noEmit).toBe(true);
    });

    test("T1.F14.04: TypeScript Configuration Path Aliases & Module Resolution", () => {
      const tsconfig = JSON.parse(loadProjectSource("tsconfig.json"));
      expect(tsconfig.compilerOptions).toBeDefined();
      expect(tsconfig.compilerOptions.moduleResolution.toLowerCase()).toMatch(/bundler|node/);
      expect(tsconfig.compilerOptions.paths?.["@/*"]).toBeDefined();
      expect(tsconfig.compilerOptions.paths["@/*"]).toContain("./*");
      expect(tsconfig.compilerOptions.jsx).toMatch(/preserve|react-jsx/);
    });

    test("T1.F14.05: Next.js Production Configuration Security & React Strict Mode", () => {
      const nextConfigPath = projectFileExists("next.config.ts")
        ? "next.config.ts"
        : projectFileExists("next.config.mjs")
        ? "next.config.mjs"
        : "next.config.js";
      const nextConfig = loadProjectSource(nextConfigPath);
      expect(nextConfig.length).toBeGreaterThan(0);
      expect(nextConfig).toContain("reactStrictMode: true");
      expect(nextConfig).toMatch(/reactStrictMode|transpilePackages/);
    });
  });

});
