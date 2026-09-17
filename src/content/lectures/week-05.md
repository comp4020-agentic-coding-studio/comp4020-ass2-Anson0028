---
title: Even steps, uneven difficulty
description:
  Turn one dial in equal steps and the game does not get harder in equal steps.
  The first 50 ms costs 26 wins. A later 50 ms costs 0.4 s.
week: 5
date: 2027-03-23
block: Players and distributions
teachers:
  - tamsin-okoro
related:
  - week-04
  - sessions/05-step-one-number
---

Designers build difficulty ladders by stepping numbers evenly, because evenly
is how a spreadsheet wants to be filled in. The game is under no obligation to
respond evenly.

## The claim

Equal steps in a parameter do not buy equal steps in difficulty. Some steps
cost almost everything. Some cost nothing. You cannot tell which is which from
the numbers you typed; you have to measure what came out.

## One dial, six even steps

The dial is the simulated player's reaction time, stepped by 50 ms. Each row is
51 runs with ordinary upgrade choices.

| Reaction time | Wins out of 51 | Median survival |
| --- | --- | --- |
| 50 ms | 38 | 120.0 s |
| 100 ms | 12 | 101.6 s |
| 150 ms | 2 | 78.2 s |
| 200 ms | 0 | 56.5 s |
| 250 ms | 0 | 56.1 s |
| 300 ms | 0 | 48.6 s |

The first step costs 26 wins out of 51. The step from 200 ms to 250 ms costs
0.4 s of survival and no wins, because there were none left to lose.

The cliff has a cause. The first boss has to be dead by 66 s. Somewhere between
150 ms and 200 ms the typical run stops reaching that wall alive, and past that
point being slower barely matters: you were already not getting there.

## A dial that does nothing

The boss's time limit, stepped evenly from 14 s to 34 s, for the 100 ms player:
11, 12, 12, 12, 12 and 12 wins out of 51. Twenty seconds of generosity bought
one win. That is also an uneven step, and you would not have guessed it either.

## What you leave with

One number of your own choosing in the specimen's rules, stepped evenly across
six values, with wins out of 51 and median survival at each. Find the cliff, or
show there is not one.
