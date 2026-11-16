/**
 * tests/e2e/tier4-journeys.test.ts
 * Tier 4: Real-World Application Workload Journeys (6 Multi-Action End-to-End Scenarios).
 */

import { describe, test, expect } from "bun:test";
import { createJourneyHarness } from "./helpers/journey-runner";
import { createTelemetrySession } from "./helpers/telemetry-runner";
import { loadProjectSource, projectFileExists } from "./helpers/source-loader";
import { existsSync } from "fs";
import { resolve } from "path";

describe("Tier 4: Real-World Application User Journey Suite (6 Scenarios)", () => {

  // ==========================================================================
  // SCENARIO 1: CAPTAIN INSPECTION JOURNEY
  // ==========================================================================
  test("Scenario 1: Captain Inspection Journey", async () => {
    const harness = createJourneyHarness("Captain Inspection Journey", "Team Captain", { width: 1440, height: 900 });

    await harness.runAll([
      {
        name: "Phase 1: Environment & Git Setup Audit",
        description: "Captain verifies project layout, dependencies, and git configuration",
        action: (state) => {
          expect(projectFileExists("package.json")).toBe(true);
          const pkg = JSON.parse(loadProjectSource("package.json"));
          expect(pkg.name).toBe("itu_matrix");
          expect(pkg.scripts.build).toBe("next build");

          const gitConfig = loadProjectSource(".git/config");
          expect(gitConfig).toContain("itu-matrix");
          state.variables.gitVerified = true;
        },
        assert: (state) => {
          expect(state.variables.gitVerified).toBe(true);
        },
      },
      {
        name: "Phase 2: Header & 5.8GHz Beacon Inspection",
        description: "Captain verifies header brand, telemetry beacon, and quick console CTA",
        action: (state) => {
          const nav = loadProjectSource("components/navbar.tsx");
          expect(nav).toContain("ITU MATRIX");
          expect(nav).toContain("5.8 GHz ONLINE");
          expect(nav).toContain("Launch Console");
          state.variables.beaconVerified = true;
        },
        assert: (state) => {
          expect(state.variables.beaconVerified).toBe(true);
        },
      },
      {
        name: "Phase 3: Telemetry CLI Diagnostics Execution",
        description: "Captain executes help, telemetry, and subsystems in terminal",
        action: (state) => {
          const session = createTelemetrySession();
          const helpRes = session.execute("help");
          expect(helpRes.status).toBe("success");

          const telRes = session.execute("telemetry");
          expect(telRes.output.some(l => l.includes("24.8V"))).toBe(true);
          expect(telRes.output.some(l => l.includes("5.8 GHz"))).toBe(true);

          const subRes = session.execute("subsystems");
          expect(subRes.output.length).toBe(5);
          expect(subRes.output.every(l => l.includes("[OK]"))).toBe(true);

          state.terminalHistory = session.getHistory();
        },
        assert: (state) => {
          expect(state.terminalHistory?.length).toBe(3);
        },
      },
      {
        name: "Phase 4: PyCharm IDE Code Simulation Audit",
        description: "Captain inspects autonomous_nav.py and arm_kinematics.py in code simulator",
        action: (state) => {
          const ide = loadProjectSource("components/pycharm-window.tsx");
          expect(ide).toContain("autonomous_nav.py");
          expect(ide).toContain("arm_kinematics.py");
          expect(ide).toContain("import rclpy");
          expect(ide).toContain("IKFastSolver");
          state.activeCodeTab = "autonomous_nav.py";
        },
        assert: (state) => {
          expect(state.activeCodeTab).toBe("autonomous_nav.py");
        },
      },
      {
        name: "Phase 5: Build Integrity & Gate Validation",
        description: "Captain verifies TypeScript strict mode and Next.js build scripts",
        action: (state) => {
          const tsconfig = JSON.parse(loadProjectSource("tsconfig.json"));
          expect(tsconfig.compilerOptions.strict).toBe(true);
          state.variables.buildGatePassed = true;
        },
        assert: (state) => {
          expect(state.variables.buildGatePassed).toBe(true);
        },
      },
    ]);
  });

  // ==========================================================================
  // SCENARIO 2: CORPORATE SPONSOR VERIFICATION JOURNEY
  // ==========================================================================
  test("Scenario 2: Corporate Sponsor Verification Journey", async () => {
    const harness = createJourneyHarness("Sponsor Verification Journey", "Corporate Sponsor", { width: 1440, height: 900 });

    await harness.runAll([
      {
        name: "Phase 1: Brand & First Impression",
        description: "Sponsor lands on website and reads high-impact motto and headline",
        action: (state) => {
          const hero = loadProjectSource("components/hero.tsx");
          expect(hero).toContain("Somewhere, something incredible is waiting to be known.");
          expect(hero).toContain("Carl Sagan");
          expect(hero).toContain("ITU MATRIX // AUTONOMOUS PLANETARY ROVER");
        },
        assert: (state) => {
          expect(state.currentUrl).toBe("/");
        },
      },
      {
        name: "Phase 2: Proven Competition Heritage",
        description: "Sponsor reviews international URC and ERC podium achievements",
        action: (state) => {
          const timeline = loadProjectSource("components/achievements-timeline.tsx");
          expect(timeline).toContain("University Rover Challenge (URC) World 3rd Place");
          expect(timeline).toContain("European Rover Challenge (ERC) Silver Medal");
          expect(timeline).toContain("Best Science System Award");
        },
        assert: (state) => {
          expect(state.currentUrl).toBe("/");
        },
      },
      {
        name: "Phase 3: Engineering Subteams Structure",
        description: "Sponsor validates PR and sponsorship operations card in bento grid",
        action: (state) => {
          const bento = loadProjectSource("components/subteams-bento.tsx");
          expect(bento).toContain("PR, Sponsorship & Operations");
          expect(bento).toContain("Sponsors");
          expect(bento).toContain("Outreach");
        },
        assert: (state) => {
          expect(state.currentUrl).toBe("/");
        },
      },
      {
        name: "Phase 4: Sponsors Wall & Security Audit",
        description: "Sponsor checks AXA, Autodesk, Altium, and PCBWay logo placement and link security",
        action: (state) => {
          const footer = loadProjectSource("components/sponsors-footer.tsx");
          expect(footer).toContain("AXA Sigorta");
          expect(footer).toContain("Autodesk");
          expect(footer).toContain("Altium");
          expect(footer).toContain("PCBWay");
          expect(footer).toContain("target=\"_blank\"");
          expect(footer).toContain("rel=\"noopener noreferrer\"");
        },
        assert: (state) => {
          expect(state.currentUrl).toBe("/");
        },
      },
      {
        name: "Phase 5: Institutional Affiliation & Footer",
        description: "Sponsor confirms Istanbul Technical University (İTÜ) credentials",
        action: (state) => {
          const footer = loadProjectSource("components/sponsors-footer.tsx");
          expect(footer).toContain("İstanbul Teknik Üniversitesi (İTÜ)");
          expect(footer).toContain("Ayazağa Campus");
          expect(footer).toContain("1773");
        },
        assert: (state) => {
          expect(state.currentUrl).toBe("/");
        },
      },
    ]);
  });

  // ==========================================================================
  // SCENARIO 3: COMPETITION JURY TECHNICAL AUDIT JOURNEY
  // ==========================================================================
  test("Scenario 3: Competition Jury Technical Audit Journey", async () => {
    const harness = createJourneyHarness("Competition Jury Audit", "URC/ERC Judge", { width: 1440, height: 900 });

    await harness.runAll([
      {
        name: "Phase 1: Jury Scrutineering Entry",
        description: "Judge confirms hero metrics (6-DOF, 99.4% autonomy, URC World 3rd)",
        action: (state) => {
          const hero = loadProjectSource("components/hero.tsx");
          expect(hero).toContain("6-DOF");
          expect(hero).toContain("99.4%");
          expect(hero).toContain("URC World 3rd");
        },
        assert: (state) => {
          expect(state.currentUrl).toBe("/");
        },
      },
      {
        name: "Phase 2: 3D Articulated Rover Inspection",
        description: "Judge verifies 3D model: rocker-bogie, 6 wheels, 6-DOF arm, mast, science bay",
        action: (state) => {
          const rover = loadProjectSource("components/procedural-rover.tsx");
          expect(rover).toContain("chassis-main");
          expect(rover).toContain("wheel-assembly");
          expect(rover).toContain("robotic-arm-assembly");
          expect(rover).toContain("mast-sensor-assembly");
          expect(rover).toContain("science-bay-assembly");
        },
        assert: (state) => {
          expect(state.currentUrl).toBe("/");
        },
      },
      {
        name: "Phase 3: Subsystem Hotspot Scrutineering",
        description: "Judge inspects all 5 subsystem hotspots and engineering specifications",
        action: (state) => {
          const studio = loadProjectSource("components/rover-studio.tsx");
          expect(studio).toContain("Robotic Arm");
          expect(studio).toContain("Rocker-Bogie Chassis");
          expect(studio).toContain("Mast & LiDAR");
          expect(studio).toContain("Science Subsystem");
          expect(studio).toContain("Autonomous Compute");
          state.activeHotspotId = "science";
        },
        assert: (state) => {
          expect(state.activeHotspotId).toBe("science");
        },
      },
      {
        name: "Phase 4: Award & Score Card Validation",
        description: "Judge validates historical URC/ERC award records",
        action: (state) => {
          const timeline = loadProjectSource("components/achievements-timeline.tsx");
          expect(timeline).toContain("URC 2020");
          expect(timeline).toContain("URC 2018");
          expect(timeline).toContain("ERC 2021");
          expect(timeline).toContain("Best Robotic Arm");
        },
        assert: (state) => {
          expect(state.currentUrl).toBe("/");
        },
      },
    ]);
  });

  // ==========================================================================
  // SCENARIO 4: MOBILE DEVELOPER WALKTHROUGH JOURNEY
  // ==========================================================================
  test("Scenario 4: Mobile Developer Walkthrough Journey", async () => {
    const harness = createJourneyHarness("Mobile Developer Walkthrough", "Mobile Dev", { width: 320, height: 640 });

    await harness.runAll([
      {
        name: "Phase 1: Viewport & Layout Bounds",
        description: "Developer verifies layout containment on narrow 320px screen",
        action: (state) => {
          state.viewport = { width: 320, height: 640 };
          const layout = loadProjectSource("app/layout.tsx", "overflow-x-hidden");
          expect(layout).toContain("overflow-x-hidden");
        },
        assert: (state) => {
          expect(state.viewport.width).toBe(320);
        },
      },
      {
        name: "Phase 2: Mobile Navigation Drawer",
        description: "Developer verifies responsive hamburger menu button and drawer links",
        action: (state) => {
          const nav = loadProjectSource("components/navbar.tsx");
          expect(nav).toContain("data-testid=\"mobile-menu-button\"");
          expect(nav).toContain("data-testid=\"mobile-nav-drawer\"");
        },
        assert: (state) => {
          expect(state.viewport.width).toBe(320);
        },
      },
      {
        name: "Phase 3: Mobile Hero Experience",
        description: "Developer audits responsive metric chips 2x2 wrapping",
        action: (state) => {
          const hero = loadProjectSource("components/hero.tsx");
          expect(hero).toContain("grid grid-cols-2 md:grid-cols-4");
        },
        assert: (state) => {
          expect(state.viewport.width).toBe(320);
        },
      },
      {
        name: "Phase 4: Mobile 3D Canvas Usability",
        description: "Developer checks responsive height and hotspot buttons wrap",
        action: (state) => {
          const studio = loadProjectSource("components/rover-studio.tsx");
          expect(studio).toContain("h-[450px] sm:h-[550px] lg:h-[650px]");
          expect(studio).toContain("flex flex-wrap gap-2");
        },
        assert: (state) => {
          expect(state.viewport.width).toBe(320);
        },
      },
      {
        name: "Phase 5: Mobile Bento & Timeline Reflow",
        description: "Developer verifies bento grid single-column reflow on small screens",
        action: (state) => {
          const bento = loadProjectSource("components/subteams-bento.tsx");
          expect(bento).toContain("grid-cols-1 md:grid-cols-3");
        },
        assert: (state) => {
          expect(state.viewport.width).toBe(320);
        },
      },
      {
        name: "Phase 6: Mobile Footer Layout",
        description: "Developer verifies responsive sponsor grid scaling on mobile",
        action: (state) => {
          const footer = loadProjectSource("components/sponsors-footer.tsx");
          expect(footer).toContain("grid-cols-2 md:grid-cols-3 lg:grid-cols-6");
        },
        assert: (state) => {
          expect(state.viewport.width).toBe(320);
        },
      },
    ]);
  });

  // ==========================================================================
  // SCENARIO 5: TELEMETRY SYSTEMS ENGINEER DEEP DIVE JOURNEY
  // ==========================================================================
  test("Scenario 5: Telemetry Systems Engineer Deep Dive Journey", async () => {
    const harness = createJourneyHarness("Telemetry Engineer Deep Dive", "Telemetry Engineer", { width: 1440, height: 900 });

    await harness.runAll([
      {
        name: "Phase 1: Terminal Initialization",
        description: "Engineer locates terminal and verifies prompt format",
        action: (state) => {
          const term = loadProjectSource("components/telemetry-console.tsx");
          expect(term).toContain("data-testid=\"telemetry-terminal\"");
          expect(term).toContain("matrix@itu-rover");
        },
        assert: (state) => {
          expect(state.currentUrl).toBe("/");
        },
      },
      {
        name: "Phase 2: Help & Command Discovery",
        description: "Engineer runs help and tests invalid command error handling",
        action: (state) => {
          const session = createTelemetrySession();
          const helpRes = session.execute("help");
          expect(helpRes.output.some(l => l.includes("help"))).toBe(true);

          const invalidRes = session.execute("unknown_sys_call");
          expect(invalidRes.status).toBe("error");
          expect(invalidRes.output[0]).toContain("Command not recognized");
        },
        assert: (state) => {
          expect(state.currentUrl).toBe("/");
        },
      },
      {
        name: "Phase 3: Sensor Telemetry Stream",
        description: "Engineer executes telemetry command and verifies RF, power, and GPS",
        action: (state) => {
          const session = createTelemetrySession();
          const tel = session.execute("telemetry");
          expect(tel.output.some(l => l.includes("5.8 GHz High-Gain"))).toBe(true);
          expect(tel.output.some(l => l.includes("24.8V Nominal"))).toBe(true);
          expect(tel.output.some(l => l.includes("MDRS Utah"))).toBe(true);
        },
        assert: (state) => {
          expect(state.currentUrl).toBe("/");
        },
      },
      {
        name: "Phase 4: Subsystems & Arm Diagnostics",
        description: "Engineer runs subsystems status and 6-DOF arm sweep sequence",
        action: (state) => {
          const session = createTelemetrySession();
          const sub = session.execute("subsystems");
          expect(sub.output.length).toBe(5);

          const arm = session.execute("arm test");
          expect(arm.output.some(l => l.includes("J1 Base Yaw"))).toBe(true);
          expect(arm.output.some(l => l.includes("J6 End-Effector"))).toBe(true);
          expect(arm.output.some(l => l.includes("ARM STATUS: NOMINAL"))).toBe(true);
        },
        assert: (state) => {
          expect(state.currentUrl).toBe("/");
        },
      },
      {
        name: "Phase 5: Buffer Management & History Recall",
        description: "Engineer verifies command history recall and buffer clearing",
        action: (state) => {
          const session = createTelemetrySession();
          session.execute("telemetry");
          session.execute("arm test");
          expect(session.getPreviousCommand(0)).toBe("arm test");
          expect(session.getPreviousCommand(1)).toBe("telemetry");

          const clearRes = session.execute("clear");
          expect(clearRes.status).toBe("cleared");
          expect(clearRes.output.length).toBe(0);
        },
        assert: (state) => {
          expect(state.currentUrl).toBe("/");
        },
      },
      {
        name: "Phase 6: Multi-Discipline Synchronization",
        description: "Engineer inspects sensor_fusion.py code and toggles 3D wireframe",
        action: (state) => {
          const ide = loadProjectSource("components/pycharm-window.tsx");
          expect(ide).toContain("sensor_fusion.py");
          expect(ide).toContain("ExtendedKalmanFilter");

          const studio = loadProjectSource("components/rover-studio.tsx");
          expect(studio).toContain("wireframe");
          state.wireframeMode = true;
        },
        assert: (state) => {
          expect(state.wireframeMode).toBe(true);
        },
      },
    ]);
  });

  // ==========================================================================
  // SCENARIO 6: FRESH VISITOR DISCOVERY JOURNEY
  // ==========================================================================
  test("Scenario 6: Fresh Visitor Discovery Journey", async () => {
    const harness = createJourneyHarness("Fresh Visitor Discovery", "First-Time Visitor", { width: 1440, height: 900 });

    await harness.runAll([
      {
        name: "Phase 1: Hero Entrance & Inspiration",
        description: "Visitor arrives on page, reads Carl Sagan quote and team mission",
        action: (state) => {
          const hero = loadProjectSource("components/hero.tsx");
          expect(hero).toContain("Somewhere, something incredible is waiting to be known.");
          expect(hero).toContain("ITU MATRIX // AUTONOMOUS PLANETARY ROVER");
        },
        assert: (state) => {
          expect(state.currentUrl).toBe("/");
        },
      },
      {
        name: "Phase 2: Engaging 3D Rover Experience",
        description: "Visitor scrolls to 3D rover, toggles wireframe, and clicks Mast hotspot",
        action: (state) => {
          const studio = loadProjectSource("components/rover-studio.tsx");
          expect(studio).toContain("3D Interactive Rover Studio");
          expect(studio).toContain("data-testid=\"wireframe-toggle\"");
          expect(studio).toContain("Mast & LiDAR");
          state.activeHotspotId = "mast";
        },
        assert: (state) => {
          expect(state.activeHotspotId).toBe("mast");
        },
      },
      {
        name: "Phase 3: Subteams & Roles Discovery",
        description: "Visitor browses the 5 engineering subteams bento cards",
        action: (state) => {
          const bento = loadProjectSource("components/subteams-bento.tsx");
          expect(bento).toContain("Autonomous Software Systems");
          expect(bento).toContain("Mechanical & Structural Engineering");
          expect(bento).toContain("Electronics & Avionics Engineering");
          expect(bento).toContain("Science & Astrobiology");
          expect(bento).toContain("PR, Sponsorship & Operations");
        },
        assert: (state) => {
          expect(state.currentUrl).toBe("/");
        },
      },
      {
        name: "Phase 4: Historical Achievements Discovery",
        description: "Visitor reviews international podium awards across Utah and Poland",
        action: (state) => {
          const timeline = loadProjectSource("components/achievements-timeline.tsx");
          expect(timeline).toContain("URC 2020");
          expect(timeline).toContain("World 3rd Place");
          expect(timeline).toContain("ERC 2021");
          expect(timeline).toContain("Silver Medal");
        },
        assert: (state) => {
          expect(state.currentUrl).toBe("/");
        },
      },
      {
        name: "Phase 5: Sponsors & Connecting via Social Channels",
        description: "Visitor inspects sponsors and finds official team social links",
        action: (state) => {
          const footer = loadProjectSource("components/sponsors-footer.tsx");
          expect(footer).toContain("AXA Sigorta");
          expect(footer).toContain("Autodesk");
          expect(footer).toContain("https://github.com/itu-rover");
          expect(footer).toContain("https://www.instagram.com/itu.roverteam/");
          expect(footer).toContain("https://www.linkedin.com/company/ituroverteam");
        },
        assert: (state) => {
          expect(state.currentUrl).toBe("/");
        },
      },
    ]);
  });

});
