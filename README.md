<p align="center">
  <a href="https://tailwindcss.com" target="_blank">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/tailwindlabs/tailwindcss/HEAD/.github/logo-dark.svg">
      <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/tailwindlabs/tailwindcss/HEAD/.github/logo-light.svg">
      <img alt="Tailwind CSS" src="https://raw.githubusercontent.com/tailwindlabs/tailwindcss/HEAD/.github/logo-light.svg" width="350" height="70" style="max-width: 100%;">
    </picture>
  </a>
</p>

<p align="center">
  A utility-first CSS framework for rapidly building custom user interfaces.
</p>

<p align="center">
    <a href="https://github.com/tailwindlabs/tailwindcss/actions"><img src="https://img.shields.io/github/actions/workflow/status/tailwindlabs/tailwindcss/ci.yml?branch=main" alt="Build Status"></a>
    <a href="https://www.npmjs.com/package/tailwindcss"><img src="https://img.shields.io/npm/dt/tailwindcss.svg" alt="Total Downloads"></a>
    <a href="https://github.com/tailwindlabs/tailwindcss/releases"><img src="https://img.shields.io/npm/v/tailwindcss.svg" alt="Latest Release"></a>
    <a href="https://github.com/tailwindlabs/tailwindcss/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/tailwindcss.svg" alt="License"></a>
</p>

---

## Documentation

For full documentation, visit [tailwindcss.com](https://tailwindcss.com).

## Working On This Repository

If you are here to change Tailwind itself rather than use it in an app, it helps to think about the repository in three pieces:

- [packages/tailwindcss](packages/tailwindcss) is the compiler and CSS generation core.
- [packages/@tailwindcss-node](packages/@tailwindcss-node), [packages/@tailwindcss-postcss](packages/@tailwindcss-postcss), [packages/@tailwindcss-vite](packages/@tailwindcss-vite), and [packages/@tailwindcss-webpack](packages/@tailwindcss-webpack) are the adapter layer.
- [crates/oxide](crates/oxide) and [crates/node](crates/node) are the Rust scanner and Node bridge.

Most accepted changes stay inside one of those layers and come with the smallest test slice that proves the behavior.

The repo-specific guides live here:

- [Architecture overview](docs/ARCHITECTURE.md) for package ownership and request flow.
- [Build and development](docs/BUILD.md) for setup, daily commands, and local build behavior.
- [Extending Tailwind in this repository](docs/EXTENDING.md) for deciding whether a change belongs in core, an adapter, or oxide.
- [Testing guide](docs/TESTING.md) for how the unit, integration, UI, and Rust suites fit together.
- [Local runbook](docs/RUNBOOK.md) for the shortest command path after a change.
- [Troubleshooting](docs/TROUBLESHOOTING.md) for common Windows, Bun, Playwright, and Rust setup issues.

## Local Setup

Run commands from the repository root:

```sh
corepack enable
pnpm install
rustup toolchain install 1.85.0
rustup target add wasm32-wasip1-threads --toolchain 1.85.0
pnpm run check:env
pnpm build
pnpm test
```

The repository pins Rust 1.85.0 in [rust-toolchain.toml](rust-toolchain.toml), so you do not need to change your global Rust default.

If your shell cannot see Rust yet, run `pnpm run check:env` before the full build. That is a fast preflight for Cargo, Rustup, and the required WASM target.

## What To Run After A Change

Common local loops in this repo are:

```sh
pnpm build && pnpm test:integrations
pnpm build && pnpm test:ui
pnpm build && pnpm vite
pnpm build && pnpm nextjs
```

The Vite playground requires Bun. If you changed emitted CSS, rebuild first and then open either the Vite or Next.js playground so you can see the output in a real app flow.

If you want the exact minimum command set for a compiler, adapter, scanner, or CLI change, use [docs/RUNBOOK.md](docs/RUNBOOK.md).

## Repository Layout

- [packages/tailwindcss](packages/tailwindcss) contains the compiler, variant handling, utilities, and CSS assets.
- [packages/@tailwindcss-cli](packages/@tailwindcss-cli) and [packages/@tailwindcss-standalone](packages/@tailwindcss-standalone) cover the command-line entry points.
- [packages/@tailwindcss-node](packages/@tailwindcss-node) owns config loading, source maps, and the bridge between adapters and core.
- [integrations](integrations) exercises built packages the way real consumers use them.
- [playgrounds](playgrounds) is the fastest way to eyeball an actual app after a change.

## Community

For help, discussion about best practices, or feature ideas:

[Discuss Tailwind CSS on GitHub](https://github.com/tailwindlabs/tailwindcss/discussions)

## Contributing

If you're interested in contributing to Tailwind CSS, please read our [contributing docs](.github/CONTRIBUTING.md) **before submitting a pull request**.
