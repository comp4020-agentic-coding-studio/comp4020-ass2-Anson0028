import { chaseXpPolicy, runHeadless, withReaction } from "../lib/close-quarters";

const RUNS = 51;

const seeded = (n: number) => {
  let s = n >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
};

const yieldFrame = () =>
  document.hidden
    ? Promise.resolve()
    : new Promise<void>((resolve) => {
        const fallback = setTimeout(resolve, 60);
        requestAnimationFrame(() => {
          clearTimeout(fallback);
          resolve();
        });
      });

export async function runRow(reactionMs: number, batch: number, onRun: (wins: number, done: number) => void): Promise<number> {
  let wins = 0;
  for (let i = 0; i < RUNS; i++) {
    const rng = seeded((i + 1) * 97 + batch * 5003);
    const { outcome } = runHeadless(withReaction(chaseXpPolicy, rng, reactionMs), rng, "first");
    if (outcome === "won") wins++;
    onRun(wins, i + 1);
    if (i % 3 === 2) await yieldFrame();
  }
  return wins;
}

export async function survivalTimes(reactionMs: number, count: number, batch: number): Promise<number[]> {
  const times: number[] = [];
  for (let i = 0; i < count; i++) {
    const rng = seeded((i + 1) * 97 + batch * 5003);
    times.push(runHeadless(withReaction(chaseXpPolicy, rng, reactionMs), rng, "first").ms);
    if (i % 3 === 2) await yieldFrame();
  }
  return times;
}
