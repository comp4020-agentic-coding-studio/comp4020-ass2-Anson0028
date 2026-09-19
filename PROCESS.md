# Process overview

## What I built

SLOP2875 *Is It Me or Is It the Game?* spends twelve weeks measuring one game,
Close Quarters, which I made in crit 5
([`96bd028`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Anson0028/commit/96bd028)).
I stayed in my Assignment 1 subject on purpose. Its Response scored 65, and the
marker's note was to nail down the one thing I was explaining before building.
That note is this course's first rule
([`26e56e9`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Anson0028/commit/26e56e9)).

## What I decided a good course is

One specimen all semester, one claim a week, every tutorial ending in a number
the student measured, and each assessment built from the one before
([`44a26c6`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Anson0028/commit/44a26c6), [`48fe7f2`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Anson0028/commit/48fe7f2)).
The obvious course is a survey of game balance, and a real committee would pass
it, which is the brief's test for too broad.

Most courses I am taking this semester are built on two or three papers, so I
had Claude find candidates, read them, and picked the five that fitted best to
read closely. Claude's first list gave every week a reading, and I cut it: "one
a week feels like too much, make it one every two or three weeks"
([`26e56e9`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Anson0028/commit/26e56e9)).
Here the week's real text is the student's own data.

Then I gave Claude a persona, a student looking at my topic and my twelve week
titles. It said some weeks did not match their papers and some titles would not
make anyone want to read on, and I rewrote them. The weeks were first written
as "Measuring Game Balance Without Players", and I threw that title away as
"not interesting enough; nobody would see it and want to click"
([`f888122`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Anson0028/commit/f888122)).
The lab book went the same way, for a quiz a week that one line explains
([`51f6a06`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Anson0028/commit/51f6a06)).

## What went into the harness, and what stayed out

Six checks on the shape of the semester came before any week existed. Five
were red, and the sixth passed only because the starter's placeholders summed
to 100
([`01baaab`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Anson0028/commit/01baaab)).
Voice, whether a reading is real, and whether a first-time reader can tell what
a thing is have no check on purpose, because no test can tell whether a
paragraph sounds like a person. `CLAUDE.md` keeps them as held by hand
([`add7bf5`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Anson0028/commit/add7bf5)).

The harness went wrong first. The new `CLAUDE.md` carried nothing from earlier
weeks, and no check noticed until I asked: "Wait, did your harness come across
from the earlier weeks?"
([`1c27ee7`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Anson0028/commit/1c27ee7)).
I blamed the model switch at first. The cause was that I had the agent clone the
repo by hand, which skipped the course skill's step that carries the harness
over
([`c56ea2c`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Anson0028/commit/c56ea2c)).
The fix is still one line in `CLAUDE.md` that nothing enforces.

When the agent's own sweeps stopped finding anything
([`d69d230`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Anson0028/commit/d69d230)),
I had it split the review into agents that each read the site one way: a
first-time visitor looking at layout and content, a student deciding whether to
enrol who reads the weeks and the assessments, and a marker given the brief, the
rubric and Ushini's feedback on my A1. I also opened a new session with no
context to judge the site from zero. Their findings came back as one report.
What a check could hold became a check that failed first, then a fix
([`e555e59`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Anson0028/commit/e555e59), [`4b0545d`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Anson0028/commit/4b0545d));
the rest became page fixes
([`83b8fd6`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Anson0028/commit/83b8fd6)).
I ran three rounds
([`4da87b4`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Anson0028/commit/4da87b4)).

## How I knew the numbers were right

The spec recomputes the printed numbers with the runner the page's button uses,
and fails when bolt damage changes from 17 to 18
([`1fd2fe2`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Anson0028/commit/1fd2fe2)).
Then CI went red on GitHub's Linux runner
([run](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Anson0028/actions/runs/35433193329)):
seed 97 ended at 63.1 s, not 69.333 s. Rather than replace `Math.sin` and
re-measure the whole site, I narrowed the claim to the same kind of machine and
made week 2 teach the difference
([`5dbff8c`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Anson0028/commit/5dbff8c)).
A check holds a number, not the sentence around it: weeks 6 and 9 read a flat
median as a verdict until the first-boss kills were counted
([`7055dd7`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Anson0028/commit/7055dd7)).

## Thin spots

The twelve weeks of lectures went in within twenty minutes
([`e6ab4b4`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Anson0028/commit/e6ab4b4)),
and several checks came after the content they check without ever being seen
red. Most of the prose is the agent's; the decisions are mine.
