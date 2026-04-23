# Architecture Overview

Tailwind v4 in this repository is not one package. Most behavior crosses at least three layers:

- an adapter or CLI entry point receives a CSS request
- `@tailwindcss/node` turns that request into compile work
- the compiler and oxide scanner decide what CSS to emit

That is why a bug that looks like “Tailwind output is wrong” might actually live in a bundler adapter, config loading, source maps, or scanning.

## Repository map

| Path | Role |
| --- | --- |
| [packages/tailwindcss](../packages/tailwindcss) | Core compiler, CSS assets, plugin API, theme and utility generation |
| [packages/@tailwindcss-node](../packages/@tailwindcss-node) | Node runtime helpers, module loading, compile/optimize wrappers, source map helpers |
| [packages/@tailwindcss-postcss](../packages/@tailwindcss-postcss) | PostCSS adapter and caching layer |
| [packages/@tailwindcss-vite](../packages/@tailwindcss-vite) | Vite adapter, dev-server integration, HMR-aware generation |
| [packages/@tailwindcss-webpack](../packages/@tailwindcss-webpack) | Webpack adapter |
| [packages/@tailwindcss-cli](../packages/@tailwindcss-cli) | CLI entry points |
| [packages/@tailwindcss-upgrade](../packages/@tailwindcss-upgrade) | Upgrade assistant and codemods |
| [crates/oxide](../crates/oxide) | Rust scanner and filesystem traversal used to discover class candidates |
| [crates/node](../crates/node) | N-API bridge that exposes oxide to Node |
| [integrations](../integrations) | Cross-package integration tests against real toolchains |

## The usual request path

1. An adapter, the CLI, or the standalone binary starts with a CSS entry file.
   Good entry points: [packages/@tailwindcss-postcss/src/index.ts](../packages/@tailwindcss-postcss/src/index.ts), [packages/@tailwindcss-vite/src/index.ts](../packages/@tailwindcss-vite/src/index.ts), [packages/@tailwindcss-webpack/src/index.ts](../packages/@tailwindcss-webpack/src/index.ts), [packages/@tailwindcss-cli](../packages/@tailwindcss-cli)
2. `@tailwindcss/node` loads config, resolves modules, prepares source maps, and calls into the compiler.
   Good entry point: [packages/@tailwindcss-node/src/index.ts](../packages/@tailwindcss-node/src/index.ts)
3. The compiler parses directives such as `@import`, `@theme`, `@utility`, `@variant`, `@plugin`, and `@config`, then builds the design system and generation plan.
   Good entry points: [packages/tailwindcss/src/index.ts](../packages/tailwindcss/src/index.ts), [packages/tailwindcss/src/design-system.ts](../packages/tailwindcss/src/design-system.ts), [packages/tailwindcss/src/compile.ts](../packages/tailwindcss/src/compile.ts)
4. Oxide discovers candidate class names and source files.
   Good entry points: [crates/oxide](../crates/oxide), [crates/node](../crates/node)
5. The result comes back through the adapter, which may also optimize output with Lightning CSS and write source maps.
   Good entry points: [packages/tailwindcss/src/source-maps/source-map.ts](../packages/tailwindcss/src/source-maps/source-map.ts), [packages/@tailwindcss-postcss/src/index.ts](../packages/@tailwindcss-postcss/src/index.ts)

## Where bugs usually live

| If you want to change... | Start here | Then verify in... |
| --- | --- | --- |
| CSS directive parsing or utility generation | [packages/tailwindcss/src/index.ts](../packages/tailwindcss/src/index.ts) | [integrations/postcss](../integrations/postcss), [integrations/vite](../integrations/vite), [integrations/webpack](../integrations/webpack) |
| Plugin API or compatibility behavior | [packages/tailwindcss/src/plugin.ts](../packages/tailwindcss/src/plugin.ts), [packages/tailwindcss/src/compat/plugin-api.ts](../packages/tailwindcss/src/compat/plugin-api.ts) | [integrations/postcss/plugins.test.ts](../integrations/postcss/plugins.test.ts), [packages/internal-example-plugin](../packages/internal-example-plugin) |
| File scanning, glob behavior, or performance hot paths | [crates/oxide](../crates/oxide), [crates/node](../crates/node) | [crates/oxide/tests](../crates/oxide/tests), [integrations/oxide](../integrations/oxide) |
| Node resolution, config loading, or source maps | [packages/@tailwindcss-node](../packages/@tailwindcss-node) | [integrations/cli](../integrations/cli), [integrations/postcss](../integrations/postcss), [integrations/vite](../integrations/vite) |
| Vite-specific behavior or HMR | [packages/@tailwindcss-vite/src/index.ts](../packages/@tailwindcss-vite/src/index.ts) | [integrations/vite](../integrations/vite) |
| PostCSS-specific behavior or incremental rebuilds | [packages/@tailwindcss-postcss/src/index.ts](../packages/@tailwindcss-postcss/src/index.ts) | [integrations/postcss](../integrations/postcss) |
| Upgrade logic or migration messages | [packages/@tailwindcss-upgrade](../packages/@tailwindcss-upgrade) | [integrations/upgrade](../integrations/upgrade) |

## Useful mental shortcuts

- If a bug only reproduces through one toolchain, it is often adapter code, not compiler core.
- If classes are missing entirely, oxide is usually worth checking before touching utility generation.
- If CSS looks correct but file paths, config loading, or source maps are wrong, start in `@tailwindcss/node`.
- If a change affects generated CSS semantics, prove it once in a focused test and once through a real adapter path.
- Avoid moving logic down into shared layers unless multiple entry points genuinely need it.

## Related guides

- [Build and development](BUILD.md)
- [Extending the repository](EXTENDING.md)
- [Testing guide](TESTING.md)