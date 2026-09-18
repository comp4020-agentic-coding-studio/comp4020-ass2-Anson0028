---
title: "Assignment 1: One constant, six values"
description:
  Step one number in the specimen's rules evenly across six values and show
  what difficulty did in response.
week: 7
due: 2027-04-23T17:00:00+10:00
weight: 20
produces: a curve of wins out of 51 against one constant, and the location of its cliff
marking:
  mode: weighted
  criteria:
    - name: The prediction, written before anything was measured
      weight: 20
    - name: "The measurement: six even values, 51 runs each, the same seeds throughout"
      weight: 40
    - name: Reading the curve, where it bends and why
      weight: 40
spec:
  - one constant from the rules, not reaction time and not the boss's time limit
  - your predicted curve, dated before your first run
  - wins out of 51 and median survival at six evenly spaced values, from fixed seeds
  - a paragraph on where the curve bends and what in the rules causes it
related:
  - lectures/week-05
  - sessions/05-step-one-number
---

## The brief

> Turn one dial evenly. Show that the game did not respond evenly, and say why.

This is the week 5 tutorial done properly. The tutorial let you be rough; here the
seeds are fixed, the run count is stated, and your prediction is written down
before you measure, where everyone can see how wrong it was. Being wrong is not
marked down. Not having predicted anything is.

A strong response finds the cause. "The curve falls off at 0.20" is a
measurement. "The curve falls off at 0.20 because past that speed enemies reach
the player before the first upgrade arrives" is an explanation, and it is
usually one more simulation away.

## What the marks look like

| Band | What the two pages do |
| --- | --- |
| HD | Find where the curve bends, name what in the rules causes it, and run the one extra simulation that would show the cause is wrong. Report wins and median together, and say where either stopped answering. |
| D to Cr | Six clean values on the same seeds, the bend in the right place, a cause offered and not tested. |
| P | A table with no prediction dated before it, or a story read into a row of noise. |

## What a strong and a weak one look like

Strong, from the course's own fork. Starting hearts, 1 to 6: wins of 51 go 1, 2,
12, 23, 31, 37. Median survival goes 48.8 s, 85.0 s, 101.6 s, 117.2 s, 120.0 s,
120.0 s. The bend is between 2 and 3 hearts, and from 5 hearts the median has
hit the end of the run and says nothing more, so the last two rows are read
from wins alone.

Weak, also from the course's own fork. Bolt damage, 13 to 23: wins go 12, 9, 12,
14, 13, 11, with the conclusion "the game is best balanced at 19". The same
player on a second set of seeds moves by 5 wins. Every value in that row is
inside 5 of every other. The honest reading is that this range has no bend in
it, and the submission should have widened the range or changed constant.

## What you submit

A fork of the specimen with your stepping script in it, and two pages: the
prediction, the table, the plot and the paragraph. No slides.

## What it feeds

Assignment 2 starts from one value on this curve. Choose a constant you are
willing to live with until May.
