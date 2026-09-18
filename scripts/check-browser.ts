#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
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

const axeSource = readFileSync(createRequire(import.meta.url).resolve("axe-core/axe.min.js"), "utf8");

const CONTRAST_PAGES = [
  "/",
  "/lectures/",
  "/lectures/week-05/",
  "/lectures/week-11/",
  "/sessions/",
  "/sessions/07-size-a-gate/",
  "/assessments/",
  "/assessments/nothing-broke/",
  "/people/",
  "/policies/",
];

const PLATFORM_OWNED = /\bh[1-4]\b|\.at-/;

const INSTRUMENTS = [
  { path: "/", button: "#run-51", status: "#run-status" },
  { path: "/lectures/week-05/", button: "#run-51", status: "#run-status" },
  { path: "/lectures/week-04/", button: "#run-drift", status: "#drift-status" },
];

const server = await preview({ root: process.cwd(), server: { port: PORT }, logLevel: "silent" });
const browser = await chromium.launch();
const failures: string[] = [];
const platformOwned: string[] = [];

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

  const ROUTES = [
    { from: "/", link: `.side a[href$="/lectures/week-05/"]`, to: "/lectures/week-05/", button: "#run-51", status: "#run-status", name: "home to week 5 by the hero row" },
    { from: "/lectures/week-05/", link: `a[href="${base}/"]`, to: "/", button: "#run-51", status: "#run-status", name: "week 5 to home by the logo" },
    { from: "/lectures/week-05/", link: `a[href$="/lectures/week-04/"]`, to: "/lectures/week-04/", button: "#run-drift", status: "#drift-status", name: "week 5 to week 4 by the related link" },
  ];
  for (const route of ROUTES) {
    await page.goto(`http://localhost:${PORT}${base}${route.from}`, { waitUntil: "networkidle" });
    await page.click("#run-51");
    await page.waitForFunction(settled("#run-51"), null, { timeout: 90_000 });
    await page.locator(route.link).first().click();
    await page.waitForURL(`http://localhost:${PORT}${base}${route.to}`, { timeout: 15_000 });
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(800);
    await page.waitForSelector(route.button, { timeout: 15_000 });
    const before = (await page.textContent(route.status)) ?? "";
    await page.click(route.button);
    await page.waitForTimeout(600);
    await page.waitForFunction(settled(route.button), null, { timeout: 90_000 });
    const after = (await page.textContent(route.status)) ?? "";
    if (after === before) failures.push(`arriving ${route.name}: the button does nothing`);
  }

  const hiddenContext = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  await hiddenContext.addInitScript(() => {
    window.requestAnimationFrame = () => 0;
    Object.defineProperty(document, "hidden", { get: () => true });
  });
  const hiddenPage = await hiddenContext.newPage();
  for (const { path, button } of INSTRUMENTS) {
    await hiddenPage.goto(`http://localhost:${PORT}${base}${path}`, { waitUntil: "networkidle" });
    await hiddenPage.click(button);
    const finished = await hiddenPage
      .waitForFunction(settled(button), null, { timeout: 20_000 })
      .then(() => true)
      .catch(() => false);
    if (!finished) failures.push(`${path}: with the tab in the background, where requestAnimationFrame never fires, the run never finishes`);
  }
  await hiddenContext.close();

  for (const scheme of ["light", "dark"] as const) {
    const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, colorScheme: scheme });
    const contrastPage = await context.newPage();
    for (const path of CONTRAST_PAGES) {
      await contrastPage.goto(`http://localhost:${PORT}${base}${path}`, { waitUntil: "networkidle" });
      await contrastPage.addScriptTag({ content: axeSource });
      const nodes = await contrastPage.evaluate(async () => {
        const result = await (window as any).axe.run(document, { runOnly: ["color-contrast"] });
        return result.violations.flatMap((v: any) =>
          v.nodes.map((n: any) => ({
            target: String(n.target[0]),
            ratio: n.any[0]?.data?.contrastRatio,
            need: n.any[0]?.data?.expectedContrastRatio,
            text: (document.querySelector(n.target[0])?.textContent ?? "").trim().slice(0, 30),
          })),
        );
      });
      for (const node of nodes) {
        const line = `${path} (${scheme}): "${node.text}" at ${node.target} is ${node.ratio}:1, needs ${node.need}`;
        if (PLATFORM_OWNED.test(node.target)) platformOwned.push(line);
        else failures.push(line);
      }
    }
    await context.close();
  }

  const phone = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, hasTouch: true });
  const phonePage = await phone.newPage();
  for (const path of CONTRAST_PAGES) {
    await phonePage.goto(`http://localhost:${PORT}${base}${path}`, { waitUntil: "networkidle" });
    const clipped = await phonePage.evaluate(() =>
      [...document.querySelectorAll("main table")]
        .map((table) => {
          let box: HTMLElement | null = table.parentElement;
          while (box && box.scrollWidth <= box.clientWidth + 1 && box.tagName !== "MAIN") box = box.parentElement;
          const hidden = box && box.tagName !== "MAIN" ? box.scrollWidth - box.clientWidth : 0;
          const last = table.querySelector("thead th:last-child")?.textContent?.trim() ?? "";
          return { hidden, last };
        })
        .filter((t) => t.hidden > 1),
    );
    for (const table of clipped) failures.push(`${path} at 390 px: a table hides ${table.hidden} px off screen, including its "${table.last}" column`);
  }
  await phone.close();
} finally {
  await browser.close();
  await server.stop();
}

if (failures.length > 0) {
  for (const failure of failures) console.error(`✗ ${failure}`);
  console.error(`✗ browser: ${failures.length} problem(s)`);
  process.exit(1);
}
console.log(`✓ browser: ${INSTRUMENTS.length} instruments run twice from the keyboard without losing focus still work when reached by a link, and finish in a background tab; ${CONTRAST_PAGES.length} pages pass colour contrast in light and dark and hide no table column at 390 px (${platformOwned.length} findings on platform-owned elements, not counted)`);
