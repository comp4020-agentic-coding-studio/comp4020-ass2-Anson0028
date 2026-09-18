---
title: Gates
description:
  A gate is a point the player must be strong enough to pass. Its size is not a
  design opinion. It is a multiplication, and the first version got it wrong.
week: 7
date: 2027-04-20
block: Options and gates
suspect: game
teachers:
  - tamsin-okoro
related:
  - week-06
  - sessions/07-size-a-gate
---

Twice a run, Close Quarters sends a boss with a clock on it. Kill it inside
26 s or the run ends. The boss exists to ask one question: did you pick up
enough on the way here?

## The claim

A gate only asks its question if a player who did nothing fails it. Whether
they fail is arithmetic, and you can do the arithmetic before anyone fights the
boss.

## The multiplication

The opening weapon deals 17 damage every 0.85 s. That is 20 damage a second,
and over a 26 s window it is 520 hp. Any boss under 520 hp can be killed by a
player who never took a single upgrade.

The first boss shipped with 200 hp. Players who declined every card walked
through it in 11 runs out of 15
([`56f46ba`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit5-Anson0028/commit/56f46ba)).
It looked like a gate and asked nothing.

## What it asks now

The boss's health depends on how many upgrades the player holds when it
arrives, counting the weapon they start with as one: 884 hp for one or two,
680 hp for three, 510 hp for four, 340 hp for six. The line crosses 520 hp at
four. So the gate's question, in plain words, is "have you picked up at least
three cards in the first 40 s?"

Measured over 51 runs: ordinary players arrive holding a median of 7, and 47
of them are still alive after the window closes. Players who decline every
card: 0 out of 51.

It counts upgrades banked and not level reached, because a player who refuses
every card still levels up, and the first version handed that player a weaker
boss for it ([`010a79d`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit5-Anson0028/commit/010a79d)).

## What you leave with

The health a third boss would need at 100 s to stop a player holding fewer than
ten upgrades, with the multiplication shown.
