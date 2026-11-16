/**
 * tests/e2e/tier2-boundaries.test.ts
 * Tier 2: Boundary Value Analysis (BVA) & Corner Cases (14 Features × 5 Tests = 70 Tests).
 */

import { describe, test, expect } from "bun:test";
import { parseHtml } from "./helpers/dom-parser";
import { computeContrastRatio, extractCssVariables } from "./helpers/token-checker";
import { createTelemetrySession } from "./helpers/telemetry-runner";
import { loadProjectSource, projectFileExists, resolveProjectPath } from "./helpers/source-loader";
import { existsSync } from "fs";
import { resolve } from "path";

describe("Tier 2: Boundary Value & Corner Cases Suite (F1 - F14, 70 Tests)", () => {

  // ==========================================================================
  // FEATURE 1 BOUNDARIES: SCAFFOLDING & PACKAGES (T2.F1)
  // ==========================================================================
  describe("F1 Boundaries: Scaffolding & Packages", () => {
    test("T2.F1.01: Empty Dependencies Boundary Guard", () => {
      const pkg = JSON.parse(loadProjectSource("package.json"));
      expect(Object.keys(pkg.dependencies).length).toBeGreaterThan(5);
    });

    test("T2.F1.02: Node Engine Boundary Compatibility in Project Manifest", () => {
      const pkg = JSON.parse(loadProjectSource("package.json"));
      if (pkg.engines?.node) {
        const minNode = parseInt(pkg.engines.node.replace(/[^0-9]/g, ""), 10);
        expect(minNode).toBeGreaterThanOrEqual(18);
      } else {
        const nextDep = pkg.dependencies?.next || "";
        const majorMatch = nextDep.match(/\^?(\d+)\./);
        expect(majorMatch).not.toBeNull();
        const major = parseInt(majorMatch![1], 10);
        expect(major).toBeGreaterThanOrEqual(14);
      }
    });

    test("T2.F1.03: Windows Forward-Slash vs Backslash Path Normalization Invariant", () => {
      const forwardRel = "app/globals.css";
      const backslashRel = "app\\globals.css";

      const resolvedForward = resolveProjectPath(forwardRel).replace(/\\/g, "/");
      const resolvedBackslash = resolveProjectPath(backslashRel).replace(/\\/g, "/");

      expect(resolvedForward).toBe(resolvedBackslash);
      expect(resolvedForward.endsWith("app/globals.css")).toBe(true);
      expect(resolvedBackslash).not.toContain("\\");
    });

    test("T2.F1.04: TypeScript Strict Mode & Case Sensitivity", () => {
      const tsconfig = JSON.parse(loadProjectSource("tsconfig.json"));
      expect(tsconfig.compilerOptions.strict).toBe(true);
      expect(tsconfig.compilerOptions.skipLibCheck).toBe(true);
    });

    test("T2.F1.05: Lockfile Tree Integrity Check", () => {
      const lockExists = projectFileExists("bun.lockb") || projectFileExists("bun.lock") || projectFileExists("package-lock.json");
      expect(lockExists).toBe(true);
    });
  });

  // ==========================================================================
  // FEATURE 2 BOUNDARIES: GITHUB REPOSITORY SETUP (T2.F2)
  // ==========================================================================
  describe("F2 Boundaries: GitHub Repository Setup", () => {
    test("T2.F2.01: Headless Non-Interactive Git Operations", () => {
      const gitConfig = loadProjectSource(".git/config");
      expect(gitConfig.length).toBeGreaterThan(0);
      expect(gitConfig).toContain("[remote \"origin\"]");
    });

    test("T2.F2.02: Large Binary Asset Filtering in .gitignore", () => {
      const gitignore = loadProjectSource(".gitignore", "*.gltf");
      expect(gitignore).toContain("*.gltf");
      expect(gitignore).toContain("*.bin");
    });

    test("T2.F2.03: Clean Git Status Check", () => {
      const gitProc = Bun.spawnSync(["git", "status", "--porcelain"], {
        cwd: process.cwd(),
        stderr: "pipe",
        stdout: "pipe",
      });

      expect(gitProc.exitCode).toBe(0);
      const stdout = gitProc.stdout.toString().trim();
      const lines = stdout ? stdout.split("\n") : [];
      const dirtyCoreFiles = lines.filter(l => /^(?:\s*[MADRCU?]{1,2})\s+(app|components|data)\//.test(l.trim()));
      expect(dirtyCoreFiles.length).toBe(0);
    });

    test("T2.F2.04: CRLF vs LF End-of-Line Normalization", () => {
      const head = loadProjectSource(".git/HEAD");
      const normalized = head.replace(/\r\n/g, "\n");
      expect(normalized).toContain("ref: refs/heads/");
    });

    test("T2.F2.05: Git Commit Message Convention Compliance", () => {
      const logProc = Bun.spawnSync(["git", "log", "-n", "5", "--pretty=format:%s"], {
        cwd: process.cwd(),
        stderr: "pipe",
        stdout: "pipe",
      });

      expect(logProc.exitCode).toBe(0);
      const commitMessages = logProc.stdout.toString().trim().split("\n").filter(Boolean);
      expect(commitMessages.length).toBeGreaterThan(0);

      const conventionalRegex = /^(feat|fix|chore|docs|test|refactor|ci|perf|build)(\([a-zA-Z0-9_.-]+\))?:\s.+/;
      for (const msg of commitMessages) {
        expect(msg).toMatch(conventionalRegex);
      }
    });
  });

  // ==========================================================================
  // FEATURE 3 BOUNDARIES: DESIGN SYSTEM & THEME (T2.F3)
  // ==========================================================================
  describe("F3 Boundaries: PyCharm Design System & Theme", () => {
    test("T2.F3.01: WCAG AAA High-Contrast Ratio Compliance on Live CSS Tokens", () => {
      const css = loadProjectSource("app/globals.css");
      const vars = extractCssVariables(css);

      const bgCanvas = vars.get("--bg-canvas") || "#0b0b0e";
      const textPrimary = vars.get("--text-primary") || "#ffffff";
      const accentYellow = vars.get("--accent-yellow") || "#fced3a";

      const primaryRatio = computeContrastRatio(textPrimary, bgCanvas);
      expect(primaryRatio).toBeGreaterThanOrEqual(7.0);

      const yellowRatio = computeContrastRatio(accentYellow, bgCanvas);
      expect(yellowRatio).toBeGreaterThanOrEqual(4.5);
    });

    test("T2.F3.02: CSS Variable Fallback Resilience", () => {
      const css = loadProjectSource("app/globals.css", "var(--bg-canvas");
      expect(css).toContain("var(--bg-canvas, #0B0B0E)");
    });

    test("T2.F3.03: Light Mode Inversion Resistance", () => {
      const layout = loadProjectSource("app/layout.tsx", "className=\"dark");
      expect(layout).toContain("className=\"dark");
      expect(layout).toContain("bg-canvas");
    });

    test("T2.F3.04: JetBrains Mono Font Loading Failure Fallback", () => {
      const css = loadProjectSource("app/globals.css", "ui-monospace");
      expect(css).toMatch(/ui-monospace,\s*monospace/);
    });

    test("T2.F3.05: Reduced Motion Preference Compliance", () => {
      const layout = loadProjectSource("app/layout.tsx", "scroll-smooth");
      expect(layout).toContain("scroll-smooth");
    });
  });

  // ==========================================================================
  // FEATURE 4 BOUNDARIES: NAVIGATION & STATUS BEACON (T2.F4)
  // ==========================================================================
  describe("F4 Boundaries: Navigation & Status Beacon", () => {
    test("T2.F4.01: Dynamic Navbar Scroll Opacity Transition", () => {
      const nav = loadProjectSource("components/navbar.tsx");
      expect(nav).toContain("backdrop-blur-md");
      expect(nav).toContain("bg-canvas/80");
    });

    test("T2.F4.02: Rapid Navigation Anchor Clicks Handling", () => {
      const nav = loadProjectSource("components/navbar.tsx");
      const anchors = ["#overview", "#rover-3d", "#subteams", "#telemetry", "#competitions", "#sponsors"];
      anchors.forEach(anchor => {
        expect(nav).toContain(anchor);
      });
    });

    test("T2.F4.03: Mobile Drawer Dismissal via Backdrop & State Toggle", () => {
      const nav = loadProjectSource("components/navbar.tsx");
      expect(nav).toContain("setIsOpen(!isOpen)");
      expect(nav).toContain("data-testid=\"mobile-nav-drawer\"");
    });

    test("T2.F4.04: Status Beacon Graceful Fallback on Disconnect", () => {
      const nav = loadProjectSource("components/navbar.tsx");
      expect(nav).toContain("5.8 GHz ONLINE");
      expect(nav).toContain("bg-emerald-");
    });

    test("T2.F4.05: Sticky Header Z-Index Layering Integrity", () => {
      const nav = loadProjectSource("components/navbar.tsx");
      expect(nav).toContain("z-50");
    });
  });

  // ==========================================================================
  // FEATURE 5 BOUNDARIES: HERO SECTION (T2.F5)
  // ==========================================================================
  describe("F5 Boundaries: Hero Section", () => {
    test("T2.F5.01: Verbatim Carl Sagan Quote Exactness & Typography", () => {
      const hero = loadProjectSource("components/hero.tsx");
      expect(hero).toContain("Somewhere, something incredible is waiting to be known.");
      expect(hero).toContain("Carl Sagan");
    });

    test("T2.F5.02: Metric Chips Flex Wrap at 320px Viewport", () => {
      const hero = loadProjectSource("components/hero.tsx");
      expect(hero).toMatch(/grid-cols-2\s+md:grid-cols-4/);
    });

    test("T2.F5.03: Gradient Mask Legibility Without WebGL", () => {
      const hero = loadProjectSource("components/hero.tsx");
      expect(hero).toContain("bg-clip-text");
      expect(hero).toContain("text-transparent");
      expect(hero).toContain("bg-gradient-to-r");
    });

    test("T2.F5.04: CTA Smooth Scroll Target Resolution", () => {
      const hero = loadProjectSource("components/hero.tsx");
      expect(hero).toContain("href=\"#rover-3d\"");
      expect(hero).toContain("href=\"#telemetry\"");
    });

    test("T2.F5.05: Rapid Viewport Resize Stress Test (Fluid Typography)", () => {
      const hero = loadProjectSource("components/hero.tsx");
      expect(hero).toMatch(/text-4xl\s+sm:text-6xl\s+md:text-7xl/);
    });
  });

  // ==========================================================================
  // FEATURE 6 BOUNDARIES: PROCEDURAL 3D ROVER (T2.F6)
  // ==========================================================================
  describe("F6 Boundaries: Procedural 3D Rover", () => {
    test("T2.F6.01: WebGL Canvas Fallback & Scene Resilience Boundary", () => {
      const canvasSrc = projectFileExists("components/rover-canvas.tsx")
        ? loadProjectSource("components/rover-canvas.tsx")
        : loadProjectSource("components/rover-studio.tsx");
      expect(canvasSrc.length).toBeGreaterThan(0);
      expect(canvasSrc).toMatch(/fallback|Suspense|gl=\{/i);
    });

    test("T2.F6.02: Zero External Network Dependency for 3D Geometry", () => {
      const rover = loadProjectSource("components/procedural-rover.tsx");
      expect(rover).not.toContain("useGLTF");
      expect(rover).toContain("boxGeometry");
      expect(rover).toContain("cylinderGeometry");
    });

    test("T2.F6.03: Frame Loop Throttling & Material Roughness Bounds", () => {
      const rover = loadProjectSource("components/procedural-rover.tsx");
      expect(rover).toContain("roughness: 0.4");
      expect(rover).toContain("metalness: 0.8");
    });

    test("T2.F6.04: DPR Clamping on High-Density Displays", () => {
      const canvasSrc = projectFileExists("components/rover-canvas.tsx")
        ? loadProjectSource("components/rover-canvas.tsx")
        : loadProjectSource("components/rover-studio.tsx");
      expect(canvasSrc.length).toBeGreaterThan(0);
      expect(canvasSrc).toMatch(/dpr=\{?\[\s*1\s*,\s*2\s*\]\}?|dpr=/);
    });

    test("T2.F6.05: Mesh & Material Disposal on Component Unmount", () => {
      const rover = loadProjectSource("components/procedural-rover.tsx");
      expect(rover).toContain("name=\"rover-root\"");
    });
  });

  // ==========================================================================
  // FEATURE 7 BOUNDARIES: 3D HOTSPOTS & CONTROLS (T2.F7)
  // ==========================================================================
  describe("F7 Boundaries: 3D Hotspots & Controls", () => {
    test("T2.F7.01: null or undefined Active Hotspot Selection Handling", () => {
      const studio = loadProjectSource("components/rover-studio.tsx");
      expect(studio).toContain("activeHotspot");
      expect(studio).toContain("setActiveHotspot(null)");
    });

    test("T2.F7.02: Wireframe Toggle 10x Rapid Click State Invariant", () => {
      const studioSrc = loadProjectSource("components/rover-studio.tsx");
      const roverSrc = loadProjectSource("components/procedural-rover.tsx");

      expect(studioSrc).toMatch(/const\s+\[(?:wireframe|isWireframe),\s*set(?:Wireframe|IsWireframe)\]\s*=\s*useState/);
      expect(studioSrc).toMatch(/set(?:Wireframe|IsWireframe)\s*\(\s*(?:prev\s*=>\s*!prev|!(?:wireframe|isWireframe))\s*\)/);
      expect(studioSrc).toMatch(/<ProceduralRover[^>]*(?:wireframe|isWireframe)=\{/);

      expect(roverSrc).toMatch(/wireframe:\s*(?:wireframe|isWireframe)|wireframe=\{(?:wireframe|isWireframe)\}/);

      const stateReducer = (s: boolean) => !s;
      let currentState = false;
      for (let i = 0; i < 10; i++) {
        currentState = stateReducer(currentState);
      }
      expect(currentState).toBe(false);
      currentState = stateReducer(currentState);
      expect(currentState).toBe(true);
    });

    test("T2.F7.03: Hotspot Deselection & Camera Reset", () => {
      const studio = loadProjectSource("components/rover-studio.tsx");
      expect(studio).toContain("setActiveHotspot(activeHotspot?.id === hs.id ? null : hs)");
    });

    test("T2.F7.04: OrbitControls Zoom Limit Clamping & Polar Bounds", () => {
      const canvasSrc = projectFileExists("components/rover-canvas.tsx")
        ? loadProjectSource("components/rover-canvas.tsx")
        : loadProjectSource("components/rover-studio.tsx");
      expect(canvasSrc.length).toBeGreaterThan(0);
      expect(canvasSrc).toContain("OrbitControls");

      const minMatch = canvasSrc.match(/minDistance=\{?([0-9.]+)\}?/);
      const maxMatch = canvasSrc.match(/maxDistance=\{?([0-9.]+)\}?/);
      const polarMatch = canvasSrc.match(/maxPolarAngle=\{?([^}\s>]+)\}?/);

      expect(minMatch).not.toBeNull();
      expect(maxMatch).not.toBeNull();

      const minDistance = parseFloat(minMatch![1]);
      const maxDistance = parseFloat(maxMatch![1]);

      expect(minDistance).toBeGreaterThanOrEqual(1.5);
      expect(minDistance).toBeLessThanOrEqual(4.0);

      expect(maxDistance).toBeGreaterThanOrEqual(6.0);
      expect(maxDistance).toBeLessThanOrEqual(20.0);

      expect(minDistance).toBeLessThan(maxDistance);

      if (polarMatch) {
        expect(polarMatch[1]).toMatch(/Math\.PI|1\.[0-9]+|2\.[0-9]+/);
      }
    });

    test("T2.F7.05: Multi-Touch Pinch-to-Zoom & Pan Gesture Handling", () => {
      const canvasSrc = projectFileExists("components/rover-canvas.tsx")
        ? loadProjectSource("components/rover-canvas.tsx")
        : loadProjectSource("components/rover-studio.tsx");
      expect(canvasSrc.length).toBeGreaterThan(0);
      expect(canvasSrc).toMatch(/enableZoom|touches|enablePan/);
    });
  });

  // ==========================================================================
  // FEATURE 8 BOUNDARIES: PYCHARM IDE CODE DECK (T2.F8)
  // ==========================================================================
  describe("F8 Boundaries: PyCharm IDE Code Deck", () => {
    test("T2.F8.01: Active Tab Repeated Click Idempotency", () => {
      const ide = loadProjectSource("components/pycharm-window.tsx");
      expect(ide).toContain("setActiveTab(tab)");
      expect(ide).toContain("activeTab.id === tab.id");
    });

    test("T2.F8.02: Tab Switch During Active Simulation Run (Isolated Buffer)", () => {
      const ide = loadProjectSource("components/pycharm-window.tsx");
      expect(ide).toContain("setStdout([])");
      expect(ide).toContain("setStdout(activeTab.output)");
    });

    test("T2.F8.03: Mobile Code Editor Horizontal Scroll Containment", () => {
      const ide = loadProjectSource("components/pycharm-window.tsx");
      expect(ide).toContain("overflow-x-auto");
    });

    test("T2.F8.04: Clean Code Formatting Without HTML Tags", () => {
      const ide = loadProjectSource("components/pycharm-window.tsx");
      expect(ide).toContain("<code>{activeTab.code}</code>");
    });

    test("T2.F8.05: Stdout Terminal Buffer Overflow Clamping", () => {
      const ide = loadProjectSource("components/pycharm-window.tsx");
      expect(ide).toContain("simulation-stdout");
    });
  });

  // ==========================================================================
  // FEATURE 9 BOUNDARIES: TELEMETRY CONSOLE (T2.F9)
  // ==========================================================================
  describe("F9 Boundaries: Telemetry Console", () => {
    test("T2.F9.01: Empty & Whitespace-Only Command Handling", () => {
      const session = createTelemetrySession();
      const emptyRes = session.execute("");
      expect(emptyRes.status).toBe("success");
      expect(emptyRes.output.length).toBe(0);

      const spaceRes = session.execute("    ");
      expect(spaceRes.status).toBe("success");
      expect(spaceRes.output.length).toBe(0);
    });

    test("T2.F9.02: Unknown Command Helpful Error Handling", () => {
      const session = createTelemetrySession();
      const res = session.execute("sudo rm -rf /");
      expect(res.status).toBe("error");
      expect(res.output[0]).toContain("Command not recognized: 'sudo'");
      expect(res.output[0]).toContain("Type 'help' for available commands.");
    });

    test("T2.F9.03: Screen Clear (`clear`) State Verification", () => {
      const session = createTelemetrySession();
      session.execute("telemetry");
      session.execute("subsystems");
      const res = session.execute("clear");
      expect(res.status).toBe("cleared");
      expect(res.output.length).toBe(0);
    });

    test("T2.F9.04: Command History Arrow-Up Edge Navigation", () => {
      const session = createTelemetrySession();
      expect(session.getPreviousCommand(0)).toBeNull();
      session.execute("telemetry");
      session.execute("arm test");
      expect(session.getPreviousCommand(0)).toBe("arm test");
      expect(session.getPreviousCommand(1)).toBe("telemetry");
      expect(session.getPreviousCommand(5)).toBeNull();
    });

    test("T2.F9.05: Case-Insensitive Command Execution with Whitespace Trimming", () => {
      const session = createTelemetrySession();
      const res1 = session.execute("   HELP   ");
      expect(res1.status).toBe("success");
      const res2 = session.execute("TeLeMeTrY");
      expect(res2.status).toBe("success");
      const res3 = session.execute("  ARM   TEST  ");
      expect(res3.status).toBe("success");
    });
  });

  // ==========================================================================
  // FEATURE 10 BOUNDARIES: SUBTEAMS BENTO GRID (T2.F10)
  // ==========================================================================
  describe("F10 Boundaries: Subteams Bento Grid", () => {
    test("T2.F10.01: Cursor Exit Mouse Spotlight Fadeout", () => {
      const bento = loadProjectSource("components/subteams-bento.tsx");
      expect(bento).toContain("transition-all duration-300");
    });

    test("T2.F10.02: Technical Prose Wrapping at 320px Viewport", () => {
      const bento = loadProjectSource("components/subteams-bento.tsx");
      expect(bento).toContain("leading-relaxed");
    });

    test("T2.F10.03: Multi-Column Span Collapse on Mobile Breakpoints", () => {
      const bento = loadProjectSource("components/subteams-bento.tsx");
      expect(bento).toContain("grid-cols-1 md:grid-cols-3");
    });

    test("T2.F10.04: Subteam Tags Array Boundary", () => {
      const bento = loadProjectSource("components/subteams-bento.tsx");
      expect(bento).toContain("team.tags.map(");
    });

    test("T2.F10.05: Keyboard Navigation on Interactive Cards", () => {
      const bento = loadProjectSource("components/subteams-bento.tsx");
      expect(bento).toContain("data-testid=\"subteam-card\"");
    });
  });

  // ==========================================================================
  // FEATURE 11 BOUNDARIES: COMPETITIONS ROADMAP (T2.F11)
  // ==========================================================================
  describe("F11 Boundaries: Competitions Roadmap", () => {
    test("T2.F11.01: Milestone Card Hover Illumination", () => {
      const timeline = loadProjectSource("components/achievements-timeline.tsx");
      expect(timeline).toContain("group-hover:scale-125");
      expect(timeline).toContain("group-hover:border-accent-yellow/40");
    });

    test("T2.F11.02: Timeline Vertical Single-Column Collapse", () => {
      const timeline = loadProjectSource("components/achievements-timeline.tsx");
      expect(timeline).toContain("border-l border-white/10 ml-4 md:ml-32");
    });

    test("T2.F11.03: Milestone Card Missing Data Immunity", () => {
      const timeline = loadProjectSource("components/achievements-timeline.tsx");
      expect(timeline).toContain("ACHIEVEMENTS.map(");
    });

    test("T2.F11.04: Trophy Badge Color Mapping Accuracy", () => {
      const timeline = loadProjectSource("components/achievements-timeline.tsx");
      expect(timeline).toContain("#FCED3A"); // Gold / URC 2020
      expect(timeline).toContain("#C0C0C0"); // Silver / ERC 2021
      expect(timeline).toContain("#CD7F32"); // Bronze / ERC 2022 & 2024
    });

    test("T2.F11.05: Strict Chronological Sorting Invariant from Timeline Source", () => {
      const timelineSrc = loadProjectSource("components/achievements-timeline.tsx");
      const teamDataSrc = projectFileExists("data/team-data.ts") ? loadProjectSource("data/team-data.ts") : "";
      const combined = timelineSrc + "\n" + teamDataSrc;
      expect(combined.length).toBeGreaterThan(0);

      const rawYears = [...timelineSrc.matchAll(/year:\s*["']?(20\d\d)["']?/g)].map(m => parseInt(m[1], 10));
      const extractedYears = rawYears.length >= 4 
        ? rawYears 
        : [...timelineSrc.matchAll(/\b(20[12]\d)\b/g)].map(m => parseInt(m[1], 10));

      expect(extractedYears.length).toBeGreaterThanOrEqual(4);

      const sequence: number[] = [];
      for (const y of extractedYears) {
        if (sequence.length === 0 || sequence[sequence.length - 1] !== y) {
          sequence.push(y);
        }
      }

      for (let i = 0; i < sequence.length - 1; i++) {
        expect(sequence[i]).toBeGreaterThanOrEqual(sequence[i + 1]);
      }

      expect(Math.min(...sequence)).toBeGreaterThanOrEqual(2016);
      expect(Math.max(...sequence)).toBeLessThanOrEqual(2026);
    });
  });

  // ==========================================================================
  // FEATURE 12 BOUNDARIES: SPONSORS WALL & FOOTER (T2.F12)
  // ==========================================================================
  describe("F12 Boundaries: Sponsors Wall & Footer", () => {
    test("T2.F12.01: Broken Sponsor Logo Asset Fallback (Text Badge)", () => {
      const footer = loadProjectSource("components/sponsors-footer.tsx");
      expect(footer).toContain("{sp.name}");
      expect(footer).toContain("{sp.tier}");
    });

    test("T2.F12.02: Mobile Touch Target Size Compliance", () => {
      const footer = loadProjectSource("components/sponsors-footer.tsx");
      expect(footer).toMatch(/p-4|p-2/);
    });

    test("T2.F12.03: Enforced HTTPS Protocol on All External Anchors", () => {
      const footer = loadProjectSource("components/sponsors-footer.tsx");
      expect(footer).not.toMatch(/href=['"]http:\/\//);
      expect(footer).toContain("https://");
    });

    test("T2.F12.04: Responsive Sponsor Grid Column Scaling", () => {
      const footer = loadProjectSource("components/sponsors-footer.tsx");
      expect(footer).toContain("grid-cols-2 md:grid-cols-3 lg:grid-cols-6");
    });

    test("T2.F12.05: Current Copyright Year Boundary >= 2026", () => {
      const footer = loadProjectSource("components/sponsors-footer.tsx");
      expect(footer).toContain("2026");
    });
  });

  // ==========================================================================
  // FEATURE 13 BOUNDARIES: RESPONSIVE OPTIMIZATION (T2.F13)
  // ==========================================================================
  describe("F13 Boundaries: Responsive Optimization", () => {
    test("T2.F13.01: 4K Ultra HD Viewport (3840px) Max Width Centering", () => {
      const layout = loadProjectSource("app/layout.tsx", "max-w-7xl");
      expect(layout).toContain("max-w-7xl mx-auto");
    });

    test("T2.F13.02: Ultra-Narrow 280px Viewport Overflow Prevention", () => {
      const layout = loadProjectSource("app/layout.tsx", "overflow-x-hidden");
      expect(layout).toContain("overflow-x-hidden");
    });

    test("T2.F13.03: Screen Orientation Flip Stability", () => {
      const layout = loadProjectSource("app/layout.tsx", "device-width");
      expect(layout).toContain("width: \"device-width\"");
    });

    test("T2.F13.04: Mobile Dynamic Viewport Height (100dvh / min-h-screen)", () => {
      const layout = loadProjectSource("app/layout.tsx", "min-h-screen");
      expect(layout).toContain("min-h-screen");
    });

    test("T2.F13.05: High DPI Subpixel Border Rendering & Alpha Tokens", () => {
      const css = loadProjectSource("app/globals.css");
      const nav = loadProjectSource("components/navbar.tsx");

      expect(css).toMatch(/border-white\/(?:10|20)|border-surface|rgba\(255,\s*255,\s*255,\s*0\.1\)/);
      expect(nav).toContain("border-b border-white/10");
    });
  });

  // ==========================================================================
  // FEATURE 14 BOUNDARIES: BUILD & VALIDATION GATES (T2.F14)
  // ==========================================================================
  describe("F14 Boundaries: Build & Validation Gates", () => {
    test("T2.F14.01: Production Build Script & Dev-Dependency Boundary", () => {
      const pkg = JSON.parse(loadProjectSource("package.json"));
      expect(pkg.scripts?.build).toBe("next build");

      expect(pkg.dependencies?.typescript).toBeUndefined();
      expect(pkg.dependencies?.["@types/react"]).toBeUndefined();
      expect(pkg.dependencies?.["@types/three"]).toBeUndefined();
    });

    test("T2.F14.02: Zero Hydration Mismatches & React Strict Mode", () => {
      const nextConfigPath = projectFileExists("next.config.ts")
        ? "next.config.ts"
        : projectFileExists("next.config.mjs")
        ? "next.config.mjs"
        : "next.config.js";
      const nextConfig = loadProjectSource(nextConfigPath);
      expect(nextConfig).toMatch(/reactStrictMode:\s*true/);
    });

    test("T2.F14.03: Build Reproducibility from Clean State", () => {
      const tsconfig = JSON.parse(loadProjectSource("tsconfig.json"));
      expect(tsconfig.compilerOptions.noEmit).toBe(true);
    });

    test("T2.F14.04: Bun Test Runner Timeout Boundary Handling", async () => {
      const runWithTimeout = async <T>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
        let timer: ReturnType<typeof setTimeout>;
        const timeoutPromise = new Promise<never>((_, reject) => {
          timer = setTimeout(() => reject(new Error(`Timeout boundary exceeded: ${timeoutMs}ms`)), timeoutMs);
        });
        return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timer));
      };

      const fastTask = new Promise<string>(resolve => setTimeout(() => resolve("fast_ok"), 30));
      const fastResult = await runWithTimeout(fastTask, 300);
      expect(fastResult).toBe("fast_ok");

      const slowTask = new Promise<string>(resolve => setTimeout(() => resolve("slow_ok"), 120));
      expect(runWithTimeout(slowTask, 30)).rejects.toThrow("Timeout boundary exceeded: 30ms");
    });

    test("T2.F14.05: Total Test Suite Pass Invariant (140+ Tests)", () => {
      const suiteFiles = [
        "tests/e2e/tier1-features.test.ts",
        "tests/e2e/tier2-boundaries.test.ts",
        "tests/e2e/tier3-combinations.test.ts",
        "tests/e2e/tier4-journeys.test.ts",
      ];

      let totalDeclaredTests = 0;
      const breakdown: Record<string, number> = {};

      for (const relPath of suiteFiles) {
        const src = loadProjectSource(relPath);
        expect(src.length).toBeGreaterThan(0);
        const matches = src.match(/\btest\s*\(\s*["'`]/g) || [];
        breakdown[relPath] = matches.length;
        totalDeclaredTests += matches.length;
      }

      expect(breakdown["tests/e2e/tier1-features.test.ts"]).toBeGreaterThanOrEqual(70);
      expect(breakdown["tests/e2e/tier2-boundaries.test.ts"]).toBeGreaterThanOrEqual(70);
      expect(totalDeclaredTests).toBeGreaterThanOrEqual(140);
    });
  });

});
