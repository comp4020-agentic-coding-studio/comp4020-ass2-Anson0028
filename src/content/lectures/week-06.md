---
title: A dead option looks like a live one
description:
  A choice that does nothing looks exactly like a choice that matters. This week
  you measure what each of the specimen's seven upgrades is worth, by taking it
  away.
week: 6
date: 2027-03-30
slides: /decks/week-06/
block: Options and gates
suspect: game
bearing: "If the card you picked did nothing, that one was the game."
teachers:
  - tamsin-okoro
reading:
  authors: Alexander Jaffe, Alex Miller, Erik Andersen, Yun-En Liu, Anna Karlin and Zoran Popović
  title: Evaluating Competitive Game Balance with Restricted Play
  venue: AIIDE, 2012
  url: https://ojs.aaai.org/index.php/AIIDE/article/view/12513
related:
  - week-05
  - sessions/06-take-one-away
---

The specimen offers three upgrade cards every level. An earlier build of it had
seven cards in the pool and three of them did nothing.

## The claim

An option that does nothing is indistinguishable, to the player choosing it,
from one that matters. Nobody finds a dead option by playing, because nothing
happens when you pick it, and nothing happening is not an event.

## How the dead cards were found, and why they were dead

Damage, attack rate and pickup reach each measured within 1.5 s of taking no
upgrade at all, over 25 runs
([`4b36c32`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit5-Anson0028/commit/4b36c32)).
The cause was one line of arithmetic. Damage was dealt per second of contact,
so a weapon that spun faster touched each enemy more often for proportionally
less time, and the attack-rate card was worth exactly nothing.

## Two ways to ask, and they disagree

Both questions below are put to the same player, the 100 ms one, over the same
51 seeds.

**Take only this.** Give the player several levels of one card and refuse
everything else. For movement speed, median survival reads 66.0 s with no
speed and with one, two or three levels, then 55.4 s with four. Taken at its
word, speed is worthless and then harmful.

Do not take it at its word. 66 s is the first boss's deadline: the boss arrives
at 40 s, and the run ends if it is still alive 26 s later. With no speed, 36 of
the 51 runs end at exactly that moment. The median is reading the deadline, not
the player. Count the runs that kill the first boss instead, and the same five
builds read 0, 0, 0, 8, 18. Week 9 has a name for a
reading like 66.0 s.

Speed is not the only thing changing, either. The boss is sized by how many
cards the player holds when it arrives (week 7), and refusing everything else
means each level of speed is one more card held. These players arrive holding
one to five cards, counting the weapon, and meet a boss of 884, 884, 680, 510
and 408 hp. A player choosing normally arrives holding 7.

**Never take this.** Let the player choose normally but ban one card, and count
what is lost. Baseline is 12 wins out of 51. This is restricted play, the
method in this block's reading. The player still takes a card at every level,
so whichever card is banned, they reach the first boss holding a median of 6
to 8.

| Banned card | Wins out of 51 | Lost |
| --- | --- | --- |
| pickup reach | 1 | 11 |
| attack rate | 3 | 9 |
| speed | 7 | 5 |
| damage | 7 | 5 |
| extra bolt | 7 | 5 |
| orbiting shard | 9 | 3 |
| shockwave | 10 | 2 |

Asked this way, speed is worth 5 wins, and the most valuable card in the game
is the one that looks least like a weapon. "Take only this" is a rigged
question for any card whose value is in what it lets you do next. In this game
it is rigged twice, because refusing every other card changes the boss as well.

## Reading for weeks 6 to 8

Alexander Jaffe and colleagues,
[Evaluating Competitive Game Balance with Restricted Play](https://ojs.aaai.org/index.php/AIIDE/article/view/12513)
(AIIDE, 2012).

Their games are two-player and ours is not. Take the method and leave the
setting: to find out what something is worth, play without it.

## What you leave with

A table like the one above from your own simulated player, and the name of the
card you were most wrong about.
