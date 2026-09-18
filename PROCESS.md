# Process overview

## What I built

SLOP2875 *Is It Me or Is It the Game?* is twelve weeks measuring one two-minute
game, Close Quarters, which I made in crit 5. Its claim: "the boss is too hard"
is a prediction, and simulation can test it before anyone plays.

I stayed in my Assignment 1 subject on purpose. That response scored 65, and the
marker's note was to nail down the one thing I was explaining before building.
This course is that one thing, done again with her note as the first rule.

## What I decided a good course is

I looked at the three exemplars and about forty classmates' sites. The strong
ones pin a semester to one object. So: one specimen, one claim a week, every
tutorial ends in a number the student produced, five readings instead of twelve
([`26e56e9`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Anson0028/commit/26e56e9), [`44a26c6`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Anson0028/commit/44a26c6)). The obvious course was a survey of game
balance. The brief calls that too broad.

## What went into the harness

A rule nothing fails on is not a rule, so the shape of the semester became
checks, written red before the content existed: weeks chain to the next, no two
lecture titles share a word, every lecture names a quantity with a unit,
assessments feed each other and total 100 ([`01baaab`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Anson0028/commit/01baaab), [`48fe7f2`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Anson0028/commit/48fe7f2)).

The harness itself went wrong first. The session had switched models and been
summarised, and the agent wrote a new `CLAUDE.md` carrying nothing from earlier
weeks. Every check was green. I asked whether the harness had come across. It
had not: I had cloned the repo by hand and skipped the skill that carries it.
The obvious move was to ask again. Instead the rules came in late and labelled
late, the payload sensor was retargeted to one page, and harness changes have
had their own commit since ([`1c27ee7`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Anson0028/commit/1c27ee7), [`79d1cba`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Anson0028/commit/79d1cba)).

Later I left "every slide fits on a phone" to a hand measurement, made against
the one deck written to fit the rule. With twelve decks I asked for a real
sensor. Its first run was red: seven table slides at 8.8 px that the hand
measurement had sampled past ([`a6deb65`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Anson0028/commit/a6deb65), [`1c9c12b`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Anson0028/commit/1c9c12b)). I trust it
because I watched it fail.

## What I left out, and what I threw away

Voice, whether a reading is real, and whether a title makes anyone click have
no check. I opened all five papers myself. With twelve weeks written I threw
the title away: "Measuring Game Balance Without Players" is a course a real
committee would pass, which is the brief's own test, and it was dull
([`f888122`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Anson0028/commit/f888122)). Once the title was a question, each week had to answer it in
its own sentence, and that did become a check ([`3a06dd6`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Anson0028/commit/3a06dd6), [`d3ecead`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Anson0028/commit/d3ecead)).

I also reversed my own rule. I had asked for plain topic titles. After reading
the best classmates' week lists, which argue, the rule became "a title is the
week's claim" ([`bfefe5e`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Anson0028/commit/bfefe5e)).

Removed: the lab book, for quizzes a student can understand in one line
([`51f6a06`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Anson0028/commit/51f6a06)); the block list and navigation cards, once a schedule did
their job ([`3392805`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Anson0028/commit/3392805)); a third of the home page's prose, because A1's
home page was called too full ([`296c81f`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Anson0028/commit/296c81f)); and a paragraph explaining why
Chromium gives 37 wins where Node gives 38. I found that by pressing the page's
own button. It is true, and it is about `Math.sin`, not about balance
([`c073262`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Anson0028/commit/c073262)).

Thin spots: the commits span two days, and content commits are batches of
three weeks, because I read each batch before saying commit.
