import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

interface ApiNode {
  id: string;
  type: string;
  title: string;
  related?: string[];
  meta?: Record<string, unknown>;
}

const api = JSON.parse(readFileSync(resolve("dist/api/index.json"), "utf8")) as {
  nodes: ApiNode[];
};

const WEEKS = Array.from({ length: 12 }, (_, i) => i + 1);
const ofType = (type: string) => api.nodes.filter((node) => node.type === type);
const inWeek = (nodes: ApiNode[], week: number) =>
  nodes.filter((node) => Number(node.meta?.week) === week);

const lectures = ofType("lectures");
const studios = ofType("sessions");
const assessments = ofType("assessments");

const STOPWORDS = new Set([
  "about", "across", "after", "against", "cannot", "from", "into", "only",
  "that", "their", "this", "what", "when", "with", "without", "your",
]);

const contentWords = (title: string) =>
  title
    .toLowerCase()
    .split(/[^a-z]+/)
    .filter((word) => word.length >= 4 && !STOPWORDS.has(word));

const UNIT = /\d+(\.\d+)?\s?(ms|s|%|runs|seeds|hp|px|hits|players)\b/;

describe("the shape of the semester", () => {
  it("has one lecture per week", () => {
    for (const week of WEEKS) {
      expect(inWeek(lectures, week), `week ${week} lectures`).toHaveLength(1);
    }
  });

  it("has one studio per week", () => {
    for (const week of WEEKS) {
      expect(inWeek(studios, week), `week ${week} studios`).toHaveLength(1);
    }
  });

  it("links every week to the next, so the spine is a chain", () => {
    for (const week of WEEKS.slice(0, -1)) {
      const [here] = inWeek(lectures, week);
      const [next] = inWeek(lectures, week + 1);
      expect(here, `week ${week} lecture`).toBeDefined();
      expect(next, `week ${week + 1} lecture`).toBeDefined();
      const linked = here.related?.includes(next.id) || next.related?.includes(here.id);
      expect(linked, `${here.id} -> ${next.id}`).toBe(true);
    }
  });
});

describe("twelve weeks that do not repeat one another", () => {
  it("shares no content word between lecture titles", () => {
    const seen = new Map<string, string>();
    for (const lecture of lectures) {
      for (const word of new Set(contentWords(lecture.title))) {
        expect(seen.get(word), `"${word}" in ${lecture.id} and ${seen.get(word)}`).toBeUndefined();
        seen.set(word, lecture.id);
      }
    }
  });
});

describe("a course about measurement", () => {
  it("names a quantity with a unit in every lecture", () => {
    expect(lectures.length).toBeGreaterThan(0);
    for (const lecture of lectures) {
      const entry = JSON.parse(
        readFileSync(resolve("dist/api", `${lecture.id}.json`), "utf8"),
      ) as { body?: string };
      expect(entry.body ?? "", `${lecture.id} has no measured quantity`).toMatch(UNIT);
    }
  });
});

describe("studios end in a number", () => {
  it("says what each studio measures", () => {
    expect(studios.length).toBeGreaterThan(0);
    for (const studio of studios) {
      expect(String(studio.meta?.measures ?? "").trim(), `${studio.id} measures nothing`).not.toBe("");
    }
  });
});

describe("few readings, all of them traceable", () => {
  const readings = lectures
    .map((lecture) => ({ id: lecture.id, reading: lecture.meta?.reading as Record<string, string> | undefined }))
    .filter((entry) => entry.reading);

  it("has at least one and at most six", () => {
    expect(readings.length).toBeGreaterThanOrEqual(1);
    expect(readings.length).toBeLessThanOrEqual(6);
  });

  it("gives every reading authors, a title and a URL", () => {
    for (const { id, reading } of readings) {
      expect(reading?.authors, `${id} reading authors`).toBeTruthy();
      expect(reading?.title, `${id} reading title`).toBeTruthy();
      expect(reading?.url, `${id} reading url`).toMatch(/^https?:\/\//);
    }
  });
});

describe("assessment", () => {
  it("adds up to 100", () => {
    const total = assessments.reduce((sum, a) => sum + Number(a.meta?.weight ?? 0), 0);
    expect(total).toBe(100);
  });
});
