/**
 * tests/e2e/tier1-domain-and-env.test.ts
 * Tier 1: Environment, Git Hygiene, Negative Banned-Artifact Gate, and Materials Data Integrity.
 */

import { describe, test, expect } from "bun:test";
import { existsSync, readdirSync, readFileSync, statSync } from "fs";
import { join } from "path";
import {
  loadProjectSource,
  projectFileExists,
  resolveProjectPath,
} from "./helpers/source-loader";
import {
  CLUB_INFO,
  HERITAGE_MILESTONES,
  LAB_FOCUS_AREAS,
  LATTICE_SPECS,
  RESEARCH_PROJECTS,
  SUBTEAMS,
} from "../../data/materials-data";

function collectSourceFiles(dirRelPaths: string[]): Array<{ path: string; content: string }> {
  const results: Array<{ path: string; content: string }> = [];
  const walk = (absDir: string, relBase: string) => {
    if (!existsSync(absDir)) return;
    for (const entry of readdirSync(absDir)) {
      const absPath = join(absDir, entry);
      const relPath = `${relBase}/${entry}`;
      const st = statSync(absPath);
      if (st.isDirectory()) {
        walk(absPath, relPath);
      } else if (/\.(ts|tsx|css|svg|md|mjs)$/.test(entry)) {
        results.push({ path: relPath, content: readFileSync(absPath, "utf-8") });
      }
    }
  };
  for (const rel of dirRelPaths) {
    walk(resolveProjectPath(rel), rel);
  }
  return results;
}

