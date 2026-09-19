---
title: Size a gate
description:
  Work out from measured damage output how much health a boss needs in order to
  stop the player it is meant to stop, then check the arithmetic by simulation.
week: 7
date: 2027-04-22
measures: the health in hp of a boss that stops players holding fewer than ten upgrades
teachers:
  - wei-lindqvist
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

You are adding a third boss at 110 s. A run ends at 120 s, so first lengthen it
to 140 s, or the boss's 26 s clock never runs out. The boss should stop anyone
holding fewer than ten upgrades and let through anyone holding more.

Measure what a ten-upgrade player actually deals per second. Do not compute it
from the rules' constants; builds differ, bolts miss or bank up, and the
average is what matters.
Multiply by the window. Set the health. Then run three groups of 51 against it
and see whether the line falls where you put it.

It usually does not, the first time. Say why.

## Where it goes wrong

- **Damage from the constants.** The rules set the opening weapon to 17 damage
  every 0.85 s, which is 20 a second. What lands can be less, when bolts miss,
  or more: a bolt's cooldown keeps counting down while nothing is in range, and
  the backlog fires when the boss arrives. Measure it.
- **Counting the wrong thing.** The first version of the specimen's gate counted
  the player's level. A player who refuses every card still levels up, and was
  handed a weaker boss for it. Count upgrades held.
- **Off by one.** The starting weapon counts as one upgrade. "Four upgrades"
  means three cards picked up. The first draft of this week's lecture had the
  wrong one of those two numbers in it.
- **Testing only the players you want to stop.** A gate has two jobs. If the
  ten-upgrade group gets through 9 times in 51, the gate is a wall.

## What a finished answer looks like

The specimen's own first gate, in the form yours should take:

> The rules say 17 damage every 0.85 s: 20 a second, 520 hp over the 26 s
> window. Measured, the 100 ms player declining every card lands a median of
> 476 hp on the first boss in that window, about 18 a second, and 561 hp at
> most, so a gate for that player has to be over 561 hp. Set to 884 hp for two
> upgrades or fewer, and 510 hp for four, who should get through. Players who
> decline every card: 0 of 51 alive after the window. Ordinary players: 47 of 51.

## Afterwards

Your gate, its arithmetic and its three pass rates are this week's quiz answer.
