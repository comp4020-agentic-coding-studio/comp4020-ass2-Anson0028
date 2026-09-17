---
title: Break the game
description:
  Write the laziest, strangest and most cowardly simulated players you can, and
  find out whether any of them beats playing properly.
week: 8
date: 2027-04-29
measures: median survival and wins out of 51 for three degenerate strategies
teachers:
  - idris-fenn
spec:
  - three strategies nobody would call playing properly, each as a policy function
  - median survival and wins out of 51 for each, beside the intended strategy
  - if one of them wins, the single constant you would change and its new value
related:
  - lectures/week-08
---

## Before the studio

Think of the most annoying person you have ever played a game with. Bring
their habits.

## In the studio

Corner camping. Circling the edge. Never picking up anything. Only ever moving
left. Each one is five lines of code. Run all of them, 51 seeds each, against
the intended strategy's 101.6 s and 12 wins.

If something beats it, you have found a bug in the design and not in the code.
Change one constant, run everything again, and check you have not made a
different lazy player the new winner.

## Afterwards

The strategy table goes in the lab book. This block ends here; the next one is
about what none of these tables can tell you.
