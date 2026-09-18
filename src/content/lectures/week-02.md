---
title: Rules without a screen
description:
  If a game's rules cannot run without its renderer, nothing about it can be
  measured. This week the specimen runs with no window open, in 6 ms.
week: 2
date: 2027-03-02
block: The instrument
suspect: instrument
teachers:
  - wei-lindqvist
related:
  - week-01
  - sessions/02-one-headless-run
---

A person needs 120 s to play one run of Close Quarters. The rules need about
6 ms. Everything else in this course is built on that gap.

## The claim

You cannot measure a game whose rules are tangled up with its drawing code. A
run that needs a window, a frame clock and a person holding the keys happens
once every two minutes. A run that needs none of them happens about twenty
thousand times in the same two minutes.

## What makes the specimen measurable

All of Close Quarters lives in one function:

```ts
step(run, dt, input, rng)
```

It takes the state of a run, a slice of time, a direction and a source of
random numbers, and it moves the run forward. There is no canvas in it and no
clock. Three things follow.

- **Time is handed in.** A run is 7200 steps of 1/60 s. Nothing waits for a
  real second to pass.
- **Randomness is handed in.** The same seed gives the same run. Seed 97 ends
  at 69.333 s with 58 kills, every time, on any machine.
- **The player is handed in.** `input` is a direction. It does not care whether
  a hand or a function produced it. Week three is about that function.

## What you leave with

One run of the specimen on your own machine, with no window open: how long it
took in milliseconds, how it ended, and proof that the same seed ends the same
way twice.
