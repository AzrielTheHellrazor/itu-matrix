/**
 * tests/e2e/tier3-ssr-and-3d-lattice.test.ts
 * Tier 3: Built SSR HTML, renderToStaticMarkup, Real 3D Crystal Lattice Math & WebGL Invariants.
 */

import { describe, test, expect } from "bun:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { existsSync, readFileSync } from "fs";
import { parseHtml, ParsedNode } from "./helpers/dom-parser";
import { loadProjectSource, resolveProjectPath } from "./helpers/source-loader";
import {
  getLatticeGeometry,
  getLatticeSpec,
  type LatticeSystem,
} from "../../data/materials-data";
import { MotionProvider } from "../../components/motion-provider";
import { Navbar } from "../../components/navbar";
import { Hero } from "../../components/hero";
import { MaterialsShowcase } from "../../components/materials-showcase";
import { SubteamsGrid } from "../../components/subteams-grid";
import { AchievementsSection } from "../../components/achievements-section";
import { MinimalFooter } from "../../components/minimal-footer";

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
      throw new Error(
        `next build failed while generating index.html: ${buildProc.stderr.toString()}`
      );
    }
  }
  expect(existsSync(htmlPath)).toBe(true);
  return readFileSync(htmlPath, "utf-8");
}

describe("Tier 3: Built SSR HTML, React SSR Markup, 3D Lattice Math & WebGL Safety", () => {
  test("T3.01: Built SSR HTML has valid lang, title, metadata, canonical, and og:image -> /og-image.svg", () => {
    const html = getBuiltIndexHtml();
    const root = parseHtml(html);
    const allNodes = collectAllNodes(root);

    const htmlEl = allNodes.find((n) => n.tag.toLowerCase() === "html");
    expect(htmlEl?.getAttribute("lang")).toBe("en");

    const titleEl = allNodes.find((n) => n.tag.toLowerCase() === "title");
    expect(titleEl?.textContent).toContain("ITU MATRIX");
    expect(titleEl?.textContent).toContain("Metallurgy");

    const metas = allNodes.filter((n) => n.tag.toLowerCase() === "meta");
    const hasMetaName = (name: string) =>
      metas.find((m) => m.getAttribute("name")?.toLowerCase() === name);
    const hasMetaProp = (prop: string) =>
      metas.find((m) => m.getAttribute("property")?.toLowerCase() === prop);

    expect(hasMetaName("description")?.getAttribute("content")?.length).toBeGreaterThan(20);
    expect(hasMetaProp("og:title")?.getAttribute("content")).toContain("Metallurgy");
    expect(hasMetaProp("og:image")?.getAttribute("content")).toContain("og-image.svg");
    expect(hasMetaName("twitter:card")?.getAttribute("content")).toBe("summary_large_image");
    expect(hasMetaName("twitter:image")?.getAttribute("content")).toContain("og-image.svg");

    const links = allNodes.filter((n) => n.tag.toLowerCase() === "link");
    const canonical = links.find((l) => l.getAttribute("rel") === "canonical");
    expect(canonical?.getAttribute("href")).toBeTruthy();
  });

  test("T3.02: Built CSS stylesheets bundle @font-face for Plus Jakarta Sans and JetBrains Mono", () => {
    const html = getBuiltIndexHtml();
    const root = parseHtml(html);
    const allNodes = collectAllNodes(root);

    const cssLinks = allNodes
      .filter((n) => n.tag.toLowerCase() === "link" && n.getAttribute("rel") === "stylesheet")
      .map((l) => l.getAttribute("href"))
      .filter((h): h is string => Boolean(h && h.startsWith("/_next/static/")));

    expect(cssLinks.length).toBeGreaterThan(0);
    const builtCss = cssLinks
      .map((href) => readFileSync(resolveProjectPath(".next" + href.replace("/_next", "")), "utf-8"))
      .join("\n");

    expect(builtCss).toContain("@font-face");
    expect(builtCss).toContain("--font-jetbrains-mono");
    expect(builtCss).toMatch(/jetbrains\s*mono/i);
    expect(builtCss).toMatch(/plus\s*jakarta\s*sans/i);
  });

  test("T3.03: Built SSR HTML resolves every section ID and every #anchor target without Rover/IDE leaks", () => {
    const html = getBuiltIndexHtml();
    const root = parseHtml(html);
    const allNodes = collectAllNodes(root);

    const ids = new Set(
      allNodes.map((n) => n.getAttribute("id")).filter((id): id is string => Boolean(id))
    );

    for (const requiredId of ["overview", "research", "subteams", "achievements", "partners"]) {
      expect(ids.has(requiredId)).toBe(true);
    }

    const anchorHrefs = allNodes
      .filter((n) => n.tag.toLowerCase() === "a")
      .map((a) => a.getAttribute("href"))
      .filter((href): href is string => Boolean(href && href.startsWith("#")));

    expect(anchorHrefs.length).toBeGreaterThanOrEqual(5);
    for (const href of anchorHrefs) {
      expect(ids.has(href.slice(1))).toBe(true);
    }

    for (const banned of ["PyCharm", "Rover", "5.8 GHz", "Sagan", "Altınay", "URC", "ERC"]) {
      expect(html).not.toContain(banned);
    }
  });

  test("T3.04: Navbar renders cleanly with MotionProvider and valid mobile drawer ARIA attributes", () => {
    const html = renderToStaticMarkup(
      React.createElement(MotionProvider, null, React.createElement(Navbar))
    );
    const root = parseHtml(html);
    const mobileBtn = root.findByTestId("mobile-menu-button");
    expect(mobileBtn).not.toBeNull();
    expect(mobileBtn?.getAttribute("aria-expanded")).toBe("false");
    expect(mobileBtn?.getAttribute("aria-controls")).toBe("mobile-nav-drawer");
    expect(html).toContain("ITU MATRIX");
    expect(html).toContain("Materials R&amp;D Team");
  });

  test("T3.05: Hero renders 3D crystal lattice controls, SSR placeholder, and zero captions below canvas", () => {
    const html = renderToStaticMarkup(
      React.createElement(MotionProvider, null, React.createElement(Hero))
    );
    const root = parseHtml(html);
    expect(root.findByTestId("hero-section")).not.toBeNull();
    const stage = root.findByTestId("crystal-lattice-stage");
    expect(stage).not.toBeNull();
    expect(stage?.getAttribute("data-lattice-type")).toBe("MFC");
    expect(root.findByTestId("lattice-btn-BCC")).not.toBeNull();
    expect(root.findByTestId("lattice-btn-FCC")).not.toBeNull();
    expect(root.findByTestId("lattice-btn-HCP")).not.toBeNull();
    expect(root.findByTestId("lattice-reset-btn")).not.toBeNull();
    expect(root.findByTestId("lattice-pause-btn")).not.toBeNull();
    expect(root.findByTestId("lattice-ssr-placeholder")).not.toBeNull();
  });

  test("T3.06: MaterialsShowcase, SubteamsGrid, AchievementsSection, and MinimalFooter render complete content", () => {
    const html = renderToStaticMarkup(
      React.createElement(
        MotionProvider,
        null,
        React.createElement(
          React.Fragment,
          null,
          React.createElement(MaterialsShowcase),
          React.createElement(SubteamsGrid),
          React.createElement(AchievementsSection),
          React.createElement(MinimalFooter)
        )
      )
    );
    expect(html).toContain("MAT-01");
    expect(html).toContain("MAT-04");
    expect(html).toContain("Nanoclay Reinforced rPET/PP Microfibrillated Composites");
    expect(html).toContain("EELISA Special Award");
    expect(html).toContain("S. Gökberk Gök");
    expect(html).toContain("Prof. Dr. Murat Baydoğan");
    expect(html).toContain("Prof. Dr. Sebahattin Gürmen");
    expect(html).toContain("1773");
    expect(html).toContain("1961–1962");
    expect(html).toContain("1998");
    expect(html).toContain("Istanbul Technical University");
    expect(html).toContain("Ayazağa Campus, Maslak, Istanbul");
  });

  test("T3.07: getLatticeGeometry('BCC') returns 9 finite atoms (8 host + 1 center solute) and 20 edges", () => {
    const bcc = getLatticeGeometry("BCC");
    expect(bcc.atoms.length).toBe(9);
    expect(bcc.atoms.filter((a) => a.role === "host").length).toBe(8);
    expect(bcc.atoms.filter((a) => a.role === "solute").length).toBe(1);
    expect(bcc.edges.length).toBe(20);
    expect(bcc.edges.filter((e) => e.kind === "cell").length).toBe(12);
    expect(bcc.edges.filter((e) => e.kind === "bond").length).toBe(8);

    for (const atom of bcc.atoms) {
      expect(atom.position.every(Number.isFinite)).toBe(true);
    }
  });

  test("T3.08: getLatticeGeometry('FCC') returns 14 finite atoms (8 corners + 6 face centers) and 36 edges", () => {
    const fcc = getLatticeGeometry("FCC");
    expect(fcc.atoms.length).toBe(14);
    expect(fcc.atoms.filter((a) => a.role === "host").length).toBe(8);
    expect(fcc.atoms.filter((a) => a.role === "solute").length).toBe(6);
    expect(fcc.edges.length).toBe(36);
    expect(fcc.edges.filter((e) => e.kind === "cell").length).toBe(12);
    expect(fcc.edges.filter((e) => e.kind === "bond").length).toBe(24);
  });

  test("T3.09: getLatticeGeometry('HCP') returns 17 finite atoms (14 basal + 3 mid-plane) and 48 edges", () => {
    const hcp = getLatticeGeometry("HCP");
    expect(hcp.atoms.length).toBe(17);
    expect(hcp.atoms.filter((a) => a.role === "host").length).toBe(14);
    expect(hcp.atoms.filter((a) => a.role === "solute").length).toBe(3);
    expect(hcp.edges.length).toBe(48);

    for (const edge of hcp.edges) {
      const len = Math.hypot(
        edge.end[0] - edge.start[0],
        edge.end[1] - edge.start[1],
        edge.end[2] - edge.start[2]
      );
      expect(Number.isFinite(len)).toBe(true);
      expect(len).toBeGreaterThan(0.1);
    }
  });

  test("T3.10: getLatticeSpec and getLatticeGeometry resolve BCC, FCC, HCP and consistently fall back to BCC", () => {
    for (const sys of ["BCC", "FCC", "HCP"] as LatticeSystem[]) {
      const spec = getLatticeSpec(sys);
      expect(spec.id).toBe(sys);
    }
    const unexpected = "SC" as unknown as LatticeSystem;
    expect(getLatticeSpec(unexpected).id).toBe("BCC");
    expect(getLatticeGeometry(unexpected)).toEqual(getLatticeGeometry("BCC"));
  });

  test("T3.11: CrystalLatticeCanvas enforces OrbitControls bounds, touch rotation, and offline studio lighting", () => {
    const canvas = loadProjectSource("components/crystal-lattice-canvas.tsx");
    expect(canvas).toContain("THREE.TOUCH.ROTATE");
    expect(canvas).toContain("enablePan={false}");
    expect(canvas).toContain("dpr={[1, 2]}");
    expect(canvas).not.toContain("<Environment");
    expect(canvas).not.toContain("useGLTF");

    const minDist = parseFloat(canvas.match(/minDistance=\{([0-9.]+)\}/)![1]);
    const maxDist = parseFloat(canvas.match(/maxDistance=\{([0-9.]+)\}/)![1]);
    const minPolar = parseFloat(canvas.match(/minPolarAngle=\{([0-9.]+)\}/)![1]);
    expect(minDist).toBeGreaterThan(1.0);
    expect(maxDist).toBeGreaterThan(minDist);
    expect(minPolar).toBeGreaterThan(0);
    expect(canvas).toContain("maxPolarAngle={Math.PI - 0.2}");
  });

  test("T3.12: CrystalLatticeCanvas handles WebGLErrorBoundary and webglcontextlost/restored cleanup", () => {
    const canvas = loadProjectSource("components/crystal-lattice-canvas.tsx");
    expect(canvas).toContain("WebGLErrorBoundary");
    expect(canvas).toContain('data-testid="webgl-error-fallback"');
    expect(canvas).toMatch(/dom\.addEventListener\(\s*"webglcontextlost",\s*handleContextLost\s*\)/);
    expect(canvas).toMatch(/dom\.addEventListener\(\s*"webglcontextrestored",\s*handleContextRestored\s*\)/);
    expect(canvas).toContain("event.preventDefault()");
    expect(canvas).toContain('data-testid="webgl-context-lost-fallback"');
    expect(canvas).toMatch(/dom\.removeEventListener\(\s*"webglcontextlost",\s*handleContextLost\s*\)/);
    expect(canvas).toMatch(/dom\.removeEventListener\(\s*"webglcontextrestored",\s*handleContextRestored\s*\)/);
  });

  test("T3.13: CameraRig yields on OrbitControls onStart and resets via CrystalLatticeViewport nonce", () => {
    const canvas = loadProjectSource("components/crystal-lattice-canvas.tsx");
    expect(canvas).toContain("isTransitioningRef.current = false;");
    expect(canvas).toContain("if (resetNonce > 0)");
    const viewport = loadProjectSource("components/crystal-lattice-viewport.tsx");
    expect(viewport).toContain("onResetNonce={resetNonce}");
    const hero = loadProjectSource("components/hero.tsx");
    expect(hero).toContain("setResetNonce((n) => n + 1)");
    expect(hero).toContain("resetNonce={resetNonce}");
  });

  test("T3.14: CrystalLatticeModel memoizes geometries, disposes on unmount, and respects useReducedMotion", () => {
    const model = loadProjectSource("components/crystal-lattice-model.tsx");
    expect(model).toContain("useMemo");
    expect(model).toContain("geometries.hostAtom.dispose()");
    expect(model).toContain("geometries.soluteAtom.dispose()");
    expect(model).toContain("geometries.bondStrut.dispose()");
    expect(model).toContain("geometries.cellStrut.dispose()");
    expect(model).toContain("useReducedMotion");
    expect(model).toContain("if (!groupRef.current || isPaused || prefersReducedMotion) return;");
    expect(model).not.toContain("useGLTF");
  });

  test("T3.15: CrystalLatticeModel R3F primitives contain ZERO hyphenated DOM data-* props (prevents R3F commitUpdate crash)", () => {
    const model = loadProjectSource("components/crystal-lattice-model.tsx");
    const r3fPrimitives = [
      "group",
      "mesh",
      "sphereGeometry",
      "cylinderGeometry",
      "meshStandardMaterial",
    ];

    const extractOpeningTags = (source: string, tagName: string): string[] => {
      const tags: string[] = [];
      const matcher = new RegExp(`<${tagName}(?=[\\s>/])`, "g");
      let match: RegExpExecArray | null;
      while ((match = matcher.exec(source)) !== null) {
        let idx = match.index + match[0].length;
        let braceDepth = 0;
        let quote: '"' | "'" | "`" | null = null;
        while (idx < source.length) {
          const ch = source[idx];
          const prev = idx > 0 ? source[idx - 1] : "";
          if (quote) {
            if (ch === quote && prev !== "\\") quote = null;
          } else {
            if (ch === '"' || ch === "'" || ch === "`") {
              quote = ch;
            } else if (ch === "{") {
              braceDepth++;
            } else if (ch === "}") {
              braceDepth = Math.max(0, braceDepth - 1);
            } else if (ch === ">" && braceDepth === 0) {
              tags.push(source.slice(match.index, idx + 1));
              break;
            }
          }
          idx++;
        }
      }
      return tags;
    };

    let inspectedCount = 0;
    for (const primitive of r3fPrimitives) {
      const openingTags = extractOpeningTags(model, primitive);
      inspectedCount += openingTags.length;
      for (const tag of openingTags) {
        expect(tag).not.toMatch(/\sdata-[a-z0-9-]+\s*=/i);
      }
    }

    expect(inspectedCount).toBeGreaterThanOrEqual(7);
    expect(model).toContain("name={`lattice-model-${latticeType}`}");
    expect(model).not.toContain("data-testid=");
  });
});
