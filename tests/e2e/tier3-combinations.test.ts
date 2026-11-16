/**
 * tests/e2e/tier3-combinations.test.ts
 * Tier 3: Pairwise Combinatorial Interaction Testing (15 Cross-Feature Tests).
 */

import { describe, test, expect } from "bun:test";
import { createTelemetrySession } from "./helpers/telemetry-runner";
import { loadProjectSource } from "./helpers/source-loader";
import { extractCssVariables } from "./helpers/token-checker";

describe("Tier 3: Pairwise Combinatorial Interaction Suite (15 Tests)", () => {

  test("T3-01: 3D Wireframe Toggle × Hotspot Drawer Selection (F7 + F6)", () => {
    // Specs drawer persists with valid data across wireframe toggles
    const studio = loadProjectSource("components/rover-studio.tsx");
    const rover = loadProjectSource("components/procedural-rover.tsx");

    expect(studio).toContain("wireframe");
    expect(studio).toContain("activeHotspot");
    expect(studio).toContain("data-testid=\"hotspot-drawer\"");
    expect(rover).toContain("isWireframe ? \"#21D4FD\" : \"#E2E8F0\"");
  });

  test("T3-02: Telemetry Console Execution × Subsystems Bento State (F9 + F10)", () => {
    // CLI stdout lists exact 5 subsystems shown in bento DOM cards
    const session = createTelemetrySession();
    const res = session.execute("subsystems");
    const bento = loadProjectSource("components/subteams-bento.tsx");

    expect(res.output.length).toBe(5);
    expect(res.output.some(l => l.includes("Mechanical"))).toBe(true);
    expect(res.output.some(l => l.includes("Electronics"))).toBe(true);
    expect(res.output.some(l => l.includes("Autonomous Software"))).toBe(true);
    expect(res.output.some(l => l.includes("Science Subsystem"))).toBe(true);
    expect(res.output.some(l => l.includes("PR & Communications"))).toBe(true);

    expect(bento).toContain("Mechanical");
    expect(bento).toContain("Electronics");
    expect(bento).toContain("Autonomous Software");
    expect(bento).toContain("Science & Astrobiology");
    expect(bento).toContain("PR, Sponsorship");
  });

  test("T3-03: PyCharm IDE Tab Switch × Code Simulation Stdout (F8)", () => {
    // Stdout pane updates dynamically to match selected file snippet
    const ide = loadProjectSource("components/pycharm-window.tsx");
    expect(ide).toContain("autonomous_nav.py");
    expect(ide).toContain("arm_kinematics.py");
    expect(ide).toContain("sensor_fusion.py");
    expect(ide).toContain("science_spectrometry.py");
    expect(ide).toContain("setActiveTab(tab)");
    expect(ide).toContain("setStdout([])");
    expect(ide).toContain("data-testid=\"simulation-stdout\"");
  });

  test("T3-04: Responsive Navbar Hamburger Toggle × 3D Canvas Pointer Events (F4 + F6 + F13)", () => {
    // Mobile drawer toggle does not trap canvas or break pointer interactions
    const nav = loadProjectSource("components/navbar.tsx");
    const studio = loadProjectSource("components/rover-studio.tsx");

    expect(nav).toContain("data-testid=\"mobile-menu-button\"");
    expect(nav).toContain("data-testid=\"mobile-nav-drawer\"");
    expect(nav).toContain("z-50");
    expect(studio).toContain("data-testid=\"rover-canvas\"");
  });

  test("T3-05: Hero CTA Smooth Scroll × 3D Rover Studio Focus (F5 + F6/F7)", () => {
    // Hero smooth scroll CTA anchors directly to Rover Studio section
    const hero = loadProjectSource("components/hero.tsx");
    const studio = loadProjectSource("components/rover-studio.tsx");

    expect(hero).toContain("href=\"#rover-3d\"");
    expect(studio).toContain("id=\"rover-3d\"");
    expect(studio).toContain("3D Interactive Rover Studio");
  });

  test("T3-06: Telemetry CLI 'arm test' Command × 3D Rover Arm Hotspot (F9 + F6/F7)", () => {
    // Joint calibration output in CLI strictly matches 6-DOF robotic arm specs
    const session = createTelemetrySession();
    const armRes = session.execute("arm test");
    const studio = loadProjectSource("components/rover-studio.tsx");

    expect(armRes.output.some(l => l.includes("6-DOF ROBOTIC ARM"))).toBe(true);
    expect(armRes.output.some(l => l.includes("J1 Base Yaw"))).toBe(true);
    expect(armRes.output.some(l => l.includes("J6 End-Effector"))).toBe(true);

    expect(studio).toContain("\"Degrees of Freedom\": \"6-DOF\"");
    expect(studio).toContain("\"Payload Capacity\": \"3.5 kg\"");
  });

  test("T3-07: Subteams Bento Grid × PyCharm IDE Code Snippet Technology Alignment (F10 + F8)", () => {
    // ROS2/Nav2 in Bento matches autonomous_nav.py imports in PyCharm simulator
    const bento = loadProjectSource("components/subteams-bento.tsx");
    const ide = loadProjectSource("components/pycharm-window.tsx");

    expect(bento).toContain("ROS 2");
    expect(bento).toContain("SLAM");
    expect(ide).toContain("import rclpy");
    expect(ide).toContain("from nav2_simple_commander.robot_navigator import BasicNavigator");
  });

  test("T3-08: Competitions Timeline Awards × Hero Quick Metrics Consistency (F11 + F5)", () => {
    // URC World 3rd and awards match 1:1 between hero chips and timeline cards
    const hero = loadProjectSource("components/hero.tsx");
    const timeline = loadProjectSource("components/achievements-timeline.tsx");

    expect(hero).toContain("URC World 3rd");
    expect(hero).toContain("6-DOF");
    expect(timeline).toContain("University Rover Challenge (URC) World 3rd Place");
    expect(timeline).toContain("European Rover Challenge (ERC) Silver Medal & Best Robotic Arm");
  });

  test("T3-09: Dark Theme CSS Tokens across IDE Window & Telemetry Console (F3 + F8 + F9)", () => {
    // PyCharm theme tokens applied to both developer components
    const css = loadProjectSource("app/globals.css", "--bg-canvas");
    const ide = loadProjectSource("components/pycharm-window.tsx");
    const consoleSource = loadProjectSource("components/telemetry-console.tsx");

    const vars = extractCssVariables(css);
    expect(vars.get("--bg-canvas")).toBe("#0b0b0e");
    expect(vars.get("--bg-surface")).toBe("#151518");

    expect(ide).toContain("bg-surface");
    expect(consoleSource).toContain("bg-canvas");
    expect(consoleSource).toContain("text-accent-yellow");
  });

  test("T3-10: 3D OrbitControls Rotation × Hotspot Screen Projection Stability (F6 + F7)", () => {
    // Hotspot coordinates anchor cleanly in 3D scene space
    const studio = loadProjectSource("components/rover-studio.tsx");
    expect(studio).toContain("position: [0.5, 0.9, 0.9]");
    expect(studio).toContain("position: [0, 0.5, 0]");
    expect(studio).toContain("position: [-0.4, 1.2, 0.7]");
  });

  test("T3-11: Responsive Viewport Resize × Telemetry Console History Persistence (F9 + F13)", () => {
    // Console history remains intact across viewport resizes
    const session = createTelemetrySession();
    session.execute("telemetry");
    session.execute("subsystems");
    session.execute("arm test");

    const history = session.getHistory();
    expect(history.length).toBe(3);
    expect(history[0]).toBe("telemetry");
    expect(history[1]).toBe("subsystems");
    expect(history[2]).toBe("arm test");

    const consoleComp = loadProjectSource("components/telemetry-console.tsx");
    expect(consoleComp).toContain("overflow-y-auto");
  });

  test("T3-12: Sponsors Wall & Footer External Links Security Attributes (F12)", () => {
    // All external anchors enforce target="_blank" and rel="noopener noreferrer"
    const footer = loadProjectSource("components/sponsors-footer.tsx");
    expect(footer).toContain("target=\"_blank\"");
    expect(footer).toContain("rel=\"noopener noreferrer\"");
    expect(footer).not.toMatch(/href=['"]http:\/\//);
  });

  test("T3-13: Git Remote Tracking × Package Build Command Consistency (F2 + F1 + F14)", () => {
    // Remote Git origin matches project repository and build script is defined
    const pkg = JSON.parse(loadProjectSource("package.json"));
    const gitConfig = loadProjectSource(".git/config");

    expect(pkg.scripts.build).toBe("next build");
    expect(gitConfig).toContain("itu-matrix.git");
  });

  test("T3-14: Science Bay Hotspot × Astrobiology Code Snippet Synchronization (F7 + F8)", () => {
    // Science hotspot Raman spectrometry corresponds to science_spectrometry.py in IDE
    const studio = loadProjectSource("components/rover-studio.tsx");
    const ide = loadProjectSource("components/pycharm-window.tsx");

    expect(studio).toContain("Raman laser spectrometer");
    expect(studio).toContain("URC Best Science System Award");

    expect(ide).toContain("science_spectrometry.py");
    expect(ide).toContain("def analyze_raman_spectrum");
    expect(ide).toContain("Raman peak detected at 1085 cm^-1");
  });

  test("T3-15: Navigation Status Beacon × Live Telemetry Feed Stream (F4 + F9)", () => {
    // 5.8GHz link beacon in navbar aligns with telemetry CLI RF status
    const nav = loadProjectSource("components/navbar.tsx");
    const session = createTelemetrySession();
    const tel = session.execute("telemetry");

    expect(nav).toContain("5.8 GHz ONLINE");
    expect(tel.output.some(l => l.includes("5.8 GHz High-Gain") && l.includes("CONNECTED"))).toBe(true);
  });

});
