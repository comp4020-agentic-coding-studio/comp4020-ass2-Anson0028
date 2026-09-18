---
title: Size a gate
description:
  Work out from measured damage output how much health a boss needs in order to
  stop the player it is meant to stop, then check the arithmetic by simulation.
week: 7
date: 2027-04-22
measures: the health in hp of a boss that stops players holding fewer than ten upgrades
teachers:
  - tamsin-okoro
spec:
  - damage per second of a player holding ten upgrades, measured and not assumed
  - the boss health that follows from it for a 26 s window, with the multiplication shown
  - pass rates out of 51 for players holding eight, ten and twelve upgrades against that boss
related:
  - lectures/week-07
---

## Before the tutorial

Re-read the multiplication in the lecture until you could do it on a napkin.

## In the tutorial

You are adding a third boss at 100 s. It should stop anyone holding fewer than
ten upgrades and let through anyone holding more.

Measure what a ten-upgrade player actually deals per second. Do not compute it
from the card descriptions; builds differ and the average is what matters.
Multiply by the window. Set the health. Then run three groups of 51 against it
and see whether the line falls where you put it.

It usually does not, the first time. Say why.

## Afterwards

Your gate, its arithmetic and its three pass rates are this week's quiz answer.
