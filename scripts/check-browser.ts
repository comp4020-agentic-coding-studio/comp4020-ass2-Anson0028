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
    const firstColumn = await page.$$eval(".drift tbody tr .live", (cells) => cells.map((c) => parseFloat(c.textContent ?? "")));

    const focused = await page.evaluate((sel) => document.activeElement === document.querySelector(sel), button);
    if (!focused) failures.push(`${path}: after a run, keyboard focus has left ${button}`);

    await page.keyboard.press("Enter");
    await page.waitForTimeout(400);
    await page.waitForFunction(settled(button), null, { timeout: 90_000 });
    const second = (await page.textContent(status)) ?? "";
    if (second === first) failures.push(`${path}: a second Enter did nothing; the status still reads "${first.slice(0, 60)}…"`);
    if (button === "#run-drift") {
      for (const [when, text] of [["first", first], ["second", second]] as const) {
        const said = Number(/moved by ([\d.]+) s/.exec(text)?.[1]);
        const shown = when === "second" ? await page.$$eval(".drift tbody tr .live", (cells) => cells.map((c) => parseFloat(c.textContent ?? ""))) : firstColumn;
        const spread = Math.max(...shown) - Math.min(...shown);
        if (Math.abs(said - spread) > 0.05) failures.push(`${path}: after the ${when} run the status says the median moved by ${said} s, but the column it sits under spans ${spread.toFixed(1)} s`);
      }
    }
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

  const offlineContext = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const offlinePage = await offlineContext.newPage();
  const at = (path: string) => `http://localhost:${PORT}${base}${path}`;
  const within = async (seconds: number, check: () => Promise<boolean>) => {
    const end = Date.now() + seconds * 1000;
    while (Date.now() < end) {
      try {
        if (await check()) return true;
      } catch {}
      await new Promise((r) => setTimeout(r, 250));
    }
    return false;
  };
  const hasFocus = (button: string) => offlinePage.evaluate((b) => document.activeElement === document.querySelector(b), button);
  const ranWithFocus = async (where: string, button: string, status: string) => {
    const ran = await within(30, () =>
      offlinePage.evaluate(
        ([b, st]) => document.querySelector(b)?.getAttribute("aria-disabled") !== "true" && /runs in/.test(document.querySelector(st)?.textContent ?? ""),
        [button, status],
      ),
    );
    if (!ran) failures.push(`${where}: back online, one press does not run`);
    else if (!(await hasFocus(button))) failures.push(`${where}: back online, it ran, but keyboard focus has left ${button}`);
  };
  const failOffline = async (path: string, button: string, status: string) => {
    await offlinePage.goto(at(path), { waitUntil: "networkidle" });
    await offlineContext.setOffline(true);
    await offlinePage.focus(button);
    await offlinePage.keyboard.press("Enter");
    const released = await offlinePage
      .waitForFunction(settled(button), null, { timeout: 10_000 })
      .then(() => true)
      .catch(() => false);
    const said = ((await offlinePage.textContent(status)) ?? "").trim();
    if (!released) {
      failures.push(`${path}: pressed while offline, the button stays busy for good ("${said.slice(0, 40)}")`);
      return false;
    }
    if (said === "" || /^(Loading|Running|New seeds)/.test(said)) failures.push(`${path}: pressed while offline, the page does not say what went wrong`);
    if (!(await hasFocus(button))) failures.push(`${path}: pressed while offline, keyboard focus has left ${button}`);
    return true;
  };
  for (const { path, button, status } of INSTRUMENTS) {
    if (!(await failOffline(path, button, status))) {
      await offlineContext.setOffline(false);
      continue;
    }
    await offlinePage.keyboard.press("Enter");
    await offlinePage.waitForTimeout(1_500);
    const stayed = offlinePage.url() === at(path) && (await offlinePage.$(button)) !== null;
    await offlineContext.setOffline(false);
    if (!stayed) {
      failures.push(`${path}: pressed again while still offline, the page threw itself away (now at ${offlinePage.url()})`);
      continue;
    }
    await offlinePage.keyboard.press("Enter");
    await ranWithFocus(path, button, status);
  }
  if (await failOffline("/lectures/week-05/", "#run-51", "#run-status")) {
    await offlineContext.setOffline(false);
    await offlinePage.locator(`a[href$="/lectures/week-04/"]`).first().click();
    await offlinePage.waitForURL(at("/lectures/week-04/"), { timeout: 15_000 });
    await offlinePage.waitForLoadState("networkidle");
    await offlinePage.waitForTimeout(800);
    await offlinePage.focus("#run-drift");
    await offlinePage.keyboard.press("Enter");
    await ranWithFocus("failed offline on week 5, then followed the link to week 4", "#run-drift", "#drift-status");
  }
  await offlineContext.close();

  const hiddenContext = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  await hiddenContext.addInitScript(() => {
    window.requestAnimationFrame = () => 0;
    Object.defineProperty(document, "hidden", { get: () => true });
  });
  const hiddenPage = await hiddenContext.newPage();
  for (const { path, button, status } of INSTRUMENTS) {
    await hiddenPage.goto(`http://localhost:${PORT}${base}${path}`, { waitUntil: "networkidle" });
    await hiddenPage.click(button);
    const finished = await hiddenPage
      .waitForFunction(
        ([b, st]) => document.querySelector(b)?.getAttribute("aria-disabled") !== "true" && /runs in/.test(document.querySelector(st)?.textContent ?? ""),
        [button, status],
        { timeout: 60_000 },
      )
      .then(() => true)
      .catch(() => false);
    if (!finished) failures.push(`${path}: with the tab in the background, where requestAnimationFrame never fires, the run never reports a result`);
  }
  await hiddenContext.close();

  const slowContext = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const slowPage = await slowContext.newPage();
  const cdp = await slowContext.newCDPSession(slowPage);
  await cdp.send("Network.enable");
  await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: 400, downloadThroughput: 50 * 1024, uploadThroughput: 50 * 1024 });
  for (const { path, button, status } of INSTRUMENTS) {
    await slowPage.goto(`http://localhost:${PORT}${base}${path}`, { waitUntil: "domcontentloaded" });
    const looksReady = await slowPage.evaluate((b) => document.querySelector(b)?.getAttribute("aria-disabled") !== "true", button);
    if (!looksReady) continue;
    await slowPage.click(button);
    const ran = await slowPage
      .waitForFunction(
        ([b, st]) => document.querySelector(b)?.getAttribute("aria-disabled") !== "true" && /runs in/.test(document.querySelector(st)?.textContent ?? ""),
        [button, status],
        { timeout: 60_000 },
      )
      .then(() => true)
      .catch(() => false);
    if (!ran) failures.push(`${path}: on a slow connection, a press made as soon as the button appears is lost, and nothing says so`);
  }
  await slowContext.close();

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
        failures.push(line);
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
console.log(`✓ browser: ${INSTRUMENTS.length} instruments run twice from the keyboard without losing focus still work when reached by a link, finish in a background tab, take a press made before a slow page has finished loading, and, after a press made offline, stay on the page when pressed offline again and run with one press once back online, focus kept, on the same page or the next; ${CONTRAST_PAGES.length} pages pass colour contrast in light and dark and hide no table column at 390 px`);
