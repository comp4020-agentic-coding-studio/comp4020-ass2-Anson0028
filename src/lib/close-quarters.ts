// The whole game, with no browser in it. No canvas, no requestAnimationFrame,
// no wall-clock reads: step() only ever advances by the dt it is handed. That
// is what lets the same function drive the rendered game and a headless run
// that finishes in milliseconds, which is how the upgrade pool gets checked
// for trap options rather than argued about.
//
// Everything is in normalised arena coordinates, 0 to 1 on both axes.

export type Vec2 = { x: number; y: number };
export type EnemyKind = "walker" | "shooter" | "charger";

export type Enemy = Vec2 & {
  health: number;
  maxHealth: number;
  speed: number;
  hitCd: number;
  kind: EnemyKind;
  /** Seconds until this one does its thing again — shoot, or charge. */
  cd: number;
  /** A charge in progress: direction, and how long is left of it. */
  dash?: { x: number; y: number; t: number };
  counted?: boolean;
  boss?: boolean;
  /** The second boss does both. */
  charges?: boolean;
  /** Which barrage pattern a boss fires next, cycling. */
  burstIndex?: number;
};

/** Something the enemies fired. Costs a heart, same as walking into one. */
export type Hazard = Vec2 & { dx: number; dy: number; life: number };
export type Orb = Vec2 & { life: number; value: number };
export type Shot = Vec2 & { dx: number; dy: number; life: number };
export type Input = { x: number; y: number };

export type UpgradeId =
  | "speed"
  | "damage"
  | "rate"
  | "magnet"
  | "orbit"
  | "bolt"
  | "nova";

export type Upgrade = { id: UpgradeId; kind: "stat" | "weapon" };

// Seven, each five deep. Small enough to finish and to balance; wide enough
// that two runs are not the same run.
export const UPGRADES: readonly Upgrade[] = [
  { id: "speed", kind: "stat" },
  { id: "damage", kind: "stat" },
  { id: "rate", kind: "stat" },
  { id: "magnet", kind: "stat" },
  { id: "orbit", kind: "weapon" },
  { id: "bolt", kind: "weapon" },
  { id: "nova", kind: "weapon" },
];

export const MAX_LEVEL = 5;
export const RUN_MS = 120_000; // two minutes: an ending a stranger reaches
export const START_HEARTS = 3;

export type Build = Record<UpgradeId, number>;

export type Run = {
  player: Vec2;
  hearts: number;
  invulnerableFor: number;
  enemies: Enemy[];
  orbs: Orb[];
  shots: Shot[];
  hazards: Hazard[];
  build: Build;
  xp: number;
  level: number;
  pending: UpgradeId[] | null;
  kills: number;
  bossIndex: number;
  /** When the boss on the field has to be dead by, or the run is over. */
  bossDeadline: number | null;
  elapsedMs: number;
  outcome: "playing" | "won" | "lost";
  orbitPhase: number;
  cooldowns: { bolt: number; nova: number; spawn: number; field: number };
};

const PLAYER_SPEED = 0.26; // arena-fractions per second, before upgrades
const CONTACT_RADIUS = 0.030;
const INVULNERABLE_S = 1.2;
// What a piece of experience is worth. The ones lying on the field are worth
// one; the ones that fall out of something you killed are worth more. With
// everything worth the same, running away and hoovering up the free stuff
// beat going anywhere near the fighting — 102 seconds against 87 — which is
// the opposite of what this game is supposed to be about.
const FIELD_ORB_VALUE = 1;
const KILL_ORB_VALUE = 2.5;

