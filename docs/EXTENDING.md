# Extending Tailwind In This Repository

This guide is for changes that add behavior, reshape APIs, or move logic between layers. In Tailwind, those changes are easiest to review when the owning package is obvious.

## Choose the right layer first

The most common mistake in this repo is fixing an adapter bug in core or fixing a core bug in an adapter. Start from the layer that actually decides the behavior.

| Change type | Best starting point |
| --- | --- |
| New CSS directive, variant behavior, or utility generation | [../packages/tailwindcss/src/index.ts](../packages/tailwindcss/src/index.ts) |
| Plugin API additions or compatibility hooks | [../packages/tailwindcss/src/plugin.ts](../packages/tailwindcss/src/plugin.ts), [../packages/tailwindcss/src/compat/plugin-api.ts](../packages/tailwindcss/src/compat/plugin-api.ts) |
| Config resolution, module loading, or source maps | [../packages/@tailwindcss-node](../packages/@tailwindcss-node) |
| PostCSS-only behavior | [../packages/@tailwindcss-postcss](../packages/@tailwindcss-postcss) |
| Vite-only behavior or HMR | [../packages/@tailwindcss-vite](../packages/@tailwindcss-vite) |
| Candidate scanning or filesystem performance | [../crates/oxide](../crates/oxide), [../crates/node](../crates/node) |
| Upgrade or migration flows | [../packages/@tailwindcss-upgrade](../packages/@tailwindcss-upgrade) |

## Plugin API basics

The public plugin entry point is exported from [../packages/tailwindcss/src/plugin.ts](../packages/tailwindcss/src/plugin.ts). The underlying API surface is implemented in [../packages/tailwindcss/src/compat/plugin-api.ts](../packages/tailwindcss/src/compat/plugin-api.ts).

That is the place to look when a plugin-facing behavior changes or when compatibility behavior differs from older Tailwind versions.

Supported extension hooks include methods such as `addVariant`, `matchVariant`, `addUtilities`, `matchUtilities`, and `theme`.

Example:

```ts
import plugin from 'tailwindcss/plugin'

export default plugin.withOptions(
  function withOptions(options: { prefix?: string } = {}) {
    let prefix = options.prefix ?? 'app'

    return function ({ addVariant, addUtilities, theme }) {
      addVariant(`${prefix}-hocus`, ['&:hover', '&:focus'])

      addUtilities({
        [`.${prefix}-content-auto`]: {
          contentVisibility: 'auto',
        },
        [`.${prefix}-grid-fill`]: {
          gridTemplateColumns: `repeat(auto-fill, minmax(${theme('spacing.48')}, 1fr))`,
        },
      })
    }
  },
)
```

The internal sample plugin in [../packages/internal-example-plugin](../packages/internal-example-plugin) is deliberately small. It is useful as a smoke-test reference, not as complete API documentation.

## Adding new compiler behavior

When a feature changes how Tailwind interprets CSS directives or generates utilities:

1. Start in [../packages/tailwindcss/src/index.ts](../packages/tailwindcss/src/index.ts) or the nearest focused module.
2. Keep syntax parsing, design-system state, and CSS emission separate where possible.
3. Add focused unit coverage near the touched module if the repository already follows that pattern.
4. Add at least one adapter-level integration test so the feature is exercised through a real package boundary.

## Changing scanning behavior

If your feature affects candidate discovery, roots, ignore behavior, or performance:

1. Inspect [../crates/oxide](../crates/oxide) first.
2. Update the Node binding in [../crates/node](../crates/node) only when the Rust API surface changes.
3. Verify behavior in [../integrations/oxide](../integrations/oxide) and then in one adapter integration suite.

Scanner changes often have cross-platform implications, so request a full CI matrix for pull requests that touch Rust or bindings.

## Adapter-specific work

If a change is specific to PostCSS, Vite, or Webpack, avoid patching core first. Tailwind's adapters do real work around caching, rebuilds, module loading, and toolchain conventions.

- PostCSS cache/rebuild logic lives in [../packages/@tailwindcss-postcss/src/index.ts](../packages/@tailwindcss-postcss/src/index.ts)
- Vite transform and HMR behavior lives in [../packages/@tailwindcss-vite/src/index.ts](../packages/@tailwindcss-vite/src/index.ts)
- Webpack plugin behavior lives in [../packages/@tailwindcss-webpack/src/index.ts](../packages/@tailwindcss-webpack/src/index.ts)

## Extension checklist

- Update or add tests in the closest relevant suite.
- Document contributor-facing workflow changes in [../README.md](../README.md) or the docs in this folder.
- If a feature changes installation or migration messaging, verify [../packages/@tailwindcss-upgrade](../packages/@tailwindcss-upgrade) and [../integrations/upgrade](../integrations/upgrade).
- If a feature changes emitted CSS or source maps, verify at least one build-tool integration plus CLI behavior.

Before sending a PR, ask whether the change reads like a focused fix or like the start of a larger redesign. Tailwind maintainers are much more likely to merge the former.

## Related guides

- [Architecture overview](ARCHITECTURE.md)
- [Testing guide](TESTING.md)
- [Contributing guide](../.github/CONTRIBUTING.md)