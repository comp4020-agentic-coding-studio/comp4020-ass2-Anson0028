#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { chromium } from "playwright";

const FIGURES = {
  table: {
    out: "table-w11-390.png",
    kind: "table",
    route: "/lectures/week-11/",
    shots: [
      { sha: "33439a6", says: "the check goes in, red" },
      { sha: "81cd501", says: "the fix" },
    ],
  },
  deck: {
    out: "deck-code-390.png",
    kind: "deck",
    route: "/decks/week-02/",
    shots: [
      { sha: "4da87b4", says: "the check goes in, red" },
      { sha: "0915cda", says: "the fix" },
    ],
  },
} as const;

const figure = FIGURES[(process.argv[2] ?? "table") as keyof typeof FIGURES];
const MAIN = resolve(".");
const OUT = join(MAIN, "docs", figure.out);
const PLAYWRIGHT = join(MAIN, "node_modules/playwright/index.mjs");

const SHOT = `import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { preview } from "astro";
import { chromium } from ${JSON.stringify(PLAYWRIGHT)};

const [out, route, kind] = process.argv.slice(2);
const PORT = 4395;
const base = readFileSync(join(resolve("dist"), "index.html"), "utf8").match(/"(\\/[^"/]+)\\/_astro\\//)?.[1] ?? "";
const server = await preview({ root: process.cwd(), server: { port: PORT }, logLevel: "silent" });
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true });
  await page.goto(\`http://localhost:\${PORT}\${base}\${route}\`, { waitUntil: "networkidle" });
  let measured;
  if (kind === "table") {
    await page.addStyleTag({ content: "*, html { scroll-behavior: auto !important; }" });
    measured = await page.evaluate(() => {
      const table = document.querySelector("main table");
      let box = table.parentElement;
      while (box && box.scrollWidth <= box.clientWidth + 1 && box.tagName !== "MAIN") box = box.parentElement;
      const scroller = box && box.tagName !== "MAIN" ? box : table;
      return {
        hidden: scroller.scrollWidth - scroller.clientWidth,
        last: table.querySelector("thead th:last-child")?.textContent?.trim() ?? "",
        top: table.getBoundingClientRect().top + window.scrollY,
      };
    });
    await page.screenshot({ path: out, fullPage: true, clip: { x: 0, y: Math.max(0, measured.top - 16), width: 390, height: 520 } });
    console.log(\`\${measured.hidden} px hidden, last column "\${measured.last}"\`);
  } else {
    await page.waitForSelector(".reveal .slides section.present", { timeout: 20_000 });
    let found = false;
    for (let i = 0; i < 20 && !found; i++) {
      found = await page.$$eval(".reveal .slides section.present pre code", (n) => n.length > 0);
      if (!found) {
        await page.keyboard.press("ArrowRight");
        await page.waitForTimeout(300);
      }
    }
    if (!found) throw new Error("no slide with a code block in " + route);
    measured = await page.evaluate(() => {
      const slide = document.querySelector(".reveal .slides section.present");
      const stage = document.querySelector(".reveal .slides");
      const scale = stage.getBoundingClientRect().width / stage.offsetWidth;
      const box = slide.getBoundingClientRect();
      return { px: Number.parseFloat(getComputedStyle(slide.querySelector("pre code")).fontSize) * scale, top: box.top, height: box.height };
    });
    await page.screenshot({
      path: out,
      clip: { x: 0, y: Math.max(0, measured.top - 16), width: 390, height: Math.min(844, measured.height + 32) },
    });
    console.log(\`code at \${measured.px.toFixed(1)} px\`);
  }
} finally {
  await browser.close();
  await server.stop();
}
`;

const run = (cmd: string, args: string[], cwd: string) => execFileSync(cmd, args, { cwd, stdio: ["ignore", "pipe", "inherit"] }).toString().trim();

const shots = mkdtempSync(join(tmpdir(), "evidence-shots-"));
const taken: { sha: string; says: string; read: string; file: string }[] = [];

for (const shot of figure.shots) {
  const tree = join(mkdtempSync(join(tmpdir(), "evidence-")), shot.sha);
  process.stderr.write(`── ${shot.sha} ${figure.route} at 390 px\n`);
  run("git", ["worktree", "add", "--detach", tree, shot.sha], MAIN);
  try {
    run("pnpm", ["install", "--frozen-lockfile"], tree);
    run("pnpm", ["build"], tree);
    writeFileSync(join(tree, "shot.mjs"), SHOT);
    const file = join(shots, `${shot.sha}.png`);
    const read = run("node", ["shot.mjs", file, figure.route, figure.kind], tree);
    taken.push({ ...shot, read, file });
    process.stderr.write(`   ${read}\n`);
  } finally {
    run("git", ["worktree", "remove", "--force", tree], MAIN);
    rmSync(dirname(tree), { recursive: true, force: true });
  }
}

const panel = (shot: (typeof taken)[number]) => `
  <figure>
    <img src="data:image/png;base64,${readFileSync(shot.file).toString("base64")}" alt="">
    <figcaption><b>${shot.sha}</b> ${shot.says}<span>${shot.read}</span></figcaption>
  </figure>`;

const page = `<!doctype html><meta charset="utf-8">
<style>
  body { margin: 0; padding: 20px; background: #fdfcf8; font-family: ui-monospace, Menlo, monospace; display: flex; gap: 20px; width: 860px; }
  figure { margin: 0; flex: 1; }
  img { display: block; width: 100%; border: 1px solid #1b1a17; }
  figcaption { display: flex; justify-content: space-between; gap: 1rem; margin-top: 8px; font-size: 12px; color: #1b1a17; }
  b { font-weight: 700; }
  span { white-space: nowrap; }
</style>
${taken.map(panel).join("")}`;

mkdirSync(dirname(OUT), { recursive: true });
const browser = await chromium.launch();
try {
  const view = await browser.newPage({ viewport: { width: 860, height: 600 }, deviceScaleFactor: 2 });
  await view.setContent(page, { waitUntil: "load" });
  await view.locator("body").screenshot({ path: OUT });
} finally {
  await browser.close();
}
rmSync(shots, { recursive: true, force: true });

console.log(`✓ evidence: docs/${figure.out} — ${figure.route} at 390 px, ${taken.map((s) => `${s.sha} ${s.read}`).join(" then ")}`);