// Orbs do not rot. The field is meant to fill up: some are lying there before
// the first enemy arrives, and more keep arriving, so there is always
// something worth walking to. Capped only so the arena does not turn to
// confetti.
const ORB_LIFE_S = 1e9;
const FIELD_ORBS_AT_START = 14;
const FIELD_ORB_INTERVAL = 1.6;
// Forty-six of them, never decaying, carpeted the arena: at that density they
// stop reading as things to pick up and start reading as background texture,
// and a player who has killed thirty-one things is still on level two because
// none of it is close enough to walk over by accident.
const MAX_ORBS = 26;
const ORBIT_RADIUS = 0.10;
const ORBIT_RATE = 2.0; // turns per second
// A wide shard, not a point. At 0.045 and 2.6 turns a second the swept
// window was about a fifth of a turn, so an enemy walking through the ring
// was hit about one time in five — and a standing player killed nothing at
// all. In the headless runs the player is always moving, which sweeps the
// shard across enemies and hid it completely; it took standing still in the
// live game for six seconds with nothing dying to see it. A stranger's first
// key press has to make something happen.
const ORBIT_HIT = 0.062;
// Damage per hit, with a cooldown per enemy rather than damage per second of
// contact. Contact-time damage measured out as three dead upgrades: spinning
// faster swept each enemy more often but for proportionally less time, so the
// attack-rate upgrade was worth exactly nothing, and raw damage was pure
// overkill against three-health trash. Per-hit damage on a cooldown that
// shortens with attack rate makes all three of damage, rate and extra shards
// mean something — which is what the pool measurement is for.
const ORBIT_DAMAGE = 12;
const ORBIT_HIT_CD = 0.40; // seconds an enemy is immune to the shards for
const SHOT_SPEED = 0.75;
// The opening weapon was doing 22 a shot every 0.75 seconds, which flattened
// the first minute: nothing that arrived early lived long enough to be a
// problem, so there was nothing to learn from. Slower and weaker — it still
// answers the first key press with a kill, it just stops answering all of
// them.
const BOLT_DAMAGE = 17;
const BOLT_INTERVAL = 0.85;
// Unranged, it targeted the nearest enemy anywhere in the arena, so standing
// still cleared the screen from corner to corner with nothing ever getting
// close enough to matter — a full-arena auto-turret is not a weapon a run
// can be hard around. Capped at this, an enemy has to close roughly a third
// of the arena before the bolt notices it.
const BOLT_RANGE = 0.32;

// Something with real health, twice a run, on a clock. This is where the
// experience you did or did not pick up gets asked about.
//
// Its health is set by how far behind you are, not by a fixed number. A flat
// number made the window a pure damage race, and measured that way the
// movement card was worth exactly nothing — same survival, same kills, to the
// decimal — because moving faster kills nothing. Scaling the boss by level
// makes every card that gets you levels count, which is all of them, and it
// says the thing the design is actually about: the boss is as hard as you are
// unprepared.
export const BOSS_TIMES_MS = [40_000, 80_000] as const;
export const BOSS_WINDOW_MS = 26_000;
// Sized so the opening weapon on its own cannot do it. Base damage is about
// 20 a second and the window is 22, so anything under 440 is a boss a player
// who declined every card can still kill — and at 200 they did, eleven runs
// out of fifteen. The gate has to actually be a gate.
const BOSS_HEALTH = [340, 560] as const;
/** The level a boss expects you to have reached by the time it arrives. */
export const BOSS_EXPECTS = [6, 12] as const;
const BOSS_SPEED = [0.10, 0.13] as const;
const HAZARD_SPEED = 0.34;
const HAZARD_LIFE = 4.5;
const HAZARD_RADIUS = 0.014;
const SHOOTER_RANGE = 0.34;
const SHOOTER_INTERVAL = 2.4;
const CHARGE_SPEED = 0.85;
const CHARGE_TIME = 0.42;
const CHARGE_INTERVAL = 3.4;
const BOSS_BURST_INTERVAL = 3.2;
const BOSS_BURST_COUNT = 12;
// A ring only ever asks one question — which gap is nearest — and once
// that is answered it is answered every time it recurs. The fan asks where
// the player is standing right now, so the same walk-to-the-gap answer
// doesn't carry over. Alternating the two keeps the boss window asking a
// live question instead of the same one on a shorter clock.
const BOSS_FAN_COUNT = 5;
const BOSS_FAN_SPREAD = Math.PI / 1.8;
export const BOSS_RADIUS = 0.055;
const BOSS_ORBS = 10;

function emptyBuild(): Build {
  return { speed: 0, damage: 0, rate: 0, magnet: 0, orbit: 0, bolt: 0, nova: 0 };
}

