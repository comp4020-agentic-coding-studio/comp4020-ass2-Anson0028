import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { beforeAll, describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(resolve(path), "utf8");
const median = (xs: number[]) => [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)];
const seconds = (ms: number) => (ms / 1000).toFixed(1);

let runner: typeof import("../src/scripts/run-51");

beforeAll(async () => {
  (globalThis as { document?: unknown }).document ??= { hidden: true };
  runner = await import("../src/scripts/run-51");
});

describe("the numbers the site prints are the numbers its own runner computes", () => {
  it("prints the reaction-time ladder the browser button reruns: home, week 5's table and its chart", async () => {
    const chart = [...read("src/components/ReactionLadder.astro").matchAll(/\{ ms: (\d+), wins: (\d+) \}/g)].map((m) => ({
      ms: Number(m[1]),
      wins: Number(m[2]),
    }));
    const table = [...read("src/content/lectures/week-05.md").matchAll(/^\| (\d+) ms \| (\d+) \| ([\d.]+) s \|$/gm)].map((m) => ({
      ms: Number(m[1]),
      wins: Number(m[2]),
      median: m[3],
    }));
    const hero = read("src/pages/index.astro").match(/week: 5,[^\n]*number: "([\d, ]+) wins of 51"/)?.[1];
    expect(chart).toHaveLength(6);
    expect(table.map((r) => r.ms)).toEqual(chart.map((r) => r.ms));

    for (const row of table) {
      const wins = await runner.runRow(row.ms, 0, () => {});
      const times = await runner.survivalTimes(row.ms, 51, 0);
      expect(wins, `week 5 prints ${row.wins} wins at ${row.ms} ms`).toBe(row.wins);
      expect(chart.find((r) => r.ms === row.ms)?.wins, `the chart prints a different win count at ${row.ms} ms`).toBe(wins);
      expect(seconds(median(times)), `week 5 prints a median of ${row.median} s at ${row.ms} ms`).toBe(row.median);
    }
    expect(hero?.split(", ").map(Number), "the home page's week 5 row").toEqual(table.slice(0, hero?.split(", ").length).map((r) => r.wins));
  }, 120_000);

  it("prints the medians week 4's button reruns, in its table and its instrument", async () => {
    const table = [...read("src/content/lectures/week-04.md").matchAll(/^\| (\d+) \| ([\d.]+) s \|$/gm)].map((m) => ({
      runs: Number(m[1]),
      median: m[2],
    }));
    const instrument = [...read("src/components/MedianDrift.astro").matchAll(/\{ runs: (\d+), median: ([\d.]+) \}/g)].map((m) => ({
      runs: Number(m[1]),
      median: Number(m[2]).toFixed(1),
    }));
    expect(table).toHaveLength(6);
    expect(instrument).toEqual(table);

    const times = await runner.survivalTimes(150, Math.max(...table.map((r) => r.runs)), 0);
    for (const row of table) {
      expect(seconds(median(times.slice(0, row.runs))), `week 4 prints ${row.median} s at ${row.runs} runs`).toBe(row.median);
    }
  }, 120_000);
});
