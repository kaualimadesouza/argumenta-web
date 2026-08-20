---
name: tdd
description: Test-driven development workflow for the Argumenta web app - write Vitest + Testing Library tests before any implementation, red first, then green, then refactor. Use when starting any card, implementing any component, page, hook or fix, or whenever code is about to be written.
---

# TDD (owner decision: tests come first, always)

No component, hook or page before a failing test that demands it.

## The cycle

1. **Derive the tests before touching src/**
   - Component/page tests come from the card's acceptance criteria, one test
     per criterion, written with Vitest + Testing Library (jsdom): render, act
     like the student would (`userEvent`), assert what the screen shows.
   - Pure logic (formatting, derivations, API-response mapping) gets plain unit
     tests, no DOM.
   - API calls are mocked at the fetch/client boundary with typed fixtures that
     mirror the real backend contracts (argumenta-api pydantic responses).
2. **Red**: run `npm test` and watch the new tests fail for the right reason.
3. **Green**: implement the minimum that satisfies them.
4. **Refactor** with the suite as the safety net; the thermo-nuclear review
   runs before the PR anyway.

Bugfixes: failing regression test first, then the fix, and the test stays.

## Rules that keep the suite honest

- Query the DOM like a user: `getByRole`, `getByLabelText`, `getByText`;
  `data-testid` only as a last resort. Never assert implementation details
  (class names, internal state, call counts of internal helpers).
- Typed fixtures over ad-hoc object literals: one module of shared fixtures per
  API resource, matching the backend response types.
- A test that fails after a refactor is information: fix the code or the
  contract, never weaken the assertion.
- Each acceptance criterion of the card maps to at least one test the PR
  description can point to.
