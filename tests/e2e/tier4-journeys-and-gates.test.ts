/**
 * tests/e2e/tier4-journeys-and-gates.test.ts
 * Tier 4: 4 Multi-Step User Journeys + TypeScript / ESLint / Next Build Gates.
 */

import { describe, test, expect } from "bun:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { existsSync, readFileSync } from "fs";
import { parseHtml } from "./helpers/dom-parser";
import { createJourneyHarness } from "./helpers/journey-runner";
import {
  loadProjectSource,
  projectFileExists,
  resolveProjectPath,
} from "./helpers/source-loader";
import {
  CLUB_INFO,
  LATTICE_SPECS,
  RESEARCH_PROJECTS,
  getLatticeGeometry,
} from "../../data/materials-data";
import { MotionProvider } from "../../components/motion-provider";
import { Navbar } from "../../components/navbar";
import { Hero } from "../../components/hero";
import { MaterialsShowcase } from "../../components/materials-showcase";
import { SubteamsGrid } from "../../components/subteams-grid";
import { AchievementsSection } from "../../components/achievements-section";
import { MinimalFooter } from "../../components/minimal-footer";
import nextConfig from "../../next.config";

describe("Tier 4: Multi-Step User Journeys & Build/Type/Lint Gates", () => {
  test("T4.01: Journey 1 — Visitor Discovery (Navbar -> Hero -> Materials Showcase)", async () => {
    const harness = createJourneyHarness("Visitor Discovery", "Prospective Student");
    await harness.runAll([
      {
        name: "Render Landing Shell",
        description: "Render Navbar + Hero inside MotionProvider",
        action: (s) => {
          s.renderedHtml = renderToStaticMarkup(
            React.createElement(
              MotionProvider,
              null,
              React.createElement(
                React.Fragment,
                null,
                React.createElement(Navbar),
                React.createElement(Hero),
                React.createElement(MaterialsShowcase)
              )
            )
          );
          s.dom = parseHtml(s.renderedHtml);
        },
        assert: (s) => {
          expect(s.dom?.findByTestId("matrix-navbar")).not.toBeNull();
          expect(s.dom?.findByTestId("hero-section")).not.toBeNull();
          expect(s.dom?.findByTestId("research-section")).not.toBeNull();
        },
      },
      {
        name: "Verify Materials Domain Focus",
        description: "Confirm hero and research copy reflect Metallurgy & Materials Science",
        action: () => {},
        assert: (s) => {
          expect(s.renderedHtml).toContain("Metallurgy &amp; Materials Science");
          expect(s.renderedHtml).toContain("Engineering Matter from Atomic Lattice");
          expect(s.renderedHtml).toContain("MAT-01");
        },
      },
    ]);
    expect(harness.getBreadcrumbs().length).toBe(2);
  });

  test("T4.02: Journey 2 — Materials Researcher Inspection (BCC -> FCC -> HCP lattice geometries)", async () => {
    const harness = createJourneyHarness(
      "Materials Researcher Inspection",
      "Metallurgy Researcher"
    );
    await harness.runAll([
      {
        name: "Inspect Default BCC Lattice",
        description: "Verify BCC geometry & spec",
        action: (s) => {
          s.activeLattice = "BCC";
          s.variables.geom = getLatticeGeometry("BCC");
        },
        assert: (s) => {
          const geom = s.variables.geom as ReturnType<typeof getLatticeGeometry>;
          expect(geom.atoms.length).toBe(9);
          expect(LATTICE_SPECS[0].coordinationNumber).toBe(8);
        },
      },
      {
        name: "Switch to FCC & HCP Unit Cells",
        description: "Verify FCC and HCP geometries remain deterministic and finite",
        action: (s) => {
          s.activeLattice = "FCC";
          s.variables.fcc = getLatticeGeometry("FCC");
          s.activeLattice = "HCP";
          s.variables.hcp = getLatticeGeometry("HCP");
        },
        assert: (s) => {
          const fcc = s.variables.fcc as ReturnType<typeof getLatticeGeometry>;
          const hcp = s.variables.hcp as ReturnType<typeof getLatticeGeometry>;
          expect(fcc.atoms.length).toBe(14);
          expect(hcp.atoms.length).toBe(17);
          expect(RESEARCH_PROJECTS.length).toBe(4);
        },
      },
    ]);
    expect(harness.getBreadcrumbs().length).toBe(2);
  });

  test("T4.03: Journey 3 — Academic Partner & SEO Verification", async () => {
    const harness = createJourneyHarness(
      "Partner & SEO Verification",
      "Faculty / Industry Partner"
    );
    await harness.runAll([
      {
        name: "Verify Heritage & Footer Attribution",
        description: "Render AchievementsSection and MinimalFooter",
        action: (s) => {
          s.renderedHtml = renderToStaticMarkup(
            React.createElement(
              MotionProvider,
              null,
              React.createElement(
                React.Fragment,
                null,
                React.createElement(AchievementsSection),
                React.createElement(MinimalFooter)
              )
            )
          );
          s.dom = parseHtml(s.renderedHtml);
        },
        assert: (s) => {
          expect(s.dom?.findByTestId("achievements-section")).not.toBeNull();
          expect(s.dom?.findByTestId("minimal-footer")).not.toBeNull();
          expect(s.renderedHtml).toContain("Istanbul Technical University");
          expect(s.renderedHtml).toContain("Ayazağa Campus, Maslak, Istanbul");
          expect(s.renderedHtml).toContain("1773");
          expect(s.renderedHtml).toContain("1961–1962");
        },
      },
      {
        name: "Verify Robots, Sitemap & SVG OG Asset",
        description: "Confirm SEO routes and clean Metallurgy og-image.svg exist",
        action: () => {},
        assert: () => {
          expect(projectFileExists("app/robots.ts")).toBe(true);
          expect(projectFileExists("app/sitemap.ts")).toBe(true);
          expect(projectFileExists("public/og-image.svg")).toBe(true);
          const og = loadProjectSource("public/og-image.svg");
          expect(og).toContain("METALLURGY &amp; MATERIALS SCIENCE");
        },
      },
    ]);
  });

  test("T4.04: Journey 4 — Mobile 320px Walkthrough & Localhost allowedDevOrigins", async () => {
    const harness = createJourneyHarness("Mobile 320px Walkthrough", "Mobile Visitor", {
      width: 320,
      height: 568,
    });
    await harness.runAll([
      {
        name: "Verify Mobile Drawer & Single-Column Reflow",
        description: "Check responsive grid classes and drawer ARIA on full render",
        action: (s) => {
          s.renderedHtml = renderToStaticMarkup(
            React.createElement(
              MotionProvider,
              null,
              React.createElement(
                React.Fragment,
                null,
                React.createElement(Navbar),
                React.createElement(Hero),
                React.createElement(MaterialsShowcase),
                React.createElement(SubteamsGrid),
                React.createElement(AchievementsSection),
                React.createElement(MinimalFooter)
              )
            )
          );
          s.dom = parseHtml(s.renderedHtml);
        },
        assert: (s) => {
          const btn = s.dom?.findByTestId("mobile-menu-button");
          expect(btn).not.toBeNull();
          expect(btn?.getAttribute("aria-controls")).toBe("mobile-nav-drawer");
          expect(s.renderedHtml).toContain("grid-cols-1");
          expect(nextConfig.allowedDevOrigins).toContain("127.0.0.1");
        },
      },
    ]);
  });

  test("T4.05: TypeScript strict type-checking (bunx tsc --noEmit) passes with exit code 0", () => {
    const proc = Bun.spawnSync(["bunx", "tsc", "--noEmit"], {
      cwd: resolveProjectPath("."),
      stdout: "pipe",
      stderr: "pipe",
    });
    if (proc.exitCode !== 0) {
      throw new Error(
        `tsc --noEmit failed:\n${proc.stdout.toString()}\n${proc.stderr.toString()}`
      );
    }
    expect(proc.exitCode).toBe(0);
  });

  test("T4.06: ESLint (bun run lint) passes with exit code 0", () => {
    const proc = Bun.spawnSync(["bun", "run", "lint"], {
      cwd: resolveProjectPath("."),
      stdout: "pipe",
      stderr: "pipe",
    });
    if (proc.exitCode !== 0) {
      throw new Error(
        `eslint failed:\n${proc.stdout.toString()}\n${proc.stderr.toString()}`
      );
    }
    expect(proc.exitCode).toBe(0);
  });

  test("T4.07: Production Next.js build output (.next/server/app/index.html) is present and valid", () => {
    const htmlPath = resolveProjectPath(".next/server/app/index.html");
    if (!existsSync(htmlPath)) {
      const buildProc = Bun.spawnSync(["bun", "run", "build"], {
        cwd: resolveProjectPath("."),
        stdout: "pipe",
        stderr: "pipe",
      });
      if (buildProc.exitCode !== 0) {
        throw new Error(
          `bun run build failed:\n${buildProc.stdout.toString()}\n${buildProc.stderr.toString()}`
        );
      }
    }
    expect(existsSync(htmlPath)).toBe(true);
    const html = readFileSync(htmlPath, "utf-8");
    expect(html).toContain("ITU MATRIX");
    expect(html).toContain("Engineering Matter from Atomic Lattice");
  });
});
