---
title: How many runs
description:
  Watch how far your median still moves as runs are added, and decide how much
  movement you are willing to live with.
week: 4
date: 2027-03-18
measures: the run count you will quote from now on, and the smallest difference you will claim with it
teachers:
  - wei-lindqvist
spec:
  - median survival of your delayed player at 1, 5, 15, 51, 101 and 501 runs
  - the shortest and longest run among the 501
  - the run count you will quote from now on, and the median at that count on a second set of 51 seeds
related:
  - lectures/week-04
---

## Before the tutorial

Read the survival analysis section of the week 3 reading,
[Isaksen, Gopstein and Nealen](http://www.nealen.net/papers/exploring-game-space-FDG2015.pdf).

## In the tutorial

Run your delayed player from last week over 501 seeds and keep every result.
Print the median of the first 1, 5, 15, 51, 101 and 501. For reference, the
150 ms player goes 69.3 s, 69.3 s, 81.5 s, 78.2 s, 78.0 s, 73.7 s.

Then argue with your neighbour about where you would stop. There is no correct
answer. Once you have picked a count, run it again on a second set of seeds and
write down how far the median moved: that is the smallest difference you will
claim with it. There is a cost, which is time, and the specimen makes time nearly
free: 51 runs take about 166 ms.

## Where it goes wrong

- **An even run count.** With 50 runs the two middle ones were 75.8 s and
  78.2 s, and the median is a number no run produced. With 51 it is 78.2 s, a
  run you can replay. Use odd counts.
- **Reporting the mean.** Over the 501 runs the mean is 74.3 s and the median
  73.7 s, which looks harmless. It is not: 17 of those runs are wins, stopped
  at 120 s by the clock and not by dying. A mean treats "stopped at 120 s" as
  "died at 120 s". A median does not care how long the winners would have
  lasted.
- **One set of 51.** The week 4 lecture page's 51 seeds give a median of
  78.2 s. A different 51 gave 71.4 s in Node. Those are raw seeds 5100 to 9950,
  97 apart; each is 5003 past the matching course seed, so they are not on the
  course's numbered list, and they are the first 51 the lecture page runs the
  second time you press it. If your later claims are about differences smaller
  than that, 51 is not enough for them. A second set is one draw too: the
  course's own seeds 52 to 102 move the same median only 0.4 s, to 77.8 s.

## What a finished answer looks like

> 51 runs. From 51 to 501 my median moved 4.5 s, and I will not claim any
> difference smaller than 7 s, which is what a second set of 51 seeds moved it.

## Afterwards

Your run count and the smallest difference you will claim with it are this
week's quiz answer, and every number you report for the rest of the semester
carries them.