export function createRun(rng: () => number = Math.random): Run {
  const scattered: Orb[] = [];
  for (let i = 0; i < FIELD_ORBS_AT_START; i++) {
    // Never right on top of the player: the first one has to be walked to.
    const a = rng() * Math.PI * 2;
    const r = 0.12 + rng() * 0.36;
    scattered.push({ x: clamp01(0.5 + Math.cos(a) * r), y: clamp01(0.5 + Math.sin(a) * r), life: ORB_LIFE_S, value: FIELD_ORB_VALUE });
  }
  return {
    player: { x: 0.5, y: 0.5 },
    hearts: START_HEARTS,
    invulnerableFor: 0,
    enemies: [],
    orbs: scattered,
    shots: [],
    hazards: [],
    // One weapon from the start, and it is the one that shoots. The orbiting
    // shard opened the game for a while and it asked too much: it only kills
    // what you walk into, so a player who has not worked that out yet stands
    // still and watches nothing die. A bolt that flies at the nearest thing
    // answers the first key press with a kill, and the shard is still in the
    // pool for anyone who wants it.
    build: { ...emptyBuild(), bolt: 1 },
    xp: 0,
    level: 1,
    pending: null,
    kills: 0,
    bossIndex: 0,
    bossDeadline: null,
    elapsedMs: 0,
    outcome: "playing",
    orbitPhase: 0,
    // The first weapon arrives almost immediately, because a player who has
    // pressed a key and seen nothing happen has already learned the wrong
    // thing about this game.
    cooldowns: { bolt: 0, nova: 0, spawn: 0.7, field: FIELD_ORB_INTERVAL },
  };
}

// --- derived stats ---------------------------------------------------------
// Every upgrade is a multiplier on one number. Flat bonuses stop mattering as
// a run goes on; multipliers keep the fifth level of a thing worth as much as
// the first, which is what makes a five-deep pool worth having.

export const moveSpeed = (b: Build) => PLAYER_SPEED * (1 + 0.30 * b.speed);
export const damageMul = (b: Build) => 1 + 0.45 * b.damage;
export const rateMul = (b: Build) => 1 + 0.32 * b.rate;
/**
 * You have to walk onto it. Nothing is collected at a distance until the Draw
 * card says so — the reach was free before, and free reach is the difference
 * between "go and get it" and "wander near it", which is the whole verb this
 * game has.
 */
export const TOUCH_RADIUS = 0.026;

/** How far Draw pulls from. Zero until it is taken. */
export const drawRadius = (b: Build) => (b.magnet === 0 ? 0 : 0.075 + 0.045 * (b.magnet - 1));

/**
 * What one orb is worth. Radius alone made this upgrade a trap: measured at
 * -1.4 seconds against taking nothing, because a pickup reach generous enough
 * for a human to enjoy is already generous enough that more of it buys
 * nothing. Reach and value together is what "faster experience" has to mean
 * here, and it is the difference between a card that reads as a choice and a
 * card that punishes whoever picks it.
 */
export const xpPerOrb = (b: Build) => 1 + 0.4 * b.magnet;

/**
 * How much XP a level costs. It used to be linear, and the first level-up
 * landed a second or two into a run: the orbs lying around the start were
 * enough on their own, so the card screen arrived before anything had
 * happened. Superlinear means the early ones are still quick and the late
 * ones have to be worked for, which is the shape this kind of game wants.
 */
export const xpForLevel = (level: number) => 4 + Math.round(1.6 * level ** 1.35);

/** Old note kept for the record — how much XP a level costs. Rises, so the last upgrade is earned — and
 *  steeply enough that a run is not one long card screen. At 3 + 2L a
 *  two-minute run reached level 24 — a level-up every five seconds, a game
 *  about choosing rather than about moving. At 5 + 4L it reached nine and
 *  most of the pool never came out. This is fourteen, about one every eight
 *  seconds, and an ordinary player wins about two runs in five. */

// --- levelling -------------------------------------------------------------

/** Three distinct upgrades, none of them already maxed. */
export function offerChoices(build: Build, rng: () => number): UpgradeId[] {
  const pool = UPGRADES.filter((u) => build[u.id] < MAX_LEVEL).map((u) => u.id);
  const picked: UpgradeId[] = [];
  const bag = [...pool];
  while (picked.length < 3 && bag.length > 0) {
    picked.push(bag.splice(Math.floor(rng() * bag.length), 1)[0]);
  }
  // Only reachable if fewer than three things are left unmaxed, which the
  // run length makes impossible — but a card face with a hole in it is worse
  // than a repeat, so it repeats rather than showing two.
  while (picked.length < 3 && pool.length > 0) picked.push(pool[picked.length % pool.length]);
  return picked;
}

export function applyUpgrade(run: Run, id: UpgradeId): void {
  if (run.build[id] >= MAX_LEVEL) return;
  run.build[id]++;
  run.pending = null;
}

// --- the loop --------------------------------------------------------------

function clamp01(n: number): number {
  return n < 0 ? 0 : n > 1 ? 1 : n;
}

function dist(a: Vec2, b: Vec2): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/** Enemies arrive faster and tougher as the run goes on. The player never
 *  chooses this; they only feel it. */
/** What kinds have shown up by now. Walkers teach the game; the other two
 *  arrive once it has been taught, so nothing new is ever the first thing a
 *  player meets. */
