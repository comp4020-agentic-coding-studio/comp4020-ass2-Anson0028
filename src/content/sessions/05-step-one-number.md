---
title: Step one number
description:
  Pick one constant in the specimen's rules, step it evenly across six values,
  and find out whether difficulty followed.
week: 5
date: 2027-03-25
measures: wins out of 51 and median survival at six evenly spaced values of one constant
teachers:
  - wei-lindqvist
spec:
  - one constant from the rules, stepped evenly across six values in your own fork
  - wins out of 51 and median survival at each value, from the same seeds
  - one sentence naming where the cliff is, or stating that there is none
related:
  - lectures/week-05
---

## Before the tutorial

Fork the specimen. Choose your constant before you arrive and write down what
you expect the curve to look like. Enemy speed, spawn interval and boss health
are all reasonable. Do not choose the boss's time limit; the lecture already
spoiled it.

## In the tutorial

Six values, 51 runs each, same seeds throughout. Plot wins against the value of
the constant, by hand if you like.

Compare the plot with what you wrote down before you arrived. The gap between
the two is what this course is for.

## Where it goes wrong

- **One metric.** Starting hearts stepped from 1 to 6: wins go 1, 2, 12, 23, 31,
  37 out of 51. Median survival goes 48.8 s, 85.0 s, 101.6 s, 117.2 s, 120.0 s,
  120.0 s. At five hearts the median hits the end of the run and stops
  answering, while wins are still climbing. Report both, and notice when one of
  them has gone quiet.
- **Reading a curve into noise.** Bolt damage stepped from 13 to 23: wins go 12,
  9, 12, 14, 13, 11. That is not a curve with a dip at 15. Last week a second
  set of seeds moved a median by 7 s; a wiggle of three wins is the dice.
- **A range that sits on one side of the cliff.** If all six values win, or all
  six lose, you have learned where the cliff is not. Widen the range and say
  that you did.

## What a finished answer looks like

> Starting hearts, 1 to 6, the 100 ms player, 51 runs on seeds 1 to 51.
> Wins: 1, 2, 12, 23, 31, 37. The cliff is between 2 and 3 hearts: one step
> there is worth 10 wins, and the step before it is worth 1.

## Afterwards

Today's quiz answer is the six-row table. Assignment 1 asks for exactly this,
done properly, on a constant you have not used yet.
