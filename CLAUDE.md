# SLOP2875 — Measuring Game Balance Without Players

## What this course argues

I'm building a persuasive, hands-on course that teaches balance in
single-player games as a measurement problem solved by simulation, aimed at
people who make or mod games and believe balance is a matter of taste: tweak
the numbers until it feels right. Nobody plays anything until week ten, and
week ten is where the course admits what simulation cannot see. The course argues
through what a course website affords: the order of the twelve weeks, what each
studio asks students to measure, what the assessments reward, and the one deck.

Everything on the site serves that sentence. When a page, a paragraph or a
component does not, the default move is to delete it, not to add an explanation
beside it. That rule comes from the marker's feedback on my Assignment 1, where
four components on one page explained three different things: "nailing down the
one thing you're explaining before you build".

The question to ask of anything the agent produces is not "does this look
good?" but "does this make the course more persuasive that balance is
measured?"

## What I decided a good course is

1. Every week makes one claim. A week that surveys a topic is a reading list.
2. Every week hands its result to a later week. A course is a chain, and the
   links are declared in `related:` so the build can see them.
3. Every studio ends with a number the student produced. This course is about
   measurement; a studio that ends in a discussion has taught taste again.
4. Assessments reward a defended number, not a finished game.
5. The scope is narrow on purpose. Single-player games only, simulation only.
   Multiplayer balance and human playtesting are other courses; "game balance"
   without those limits is a course a real curriculum committee would wave
   through, which the brief calls too broad.
6. Titles say what the week is. No metaphors in titles; voice lives in the body.
7. Five readings for the semester, one per block of two or three weeks. A
   reading every week, the way Calling Bullshit does it, would turn the studios
   into a reading group; here the week's text is usually the student's own
   data. Each reading is a real paper that Anson has opened.

## Rules, and the check that holds each one

| Rule | Check |
| --- | --- |
| Twelve lectures, one per teaching week | `spec/course.test.ts` › one lecture per week |
| A studio for every teaching week | `spec/course.test.ts` › one studio per week |
| Each week links to the next | `spec/course.test.ts` › spine |
| No two lecture titles share a content word | `spec/course.test.ts` › titles |
| Every lecture names a quantity with a unit | `spec/course.test.ts` › measurable |
| Assessment weights total 100 | `spec/course.test.ts` › weights |
| At most six readings, each with a title and a URL | `spec/course.test.ts` › readings (to write) |
| Dated material stays inside the teaching period | `spec/data-integrity.test.ts` (shipped) |

A rule with no check is not in this table. It goes in the next section, and
says why it is held by hand.

## Held by hand, on purpose

- Voice. Short sentences, first-hand numbers, no survey prose. No test can tell
  whether a paragraph sounds like a person, so every week gets read aloud once
  before it is committed.
- The thirty-second test. For each page: what would someone choosing courses
  learn from this in thirty seconds, and does it connect to the sentence above?
- Readings are real. Agents invent plausible citations, and no test can open
  a PDF and check it says what the page claims. Every reading comes from a list
  that was verified to exist, and gets opened by Anson before it goes on a page.
- The deck at both marking viewports. The build compiles decks but nothing
  checks that a slide fits.

## How to work here

- One or two weeks of content per change. Never generate all twelve at once:
  the weeks come back repeating each other, and the history becomes one commit.
- Run `pnpm check` before accepting anything.
- A change to this file or to `spec/` gets its own commit, straight after the
  commit that taught the lesson.
- Do not commit. Anson commits after reading the diff.

## Deliberately not here

- No visual rules. The brief does not ask for a restyle, and the artefact
  criterion asks whether the site works.
- No architecture section. The platform is fixed and `README.md` documents it.
- No list of platform gotchas yet. One gets added when it has actually bitten.