/** How much upgrading has actually been done — every level of everything. */
export const upgradesTaken = (b: Build) => UPGRADES.reduce((n, u) => n + b[u.id], 0);

/**
 * What the boss brings, given how much the player has actually banked. Behind
 * what it expects and it is proportionally tougher; ahead and it is softer,
 * floored and capped so neither end is absurd.
 *
 * It counts upgrades taken, not level reached. Level was the first version and
 * it was wrong in a way only the headless runs could show: a run that declines
 * every card still levels, so the player who had banked nothing was being
 * handed a *weaker* boss for having been offered cards and refused them.
 */
export function bossHealth(index: number, taken: number): number {
  const behind = BOSS_EXPECTS[index] / Math.max(1, taken);
  return BOSS_HEALTH[index] * Math.min(2.6, Math.max(0.45, behind));
}

export function kindsAt(elapsedMs: number): EnemyKind[] {
  const kinds: EnemyKind[] = ["walker"];
  if (elapsedMs > 22_000) kinds.push("shooter");
  if (elapsedMs > 48_000) kinds.push("charger");
  return kinds;
}

function spawnPressure(elapsedMs: number): { interval: number; health: number; speed: number; count: number } {
  const t = elapsedMs / RUN_MS;
  // The opening used to trickle in one enemy every ~1.9s and never put more
  // than one on screen at once in the first 20s (measured: avgMaxAlive0to20
  // = 1.00 across 8 seeds) — bumping the whole-run curve to fix that also
  // collapsed the win rate, because the same curve governs the final third
  // of the run. So the boost is front-loaded and fades to nothing by t=0.15
  // (18s): the mid/late curve, and the win/boss-pass rates it was tuned
  // against, are unchanged past that point.
  const earlyBoost = Math.max(0, 0.15 - t) / 0.15;
  return {
    interval: 1.9 - 1.1 * t - 0.6 * earlyBoost,
    health: 3 + 15 * t,
    // Fast enough by the end to catch a player who has not levelled their
    // legs: 0.29 against a base 0.26. When they topped out under the player's
    // own speed, the movement card measured at nothing, because there was
    // never anything to outrun.
    speed: 0.12 + 0.17 * t,
    count: 1 + Math.floor(t * 2.5) + (earlyBoost > 0 ? 1 : 0),
  };
}

function spawnEnemy(run: Run, rng: () => number, p: ReturnType<typeof spawnPressure>): void {
  // Around the edge, so nothing ever appears on top of the player.
  const edge = Math.floor(rng() * 4);
  const along = rng();
  const at =
    edge === 0 ? { x: along, y: -0.03 }
    : edge === 1 ? { x: along, y: 1.03 }
    : edge === 2 ? { x: -0.03, y: along }
    : { x: 1.03, y: along };
  const kinds = kindsAt(run.elapsedMs);
  const kind = kinds[Math.floor(rng() * kinds.length)];
  // A charger that dies to the first bolt it walks into was never a threat
  // to dodge, it was a threat to ignore: the dash telegraphs and then does
  // nothing because the thing doing it is already dead. Tankier than a
  // walker, not just faster, so surviving its charge is what kills it.
  const healthMul = kind === "charger" ? 1.15 : kind === "shooter" ? 0.75 : 1;
  run.enemies.push({
    ...at,
    health: p.health * healthMul,
    maxHealth: p.health,
    speed: p.speed * (kind === "charger" ? 0.5 : kind === "shooter" ? 0.8 : 1),
    hitCd: 0,
    kind,
    cd: kind === "shooter" ? SHOOTER_INTERVAL * rng() : CHARGE_INTERVAL * rng(),
  });
}

function hurt(run: Run, enemy: Enemy, amount: number): void {
  enemy.health -= amount;
  if (enemy.health <= 0 && !enemy.counted) {
    enemy.counted = true;
    run.kills++;
    // A boss pays for the fight it just cost you.
    const drops = enemy.boss ? BOSS_ORBS : 1;
    for (let i = 0; i < drops; i++) {
      const a = (i / drops) * Math.PI * 2;
      const r = enemy.boss ? 0.05 : 0;
      run.orbs.push({ x: clamp01(enemy.x + Math.cos(a) * r), y: clamp01(enemy.y + Math.sin(a) * r), life: ORB_LIFE_S, value: KILL_ORB_VALUE });
    }
  }
}

