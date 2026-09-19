---
title: Every boss is easy for somebody
description:
  Difficulty is not one number. The same first boss lets 50 runs in 51 past,
  or 10 in 51, depending on who is holding the controls.
week: 11
date: 2027-05-18
slides: /decks/week-11/
block: Different players
suspect: me
bearing: "That depends on the player. At a 200 ms reaction time, 46 of 51 runs reach the first boss and 18 outlast its clock; whether to lose that player is the designer's call."
teachers:
  - tamsin-okoro
reading:
  authors: Shaghayegh Roohi, Asko Relas, Jari Takatalo, Henri Heiskanen and Perttu Hämäläinen
  title: Predicting Game Difficulty and Churn Without Players
  venue: CHI PLAY, 2020
  url: https://arxiv.org/pdf/2008.12937
related:
  - week-10
  - sessions/11-three-kinds-of-player
---

"Is the first boss too hard?" has no answer. "For whom?" does.

## The claim

A game does not have a difficulty. It has a different difficulty for every
player who picks it up, and a balance decision is a decision about which of
those players you are willing to lose.

## The same game, six players

Ordinary card choices, 51 runs each. Only the reaction time changes. "Get past"
means still alive when that boss's clock runs out.

| Reaction time | Reach the first boss | Get past it | Get past the second | Win |
| --- | --- | --- | --- | --- |
| 50 ms | 51 | 50 | 39 | 38 |
| 100 ms | 51 | 47 | 22 | 12 |
| 150 ms | 51 | 38 | 5 | 2 |
| 200 ms | 46 | 18 | 2 | 0 |
| 250 ms | 45 | 11 | 0 | 0 |
| 300 ms | 41 | 10 | 1 | 0 |

Read across a row and you get one player's way through the game. Read down a column and
you get what a gate does to a crowd. The first boss lets through 50 of the
fastest player's runs and 10 of the slowest one's. For the 200 ms player, 33 runs out of
51 are over by the time its clock runs out, 66 s in: two thirds of that
audience never reaches the second boss.

Whether that is right depends on who the game is for. It is a number now, so
it can be argued about.

## Reading for weeks 11 and 12

Shaghayegh Roohi and colleagues,
[Predicting Game Difficulty and Churn Without Players](https://arxiv.org/pdf/2008.12937)
(CHI PLAY, 2020).

They predict which levels of a shipped mobile game lose players, using
simulated players and a model of a population with different skill and
patience. It is this week's table at the scale of a real studio's game.

## What you leave with

Pass rates at both bosses for three players of your own, and one sentence
saying which of the three the specimen is currently built for.
