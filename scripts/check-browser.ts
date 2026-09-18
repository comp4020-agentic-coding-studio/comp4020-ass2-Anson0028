#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { preview } from "astro";
import { chromium } from "playwright";

const DIST = resolve("dist");
const PORT = 4398;

if (!existsSync(join(DIST, "index.html"))) {
  console.error("✗ browser: dist is missing. Run `pnpm build` first.");
  process.exit(1);
}

const base = readFileSync(join(DIST, "index.html"), "utf8").match(/"(\/[^"/]+)\/_astro\//)?.[1] ?? "";

const INSTRUMENTS = [
  { path: "/", button: "#run-51", status: "#run-status" },
  { path: "/lectures/week-05/", button: "#run-51", status: "#run-status" },
  { path: "/lectures/week-04/", button: "#run-drift", status: "#drift-status" },
];

const server = await preview({ root: process.cwd(), server: { port: PORT }, logLevel: "silent" });
const browser = await chromium.launch();
const failures: string[] = [];

const settled = (selector: string) =>
  `(() => { const b = document.querySelector(${JSON.stringify(selector)}); return !b.disabled && b.getAttribute("aria-disabled") !== "true"; })()`;

try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  for (const { path, button, status } of INSTRUMENTS) {
    await page.goto(`http://localhost:${PORT}${base}${path}`, { waitUntil: "networkidle" });
    await page.focus(button);
    await page.keyboard.press("Enter");
    await page.waitForFunction(settled(button), null, { timeout: 90_000 });
    const first = (await page.textContent(status)) ?? "";

    const focused = await page.evaluate((sel) => document.activeElement === document.querySelector(sel), button);
    if (!focused) failures.push(`${path}: after a run, keyboard focus has left ${button}`);

    await page.keyboard.press("Enter");
    await page.waitForTimeout(400);
    await page.waitForFunction(settled(button), null, { timeout: 90_000 });
    const second = (await page.textContent(status)) ?? "";
    if (second === first) failures.push(`${path}: a second Enter did nothing; the status still reads "${first.slice(0, 60)}…"`);
  }
} finally {
  await browser.close();
  await server.stop();
}

if (failures.length > 0) {
  for (const failure of failures) console.error(`✗ ${failure}`);
  console.error(`✗ browser: ${failures.length} problem(s)`);
  process.exit(1);
}
console.log(`✓ browser: ${INSTRUMENTS.length} instruments run twice from the keyboard without losing focus`);