export function step(run: Run, dt: number, input: Input, rng: () => number): void {
  if (run.outcome !== "playing" || run.pending) return;
  const b = run.build;
  run.elapsedMs += dt * 1000;
  run.invulnerableFor = Math.max(0, run.invulnerableFor - dt);

  // Move. This is the only thing the player ever does.
  const mag = Math.hypot(input.x, input.y);
  if (mag > 0) {
    const s = moveSpeed(b) * dt;
    run.player.x = clamp01(run.player.x + (input.x / mag) * s);
    run.player.y = clamp01(run.player.y + (input.y / mag) * s);
  }

  // More experience keeps arriving, wherever it likes. The field is the
  // reason to keep moving once the thing chasing you is dead.
  run.cooldowns.field -= dt;
  if (run.cooldowns.field <= 0) {
    run.cooldowns.field += FIELD_ORB_INTERVAL;
    if (run.orbs.length < MAX_ORBS) {
      run.orbs.push({ x: clamp01(rng()), y: clamp01(rng()), life: ORB_LIFE_S, value: FIELD_ORB_VALUE });
    }
  }

  if (run.bossIndex < BOSS_TIMES_MS.length && run.elapsedMs >= BOSS_TIMES_MS[run.bossIndex]) {
    const i = run.bossIndex++;
    const edge = Math.floor(rng() * 4);
    const along = rng();
    const at =
      edge === 0 ? { x: along, y: -0.05 }
      : edge === 1 ? { x: along, y: 1.05 }
      : edge === 2 ? { x: -0.05, y: along }
      : { x: 1.05, y: along };
    const health = bossHealth(i, upgradesTaken(run.build));
    run.enemies.push({
      ...at,
      health,
      maxHealth: health,
      speed: BOSS_SPEED[i],
      hitCd: 0,
      kind: "walker",
      cd: 1.5,
      boss: true,
      // The first one throws a ring of shot. The second one does that and
      // charges as well, because a second boss that is only a bigger first
      // boss is a bar chart, not an encounter.
      charges: i > 0,
      burstIndex: 0,
    });
    run.bossDeadline = run.elapsedMs + BOSS_WINDOW_MS;
  }
  const bossAlive = run.enemies.some((e) => e.boss);
  if (run.bossDeadline !== null) {
    if (!bossAlive) run.bossDeadline = null;
    else if (run.elapsedMs >= run.bossDeadline) {
      run.outcome = "lost";
      return;
    }
  }

  const p = spawnPressure(run.elapsedMs);
  run.cooldowns.spawn -= dt;
  if (run.cooldowns.spawn <= 0) {
    // The arena stops filling while a boss is on it: the fight is the whole
    // question, and burying it in trash makes it about luck instead.
    if (!bossAlive) for (let i = 0; i < p.count; i++) spawnEnemy(run, rng, p);
    run.cooldowns.spawn += p.interval;
  }

  for (const e of run.enemies) {
    e.hitCd -= dt;
    e.cd -= dt;
    const d = dist(e, run.player) || 1;
    const toward = { x: (run.player.x - e.x) / d, y: (run.player.y - e.y) / d };

    if (e.dash && e.dash.t > 0) {
      // Committed. A charge that steers is just a fast walker; the whole
      // point is that it goes where you were, so stepping aside works.
      e.dash.t -= dt;
      e.x = clamp01(e.x + e.dash.x * CHARGE_SPEED * dt);
      e.y = clamp01(e.y + e.dash.y * CHARGE_SPEED * dt);
      continue;
    }

    if (e.boss) {
      e.x += toward.x * e.speed * dt;
      e.y += toward.y * e.speed * dt;
      if (e.cd <= 0) {
        e.cd = BOSS_BURST_INTERVAL;
        if (e.charges && rng() < 0.5) {
          e.dash = { ...toward, t: CHARGE_TIME * 1.4 };
        } else {
          // Ring and fan alternate. A ring is beaten by walking to whichever
          // gap the random offset happened to leave, and that answer keeps
          // working every time it recurs unchanged. The fan is aimed at
          // wherever the player is standing, so the same answer doesn't
          // carry over — it has to be read as its own attack, not dodged on
          // reflex.
          const fan = (e.burstIndex ?? 0) % 2 === 1;
          e.burstIndex = (e.burstIndex ?? 0) + 1;
          if (fan) {
            const base = Math.atan2(toward.y, toward.x);
            for (let i = 0; i < BOSS_FAN_COUNT; i++) {
              const a = base - BOSS_FAN_SPREAD / 2 + (i / (BOSS_FAN_COUNT - 1)) * BOSS_FAN_SPREAD;
              run.hazards.push({ x: e.x, y: e.y, dx: Math.cos(a), dy: Math.sin(a), life: HAZARD_LIFE });
            }
          } else {
            const off = rng() * Math.PI * 2;
            for (let i = 0; i < BOSS_BURST_COUNT; i++) {
              const a = off + (i / BOSS_BURST_COUNT) * Math.PI * 2;
              run.hazards.push({ x: e.x, y: e.y, dx: Math.cos(a), dy: Math.sin(a), life: HAZARD_LIFE });
            }
          }
        }
      }
      continue;
    }

    if (e.kind === "shooter") {
      // Keeps its distance and makes you come to it, or go round it.
      const want = d > SHOOTER_RANGE ? 1 : d < SHOOTER_RANGE * 0.7 ? -1 : 0;
      e.x += toward.x * e.speed * want * dt;
      e.y += toward.y * e.speed * want * dt;
      if (e.cd <= 0) {
        e.cd = SHOOTER_INTERVAL;
        run.hazards.push({ x: e.x, y: e.y, dx: toward.x, dy: toward.y, life: HAZARD_LIFE });
      }
      continue;
    }

    if (e.kind === "charger") {
      if (e.cd <= 0 && d < 0.55) {
        e.cd = CHARGE_INTERVAL;
        e.dash = { ...toward, t: CHARGE_TIME };
        continue;
      }
      e.x += toward.x * e.speed * dt;
      e.y += toward.y * e.speed * dt;
      continue;
    }

    e.x += toward.x * e.speed * dt;
    e.y += toward.y * e.speed * dt;
  }

  for (const h of run.hazards) {
    h.x += h.dx * HAZARD_SPEED * dt;
    h.y += h.dy * HAZARD_SPEED * dt;
    h.life -= dt;
  }
  run.hazards = run.hazards.filter((h) => h.life > 0 && h.x > -0.08 && h.x < 1.08 && h.y > -0.08 && h.y < 1.08);

  // Weapons. None of them is aimed: the player's only control is standing
  // somewhere, so every weapon fires off its own clock and hits whatever the
  // player has walked into range of.
  if (b.orbit > 0) {
    run.orbitPhase += ORBIT_RATE * rateMul(b) * dt;
    for (let i = 0; i < b.orbit; i++) {
      const a = run.orbitPhase + (i * Math.PI * 2) / b.orbit;
      const at = { x: run.player.x + Math.cos(a) * ORBIT_RADIUS, y: run.player.y + Math.sin(a) * ORBIT_RADIUS };
      for (const e of run.enemies) {
        if (e.hitCd <= 0 && dist(e, at) < ORBIT_HIT + (e.boss ? BOSS_RADIUS : 0)) {
          hurt(run, e, ORBIT_DAMAGE * damageMul(b));
          e.hitCd = ORBIT_HIT_CD / rateMul(b);
        }
      }
    }
  }

  if (b.bolt > 0) {
    run.cooldowns.bolt -= dt * rateMul(b);
    if (run.cooldowns.bolt <= 0) {
      const alive = run.enemies.filter((e) => e.health > 0 && dist(e, run.player) < BOLT_RANGE);
      if (alive.length > 0) run.cooldowns.bolt += BOLT_INTERVAL;
      for (let i = 0; i < b.bolt && alive.length > 0; i++) {
        const target = alive.reduce((best, e) => (dist(e, run.player) < dist(best, run.player) ? e : best), alive[0]);
        const d = dist(target, run.player) || 1;
        run.shots.push({
          x: run.player.x,
          y: run.player.y,
          dx: (target.x - run.player.x) / d,
          dy: (target.y - run.player.y) / d,
          life: 1.4,
        });
        alive.splice(alive.indexOf(target), 1);
      }
    }
  }

  if (b.nova > 0) {
    run.cooldowns.nova -= dt * rateMul(b);
    if (run.cooldowns.nova <= 0) {
      run.cooldowns.nova += 2.6;
      const radius = 0.10 + 0.035 * b.nova;
      for (const e of run.enemies) {
        if (dist(e, run.player) < radius + (e.boss ? BOSS_RADIUS : 0)) hurt(run, e, 16 * b.nova * damageMul(b));
      }
    }
  }

  for (const s of run.shots) {
    s.x += s.dx * SHOT_SPEED * dt;
    s.y += s.dy * SHOT_SPEED * dt;
    s.life -= dt;
    for (const e of run.enemies) {
      if (e.health > 0 && dist(e, s) < 0.026 + (e.boss ? BOSS_RADIUS : 0)) {
        hurt(run, e, BOLT_DAMAGE * damageMul(b));
        s.life = 0;
        break;
      }
    }
  }
  run.shots = run.shots.filter((s) => s.life > 0 && s.x > -0.1 && s.x < 1.1 && s.y > -0.1 && s.y < 1.1);
  run.enemies = run.enemies.filter((e) => e.health > 0);

  // Contact. One heart per immunity window however many are touching:
  // otherwise three frames of overlap take three hearts in fifty milliseconds.
  if (run.invulnerableFor <= 0) {
    const touched =
      run.enemies.some((e) => dist(e, run.player) < CONTACT_RADIUS + (e.boss ? BOSS_RADIUS : 0)) ||
      run.hazards.some((h) => dist(h, run.player) < CONTACT_RADIUS + HAZARD_RADIUS);
    if (touched) {
      run.hearts--;
      run.invulnerableFor = INVULNERABLE_S;
    }
  }

  // XP has to be walked into. That is what keeps the only verb honest: the
  // orbs land where the fighting was, so getting stronger means going back
  // into it.
  // Experience is walked onto, not hoovered up. Draw is what buys the pull,
  // and until it is taken every piece has to be stood on.
  const pull = drawRadius(b);
  run.orbs = run.orbs.filter((o) => {
    o.life -= dt;
    const d = dist(o, run.player);
    if (pull > 0 && d < pull) {
      const speed = 0.55 * (1 - d / pull) + 0.15;
      o.x += ((run.player.x - o.x) / (d || 1)) * speed * dt;
      o.y += ((run.player.y - o.y) / (d || 1)) * speed * dt;
    }
    if (dist(o, run.player) < TOUCH_RADIUS) {
      run.xp += o.value * xpPerOrb(b);
      return false;
    }
    return o.life > 0;
  });

  // The cap applies to everything on the field, not just what spawned on its
  // own: kill drops ignored it and the arena went back to being carpeted.
  // Oldest first, so what you just earned is never what disappears.
  if (run.orbs.length > MAX_ORBS) run.orbs.splice(0, run.orbs.length - MAX_ORBS);

  while (run.xp >= xpForLevel(run.level)) {
    run.xp -= xpForLevel(run.level);
    run.level++;
    run.pending = offerChoices(run.build, rng);
    break;
  }

  if (run.hearts <= 0) run.outcome = "lost";
  else if (run.elapsedMs >= RUN_MS) run.outcome = "won";
}

