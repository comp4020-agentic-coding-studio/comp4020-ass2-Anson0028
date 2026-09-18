---
title: Simulated players
description:
  A perfect bot wins 12 runs out of 15 and tells you nothing about a person.
  This week the simulated player gets a reaction time, and the wins go away.
week: 3
date: 2027-03-09
block: Players and distributions
suspect: me
teachers:
  - tamsin-okoro
reading:
  authors: Aaron Isaksen, Dan Gopstein and Andy Nealen
  title: Exploring Game Space Using Survival Analysis
  venue: Foundations of Digital Games, 2015
  url: http://www.nealen.net/papers/exploring-game-space-FDG2015.pdf
related:
  - week-02
  - sessions/03-a-player-with-reaction-time
---

Last week the player became a function. This week is about how good that
function is allowed to be.

## The claim

A simulated player that reacts instantly and never misjudges a direction is
measuring a game nobody will ever play. The numbers it produces are real and
they describe nothing.

## What happened to the specimen

The first simulated player for Close Quarters re-decided its direction on every
frame. Fifteen runs, ordinary upgrade choices: it won 12. On those numbers the
game was too easy and wanted harder bosses.

Then the player was made to wait. It now re-decides about every 150 ms instead
of every 16 ms, holds its last direction in between, and aims up to nine
degrees off. Same fifteen seeds:

| Reaction time | Wins out of 15 | Median survival |
| --- | --- | --- |
| none | 12 | 120.0 s |
| 100 ms | 3 | 103.4 s |
| 150 ms | 1 | 81.5 s |
| 250 ms | 0 | 60.7 s |

Nothing about the game changed between those rows. Every balance decision made
against the first row would have been made for a player who does not exist.

## Reading for weeks 3 to 5

Aaron Isaksen, Dan Gopstein and Andy Nealen,
[Exploring Game Space Using Survival Analysis](http://www.nealen.net/papers/exploring-game-space-FDG2015.pdf)
(Foundations of Digital Games, 2015).

They do to Flappy Bird what this course does to Close Quarters, and their
player model is built from the same kind of limits: precision, reaction time,
actions per second. Read the player model this week and the survival analysis
next week.

## What you leave with

Two simulated players, one of them with a reaction time, and the win rate of
each over the same fifteen seeds.
