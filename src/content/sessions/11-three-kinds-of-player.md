---
title: Three kinds of player
description:
  Build three simulated players of different skill and find out which of them
  the specimen is actually made for.
week: 11
date: 2027-05-20
measures: the share of 51 runs that gets past each boss, for three players of different skill
teachers:
  - wei-lindqvist
spec:
  - three simulated players that differ in at least reaction time, each described in a sentence
  - for each, how many of 51 runs get past the first boss, the second boss, and win
  - the player you think the game is built for, with the row that made you think so
related:
  - lectures/week-11
---

## Before the tutorial

Read Roohi and colleagues as far as their population model. Think of three
real people you know who would play this differently.

## In the tutorial

Turn the three people into three policies. Reaction time is the obvious dial.
Aim error, how greedy they are for experience, and how early they back away
from a boss are all fair as well.

Fill in the table from the lecture for your three. Then answer one question in
writing: if you could only keep two of these players, which one are you
willing to lose, and at which boss do you lose them?

## Where it goes wrong

- **Three players who are one player.** The course's player at 100 ms wins 12
  of 51. At 120 ms it wins 7. That looks like two people until you remember
  week 9: the same 100 ms player on a second set of seeds also won 7. Twenty
  milliseconds apart is inside the dice. Space your three so that the gaps
  between them are several times the noise.
- **Turning two dials at once.** A slow player who is also greedy for experience
  tells you about neither slowness nor greed. One dial per player, or a
  fourth player.
- **Reading the wrong column.** "Reaches the first boss" and "gets past it" are
  different claims. At 200 ms, 46 runs of 51 reach it and 18 get past it. The
  gate is doing the losing, and the road to it is not.

## What a finished answer looks like

> 50 ms, 150 ms, 250 ms. Past the first boss: 50, 38, 11 of 51. Past the second:
> 39, 5, 0. The specimen is built for the 50 ms player. I would lose the 250 ms
> player, and I lose them at the first boss.

## Afterwards

This table is the opening slide of your defence.
