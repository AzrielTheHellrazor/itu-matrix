/**
 * tests/e2e/tier5-adversarial.test.ts
 * Tier 5: Adversarial Coverage Hardening — Real Module Fuzzing, CSS/Token Audits,
 * Rendered SSR DOM Verification, WebGL/R3F Invariants & Accessibility Hygiene.
 */

import { describe, test, expect } from "bun:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { existsSync, readFileSync } from "fs";
import { parseHtml, ParsedNode } from "./helpers/dom-parser";
import {
  auditGlobalsCss,
  computeContrastRatio,
  extractCssVariables,
} from "./helpers/token-checker";
import {
  loadProjectSource,
  projectFileExists,
  resolveProjectPath,
} from "./helpers/source-loader";
import { createTelemetrySession } from "../../data/telemetry-commands";
import {
  CODE_SNIPPETS,
  DARCULA_PALETTE,
  getSnippetById,
} from "../../data/code-snippets";
import { MotionProvider } from "../../components/motion-provider";
import { Navbar } from "../../components/navbar";
import { tokenizePythonDarcula } from "../../components/pycharm-window";
import nextConfig from "../../next.config";

function collectAllNodes(node: ParsedNode, out: ParsedNode[] = []): ParsedNode[] {
  out.push(node);
  for (const child of node.children) {
    collectAllNodes(child, out);
  }
  return out;
}

