# SLOP2875 — Measuring Game Balance Without Players

## What this course argues

I'm building a persuasive, hands-on course that teaches balance in
single-player games as a measurement problem solved by simulation, aimed at
people who make or mod games and believe balance is a matter of taste: tweak
the numbers until it feels right. The whole semester measures one specimen,
Close Quarters, a two-minute survival game. Nobody plays it until week ten, and
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
4. Assessments reward a defended number, not a finished game, and each one is
   built from the one before: a curve, then a point on it and what else moved,
   then the defence. The idea of chaining them came from a classmate's course
   (Dunkelflaute); what gets chained is mine.
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
| Assessments are a chain: a piece that `consumes:` another names one due earlier | `spec/course.test.ts` › is a chain |
| Every studio says what it measures (`measures:`) | `spec/course.test.ts` › studios end in a number |
| At most six readings, each with authors, a title and a URL | `spec/course.test.ts` › few readings |
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

## Carried forward from earlier weeks

These are rules about how I work, learned in Assignment 1, crit 4 and crit 5.
They are short here because this file is read on every turn; the long forms,
with the incidents behind them, are in
[crit 5's CLAUDE.md](https://github.com/comp4020-agentic-coding-studio/comp4020-crit5-Anson0028/blob/main/CLAUDE.md).

This section was added late. The A2 harness was first written from scratch, and
the omission was caught by Anson asking, not by any check. The earlier repos
were set up through the course's `start` skill, which merges the old harness
as one of its steps; this repo was cloned by hand, the session had changed
model and been summarised since crit 5, and nothing failed when the step was
skipped. See the first rule.

- **A rule is not a rule until something fails when it is broken.** A1's
  CLAUDE.md described touch input that was never built, and 47 passing tests
  never noticed. This is why the rules above sit in a table beside their checks.
- **An assertion goes green most easily when its subject is absent.** I don't
  trust a check I haven't watched fail. Here: the weights check passed on day
  one only because the starter's placeholders happen to sum to 100.
- **Measure the baseline before changing anything,** and write down what was
  already true, so a later green is known to mean something changed.
- **Name what only a person can judge, then go and judge it.** Crit 4: four
  instruments passed every check and sounded like one note. Here it is the
  "held by hand" section.
- **PROCESS.md uses my facts, not a plausible reconstruction.** If a beat is
  missing, ask Anson or leave it out. He defends every claim out loud at the
  retro.
- **Harness changes get their own commit,** straight after the commit that
  taught the lesson, with a message that names the lesson.
- **pnpm brings its own Node.** `pnpm dev` here picked up the system's Node 20
  and Astro refused to start; run through `mise exec`.

Not carried: the key-event ownership rule (an interaction rule; this is a
content site), and everything about harps and survival arenas.

Sensors: `check-payload` comes across, retargeted from "the whole of dist" to
"what one page makes a visitor download", because this site has twenty pages
and a visitor loads one. `check-a11y` stays behind, since this platform's build
already runs axe on every page. `check-viewports` stays behind until the deck
exists; the deck at a phone viewport is the one thing here nothing checks.

## How to work here

- One or two weeks of content per change. Never generate all twelve at once:
  the weeks come back repeating each other, and the history becomes one commit.
- A new deliverable starts by carrying the harness forward, before any content.
- Run `pnpm check` before accepting anything.
- A change to this file or to `spec/` gets its own commit, straight after the
  commit that taught the lesson.
- Do not commit. Anson commits after reading the diff.

## Deliberately not here

- No visual rules. The brief does not ask for a restyle, and the artefact
  criterion asks whether the site works.
- No architecture section. The platform is fixed and `README.md` documents it.
## Things this platform has actually bitten me with

- A week links back to the week before it, never forward. `related:` renders on
  both pages either way, but the build fails on a ref to a page that does not
  exist yet, and weeks get written one or two at a time.
- Every number about Close Quarters on the site was measured from its
  `rules.ts` on the day it was written. Re-measure before quoting one; the game
  has changed since the numbers in my head were true.
