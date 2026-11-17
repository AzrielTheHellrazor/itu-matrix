/**
 * tests/e2e/tier2-design-motion-a11y.test.ts
 * Tier 2: JetBrains Obsidian Palette, WCAG Contrast, Minimalism, Framer Motion & A11y.
 */

import { describe, test, expect } from "bun:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { loadProjectSource, projectFileExists, resolveProjectPath } from "./helpers/source-loader";
import {
  auditGlobalsCss,
  computeContrastRatio,
  extractCssVariables,
} from "./helpers/token-checker";
import { MotionProvider } from "../../components/motion-provider";

const COMPONENT_FILES = [
  "components/navbar.tsx",
  "components/hero.tsx",
  "components/crystal-lattice-viewport.tsx",
  "components/crystal-lattice-canvas.tsx",
  "components/crystal-lattice-model.tsx",
  "components/materials-showcase.tsx",
  "components/subteams-grid.tsx",
  "components/achievements-section.tsx",
  "components/minimal-footer.tsx",
];

describe("Tier 2: Obsidian Design Tokens, Contrast, Motion & Accessibility", () => {
  test("T2.01: auditGlobalsCss verifies JetBrains PyCharm obsidian palette without Darcula syntax tokens", () => {
    const audit = auditGlobalsCss(resolveProjectPath("app/globals.css"));
    expect(audit.valid).toBe(true);
    expect(audit.missingTokens).toEqual([]);
    expect(audit.mismatchedTokens).toEqual([]);

    const css = loadProjectSource("app/globals.css");
    expect(css).not.toContain("--syntax-keyword");
    expect(css).not.toContain("--syntax-string");
    expect(css).not.toContain("Roboto");
  });

  test("T2.02: WCAG 2.1 AA/AAA contrast ratios pass on both #0B0B0E canvas and #111115 surface", () => {
    const css = loadProjectSource("app/globals.css");
    const vars = extractCssVariables(css);
    const bgCanvas = vars.get("--bg-canvas")!;
    const bgSurface = vars.get("--bg-surface")!;
    const textPrimary = vars.get("--text-primary")!;
    const textSecondary = vars.get("--text-secondary")!;
    const textMuted = vars.get("--text-muted")!;
    const accentCyan = vars.get("--accent-cyan")!;
    const accentAmber = vars.get("--accent-amber")!;

    expect(computeContrastRatio(textPrimary, bgCanvas)).toBeGreaterThanOrEqual(7.0);
    expect(computeContrastRatio(textPrimary, bgSurface)).toBeGreaterThanOrEqual(7.0);
    expect(computeContrastRatio(textSecondary, bgCanvas)).toBeGreaterThanOrEqual(4.5);
    expect(computeContrastRatio(textSecondary, bgSurface)).toBeGreaterThanOrEqual(4.5);
    expect(computeContrastRatio(textMuted, bgCanvas)).toBeGreaterThanOrEqual(4.5);
    expect(computeContrastRatio(textMuted, bgSurface)).toBeGreaterThanOrEqual(4.5);
    expect(computeContrastRatio(accentCyan, bgCanvas)).toBeGreaterThanOrEqual(4.5);
    expect(computeContrastRatio(accentAmber, bgCanvas)).toBeGreaterThanOrEqual(4.5);
  });

  test("T2.03: No low-contrast text-zinc-600 or text-zinc-500 classes used in UI components", () => {
    for (const file of COMPONENT_FILES) {
      const src = loadProjectSource(file);
      expect(src).not.toMatch(/\btext-zinc-600\b/);
      expect(src).not.toMatch(/\btext-zinc-500\b/);
    }
  });

  test("T2.04: prefers-reduced-motion disables smooth scrolling and animation durations in globals.css", () => {
    const css = loadProjectSource("app/globals.css");
    expect(css).toMatch(/@media\s*\(\s*prefers-reduced-motion:\s*reduce\s*\)/);
    const reducedBlock = css.match(
      /@media\s*\(\s*prefers-reduced-motion:\s*reduce\s*\)\s*\{[\s\S]*\}/
    );
    expect(reducedBlock).not.toBeNull();
    expect(reducedBlock![0]).toContain("scroll-behavior: auto");
    expect(reducedBlock![0]).toContain("animation-duration");
    expect(reducedBlock![0]).toContain("transition-duration");
  });

  test("T2.05: MotionProvider enforces reducedMotion='user' and wraps RootLayout", () => {
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

    const rendered = renderToStaticMarkup(
      React.createElement(
        MotionProvider,
        null,
        React.createElement("div", { "data-motion-ready": "true" }, "ok")
      )
    );
    expect(rendered).toContain('data-motion-ready="true"');
  });

  test("T2.06: Interactive sections use genuine framer-motion primitives without heavy drop shadows", () => {
    const animatedComponents = [
      "components/navbar.tsx",
      "components/hero.tsx",
      "components/materials-showcase.tsx",
      "components/subteams-grid.tsx",
      "components/achievements-section.tsx",
      "components/minimal-footer.tsx",
    ];
    for (const file of animatedComponents) {
      const src = loadProjectSource(file);
      expect(src).toContain('from "framer-motion"');
      expect(src).toMatch(/\bmotion\./);
      expect(src).not.toMatch(/\bshadow-(md|lg|xl|2xl)\b/);
    }
  });

  test("T2.07: Navbar has 4 clean nav links, Escape dismissal, and mobile drawer post-exit scroll recovery", () => {
    const nav = loadProjectSource("components/navbar.tsx");
    expect(nav).toContain("<AnimatePresence");
    expect(nav).toContain('layoutId="navbar-active-pill"');
    expect(nav).toContain("pendingScrollIdRef");
    expect(nav).toContain("onExitComplete={handleDrawerExitComplete}");
    expect(nav).toContain('e.key === "Escape"');
    expect(nav).toContain("aria-expanded={isOpen}");
    expect(nav).toContain('aria-controls="mobile-nav-drawer"');
    expect(nav).toContain("prefers-reduced-motion: reduce");
    expect(nav).toContain('targetEl.scrollIntoView({ behavior, block: "start" })');

    for (const href of ["#research", "#subteams", "#achievements", "#partners"]) {
      expect(nav).toContain(`href: "${href}"`);
    }
    expect(nav).toContain('handleMobileAnchorClick(e, "#overview")');
    expect(nav).toContain('data-testid="lang-toggle"');
    expect(nav).toContain('data-testid="theme-toggle"');
  });

  test("T2.08: Focus rings and touch targets meet accessibility minimums across interactive elements", () => {
    const nav = loadProjectSource("components/navbar.tsx");
    expect(nav).not.toMatch(/\bfocus:outline-none\b/);
    expect(nav).toContain("focus-visible:ring-2");
    expect(nav).toContain("min-h-[44px]");

    const hero = loadProjectSource("components/hero.tsx");
    expect(hero).not.toMatch(/\bfocus:outline-none\b/);
    expect(hero).toContain("focus-visible:ring-2");
    expect(hero).toContain("min-h-[44px]");
    expect(hero).toContain("min-h-[28px]");

    const subteams = loadProjectSource("components/subteams-grid.tsx");
    expect(subteams).not.toContain("tabIndex={0}");
  });

  test("T2.09: Minimal page architecture — exactly 4 focused main sections and max 2 hero CTAs", () => {
    const pageSrc = loadProjectSource("app/page.tsx");
    expect(pageSrc).toContain("<Hero />");
    expect(pageSrc).toContain("<MaterialsShowcase />");
    expect(pageSrc).toContain("<SubteamsGrid />");
    expect(pageSrc).toContain("<AchievementsSection />");

    const heroSrc = loadProjectSource("components/hero.tsx");
    expect(heroSrc).toContain('data-testid="hero-cta-research"');
    expect(heroSrc).toContain('data-testid="hero-cta-subteams"');
    expect(heroSrc).toContain('layoutId="lattice-pill"');
    expect(heroSrc).toContain("max-w-full break-words");
  });

  test("T2.10: Layout loads Plus_Jakarta_Sans and JetBrains_Mono via next/font/google", () => {
    const layout = loadProjectSource("app/layout.tsx");
    expect(layout).toContain("Plus_Jakarta_Sans");
    expect(layout).toContain("JetBrains_Mono");
    expect(layout).toContain("next/font/google");
    expect(layout).toContain("--font-sans");
    expect(layout).toContain("--font-jetbrains-mono");
    expect(layout).toContain("overflow-x-clip");
  });

  test("T2.11: MinimalFooter renders clean academic affiliation without unrequested portal links", () => {
    const footer = loadProjectSource("components/minimal-footer.tsx");
    expect(footer).toContain('data-testid="minimal-footer"');
    expect(footer).not.toContain("İTÜ Portal");
    expect(footer).not.toContain("footer-mme-link");
  });

  test("T2.12: Horizontal overflow containment is enforced in globals.css and RootLayout", () => {
    const css = loadProjectSource("app/globals.css");
    expect(css).toContain("overflow-x: hidden;");
    expect(css).toContain("overflow-x: clip;");
    const layout = loadProjectSource("app/layout.tsx");
    expect(layout).toContain("overflow-x-hidden");
    expect(layout).toContain("overflow-x-clip");
  });
});