function getRenderedIndexHtml(): string {
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

describe("Tier 5: Adversarial Hardening & Deep Verification Suite", () => {
  // ==========================================================================
  // FOCUS A: CSS, TOKENS, RENDERED SSR DOM, ACCESSIBILITY & LINK HYGIENE
  // ==========================================================================
  describe("Focus A: CSS, Tokens, Rendered DOM, A11y & SEO Hygiene", () => {
    test("T5.A1: auditGlobalsCss verifies all JetBrains PyCharm core CSS variables", () => {
      const result = auditGlobalsCss(resolveProjectPath("app/globals.css"));
      expect(result.valid).toBe(true);
      expect(result.missingTokens).toEqual([]);
      expect(result.mismatchedTokens).toEqual([]);
    });

    test("T5.A2: prefers-reduced-motion disables smooth scrolling and animation durations", () => {
      const css = loadProjectSource("app/globals.css");
      expect(css).toMatch(/@media\s*\(\s*prefers-reduced-motion:\s*reduce\s*\)/);
      const reducedBlockMatch = css.match(
        /@media\s*\(\s*prefers-reduced-motion:\s*reduce\s*\)\s*\{[\s\S]*\}/
      );
      expect(reducedBlockMatch).not.toBeNull();
      const block = reducedBlockMatch![0];
      expect(block).toContain("scroll-behavior: auto");
      expect(block).toContain("animation-duration");
      expect(block).toContain("transition-duration");
    });

    test("T5.A3: WCAG 2.1 AA/AAA contrast compliance across CSS foreground tokens on dark surfaces", () => {
      const css = loadProjectSource("app/globals.css");
      const vars = extractCssVariables(css);
      const bgCanvas = vars.get("--bg-canvas")!;
      const bgSurface = vars.get("--bg-surface")!;
      const textPrimary = vars.get("--text-primary")!;
      const textSecondary = vars.get("--text-secondary")!;
      const textMuted = vars.get("--text-muted")!;
      const accentYellow = vars.get("--accent-yellow")!;
      const accentCyan = vars.get("--accent-cyan")!;

      expect(computeContrastRatio(textPrimary, bgCanvas)).toBeGreaterThanOrEqual(7.0);
      expect(computeContrastRatio(textPrimary, bgSurface)).toBeGreaterThanOrEqual(7.0);
      expect(computeContrastRatio(textSecondary, bgCanvas)).toBeGreaterThanOrEqual(4.5);
      expect(computeContrastRatio(textSecondary, bgSurface)).toBeGreaterThanOrEqual(4.5);
      expect(computeContrastRatio(textMuted, bgCanvas)).toBeGreaterThanOrEqual(4.5);
      expect(computeContrastRatio(textMuted, bgSurface)).toBeGreaterThanOrEqual(4.5);
      expect(computeContrastRatio(accentYellow, bgCanvas)).toBeGreaterThanOrEqual(4.5);
      expect(computeContrastRatio(accentCyan, bgCanvas)).toBeGreaterThanOrEqual(4.5);
    });

    test("T5.A4: Rendered SSR HTML metadata, canonical, OpenGraph, Twitter & JetBrains Mono font", () => {
      const html = getRenderedIndexHtml();
      const root = parseHtml(html);
      const allNodes = collectAllNodes(root);

      const htmlEl = allNodes.find((n) => n.tag.toLowerCase() === "html");
      expect(htmlEl?.getAttribute("lang")).toBe("en");

      const titleEl = allNodes.find((n) => n.tag.toLowerCase() === "title");
      expect(titleEl?.textContent).toContain("ITU MATRIX");

      const metas = allNodes.filter((n) => n.tag.toLowerCase() === "meta");
      const hasMetaName = (name: string) =>
        metas.find((m) => m.getAttribute("name")?.toLowerCase() === name);
      const hasMetaProp = (prop: string) =>
        metas.find((m) => m.getAttribute("property")?.toLowerCase() === prop);

      expect(hasMetaName("description")?.getAttribute("content")?.length).toBeGreaterThan(20);
      expect(hasMetaProp("og:title")?.getAttribute("content")).toContain("ITU MATRIX");
      expect(hasMetaProp("og:image")?.getAttribute("content")).toContain("og-image.png");
      expect(hasMetaName("twitter:card")?.getAttribute("content")).toBe("summary_large_image");
      expect(hasMetaName("twitter:image")?.getAttribute("content")).toContain("og-image.png");

      const links = allNodes.filter((n) => n.tag.toLowerCase() === "link");
      const canonical = links.find((l) => l.getAttribute("rel") === "canonical");
      expect(canonical?.getAttribute("href")).toBeTruthy();

      const cssLinks = links
        .filter((l) => l.getAttribute("rel") === "stylesheet")
        .map((l) => l.getAttribute("href"))
        .filter((h): h is string => Boolean(h && h.startsWith("/_next/static/")));
      expect(cssLinks.length).toBeGreaterThan(0);
      const builtCss = cssLinks
        .map((href) => readFileSync(resolveProjectPath(".next" + href.replace("/_next", "")), "utf-8"))
        .join("\n");
      expect(builtCss).toContain("@font-face");
      expect(builtCss).toContain("--font-jetbrains-mono");
      expect(builtCss).toMatch(/jetbrains\s*mono/i);
    });

    test("T5.A5: Rendered SSR HTML resolves all 7 section IDs and every #anchor target", () => {
      const html = getRenderedIndexHtml();
      const root = parseHtml(html);
      const allNodes = collectAllNodes(root);

      const ids = new Set(
        allNodes.map((n) => n.getAttribute("id")).filter((id): id is string => Boolean(id))
      );

      const requiredSections = [
        "overview",
        "rover-3d",
        "ide",
        "telemetry",
        "subteams",
        "competitions",
        "sponsors",
      ];
      for (const sec of requiredSections) {
        expect(ids.has(sec)).toBe(true);
      }

      const anchorHrefs = allNodes
        .filter((n) => n.tag.toLowerCase() === "a")
        .map((a) => a.getAttribute("href"))
        .filter((href): href is string => Boolean(href && href.startsWith("#")));

      expect(anchorHrefs.length).toBeGreaterThanOrEqual(7);
      expect(anchorHrefs).toContain("#ide");
      for (const href of anchorHrefs) {
        const targetId = href.slice(1);
        expect(ids.has(targetId)).toBe(true);
      }
    });

    test("T5.A6: Rendered navbar ARIA attributes & sponsor external anchor security hygiene", () => {
      const html = getRenderedIndexHtml();
      const root = parseHtml(html);
      const allNodes = collectAllNodes(root);

      const mobileBtn = root.findByTestId("mobile-menu-button");
      expect(mobileBtn).not.toBeNull();
      expect(mobileBtn?.getAttribute("aria-expanded")).toBe("false");
      expect(mobileBtn?.getAttribute("aria-controls")).toBe("mobile-nav-drawer");

      const sponsorsWall = root.findByTestId("sponsors-wall");
      expect(sponsorsWall).not.toBeNull();
      const sponsorLinks = sponsorsWall!
        .findAllByTag("a")
        .map((a) => ({
          href: a.getAttribute("href") ?? "",
          target: a.getAttribute("target"),
          rel: a.getAttribute("rel") ?? "",
        }));

      expect(sponsorLinks.length).toBeGreaterThanOrEqual(10);
      for (const link of sponsorLinks) {
        expect(link.href.startsWith("https://")).toBe(true);
        expect(link.target).toBe("_blank");
        expect(link.rel).toContain("noopener");
        expect(link.rel).toContain("noreferrer");
        expect(link.href).not.toContain("makineciler.org");
      }
      expect(sponsorLinks.some((l) => l.href === "https://www.turkishmachinery.org")).toBe(true);

      const allHrefs = allNodes
        .filter((n) => n.tag.toLowerCase() === "a")
        .map((a) => a.getAttribute("href") ?? "");
      expect(allHrefs.some((h) => h.includes("makineciler.org"))).toBe(false);
    });

    test("T5.A7: Navbar accessibility, Escape dismissal, focus-visible rings & 150% font-scale flex safety", () => {
      const nav = loadProjectSource("components/navbar.tsx");
      expect(nav).toContain("aria-expanded={isOpen}");
      expect(nav).toContain('aria-controls="mobile-nav-drawer"');
      expect(nav).toContain('e.key === "Escape"');
      expect(nav).toContain('href="#ide"');
      expect(nav).toContain("flex-wrap");
      expect(nav).toContain("min-w-0");
      expect(nav).not.toMatch(/\bfocus:outline-none\b/);
      expect(nav).toContain("focus-visible:ring-2");

      const hero = loadProjectSource("components/hero.tsx");
      expect(hero).toContain("max-w-full");
      expect(hero).toContain("break-words");
    });

    test("T5.A8: Touch target dimensions (>= 24px), non-interactive tabIndex removal & AA text contrast", () => {
      const studio = loadProjectSource("components/rover-studio.tsx");
      expect(studio).toContain("min-h-[28px] min-w-[28px]");

      const consoleSrc = loadProjectSource("components/telemetry-console.tsx");
      expect(consoleSrc).toContain("min-h-[28px] min-w-[28px]");
      expect(consoleSrc).toContain("min-h-[28px] px-2.5 py-1");

      const bento = loadProjectSource("components/subteams-bento.tsx");
      expect(bento).not.toContain("tabIndex={0}");

      for (const file of [
        "components/hero.tsx",
        "components/rover-canvas.tsx",
        "components/rover-studio.tsx",
        "components/pycharm-window.tsx",
        "components/telemetry-console.tsx",
        "components/subteams-bento.tsx",
        "components/achievements-timeline.tsx",
        "components/sponsors-footer.tsx",
      ]) {
        const src = loadProjectSource(file);
        expect(src).not.toMatch(/\btext-zinc-600\b/);
      }
    });

    test("T5.A9: Font wiring, full-bleed layout shell, dead link removal, robots, sitemap & OG image", () => {
      const layout = loadProjectSource("app/layout.tsx");
      expect(layout).toContain("JetBrains_Mono");
      expect(layout).toContain("next/font/google");
      expect(layout).toContain('canonical: "/"');
      expect(layout).toContain("/og-image.png");
      expect(layout).toContain("<Navbar />");
      expect(layout).toContain("<SponsorsFooter />");
      expect(layout).toMatch(/<main[^>]*max-w-7xl mx-auto/);

      const teamData = loadProjectSource("data/team-data.ts");
      expect(teamData).not.toContain("rover.itu.edu.tr");
      expect(teamData).toContain('website: "https://github.com/itu-rover"');

      expect(projectFileExists("app/robots.ts") || projectFileExists("public/robots.txt")).toBe(true);
      expect(projectFileExists("app/sitemap.ts") || projectFileExists("public/sitemap.xml")).toBe(true);
      expect(projectFileExists("public/og-image.png")).toBe(true);
    });

    test("T5.A10: Genuine framer-motion Integration & MotionConfig Reduced Motion", () => {
      expect(projectFileExists("components/motion-provider.tsx")).toBe(true);
      const providerSrc = loadProjectSource("components/motion-provider.tsx");
      expect(providerSrc).toContain('"use client"');
      expect(providerSrc).toContain('from "framer-motion"');
      expect(providerSrc).toContain("MotionConfig");
      expect(providerSrc).toContain('reducedMotion="user"');

      const layoutSrc = loadProjectSource("app/layout.tsx");
      expect(layoutSrc).toContain('from "@/components/motion-provider"');
      expect(layoutSrc).toContain("<MotionProvider>");
      expect(layoutSrc).toContain("</MotionProvider>");

      const motionComponents = [
        "components/navbar.tsx",
        "components/hero.tsx",
        "components/rover-studio.tsx",
        "components/pycharm-window.tsx",
        "components/subteams-bento.tsx",
        "components/achievements-timeline.tsx",
        "components/sponsors-footer.tsx",
        "components/telemetry-console.tsx",
      ];
      for (const file of motionComponents) {
        const src = loadProjectSource(file);
        expect(src).toContain('from "framer-motion"');
        expect(src).toMatch(/\bmotion\./);
      }

      const navbarSrc = loadProjectSource("components/navbar.tsx");
      expect(navbarSrc).toContain("<AnimatePresence");
      expect(navbarSrc).toContain('layoutId="navbar-active-pill"');

      const studioSrc = loadProjectSource("components/rover-studio.tsx");
      expect(studioSrc).toContain('<AnimatePresence mode="wait">');

      const pycharmSrc = loadProjectSource("components/pycharm-window.tsx");
      expect(pycharmSrc).toContain('<AnimatePresence mode="wait">');
      expect(pycharmSrc).toContain('layoutId="pycharm-active-tab"');

      const ssrCheck = renderToStaticMarkup(
        React.createElement(
          MotionProvider,
          null,
          React.createElement("div", { "data-motion-root": "ok" }, "ready")
        )
      );
      expect(ssrCheck).toContain('data-motion-root="ok"');
    });

    test("T5.A11: allowedDevOrigins for 127.0.0.1 & Mobile Drawer Post-Exit Anchor Scroll Recovery", () => {
      expect(Array.isArray(nextConfig.allowedDevOrigins)).toBe(true);
      expect(nextConfig.allowedDevOrigins).toContain("127.0.0.1");
      expect(nextConfig.allowedDevOrigins).toContain("localhost");

      const navbarSrc = loadProjectSource("components/navbar.tsx");
      expect(navbarSrc).toContain("pendingScrollIdRef");
      expect(navbarSrc).toContain("onExitComplete={handleDrawerExitComplete}");
      expect(navbarSrc).toContain("e.preventDefault()");
      expect(navbarSrc).toContain('window.history.replaceState(null, "", href)');
      expect(navbarSrc).toContain("prefers-reduced-motion: reduce");
      expect(navbarSrc).toContain("targetEl.scrollIntoView({ behavior, block: \"start\" })");

      for (const href of [
        "#overview",
        "#rover-3d",
        "#ide",
        "#subteams",
        "#telemetry",
        "#competitions",
        "#sponsors",
      ]) {
        expect(navbarSrc).toContain(`handleMobileAnchorClick(e, "${href}"`);
      }

      const renderedNav = renderToStaticMarkup(
        React.createElement(MotionProvider, null, React.createElement(Navbar))
      );
      const navRoot = parseHtml(renderedNav);
      const mobileBtn = navRoot.findByTestId("mobile-menu-button");
      expect(mobileBtn).not.toBeNull();
      expect(mobileBtn?.getAttribute("aria-controls")).toBe("mobile-nav-drawer");
      expect(mobileBtn?.getAttribute("aria-expanded")).toBe("false");
    });
  });

  // ==========================================================================
  // FOCUS B: REAL MODULE FUZZING, DARCULA TOKENIZER, PYCHARM, WEBGL & CLI
  // ==========================================================================
  describe("Focus B: Real Telemetry, Code Snippets, Darcula, WebGL & Console State", () => {
    test("T5.B1: Real TelemetrySession supports all 7 commands with consistent 3.5kg arm payload", () => {
      const session = createTelemetrySession();
      const helpRes = session.execute("help");
      expect(helpRes.status).toBe("success");
      expect(helpRes.output.join("\n")).toContain("rovers");

      const roversRes = session.execute("rovers");
      expect(roversRes.status).toBe("success");
      const roversText = roversRes.output.join("\n");
      expect(roversText).toContain("Altınay Mars Kaşifi");
      expect(roversText).toContain("İnan");
      expect(roversText).toContain("Matrix 2026");

      const armRes = session.execute("arm test");
      expect(armRes.status).toBe("success");
      const armText = armRes.output.join("\n");
      expect(armText).toContain("3.5kg Payload Capacity");
      expect(armText).not.toContain("5.0kg");

      const studio = loadProjectSource("components/rover-studio.tsx");
      expect(studio).toContain('"Payload Capacity": "3.5 kg"');

      expect(session.execute("telemetry").status).toBe("success");
      expect(session.execute("subsystems").output.length).toBe(5);
      expect(session.execute("science").status).toBe("success");

      const clearRes = session.execute("clear");
      expect(clearRes.status).toBe("cleared");
      expect(clearRes.output).toEqual([]);
    });

    test("T5.B2: Real TelemetrySession guards empty, whitespace & non-string inputs without polluting history", () => {
      const session = createTelemetrySession();
      const emptyInputs: unknown[] = ["", "   ", "\t\n  ", null, undefined, 123, {}];

      for (const badInput of emptyInputs) {
        const res = session.execute(badInput as string);
        expect(res.status).toBe("success");
        expect(res.output).toEqual([]);
      }
      expect(session.getHistory()).toEqual([]);
    });

    test("T5.B3: Real TelemetrySession fuzzing (prototype keys, XSS payloads, 1000-char strings, arm subcommands)", () => {
      const session = createTelemetrySession();
      const adversarial = [
        "__proto__",
        "constructor",
        "toString",
        "<script>alert(1)</script>",
        "x".repeat(1000),
        "arm",
        "arm calibrate",
      ];

      for (const input of adversarial) {
        const res = session.execute(input);
        expect(res.status).toBe("error");
        expect(res.output.length).toBeGreaterThan(0);
      }

      expect(session.execute("  ARM   TEST  ").status).toBe("success");
      expect(session.execute("arm test --verbose").status).toBe("success");
    });

    test("T5.B4: Real TelemetrySession history boundary indices, defensive copies & clearHistory", () => {
      const session = createTelemetrySession();
      session.execute("help");
      session.execute("science");

      const copy = session.getHistory();
      expect(copy).toEqual(["help", "science"]);
      copy.push("mutated_entry");
      expect(session.getHistory()).toEqual(["help", "science"]);

      expect(session.getPreviousCommand(0)).toBe("science");
      expect(session.getPreviousCommand(1)).toBe("help");
      expect(session.getPreviousCommand(2)).toBeNull();
      expect(session.getPreviousCommand(-1)).toBeNull();
      expect(session.getPreviousCommand(0.5)).toBeNull();
      expect(session.getPreviousCommand(Number.NaN)).toBeNull();
      expect(session.getPreviousCommand(Number.POSITIVE_INFINITY)).toBeNull();

      session.clearHistory();
      expect(session.getHistory()).toEqual([]);
      expect(session.getPreviousCommand(0)).toBeNull();
    });

    test("T5.B5: Real CODE_SNIPPETS, DARCULA_PALETTE & getSnippetById contracts", () => {
      expect(CODE_SNIPPETS.length).toBe(4);
      expect(CODE_SNIPPETS.map((s) => s.filename)).toEqual([
        "autonomous_nav.py",
        "arm_kinematics.py",
        "sensor_fusion.py",
        "science_spectrometry.py",
      ]);

      for (const snippet of CODE_SNIPPETS) {
        expect(snippet.language).toBe("python");
        expect(snippet.code.length).toBeGreaterThan(50);
        expect(snippet.output[snippet.output.length - 1]).toBe(
          "Process finished with exit code 0"
        );
        expect(getSnippetById(snippet.id)).toEqual(snippet);
      }

      expect(getSnippetById("non-existent-id")).toBeUndefined();
      expect(Object.keys(DARCULA_PALETTE).sort()).toEqual([
        "comment",
        "function",
        "identifier",
        "keyword",
        "number",
        "string",
      ]);
    });

    test("T5.B6: Production tokenizePythonDarcula losslessness, edge cases & zero dangerouslySetInnerHTML", () => {
      for (const snippet of CODE_SNIPPETS) {
        const tokens = tokenizePythonDarcula(snippet.code);
        expect(tokens.map((t) => t.text).join("")).toBe(snippet.code);
        expect(tokens.some((t) => t.color === DARCULA_PALETTE.keyword)).toBe(true);
        expect(tokens.some((t) => t.color === DARCULA_PALETTE.function)).toBe(true);
        expect(tokens.some((t) => t.color === DARCULA_PALETTE.string)).toBe(true);
      }

      const edgeInputs = [
        "",
        "<script>alert(1)</script>",
        'unterminated = "abc',
        "val = 1e-5 + 3.14",
        '"""triple\nquoted\ndocstring"""',
        'rf"path={x}" + fr\'raw\'',
        "# İTÜ_rover\r\ndef görev():\r\n    return 42\r\n",
      ];

      for (const input of edgeInputs) {
        const tokens = tokenizePythonDarcula(input);
        expect(tokens.map((t) => t.text).join("")).toBe(input);
      }

      const ide = loadProjectSource("components/pycharm-window.tsx");
      expect(ide).not.toContain("dangerouslySetInnerHTML");
    });

    test("T5.B7: PyCharmWindow interval cleanup & async try/catch clipboard rejection handling", () => {
      const ide = loadProjectSource("components/pycharm-window.tsx");
      expect(ide).toContain("clearInterval(intervalRef.current)");
      expect(ide).toContain("clearTimeout(copyTimeoutRef.current)");
      expect(ide).toMatch(/const\s+handleCopyCode\s*=\s*async\s*\(/);
      expect(ide).toContain("await navigator.clipboard.writeText(currentCode)");
      expect(ide).toContain("catch");
      expect(ide).toContain("setCopied(false)");
    });

    test("T5.B8: RoverCanvas OrbitControls touch, polar angle & minDistance geometry invariants", () => {
      const canvas = loadProjectSource("components/rover-canvas.tsx");
      const studio = loadProjectSource("components/rover-studio.tsx");

      expect(canvas).toContain("THREE.TOUCH.ROTATE");
      expect(canvas).toContain("WebGLErrorBoundary");

      const minDist = parseFloat(canvas.match(/minDistance=\{([0-9.]+)\}/)![1]);
      const minPolar = parseFloat(canvas.match(/minPolarAngle=\{([0-9.]+)\}/)![1]);
      const maxPolarExpr = canvas.match(/maxPolarAngle=\{([^}]+)\}/)![1];
      const maxPolar = maxPolarExpr.includes("Math.PI / 2.05")
        ? Math.PI / 2.05
        : parseFloat(maxPolarExpr);

      expect(minPolar).toBeGreaterThan(0);

      const hotspotMatches = [
        ...studio.matchAll(
          /id:\s*"([^"]+)"[\s\S]*?position:\s*\[([^\]]+)\][\s\S]*?targetPosition:\s*\[([^\]]+)\]/g
        ),
      ];
      expect(hotspotMatches.length).toBe(5);

      for (const m of hotspotMatches) {
        const pos = m[2].split(",").map((v) => parseFloat(v.trim()));
        const cam = m[3].split(",").map((v) => parseFloat(v.trim()));
        const dx = cam[0] - pos[0];
        const dy = cam[1] - pos[1];
        const dz = cam[2] - pos[2];
        const dist = Math.hypot(dx, dy, dz);
        const polarAngle = Math.acos(dy / dist);

        expect(dist).toBeGreaterThanOrEqual(minDist);
        expect(polarAngle).toBeGreaterThanOrEqual(minPolar);
        expect(polarAngle).toBeLessThanOrEqual(maxPolar);
      }
    });

    test("T5.B9: CameraRig yielding, Reset View nonce, hidden hotspot tabIndex=-1 & tooltip clamping", () => {
      const canvas = loadProjectSource("components/rover-canvas.tsx");
      const studio = loadProjectSource("components/rover-studio.tsx");

      expect(canvas).toContain("isTransitioningRef.current = false;");
      expect(canvas).toContain("el.tabIndex = -1;");
      expect(canvas).toContain('el.setAttribute("aria-hidden", "true")');
      expect(canvas).toContain("el.tabIndex = 0;");
      expect(canvas).toContain('el.removeAttribute("aria-hidden")');
      expect(canvas).toContain("hotspotTooltipRefs");

      expect(studio).toContain("setResetNonce((n) => n + 1)");
      expect(studio).toContain("resetNonce={resetNonce}");
    });

    test("T5.B10: WebGL context-lost prevention, fallback UI & listener cleanup on unmount", () => {
      const canvas = loadProjectSource("components/rover-canvas.tsx");
      expect(canvas).toContain('dom.addEventListener("webglcontextlost", handleContextLost)');
      expect(canvas).toContain('dom.addEventListener("webglcontextrestored", handleContextRestored)');
      expect(canvas).toContain("event.preventDefault()");
      expect(canvas).toContain('data-testid="webgl-context-lost-fallback"');
      expect(canvas).toContain('dom.removeEventListener("webglcontextlost", handleContextLost)');
      expect(canvas).toContain('dom.removeEventListener("webglcontextrestored", handleContextRestored)');
    });

    test("T5.B11: TelemetryConsole state transition & XSS-safe JSX rendering invariants", () => {
      const consoleSrc = loadProjectSource("components/telemetry-console.tsx");
      expect(consoleSrc).toContain("setHistoryPointer(-1)");
      expect(consoleSrc).toContain('setInputVal("")');
      expect(consoleSrc).not.toContain("dangerouslySetInnerHTML");

      for (const cmd of [
        '"help"',
        '"telemetry"',
        '"arm test"',
        '"subsystems"',
        '"science"',
        '"rovers"',
        '"clear"',
      ]) {
        expect(consoleSrc).toContain(cmd);
      }
    });
  });
});
