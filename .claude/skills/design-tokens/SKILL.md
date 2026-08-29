---
name: design-tokens
description: Use the Argumenta design tokens (colors, typography, shape) when building or styling any screen or component. Use when writing CSS, choosing colors or fonts, implementing a mockup screen, or reviewing visual fidelity.
---

# Design tokens

Visual source of truth: the **Novo Argumenta** canvas (design system v3),
<https://claude.ai/code/artifact/1a60ff06-7705-4edf-b24a-ecd5d894b263>, with the
`Sistema visual` artboard as the spec sheet. Tokens live in
`src/styles/tokens.css`. **Never hardcode a hex or a font-family**; always
`var(--...)`. New tokens go into tokens.css first, then get used.
`design/ui-mockups.html` is the superseded v2 art ("papel e caneta"): still the
reference for what each screen has to *say*, no longer for how it looks.

## Two rules that decide most arguments

- **Elevation is declared once**: a border OR a shadow, never both. Cards carry
  a 1px `--color-line` border; the card the student is meant to act on carries a
  1.5px `--color-caneta` border instead. No card gets a shadow.
- **There is exactly one shadow in the system**: `--press`, the 3px step under a
  primary action, which the button removes on `:active`. If a shadow shows up
  anywhere else, it is wrong.

## Colors (semantic, not decorative)

| Token | Hex | Meaning |
|---|---|---|
| `--color-paper` / `--color-card` | #F4F5F7 / #FFFFFF | page background, card surfaces |
| `--color-line` / `-strong` / `--color-track` | #E4E7EB / #D3D8DE / #ECEEF1 | hairlines, control borders, bar tracks |
| `--color-ink` / `-2` / `--color-muted` | #101418 / #54606C / #6B7683 | text, in descending emphasis |
| `--color-disabled` | #C9CFD6 | the fill of a blocked action |
| `--color-caneta` / `-press` / `-soft` | #2649E5 / #1932A8 / #EDF0FE | the single action colour |
| `--color-aprovado` / `-ink` / `-soft` | #0E9F6E / #07784F / #E7F6F0 | passed, completed |
| `--color-corretor` / `-ink` / `-soft` | #D92D20 / #A81C1C / #FDECEA | errors, failed floors |
| `--color-streak` / `-ink` / `-soft` | #E8891A / #A35C08 / #FBF0E2 | streak, "não convenceu" |
| `--color-marca-texto` | #FFE9A8 | repertoire mark, and the page's text selection |
| `--color-noite` / `-inner` / `--color-luz` / `-muted` | #111722 / #1B2432 / #E6EAF0 / #9AA6B6 | narration panels, consequence |

The `-ink` variants exist because the base colour is for fills, not for text:
`--color-aprovado` on white is under 4.5:1, `--color-aprovado-ink` is over it.
**Text always takes the `-ink` variant.**

## Typography

One family, `--font-display` (Inter, loaded in `index.html`). Four steps plus a
micro step, and nothing in between:

| Token | Size | Used for |
|---|---|---|
| `--text-title` | 24px | the one title of a screen (`--tracking-title`, −0.03em) |
| `--text-lead` | 19px | what the student reads slowly: narration, a character's line, an objective, a section heading (`--tracking-lead`) |
| `--text-body` | 15px | body copy, inputs, buttons (`--tracking-body`) |
| `--text-meta` | 13px | labels, criterion names, counters, chips |
| `--text-micro` | 11px | tab bar labels only |

Every number the student compares carries `font-variant-numeric: tabular-nums`
(the `.tabular` helper, or the property directly): a score that changes width
between attempts reads as a different score.

## Shape and layout

`--radius-card: 14px`, `--radius-button: 12px`, `--radius-tile: 10px`,
`--radius-chip: 999px` (small controls only), `--content-max: 34rem` (about 70
characters at `--text-body`).

## Conventions from the canvas

- **No uppercase eyebrows.** A label above a block names what the block is
  ("Seu objetivo") in 13px/700 in the colour of its meaning: caneta for the
  objective, `--color-streak-ink` for the hint. Never uppercase, never tracked
  out, never mono.
- **Icons are drawn**, on a 24 grid, `stroke-width: 1.75`, round caps and
  joins, `currentColor`. Never emoji, never a unicode glyph.
- **No SVG pretending to be a picture.** The story cover slot carries the
  story's position or its state until real cover art exists; narration rides
  the night panel instead of a drawn scene. A drawn "illustration" of a kitchen
  is worse than no illustration.
- Score bars: track in `--color-track`, fill in caneta, or corretor when the
  criterion is below its floor; the floor is a 2px ink tick at 35% opacity.
- Student text annotations: `text-decoration: underline wavy` in corretor for a
  mistake, `--color-marca-texto` behind a praised repertoire, numbered marks in
  a 15px circle.
- Styling is per-page CSS Modules (`src/pages/X/X.module.css`); shared pieces
  get promoted to `src/components/` only when a second screen needs them.