describe("Tier 1: Environment, Git Hygiene, Banned-Artifact Gate & Materials Data", () => {
  test("T1.01: package.json contains required Next 16, React 19, R3F, Three, and Framer Motion deps", () => {
    const pkg = JSON.parse(loadProjectSource("package.json")) as {
      dependencies: Record<string, string>;
      scripts: Record<string, string>;
    };
    expect(pkg.dependencies.next).toBeDefined();
    expect(pkg.dependencies.react).toBeDefined();
    expect(pkg.dependencies.three).toBeDefined();
    expect(pkg.dependencies["@react-three/fiber"]).toBeDefined();
    expect(pkg.dependencies["@react-three/drei"]).toBeDefined();
    expect(pkg.dependencies["framer-motion"]).toBeDefined();
    expect(pkg.scripts.build).toBe("next build");
    expect(pkg.scripts.lint).toBe("eslint");
  });

  test("T1.02: tsconfig.json enforces strict mode and next.config.ts configures allowedDevOrigins & Three transpilation", () => {
    const tsconfig = JSON.parse(loadProjectSource("tsconfig.json")) as {
      compilerOptions: { strict: boolean; paths: Record<string, string[]> };
    };
    expect(tsconfig.compilerOptions.strict).toBe(true);
    expect(tsconfig.compilerOptions.paths["@/*"]).toEqual(["./*"]);

    const nextCfg = loadProjectSource("next.config.ts");
    expect(nextCfg).toContain("reactStrictMode: true");
    expect(nextCfg).toContain('allowedDevOrigins: ["127.0.0.1", "localhost"]');
    expect(nextCfg).toContain('transpilePackages: ["three"]');
  });

  test("T1.03: Git remote targets itu-matrix.git with zero plaintext credentials in .git/config", () => {
    const gitConfig = readFileSync(resolveProjectPath(".git/config"), "utf-8");
    expect(gitConfig).toContain("itu-matrix.git");
    for (const prefix of ["ghp_", "github_pat_", "gho_", "ghu_", "ghs_"]) {
      expect(gitConfig).not.toContain(prefix);
    }
  });

  test("T1.04: Recent git commit messages follow Conventional Commits", () => {
    const logProc = Bun.spawnSync(["git", "log", "-n", "5", "--pretty=format:%s"], {
      cwd: resolveProjectPath("."),
      stdout: "pipe",
      stderr: "pipe",
    });
    expect(logProc.exitCode).toBe(0);
    const subjects = logProc.stdout
      .toString()
      .trim()
      .split("\n")
      .filter(Boolean);
    expect(subjects.length).toBeGreaterThan(0);
    const ccPattern =
      /^(feat|fix|chore|build|refactor|docs|test|ci|perf)(\([a-z0-9\-/,]+\))?:\s+\S+/;
    for (const subject of subjects) {
      expect(subject).toMatch(ccPattern);
    }
  });

  test("T1.05: Obsolete Rover, PyCharm IDE, and Telemetry CLI files are completely deleted", () => {
    const deletedFiles = [
      "components/pycharm-window.tsx",
      "components/telemetry-console.tsx",
      "components/procedural-rover.tsx",
      "components/rover-studio.tsx",
      "components/rover-canvas.tsx",
      "components/subteams-bento.tsx",
      "components/achievements-timeline.tsx",
      "components/sponsors-footer.tsx",
      "data/code-snippets.ts",
      "data/telemetry-commands.ts",
      "data/team-data.ts",
      "public/og-image.png",
    ];
    for (const relPath of deletedFiles) {
      expect(projectFileExists(relPath)).toBe(false);
    }
  });

  test("T1.06: Negative banned-artifact & unverified-claim gate across app/, components/, data/, and OG SVG", () => {
    const files = collectSourceFiles(["app", "components", "data"]);
    files.push({
      path: "public/og-image.svg",
      content: loadProjectSource("public/og-image.svg"),
    });

    const bannedTokens = [
      "PyCharmWindow",
      "TelemetryConsole",
      "ProceduralRover",
      "RoverStudio",
      "RoverCanvas",
      "Rocker-Bogie",
      "6-DOF",
      "5.8 GHz",
      "URC",
      "ERC",
      "Mars Rover",
      "ROVER TEAM",
      "autonomous_nav.py",
      "tokenizePythonDarcula",
      "Sagan",
      "Altınay",
      "AXA Sigorta",
      "itu-rover",
      "itu.roverteam",
      "Emanet",
      "dangerouslySetInnerHTML",
      "--syntax-keyword",
      "Roboto",
      "contact@itumatrix.org",
      "itumatrix.com",
    ];

    for (const file of files) {
      for (const token of bannedTokens) {
        expect(file.content).not.toContain(token);
      }
    }
  });

  test("T1.07: CLUB_INFO preserves verified İTÜ Metallurgy & Materials institutional facts", () => {
    expect(CLUB_INFO.name).toBe("ITU MATRIX");
    expect(CLUB_INFO.institution).toBe("Istanbul Technical University");
    expect(CLUB_INFO.faculty).toContain("Chemical and Metallurgical Engineering");
    expect(CLUB_INFO.department).toContain("Metallurgical and Materials Engineering");
    expect(CLUB_INFO.foundedUniversity).toBe("1773");
    expect(CLUB_INFO.foundedChair).toBe("1961–1962");
    expect(CLUB_INFO.mergedFaculty).toBe("1982");
    expect(CLUB_INFO.renamedDepartment).toBe("1998");
    expect(CLUB_INFO.institutionUrl).toBe("https://www.itu.edu.tr");
    expect(CLUB_INFO.departmentUrl).toBe("https://mme.itu.edu.tr");
  });

  test("T1.08: LATTICE_SPECS covers BCC, FCC, and HCP with textbook crystallographic parameters", () => {
    expect(LATTICE_SPECS.map((s) => s.id)).toEqual(["BCC", "FCC", "HCP"]);
    expect(LATTICE_SPECS[0].packingFactor).toBe("0.68");
    expect(LATTICE_SPECS[0].coordinationNumber).toBe(8);
    expect(LATTICE_SPECS[1].packingFactor).toBe("0.74");
    expect(LATTICE_SPECS[1].coordinationNumber).toBe(12);
    expect(LATTICE_SPECS[2].packingFactor).toBe("0.74");
    expect(LATTICE_SPECS[2].coordinationNumber).toBe(12);
  });

  test("T1.09: RESEARCH_PROJECTS defines 4 concise Metallurgy tracks with max 2 metrics each", () => {
    expect(RESEARCH_PROJECTS.length).toBe(4);
    expect(RESEARCH_PROJECTS.map((p) => p.code)).toEqual([
      "MAT-01",
      "MAT-02",
      "MAT-03",
      "MAT-04",
    ]);
    for (const proj of RESEARCH_PROJECTS) {
      expect(proj.title.split(/\s+/).length).toBeLessThanOrEqual(6);
      expect(proj.summary.length).toBeGreaterThan(20);
      expect(proj.metrics.length).toBe(2);
    }
  });

  test("T1.10: SUBTEAMS defines 5 authentic Materials Science divisions", () => {
    expect(SUBTEAMS.length).toBe(5);
    const ids = SUBTEAMS.map((s) => s.id);
    expect(new Set(ids).size).toBe(5);
    for (const subteam of SUBTEAMS) {
      expect(subteam.name.length).toBeGreaterThan(5);
      expect(subteam.focus.length).toBeGreaterThan(3);
      expect(subteam.description.length).toBeGreaterThan(15);
    }
  });

  test("T1.11: HERITAGE_MILESTONES and LAB_FOCUS_AREAS reflect verified İTÜ history with zero fabricated medals", () => {
    expect(HERITAGE_MILESTONES.length).toBe(4);
    expect(HERITAGE_MILESTONES.map((m) => m.year)).toEqual([
      "1773",
      "1961–1962",
      "1982",
      "1998",
    ]);
    expect(LAB_FOCUS_AREAS.length).toBe(4);
    const serialized = JSON.stringify({ HERITAGE_MILESTONES, LAB_FOCUS_AREAS });
    expect(serialized).not.toMatch(/World\s+3rd|Silver\s+Medal|Bronze\s+Medal|1st\s+Place|\bMPa\b/i);
  });

  test("T1.12: Zero AI copywriting clichés or emojis across app/, components/, and data/", () => {
    const files = collectSourceFiles(["app", "components", "data"]);
    const bannedCliches = [
      /\bElevate\b/i,
      /\bSeamless\b/i,
      /\bUnleash\b/i,
      /\bNext-Gen\b/i,
      /\bGame-changer\b/i,
      /\bDelve\b/i,
      /\bRedefining\b/i,
      /\bRevolutionizing\b/i,
    ];
    const emojiPattern = /[\u{1F300}-\u{1FAFF}]/u;

    for (const file of files) {
      for (const regex of bannedCliches) {
        expect(file.content).not.toMatch(regex);
      }
      expect(file.content).not.toMatch(emojiPattern);
    }
  });
});
