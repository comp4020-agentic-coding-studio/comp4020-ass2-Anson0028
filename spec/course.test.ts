import { readFileSync, readdirSync } from "node:fs";
import { join, relative, resolve } from "node:path";
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
const tutorials = ofType("sessions");
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

  it("has one tutorial per week", () => {
    for (const week of WEEKS) {
      expect(inWeek(tutorials, week), `week ${week} tutorials`).toHaveLength(1);
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
  it("has every week say, in its own words, what it does to the course's question", () => {
    const sentences = lectures.map((lecture) => String(lecture.meta?.bearing ?? "").trim());
    for (const [i, sentence] of sentences.entries()) {
      expect(sentence.split(/\s+/).length, `week ${lectures[i].meta?.week} has no bearing sentence`).toBeGreaterThanOrEqual(8);
    }
    expect(new Set(sentences).size).toBe(sentences.length);
  });

  it("gives every week a deck of its own", () => {
    for (const lecture of lectures) {
      expect(String(lecture.meta?.slides ?? ""), `week ${lecture.meta?.week} has no slides`).toMatch(/^\/decks\/week-\d\d\/$/);
    }
  });

  it("says which suspect each week measures", () => {
    const allowed = ["instrument", "me", "game", "verdict"];
    for (const lecture of lectures) {
      expect(allowed, `week ${lecture.meta?.week} has suspect ${lecture.meta?.suspect}`).toContain(lecture.meta?.suspect);
    }
    expect(lectures.filter((l) => l.meta?.suspect === "me").length).toBe(3);
    expect(lectures.filter((l) => l.meta?.suspect === "game").length).toBe(3);
  });

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

describe("tutorials end in a number", () => {
  it("says what each tutorial measures", () => {
    expect(tutorials.length).toBeGreaterThan(0);
    for (const tutorial of tutorials) {
      expect(String(tutorial.meta?.measures ?? "").trim(), `${tutorial.id} measures nothing`).not.toBe("");
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

describe("nothing left over from the starter", () => {
  const STARTER_PHRASES = [
    "Replace this",
    "replace me",
    "site-config.ts",
    "collection and URL stay",
    "the course claims to run",
    "Course Title Goes Here",
    "placeholder",
  ];

  const htmlFiles = (dir: string): string[] =>
    readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) return entry.name === "pagefind" || entry.name === "api" ? [] : htmlFiles(path);
      return entry.name.endsWith(".html") ? [path] : [];
    });

  it("finds no starter prose on any built page outside the deck", () => {
    const pages = htmlFiles(resolve("dist")).filter((path) => !relative(resolve("dist"), path).startsWith("decks"));
    expect(pages.length).toBeGreaterThan(20);
    for (const page of pages) {
      const text = readFileSync(page, "utf8").replace(/<script[\s\S]*?<\/script>/g, "").replace(/<[^>]+>/g, " ");
      for (const phrase of STARTER_PHRASES) {
        expect(text.includes(phrase), `${relative(resolve("dist"), page)} still says "${phrase}"`).toBe(false);
      }
    }
  });

  it("gives every built page outside the deck exactly one h1", () => {
    const pages = htmlFiles(resolve("dist")).filter((path) => !relative(resolve("dist"), path).startsWith("decks"));
    for (const page of pages) {
      const count = (readFileSync(page, "utf8").match(/<h1[\s>]/g) ?? []).length;
      expect(count, `${relative(resolve("dist"), page)} has ${count} h1 elements`).toBe(1);
    }
  });
});

describe("assessment", () => {
  it("is a chain: each piece that consumes another names one that is due earlier", () => {
    const links = assessments.filter((a) => a.meta?.consumes);
    expect(links.length).toBeGreaterThanOrEqual(2);
    for (const later of links) {
      const earlier = assessments.find((a) => a.id === `assessments/${String(later.meta?.consumes)}`);
      expect(earlier, `${later.id} consumes something that does not exist`).toBeDefined();
      expect(String(earlier?.meta?.due) < String(later.meta?.due), `${later.id} is due before what it consumes`).toBe(true);
    }
  });

  it("adds up to 100", () => {
    const total = assessments.reduce((sum, a) => sum + Number(a.meta?.weight ?? 0), 0);
    expect(total).toBe(100);
  });
});
