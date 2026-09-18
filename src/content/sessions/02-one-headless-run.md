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
the second it ended on. For reference, a 2024 laptop takes about 10 ms on the
first call and under 4 ms once warm, and the run is lost at 69.333 s.

Then run the same seed again. If the two results differ in any digit, something
in your setup is reading a clock or a random number it was not handed, and
finding it is the rest of your tutorial.

## Where it goes wrong

- **Timing the first call.** The same run, called eight times in a row, took
  10.3 ms, 7.0 ms, 5.3 ms, 4.8 ms and then settled near 3.7 ms. The engine is
  still compiling the rules the first few times. Time the fifth call, not the
  first, and say which one you timed.
- **Timing the process.** Starting Node costs far more than the run does. Put
  the clock around the run, inside the script.
- **Forgetting to hand in the dice.** Leave the random source out and the rules
  fall back to the machine's own. The same player then ended at 79.5 s and at
  59.3 s on two calls, and nothing warned about it.

## What a finished answer looks like

> Seed 97, 150 ms player: lost at 69.333 s. Fifth call took 3.7 ms. Run twice,
> identical to the millisecond.

## Afterwards

The timing is your number for this week's quiz. Multiply it out: how many runs could you do
in the 120 s it takes a person to play one?
