---
title: Break the game
description:
  Write the laziest, strangest and most cowardly simulated players you can, and
  find out whether any of them beats playing properly.
week: 8
date: 2027-04-29
measures: median survival and wins out of 51 for three degenerate strategies
teachers:
  - wei-lindqvist
spec:
  - three strategies nobody would call playing properly, each as a policy function
  - median survival and wins out of 51 for each, beside the intended strategy
  - if one of them wins, the single constant you would change and its new value
related:
  - lectures/week-08
---

## Before the tutorial

Think of the most annoying person you have ever played a game with. Bring
their habits.

## In the tutorial

Corner camping. Circling the edge. Never picking up anything. Only ever moving
left. Each one is five lines of code. Run all of them, 51 seeds each, against
the intended strategy's 101.6 s and 12 wins.

If something beats it, you have found a bug in the design and not in the code.
Change one constant, run everything again, and check you have not made a
different lazy player the new winner.

## Where it goes wrong

- **A lazy player that is secretly another lazy player.** The course's first
  circling player scored a median of 17.4 s, the same as standing still, to
  the decimal. It started at the centre of the arena, where "which way is the
  edge" divides by zero, and never moved. Fixed, it scores 44.8 s. Two
  strategies that agree to the decimal are one strategy.
- **Stopping at strategies that lose.** Corner camping 18.6 s, moving only left
  17.7 s, circling 44.8 s, running away 52.5 s: all far under the intended
  101.6 s. That is a result, and a dull one. Keep going until one comes close,
  or say how many you tried.
- **Fixing the winner and not rerunning the rest.** A constant that beats one
  lazy player can crown another. Every row gets run again after every change.

## What a finished answer looks like

> Intended: 101.6 s, 12 of 51. Run away: 52.5 s, 1 of 51. Circle the edge:
> 44.8 s, 0 of 51. Camp a corner: 18.6 s, 0 of 51. Nothing lazy comes within
> 49 s of playing properly, so I am changing no constant.

## Afterwards

The strategy table is this week's quiz answer. This block ends here; the next one is
about what none of these tables can tell you.