// --- headless ---------------------------------------------------------------

export type Policy = (run: Run) => Input;

/** Walk away from the nearest thing that can hurt you. */
export const fleePolicy: Policy = (run) => {
  if (run.enemies.length === 0) return { x: 0, y: 0 };
  const near = run.enemies.reduce((a, e) => (dist(e, run.player) < dist(a, run.player) ? e : a), run.enemies[0]);
  const away = { x: run.player.x - near.x, y: run.player.y - near.y };
  // Bounce off the walls rather than reversing into a corner, which is how a
  // fleeing policy dies and would have made "this run is winnable" false for
  // reasons that have nothing to do with the game.
  const toCentre = { x: 0.5 - run.player.x, y: 0.5 - run.player.y };
  const edge = Math.max(Math.abs(run.player.x - 0.5), Math.abs(run.player.y - 0.5));
  const w = edge > 0.36 ? 2.2 : 0;
  const dodge = hazardPush(run);
  return { x: away.x + toCentre.x * w + dodge.x, y: away.y + toCentre.y * w + dodge.y };
};

/**
 * Go and get the experience while staying off the things that hurt — which is
 * what a person actually does, and therefore the only policy the game may be
 * balanced against. The first version of this walked straight at the nearest
 * orb and ignored everything else; it died at thirty seconds, and every
 * balance number measured against it was measured against a player nobody is.
 *
 * A sum of pulls and pushes: towards the nearest orb, away from anything close
 * enough to touch, and away from the walls, which are where you die when you
 * back into one.
 */
