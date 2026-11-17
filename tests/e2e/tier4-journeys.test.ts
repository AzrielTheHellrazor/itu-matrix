/**
 * tests/e2e/tier4-journeys.test.ts
 * Tier 4: Real-World Application Workload Journeys (6 Multi-Action End-to-End Scenarios).
 */

import { describe, test, expect } from "bun:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { existsSync, readFileSync } from "fs";
import { createJourneyHarness } from "./helpers/journey-runner";
import { parseHtml, ParsedNode } from "./helpers/dom-parser";
import { loadProjectSource, projectFileExists, resolveProjectPath } from "./helpers/source-loader";
import { createTelemetrySession } from "../../data/telemetry-commands";
import {
  TEAM_INFO,
  ROVER_MODELS,
  ACHIEVEMENTS,
  SUBTEAMS,
  SPONSORS,
  SOCIAL_LINKS,
  HERO_DATA,
  getLatestAchievements,
} from "../../data/team-data";
import { CODE_SNIPPETS, DARCULA_PALETTE, getSnippetById } from "../../data/code-snippets";
import { MotionProvider } from "../../components/motion-provider";
import { Navbar } from "../../components/navbar";
import { Hero } from "../../components/hero";
import { PyCharmWindow, tokenizePythonDarcula } from "../../components/pycharm-window";
import { TelemetryConsole } from "../../components/telemetry-console";
import { SubteamsBento } from "../../components/subteams-bento";
import { AchievementsTimeline } from "../../components/achievements-timeline";
import { SponsorsFooter } from "../../components/sponsors-footer";

function collectAllNodes(node: ParsedNode, out: ParsedNode[] = []): ParsedNode[] {
  out.push(node);
  for (const child of node.children) {
    collectAllNodes(child, out);
  }
  return out;
}

function getBuiltIndexHtml(): string {
  const htmlPath = resolveProjectPath(".next/server/app/index.html");
  if (!existsSync(htmlPath)) {
    const buildProc = Bun.spawnSync(["bun", "run", "build"], {
      cwd: resolveProjectPath("."),
      stdout: "pipe",
      stderr: "pipe",
    });
    if (buildProc.exitCode !== 0) {
      throw new Error(`next build failed: ${buildProc.stderr.toString()}`);
    }
  }
  expect(existsSync(htmlPath)).toBe(true);
  return readFileSync(htmlPath, "utf-8");
}

function renderWithMotion(element: React.ReactElement): string {
  return renderToStaticMarkup(React.createElement(MotionProvider, null, element));
}

function decodeHtmlEntities(input: string): string {
  return input
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");
}

