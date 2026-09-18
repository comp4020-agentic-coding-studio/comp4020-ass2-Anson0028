# SLOP2875 — Is It Me or Is It the Game?

Subtitle, used on the social card: Measuring game balance without players.

## What this course argues

I'm building a persuasive, hands-on course that teaches balance in
single-player games as a measurement problem solved by simulation, aimed at
people who make or mod games and believe balance is a matter of taste: tweak
the numbers until it feels right. The whole semester measures one specimen,
Close Quarters, a two-minute survival game. Nobody plays it until week ten, and
week ten is where the course admits what simulation cannot see. The course argues
through what a course website affords: the order of the twelve weeks, what each
tutorial asks students to measure, what the assessments reward, and twelve decks.

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
3. Every tutorial ends with a number the student produced. This course is about
   measurement; a tutorial that ends in a discussion has taught taste again.
4. Assessments reward a defended number, not a finished game, and each one is
   built from the one before: a curve, then a point on it and what else moved,
   then the defence. The idea of chaining them came from a classmate's course
   (Dunkelflaute); what gets chained is mine.
5. The scope is narrow on purpose. Single-player games only, simulation only.
   Multiplayer balance and human playtesting are other courses; "game balance"
   without those limits is a course a real curriculum committee would wave
   through, which the brief calls too broad.
6. A lecture title is that week's claim, in plain words. No metaphors. Read
   down the lectures list and you should have the course's argument. Tutorial
   and assessment titles stay plain names of what you do. This replaced
   "titles say what the week is" after reading classmates whose week lists
   argue (Try Again, Later; Back of the Envelope): topic nouns like "Gates"
   told a visitor nothing the claim does not tell better.
7. Five readings for the semester, one per block of two or three weeks. A
   reading every week, the way Calling Bullshit does it, would turn the tutorials
   into a reading group; here the week's text is usually the student's own
   data. Each reading is a real paper that Anson has opened.

## Rules, and the check that holds each one

| Rule | Check |
| --- | --- |
| Twelve lectures, one per teaching week | `spec/course.test.ts` › one lecture per week |
| A tutorial for every teaching week | `spec/course.test.ts` › one tutorial per week |
| Each week links to the next | `spec/course.test.ts` › spine |
| No two lecture titles share a content word | `spec/course.test.ts` › titles |
| Every lecture names a quantity with a unit | `spec/course.test.ts` › measurable |
| Assessment weights total 100 | `spec/course.test.ts` › weights |
| Assessments are a chain: a piece that `consumes:` another names one due earlier | `spec/course.test.ts` › is a chain |
| Every tutorial says what it measures (`measures:`) | `spec/course.test.ts` › tutorials end in a number |
| At most six readings, each with authors, a title and a URL | `spec/course.test.ts` › few readings |
| Dated material stays inside the teaching period | `spec/data-integrity.test.ts` (shipped) |
| Every week has a deck of its own | `spec/course.test.ts` › a deck of its own |
| Every deck leads back to the week it belongs to | `spec/course.test.ts` › lead back to the week |
| Every week says which side of the title's question it measures, three weeks each for "me" and "the game" | `spec/course.test.ts` › which suspect |
| Every week answers the title's question in a sentence of its own, eight words or more, no two alike | `spec/course.test.ts` › what it does to the course's question |
| No starter prose on any built page | `spec/course.test.ts` › no starter prose |
| Every built page has exactly one h1 | `spec/course.test.ts` › exactly one h1 |
| No page costs a visitor more than 3 s at 400 kbit/s | `scripts/check-payload.ts`, run by `pnpm check` and so by CI |
| Every run button works twice in a row from the keyboard, and focus never leaves it | `pnpm check:browser` (a real browser, so outside `pnpm check`) |
| Nothing I styled fails colour contrast, in light or dark. Headings in the platform's fixed amber are reported and not counted | `pnpm check:browser` |
| No table hides a column off screen at 390 px | `pnpm check:browser` |
| Every slide fits its stage at 1920x1080 and 390x844, and no text on a phone is under 14 px | `pnpm check:decks` (a real browser, so outside `pnpm check`) |

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

- Whether a first-time reader can tell what a thing is. Three times in one
  evening every check was green and Anson, reading as a stranger, was stopped:
  a hero with no subtitle, a chart shown before it was explained, and a tag
  that said "the instrument" and was read as a musical one. Read each page
  cold before it ships.
- Whether pages agree with each other. The tutorials alternated between two
  teachers while one staff page said he runs all of them. Two names in twelve
  slots is a pattern an agent fills in without being asked.

- What a stranger would try. After seven or eight passes of my own found
  nothing more, a fresh session with no context pressed Enter twice, ran axe in
  a real browser, searched the build for one template sentence and scrolled a
  table on a phone. Each found something, and each is now a check. My passes
  kept looking the way they had looked before. Get a cold reader before
  shipping, and turn what they find into sensors, not just fixes.

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
and a visitor loads one. `check-a11y` was left behind on the grounds that this platform's build
already runs axe. That was wrong. The build's axe runs in JSDOM, which has no
layout and cannot compute a contrast ratio, and it let through a table header
of mine at 2.41:1 in dark mode. An outside review found it with axe in a real
browser. It came back as part of `check-browser`. `check-viewports` came across late, as `check-decks`:
for a day the deck at a phone viewport was held by hand, measured against the
one deck that had been written to fit the rule. With twelve decks the hand
measurement missed that table cells were 8.8 px on a phone. The sensor found
it on its first run.

## How to work here

- One or two weeks of content per change. Never generate all twelve at once:
  the weeks come back repeating each other, and the history becomes one commit.
- A new deliverable starts by carrying the harness forward, before any content.
- Run `pnpm check` before accepting anything.
- A change to this file or to `spec/` gets its own commit, straight after the
  commit that taught the lesson.
- Do not commit. Anson commits after reading the diff.
- The dev server is not the site. It served stale frontmatter for hours (old
  titles, eleven missing slides links), has no search index, and shows a
  toolbar the build does not. Anything a marker will see gets looked at on
  `pnpm build` and `astro preview`, not on `pnpm dev`.

## Deliberately not here

- No site-wide visual rules. The platform's theme stays on every page. The one
  exception is the home page: its hero is the title split into its two
  suspects, and its picture is the course's own 306 runs drawn one dot per run.
  Anson asked for this after looking at classmates' sites, where the strong ones
  keep the theme and put one thing of their own on the front page. It is drawn
  in CSS with no images and no web font, and `pnpm check:payload` still holds.
- No architecture section. The platform is fixed and `README.md` documents it.
## Things this platform has actually bitten me with

- A week links back to the week before it, never forward. `related:` renders on
  both pages either way, but the build fails on a ref to a page that does not
  exist yet, and weeks get written one or two at a time.
- Every number about Close Quarters on the site was measured from its
  `rules.ts` on the day it was written. Re-measure before quoting one; the game
  has changed since the numbers in my head were true.