/**
 * Step out of the way of anything in flight. Added when the shooters were:
 * both policies avoided enemies and walked straight through their shot, so
 * every measurement after that change was of a player who does not dodge, and
 * the game read as impossible when it was only new.
 */
function hazardPush(run: Run): Input {
  let x = 0;
  let y = 0;
  for (const h of run.hazards) {
    const d = dist(h, run.player);
    if (d < 0.13) {
      const w = (0.13 - d) / 0.13;
      x -= ((h.x - run.player.x) / (d || 1)) * w * 6.0;
      y -= ((h.y - run.player.y) / (d || 1)) * w * 6.0;
    }
  }
  return { x, y };
}

export const chaseXpPolicy: Policy = (run) => {
  let x = 0;
  let y = 0;
  const dodge = hazardPush(run);
  x += dodge.x;
  y += dodge.y;
  if (run.orbs.length > 0) {
    const o = run.orbs.reduce((a, c) => (dist(c, run.player) < dist(a, run.player) ? c : a), run.orbs[0]);
    const d = dist(o, run.player) || 1;
    x += ((o.x - run.player.x) / d) * 1.0;
    y += ((o.y - run.player.y) / d) * 1.0;
  }
  // Give way early and widely. At a 0.12 radius this player only stepped
  // aside once something was almost touching it, which is not how anybody
  // plays and — once a boss window arrived that has to be survived rather
  // than won — meant every build died at the same wall and the pool
  // comparison saturated at the bottom instead of the top.
  for (const e of run.enemies) {
    const d = dist(e, run.player);
    const reach = e.boss ? 0.30 : 0.20;
    if (d < reach) {
      const w = (reach - d) / reach;
      x -= ((e.x - run.player.x) / (d || 1)) * w * 5.0;
      y -= ((e.y - run.player.y) / (d || 1)) * w * 5.0;
    }
  }
  // Always a pull back towards the middle, not just near the wall: the first
  // version only pushed inside a 0.12 margin and the simulated player spent
  // whole runs pinned at (1.00, 1.00), where a corner does the enemies' work
  // for them. A policy that dies of the arena's shape is not measuring the
  // game.
  x += (0.5 - run.player.x) * 2.4;
  y += (0.5 - run.player.y) * 2.4;
  return { x, y };
};

