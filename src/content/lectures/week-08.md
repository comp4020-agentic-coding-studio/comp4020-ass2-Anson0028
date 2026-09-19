---
title: The lazy strategy must lose
description:
  If one way of playing beats every other, the rest of the design is
  decoration. For a while the best way to play the specimen was to run away.
week: 8
date: 2027-04-27
slides: /decks/week-08/
block: Options and gates
suspect: game
bearing: "Write the laziest player you can: if it beats the intended way to play, the game is at fault. Running away used to, 102 s against 87 s, until the rules changed."
teachers:
  - tamsin-okoro
related:
  - week-07
  - sessions/08-break-the-game
---

Close Quarters is built on one idea: getting stronger means walking back into
the fight. For under an hour one evening, while it was being built, that was false, and
nothing on screen showed it.

## The claim

A strategy that wins regardless of what the game throws at it turns every other
option into decoration. Players find it eventually. A simulation finds it in a
second, if you think to write the lazy player as well as the good one.

## The hour running away was correct

Experience used to be scattered generously across the arena. A simulated player
that only ever fled survived a median of 102 s. One that went looking for
experience survived 87 s
([`56f46ba`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit5-Anson0028/commit/56f46ba)).
The game's premise had been quietly reversed by free experience worth as much
as the kind you fight for.

Two changes put it back. Experience dropped by a kill became worth 2.5 times
the experience lying free, in that same commit. And nothing is collected at a
distance any more: you have to walk onto it ([`010a79d`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit5-Anson0028/commit/010a79d)).

## Where it stands

Three strategies, the 100 ms player, 51 runs each:

| Strategy | Median survival | Wins out of 51 |
| --- | --- | --- |
| go for the experience | 101.6 s | 12 |
| run away | 52.5 s | 1 |
| stand still | 17.4 s | 0 |

The intended way to play is now also the best way to play. That is the only
thing "balanced" means in this course.

## What you leave with

One degenerate strategy of your own for the specimen, its numbers against the
intended strategy, and, if it wins, the one constant you would change.
