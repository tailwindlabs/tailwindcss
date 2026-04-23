# Contributing

Tailwind is a mixed TypeScript and Rust monorepo. The fastest way to get a change accepted is to keep the scope tight, change the layer that already owns the behavior, and include the smallest convincing test plan.

Before touching core behavior, skim these local repo notes:

- [Architecture overview](../docs/ARCHITECTURE.md)
- [Build and development](../docs/BUILD.md)
- [Extending Tailwind in this repository](../docs/EXTENDING.md)
- [Testing guide](../docs/TESTING.md)
- [Local runbook](../docs/RUNBOOK.md)
- [Troubleshooting](../docs/TROUBLESHOOTING.md)

## Requirements

Before getting started, ensure your system has access to the following tools:

- [Node.js](https://nodejs.org/) 24 or newer
- [Rustup](https://rustup.rs/)
- [pnpm](https://pnpm.io/) 9.6.0
- Rust 1.85.0 via the repository toolchain
- Bun if you want to run the Vite playground

## Getting started

Run commands from the repository root.

```sh
corepack enable
pnpm install
rustup toolchain install 1.85.0
rustup target add wasm32-wasip1-threads --toolchain 1.85.0

pnpm run check:env
pnpm build
```

The repository selects Rust 1.85.0 via [rust-toolchain.toml](../rust-toolchain.toml), so contributors do not need to change their global Rust default.

If you do not use Corepack, install pnpm manually:

```sh
npm install -g pnpm@9.6.0
```

## Development workflow

Most day-to-day work in this repository looks like one of these loops:

- `pnpm tdd` when you are iterating on compiler-level TypeScript tests
- `pnpm build && pnpm test:integrations` when behavior crosses package boundaries
- `pnpm build && pnpm vite` or `pnpm build && pnpm nextjs` when you need to see the result inside an app

For watch mode:

```sh
pnpm tdd
```

The `playgrounds` directory is useful when a change is easier to judge visually than from snapshots or fixture output alone.

To start the Vite playground:

```sh
pnpm build && pnpm vite
```

To start the Next.js playground, use:

```sh
pnpm build && pnpm nextjs
```

For package-local watch mode, prefer filters:

```sh
pnpm run --filter=tailwindcss dev
pnpm run --filter=@tailwindcss/postcss dev
pnpm run --filter=@tailwindcss/vite dev
```

## Choosing where to work

- If the bug only shows up in Vite, PostCSS, or Webpack, start in that adapter instead of the core compiler.
- If the bug is about candidate discovery, roots, ignore rules, or scan performance, start in oxide.
- If the change affects emitted CSS everywhere, start in `packages/tailwindcss`.
- If you are not sure, trace the failing integration test first and change the first layer that actually decides the behavior.

## Bug fixes

If you've found a bug in Tailwind that you'd like to fix, [submit a pull request](https://github.com/tailwindlabs/tailwindcss/pulls) with your changes. Include a helpful description of the problem and how your changes address it, and provide tests so we can verify the fix works as expected.

## New features

If there's a new feature you'd like to see added to Tailwind, [share your idea with us](https://github.com/tailwindlabs/tailwindcss/discussions/new?category=ideas) in our discussion forum to get it on our radar as something to consider for a future release before starting work on it.

**Please note that we don't often accept pull requests for new features.** Adding a new feature to Tailwind requires us to think through the entire problem ourselves to make sure we agree with the proposed API, which means the feature needs to be high on our own priority list for us to be able to give it the attention it needs.

If you open a pull request for a new feature, we're likely to close it not because it's a bad idea, but because we aren't ready to prioritize the feature and don't want the PR to sit open for months or even years.

Smaller improvements land more reliably than broad feature pushes. Tight fixes, workflow improvements, platform fixes, adapter-specific correctness work, and missing tests are all much easier to review.

## Coding standards

Our code formatting rules are defined in the `"prettier"` section of [package.json](https://github.com/tailwindlabs/tailwindcss/blob/main/package.json). You can check your code against these standards by running:

```sh
pnpm run lint
```

To automatically fix any style violations in your code, you can run:

```sh
pnpm run format
```

## Running tests

For a normal code change, start with the narrowest check that proves it. These are the most common commands:

```sh
pnpm test
```

Then widen only if the change crosses package boundaries:

```sh
pnpm build && pnpm test:integrations
```

Additionally, some features require testing in browsers (i.e. to ensure CSS variable resolution works as expected). These can be run via:

```sh
pnpm build && pnpm test:ui
```

Install Playwright browsers before running UI tests:

```sh
npx playwright install
```

### Platform caveats

- The full Windows, Linux, and macOS CI matrix only runs on `main` or when the pull request body contains `[ci-all]`.
- The WASM integration coverage in [../integrations/oxide/wasm.test.ts](../integrations/oxide/wasm.test.ts) is Linux-only right now.
- One source-map integration case is intentionally skipped because of an upstream Lightning CSS issue.

If you touch scanner behavior, Rust code, path handling, or source maps, request the full CI matrix.

If your change only fixes one package or one integration path, say that clearly in the PR description. Small, precise claims are easier to verify and easier to merge.

## Debugging tips

The Node-facing packages respect the `DEBUG` environment variable. Useful examples:

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

If you need an exact command sequence based on the area you changed, use the [local runbook](../docs/RUNBOOK.md).

Please ensure that all tests are passing when submitting a pull request. If you're adding new features to Tailwind CSS, always include tests.

After a successful build, you can also use the npm package tarballs created inside the `dist/` folder to install your build in other local projects.

## Pull request process

When submitting a pull request:

- Keep the title narrow and factual.
- Explain the bug, the owning layer, and the behavior change in the summary.
- Include the exact commands you ran in the test plan.
- Mention which packages or test suites were intentionally not touched.
- Add `[ci-all]` in the pull request body if you touched Rust, source maps, path handling, or cross-platform behavior.

When a pull request is created, Tailwind CSS maintainers will be notified automatically.

## Communication

- **GitHub discussions**: For feature ideas and general questions
- **GitHub issues**: For bug reports
- **GitHub pull requests**: For code contributions
