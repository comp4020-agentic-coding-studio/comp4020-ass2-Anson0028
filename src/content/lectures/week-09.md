---
title: When a measurement saturates
description:
  Nine different builds, 34 kills each. A metric that gives every subject the
  same score is not measuring them, and it will not tell you so.
week: 9
date: 2027-05-04
block: The edges of measurement
teachers:
  - tamsin-okoro
reading:
  authors: Stefan Freyr Gudmundsson, Philipp Eisen, Erik Poromaa, Alex Nodet, Sami Purmonen, Bartlomiej Kozakowski, Richard Meurling and Lele Cao
  title: Human-Like Playtesting with Deep Learning
  venue: IEEE Conference on Computational Intelligence and Games, 2018
  url: https://dl.acm.org/doi/10.1109/CIG.2018.8490442
related:
  - week-08
  - sessions/09-find-the-ceiling
---

For eight weeks the instrument has been right. This week is about how it goes
wrong without going red.

## The claim

A measurement saturates when everything you point it at gets the same score. A
saturated measurement still prints numbers, still passes its tests, and still
looks like evidence. The only way to catch it is to ask whether it has ever
told two things apart.

## Three ways the specimen's instrument saturated

**A ceiling.** The first simulated player had no reaction time and won 15 runs
out of 15 with every build it was given, including builds that were doing
nothing ([`c34ed0b`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit5-Anson0028/commit/c34ed0b)).
Every card looked equally good because nothing could look bad.

**A floor.** Give the player extra damage and refuse every other card: median
survival reads 66.0 s, 66.0 s, 67.6 s, 62.7 s, 64.4 s, 65.1 s across six
levels, 15 runs each. The first boss wall stands at 66 s and every build dies against it.
The dial is connected to nothing the metric can see.

**A cap.** Count kills in the first 38 s instead, median of 51 runs. Leftmost
card, no cards at all, each of the seven cards banned in turn: 34, 34, 34, 34,
34, 34, 34, 34, 34. The game only spawns about that many enemies in 38 s and every build
kills all of them. The metric is measuring the spawn rate.

## What was done about it

The test that compared upgrade cards by survival time had caught three dead
cards when it could still tell them apart. Once the boss wall went in, it
could not fail any more, so it was deleted, with the reason written down
([`ccf0e33`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit5-Anson0028/commit/ccf0e33)).
A test that cannot fail reads as coverage and is noise.

## Reading for weeks 9 and 10

Stefan Freyr Gudmundsson and colleagues,
[Human-Like Playtesting with Deep Learning](https://dl.acm.org/doi/10.1109/CIG.2018.8490442)
(IEEE CIG, 2018).

The makers of Candy Crush compared two bots for predicting how hard a new
level would be: one that searches for good moves, and one trained on real
players' moves. The one that played like a person predicted better and cost
less to run. Read it before next week, when you become the person.

## What you leave with

For the metric you have relied on most this semester: its spread between your
best and worst build, beside its spread between two different sets of 51
seeds. If the first is not clearly bigger than the second, you have been
reading noise.
