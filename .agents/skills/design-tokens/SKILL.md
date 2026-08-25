---
name: design-tokens
description: Use the Argumenta design tokens (colors, typography, shape) when building or styling any screen or component. Use when writing CSS, choosing colors or fonts, implementing a mockup screen, or reviewing visual fidelity.
---

# Design tokens

Visual source of truth: [design/ui-mockups.html](../../../design/ui-mockups.html)
(design system v2 "papel e caneta", 7 telas do MVP). Tokens live in
`src/styles/tokens.css`. **Never hardcode a hex or a font-family**; always
`var(--...)`. New tokens go into tokens.css first, then get used.

## Colors (semantic, not decorative)

| Token | Hex | Meaning |
|---|---|---|
| `--color-paper` | #F6F6F3 | page background ("papel") |
| `--color-card` | #FFFFFF | card surfaces |
| `--color-ink` | #1D2530 | primary text ("tinta") |
| `--color-muted` | #61707A | secondary text |
| `--color-caneta` / `-soft` | #2149C4 / #E8EDFB | primary actions, active lens (BIC pen) |
| `--color-marca-texto` | #FFE45C | highlights, streak, repertoire praise |
| `--color-corretor` / `-soft` | #C2402A / #F9E9E5 | errors, failed floors, blocked |
| `--color-aprovado` / `-soft` | #2E7D5B / #E4F1EA | approved, completed |
| `--color-noite` / `--color-noite-inner` | #232D3B / #26303F | consequence scenes, dark panels |
| `--color-line` / `--color-track` / `--color-luz` | #E5E4DC / #ECEBE4 / #F3F1E8 | borders, progress tracks, light text on dark |

## Typography (loaded via Google Fonts in index.html)

| Token | Family | Used for |
|---|---|---|
| `--font-display` | Bricolage Grotesque | headings, UI, buttons |
| `--font-serif` | Source Serif 4 | narrative text, student writing |
| `--font-mono` | IBM Plex Mono | scores, labels, kickers (uppercase + letter-spacing) |

## Shape and layout

`--radius-card: 14px`, `--radius-button: 10px`, `--radius-chip: 999px`,
`--content-max: 42rem` (reading column on desktop).

## Component conventions (from the mockups)

- Chips: mono font, uppercase, soft background + strong foreground of the same
  semantic color (e.g. caneta-soft + caneta).
- Score bars: track in `--color-track`, fill in caneta (or corretor when below
  the floor), floor marker as an ink tick.
- Student text annotations: corretor underline for errors, marca-texto highlight
  for repertoire, numbered marks.
- Styling is per-page CSS Modules (`src/pages/X.module.css`); shared pieces get
  promoted to components only when a second screen needs them.
