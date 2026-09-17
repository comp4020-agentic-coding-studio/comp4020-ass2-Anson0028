---
title: How many runs
description:
  Find the number of runs at which your median stops moving, and decide how
  much movement you are willing to live with.
week: 4
date: 2027-03-18
measures: the smallest run count at which the median moves by less than 1 s
teachers:
  - idris-fenn
spec:
  - median survival of your delayed player at 1, 5, 15, 51, 101 and 501 runs
  - the shortest and longest run among the 501
  - the run count you will use from now on, with a reason
related:
  - lectures/week-04
---

## Before the studio

Read the survival analysis section of the block's reading.

## In the studio

Run your delayed player from last week over 501 seeds and keep every result.
Print the median of the first 1, 5, 15, 51, 101 and 501. For reference, the
course's own player goes 69.3 s, 69.3 s, 81.5 s, 78.2 s, 78.0 s, 73.7 s.

Then argue with your neighbour about where you would stop. There is no correct
answer. There is a cost, which is time, and the specimen makes time nearly
free: 51 runs take about 166 ms.

## Afterwards

Your chosen run count goes on the first page of the lab book. Every number you
report for the rest of the semester carries it.
