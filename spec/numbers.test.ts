import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { beforeAll, describe, expect, it } from "vitest";

const MEASURED_ON = "darwin-arm64";
const HERE = `${process.platform}-${process.arch}`;
const onMeasuringMachine = HERE === MEASURED_ON;

const read = (path: string) => readFileSync(resolve(path), "utf8");
const seconds = (ms: number) => (ms / 1000).toFixed(1);

function tableRows(path: string, cells: RegExp) {
  const lines = read(path)
    .split("\n")
    .filter((line) => line.startsWith("| ") && !line.startsWith("| ---"));
  const body = lines.slice(1);
  const parsed = body.map((line) => line.match(cells)).filter((m): m is RegExpMatchArray => m !== null);
  expect(parsed.length, `${path} has a table row the check cannot read`).toBe(body.length);
  return parsed;
}

function arrayRows(path: string, entry: RegExp, marker: string) {
  const text = read(path);
  const parsed = [...text.matchAll(entry)];
  expect(parsed.length, `${path} has an entry the check cannot read`).toBe(text.split(marker).length - 1);
  return parsed;
}

const ladderTable = (path: string) =>
  tableRows(path, /^\| (\d+) ms \| (\d+) \| ([\d.]+) s \|$/).map((m) => ({ ms: Number(m[1]), wins: Number(m[2]), median: m[3] }));

const driftTable = (path: string) =>
  tableRows(path, /^\| (\d+) \| ([\d.]+) s \|$/).map((m) => ({ runs: Number(m[1]), median: m[2] }));

const ladder = ladderTable("src/content/lectures/week-05.md");
const drift = driftTable("src/content/lectures/week-04.md");

describe("every printed copy of the instruments' numbers agrees with the others", () => {
  it("prints one reaction-time ladder: chart, home page, social card, week 5's page and deck", () => {
    const chart = arrayRows("src/components/ReactionLadder.astro", /\{ ms: (\d+), wins: (\d+) \}/g, "{ ms:").map((m) => ({
      ms: Number(m[1]),
      wins: Number(m[2]),
    }));
    expect(ladder).toHaveLength(6);
    expect(chart).toEqual(ladder.map(({ ms, wins }) => ({ ms, wins })));
    expect(ladderTable("src/decks/week-05.deck.mdx")).toEqual(ladder);

    const wins = ladder.map((r) => r.wins);
    expect(read("src/pages/index.astro")).toContain(`number: "${wins.slice(0, 4).join(", ")} wins of 51"`);
    expect(read("src/site-config.ts")).toContain(`${wins.join(", ")} wins as reaction time goes from 50 to 300 ms`);

    const firstStep = wins[0] - wins[1];
    const flatStep = (Number(ladder[3].median) - Number(ladder[4].median)).toFixed(1);
    for (const path of ["src/content/lectures/week-05.md", "src/decks/week-05.deck.mdx"]) {
      for (const m of read(path).matchAll(/costs (\d+) wins/g)) expect(Number(m[1]), `${path}: "${m[0]}"`).toBe(firstStep);
      for (const m of read(path).matchAll(/costs ([\d.]+) s\b/g)) expect(m[1], `${path}: "${m[0]}"`).toBe(flatStep);
    }
  });

  it("prints one table of medians: week 4's page, deck and instrument, and the tutorial and quiz that quote it", () => {
    const instrument = arrayRows("src/components/MedianDrift.astro", /\{ runs: (\d+), median: ([\d.]+) \}/g, "{ runs:").map((m) => ({
      runs: Number(m[1]),
      median: Number(m[2]).toFixed(1),
    }));
    expect(drift).toHaveLength(6);
    expect(instrument).toEqual(drift);
    expect(driftTable("src/decks/week-04.deck.mdx")).toEqual(drift);

    const at = (runs: number) => drift.find((r) => r.runs === runs)!.median;
    expect(read("src/content/sessions/04-how-many-runs.md")).toContain(`goes ${drift.map((r) => `${r.median} s`).join(", ")}.`);
    expect(read("src/content/assessments/tutorial-quizzes.md")).toContain(`"51 runs, median ${at(51)} s."`);
    for (const path of ["src/content/lectures/week-04.md", "src/decks/week-04.deck.mdx"]) {
      expect(read(path)).toContain(`Seed 97 ends at ${at(1)} s`);
      expect(read(path)).toContain(`median ${Math.round(Number(at(15)) - Number(at(1)))} s above what one run said`);
    }
    expect(read("src/content/lectures/week-04.md")).toContain(`pull it back down by ${Math.round(Number(at(15)) - Number(at(501)))} s`);
  });
});

describe(`the printed numbers are what the page's own runner computes, on the machine they were measured on (${MEASURED_ON})`, () => {
  let runner: typeof import("../src/scripts/run-51");

  beforeAll(async () => {
    (globalThis as { document?: unknown }).document ??= { hidden: true };
    runner = await import("../src/scripts/run-51");
  });

  const compute = async () => {
    const rows = [];
    for (const { ms } of ladder) {
      rows.push({ ms, wins: await runner.runRow(ms, 0, () => {}), median: seconds(runner.median(await runner.survivalTimes(ms, 51, 0))) });
    }
    const times = await runner.survivalTimes(150, Math.max(...drift.map((r) => r.runs)), 0);
    const medians = drift.map(({ runs }) => ({ runs, median: seconds(runner.median(times.slice(0, runs))) }));
    return { rows, medians };
  };

  it.skipIf(!onMeasuringMachine)("recomputes the ladder and the medians exactly", async () => {
    const { rows, medians } = await compute();
    for (const [i, row] of ladder.entries()) {
      expect(rows[i].wins, `week 5 prints ${row.wins} wins at ${row.ms} ms`).toBe(row.wins);
      expect(rows[i].median, `week 5 prints a median of ${row.median} s at ${row.ms} ms`).toBe(row.median);
    }
    for (const [i, row] of drift.entries()) {
      expect(medians[i].median, `week 4 prints ${row.median} s at ${row.runs} runs`).toBe(row.median);
    }
  }, 120_000);

  it.runIf(!onMeasuringMachine)(`on ${HERE}, records what this machine computes instead`, async () => {
    const { rows, medians } = await compute();
    console.log(
      `Measured on ${MEASURED_ON}; this is ${HERE}. Math.sin and its neighbours round differently here, so the exact check is skipped.\n` +
        `  ladder, printed:  ${ladder.map((r) => `${r.ms} ms ${r.wins} wins ${r.median} s`).join(" | ")}\n` +
        `  ladder, here:     ${rows.map((r) => `${r.ms} ms ${r.wins} wins ${r.median} s`).join(" | ")}\n` +
        `  medians, printed: ${drift.map((r) => `${r.runs}: ${r.median} s`).join(" | ")}\n` +
        `  medians, here:    ${medians.map((r) => `${r.runs}: ${r.median} s`).join(" | ")}`,
    );
    expect(rows).toHaveLength(ladder.length);
  }, 120_000);
});
