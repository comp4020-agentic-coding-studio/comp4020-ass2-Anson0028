---
title: One headless run
description:
  Get the specimen running on your own machine with no window open, and time
  it.
week: 2
date: 2027-03-04
measures: wall time of one simulated run, in ms
teachers:
  - wei-lindqvist
spec:
  - one seeded run of Close Quarters completed with no browser open
  - its wall time in ms, how it ended, and the second it ended on
  - the same seed run twice, with identical results shown side by side
related:
  - lectures/week-02
---

## Before the tutorial

Clone the specimen and install its dependencies. Bring a laptop that can run
Node.

## In the tutorial

Call the headless runner once with seed 97 and an ordinary simulated player.
Write down three things: how long it took, whether the run was won or lost, and
the second it ended on. For reference, a 2024 laptop does it in about 6 ms and
the run is lost at 69.333 s.

Then run the same seed again. If the two results differ in any digit, something
in your setup is reading a clock or a random number it was not handed, and
finding it is the rest of your tutorial.

## Afterwards

The timing is your number for this week's quiz. Multiply it out: how many runs could you do
in the 120 s it takes a person to play one?
