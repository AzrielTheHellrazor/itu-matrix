/**
 * tests/e2e/helpers/source-loader.ts
 * Honest project source loader and path resolver for E2E requirement testing.
 * Strictly reads from the actual project workspace — ZERO synthetic fixture fallback.
 */

import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

/**
 * Returns the root directory of the project workspace.
 * Defaults to process.cwd(), with optional PROJECT_ROOT environment override.
 */
export function getProjectRoot(): string {
  const envRoot = process.env.PROJECT_ROOT;
  if (envRoot && envRoot.trim().length > 0) {
    return resolve(envRoot.trim());
  }
  return process.cwd();
}

/**
 * Resolves a relative path to an absolute path within the actual project workspace.
 * Normalized to forward slashes for cross-platform assertion consistency.
 */
export function resolveProjectPath(relPath: string): string {
  const normRel = relPath.replace(/\\/g, "/");
  const absPath = resolve(getProjectRoot(), normRel);
  return absPath.replace(/\\/g, "/");
}

/**
 * Checks whether a file exists strictly in the live project workspace.
 * Returns false if the file has not yet been implemented by the build track.
 * Does NOT check or fall back to any fixtures directory.
 */
export function projectFileExists(relPath: string): boolean {
  const normRel = relPath.replace(/\\/g, "/");
  const absPath = resolve(getProjectRoot(), normRel);
  return existsSync(absPath);
}

/**
 * Loads the verbatim content of a project file from the live workspace.
 * 
 * If the file does not exist, throws an explicit requirement failure error
 * documenting the missing implementation artifact and its expected workspace path.
 * 
 * If requiredMarker is provided and the file does not contain it, throws an
 * explicit requirement failure error indicating the missing specification token.
 * 
 * Under NO circumstances does this function fall back to synthetic mock fixtures.
 */
export function loadProjectSource(relPath: string, requiredMarker?: string): string {
  const normRel = relPath.replace(/\\/g, "/");
  const absPath = resolve(getProjectRoot(), normRel);
  const displayPath = absPath.replace(/\\/g, "/");

  if (!existsSync(absPath)) {
    throw new Error(
      `[Requirement Not Met] Expected project file "${normRel}" to exist at "${displayPath}", but it was not found. ` +
      `The file must be implemented by the implementation track before this requirement test can pass.`
    );
  }

  const content = readFileSync(absPath, "utf-8");

  if (requiredMarker && !content.includes(requiredMarker)) {
    throw new Error(
      `[Requirement Not Met] Project file "${normRel}" at "${displayPath}" does not contain required marker: "${requiredMarker}". ` +
      `The implementation must include this specification token to satisfy acceptance criteria.`
    );
  }

  return content;
}