/**
 * Wrap a policy in a person. It re-decides every reaction period rather than
 * every frame, holds the last direction in between, and aims a little wrong.
 *
 * Without this the simulated player has zero reaction time and perfect aim,
 * and the measurements said so: it won fifteen runs out of fifteen with every
 * build, including builds that were doing nothing, so the pool comparison
 * saturated at the ceiling and could not tell a good card from a dead one.
 * A test that cannot distinguish its subjects is not a test. It also made the
 * game look far easier than it is — playing it by hand, I was down to one
 * heart in twelve seconds while the bot was reaching level fourteen.
 */
export function withReaction(base: Policy, rng: () => number, reactionMs = 150): Policy {
  let held: Input = { x: 0, y: 0 };
  let nextAt = 0;
  return (run) => {
    if (run.elapsedMs >= nextAt) {
      nextAt = run.elapsedMs + reactionMs * (0.6 + rng() * 0.8);
      const d = base(run);
      const m = Math.hypot(d.x, d.y);
      const a = Math.atan2(d.y, d.x) + (rng() - 0.5) * 0.3;
      held = { x: Math.cos(a) * m, y: Math.sin(a) * m };
    }
    return held;
  };
}

/**
 * A whole run, as fast as the CPU can do it.
 *
 * `take` decides what the simulated player does with a level-up: "first" is an
 * ordinary player taking whatever is on the left, "none" declines every card,
 * and an id leans on that upgrade — takes it whenever it is offered, and takes
 * the leftmost otherwise.
 *
 * Two versions of this were wrong before it was right. The first had no way to
 * decline at all, so its "taking nothing" baseline was really "taking three
 * random cards" and it reported levelling speed as worse than not levelling.
 * The second made an id mean "take this and decline everything else", which is
 * a fair question for a weapon and a rigged one for an upgrade whose whole
 * value is getting you to the next upgrade sooner: it measured the experience
 * card at 1.5 seconds worse than never levelling, because it spent every level
 * of the run on getting to levels it then wasted.
 */
export function runHeadless(
  policy: Policy,
  rng: () => number,
  take: UpgradeId | "first" | "none" = "first",
): { outcome: Run["outcome"]; ms: number; run: Run } {
  const run = createRun(rng);
  const dt = 1 / 60;
  while (run.outcome === "playing" && run.elapsedMs < RUN_MS) {
    if (run.pending) {
      if (take === "none") run.pending = null;
      else if (take === "first") applyUpgrade(run, run.pending[0]);
      else applyUpgrade(run, run.pending.includes(take) ? take : run.pending[0]);
      continue;
    }
    step(run, dt, policy(run), rng);
  }
  return { outcome: run.outcome, ms: run.elapsedMs, run };
}
