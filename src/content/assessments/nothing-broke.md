---
title: "Assignment 2: Nothing broke"
description:
  Take one value from your Assignment 1 curve and show that moving the game
  there did not kill an option or hand the win to a lazy player.
week: 9
due: 2027-05-07T17:00:00+10:00
weight: 25
consumes: one-constant
produces: a proposed value for one constant, with its side effects measured
marking:
  mode: weighted
  criteria:
    - name: Restricted-play table for all seven cards, before and after
      weight: 40
    - name: At least three lazy strategies, before and after
      weight: 30
    - name: What you concluded, and what result would have changed your mind
      weight: 30
spec:
  - one proposed value for your Assignment 1 constant, with the reason you picked it
  - wins lost out of 51 for each of the seven cards, at the old value and at the new one
  - three or more degenerate strategies run at both values, beside the intended one
  - a statement of what you would have had to see to abandon the change
related:
  - one-constant
  - lectures/week-06
  - lectures/week-08
---

## The brief

> You have changed a number. Prove you did not break anything you were not
> looking at.

Every balance change has a target and a blast radius. Assignment 1 measured the
target. This one measures the radius, with the two tools from weeks 6 and 8:
take each option away and see what it was worth, then send in the players who
are not trying to play properly.

The interesting submissions are the ones where something did break. A change
that makes the game the right difficulty and quietly makes the shockwave
worthless is a finding. Report it; do not tune it away and pretend the first
version never happened.

## What the marks look like

| Band | What the three pages do |
| --- | --- |
| HD | Both tables at both values on the same seeds, something that moved is found and reported, and the last paragraph names a result that would have ended the change. |
| D to Cr | Both tables complete and reproducible. The conclusion is "nothing broke" and may well be right, but nothing in it could have come out otherwise. |
| P | The table after the change and not before it, fewer than 51 runs, or a lazy player dropped because it was inconvenient. |

## What the two tables look like

The course's own worked change, starting hearts from 3 to 4, the 100 ms player,
the same 51 seeds. Baseline wins go from 12 to 23.

| Banned card | Lost at 3 hearts | Lost at 4 hearts |
| --- | --- | --- |
| pickup reach | 11 | 20 |
| attack rate | 9 | 15 |
| extra bolt | 5 | 10 |
| speed | 5 | 8 |
| damage | 5 | 7 |
| orbiting shard | 3 | 4 |
| shockwave | 2 | 3 |

| Lazy strategy | At 3 hearts | At 4 hearts |
| --- | --- | --- |
| run away | 52.5 s, 1 win | 66.0 s, 2 wins |
| camp a corner | 18.6 s, 0 wins | 25.7 s, 0 wins |
| stand still | 17.4 s, 0 wins | 20.6 s, 0 wins |

No card went dead and no lazy player got close. The finding is in the first
row: with four hearts, a player without pickup reach wins 3 runs of 51. The
change made the game easier and made one card close to compulsory. Whether
that is acceptable is what the last paragraph is for.

At 15 runs this table cannot be read at all: the baseline is 3 and the seven
rows run from 0 to 3.

## What you submit

Your fork, with both tables reproducible from a single command, and three
pages. The last paragraph says what evidence would have made you drop the
change.

## What it feeds

The value you defend here is the value you defend in week twelve. You may
still change it, but you will have to say why.
