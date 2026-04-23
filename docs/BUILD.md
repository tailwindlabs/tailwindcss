# Build And Development

This repository is a pnpm workspace, a Rust project, and a standalone CLI build at the same time. A normal contributor workflow only needs a subset of that surface, so this guide focuses on the commands you actually use while iterating.

## Prerequisites

You need these tools locally:

- Node.js 24 or newer, matching CI in [../.github/workflows/ci.yml](../.github/workflows/ci.yml)
- pnpm 9.6.0, matching [../package.json](../package.json)
- Rust 1.85.0, matching [../rust-toolchain.toml](../rust-toolchain.toml)
- The `wasm32-wasip1-threads` target
- Bun, only if you want to run the Vite playground in [../playgrounds/vite/package.json](../playgrounds/vite/package.json)

## First-time setup

If you just cloned the repo, start here:

```sh
cd tailwindcss
corepack enable
pnpm install
rustup default stable
rustup target add wasm32-wasip1-threads
pnpm run check:env
pnpm build
```

`pnpm run check:env` is the fast sanity check. It is cheaper than a full build and catches the most common Rust and WASM setup problems.

If you do not use Corepack, install the pinned pnpm version manually:

```sh
npm install -g pnpm@9.6.0
```

## Daily commands

| Command | Purpose |
| --- | --- |
| `pnpm build` | Build the workspace packages you usually touch during development |
| `pnpm dev` | Run Turbo dev tasks for packages that expose them |
| `pnpm test` | Run Rust tests and the main Vitest suite |
| `pnpm build && pnpm test:integrations` | Verify built packages through real fixture projects |
| `pnpm build && pnpm test:ui` | Run Playwright coverage for browser-specific behavior |
| `pnpm bench` | Run committed benchmark files |
| `pnpm build && pnpm vite` | See a change in the Vite playground |
| `pnpm build && pnpm nextjs` | See a change in the Next.js playground |

## Working on one package

When you already know which package owns the problem, filtered commands are faster than rebuilding everything:

```sh
pnpm run --filter=tailwindcss dev
pnpm run --filter=@tailwindcss/postcss dev
pnpm run --filter=@tailwindcss/vite dev
```

That pattern works especially well for adapter work, where the playground or integration suite can consume a single package rebuild.

## Debugging

The Node-facing packages respect the `DEBUG` environment variable through [../packages/@tailwindcss-node/src/env.ts](../packages/@tailwindcss-node/src/env.ts).

Useful examples:

macOS/Linux:

```sh
DEBUG=* pnpm build
DEBUG=tailwindcss pnpm test
DEBUG=tailwindcss pnpm build && pnpm test:integrations
```

Windows PowerShell:

```powershell
$env:DEBUG='*'
pnpm build
$env:DEBUG='tailwindcss'
pnpm test
Remove-Item Env:DEBUG
```

Adapters such as PostCSS, Vite, and Webpack emit useful rebuild timing and lifecycle logs when debug mode is enabled.

## Common setup mistakes

### Running commands from the wrong directory

The workspace root is the `tailwindcss/` folder. Running `pnpm install` or `npm install` one directory above it will fail because there is no root `package.json` there.

### Missing Rust target

If builds fail around WASM artifacts, confirm the target is installed:

```sh
rustup target add wasm32-wasip1-threads
```

### UI tests fail immediately

Playwright browser binaries are not installed automatically. Install them before running browser tests:

```sh
npx playwright install
```

On Linux CI, the repository uses `npx playwright install --with-deps`.

### `pnpm vite` fails with Bun errors

The Vite playground uses `bun --bun vite`, so install Bun before using `pnpm vite`. If you do not want Bun locally, validate Vite work through integration tests instead.

## Scenario-based workflow

If you already know which area you changed and want the shortest route back to confidence, go straight to the [local runbook](RUNBOOK.md).

## Consuming local builds in another project

After a successful build, packaged tarballs are placed in `dist/`. You can install those tarballs into another local project to verify behavior outside the monorepo.

## Related guides

- [Architecture overview](ARCHITECTURE.md)
- [Local runbook](RUNBOOK.md)
- [Testing guide](TESTING.md)
- [Troubleshooting](TROUBLESHOOTING.md)
- [Contributing guide](../.github/CONTRIBUTING.md)