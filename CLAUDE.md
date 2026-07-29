# Claude Code Instructions: open-football-ui

## Development method: TDCG

Every feature or behavior change follows this loop. Do not skip steps. Ask before moving to the next one.

```
1. SPECIFY  — agree on what to build, in plain language
2. RED      — generate failing tests; wait for human approval before continuing
3. PROMPT   — generate the implementation using the approved tests as the spec
4. GREEN    — tests pass; do not weaken assertions to force it
5. REVIEW   — check naming, single responsibility, duplication, dead code
6. REFACTOR — apply what review found; tests stay green throughout
7. COMMIT   — one small focused commit with a clear why
```

### Rules

- Always ask before moving to the next step. Never chain steps.
- Generate tests first. Wait for approval. Then generate the implementation.
- If a test fails, fix the implementation or the spec. Never change the test to make it pass.
- One behavior per cycle. If the prompt grows, split the cycle.
- Style changes (layout, colors) do not need a full cycle. Confirm with the user and apply.
- Always check an existing similar component before generating anything.

## Project

Web frontend (React, TypeScript, Vite) for the footballproject platform — live scores, match insights, odds, and stats for fans. Consumes the API and shares core hooks/logic with the mobile app via `open-football-project-core`.

Method reference: [`TDCG/README.md`](TDCG/README.md)
