---
title: Find the ceiling
description:
  Test your own instrument for saturation by comparing how much your metric
  moves between builds with how much it moves between sets of seeds.
week: 9
date: 2027-05-06
measures: spread of your metric between best and worst build, against its spread between two seed sets
teachers:
  - tamsin-okoro
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

## Afterwards

If your metric was saturated, re-run your week six table with the replacement
before next week. Your defence in week twelve will be asked about this.
