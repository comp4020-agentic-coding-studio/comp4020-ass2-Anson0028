---
title: Find the ceiling
description:
  Test your own instrument for saturation by comparing how much your metric
  moves between builds with how much it moves between sets of seeds.
week: 9
date: 2027-05-06
measures: spread of your metric between best and worst build, against its spread between two seed sets
teachers:
  - wei-lindqvist
spec:
  - your main metric for the best and the worst build you have found, 51 runs each
  - the same metric for one build on two different sets of 51 seeds
  - a verdict of measuring or saturated, and what you would switch to if saturated
related:
  - lectures/week-09
---

## Before the tutorial

Decide which single metric you have leaned on most since week three. Median
survival, wins out of 51, kills: pick the one your quiz answers are full of.

## In the tutorial

Two comparisons. First, best build against worst build. Second, one build
against itself on seeds 1 to 51 and then on seeds 52 to 102.

The second number is your noise. If the first is not comfortably larger, your
metric has been telling you about the dice.

Then go looking for the cause. It is usually a wall everything dies at, a
ceiling everything reaches, or a supply that runs out.

## Where it goes wrong

- **Skipping the second comparison.** The 100 ms player, same build, same
  day: 12 wins and a median of 101.6 s on seeds 1 to 51, then 7 wins and 92.7 s
  on seeds 52 to 102. Five wins and 8.9 s is what the dice are worth here.
  Nobody likes measuring it, because it makes earlier results smaller.
- **A difference inside the noise.** Taking damage whenever it is offered scores
  8 wins against the 12 of ordinary card choices. That gap of 4 is smaller than the 5 that
  changing seeds produced. It may be real. This table cannot say so.
- **Only ever comparing neighbours.** Taking no cards at all scores 0 wins and
  66.0 s. Against ordinary card choices that is 12 wins and 35.6 s apart, and
  35.6 s is four times the 8.9 s the seeds were worth. Your metric can tell those two apart, and that is the first
  thing to establish about it.

## What a finished answer looks like

> Metric: wins out of 51. Best build against worst: 12 against 0. Same build on
> two seed sets: 12 against 7. It separates builds 12 apart and cannot separate
> builds 4 apart. My week 6 table has three rows closer than that.

## Afterwards

If your metric was saturated, re-run your week six table with the replacement
before next week. Your defence in week twelve will be asked about this.
