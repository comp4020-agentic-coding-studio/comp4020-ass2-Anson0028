---
title: A player with reaction time
description:
  Write two simulated players for the specimen, give one of them a reaction
  time, and compare their win rates over the same seeds.
week: 3
date: 2027-03-11
measures: wins out of 15 for a perfect player and for a delayed one
teachers:
  - tamsin-okoro
spec:
  - two policies for Close Quarters, each a function from the run's state to a direction
  - one of them re-decides no more often than every 150 ms
  - wins out of 15 for each, over the same fifteen seeds
related:
  - lectures/week-03
---

## Before the studio

Bring the prediction the room voted most likely to be wrong in week one. Read
the player model section of Isaksen, Gopstein and Nealen.

## In the studio

Write the simplest policy you can defend: walk towards the nearest experience,
step away from anything close. Run it over seeds 1 to 15 and count the wins.

Then wrap it. The wrapped player asks your policy for a direction only every
150 ms and holds that direction in between. Run the same seeds. If your win
count does not drop, your first player was already slow, and it is worth
finding out why.

Last 20 minutes: test the prediction you brought. Most of them die here.

## Afterwards

Both win counts go in the lab book, with the reaction time you settled on and
one line on how you chose it.
