/**
 * tests/e2e/helpers/journey-runner.ts
 * Multi-action User Journey test harness with breadcrumbs and forensic error reporting.
 */

import { ParsedNode } from "./dom-parser";

export interface JourneyState {
  currentUrl: string;
  viewport: { width: number; height: number };
  activeHotspotId?: string | null;
  activeCodeTab?: string;
  terminalHistory?: string[];
  wireframeMode?: boolean;
  renderedHtml?: string;
  dom?: ParsedNode;
  variables: Record<string, any>;
}

export interface JourneyStep {
  name: string;
  description: string;
  action: (state: JourneyState) => Promise<void> | void;
  assert: (state: JourneyState) => void;
}

export class JourneyHarness {
  readonly journeyName: string;
  readonly persona: string;
  private state: JourneyState;
  private breadcrumbs: Array<{ step: string; timestamp: number; durationMs: number }> = [];

  constructor(journeyName: string, persona: string, initialViewport = { width: 1440, height: 900 }) {
    this.journeyName = journeyName;
    this.persona = persona;
    this.state = {
      currentUrl: "/",
      viewport: initialViewport,
      activeHotspotId: null,
      activeCodeTab: "autonomous_nav.py",
      terminalHistory: [],
      wireframeMode: false,
      variables: {},
    };
  }

  getState(): JourneyState {
    return this.state;
  }

  getBreadcrumbs() {
    return [...this.breadcrumbs];
  }

  async runStep(step: JourneyStep): Promise<void> {
    const start = performance.now();
    try {
      await step.action(this.state);
      step.assert(this.state);
      const durationMs = Math.round(performance.now() - start);
      this.breadcrumbs.push({
        step: step.name,
        timestamp: Date.now(),
        durationMs,
      });
    } catch (err: any) {
      const dump = {
        failedJourney: this.journeyName,
        persona: this.persona,
        failedStep: step.name,
        description: step.description,
        breadcrumbs: this.breadcrumbs,
        stateSnapshot: {
          currentUrl: this.state.currentUrl,
          viewport: this.state.viewport,
          activeHotspot: this.state.activeHotspotId,
          activeCodeTab: this.state.activeCodeTab,
          wireframeMode: this.state.wireframeMode,
        },
        originalError: err.message,
      };
      throw new Error(`Journey step failed: ${step.name}\n${JSON.stringify(dump, null, 2)}`);
    }
  }

  async runAll(steps: JourneyStep[]): Promise<void> {
    for (const step of steps) {
      await this.runStep(step);
    }
  }
}

export function createJourneyHarness(journeyName: string, persona: string, viewport?: { width: number; height: number }): JourneyHarness {
  return new JourneyHarness(journeyName, persona, viewport);
}
