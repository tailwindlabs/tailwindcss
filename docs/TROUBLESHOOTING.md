# Troubleshooting

Most setup problems in this repo come from one of four places: running commands from the wrong directory, a stale Rust PATH on Windows, missing Playwright browsers, or Bun-only local workflows.

## `pnpm install` fails immediately

Make sure you are in the repository root, which is the `tailwindcss/` directory. Running install commands one level above it fails because there is no root [../package.json](../package.json) there.

After installation, run `pnpm run check:env` before `pnpm build` to confirm the toolchain is actually visible in the current terminal session.

That command is especially useful on Windows, where Rust may be installed correctly but not visible in the current shell yet.

## `pnpm` is not recognized

Enable Corepack or install the pinned version manually:

```sh
corepack enable
```

or

```sh
npm install -g pnpm@9.6.0
```

## Rust or WASM build errors

Confirm the repository toolchain and target are installed:

```sh
rustup toolchain install 1.85.0
rustup target add wasm32-wasip1-threads --toolchain 1.85.0
```

The repository uses [../rust-toolchain.toml](../rust-toolchain.toml) to select Rust 1.85.0 locally, so you should not need to change your global Rust default to recover from setup issues.

If the failure is inside the scanner or N-API binding, rerun `cargo test` before the full workspace build so you can isolate the Rust error earlier.

If the tools are installed but still not visible, reopen the shell and rerun `pnpm run check:env`.

## `pnpm vite` fails with Bun-related errors

The Vite playground in [../playgrounds/vite/package.json](../playgrounds/vite/package.json) runs with `bun --bun vite`. Install Bun before using that playground.

If you do not want to install Bun, validate Vite changes through the integration suite instead:

```sh
pnpm build && pnpm test:integrations -- --run integrations/vite
```

## Playwright tests fail before running assertions

Install browser binaries first:

```sh
npx playwright install
```

On Linux systems, CI uses `npx playwright install --with-deps`.

## `DEBUG=tailwindcss` does not work on Windows PowerShell

That syntax is for POSIX shells. In PowerShell, use:

```powershell
$env:DEBUG='tailwindcss'
pnpm build
Remove-Item Env:DEBUG
```

## Integration tests pass on Linux but fail elsewhere

That can happen legitimately. The repository only runs the full platform matrix on `main` or when the pull request body contains `[ci-all]`. Also note that [../integrations/oxide/wasm.test.ts](../integrations/oxide/wasm.test.ts) is Linux-only today.

## Source map behavior seems inconsistent

One CLI source-map integration scenario is intentionally skipped in [../integrations/cli/index.test.ts](../integrations/cli/index.test.ts) due to an upstream Lightning CSS bug. If you are touching source maps, verify the closest non-skipped integration tests and run a local playground in addition to unit coverage.

## I changed code, but the playground does not reflect it

Use one of these approaches:

1. Run `pnpm build` again before starting the playground.
2. Use package watch mode such as `pnpm run --filter=tailwindcss dev` in one terminal.
3. If the issue is adapter-specific, run that adapter's package watch mode instead.

If the change only shows up in one toolchain, confirm it in the matching integration suite before widening the investigation.

## Related guides

- [Local runbook](RUNBOOK.md)
- [Build and development](BUILD.md)
- [Testing guide](TESTING.md)