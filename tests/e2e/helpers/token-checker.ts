/**
 * tests/e2e/helpers/token-checker.ts
 * Design system, CSS variables, and WCAG contrast inspection utilities.
 */

import { readFileSync, existsSync } from "fs";
import { ParsedNode } from "./dom-parser";

export interface ColorTokenVerification {
  valid: boolean;
  actual: string | null;
  expected: string;
}

export interface DesignSystemAudit {
  valid: boolean;
  missingTokens: string[];
  mismatchedTokens: Array<{ token: string; expected: string; actual: string }>;
}

export const JETBRAINS_CORE_TOKENS: Record<string, string> = {
  "--bg-canvas": "#0B0B0E",
  "--bg-surface": "#111115",
  "--accent-cyan": "#21D4FD",
  "--accent-purple": "#AF52DE",
  "--accent-amber": "#F59E0B",
};

/**
 * Extracts CSS variables defined in :root or body blocks.
 */
export function extractCssVariables(cssContent: string): Map<string, string> {
  const vars = new Map<string, string>();
  const varRegex = /(--[a-zA-Z0-9\-]+)\s*:\s*([^;]+);/g;
  let match: RegExpExecArray | null;

  while ((match = varRegex.exec(cssContent)) !== null) {
    const key = match[1].trim();
    const val = match[2].trim().toLowerCase();
    vars.set(key, val);
  }

  return vars;
}

/**
 * Validates that globals.css contains the required JetBrains PyCharm obsidian palette tokens.
 */
export function auditGlobalsCss(cssPath: string): DesignSystemAudit {
  if (!existsSync(cssPath)) {
    return {
      valid: false,
      missingTokens: Object.keys(JETBRAINS_CORE_TOKENS),
      mismatchedTokens: [],
    };
  }

  const content = readFileSync(cssPath, "utf-8");
  const extracted = extractCssVariables(content);

  const missingTokens: string[] = [];
  const mismatchedTokens: Array<{
    token: string;
    expected: string;
    actual: string;
  }> = [];

  for (const [token, expectedHex] of Object.entries(JETBRAINS_CORE_TOKENS)) {
    if (!extracted.has(token)) {
      missingTokens.push(token);
    } else {
      const actual = extracted.get(token)!;
      if (!actual.includes(expectedHex.toLowerCase())) {
        mismatchedTokens.push({ token, expected: expectedHex, actual });
      }
    }
  }

  return {
    valid: missingTokens.length === 0 && mismatchedTokens.length === 0,
    missingTokens,
    mismatchedTokens,
  };
}

/**
 * Verifies that a DOM node contains a set of expected Tailwind classes.
 */
export function verifyTailwindClasses(
  node: ParsedNode,
  expectedClasses: string[]
): { valid: boolean; missing: string[] } {
  const missing = expectedClasses.filter((cls) => !node.hasClass(cls));
  return {
    valid: missing.length === 0,
    missing,
  };
}

/**
 * Computes WCAG 2.1 relative luminance for a hex color string (#RRGGBB).
 */
export function getRelativeLuminance(hex: string): number {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;

  const toLinear = (c: number) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  const R = toLinear(r);
  const G = toLinear(g);
  const B = toLinear(b);

  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

/**
 * Computes WCAG 2.1 contrast ratio between foreground and background hex colors.
 */
export function computeContrastRatio(fgHex: string, bgHex: string): number {
  const l1 = getRelativeLuminance(fgHex);
  const l2 = getRelativeLuminance(bgHex);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}
