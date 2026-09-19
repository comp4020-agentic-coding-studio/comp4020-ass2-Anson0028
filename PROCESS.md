# Process overview

## What I built

SLOP2875 *Is It Me or Is It the Game?* spends twelve weeks measuring one game,
Close Quarters, which I made in crit 5
([`44a26c6`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Anson0028/commit/44a26c6), [`96bd028`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Anson0028/commit/96bd028)).
I stayed in my Assignment 1 subject on purpose. That response scored 65, and the
marker's note was to nail down the one thing I was explaining before building.
This course is that one thing, done again with her note as the first rule
([`26e56e9`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Anson0028/commit/26e56e9)).

## What I decided a good course is

One specimen all semester, one claim a week, every tutorial ending in a number
the student measured, and each assessment built from the one before
([`44a26c6`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Anson0028/commit/44a26c6), [`bfefe5e`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Anson0028/commit/bfefe5e), [`c0d6194`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Anson0028/commit/c0d6194), [`48fe7f2`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Anson0028/commit/48fe7f2)).
The obvious course is a survey of game balance, which the brief calls too broad.

Most courses I am taking this semester are built on two or three papers.
Calling Bullshit sets readings every week, and so did Claude's first list. I cut
it: "one a week feels like too much, make it one every two or three weeks"
([`26e56e9`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Anson0028/commit/26e56e9)).
Here the week's real text is the student's own data.

The twelve weeks were first written as "Measuring Game Balance Without
Players". I threw that title away as "not interesting enough; nobody would see
it and want to click"
([`f888122`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Anson0028/commit/f888122)).
A real committee would pass it. Once the title was a question, each week had to
name what it measures, and a check holds three weeks each for me and the game
([`f9616a3`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Anson0028/commit/f9616a3)).

## What went into the harness, and what stayed out

Six checks on the shape of the semester came before any week existed: a
lecture and tutorial a week, a chain of weeks, no shared title words, a unit in
every lecture, weights totalling 100. Five were red; the weights check passed
only because the starter's placeholders happened to
([`01baaab`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Anson0028/commit/01baaab)).
The chain between assessments came after them, and counted only once it had
been seen to fail
([`48fe7f2`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Anson0028/commit/48fe7f2)).

Some things have no check on purpose: voice, whether a reading is real, and
whether a first-time reader can tell what a thing is. `CLAUDE.md` keeps them as
held by hand
([`26e56e9`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Anson0028/commit/26e56e9), [`add7bf5`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Anson0028/commit/add7bf5)).

The harness went wrong first. The agent wrote a new `CLAUDE.md` carrying nothing
from earlier weeks, and no check noticed until I asked: "Wait, did your harness
come across from the earlier weeks?"
([`1c27ee7`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Anson0028/commit/1c27ee7)).
I first blamed the model switch, which that commit names beside the real
cause. The session log, not in the repo, ruled it out: the agent had named three of
the rules seven minutes before writing the file without them, and forty before
committing it; [`36e8ad3`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Anson0028/commit/36e8ad3) gave the forty as before writing
([`c56ea2c`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Anson0028/commit/c56ea2c)).
Thirteen days earlier I had the agent clone the repo by hand, skipping the
course skill's step that carries the harness. The fix is still one `CLAUDE.md`
line that no check enforces.

The agent's own sweeps had stopped finding anything, because each looked the
way the last had
([`d69d230`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Anson0028/commit/d69d230)).
I wanted "a new session with no context to judge the site from zero", with the
brief, the rubric and Ushini's feedback on my A1 in its prompt. Four things it
found became checks that failed first, then fixes: a second Enter did nothing
([`e555e59`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Anson0028/commit/e555e59), [`0267a91`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Anson0028/commit/0267a91)),
a dark-mode table header was 2.41:1
([`4b0545d`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Anson0028/commit/4b0545d), [`2729c93`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Anson0028/commit/2729c93)),
a template sentence survived
([`fa25675`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Anson0028/commit/fa25675), [`3fb7bc7`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Anson0028/commit/3fb7bc7)),
and a table hid a column on a phone
([`33439a6`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Anson0028/commit/33439a6), [`81cd501`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Anson0028/commit/81cd501)).
I ran three rounds
([`1fd2fe2`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Anson0028/commit/1fd2fe2), [`4da87b4`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Anson0028/commit/4da87b4)).

## How I knew the numbers were right

The spec recomputes the printed numbers with the runner the page's button uses,
and fails when bolt damage changes from 17 to 18
([`1fd2fe2`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Anson0028/commit/1fd2fe2)).
Then CI went red on GitHub's Linux runner
([run](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Anson0028/actions/runs/35433193329)):
seed 97 ended at 63.1 s instead of 69.333 s. Rather than replace `Math.sin` and
re-measure every number on the site, I narrowed the claim to the same kind of
machine, checked exactly only on mine
([`5dbff8c`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Anson0028/commit/5dbff8c), [`2867512`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Anson0028/commit/2867512)).
Weeks 6 and 9 had right numbers and wrong sentences, reading a flat median as a
verdict until the first-boss kills were counted. That became a held-by-hand rule
([`7055dd7`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Anson0028/commit/7055dd7), [`c56ea2c`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Anson0028/commit/c56ea2c)).

## What I threw away

The lab book, for "a quiz every tutorial, 20% over twelve weeks, easier to
understand"
([`51f6a06`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Anson0028/commit/51f6a06)),
and a third of the home page's prose, because my A1 home page was too full
([`296c81f`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Anson0028/commit/296c81f)).

## Thin spots

The twelve weeks of lectures were committed in under twenty minutes
([`c78cdd8`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Anson0028/commit/c78cdd8), [`e6ab4b4`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Anson0028/commit/e6ab4b4)).
Most of the site's prose, every commit message, most of `CLAUDE.md`, the twelve
sentences that answer the title's question
([`d151aee`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Anson0028/commit/d151aee))
and the English of this file are the agent's; the decisions and the Chinese
draft of this file are mine. The agent committed when I said so.
