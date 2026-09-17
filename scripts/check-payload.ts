#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const DIST = resolve("dist");
const LINK_KBPS = 400;
const BUDGET_SECONDS = 3;
const BUDGET_BYTES = Math.round(((LINK_KBPS * 1000) / 8) * BUDGET_SECONDS);
const SKIP = [/^api\//, /^pagefind\//, /^decks\//];

function htmlPages(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return htmlPages(path);
    return entry.name.endsWith(".html") ? [path] : [];
  });
}

function localAssets(html: string): string[] {
  const refs = new Set<string>();
  for (const match of html.matchAll(/(?:src|href)="([^"#?]+)[^"]*"/g)) refs.add(match[1]);
  for (const match of html.matchAll(/srcset="([^"]+)"/g)) {
    const first = match[1].split(",")[0]?.trim().split(/\s+/)[0];
    if (first) refs.add(first);
  }
  return [...refs].filter((ref) => /\.(css|js|mjs|avif|webp|png|jpe?g|svg|woff2?)$/i.test(ref));
}

function resolveAsset(ref: string): string | null {
  const parts = ref.split("/").filter(Boolean);
  for (let skip = 0; skip < parts.length; skip++) {
    const candidate = join(DIST, ...parts.slice(skip));
    if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
  }
  return null;
}

const kb = (bytes: number) => `${(bytes / 1024).toFixed(1)} KB`;

export function main(): boolean {
  let failed = false;
  const pages = htmlPages(DIST)
    .map((path) => ({ path, rel: relative(DIST, path) }))
    .filter((page) => !SKIP.some((pattern) => pattern.test(page.rel)));

  const results = pages.map((page) => {
    const html = readFileSync(page.path, "utf8");
    const assets = localAssets(html)
      .map(resolveAsset)
      .filter((path): path is string => path !== null);
    const parts = [page.path, ...new Set(assets)].map((path) => ({ path, bytes: statSync(path).size }));
    return { rel: page.rel, parts, total: parts.reduce((sum, part) => sum + part.bytes, 0) };
  });

  for (const result of results.sort((a, b) => b.total - a.total)) {
    const seconds = result.total / ((LINK_KBPS * 1000) / 8);
    if (result.total > BUDGET_BYTES) {
      failed = true;
      console.error(`✗ ${result.rel}: ${kb(result.total)} is ${seconds.toFixed(1)}s at ${LINK_KBPS} kbit/s, past ${BUDGET_SECONDS}s`);
      for (const part of [...result.parts].sort((a, b) => b.bytes - a.bytes).slice(0, 3)) {
        console.error(`    ${kb(part.bytes).padStart(9)}  ${relative(DIST, part.path)}`);
      }
    }
  }
  const worst = results[0];
  if (!failed && worst) {
    console.log(`✓ payload: ${results.length} pages, heaviest ${worst.rel} at ${kb(worst.total)}, inside ${kb(BUDGET_BYTES)}`);
  }
  return failed;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  if (main()) process.exit(1);
}