describe("Tier 4: Real-World Application User Journey Suite (6 Scenarios)", () => {

  // ==========================================================================
  // SCENARIO 1: CAPTAIN INSPECTION JOURNEY
  // ==========================================================================
  test("Scenario 1: Captain Inspection Journey", async () => {
    const harness = createJourneyHarness("Captain Inspection Journey", "Team Captain", { width: 1440, height: 900 });

    await harness.runAll([
      {
        name: "Phase 1: Environment, Clean Git Config & Built SSR Shell",
        description: "Captain verifies package manifest, credential-free .git/config, and built SSR section structure",
        action: (state) => {
          expect(projectFileExists("package.json")).toBe(true);
          const pkg = JSON.parse(loadProjectSource("package.json"));
          expect(pkg.name).toBe("itu_matrix");
          expect(pkg.scripts.build).toBe("next build");

          const gitConfig = loadProjectSource(".git/config");
          expect(gitConfig).toContain("https://github.com/AzrielTheHellrazor/itu-matrix.git");
          expect(gitConfig).not.toMatch(/gh[opsu]_|https:\/\/[^@\s]+@/);

          state.renderedHtml = getBuiltIndexHtml();
          state.dom = parseHtml(state.renderedHtml);
        },
        assert: (state) => {
          const allNodes = collectAllNodes(state.dom!);
          const ids = new Set(
            allNodes.map((n) => n.getAttribute("id")).filter((id): id is string => Boolean(id))
          );
          for (const sec of ["overview", "rover-3d", "ide", "telemetry", "subteams", "competitions", "sponsors"]) {
            expect(ids.has(sec)).toBe(true);
          }
        },
      },
      {
        name: "Phase 2: Header, Online/Offline Beacon & Anchor Resolution",
        description: "Captain renders Navbar in online and offline modes and verifies every #anchor resolves in SSR DOM",
        action: (state) => {
          const builtIds = new Set(
            collectAllNodes(state.dom!)
              .map((n) => n.getAttribute("id"))
              .filter((id): id is string => Boolean(id))
          );

          const onlineHtml = renderWithMotion(React.createElement(Navbar));
          const offlineHtml = renderWithMotion(
            React.createElement(Navbar, { isOnline: false, statusText: "5.8 GHz OFFLINE" })
          );
          state.renderedHtml = onlineHtml;
          const navDom = parseHtml(onlineHtml);
          const offlineDom = parseHtml(offlineHtml);

          const onlineBeacon = navDom.findByTestId("status-beacon");
          const offlineBeacon = offlineDom.findByTestId("status-beacon");
          expect(onlineBeacon?.textContent).toContain("5.8 GHz ONLINE");
          expect(onlineHtml).toContain("bg-emerald-500");
          expect(offlineBeacon?.textContent).toContain("5.8 GHz OFFLINE");
          expect(offlineHtml).toContain("bg-zinc-500");

          const navLinks = navDom
            .findAllByTag("a")
            .map((a) => a.getAttribute("href"))
            .filter((h): h is string => Boolean(h && h.startsWith("#")));
          expect(navLinks.length).toBeGreaterThanOrEqual(7);
          for (const href of navLinks) {
            expect(builtIds.has(href.slice(1))).toBe(true);
          }
        },
        assert: (state) => {
          const navDom = parseHtml(state.renderedHtml!);
          expect(navDom.findByTestId("matrix-navbar")).not.toBeNull();
          expect(navDom.findByTestId("header-cta-console")?.textContent).toContain("Launch Console");
        },
      },
      {
        name: "Phase 3: Telemetry CLI Diagnostics & SSR Console Mount",
        description: "Captain executes real TelemetrySession commands and verifies TelemetryConsole initial SSR state",
        action: (state) => {
          const session = createTelemetrySession();
          const helpRes = session.execute("help");
          expect(helpRes.status).toBe("success");
          expect(helpRes.output.join(" ")).toContain("rovers");

          const telRes = session.execute("telemetry");
          expect(telRes.output.some((l) => l.includes("24.8V"))).toBe(true);
          expect(telRes.output.some((l) => l.includes("5.8 GHz"))).toBe(true);

          const subRes = session.execute("subsystems");
          expect(subRes.output.length).toBe(5);
          expect(subRes.output.every((l) => l.includes("[OK]"))).toBe(true);

          expect(session.execute("rovers").output.join(" ")).toContain("Matrix 2026");
          expect(session.execute("science").output.join(" ")).toContain("532nm");

          state.terminalHistory = session.getHistory();
          state.renderedHtml = renderWithMotion(React.createElement(TelemetryConsole));
          state.dom = parseHtml(state.renderedHtml);
        },
        assert: (state) => {
          expect(state.terminalHistory).toEqual(["help", "telemetry", "subsystems", "rovers", "science"]);
          const terminal = state.dom!.findByTestId("telemetry-terminal");
          expect(terminal).not.toBeNull();
          expect(terminal?.textContent).toContain("24.8V");
          expect(terminal?.textContent).toContain("5.8 GHz");
          expect(terminal?.textContent).toContain("MDRS Utah");
        },
      },
      {
        name: "Phase 4: PyCharm IDE SSR Tabs & Darcula Tokenization",
        description: "Captain renders PyCharmWindow, inspects all 4 snippet tabs, and verifies Darcula token fidelity",
        action: (state) => {
          state.renderedHtml = renderWithMotion(React.createElement(PyCharmWindow));
          state.dom = parseHtml(state.renderedHtml);
          for (const snippet of CODE_SNIPPETS) {
            const tokens = tokenizePythonDarcula(snippet.code);
            expect(tokens.map((t) => t.text).join("")).toBe(snippet.code);
          }
        },
        assert: (state) => {
          const tabs = state.dom!.findByTestId("code-tabs");
          expect(tabs).not.toBeNull();
          for (const snippet of CODE_SNIPPETS) {
            expect(tabs?.textContent).toContain(snippet.filename);
          }
          const codeMatch = state.renderedHtml!.match(/<pre[^>]*><code>([\s\S]*?)<\/code><\/pre>/);
          expect(codeMatch).not.toBeNull();
          expect(codeMatch![1]).toContain(`style="color:${DARCULA_PALETTE.keyword}"`);
          const stripped = decodeHtmlEntities(
            codeMatch![1].replace(/<\/?span(?:\s+style="color:#[0-9A-Fa-f]{6}")?>/g, "")
          );
          expect(stripped).toBe(CODE_SNIPPETS[0].code);
        },
      },
      {
        name: "Phase 5: SEO Metadata, OG Image & Crawl Configuration",
        description: "Captain verifies metadata, canonical link, robots.ts, sitemap.ts, and OG image asset",
        action: (state) => {
          state.renderedHtml = getBuiltIndexHtml();
          state.dom = parseHtml(state.renderedHtml);
        },
        assert: (state) => {
          const nodes = collectAllNodes(state.dom!);
          const title = nodes.find((n) => n.tag.toLowerCase() === "title");
          expect(title?.textContent).toContain("ITU MATRIX");
          const metas = nodes.filter((n) => n.tag.toLowerCase() === "meta");
          expect(metas.find((m) => m.getAttribute("name") === "description")?.getAttribute("content")).toBeTruthy();
          expect(metas.find((m) => m.getAttribute("property") === "og:image")?.getAttribute("content")).toContain("og-image.png");
          const canonical = nodes.find((n) => n.tag.toLowerCase() === "link" && n.getAttribute("rel") === "canonical");
          expect(canonical?.getAttribute("href")).toBeTruthy();
          expect(projectFileExists("public/og-image.png")).toBe(true);
          expect(projectFileExists("app/robots.ts")).toBe(true);
          expect(projectFileExists("app/sitemap.ts")).toBe(true);
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
        name: "Phase 1: Brand & Hero First Impression",
        description: "Sponsor renders Hero and cross-checks motto, status pill, and team branding against HERO_DATA & TEAM_INFO",
        action: (state) => {
          state.renderedHtml = renderWithMotion(React.createElement(Hero));
          state.dom = parseHtml(state.renderedHtml);
        },
        assert: (state) => {
          expect(state.dom!.findByTestId("hero-status-pill")?.textContent).toContain(HERO_DATA.statusPill);
          expect(state.dom!.findByTestId("hero-motto")?.textContent).toContain(TEAM_INFO.motto);
          expect(state.dom!.findByTestId("hero-motto")?.textContent).toContain(TEAM_INFO.mottoAuthor);
        },
      },
      {
        name: "Phase 2: Proven Competition Heritage",
        description: "Sponsor renders AchievementsTimeline and verifies descending chronology and URC/ERC podium records",
        action: (state) => {
          state.renderedHtml = renderWithMotion(React.createElement(AchievementsTimeline));
          state.dom = parseHtml(state.renderedHtml);
        },
        assert: (state) => {
          const timeline = state.dom!.findByTestId("achievements-timeline");
          expect(timeline).not.toBeNull();
          const latest = getLatestAchievements();
          for (let i = 0; i < latest.length - 1; i++) {
            expect(latest[i].year).toBeGreaterThanOrEqual(latest[i + 1].year);
          }
          expect(timeline?.textContent).toContain("University Rover Challenge (URC) World 3rd Place");
          expect(timeline?.textContent).toContain("European Rover Challenge (ERC) Silver Medal");
          expect(timeline?.textContent).toContain("Best Science System Award");
        },
      },
      {
        name: "Phase 3: Engineering Subteams Structure",
        description: "Sponsor renders SubteamsBento and validates all 5 subteam cards against SUBTEAMS data",
        action: (state) => {
          state.renderedHtml = renderWithMotion(React.createElement(SubteamsBento));
          state.dom = parseHtml(state.renderedHtml);
        },
        assert: (state) => {
          const cards = state.dom!.findAllByTestId("subteam-card");
          expect(cards.length).toBe(SUBTEAMS.length);
          const text = decodeHtmlEntities(state.dom!.textContent);
          for (const sub of SUBTEAMS) {
            expect(text).toContain(sub.name);
          }
          expect(text).toContain("PR, Sponsorship & Operations");
        },
      },
      {
        name: "Phase 4: Sponsors Wall & External Link Security",
        description: "Sponsor renders SponsorsFooter and audits every sponsor anchor for HTTPS, target=_blank, and rel attributes",
        action: (state) => {
          state.renderedHtml = renderWithMotion(React.createElement(SponsorsFooter));
          state.dom = parseHtml(state.renderedHtml);
        },
        assert: (state) => {
          const wall = state.dom!.findByTestId("sponsors-wall");
          expect(wall).not.toBeNull();
          const sponsorAnchors = wall!.findAllByTag("a");
          expect(sponsorAnchors.length).toBeGreaterThanOrEqual(SPONSORS.length);
          for (const a of sponsorAnchors) {
            expect(a.getAttribute("href")?.startsWith("https://")).toBe(true);
            expect(a.getAttribute("target")).toBe("_blank");
            expect(a.getAttribute("rel")).toContain("noopener");
            expect(a.getAttribute("rel")).toContain("noreferrer");
          }
          for (const sp of SPONSORS) {
            expect(wall?.textContent).toContain(sp.name);
          }
        },
      },
      {
        name: "Phase 5: ITU Institutional Governance & Advisor Credentials",
        description: "Sponsor verifies ITU establishment year, campus, and faculty advisor in rendered footer banner",
        action: (state) => {
          state.renderedHtml = renderWithMotion(React.createElement(SponsorsFooter));
          state.dom = parseHtml(state.renderedHtml);
        },
        assert: (state) => {
          const banner = state.dom!.findByTestId("footer-itu-banner");
          expect(banner).not.toBeNull();
          expect(banner?.textContent).toContain(TEAM_INFO.universityTr);
          expect(banner?.textContent).toContain(String(TEAM_INFO.universityEstablishedYear));
          expect(banner?.textContent).toContain("Ayazağa Campus");
          expect(banner?.textContent).toContain(TEAM_INFO.advisor.name);
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
        name: "Phase 1: Jury Scrutineering Entry Metrics",
        description: "Judge renders Hero and verifies all 4 metrics chips match HERO_DATA",
        action: (state) => {
          state.renderedHtml = renderWithMotion(React.createElement(Hero));
          state.dom = parseHtml(state.renderedHtml);
        },
        assert: (state) => {
          const chips = state.dom!.findByTestId("hero-metrics-chips");
          expect(chips).not.toBeNull();
          for (const chip of HERO_DATA.metricsChips) {
            expect(chips?.textContent).toContain(chip.text);
          }
          expect(chips?.textContent).toContain("99.4%");
        },
      },
      {
        name: "Phase 2: 3D Articulated Rover Geometry & Built Studio Stage",
        description: "Judge inspects built SSR RoverStudio DOM and procedural-rover.tsx assembly & PBR bounds",
        action: (state) => {
          state.renderedHtml = getBuiltIndexHtml();
          state.dom = parseHtml(state.renderedHtml);
        },
        assert: (state) => {
          const studioNode = state.dom!.findByTestId("rover-studio");
          expect(studioNode).not.toBeNull();
          expect(studioNode?.findByTestId("rover-canvas")).not.toBeNull();
          expect(studioNode?.findByTestId("hotspot-drawer")).not.toBeNull();
          expect(studioNode?.findByTestId("wireframe-toggle")?.textContent).toContain("Wireframe: OFF");
          expect(studioNode?.findByTestId("reset-view")).not.toBeNull();

          const roverSrc = loadProjectSource("components/procedural-rover.tsx");
          for (const group of [
            "chassis-main",
            "wheel-assembly",
            "robotic-arm-assembly",
            "mast-sensor-assembly",
            "science-bay-assembly",
          ]) {
            expect(roverSrc).toContain(group);
          }
          expect(roverSrc).toContain("roughness: 0.4");
          expect(roverSrc).toContain("metalness: 0.8");
        },
      },
      {
        name: "Phase 3: Subsystem Hotspot & CLI Telemetry Cross-Check",
        description: "Judge cross-checks RoverStudio hotspot labels/specs against live TelemetrySession arm & science output",
        action: (state) => {
          state.renderedHtml = getBuiltIndexHtml();
          state.dom = parseHtml(state.renderedHtml);
          const session = createTelemetrySession();
          const armOut = session.execute("arm test").output.join("\n");
          const sciOut = session.execute("science").output.join("\n");
          state.terminalHistory = session.getHistory();
          state.variables.armOut = armOut;
          state.variables.sciOut = sciOut;
        },
        assert: (state) => {
          const studioText = decodeHtmlEntities(state.dom!.findByTestId("rover-studio")?.textContent ?? "");
          for (const label of ["All View", "Robotic Arm", "Rocker-Bogie Chassis", "Mast & LiDAR", "Science Subsystem", "Autonomous Compute"]) {
            expect(studioText).toContain(label);
          }
          const studioSrc = loadProjectSource("components/rover-studio.tsx");
          expect(studioSrc).toContain('"Payload Capacity": "3.5 kg"');
          expect(studioSrc).toContain("532 nm");
          expect(state.variables.armOut).toContain("3.5kg Payload Capacity");
          expect(state.variables.sciOut).toContain("532nm");
        },
      },
      {
        name: "Phase 4: Award & Rover Lineage Validation",
        description: "Judge renders AchievementsTimeline and reconciles awards with ACHIEVEMENTS and ROVER_MODELS",
        action: (state) => {
          state.renderedHtml = renderWithMotion(React.createElement(AchievementsTimeline));
          state.dom = parseHtml(state.renderedHtml);
        },
        assert: (state) => {
          const text = state.dom!.findByTestId("achievements-timeline")?.textContent ?? "";
          for (const ach of ACHIEVEMENTS) {
            expect(text).toContain(String(ach.year));
          }
          expect(ROVER_MODELS.some((r) => r.name.includes("Altınay"))).toBe(true);
          expect(ROVER_MODELS.some((r) => r.name.includes("İnan"))).toBe(true);
          expect(text).toContain("Best Robotic Arm");
          expect(text).toContain("Best Science System Award");
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
        name: "Phase 1: Viewport Meta & Overflow Containment in Built SSR DOM",
        description: "Developer inspects built index.html for mobile viewport meta, overflow-x-hidden, and max-w-7xl bounds",
        action: (state) => {
          state.renderedHtml = getBuiltIndexHtml();
          state.dom = parseHtml(state.renderedHtml);
        },
        assert: (state) => {
          const nodes = collectAllNodes(state.dom!);
          const htmlEl = nodes.find((n) => n.tag.toLowerCase() === "html");
          const bodyEl = nodes.find((n) => n.tag.toLowerCase() === "body");
          const mainEl = nodes.find((n) => n.tag.toLowerCase() === "main");
          const viewportMeta = nodes.find(
            (n) => n.tag.toLowerCase() === "meta" && n.getAttribute("name") === "viewport"
          );
          expect(viewportMeta?.getAttribute("content")).toContain("width=device-width");
          expect(viewportMeta?.getAttribute("content")).toContain("initial-scale=1");
          expect(htmlEl?.hasClass("overflow-x-hidden")).toBe(true);
          expect(bodyEl?.hasClass("overflow-x-clip")).toBe(true);
          expect(mainEl?.hasClass("max-w-7xl")).toBe(true);
          expect(mainEl?.hasClass("mx-auto")).toBe(true);
        },
      },
      {
        name: "Phase 2: Mobile Navigation Button & Drawer Controls",
        description: "Developer renders Navbar and verifies responsive md:hidden mobile menu button ARIA contract",
        action: (state) => {
          state.renderedHtml = renderWithMotion(React.createElement(Navbar));
          state.dom = parseHtml(state.renderedHtml);
        },
        assert: (state) => {
          const btn = state.dom!.findByTestId("mobile-menu-button");
          expect(btn).not.toBeNull();
          expect(btn?.getAttribute("aria-controls")).toBe("mobile-nav-drawer");
          expect(btn?.getAttribute("aria-expanded")).toBe("false");
          expect(btn?.parent?.hasClass("md:hidden")).toBe(true);
        },
      },
      {
        name: "Phase 3: Mobile Hero 2x2 Metrics Grid",
        description: "Developer renders Hero and verifies mobile 2-column metrics grid and responsive headline classes",
        action: (state) => {
          state.renderedHtml = renderWithMotion(React.createElement(Hero));
          state.dom = parseHtml(state.renderedHtml);
        },
        assert: (state) => {
          const chips = state.dom!.findByTestId("hero-metrics-chips");
          expect(chips?.hasClass("grid-cols-2")).toBe(true);
          expect(chips?.hasClass("md:grid-cols-4")).toBe(true);
          const headline = state.dom!.findByTestId("hero-headline");
          expect(headline?.hasClass("max-w-full")).toBe(true);
          expect(headline?.hasClass("break-words")).toBe(true);
        },
      },
      {
        name: "Phase 4: Mobile 3D Canvas Height & Preset Wrapping",
        description: "Developer inspects built SSR RoverStudio for responsive canvas height classes",
        action: (state) => {
          state.renderedHtml = getBuiltIndexHtml();
          state.dom = parseHtml(state.renderedHtml);
        },
        assert: (state) => {
          const canvas = state.dom!.findByTestId("rover-canvas");
          expect(canvas).not.toBeNull();
          expect(canvas?.hasClass("h-[450px]")).toBe(true);
          expect(canvas?.hasClass("sm:h-[550px]")).toBe(true);
          expect(canvas?.hasClass("lg:h-[650px]")).toBe(true);
        },
      },
      {
        name: "Phase 5: Mobile Bento & Timeline Single-Column Reflow",
        description: "Developer renders SubteamsBento and AchievementsTimeline and verifies mobile grid/margin classes",
        action: (state) => {
          state.renderedHtml = renderWithMotion(
            React.createElement(
              React.Fragment,
              null,
              React.createElement(SubteamsBento),
              React.createElement(AchievementsTimeline)
            )
          );
          state.dom = parseHtml(state.renderedHtml);
        },
        assert: (state) => {
          const bento = state.dom!.findByTestId("subteams-bento");
          expect(bento?.hasClass("grid-cols-1")).toBe(true);
          expect(bento?.hasClass("md:grid-cols-3")).toBe(true);
          const timeline = state.dom!.findByTestId("achievements-timeline");
          expect(timeline?.hasClass("ml-4")).toBe(true);
          expect(timeline?.hasClass("md:ml-32")).toBe(true);
        },
      },
      {
        name: "Phase 6: Mobile Sponsors Grid Scaling",
        description: "Developer renders SponsorsFooter and verifies 2-column mobile sponsor grid scaling",
        action: (state) => {
          state.renderedHtml = renderWithMotion(React.createElement(SponsorsFooter));
          state.dom = parseHtml(state.renderedHtml);
        },
        assert: (state) => {
          const wall = state.dom!.findByTestId("sponsors-wall");
          const grids = wall!.findAllByClass("grid-cols-2");
          expect(grids.length).toBeGreaterThanOrEqual(1);
          expect(grids[0].hasClass("md:grid-cols-3")).toBe(true);
          expect(grids[0].hasClass("lg:grid-cols-6")).toBe(true);
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
        name: "Phase 1: Terminal SSR Initialization & Quick Action Buttons",
        description: "Engineer renders TelemetryConsole and verifies input, quick-command chips, and initial telemetry boot output",
        action: (state) => {
          state.renderedHtml = renderWithMotion(React.createElement(TelemetryConsole));
          state.dom = parseHtml(state.renderedHtml);
        },
        assert: (state) => {
          const term = state.dom!.findByTestId("telemetry-terminal");
          expect(term).not.toBeNull();
          expect(term?.findByTestId("console-input")).not.toBeNull();
          expect(term?.textContent).toContain("matrix@itu-rover");
          expect(term?.textContent).toContain("24.8V");
          const buttonTexts = term!.findAllByTag("button").map((b) => b.textContent);
          for (const cmd of ["help", "telemetry", "arm test", "subsystems", "science", "rovers", "clear"]) {
            expect(buttonTexts).toContain(cmd);
          }
        },
      },
      {
        name: "Phase 2: Help Discovery & Unknown Command Error Guard",
        description: "Engineer executes help and unknown commands on real TelemetrySession",
        action: (state) => {
          const session = createTelemetrySession();
          const helpRes = session.execute("help");
          const invalidRes = session.execute("unknown_sys_call");
          state.variables.helpRes = helpRes;
          state.variables.invalidRes = invalidRes;
          state.terminalHistory = session.getHistory();
        },
        assert: (state) => {
          expect(state.variables.helpRes.status).toBe("success");
          expect(state.variables.helpRes.output.join(" ")).toContain("rovers");
          expect(state.variables.invalidRes.status).toBe("error");
          expect(state.variables.invalidRes.output[0]).toContain("Command not recognized: 'unknown_sys_call'");
        },
      },
      {
        name: "Phase 3: Sensor Telemetry & Science Lab Streams",
        description: "Engineer queries telemetry and science commands on real TelemetrySession",
        action: (state) => {
          const session = createTelemetrySession();
          state.variables.tel = session.execute("telemetry");
          state.variables.sci = session.execute("science");
        },
        assert: (state) => {
          const telOut = state.variables.tel.output.join("\n");
          expect(telOut).toContain("5.8 GHz High-Gain");
          expect(telOut).toContain("24.8V Nominal");
          expect(telOut).toContain("MDRS Utah");
          const sciOut = state.variables.sci.output.join("\n");
          expect(sciOut).toContain("532nm");
          expect(sciOut).toContain("Biomarker");
        },
      },
      {
        name: "Phase 4: Subsystems & 6-DOF Arm Diagnostics + Invalid Subcommand",
        description: "Engineer runs subsystems, arm test (3.5kg), and invalid arm subcommand",
        action: (state) => {
          const session = createTelemetrySession();
          state.variables.sub = session.execute("subsystems");
          state.variables.arm = session.execute("arm test");
          state.variables.armErr = session.execute("arm calibrate");
        },
        assert: (state) => {
          expect(state.variables.sub.output.length).toBe(5);
          const armOut = state.variables.arm.output.join("\n");
          expect(armOut).toContain("J1 Base Yaw");
          expect(armOut).toContain("J6 End-Effector");
          expect(armOut).toContain("3.5kg Payload Capacity");
          expect(armOut).toContain("ARM STATUS: NOMINAL");
          expect(state.variables.armErr.status).toBe("error");
          expect(state.variables.armErr.output[0]).toContain("Usage: arm test");
        },
      },
      {
        name: "Phase 5: History Recall, Boundary Indices & Buffer Clearing",
        description: "Engineer tests getPreviousCommand recall, clear command, and clearHistory",
        action: (state) => {
          const session = createTelemetrySession();
          session.execute("telemetry");
          session.execute("arm test");
          state.variables.prev0 = session.getPreviousCommand(0);
          state.variables.prev1 = session.getPreviousCommand(1);
          state.variables.prevNeg = session.getPreviousCommand(-1);
          state.variables.clearRes = session.execute("clear");
          session.clearHistory();
          state.terminalHistory = session.getHistory();
        },
        assert: (state) => {
          expect(state.variables.prev0).toBe("arm test");
          expect(state.variables.prev1).toBe("telemetry");
          expect(state.variables.prevNeg).toBeNull();
          expect(state.variables.clearRes.status).toBe("cleared");
          expect(state.variables.clearRes.output.length).toBe(0);
          expect(state.terminalHistory).toEqual([]);
        },
      },
      {
        name: "Phase 6: Sensor Fusion Code Deck & Built Wireframe Control",
        description: "Engineer renders PyCharmWindow focused on sensor_fusion.py and inspects built wireframe-toggle DOM",
        action: (state) => {
          const sensorSnippet = getSnippetById("sensor-fusion")!;
          expect(sensorSnippet).toBeDefined();
          state.renderedHtml = renderWithMotion(
            React.createElement(PyCharmWindow, { snippets: [sensorSnippet] })
          );
          state.dom = parseHtml(state.renderedHtml);
          state.variables.builtDom = parseHtml(getBuiltIndexHtml());
        },
        assert: (state) => {
          expect(state.dom!.findByTestId("code-tabs")?.textContent).toContain("sensor_fusion.py");
          expect(state.dom!.textContent).toContain("ExtendedKalmanFilter");
          const wfBtn = (state.variables.builtDom as ParsedNode).findByTestId("wireframe-toggle");
          expect(wfBtn?.textContent).toContain("Wireframe: OFF");
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
        name: "Phase 1: Navbar & Hero Inspiration",
        description: "Visitor renders Navbar + Hero and verifies motto and #rover-3d / #telemetry CTAs",
        action: (state) => {
          state.renderedHtml = renderWithMotion(
            React.createElement(React.Fragment, null, React.createElement(Navbar), React.createElement(Hero))
          );
          state.dom = parseHtml(state.renderedHtml);
        },
        assert: (state) => {
          expect(state.dom!.textContent).toContain("Somewhere, something incredible is waiting to be known.");
          expect(state.dom!.findByTestId("hero-cta-inspect-3d")?.getAttribute("href")).toBe("#rover-3d");
          expect(state.dom!.findByTestId("hero-cta-console")?.getAttribute("href")).toBe("#telemetry");
        },
      },
      {
        name: "Phase 2: Built 3D Rover Studio & Idle Inspector Quick-Selects",
        description: "Visitor inspects built RoverStudio DOM controls, Mast & LiDAR preset, and idle hotspot drawer",
        action: (state) => {
          state.renderedHtml = getBuiltIndexHtml();
          state.dom = parseHtml(state.renderedHtml);
        },
        assert: (state) => {
          const studio = state.dom!.findByTestId("rover-studio");
          const studioText = decodeHtmlEntities(studio?.textContent ?? "");
          expect(studioText).toContain("3D Interactive Rover Studio");
          expect(studioText).toContain("Mast & LiDAR");
          expect(studio?.findByTestId("wireframe-toggle")?.textContent).toContain("Wireframe: OFF");
          expect(studio?.findByTestId("reset-view")).not.toBeNull();
          const drawer = studio?.findByTestId("hotspot-drawer");
          expect(drawer?.textContent).toContain("No Subsystem Selected");
          expect(drawer?.findAllByTag("button").length).toBeGreaterThanOrEqual(3);
        },
      },
      {
        name: "Phase 3: Subteams & Engineering Roles Discovery",
        description: "Visitor renders SubteamsBento and reads all 5 engineering division headings",
        action: (state) => {
          state.renderedHtml = renderWithMotion(React.createElement(SubteamsBento));
          state.dom = parseHtml(state.renderedHtml);
        },
        assert: (state) => {
          const headings = state.dom!.findAllByTag("h3").map((h) => decodeHtmlEntities(h.textContent));
          expect(headings.length).toBe(5);
          for (const sub of SUBTEAMS) {
            expect(headings.some((h) => h.includes(sub.name))).toBe(true);
          }
        },
      },
      {
        name: "Phase 4: Historical Achievements Discovery",
        description: "Visitor renders AchievementsTimeline and verifies URC/ERC podium cards",
        action: (state) => {
          state.renderedHtml = renderWithMotion(React.createElement(AchievementsTimeline));
          state.dom = parseHtml(state.renderedHtml);
        },
        assert: (state) => {
          const text = state.dom!.findByTestId("achievements-timeline")?.textContent ?? "";
          expect(text).toContain("URC 2020");
          expect(text).toContain("World 3rd Place");
          expect(text).toContain("ERC 2021");
          expect(text).toContain("Silver Medal");
        },
      },
      {
        name: "Phase 5: Sponsors & Official Social Channels",
        description: "Visitor renders SponsorsFooter and verifies all 5 SOCIAL_LINKS anchors with security attributes",
        action: (state) => {
          state.renderedHtml = renderWithMotion(React.createElement(SponsorsFooter));
          state.dom = parseHtml(state.renderedHtml);
        },
        assert: (state) => {
          const social = state.dom!.findByTestId("footer-social-links");
          expect(social).not.toBeNull();
          const anchors = social!.findAllByTag("a");
          expect(anchors.length).toBe(5);
          const hrefs = anchors.map((a) => a.getAttribute("href"));
          for (const expectedUrl of [
            SOCIAL_LINKS.github,
            SOCIAL_LINKS.instagram,
            SOCIAL_LINKS.linkedin,
            SOCIAL_LINKS.twitter,
            SOCIAL_LINKS.youtube,
          ]) {
            expect(hrefs).toContain(expectedUrl);
          }
          for (const a of anchors) {
            expect(a.getAttribute("target")).toBe("_blank");
            expect(a.getAttribute("rel")).toContain("noopener noreferrer");
          }
        },
      },
    ]);
  });

});
