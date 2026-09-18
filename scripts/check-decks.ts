#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { preview } from "astro";
import { chromium } from "playwright";

const DIST = resolve("dist");
const DECKS = join(DIST, "decks");
const PORT = 4399;
const MIN_PHONE_TEXT_PX = 14;

const VIEWPORTS = [
  { name: "desktop", width: 1920, height: 1080, deviceScaleFactor: 1, hasTouch: false },
  { name: "phone", width: 390, height: 844, deviceScaleFactor: 3, hasTouch: true },
];

if (!existsSync(DECKS)) {
  console.error("✗ decks: dist/decks is missing. Run `pnpm build` first.");
  process.exit(1);
}

const decks = readdirSync(DECKS, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

const sample = readFileSync(join(DECKS, decks[0], "index.html"), "utf8");
const base = sample.match(/"(\/[^"/]+)\/_astro\//)?.[1] ?? "";

const server = await preview({ root: process.cwd(), server: { port: PORT }, logLevel: "silent" });
const browser = await chromium.launch();
const failures: string[] = [];
let slides = 0;
let tightest = { margin: Infinity, where: "" };

try {
  for (const viewport of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: viewport.deviceScaleFactor,
      hasTouch: viewport.hasTouch,
    });
    const page = await context.newPage();
    for (const deck of decks) {
      await page.goto(`http://localhost:${PORT}${base}/decks/${deck}/`, { waitUntil: "networkidle" });
      await page.waitForSelector(".reveal .slides section.present", { timeout: 20_000 });
      const total = await page.evaluate(() => document.querySelectorAll(".reveal .slides > section").length);
      for (let i = 0; i < total; i++) {
        if (i > 0) {
          await page.keyboard.press("ArrowRight");
          await page.waitForTimeout(120);
        }
        const m = await page.evaluate(() => {
          const slide = document.querySelector(".reveal .slides section.present")!;
          const stage = document.querySelector(".reveal .slides")!.getBoundingClientRect();
          const boxes = [...slide.children].map((child) => child.getBoundingClientRect());
          const stageEl = document.querySelector(".reveal .slides") as HTMLElement;
          const scale = stageEl.getBoundingClientRect().width / stageEl.offsetWidth;
          const sizes = [...slide.querySelectorAll("p, li, td, th")].map((el) => parseFloat(getComputedStyle(el).fontSize) * scale);
          const px = sizes.length > 0 ? Math.min(...sizes) : null;
          return {
            below: Math.max(...boxes.map((b) => b.bottom)) - stage.bottom,
            beside: Math.max(...boxes.map((b) => b.right)) - stage.right,
            px,
          };
        });
        slides++;
        const where = `${deck} slide ${i + 1} at ${viewport.name}`;
        if (m.below > 1) failures.push(`${where}: content runs ${Math.round(m.below)} px below the stage`);
        if (m.beside > 1) failures.push(`${where}: content runs ${Math.round(m.beside)} px past the right edge`);
        if (viewport.name === "phone" && m.px !== null && m.px < MIN_PHONE_TEXT_PX) {
          failures.push(`${where}: body text renders at ${m.px.toFixed(1)} px, under ${MIN_PHONE_TEXT_PX} px`);
        }
        if (-m.below < tightest.margin) tightest = { margin: -m.below, where };
      }
    }
    await context.close();
  }
} finally {
  await browser.close();
  await server.stop();
}

if (failures.length > 0) {
  for (const failure of failures) console.error(`✗ ${failure}`);
  console.error(`✗ decks: ${failures.length} problem(s) across ${slides} slide views`);
  process.exit(1);
}
console.log(`✓ decks: ${decks.length} decks, ${slides} slide views at ${VIEWPORTS.map((v) => `${v.width}x${v.height}`).join(" and ")}; tightest is ${tightest.where} with ${Math.round(tightest.margin)} px to spare`);
