---
title: A player with reaction time
description:
  Write two simulated players for the specimen, give one of them a reaction
  time, and compare their win rates over the same seeds.
week: 3
date: 2027-03-11
measures: wins out of 15 for a perfect player and for a delayed one
teachers:
  - wei-lindqvist
spec:
  - two policies for Close Quarters, each a function from the run's state to a direction
  - one of them re-decides no more often than every 150 ms
  - wins out of 15 for each, over the same fifteen seeds
related:
  - lectures/week-03
---

## Before the tutorial

Bring the prediction the room voted most likely to be wrong in week one. Read
the player model section of Isaksen, Gopstein and Nealen.

## In the tutorial

Write the simplest policy you can defend: walk towards the nearest experience,
step away from anything close. Run it over seeds 1 to 15 (the course's first fifteen, 97 apart; see the
[policies](/policies/)) and count the wins.

Then wrap it. The wrapped player asks your policy for a direction only every
150 ms and holds that direction in between. Run the same seeds. If your win
count does not drop, your first player was already slow, and it is worth
finding out why.

Last 20 minutes: test the prediction you brought. Most of them die here.

## Where it goes wrong

- **Different seeds for the two players.** Then you have measured the seeds.
  Both players get seeds 1 to 15, in the same order.
- **Giving the delay its own dice.** The wrapped player's aim error has to come
  from the run's seeded source. Draw it from anywhere else and the run stops
  being repeatable, which last week was the whole point.
- **Trusting fifteen.** The course's own two players score 12 and 1 on seeds 1
  to 15, then 11 and 0 on seeds 16 to 30, and 11 and 0 again on 31 to 45. The
  gap holds; the digits do not. Next week is about that.

## What a finished answer looks like

> Seeds 1 to 15. No delay: 12 wins out of 15. 150 ms: 1 win out of 15. My
> week 1 prediction said at least 5 for the delayed player. Wrong.

## Afterwards

Both win counts go on this week's quiz, with the reaction time you settled on and
one line on how you chose it.
