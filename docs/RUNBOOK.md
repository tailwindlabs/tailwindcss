# Local Runbook

Use this when you already know what you changed and want the shortest route back to confidence.

The goal is simple: run the smallest useful check first, then one real runtime path if the change is easier to judge in an app than in a snapshot.

## Fast decision table

| I changed... | Minimum validation | Best local run path |
| --- | --- | --- |
| Core compiler in [../packages/tailwindcss](../packages/tailwindcss) | `pnpm test` | `pnpm build && pnpm vite` or `pnpm build && pnpm nextjs` |
| PostCSS adapter in [../packages/@tailwindcss-postcss](../packages/@tailwindcss-postcss) | `pnpm build && pnpm test:integrations -- --run integrations/postcss` | `pnpm build && pnpm nextjs` |
| Vite adapter in [../packages/@tailwindcss-vite](../packages/@tailwindcss-vite) | `pnpm build && pnpm test:integrations -- --run integrations/vite` | `pnpm build && pnpm vite` |
| Webpack adapter in [../packages/@tailwindcss-webpack](../packages/@tailwindcss-webpack) | `pnpm build && pnpm test:integrations -- --run integrations/webpack` | `pnpm build && pnpm test:integrations -- --run integrations/webpack` |
| CLI behavior in [../packages/@tailwindcss-cli](../packages/@tailwindcss-cli) | `pnpm build && pnpm test:integrations -- --run integrations/cli` | Use packed tarballs or CLI integration fixtures |
| Upgrade logic in [../packages/@tailwindcss-upgrade](../packages/@tailwindcss-upgrade) | `pnpm build && pnpm test:integrations -- --run integrations/upgrade` | `pnpm build && pnpm test:integrations -- --run integrations/upgrade` |
| Rust scanner in [../crates/oxide](../crates/oxide) or [../crates/node](../crates/node) | `cargo test && pnpm build && pnpm test:integrations -- --run integrations/oxide` | `pnpm build && pnpm vite` |
| Browser-only CSS behavior | `pnpm build && pnpm test:ui` | `pnpm build && pnpm vite` |

## Boot the repository once

From the repository root:

```sh
corepack enable
pnpm install
rustup toolchain install 1.85.0
rustup target add wasm32-wasip1-threads --toolchain 1.85.0
pnpm build
```

The repository selects Rust 1.85.0 via [../rust-toolchain.toml](../rust-toolchain.toml), so there is no need to change your global Rust default before building.

Optional tools:

- Install Playwright browsers before UI tests: `npx playwright install`
- Install Bun if you want to run the Vite playground, because [../playgrounds/vite/package.json](../playgrounds/vite/package.json) uses `bun --bun vite`

## Launch local playgrounds

### Vite playground

Use this when changing the core compiler, Vite adapter, or fast feedback CSS generation.

```sh
pnpm build
pnpm vite
```

This is usually the fastest way to eyeball a CSS generation change after `pnpm build`. It requires Bun.

### Next.js playground

Use this when changing the PostCSS path or testing a framework-style app.

```sh
pnpm build
pnpm nextjs
```

### Package-level watch mode

Use this when you only need a package rebuilding while a playground or test suite consumes it.

```sh
pnpm run --filter=tailwindcss dev
pnpm run --filter=@tailwindcss/postcss dev
pnpm run --filter=@tailwindcss/vite dev
```

Keep one of those running in a terminal, then start the playground or test command in another terminal.

If you are debugging a rebuild issue, this split-terminal setup is often much easier to reason about than rerunning full workspace builds.

## Targeted validation commands

### Core compiler changes

Use this when the change affects variants, utilities, parsing, theme handling, or emitted CSS.

```sh
pnpm test
pnpm build && pnpm test:integrations -- --run integrations/postcss
pnpm build && pnpm test:integrations -- --run integrations/vite
```

### PostCSS changes

Use this when the bug only reproduces through the PostCSS plugin or through framework integrations that rely on it.

```sh
pnpm run --filter=@tailwindcss/postcss dev
pnpm build && pnpm test:integrations -- --run integrations/postcss
pnpm build && pnpm nextjs
```

### Vite changes

Use this when the bug involves transforms, HMR, virtual modules, or dev-server behavior.

```sh
pnpm run --filter=@tailwindcss/vite dev
pnpm build && pnpm test:integrations -- --run integrations/vite
pnpm build && pnpm vite
```

### Rust or scanner changes

Use this when candidates are missing, roots are wrong, ignore behavior changed, or file scanning performance is involved.

```sh
cargo test
pnpm build
pnpm test:integrations -- --run integrations/oxide
pnpm test:integrations -- --run integrations/vite
```

### CLI or upgrade changes

Use this when the issue lives in command-line behavior, migration messaging, or upgrade diagnostics.

```sh
pnpm build && pnpm test:integrations -- --run integrations/cli
pnpm build && pnpm test:integrations -- --run integrations/upgrade
```

## Debug logging

### macOS/Linux shells

```sh
DEBUG=tailwindcss pnpm build
DEBUG=tailwindcss pnpm test
```

### Windows PowerShell

```powershell
$env:DEBUG='tailwindcss'
pnpm build
pnpm test
Remove-Item Env:DEBUG
```

### Windows Command Prompt

```bat
set DEBUG=tailwindcss
pnpm build
pnpm test
set DEBUG=
```

## Before opening a pull request

Use this practical minimum checklist:

1. Run the smallest targeted validation for the area you changed.
2. Run one local runtime path such as `pnpm vite` or `pnpm nextjs` if your change affects generated CSS, dev-server behavior, or source maps.
3. If your change touched Rust, source maps, path handling, or scanning, request the full CI matrix with `[ci-all]` in the pull request body.
4. If your change affected browser behavior, run `pnpm build && pnpm test:ui`.

If you cannot explain why you ran a command, it is probably not the right command for the PR description.

## Related guides

- [Build and development](BUILD.md)
- [Testing guide](TESTING.md)
- [Troubleshooting](TROUBLESHOOTING.md)