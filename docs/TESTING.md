# Testing Guide

This repository has four useful layers of confidence: focused tests in the touched package, Rust tests for oxide, integration suites that install built packages, and browser tests for CSS behavior that only shows up in a real runtime.

## Test suites

| Command | Scope |
| --- | --- |
| `pnpm test` | Rust tests plus the main Vitest suite |
| `pnpm build && pnpm test:integrations` | End-to-end integration tests under [../integrations](../integrations) |
| `pnpm build && pnpm test:ui` | Browser tests for packages that depend on Playwright |
| `pnpm bench` | Benchmark files committed in the repository |

## Where tests live

| Path | Purpose |
| --- | --- |
| [../crates/oxide/tests](../crates/oxide/tests) | Rust scanner behavior |
| [../integrations/cli](../integrations/cli) | CLI behavior and output |
| [../integrations/postcss](../integrations/postcss) | PostCSS adapter behavior |
| [../integrations/vite](../integrations/vite) | Vite adapter and dev/build flows |
| [../integrations/webpack](../integrations/webpack) | Webpack adapter behavior |
| [../integrations/oxide](../integrations/oxide) | Wasm and oxide integration coverage |
| [../integrations/upgrade](../integrations/upgrade) | Upgrade assistant and migration errors |
| [../packages/tailwindcss/src/*.bench.ts](../packages/tailwindcss/src) | Core performance benchmarks |

## Important prerequisites

Integration and UI suites depend on built workspace artifacts. Run `pnpm build` before them.

This matters because the integration harness in [../integrations/utils.ts](../integrations/utils.ts) installs and executes packages the way a consumer would, not by importing your source files directly.

## Platform caveats

- The CI matrix runs Windows, Linux, and macOS on `main`, but feature branches skip Windows and macOS unless a pull request body contains `[ci-all]`. See [../.github/workflows/ci.yml](../.github/workflows/ci.yml).
- The WASM integration test in [../integrations/oxide/wasm.test.ts](../integrations/oxide/wasm.test.ts) is Linux-only today because of Node WASI limitations on macOS and Windows.
- The source-map integration case in [../integrations/cli/index.test.ts](../integrations/cli/index.test.ts) is intentionally skipped because of an upstream Lightning CSS bug.

If you touch Rust, scanner behavior, source maps, or path handling, do not rely on a single-platform local run.

## Writing new tests

Prefer the narrowest test that fully proves the behavior:

1. Add focused module tests when the change is internal and deterministic.
2. Add or update integration coverage when behavior crosses package boundaries.
3. Add UI tests only when browser behavior or CSS runtime behavior must be verified.

In practice, a good Tailwind PR usually has one focused proof close to the changed code and one broader proof if the behavior crosses package boundaries.

## Debugging integration tests

The integration harness supports debug-oriented behavior in [../integrations/utils.ts](../integrations/utils.ts), including special handling for pnpm workspaces in debug mode.

When an integration test is hard to reason about:

- rebuild first with `pnpm build`
- rerun the smallest relevant suite
- enable `DEBUG=tailwindcss`
- inspect the test fixture setup in [../integrations/utils.ts](../integrations/utils.ts)

That harness is worth reading. Many integration failures make sense once you see how fixture files are written, installed, and executed.

## Benchmarks

Use `pnpm bench` to run committed benchmark files. Candidate-focused benchmarks in [../packages/tailwindcss/src/candidate.bench.ts](../packages/tailwindcss/src/candidate.bench.ts) and compile-focused benchmarks in [../packages/tailwindcss/src/index.bench.ts](../packages/tailwindcss/src/index.bench.ts) are good starting points when you are validating performance-sensitive work.

## What to run before you push

Use this lightweight matrix. It maps closely to how maintainers usually reason about changes during review.

| Change area | Run at minimum |
| --- | --- |
| Compiler core | `pnpm test` plus one adapter integration suite |
| PostCSS adapter | `pnpm build && pnpm test:integrations -- --run integrations/postcss` |
| Vite adapter | `pnpm build && pnpm test:integrations -- --run integrations/vite` |
| Webpack adapter | `pnpm build && pnpm test:integrations -- --run integrations/webpack` |
| CLI or upgrade | `pnpm build && pnpm test:integrations -- --run integrations/cli` or `integrations/upgrade` |
| Rust scanner | `cargo test`, then `pnpm build && pnpm test:integrations -- --run integrations/oxide` |
| Browser-visible behavior | `pnpm build && pnpm test:ui` |

For a more operational, step-by-step version of this matrix, see the [local runbook](RUNBOOK.md).

## Related guides

- [Build and development](BUILD.md)
- [Architecture overview](ARCHITECTURE.md)
- [Extending the repository](EXTENDING.md)
- [Local runbook](RUNBOOK.md)