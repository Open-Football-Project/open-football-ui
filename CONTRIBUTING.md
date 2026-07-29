# Contributing to match-insights-ui

Thanks for your interest in contributing. A few rules keep this project consistent and reviewable.

## How changes get made

- All work happens through pull requests — no direct pushes to `main`.
- Every PR needs an owner review and approval before merge. Merging is owner-only.
- Running or approving GitHub Actions workflows on this repo is owner-only.
- If your PR falls behind `main`, see [`resolve-conflicts.md`](resolve-conflicts.md) for how to update it.

## AI-assisted contributions

AI-assisted contributions are welcome, as long as they follow **TDCG** (Test-Driven Code Generation) — small, reviewable cycles where tests are written and approved before the implementation. See [`TDCG/README.md`](TDCG/README.md) for the full method, and the repo's root `CLAUDE.md` for the project-specific rules.

## Tests

Every feature contribution needs unit tests covering the behavior it adds or changes. PRs without test coverage for new behavior won't be merged.

## Getting started

- Fork the repo, create a feature branch, open a PR against `main`.
- Keep PRs small and focused on one behavior — split larger changes into multiple PRs rather than bundling unrelated work.
