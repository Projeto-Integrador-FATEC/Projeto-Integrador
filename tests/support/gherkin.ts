import { readFileSync } from "node:fs";
import { describe, it } from "vitest";

export type ScenarioContext = Record<string, unknown>;
export type StepHandler = (match: RegExpMatchArray, context: ScenarioContext) => Promise<void> | void;

export interface StepDefinition {
  pattern: RegExp;
  handler: StepHandler;
}

interface Scenario {
  name: string;
  steps: string[];
}

function parseFeature(source: string): { title: string; scenarios: Scenario[] } {
  const lines = source
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith("#"));

  let title = "Funcionalidade";
  const scenarios: Scenario[] = [];
  let current: Scenario | null = null;

  for (const line of lines) {
    const feature = line.match(/^Funcionalidade:\s*(.+)$/i);
    if (feature) {
      title = feature[1];
      continue;
    }

    const scenario = line.match(/^Cenário:\s*(.+)$/i);
    if (scenario) {
      current = { name: scenario[1], steps: [] };
      scenarios.push(current);
      continue;
    }

    const step = line.match(/^(?:Dado|Quando|Então|Entao|E|Mas)\s+(.+)$/i);
    if (step && current) {
      current.steps.push(step[1]);
    }
  }

  return { title, scenarios };
}

export function runFeature(path: string, steps: StepDefinition[]) {
  const feature = parseFeature(readFileSync(path, "utf8"));

  describe(feature.title, () => {
    for (const scenario of feature.scenarios) {
      it(scenario.name, async () => {
        const context: ScenarioContext = {};

        for (const text of scenario.steps) {
          const definition = steps.find((step) => step.pattern.test(text));
          if (!definition) {
            throw new Error(`Passo sem definição: "${text}"`);
          }
          await definition.handler(text.match(definition.pattern) as RegExpMatchArray, context);
        }
      });
    }
  });
}
