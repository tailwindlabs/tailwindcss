# Repository Guidelines

## Project Structure & Module Organization
- `packages/*` — TypeScript packages. Core lives in `packages/tailwindcss`; adapters/tools are under `@tailwindcss-*`.
- `crates/*` — Rust crates (e.g. `crates/oxide`, `crates/node`). Node bindings are published from here.
- `integrations/` — Vitest-based integration tests for CLIs/build tools.
- `scripts/` — Release and maintenance utilities (e.g. `version-packages.mjs`).
- `dist/` — Packed artifacts after builds; useful for local installs.
- `playgrounds/*` — Sample apps to manually verify changes.

## Build, Test, and Development Commands
- `pnpm install` — Install JS deps. Ensure Rust toolchain via `rustup default stable` and add `wasm32-wasip1-threads`.
- `pnpm dev` — Turbo watch builds; filter example: `pnpm dev --filter=tailwindcss`.
- `pnpm build` — Build all packages (excludes playgrounds). Creates tarballs in `dist/`.
- `pnpm test` — Run Rust `cargo test` and Vitest across the workspace.
- `pnpm test:integrations` — Run integration tests (run `pnpm build` first).
- `pnpm test:ui` — Run Playwright UI tests for browser-related behavior.
- `pnpm lint` / `pnpm format` — Check/fix formatting and package-level lint scripts.

## Coding Style & Naming Conventions
- Prettier is authoritative: `semi: false`, `singleQuote: true`, `printWidth: 100`.
- Indentation: 2 spaces. TypeScript files prefer `.ts`; compatibility shims may use `.cts`.
- Naming: kebab-case file names, camelCase functions/vars, PascalCase types/classes. Rust modules use `snake_case`.
- Run `pnpm lint` locally before opening a PR.

## Testing Guidelines
- Unit tests: Vitest; name files `*.test.ts` near the code they cover or in `src/**/__tests__`.
- Integration: tests live in `integrations/**`; run `pnpm build && pnpm test:integrations`.
- UI: Playwright tests via `pnpm test:ui`.
- Rust: crate tests run with `cargo test` (also covered by `pnpm test`). Include tests with any behavior change.

## Commit & Pull Request Guidelines
- Commit messages: clear, present-tense summaries; reference issues like `#123` when relevant.
- New features: open a discussion before investing significant work.
- PRs must include: problem summary, rationale, and a test plan (exact commands; screenshots if UI-related). Ensure all tests pass; use `[ci-all]` in the description to run all platform suites.
- See `.github/CONTRIBUTING.md` and `.github/PULL_REQUEST_TEMPLATE.md` for details.

## Security & Configuration Tips
- Do not commit secrets or machine-specific paths. Use `pnpm@9` (workspace-managed) and Rust stable. Turbo caches builds; when in doubt, rebuild with `pnpm build`.

