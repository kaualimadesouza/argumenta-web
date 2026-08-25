# argumenta-web

Responsive web frontend of Argumenta (Vite + React 19 + TypeScript strict).
Product decisions live in the argumenta-api repo (`docs/PRD.md`); the visual
source of truth is [design/ui-mockups.html](design/ui-mockups.html).

## Skills: check these BEFORE acting

Repo skills live in `.agents/skills/`. If the task matches a row, invoke the
skill first; do not improvise the workflow from memory.

| If the task involves... | Invoke |
|---|---|
| Starting/finishing an issue, opening a PR, the kanban board | `card-workflow` |
| Writing ANY code (tests come first) | `tdd` |
| Reviewing a PR/diff before merge (mandatory for EVERY PR) | `thermo-nuclear-code-quality-review` |
| Building or styling any screen/component, colors, fonts | `design-tokens` |
| Writing ANY Portuguese the student reads (copy, labels, empty states) | `portuguese-copy` |

## Non-negotiables

- **TDD, always** (owner decision): write the tests (Vitest + Testing Library)
  BEFORE the implementation, derived from the card's acceptance criteria;
  red first, then implement until green, then refactor.
- **Typed objects, never loose dicts/objects** (owner decision): every function
  input/output shape is a named TypeScript interface or type; no `any`, no
  anonymous object shapes crossing module boundaries.

- **No assistant attribution anywhere**: no `Co-Authored-By`, no "Generated with"
  footers, in commits, PRs, issues or comments. Owner decision, permanent.
- **GitHub account**: `kaualimadesouza` only. `gh auth status` before gh/git
  network operations; switch back if the work account is active.
- One card = one PR to main, titled as a conventional commit, body `Closes #<n>`.
- Code, identifiers, comments, commit messages and PR descriptions in English.
  UI copy is pt-BR.
- **Correct pt-BR in every string the student reads** (owner decision, details in
  the `portuguese-copy` skill): full accentuation, crase and hyphenation in copy,
  labels, empty states and error messages. A product that grades spelling cannot
  ship `"Voce e presidente do gremio"`. Route paths, enum values and identifiers
  stay unaccented ASCII on purpose.
- Never hardcode colors or font families: use the CSS variables from
  `src/styles/tokens.css` (see `design-tokens`).
- `npm run lint && npm run typecheck && npm test` must pass before every push;
  CI runs the same plus `npm run build`.

## Related

Kanban: GitHub Project "Argumenta MVP" (owner kaualimadesouza, number 2), shared
with argumenta-api and argumenta-mobile.
