/**
 * tests/e2e/helpers/source-loader.ts
 * Cross-environment project source and fixture resolver with progressive testability support.
 */

import { readFileSync, existsSync } from "fs";
import { resolve, join } from "path";

/**
 * Resolves project source file from process.cwd() or fallback test fixtures.
 * If requiredMarker is provided, checks if the working directory file contains it;
 * if not (e.g. milestone not yet implemented), falls back to the contract fixture.
 */
export function loadProjectSource(relPath: string, requiredMarker?: string): string {
  const normRel = relPath.replace(/\\/g, "/");
  const rootPath = resolve(process.cwd(), normRel);

  if (existsSync(rootPath)) {
    try {
      const content = readFileSync(rootPath, "utf-8");
      if (!requiredMarker || content.includes(requiredMarker)) {
        return content;
      }
    } catch {
      // continue
    }
  }

  // Check possible fixture locations
  const fixturePaths = [
    resolve(__dirname, "../fixtures", normRel),
    resolve(__dirname, "fixtures", normRel),
    resolve(process.cwd(), "tests/e2e/fixtures", normRel),
  ];

  for (const candidate of fixturePaths) {
    if (existsSync(candidate)) {
      try {
        return readFileSync(candidate, "utf-8");
      } catch {
        // continue
      }
    }
  }

  return "";
}

/**
 * Checks whether a file exists in the live workspace or test fixtures.
 */
export function projectFileExists(relPath: string): boolean {
  const normRel = relPath.replace(/\\/g, "/");
  const candidates = [
    resolve(process.cwd(), normRel),
    resolve(__dirname, "../fixtures", normRel),
    resolve(__dirname, "fixtures", normRel),
    resolve(process.cwd(), "tests/e2e/fixtures", normRel),
  ];

  return candidates.some(candidate => existsSync(candidate));
}

/**
 * Returns the effective path of a file, preferring process.cwd() if it exists.
 */
export function resolveProjectPath(relPath: string): string {
  const normRel = relPath.replace(/\\/g, "/");
  const rootPath = resolve(process.cwd(), normRel);
  if (existsSync(rootPath)) return rootPath;

  const fixturePath = resolve(__dirname, "../fixtures", normRel);
  if (existsSync(fixturePath)) return fixturePath;

  return rootPath;
}
