type Reading = number | null | undefined;

function baselineReadings(values: Reading[]) {
  return values.filter(Boolean);
}

function patchedReadings(values: Reading[]) {
  return values.filter(Number.isFinite);
}

export const changedLine = {
  before: "  return values.filter(Boolean);",
  after: "  return values.filter(Number.isFinite);",
};

const cases = [
  { name: "Preserves a zero reading", input: [4, 0, 7], expected: [4, 0, 7] },
  { name: "Keeps negative readings", input: [-3, 5], expected: [-3, 5] },
  { name: "Drops missing readings", input: [8, null, undefined], expected: [8] },
  { name: "Drops nonfinite readings", input: [Number.NaN, 2, Number.POSITIVE_INFINITY], expected: [2] },
  { name: "Handles an empty batch", input: [], expected: [] },
];

const readings = {
  id: "sensor-export",
  name: "Sensor export",
  issue: "Zero readings disappear from the export",
  description: "The export should retain every finite sensor reading. A batch of 4, 0 and 7 is currently exported as 4 and 7.",
  expected: "[4, 0, 7]",
  actual: "[4, 7]",
  path: "src/readings.ts",
  testsPath: "tests/readings.test.ts",
  signature: "function exportReadings(values: Reading[])",
  diagnosis: "The truthiness filter drops valid zeros. The first patch keeps zeros but still lets Infinity through.",
  before: changedLine.before,
  revisions: [
    { name: "V1 · Keep zero", line: "  return values.filter((value) => value === 0 || Boolean(value));", reason: "Repairs the missing zero. Infinity still appears in an export." },
    { name: "V2 · Keep finite numbers", line: changedLine.after, reason: "Preserves zeros and rejects null, undefined, NaN and infinity." },
  ],
  run(revision: number) {
    const apply = revision === 0
      ? (values: Reading[]) => values.filter((value) => value === 0 || Boolean(value))
      : patchedReadings;
    return checkCases(cases, baselineReadings, apply, formatReadings);
  },
};

const regions = {
  id: "region-summary",
  name: "Region summary",
  issue: "Equivalent region labels appear as separate groups",
  description: "The grouping key should ignore case and surrounding whitespace and skip blank labels.",
  expected: '["delhi", "delhi"]',
  actual: '[" Delhi ", "delhi"]',
  path: "src/regions.ts",
  testsPath: "tests/regions.test.ts",
  signature: "function regionKeys(labels: string[])",
  diagnosis: "The keys are returned as stored. Lowercasing alone still creates duplicate groups and leaves empty labels in the output.",
  before: "  return labels;",
  revisions: [
    { name: "V1 · Normalize case", line: "  return labels.map((label) => label.toLowerCase());", reason: "Matches capitalization. Padding and blank keys still produce failures." },
    { name: "V2 · Normalize clean keys", line: "  return labels.map((label) => label.trim().toLowerCase()).filter(Boolean);", reason: "Trims spacing, normalizes case, and filters empty keys after trimming." },
  ],
  run(revision: number) {
    const apply = revision === 0
      ? (labels: string[]) => labels.map((label) => label.toLowerCase())
      : (labels: string[]) => labels.map((label) => label.trim().toLowerCase()).filter(Boolean);
    return checkCases([
      { name: "Normalizes uppercase", input: ["DELHI"], expected: ["delhi"] },
      { name: "Trims surrounding spaces", input: [" Delhi ", "delhi"], expected: ["delhi", "delhi"] },
      { name: "Skips blank labels", input: [" ", "Pune", ""], expected: ["pune"] },
      { name: "Keeps label order", input: ["Pune", "Delhi"], expected: ["pune", "delhi"] },
    ], (labels) => labels, apply, (labels) => JSON.stringify(labels));
  },
};

export const demoTasks = [readings, regions];
export type DemoTask = (typeof demoTasks)[number];

function checkCases<T>(
  cases: { name: string; input: T[]; expected: T[] }[],
  baseline: (input: T[]) => T[],
  patched: (input: T[]) => T[],
  format: (values: T[]) => string,
) {
  return cases.map(({ name, input, expected }) => {
    const before = baseline(input);
    const after = patched(input);
    const matches = (values: T[]) =>
      values.length === expected.length && values.every((value, index) => value === expected[index]);

    return {
      name, input: format(input), expected: format(expected), before: format(before), after: format(after),
      beforePassed: matches(before), afterPassed: matches(after),
    };
  });
}

export function formatReadings(values: Reading[]) {
  return `[${values.map(String).join(", ")}]`;
}
