---
title: A metric that cannot fail is noise
description:
  Nine different builds, 34 kills each. A metric that gives every subject the
  same score is not measuring them, and it will not tell you so.
week: 9
date: 2027-05-04
slides: /decks/week-09/
block: The edges of measurement
suspect: instrument
bearing: "The metric may not be able to say. Extra damage took the runs that kill the first boss from 0 to 14 of 15, while median survival stayed near 66 s."
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

In week 6, median survival read 66.0 s four times running while the runs that
killed the first boss went from 0 to 8. Nothing went red. This week names what
happened there, and how to catch it next time.

## The claim

A measurement saturates when everything you point it at gets the same score. A
saturated measurement still prints numbers, still passes its tests, and still
looks like evidence. The only way to catch it is to ask whether it has ever
told two things apart.

## Three ways the specimen's instrument saturated

**A ceiling.** The first simulated player had no reaction time and, on the
game as it was then, won 15 runs out of 15 with every build it was given,
including builds that were doing nothing ([`c34ed0b`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit5-Anson0028/commit/c34ed0b)).
Every card looked equally good because nothing could look bad.

**A floor.** Give the 150 ms player extra damage and refuse every other card:
median survival reads 66.0 s, 66.0 s, 67.6 s, 62.7 s, 64.4 s, 65.1 s across six
levels, 15 runs each. It looks like one wall at 66 s. With no damage or one
level, it is the first boss's deadline and no run gets past it. From two levels
on, 12 to 14 of the 15 runs kill that boss, and still end at about the same
time. The dial is connected to something the metric cannot see.

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
