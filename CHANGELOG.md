# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- _Experimental_: Add `details-content` variant ([#15319](https://github.com/tailwindlabs/tailwindcss/pull/15319))
- _Experimental_: Add `inverted-colors` variant ([#11693](https://github.com/tailwindlabs/tailwindcss/pull/11693))
- _Experimental_: Add `scripting`, `scripting-none`, and `scripting-initial` variants ([#11929](https://github.com/tailwindlabs/tailwindcss/pull/11929))
- _Experimental_: Add `pointer-none`, `pointer-coarse`, and `pointer-fine` variant ([#16946](https://github.com/tailwindlabs/tailwindcss/pull/16946))
- _Experimental_: Add `any-pointer-none`, `any-pointer-coarse`, and `any-pointer-fine` variants ([#16941](https://github.com/tailwindlabs/tailwindcss/pull/16941))
- _Experimental_: Add `user-valid` and `user-invalid` variants ([#12370](https://github.com/tailwindlabs/tailwindcss/pull/12370))
- _Experimental_: Add `wrap-anywhere`, `wrap-break-word`, and `wrap-normal` utilities ([#12128](https://github.com/tailwindlabs/tailwindcss/pull/12128))

### Fixed

- Fix `haml` pre-processing ([#17051](https://github.com/tailwindlabs/tailwindcss/pull/17051))

## [4.0.12] - 2025-03-07

### Fixed

- Vite: Fix `url(…)` rebasing in transitively imported CSS files ([#16965](https://github.com/tailwindlabs/tailwindcss/pull/16965))
- PostCSS: Rebase `url(…)`s in imported CSS files ([#16965](https://github.com/tailwindlabs/tailwindcss/pull/16965))
- Ensure utilities are sorted based on their actual property order ([#16995](https://github.com/tailwindlabs/tailwindcss/pull/16995))
- Ensure strings in Pug and Slim templates are handled correctly ([#17000](https://github.com/tailwindlabs/tailwindcss/pull/17000))
- Ensure classes between `}` and `{` are properly extracted ([#17001](https://github.com/tailwindlabs/tailwindcss/pull/17001))
- Fix `razor`/`cshtml` pre-processing ([#17027](https://github.com/tailwindlabs/tailwindcss/pull/17027))
- Ensure extracting candidates from JS embedded in a PHP string works as expected ([#17031](https://github.com/tailwindlabs/tailwindcss/pull/17031))

## [4.0.11] - 2025-03-06

### Fixed

- Ensure classes containing `--` are extracted correctly ([#16972](https://github.com/tailwindlabs/tailwindcss/pull/16972))
- Ensure classes containing numbers followed by dash or underscore are extracted correctly ([#16980](https://github.com/tailwindlabs/tailwindcss/pull/16980))
- Ensure arbitrary container queries are extracted correctly ([#16984](https://github.com/tailwindlabs/tailwindcss/pull/16984))
- Ensure classes ending in `[` are extracted in Slim templating language ([#16985](https://github.com/tailwindlabs/tailwindcss/pull/16985))
- Ensure arbitrary variables with data types are extracted correctly ([#16986](https://github.com/tailwindlabs/tailwindcss/pull/16986))

## [4.0.10] - 2025-03-05

### Added

- Add `col-<number>` and `row-<number>` utilities for `grid-column` and `grid-row` ([#15183](https://github.com/tailwindlabs/tailwindcss/pull/15183))

### Fixed

- Ensure `not-*` does not remove `:is(…)` from variants ([#16825](https://github.com/tailwindlabs/tailwindcss/pull/16825))
- Ensure `@keyframes` are correctly emitted when using a prefix ([#16850](https://github.com/tailwindlabs/tailwindcss/pull/16850))
- Don't swallow `@utility` declarations when `@apply` is used in nested rules ([#16940](https://github.com/tailwindlabs/tailwindcss/pull/16940))
- Ensure `outline-hidden` behaves like `outline-none` outside of forced colors mode ([#16943](https://github.com/tailwindlabs/tailwindcss/pull/16943))
- Allow `!important` on CSS variables again ([#16873](https://github.com/tailwindlabs/tailwindcss/pull/16873))
- Vite: Do not crash when encountering an `.svg` file with `#` or `?` in the filename ([#16957](https://github.com/tailwindlabs/tailwindcss/pull/16957))
- Ensure utilities are properly detected within square brackets ([#16306](https://github.com/tailwindlabs/tailwindcss/pull/16306))
- Ensure utilities are properly detected using Angular's conditional class binding syntax ([#16306](https://github.com/tailwindlabs/tailwindcss/pull/16306))
- Ensure utilities starting with numbers are properly extracted from Slim templates ([#16306](https://github.com/tailwindlabs/tailwindcss/pull/16306))
- Discard arbitrary property candidates that have guaranteed-invalid property names ([#16306](https://github.com/tailwindlabs/tailwindcss/pull/16306))

### Changed

- Removed `max-w-auto` and `max-h-auto` utilities as they generate invalid CSS ([#16917](https://github.com/tailwindlabs/tailwindcss/pull/16917))
- Replaced the existing candidate extractor with a brand new extractor to improve maintainability, correctness, and performance ([#16306](https://github.com/tailwindlabs/tailwindcss/pull/16306))

## [4.0.9] - 2025-02-25

### Fixed

- Make JS APIs available to plugins and configs in the Standalone CLI ([#15934](https://github.com/tailwindlabs/tailwindcss/pull/15934))
- Vite: Don't crash when importing a virtual module from JavaScript that ends in `.css` ([#16780](https://github.com/tailwindlabs/tailwindcss/pull/16780))
- Fix an issue where `@reference "…"` would sometimes omit keyframe animations ([#16774](https://github.com/tailwindlabs/tailwindcss/pull/16774))
- Ensure `z-*!` utilities are properly marked as `!important` ([#16795](https://github.com/tailwindlabs/tailwindcss/pull/16795))
- Read UTF-8 CSS files that start with a byte-order mark (BOM) ([#16800](https://github.com/tailwindlabs/tailwindcss/pull/16800))
- Ensure nested functions in selectors used with JavaScript plugins are not truncated ([#16802](https://github.com/tailwindlabs/tailwindcss/pull/16802))

### Changed

- Emit variable fallbacks when using `@reference "…"` instead of duplicate CSS variable declarations ([#16774](https://github.com/tailwindlabs/tailwindcss/pull/16774))

## [4.0.8] - 2025-02-21

### Added

- Allow `@import` with `theme(…)` options for stylesheets that contain more than just `@theme` rules ([#16514](https://github.com/tailwindlabs/tailwindcss/pull/16514))

### Fixed

- Don't add `!important` to CSS variable declarations when using the important modifier ([#16668](https://github.com/tailwindlabs/tailwindcss/pull/16668))
- Vite: Ignore files and directories specified in your `.gitignore` file when using automatic source detection([#16631](https://github.com/tailwindlabs/tailwindcss/pull/16631))
- Vite: Don't rely on the module graph for detecting candidates to ensure setups with multiple Vite builds work as expected ([#16631](https://github.com/tailwindlabs/tailwindcss/pull/16631))
- Vite: Ensure Astro production builds always contain classes used in client-only components ([#16631](https://github.com/tailwindlabs/tailwindcss/pull/16631))
- Vite: Always scan raw file contents for utility classes before any other transforms have been applied to ensure utility classes are scanned without any additional escaping ([#16631](https://github.com/tailwindlabs/tailwindcss/pull/16631))
- Ensure utilities with more declarations are always sorted before utilities with fewer declarations when utilities only define CSS variables ([#16715](https://github.com/tailwindlabs/tailwindcss/pull/16715))
- Only include `translate-z-px` utilities once in compiled CSS ([#16718](https://github.com/tailwindlabs/tailwindcss/pull/16718))

### Changed

- Don't include theme variables that aren't used in compiled CSS ([#16211](https://github.com/tailwindlabs/tailwindcss/pull/16211), [#16676](https://github.com/tailwindlabs/tailwindcss/pull/16676))

## [4.0.7] - 2025-02-18

### Fixed

- Export `tailwindcss/lib/util/flattenColorPalette.js` for backward compatibility ([#16411](https://github.com/tailwindlabs/tailwindcss/pull/16411))
- Fix sorting of numeric utility suggestions when they have different magnitudes ([#16414](https://github.com/tailwindlabs/tailwindcss/pull/16414))
- Show suggestions for fractions in IntelliSense ([#16353](https://github.com/tailwindlabs/tailwindcss/pull/16353))
- Don’t replace `_` in suggested theme keys ([#16433](https://github.com/tailwindlabs/tailwindcss/pull/16433))
- Ensure `--default-outline-width` can be used to change the `outline-width` value of the `outline` utility ([#16469](https://github.com/tailwindlabs/tailwindcss/pull/16469))
- Ensure drop shadow utilities don't inherit unexpectedly ([#16471](https://github.com/tailwindlabs/tailwindcss/pull/16471))
- Export config and plugin types from `tailwindcss/plugin` for backward compatibility ([#16505](https://github.com/tailwindlabs/tailwindcss/pull/16505))
- Ensure JavaScript plugins that emit nested rules referencing the utility name work as expected ([#16539](https://github.com/tailwindlabs/tailwindcss/pull/16539))
- Statically link Visual Studio redistributables in `@tailwindcss/oxide` Windows builds ([#16602](https://github.com/tailwindlabs/tailwindcss/pull/16602))
- Ensure that Next.js splat routes are scanned for classes ([#16457](https://github.com/tailwindlabs/tailwindcss/pull/16457))
- Pin exact version of `tailwindcss` in `@tailwindcss/*` packages ([#16623](https://github.com/tailwindlabs/tailwindcss/pull/16623))
- Upgrade: Report errors when updating dependencies ([#16504](https://github.com/tailwindlabs/tailwindcss/pull/16504))
- Upgrade: Ensure a `darkMode` JS config setting with block syntax converts to use `@slot` ([#16507](https://github.com/tailwindlabs/tailwindcss/pull/16507))
- Upgrade: Ensure the latest version of `tailwindcss` and `@tailwindcss/postcss` are installed when upgrading ([#16620](https://github.com/tailwindlabs/tailwindcss/pull/16620))

## [4.0.6] - 2025-02-10

### Fixed

- Revert change to no longer include theme variables that aren't used in compiled CSS ([#16403](https://github.com/tailwindlabs/tailwindcss/pull/16403))
- Upgrade: Don't migrate `blur` to `blur-sm` when used with Next.js `<Image placeholder="blur" />` ([#16405](https://github.com/tailwindlabs/tailwindcss/pull/16405))

## [4.0.5] - 2025-02-08

### Added

- Add `@theme static` option for always including theme variables in compiled CSS ([#16211](https://github.com/tailwindlabs/tailwindcss/pull/16211))

### Fixed

- Remove rogue `console.log` from `@tailwindcss/vite` ([#16307](https://github.com/tailwindlabs/tailwindcss/pull/16307))

### Changed

- Don't include theme variables that aren't used in compiled CSS ([#16211](https://github.com/tailwindlabs/tailwindcss/pull/16211))

## [4.0.4] - 2025-02-06

### Fixed

- Fix a crash when setting JS theme values to `null` ([#16210](https://github.com/tailwindlabs/tailwindcss/pull/16210))
- Ensure escaped underscores in CSS variables in arbitrary values are properly unescaped ([#16206](https://github.com/tailwindlabs/tailwindcss/pull/16206))
- Ensure that the `containers` JS theme key is added to the `--container-*` namespace ([#16169](https://github.com/tailwindlabs/tailwindcss/pull/16169))
- Ensure theme `@keyframes` are generated even if an `--animation-*` variable spans multiple lines ([#16237](https://github.com/tailwindlabs/tailwindcss/pull/16237))
- Vite: Skip parsing stylesheets with the `?commonjs-proxy` flag ([#16238](https://github.com/tailwindlabs/tailwindcss/pull/16238))
- Fix `order-first` and `order-last` for Firefox ([#16266](https://github.com/tailwindlabs/tailwindcss/pull/16266))
- Fix support for older instruction sets on Linux x64 builds of the standalone CLI ([#16244](https://github.com/tailwindlabs/tailwindcss/pull/16244))
- Ensure `NODE_PATH` is respected when resolving JavaScript and CSS files ([#16274](https://github.com/tailwindlabs/tailwindcss/pull/16274))
- Ensure Node addons are packaged correctly with FreeBSD builds ([#16277](https://github.com/tailwindlabs/tailwindcss/pull/16277))
- Fix an issue where `@variant` inside a referenced stylesheet could cause a stack overflow ([#16300](https://github.com/tailwindlabs/tailwindcss/pull/16300))

## [4.0.3] - 2025-02-01

### Fixed

- Fix incorrect removal of `@import url();` ([#16144](https://github.com/tailwindlabs/tailwindcss/pull/16144))

## [4.0.2] - 2025-01-31

### Fixed

- Only generate positive `grid-cols-*` and `grid-rows-*` utilities ([#16020](https://github.com/tailwindlabs/tailwindcss/pull/16020))
- Ensure escaped theme variables are handled correctly ([#16064](https://github.com/tailwindlabs/tailwindcss/pull/16064))
- Ensure we process Tailwind CSS features when only using `@reference` or `@variant` ([#16057](https://github.com/tailwindlabs/tailwindcss/pull/16057))
- Refactor gradient implementation to work around [prettier/prettier#17058](https://github.com/prettier/prettier/issues/17058) ([#16072](https://github.com/tailwindlabs/tailwindcss/pull/16072))
- Vite: Ensure hot-reloading works with SolidStart setups ([#16052](https://github.com/tailwindlabs/tailwindcss/pull/16052))
- Vite: Fix a crash when starting the development server in SolidStart setups ([#16052](https://github.com/tailwindlabs/tailwindcss/pull/16052))
- Vite: Don't rebase URLs that appear to be aliases ([#16078](https://github.com/tailwindlabs/tailwindcss/pull/16078))
- Vite: Transform `<style>` blocks in HTML files ([#16069](https://github.com/tailwindlabs/tailwindcss/pull/16069))
- Prevent camel-casing CSS custom properties added by JavaScript plugins ([#16103](https://github.com/tailwindlabs/tailwindcss/pull/16103))
- Do not emit `@keyframes` in `@theme reference` ([#16120](https://github.com/tailwindlabs/tailwindcss/pull/16120))
- Discard invalid declarations when parsing CSS ([#16093](https://github.com/tailwindlabs/tailwindcss/pull/16093))
- Do not emit empty CSS rules and at-rules ([#16121](https://github.com/tailwindlabs/tailwindcss/pull/16121))
- Handle `@variant` when at the top-level of a stylesheet ([#16129](https://github.com/tailwindlabs/tailwindcss/pull/16129))

## [4.0.1] - 2025-01-29

### Added

- Include `:open` pseudo-class in existing `open` variant ([#15349](https://github.com/tailwindlabs/tailwindcss/pull/15349))

### Fixed

- Remove invalid `min-w/h-none` utilities ([#15845](https://github.com/tailwindlabs/tailwindcss/pull/15845))
- Discard CSS variable shorthand utilities that don't use valid CSS variables ([#15738](https://github.com/tailwindlabs/tailwindcss/pull/15738))
- Ensure font-size utilities with `none` modifier have a line-height set e.g. `text-sm/none` ([#15921](https://github.com/tailwindlabs/tailwindcss/pull/15921))
- Ensure font-size utilities with unknown modifier don't generate CSS ([#15921](https://github.com/tailwindlabs/tailwindcss/pull/15921))
- Don’t suggest font weight utilities more than once ([#15857](https://github.com/tailwindlabs/tailwindcss/pull/15857))
- Suggest container query variants ([#15857](https://github.com/tailwindlabs/tailwindcss/pull/15857))
- Disable bare value suggestions when not using the `--spacing` variable ([#15857](https://github.com/tailwindlabs/tailwindcss/pull/15857))
- Ensure suggested classes are properly sorted ([#15857](https://github.com/tailwindlabs/tailwindcss/pull/15857))
- Don’t look at .gitignore files outside initialized repos ([#15941](https://github.com/tailwindlabs/tailwindcss/pull/15941))
- Find utilities when using the Svelte class shorthand syntax across multiple lines ([#15974](https://github.com/tailwindlabs/tailwindcss/pull/15974))
- Find utilities when using the Angular class shorthand syntax ([#15974](https://github.com/tailwindlabs/tailwindcss/pull/15974))
- Find utilities when using functions inside arrays ([#15974](https://github.com/tailwindlabs/tailwindcss/pull/15974))
- Ensure that `@tailwindcss/browser` does not pollute the global namespace ([#15978](https://github.com/tailwindlabs/tailwindcss/pull/15978))
- Ensure that `tailwind-merge` is not scanned when using the Vite plugin ([#16005](https://github.com/tailwindlabs/tailwindcss/pull/16005))
- Ensure CSS theme variables are available within shadow roots ([#15975](https://github.com/tailwindlabs/tailwindcss/pull/15975))
- Fix crash when project lives in the `/` directory ([#15988](https://github.com/tailwindlabs/tailwindcss/pull/15988))
- Ensure custom variants have a non-empty selector list ([#16009](https://github.com/tailwindlabs/tailwindcss/pull/16009))
- _Upgrade_: Ensure JavaScript config files on different drives are correctly migrated ([#15927](https://github.com/tailwindlabs/tailwindcss/pull/15927))
- _Upgrade_: Migrate `leading-[1]` to `leading-none` ([#16004](https://github.com/tailwindlabs/tailwindcss/pull/16004))
- _Upgrade_: Do not migrate arbitrary leading utilities to bare values ([#16004](https://github.com/tailwindlabs/tailwindcss/pull/16004))

## [4.0.0] - 2025-01-21

### Added

- [New high-performance engine](https://tailwindcss.com/blog/tailwindcss-v4#new-high-performance-engine) — where full builds are up to 5x faster, and incremental builds are over 100x faster — and measured in microseconds.
- [Designed for the modern web](https://tailwindcss.com/blog/tailwindcss-v4#designed-for-the-modern-web) — built on cutting-edge CSS features like cascade layers, registered custom properties with `@property`, and `color-mix()`.
- [Simplified installation](https://tailwindcss.com/blog/tailwindcss-v4#simplified-installation) — fewer dependencies, zero configuration, and just a single line of code in your CSS file.
- [First-party Vite plugin](https://tailwindcss.com/blog/tailwindcss-v4#first-party-vite-plugin) — tight integration for maximum performance and minimum configuration.
- [Automatic content detection](https://tailwindcss.com/blog/tailwindcss-v4#automatic-content-detection) — all of your template files are discovered automatically, with no configuration required.
- [Built-in import support](https://tailwindcss.com/blog/tailwindcss-v4#built-in-import-support) — no additional tooling necessary to bundle multiple CSS files.
- [CSS-first configuration](https://tailwindcss.com/blog/tailwindcss-v4#css-first-configuration) — a reimagined developer experience where you customize and extend the framework directly in CSS instead of a JavaScript configuration file.
- [CSS theme variables](https://tailwindcss.com/blog/tailwindcss-v4#css-theme-variables) — all of your design tokens exposed as native CSS variables so you can access them anywhere.
- [Dynamic utility values and variants](https://tailwindcss.com/blog/tailwindcss-v4#dynamic-utility-values-and-variants) — stop guessing what values exist in your spacing scale, or extending your configuration for things like basic data attributes.
- [Modernized P3 color palette](https://tailwindcss.com/blog/tailwindcss-v4#modernized-p3-color-palette) — a redesigned, more vivid color palette that takes full advantage of modern display technology.
- [Container queries](https://tailwindcss.com/blog/tailwindcss-v4#container-queries) — first-class APIs for styling elements based on their container size, no plugins required.
- [New 3D transform utilities](https://tailwindcss.com/blog/tailwindcss-v4#new-3d-transform-utilities) — transform elements in 3D space directly in your HTML.
- [Expanded gradient APIs](https://tailwindcss.com/blog/tailwindcss-v4#expanded-gradient-apis) — radial and conic gradients, interpolation modes, and more.
- [@starting-style support](https://tailwindcss.com/blog/tailwindcss-v4#starting-style-support) — a new variant you can use to create enter and exit transitions, without the need for JavaScript.
- [not-\* variant](https://tailwindcss.com/blog/tailwindcss-v4#not-variant) — style an element only when it doesn't match another variant, custom selector, or media or feature query.
- [Even more new utilities and variants](https://tailwindcss.com/blog/tailwindcss-v4#even-more-new-utilities-and-variants) — including support for `color-scheme`, `field-sizing`, complex shadows, `inert`, and more.

Start using Tailwind CSS v4.0 today by [installing it in a new project](https://tailwindcss.com/docs/installation/), or playing with it directly in the browser on [Tailwind Play](https://play.tailwindcss.com/).

For existing projects, we've published a comprehensive [upgrade guide](https://tailwindcss.com/docs/upgrade-guide) and built an [automated upgrade tool](https://tailwindcss.com/docs/upgrade-guide#using-the-upgrade-tool) to get you on the latest version as quickly and painlessly as possible.

For a deep-dive into everything that's new, [check out the announcement post](https://tailwindcss.com/blog/tailwindcss-v4).

## [4.0.0-beta.10] - 2025-01-21

### Added

- Add support for using `@variant` to use variants in your CSS ([#15663](https://github.com/tailwindlabs/tailwindcss/pull/15663))
- Include `outline-color` when transitioning colors ([#15690](https://github.com/tailwindlabs/tailwindcss/pull/15690))

### Fixed

- Add missing `main` and `browser` fields for `@tailwindcss/browser` ([#15594](https://github.com/tailwindlabs/tailwindcss/pull/15594))
- Support escaping `*` in theme namespace syntax (e.g.: `--color-\*: initial;`) ([#15603](https://github.com/tailwindlabs/tailwindcss/pull/15603))
- Respect `@theme` options when resolving values in custom functional utilities ([#15623](https://github.com/tailwindlabs/tailwindcss/pull/15623))
- Discard invalid variants (e.g. `data-checked-[selected=1]:*`) ([#15629](https://github.com/tailwindlabs/tailwindcss/pull/15629))
- Ensure `-outline-offset-*` utilities are suggested in IntelliSense ([#15646](https://github.com/tailwindlabs/tailwindcss/pull/15646))
- Write to `stdout` when `--output` is set to `-` or omitted with `@tailwindcss/cli` ([#15656](https://github.com/tailwindlabs/tailwindcss/pull/15656))
- Prevent `not-*` from being used with variants that have multiple sibling rules ([#15689](https://github.com/tailwindlabs/tailwindcss/pull/15689))
- _Upgrade (experimental)_: Pretty print `--spacing(…)` to prevent ambiguity ([#15596](https://github.com/tailwindlabs/tailwindcss/pull/15596))

### Changed

- Use more modern `--alpha(color / 50%)` syntax instead of `--alpha(color, 50%)` ([#15665](https://github.com/tailwindlabs/tailwindcss/pull/15665))
- Rename `@variant` to `@custom-variant` ([#15663](https://github.com/tailwindlabs/tailwindcss/pull/15663))
- Change `outline-hidden` to set `outline-style: none` except in forced colors mode ([#15690](https://github.com/tailwindlabs/tailwindcss/pull/15690))

## [4.0.0-beta.9] - 2025-01-09

### Added

- Add `@tailwindcss/browser` package to run Tailwind CSS in the browser ([#15558](https://github.com/tailwindlabs/tailwindcss/pull/15558))
- Add `@reference "…"` API as a replacement for the previous `@import "…" reference` option ([#15565](https://github.com/tailwindlabs/tailwindcss/pull/15565))
- Add support for defining functional utilities in CSS ([#15455](https://github.com/tailwindlabs/tailwindcss/pull/15455))
- Add new `--spacing(…)`, `--alpha(…)`, and `--theme(…)` CSS functions ([#15572](https://github.com/tailwindlabs/tailwindcss/pull/15572))
- Add musl-based Linux builds of the standalone CLI ([#15567](https://github.com/tailwindlabs/tailwindcss/pull/15567))
- Improve performance of internal AST manipulations ([#15529](https://github.com/tailwindlabs/tailwindcss/pull/15529))

### Fixed

- Use the correct property value for `place-content-between`, `place-content-around`, and `place-content-evenly` utilities ([#15440](https://github.com/tailwindlabs/tailwindcss/pull/15440))
- Don’t detect arbitrary properties when preceded by an escape ([#15456](https://github.com/tailwindlabs/tailwindcss/pull/15456))
- Fix incorrectly named `bg-round` and `bg-space` utilities to `bg-repeat-round` to `bg-repeat-space` ([#15462](https://github.com/tailwindlabs/tailwindcss/pull/15462))
- Fix `inset-shadow-*` suggestions in IntelliSense ([#15471](https://github.com/tailwindlabs/tailwindcss/pull/15471))
- Only compile arbitrary values ending in `]` ([#15503](https://github.com/tailwindlabs/tailwindcss/pull/15503))
- Ensure `@apply` rules are processed in the correct order ([#15542](https://github.com/tailwindlabs/tailwindcss/pull/15542))
- Allow negative utility names in `@utility` ([#15573](https://github.com/tailwindlabs/tailwindcss/pull/15573))
- Remove all `@keyframes` contributed by JavaScript plugins when using `@reference` imports ([#15581](https://github.com/tailwindlabs/tailwindcss/pull/15581))
- _Upgrade (experimental)_: Do not extract class names from functions (e.g. `shadow` in `filter: 'drop-shadow(…)'`) ([#15566](https://github.com/tailwindlabs/tailwindcss/pull/15566))
- _Upgrade (experimental)_: Migrate `theme(spacing.2)` to `--spacing(2)` ([#15579](https://github.com/tailwindlabs/tailwindcss/pull/15579))
- _Upgrade (experimental)_: Migrate `theme(…)` to `--theme(…)` ([#15579](https://github.com/tailwindlabs/tailwindcss/pull/15579))

### Changed

- Remove `--container-prose` in favor of a deprecated `--max-width-prose` theme variable so that `*-prose` is only available for max-width utilities and only for backward compatibility ([#15439](https://github.com/tailwindlabs/tailwindcss/pull/15439))
- Use Vite post-processor APIs for processing Svelte `<style>` blocks ([#15436](https://github.com/tailwindlabs/tailwindcss/pull/15436))
- Remove `@property` fallback rules for Firefox ([#15622](https://github.com/tailwindlabs/tailwindcss/pull/15622))

## [4.0.0-beta.8] - 2024-12-17

### Fixed

- Ensure `Symbol.dispose` and `Symbol.asyncDispose` are polyfilled ([#15404](https://github.com/tailwindlabs/tailwindcss/pull/15404))

## [4.0.0-beta.7] - 2024-12-13

### Added

- Export `tailwindcss/lib/util/flattenColorPalette` for backward compatibility ([#15318](https://github.com/tailwindlabs/tailwindcss/pull/15318))
- Improve debug logs to get better insights ([#15303](https://github.com/tailwindlabs/tailwindcss/pull/15303))

### Fixed

- Fix dependency related warnings when using `@tailwindcss/postcss` on Windows ([#15321](https://github.com/tailwindlabs/tailwindcss/pull/15321))
- Skip creating a compiler for CSS files that should not be processed ([#15340](https://github.com/tailwindlabs/tailwindcss/pull/15340))
- Fix missing `shadow-none` suggestion in IntelliSense ([#15342](https://github.com/tailwindlabs/tailwindcss/pull/15342))
- Optimize AST before printing for IntelliSense ([#15347](https://github.com/tailwindlabs/tailwindcss/pull/15347))
- Generate vendor prefixes for Chrome 111+ (e.g. `-webkit-background-clip: text`) ([#15389](https://github.com/tailwindlabs/tailwindcss/pull/15389))

### Changed

- Rename `--aspect-ratio-*` theme key to `--aspect-*` ([#15365](https://github.com/tailwindlabs/tailwindcss/pull/15365))
- Derive `aspect-video` utility from theme ([#15365](https://github.com/tailwindlabs/tailwindcss/pull/15365))

## [4.0.0-beta.6] - 2024-12-06

### Fixed

- Ensure `@import "…" reference` never generates utilities ([#15307](https://github.com/tailwindlabs/tailwindcss/pull/15307))

## [4.0.0-beta.5] - 2024-12-04

### Added

- Parallelize parsing of individual source files ([#15270](https://github.com/tailwindlabs/tailwindcss/pull/15270))
- Add new `@import "…" reference` option for importing Tailwind CSS configuration details into another CSS entry point without duplicating CSS ([#15228](https://github.com/tailwindlabs/tailwindcss/pull/15228))
- Improve performance of `@tailwindcss/postcss` by translating between internal data structures and PostCSS nodes directly without additional parsing or stringification ([#15297](https://github.com/tailwindlabs/tailwindcss/pull/15297))

### Fixed

- Ensure absolute URLs inside imported CSS files are not rebased when using `@tailwindcss/vite` ([#15275](https://github.com/tailwindlabs/tailwindcss/pull/15275))
- Fix issues with dev servers using Svelte 5 with `@tailwindcss/vite` ([#15274](https://github.com/tailwindlabs/tailwindcss/issues/15274))
- Support installing `@tailwindcss/vite` in Vite 6 projects ([#15274](https://github.com/tailwindlabs/tailwindcss/issues/15274))
- Fix resolution of imported CSS files in SSR builds with `@tailwindcss/vite` ([#15279](https://github.com/tailwindlabs/tailwindcss/issues/15279))
- Ensure other plugins can run after `@tailwindcss/postcss` ([#15273](https://github.com/tailwindlabs/tailwindcss/pull/15273))
- Rebase URLs inside imported CSS files when using Vite with the `@tailwindcss/postcss` extension ([#15273](https://github.com/tailwindlabs/tailwindcss/pull/15273))
- Fix missing font family suggestions in IntelliSense ([#15288](https://github.com/tailwindlabs/tailwindcss/pull/15288))
- Fix missing `@container` suggestion in IntelliSense ([#15288](https://github.com/tailwindlabs/tailwindcss/pull/15288))

## [4.0.0-beta.4] - 2024-11-29

### Fixed

- Don't scan source files for utilities unless `@tailwind utilities` is present in the CSS in `@tailwindcss/postcss` and `@tailwindcss/vite` ([#15226](https://github.com/tailwindlabs/tailwindcss/pull/15226))
- Skip reserializing CSS files that don't use Tailwind features in `@tailwindcss/postcss` and `@tailwindcss/vite` ([#15226](https://github.com/tailwindlabs/tailwindcss/pull/15226))
- _Upgrade (experimental)_: Do not migrate the `overflow-clip` utility ([#15244](https://github.com/tailwindlabs/tailwindcss/pull/15244))
- _Upgrade (experimental)_: Rename `backdrop-blur` to `backdrop-blur-sm` and `backdrop-blur-sm` to `backdrop-blur-xs` ([#15242](https://github.com/tailwindlabs/tailwindcss/pull/15242))

## [4.0.0-beta.3] - 2024-11-27

### Fixed

- Ensure any necessary vendor prefixes are generated for iOS Safari, Firefox, and Chrome ([#15166](https://github.com/tailwindlabs/tailwindcss/pull/15166))
- Ensure `.group` and `.peer` are prefixed when using the `prefix(…)` option ([#15174](https://github.com/tailwindlabs/tailwindcss/pull/15174))
- Ensure 3D transforms render correctly in Safari ([#15179](https://github.com/tailwindlabs/tailwindcss/pull/15179))
- Ensure `--spacing-*` variables take precedence over `--container-*` variables ([#15180](https://github.com/tailwindlabs/tailwindcss/pull/15180))
- Fix scanning classes delimited by tab characters ([#15169](https://github.com/tailwindlabs/tailwindcss/pull/15169))
- Ensure opacity modifiers and semi-transparent gradients render correctly by default in Safari ([#15201](https://github.com/tailwindlabs/tailwindcss/pull/15201))
- Fix element size thrashing when transitioning gradients on elements with a defined font-size in Safari ([#15216](https://github.com/tailwindlabs/tailwindcss/pull/15216))
- Ensure `translate-*` utilities work with arbitrary values that use `calc(…)` ([#15215](https://github.com/tailwindlabs/tailwindcss/pull/15215))
- Ensure gradient stop position utilities work with arbitrary values that use `calc(…)` ([#15215](https://github.com/tailwindlabs/tailwindcss/pull/15215))
- Ensure Node addons are packaged correctly with Windows ARM builds ([#15171](https://github.com/tailwindlabs/tailwindcss/pull/15171))
- Ensure the Vite plugin resolves CSS and JS files according to the configured resolver conditions ([#15173])(https://github.com/tailwindlabs/tailwindcss/pull/15173)
- _Upgrade (experimental)_: Migrate prefixes for `.group` and `.peer` classes ([#15208](https://github.com/tailwindlabs/tailwindcss/pull/15208))

### Changed

- Interpolate gradients using OKLAB instead of OKLCH by default ([#15201](https://github.com/tailwindlabs/tailwindcss/pull/15201))
- Error when `layer(…)` in `@import` is not first in the list of functions/conditions ([#15109](https://github.com/tailwindlabs/tailwindcss/pull/15109))
- Use unitless line-height values for font-size variables in default theme ([#15216](https://github.com/tailwindlabs/tailwindcss/pull/15216))
- Don't register custom properties with explicit types unless those custom properties need to be animateable ([#15215](https://github.com/tailwindlabs/tailwindcss/pull/15215))

## [4.0.0-beta.2] - 2024-11-22

### Fixed

- Use configured `--letter-spacing` values for custom font size utilities ([#15099](https://github.com/tailwindlabs/tailwindcss/pull/15099))
- Ensure `space-x/y-*` and `divide-x/y-*` with variants can undo `space-x/y-reverse` and `divide-x/y-reverse` ([#15094](https://github.com/tailwindlabs/tailwindcss/pull/15094))
- Don't print minified code when the build fails in the CLI ([#15106](https://github.com/tailwindlabs/tailwindcss/pull/15106))
- Generate the correct CSS for the `break-keep` utility ([#15108](https://github.com/tailwindlabs/tailwindcss/pull/15108))
- Detect single word utilities that include numbers (e.g. `h1`) when scanning files ([#15110](https://github.com/tailwindlabs/tailwindcss/pull/15110))
- _Upgrade (experimental)_: Always add `layer(…)` as the first param to `@import` ([#15102](https://github.com/tailwindlabs/tailwindcss/pull/15102))

### Changed

- Revert the new base styles for buttons and form controls ([#15100](https://github.com/tailwindlabs/tailwindcss/pull/15100))

## [4.0.0-beta.1] - 2024-11-21

### Added

- _Upgrade (experimental)_: Drop unnecessary `opacity` theme values when migrating to CSS ([#15067](https://github.com/tailwindlabs/tailwindcss/pull/15067))

### Fixed

- Ensure `opacity` theme values configured as decimal numbers via JS config files work with color utilities ([#15067](https://github.com/tailwindlabs/tailwindcss/pull/15067))
- Bring back support for `decoration-clone`, `decoration-slice`, `overflow-ellipsis`, `flex-grow-*`, and `flex-shrink-*` ([#15069](https://github.com/tailwindlabs/tailwindcss/pull/15069))
- _Upgrade (experimental)_: Include `color` in the form reset snippet ([#15064](https://github.com/tailwindlabs/tailwindcss/pull/15064))

## [4.0.0-alpha.36] - 2024-11-21

### Added

- Add consistent base styles for buttons and form controls ([#15036](https://github.com/tailwindlabs/tailwindcss/pull/15036))
- _Upgrade (experimental)_: Convert `group-[]:flex` to `in-[.group]:flex` ([#15054](https://github.com/tailwindlabs/tailwindcss/pull/15054))
- _Upgrade (experimental)_: Add form reset styles to CSS files for compatibility with v3 ([#15036](https://github.com/tailwindlabs/tailwindcss/pull/15036))
- _Upgrade (experimental)_: Migrate `ring` to `ring-3` ([#15063](https://github.com/tailwindlabs/tailwindcss/pull/15063))

### Fixed

- _Upgrade (experimental)_: Don't migrate arbitrary variants to `in-*` that use the child combinator instead of the descendant combinator ([#15054](https://github.com/tailwindlabs/tailwindcss/pull/15054))

### Changed

- Use single drop shadow values instead of multiple ([#15056](https://github.com/tailwindlabs/tailwindcss/pull/15056))
- Do not parse invalid candidates with empty arbitrary values ([#15055](https://github.com/tailwindlabs/tailwindcss/pull/15055))

## [4.0.0-alpha.35] - 2024-11-20

### Added

- Reintroduce `max-w-screen-*` utilities that read from the `--breakpoint` namespace as deprecated utilities ([#15013](https://github.com/tailwindlabs/tailwindcss/pull/15013))
- Support using CSS variables as arbitrary values without `var(…)` by using parentheses instead of square brackets (e.g. `bg-(--my-color)`) ([#15020](https://github.com/tailwindlabs/tailwindcss/pull/15020))
- Add new `in-*` variant ([#15025](https://github.com/tailwindlabs/tailwindcss/pull/15025))
- Bundle `@tailwindcss/forms`, `@tailwindcss/typography`, and `@tailwindcss/aspect-ratio` with the standalone CLI ([#15028](https://github.com/tailwindlabs/tailwindcss/pull/15028))
- Allow `addUtilities()` and `addComponents()` to work with child combinators and other complex selectors ([#15029](https://github.com/tailwindlabs/tailwindcss/pull/15029))
- Support colors that use `<alpha-value>` in JS configs and plugins ([#15033](https://github.com/tailwindlabs/tailwindcss/pull/15033))
- Add new `transition-discrete` and `transition-normal` utilities for `transition-behavior` ([#15051](https://github.com/tailwindlabs/tailwindcss/pull/15051))
- _Upgrade (experimental)_: Migrate `[&>*]` to the `*` variant ([#15022](https://github.com/tailwindlabs/tailwindcss/pull/15022))
- _Upgrade (experimental)_: Migrate `[&_*]` to the `**` variant ([#15022](https://github.com/tailwindlabs/tailwindcss/pull/15022))
- _Upgrade (experimental)_: Warn when trying to migrating a project that is not on Tailwind CSS v3 ([#15015](https://github.com/tailwindlabs/tailwindcss/pull/15015))
- _Upgrade (experimental)_: Migrate colors that use `<alpha-value>` in JS configs ([#15033](https://github.com/tailwindlabs/tailwindcss/pull/15033))

### Fixed

- Ensure `flex` is suggested ([#15014](https://github.com/tailwindlabs/tailwindcss/pull/15014))
- Improve module resolution for `cjs`-only and `esm`-only plugins ([#15041](https://github.com/tailwindlabs/tailwindcss/pull/15041))
- Perform `calc(…)` on just values for negative `-rotate-*` utilities, not on the `rotateX/Y/Z(…)` functions themselves ([#15044](https://github.com/tailwindlabs/tailwindcss/pull/15044))
- _Upgrade (experimental)_: Resolve imports when specifying a CSS entry point on the command-line ([#15010](https://github.com/tailwindlabs/tailwindcss/pull/15010))
- _Upgrade (experimental)_: Resolve nearest Tailwind config file when CSS file does not contain `@config` ([#15001](https://github.com/tailwindlabs/tailwindcss/pull/15001))
- _Upgrade (experimental)_: Improve output when CSS imports can not be found ([#15038](https://github.com/tailwindlabs/tailwindcss/pull/15038))
- _Upgrade (experimental)_: Ignore analyzing imports with external URLs (e.g.: `@import "https://fonts.google.com"`) ([#15040](https://github.com/tailwindlabs/tailwindcss/pull/15040))
- _Upgrade (experimental)_: Ignore analyzing imports with `url(…)` (e.g.: `@import url("https://fonts.google.com")`) ([#15040](https://github.com/tailwindlabs/tailwindcss/pull/15040))
- _Upgrade (experimental)_: Use `resolveJsId` when resolving `tailwindcss/package.json` ([#15041](https://github.com/tailwindlabs/tailwindcss/pull/15041))
- _Upgrade (experimental)_: Ensure children of Tailwind root file are not considered Tailwind root files ([#15048](https://github.com/tailwindlabs/tailwindcss/pull/15048))

### Changed

- Bring back support for color opacity modifiers to read from `--opacity-*` theme values ([#14278](https://github.com/tailwindlabs/tailwindcss/pull/14278))

## [4.0.0-alpha.34] - 2024-11-14

### Added

- Support opacity values in increments of `0.25` by default ([#14980](https://github.com/tailwindlabs/tailwindcss/pull/14980))
- Support specifying the color interpolation method for gradients via modifier ([#14984](https://github.com/tailwindlabs/tailwindcss/pull/14984))
- Reintroduce `container` component as a utility ([#14993](https://github.com/tailwindlabs/tailwindcss/pull/14993), [#14999](https://github.com/tailwindlabs/tailwindcss/pull/14999))
- _Upgrade (experimental)_: Migrate `container` component configuration to CSS ([#14999](https://github.com/tailwindlabs/tailwindcss/pull/14999))

### Fixed

- Ensure that CSS inside Svelte `<style>` blocks always run the expected Svelte processors when using the Vite extension ([#14981](https://github.com/tailwindlabs/tailwindcss/pull/14981))
- _Upgrade (experimental)_: Ensure it's safe to migrate `blur`, `rounded`, or `shadow` ([#14979](https://github.com/tailwindlabs/tailwindcss/pull/14979))
- _Upgrade (experimental)_: Do not rename classes using custom defined theme values ([#14976](https://github.com/tailwindlabs/tailwindcss/pull/14976))
- _Upgrade (experimental)_: Ensure `@config` is injected in nearest common ancestor stylesheet ([#14989](https://github.com/tailwindlabs/tailwindcss/pull/14989))
- _Upgrade (experimental)_: Add missing `layer(…)` to imports above Tailwind directives ([#14982](https://github.com/tailwindlabs/tailwindcss/pull/14982))

## [4.0.0-alpha.33] - 2024-11-11

### Fixed

- Don't reset horizontal padding on date/time pseudo-elements ([#14959](https://github.com/tailwindlabs/tailwindcss/pull/14959))
- Don't emit `calc()` with invalid values for bare values that aren't integers in spacing utilities ([#14962](https://github.com/tailwindlabs/tailwindcss/pull/14962))
- Ensure spacing scale values work as line-height modifiers ([#14966](https://github.com/tailwindlabs/tailwindcss/pull/14966))

## [4.0.0-alpha.32] - 2024-11-11

### Added

- Support derived spacing scales based on a single `--spacing` theme value ([#14857](https://github.com/tailwindlabs/tailwindcss/pull/14857))
- Add `svh`, `dvh`, `svw`, `dvw`, and `auto` values to all width/height/size utilities ([#14857](https://github.com/tailwindlabs/tailwindcss/pull/14857))
- Add new `**` variant ([#14903](https://github.com/tailwindlabs/tailwindcss/pull/14903))
- Process `<style>` blocks inside Svelte files when using the Vite extension ([#14151](https://github.com/tailwindlabs/tailwindcss/pull/14151))
- Normalize date/time input styles in Preflight ([#14931](https://github.com/tailwindlabs/tailwindcss/pull/14931))
- _Upgrade (experimental)_: Migrate `grid-cols-[subgrid]` and `grid-rows-[subgrid]` to `grid-cols-subgrid` and `grid-rows-subgrid` ([#14840](https://github.com/tailwindlabs/tailwindcss/pull/14840))
- _Upgrade (experimental)_: Support migrating projects with multiple config files ([#14863](https://github.com/tailwindlabs/tailwindcss/pull/14863))
- _Upgrade (experimental)_: Rename `shadow` to `shadow-sm`, `shadow-sm` to `shadow-xs`, and `shadow-xs` to `shadow-2xs` ([#14875](https://github.com/tailwindlabs/tailwindcss/pull/14875))
- _Upgrade (experimental)_: Rename `inset-shadow` to `inset-shadow-sm`, `inset-shadow-sm` to `inset-shadow-xs`, and `inset-shadow-xs` to `inset-shadow-2xs` ([#14875](https://github.com/tailwindlabs/tailwindcss/pull/14875))
- _Upgrade (experimental)_: Rename `drop-shadow` to `drop-shadow-sm` and `drop-shadow-sm` to `drop-shadow-xs` ([#14875](https://github.com/tailwindlabs/tailwindcss/pull/14875))
- _Upgrade (experimental)_: Rename `rounded` to `rounded-sm` and `rounded-sm` to `rounded-xs` ([#14875](https://github.com/tailwindlabs/tailwindcss/pull/14875))
- _Upgrade (experimental)_: Rename `blur` to `blur-sm` and `blur-sm` to `blur-xs` ([#14875](https://github.com/tailwindlabs/tailwindcss/pull/14875))
- _Upgrade (experimental)_: Migrate `theme()` usage and JS config files to use the new `--spacing` multiplier where possible ([#14905](https://github.com/tailwindlabs/tailwindcss/pull/14905))
- _Upgrade (experimental)_: Migrate arbitrary values in variants to built-in values where possible ([#14841](https://github.com/tailwindlabs/tailwindcss/pull/14841))

### Fixed

- Detect classes in new files when using `@tailwindcss/postcss` ([#14829](https://github.com/tailwindlabs/tailwindcss/pull/14829))
- Fix crash when using `@source` containing `..` ([#14831](https://github.com/tailwindlabs/tailwindcss/pull/14831))
- Ensure instances of the same variant with different values are always sorted deterministically (e.g. `data-focus:flex` and `data-active:flex`) ([#14835](https://github.com/tailwindlabs/tailwindcss/pull/14835))
- Ensure `--inset-ring=*` and `--inset-shadow-*` variables are ignored by `inset-*` utilities ([#14855](https://github.com/tailwindlabs/tailwindcss/pull/14855))
- Ensure `url(…)` containing special characters such as `;` or `{}` end up in one declaration ([#14879](https://github.com/tailwindlabs/tailwindcss/pull/14879))
- Ensure adjacent rules are merged together after handling nesting when generating optimized CSS ([#14873](https://github.com/tailwindlabs/tailwindcss/pull/14873))
- Rebase `url()` inside imported CSS files when using Vite ([#14877](https://github.com/tailwindlabs/tailwindcss/pull/14877))
- Ensure that CSS transforms from other Vite plugins correctly work in full builds (e.g. `:deep()` in Vue) ([#14871](https://github.com/tailwindlabs/tailwindcss/pull/14871))
- Ensure the CSS `theme()` function handles newlines and tabs in its arguments list ([#14917](https://github.com/tailwindlabs/tailwindcss/pull/14917))
- Don't unset keys like `--inset-shadow-*` when unsetting keys like `--inset-*` ([#14906](https://github.com/tailwindlabs/tailwindcss/pull/14906))
- Ensure spacing utilities with no value (e.g. `px` or `translate-y`) don't generate CSS ([#14911](https://github.com/tailwindlabs/tailwindcss/pull/14911))
- Don't override user-agent background color for input elements in Preflight ([#14913](https://github.com/tailwindlabs/tailwindcss/pull/14913))
- Don't attempt to convert CSS variables (which should already be percentages) to percentages when used as opacity modifiers ([#14916](https://github.com/tailwindlabs/tailwindcss/pull/14916))
- Ensure custom utilities registered with the plugin API can start with `@` ([#14793](https://github.com/tailwindlabs/tailwindcss/pull/14793))
- _Upgrade (experimental)_: Install `@tailwindcss/postcss` next to `tailwindcss` ([#14830](https://github.com/tailwindlabs/tailwindcss/pull/14830))
- _Upgrade (experimental)_: Remove whitespace around `,` separator when print arbitrary values ([#14838](https://github.com/tailwindlabs/tailwindcss/pull/14838))
- _Upgrade (experimental)_: Fix crash during upgrade when content globs escape root of project ([#14896](https://github.com/tailwindlabs/tailwindcss/pull/14896))
- _Upgrade (experimental)_: Don't convert `theme(…/15%)` to modifier unless it is the entire arbitrary value of a utility ([#14922](https://github.com/tailwindlabs/tailwindcss/pull/14922))
- _Upgrade (experimental)_: Convert `,` to ` ` in arbitrary `grid-cols-*`, `grid-rows-*`, and `object-*` values ([#14927](https://github.com/tailwindlabs/tailwindcss/pull/14927))

### Changed

- Remove `--drop-shadow-none` from the default theme in favor of a static `drop-shadow-none` utility ([#14847](https://github.com/tailwindlabs/tailwindcss/pull/14847))
- Rename `shadow` to `shadow-sm`, `shadow-sm` to `shadow-xs`, and `shadow-xs` to `shadow-2xs` ([#14849](https://github.com/tailwindlabs/tailwindcss/pull/14849))
- Rename `inset-shadow` to `inset-shadow-sm`, `inset-shadow-sm` to `inset-shadow-xs`, and `inset-shadow-xs` to `inset-shadow-2xs` ([#14849](https://github.com/tailwindlabs/tailwindcss/pull/14849))
- Rename `drop-shadow` to `drop-shadow-sm` and `drop-shadow-sm` to `drop-shadow-xs` ([#14849](https://github.com/tailwindlabs/tailwindcss/pull/14849))
- Rename `rounded` to `rounded-sm` and `rounded-sm` to `rounded-xs` ([#14849](https://github.com/tailwindlabs/tailwindcss/pull/14849))
- Rename `blur` to `blur-sm` and `blur-sm` to `blur-xs` ([#14849](https://github.com/tailwindlabs/tailwindcss/pull/14849))
- Remove fixed line-height theme values and derive `leading-*` utilities from `--spacing-*` scale ([#14857](https://github.com/tailwindlabs/tailwindcss/pull/14857))
- Remove `--transition-timing-function-linear` from the default theme in favor of a static `ease-linear` utility ([#14880](https://github.com/tailwindlabs/tailwindcss/pull/14880))
- Remove default `--spacing-*` scale in favor of `--spacing` multiplier ([#14857](https://github.com/tailwindlabs/tailwindcss/pull/14857))
- Remove `var(…)` fallbacks from theme values in utilities ([#14881](https://github.com/tailwindlabs/tailwindcss/pull/14881))
- Remove static `font-weight` utilities and add `--font-weight-*` values to the default theme ([#14883](https://github.com/tailwindlabs/tailwindcss/pull/14883))
- Rename `--transition-timing-function-*` variables to `--ease-*` ([#14886](https://github.com/tailwindlabs/tailwindcss/pull/14886))
- Rename `--width-*` variables to `--container-*` ([#14898](https://github.com/tailwindlabs/tailwindcss/pull/14898))
- Rename `--font-size-*` variables to `--text-*` ([#14909](https://github.com/tailwindlabs/tailwindcss/pull/14909))
- Rename `--font-family-*` variables to `--font-*` ([#14885](https://github.com/tailwindlabs/tailwindcss/pull/14885))
- Rename `--letter-spacing-*` variables to `--tracking-*` ([#14921](https://github.com/tailwindlabs/tailwindcss/pull/14921))
- Rename `--line-height-*` variables to `--leading-*` ([#14925](https://github.com/tailwindlabs/tailwindcss/pull/14925))
- Revert specificity of `*` variant to match v3 behavior ([#14920](https://github.com/tailwindlabs/tailwindcss/pull/14920))
- Replace `outline-none` with `outline-hidden`, add new simplified `outline-none` utility ([#14926](https://github.com/tailwindlabs/tailwindcss/pull/14926))
- Revert adding borders by default to form inputs ([#14929](https://github.com/tailwindlabs/tailwindcss/pull/14929))
- Deprecate `shadow-inner` utility ([#14933](https://github.com/tailwindlabs/tailwindcss/pull/14933))
- Remove `--leading-none` from the default theme in favor of a static `leading-none` utility ([#14934](https://github.com/tailwindlabs/tailwindcss/pull/14934))

## [4.0.0-alpha.31] - 2024-10-29

### Added

- Support specifying the base path for automatic source detection using a `source(…)` function on `@tailwind utilities` or `@import "tailwindcss"` ([#14820](https://github.com/tailwindlabs/tailwindcss/pull/14820))
- Support disabling automatic source detection with `source(none)` ([#14820](https://github.com/tailwindlabs/tailwindcss/pull/14820))
- Support passing directories to `@source` without needing to pass a complete glob ([#14820](https://github.com/tailwindlabs/tailwindcss/pull/14820))
- _Upgrade (experimental)_: Bump `prettier-plugin-tailwindcss` to latest version during upgrade ([#14808](https://github.com/tailwindlabs/tailwindcss/pull/14808))

### Fixed

- Support calling `config()` with no arguments in plugin API ([#14799](https://github.com/tailwindlabs/tailwindcss/pull/14799))

### Changed

- Use logical `*-inline` and `*-block` properties for all x/y utilities like `px-*`, `my-*`, `scroll-px-*`, and `inset-y-*` ([#14805](https://github.com/tailwindlabs/tailwindcss/pull/14805))
- Respect automatic source detection heuristics in sources registered with `@source` ([#14820](https://github.com/tailwindlabs/tailwindcss/pull/14820))

## [4.0.0-alpha.30] - 2024-10-24

### Added

- Support `not-*` with all built-in media query and `supports-*` variants ([#14743](https://github.com/tailwindlabs/tailwindcss/pull/14743))
- Support `not-*` with custom variants containing at-rules ([#14743](https://github.com/tailwindlabs/tailwindcss/pull/14743))
- Support `group-*`, `peer-*`, and `has-*` with custom variants containing multiple, non-nested style rules ([#14743](https://github.com/tailwindlabs/tailwindcss/pull/14743))

### Fixed

- Ensure individual logical property utilities are sorted later than left/right pair utilities ([#14777](https://github.com/tailwindlabs/tailwindcss/pull/14777))
- Don't migrate important modifiers inside conditional statements in Vue and Alpine (e.g. `<div v-if="!border" />`) ([#14774](https://github.com/tailwindlabs/tailwindcss/pull/14774))
- Ensure third-party plugins with `exports` in their `package.json` are resolved correctly ([#14775](https://github.com/tailwindlabs/tailwindcss/pull/14775))
- Ensure underscores in the `url()` function are never unescaped ([#14776](https://github.com/tailwindlabs/tailwindcss/pull/14776))
- Ensure complex variants are displayed correctly in IntelliSense completions ([#14743](https://github.com/tailwindlabs/tailwindcss/pull/14743))
- _Upgrade (experimental)_: Ensure `@import` statements for relative CSS files are actually migrated to use relative path syntax ([#14769](https://github.com/tailwindlabs/tailwindcss/pull/14769))
- _Upgrade (experimental)_: Only generate Preflight compatibility styles when Preflight is used ([#14773](https://github.com/tailwindlabs/tailwindcss/pull/14773))
- _Upgrade (experimental)_: Don't escape underscores when printing theme values migrated to CSS variables in arbitrary values (e.g. `m-[var(--spacing-1_5)]` instead of `m-[var(--spacing-1\_5)]`) ([#14778](https://github.com/tailwindlabs/tailwindcss/pull/14778))
- _Upgrade (experimental)_: Ensure `layer(…)` on `@import` is only removed when `@utility` is present ([#14783](https://github.com/tailwindlabs/tailwindcss/pull/14783))

### Changed

- Don't convert underscores in the first argument to `var()` and `theme()` to spaces ([#14776](https://github.com/tailwindlabs/tailwindcss/pull/14776), [#14781](https://github.com/tailwindlabs/tailwindcss/pull/14781))
- Sort text alignment and wrapping utilities with typography utilities ([#14787](https://github.com/tailwindlabs/tailwindcss/pull/14787))
- Sort line height and letter spacing utilities before text color utilities ([#14787](https://github.com/tailwindlabs/tailwindcss/pull/14787))

## [4.0.0-alpha.29] - 2024-10-23

### Added

- _Upgrade (experimental)_: Migrate `plugins` with options to CSS ([#14700](https://github.com/tailwindlabs/tailwindcss/pull/14700))
- _Upgrade (experimental)_: Allow JS configuration files with `corePlugins` options to be migrated to CSS ([#14742](https://github.com/tailwindlabs/tailwindcss/pull/14742))
- _Upgrade (experimental)_: Migrate `@import` statements for relative CSS files to use relative path syntax (e.g. `./file.css`) ([#14755](https://github.com/tailwindlabs/tailwindcss/pull/14755))
- _Upgrade (experimental)_: Migrate `max-w-screen-*` utilities to `max-w-[var(…)]`([#14754](https://github.com/tailwindlabs/tailwindcss/pull/14754))
- _Upgrade (experimental)_: Migrate `@variants` and `@responsive` directives ([#14748](https://github.com/tailwindlabs/tailwindcss/pull/14748))
- _Upgrade (experimental)_: Migrate `@screen` directive ([#14749](https://github.com/tailwindlabs/tailwindcss/pull/14749))
- _Upgrade (experimental)_: Generate compatibility styles for legacy default border color ([#14746](https://github.com/tailwindlabs/tailwindcss/pull/14746))
- _Upgrade (experimental)_: Generate compatibility styles for legacy default border width on form elements ([#14746](https://github.com/tailwindlabs/tailwindcss/pull/14746))

### Fixed

- Allow spaces spaces around operators in attribute selector variants ([#14703](https://github.com/tailwindlabs/tailwindcss/pull/14703))
- Ensure color opacity modifiers work with OKLCH colors ([#14741](https://github.com/tailwindlabs/tailwindcss/pull/14741))
- Ensure changes to the input CSS file result in a full rebuild ([#14744](https://github.com/tailwindlabs/tailwindcss/pull/14744))
- Add `postcss` as a dependency of `@tailwindcss/postcss` ([#14750](https://github.com/tailwindlabs/tailwindcss/pull/14750))
- Ensure the JS `theme()` function can reference CSS theme variables that contain special characters without escaping them (e.g. referencing `--width-1\/2` as `theme('width.1/2')`) ([#14739](https://github.com/tailwindlabs/tailwindcss/pull/14739))
- Ensure JS theme keys containing special characters correctly produce utility classes (e.g. `'1/2': 50%` to `w-1/2`) ([#14739](https://github.com/tailwindlabs/tailwindcss/pull/14739))
- Always emit keyframes registered in `addUtilities` ([#14747](https://github.com/tailwindlabs/tailwindcss/pull/14747))
- Ensure loading stylesheets via the `?raw` and `?url` static asset query works when using the Vite plugin ([#14716](https://github.com/tailwindlabs/tailwindcss/pull/14716))
- _Upgrade (experimental)_: Migrate `flex-grow` to `grow` and `flex-shrink` to `shrink` ([#14721](https://github.com/tailwindlabs/tailwindcss/pull/14721))
- _Upgrade (experimental)_: Minify arbitrary values when printing candidates ([#14720](https://github.com/tailwindlabs/tailwindcss/pull/14720))
- _Upgrade (experimental)_: Ensure legacy theme values ending in `1` (like `theme(spacing.1)`) are correctly migrated to custom properties ([#14724](https://github.com/tailwindlabs/tailwindcss/pull/14724))
- _Upgrade (experimental)_: Migrate arbitrary values to bare values for the `from-*`, `via-*`, and `to-*` utilities ([#14725](https://github.com/tailwindlabs/tailwindcss/pull/14725))
- _Upgrade (experimental)_: Ensure `layer(utilities)` is removed from `@import` to keep `@utility` top-level ([#14738](https://github.com/tailwindlabs/tailwindcss/pull/14738))
- _Upgrade (experimental)_: Ensure JS theme keys with special characters are escaped when migrated to CSS variables ([#14736](https://github.com/tailwindlabs/tailwindcss/pull/14736))
- _Upgrade (experimental)_: Don't migrate important modifiers that are actually logical negations (e.g. `let foo = !border` to `let foo = border!`) ([#14737](https://github.com/tailwindlabs/tailwindcss/pull/14737))

### Changed

- Require a relative path prefix for importing relative CSS files (e.g. `@import './styles.css'` instead of `@import 'styles.css'`) ([#14755](https://github.com/tailwindlabs/tailwindcss/pull/14755))
- _Upgrade (experimental)_: Don't create `@source` rules for `content` paths that are already covered by automatic source detection ([#14714](https://github.com/tailwindlabs/tailwindcss/pull/14714))

## [4.0.0-alpha.28] - 2024-10-17

### Added

- Add first draft of new wide-gamut color palette ([#14693](https://github.com/tailwindlabs/tailwindcss/pull/14693))
- Support linear gradient angles as bare values ([#14707](https://github.com/tailwindlabs/tailwindcss/pull/14707))
- Interpolate gradients in OKLCH by default ([#14708](https://github.com/tailwindlabs/tailwindcss/pull/14708))
- _Upgrade (experimental)_: Migrate `theme(…)` calls to `var(…)` or to the modern `theme(…)` syntax ([#14664](https://github.com/tailwindlabs/tailwindcss/pull/14664), [#14695](https://github.com/tailwindlabs/tailwindcss/pull/14695))
- _Upgrade (experimental)_: Support migrating JS configurations to CSS that contain functions inside the `theme` object ([#14675](https://github.com/tailwindlabs/tailwindcss/pull/14675))

### Fixed

- Ensure `theme` values defined outside of `extend` in JS configuration files overwrite all existing values for that namespace ([#14672](https://github.com/tailwindlabs/tailwindcss/pull/14672))
- Remove unnecessary variable fallbacks in gradient utilities ([#14705](https://github.com/tailwindlabs/tailwindcss/pull/14705))
- _Upgrade (experimental)_: Speed up template migrations ([#14679](https://github.com/tailwindlabs/tailwindcss/pull/14679))
- _Upgrade (experimental)_: Don't generate invalid CSS when migrating a complex `screens` config ([#14691](https://github.com/tailwindlabs/tailwindcss/pull/14691))

## [4.0.0-alpha.27] - 2024-10-15

### Added

- Add support for `tailwindcss/colors.js`, `tailwindcss/defaultTheme.js`, and `tailwindcss/plugin.js` exports ([#14595](https://github.com/tailwindlabs/tailwindcss/pull/14595))
- Support `keyframes` in JS config file themes ([#14594](https://github.com/tailwindlabs/tailwindcss/pull/14594))
- Support the `color` parameter in JS theme configuration callbacks ([#14651](https://github.com/tailwindlabs/tailwindcss/pull/14651))
- Support using the object parameter in the JS theme configuration callback as `theme()` function ([#14659](https://github.com/tailwindlabs/tailwindcss/pull/14659))
- _Upgrade (experimental)_: Automatically discover JavaScript config files ([#14597](https://github.com/tailwindlabs/tailwindcss/pull/14597))
- _Upgrade (experimental)_: Inject `@config "…"` when a `tailwind.config.{js,ts,…}` is detected ([#14635](https://github.com/tailwindlabs/tailwindcss/pull/14635))
- _Upgrade (experimental)_: Migrate `@media screen(…)` when running codemods ([#14603](https://github.com/tailwindlabs/tailwindcss/pull/14603))
- _Upgrade (experimental)_: Migrate `aria-*`, `data-*`, and `supports-*` variants from arbitrary values to bare values ([#14644](https://github.com/tailwindlabs/tailwindcss/pull/14644))
- _Upgrade (experimental)_: Migrate arbitrary values to bare values ([#14669](https://github.com/tailwindlabs/tailwindcss/pull/14669))
- _Upgrade (experimental)_: Migrate legacy classes to the v4 alternative ([#14643](https://github.com/tailwindlabs/tailwindcss/pull/14643))
- _Upgrade (experimental)_: Migrate static JS configurations to CSS ([#14639](https://github.com/tailwindlabs/tailwindcss/pull/14639), [#14650](https://github.com/tailwindlabs/tailwindcss/pull/14650), [#14648](https://github.com/tailwindlabs/tailwindcss/pull/14648), [#14666](https://github.com/tailwindlabs/tailwindcss/pull/14666))
- _Upgrade (experimental)_: Migrate v3 PostCSS setups to v4 in some cases ([#14612](https://github.com/tailwindlabs/tailwindcss/pull/14612))

### Fixed

- Don’t crash when scanning a candidate equal to the configured prefix ([#14588](https://github.com/tailwindlabs/tailwindcss/pull/14588))
- Ensure there's always a space before `!important` when stringifying CSS ([#14611](https://github.com/tailwindlabs/tailwindcss/pull/14611))
- Don't set `display: none` on elements that use `hidden="until-found"` ([#14631](https://github.com/tailwindlabs/tailwindcss/pull/14631))
- Ensure the CSS `theme()` function resolves to the right value in some compatibility situations ([#14614](https://github.com/tailwindlabs/tailwindcss/pull/14614))
- Fix issue that could cause the CLI to crash when files are deleted while watching ([#14616](https://github.com/tailwindlabs/tailwindcss/pull/14616))
- Ensure custom variants using the JS API have access to modifiers ([#14637](https://github.com/tailwindlabs/tailwindcss/pull/14637))
- Ensure auto complete suggestions work when using `matchUtilities` ([#14589](https://github.com/tailwindlabs/tailwindcss/pull/14589))
- Pass options when using `addComponents` and `matchComponents` ([#14590](https://github.com/tailwindlabs/tailwindcss/pull/14590))
- Ensure `boxShadow` and `animation` theme keys in JS config files are accessible under `--shadow-*` and `--animate-*` using the `theme()` function ([#14642](https://github.com/tailwindlabs/tailwindcss/pull/14642))
- Ensure all theme keys with new names are also accessible under their old names when using the `theme()` function with the legacy dot notation syntax ([#14642](https://github.com/tailwindlabs/tailwindcss/pull/14642))
- Ensure `var(…)` can be used as the opacity value inside the `theme([path] / [modifier])` function ([#14653](https://github.com/tailwindlabs/tailwindcss/pull/14653))
- Ensure `font-stretch` utilities only accepts positive integer bare values ([#14670](https://github.com/tailwindlabs/tailwindcss/pull/14670))
- _Upgrade (experimental)_: Ensure CSS before a layer stays unlayered when running codemods ([#14596](https://github.com/tailwindlabs/tailwindcss/pull/14596))
- _Upgrade (experimental)_: Resolve issues where some prefixed candidates were not properly migrated ([#14600](https://github.com/tailwindlabs/tailwindcss/pull/14600))

## [4.0.0-alpha.26] - 2024-10-03

### Added

- Add support for prefixes ([#14501](https://github.com/tailwindlabs/tailwindcss/pull/14501))
- Expose timing information in debug mode ([#14553](https://github.com/tailwindlabs/tailwindcss/pull/14553))
- Add support for `blocklist` in JS config files ([#14556](https://github.com/tailwindlabs/tailwindcss/pull/14556))
- Add `color-scheme` utilities ([#14567](https://github.com/tailwindlabs/tailwindcss/pull/14567))
- Add support for `important` option in JS config files ([#14448](https://github.com/tailwindlabs/tailwindcss/pull/14448))
- _Upgrade (experimental)_: Convert `@import "tailwindcss/tailwind.css"` to `@import "tailwindcss"` in CSS files ([#14514](https://github.com/tailwindlabs/tailwindcss/pull/14514))
- _Upgrade (experimental)_: Apply all utility upgrades to `@apply` in CSS files ([#14574](https://github.com/tailwindlabs/tailwindcss/pull/14574))
- _Upgrade (experimental)_: Update variant order in template files ([#14524](https://github.com/tailwindlabs/tailwindcss/pull/14524]))
- _Upgrade (experimental)_: Convert `bg-gradient-*` utilities to `bg-linear-*` in template files ([#14537](https://github.com/tailwindlabs/tailwindcss/pull/14537]))
- _Upgrade (experimental)_: Convert legacy prefixes to variant prefixes in template files ([#14557](https://github.com/tailwindlabs/tailwindcss/pull/14557]))
- _Upgrade (experimental)_: Convert bare CSS variables in arbitrary values to `var(…)` in template files ([#14526](https://github.com/tailwindlabs/tailwindcss/pull/14526))
- _Upgrade (experimental)_: Convert legacy important modifier syntax to trailing syntax ([#14502](https://github.com/tailwindlabs/tailwindcss/pull/14502))

### Fixed

- Use the right import base path when using the CLI to reading files from stdin ([#14522](https://github.com/tailwindlabs/tailwindcss/pull/14522))
- Ensure that `@utility` is top-level and cannot be nested ([#14525](https://github.com/tailwindlabs/tailwindcss/pull/14525))
- Only setup a single compiler in `@tailwindcss/postcss` for initial builds ([#14565](https://github.com/tailwindlabs/tailwindcss/pull/14565))
- Ensure editing imported CSS files triggers a rebuild ([#14561](https://github.com/tailwindlabs/tailwindcss/pull/14561))
- Ensure `@apply` and CSS functions work inside imported stylesheets ([#14576](https://github.com/tailwindlabs/tailwindcss/pull/14576))
- _Upgrade (experimental)_: Don't wrap custom CSS after utilities in a layer ([#14512](https://github.com/tailwindlabs/tailwindcss/pull/14512))
- _Upgrade (experimental)_: Don't add empty `layer()` to `@import` at-rules when the styles do not need to be imported into a layer ([#14513](https://github.com/tailwindlabs/tailwindcss/pull/14513))
- _Upgrade (experimental)_: Don't wrap comment nodes in `@layer` when running codemods ([#14517](https://github.com/tailwindlabs/tailwindcss/pull/14517))
- _Upgrade (experimental)_: Fix scenario where selectors can be lost in multi-selector rules ([#14518](https://github.com/tailwindlabs/tailwindcss/pull/14518))
- _Upgrade (experimental)_: Ensure custom CSS before `@tailwind` rules is wrapped with `@layer base` when prepending `@import "tailwindcss"` to the top of the file ([#14536](https://github.com/tailwindlabs/tailwindcss/pull/14536))

### Changed

- Disallow bare values with decimal places ([#14562](https://github.com/tailwindlabs/tailwindcss/pull/14562))

## [4.0.0-alpha.25] - 2024-09-24

### Added

- Add support for `aria`, `supports`, and `data` variants defined in JS config files ([#14407](https://github.com/tailwindlabs/tailwindcss/pull/14407))
- Add `@tailwindcss/upgrade` tooling ([#14434](https://github.com/tailwindlabs/tailwindcss/pull/14434))
- Support `screens` in JS config files ([#14415](https://github.com/tailwindlabs/tailwindcss/pull/14415))
- Add `bg-radial-*` and `bg-conic-*` utilities for radial and conic gradients ([#14467](https://github.com/tailwindlabs/tailwindcss/pull/14467))
- Add new `shadow-initial` and `inset-shadow-initial` utilities for resetting shadow colors ([#14468](https://github.com/tailwindlabs/tailwindcss/pull/14468))
- Add `field-sizing-*` utilities ([#14469](https://github.com/tailwindlabs/tailwindcss/pull/14469))
- Include gradient color properties in color transitions ([#14489](https://github.com/tailwindlabs/tailwindcss/pull/14489))
- _Upgrade (experimental)_: Convert important syntax in `@apply` in CSS files ([#14411](https://github.com/tailwindlabs/tailwindcss/pull/14434))
- _Upgrade (experimental)_: Convert `@tailwind` directives to `@import` rules in CSS files ([#14411](https://github.com/tailwindlabs/tailwindcss/pull/14411), [#14504](https://github.com/tailwindlabs/tailwindcss/pull/14504))
- _Upgrade (experimental)_: Convert custom CSS in `@layer utilities` and `@layer components` to use `@utility` in CSS files ([#14455](https://github.com/tailwindlabs/tailwindcss/pull/14455))

### Fixed

- Support `borderRadius.*` as an alias for `--radius-*` when using dot notation inside the `theme()` function ([#14436](https://github.com/tailwindlabs/tailwindcss/pull/14436))
- Ensure individual variants from groups are always sorted earlier than stacked variants from the same groups ([#14431](https://github.com/tailwindlabs/tailwindcss/pull/14431))
- Allow `anchor-size(…)` in arbitrary values ([#14394](https://github.com/tailwindlabs/tailwindcss/pull/14394))
- Skip candidates with invalid `theme()` calls ([#14437](https://github.com/tailwindlabs/tailwindcss/pull/14437))
- Don't generate `inset-*` utilities for `--inset-shadow-*` and `--inset-ring-*` theme values ([#14447](https://github.com/tailwindlabs/tailwindcss/pull/14447))
- Include `--default-transition-*` variables in `transition-*` utility output ([#14482](https://github.com/tailwindlabs/tailwindcss/pull/14482))
- Ensure `rtl` and `ltr` variants work with `[dir=auto]` ([#14306](https://github.com/tailwindlabs/tailwindcss/pull/14306))

### Changed

- Preserve explicit `leading-*`, `tracking-*`, and `font-{weight}` value when overriding font-size ([#14403](https://github.com/tailwindlabs/tailwindcss/pull/14403))
- Disallow negative bare values in core utilities and variants ([#14453](https://github.com/tailwindlabs/tailwindcss/pull/14453))
- Preserve explicit shadow color when overriding shadow size ([#14458](https://github.com/tailwindlabs/tailwindcss/pull/14458))
- Preserve explicit transition duration and timing function when overriding transition property ([#14490](https://github.com/tailwindlabs/tailwindcss/pull/14490))
- Change the implementation for `@import` resolution to speed up initial builds ([#14446](https://github.com/tailwindlabs/tailwindcss/pull/14446))
- Remove automatic `var(…)` injection ([#13657](https://github.com/tailwindlabs/tailwindcss/pull/13657))
- Only apply `:hover` states on devices that support `@media (hover: hover)` ([#14500](https://github.com/tailwindlabs/tailwindcss/pull/14500))

## [4.0.0-alpha.24] - 2024-09-11

### Added

- Support CSS `theme()` functions inside other `@custom-media`, `@container`, and `@supports` rules ([#14358](https://github.com/tailwindlabs/tailwindcss/pull/14358))
- Export `Config` type from `tailwindcss` for JS config files ([#14360](https://github.com/tailwindlabs/tailwindcss/pull/14360))
- Add support for `matchVariant` plugins using the `@plugin` directive ([#14371](https://github.com/tailwindlabs/tailwindcss/pull/14371))
- Warn when the `tailwindcss` package is used as a PostCSS plugin ([#14378](https://github.com/tailwindlabs/tailwindcss/pull/14378))

### Fixed

- Ensure there is always CLI feedback on save even when no new classes were found ([#14351](https://github.com/tailwindlabs/tailwindcss/pull/14351))
- Properly resolve `theme('someKey.DEFAULT')` when all `--some-key-*` keys have a suffix ([#14354](https://github.com/tailwindlabs/tailwindcss/pull/14354))
- Make sure tuple theme values in JS configs take precedence over `@theme default` values ([#14359](https://github.com/tailwindlabs/tailwindcss/pull/14359))
- Improve IntelliSense completions for `border` utilities ([#14370](https://github.com/tailwindlabs/tailwindcss/pull/14370))

## [4.0.0-alpha.23] - 2024-09-05

### Added

- Add opacity modifier support to the `theme()` function in plugins ([#14348](https://github.com/tailwindlabs/tailwindcss/pull/14348))

## [4.0.0-alpha.22] - 2024-09-04

### Added

- Support TypeScript for `@plugin` and `@config` files ([#14317](https://github.com/tailwindlabs/tailwindcss/pull/14317))
- Add `default` option to `@theme` to support overriding default theme values from plugins/JS config files ([#14327](https://github.com/tailwindlabs/tailwindcss/pull/14327))
- Add support for `<style>` tags in Astro files to the Vite plugin ([#14340](https://github.com/tailwindlabs/tailwindcss/pull/14340))

### Fixed

- Ensure content globs defined in `@config` files are relative to that file ([#14314](https://github.com/tailwindlabs/tailwindcss/pull/14314))
- Ensure CSS `theme()` functions are evaluated in media query ranges with collapsed whitespace ([#14321](https://github.com/tailwindlabs/tailwindcss/pull/14321))
- Fix support for Nuxt projects in the Vite plugin (requires Nuxt 3.13.1+) ([#14319](https://github.com/tailwindlabs/tailwindcss/pull/14319))
- Evaluate theme functions in plugins and JS config files ([#14326](https://github.com/tailwindlabs/tailwindcss/pull/14326))
- Ensure theme values overridden with `reference` values don't generate stale CSS variables ([#14327](https://github.com/tailwindlabs/tailwindcss/pull/14327))
- Don’t suggest named opacity modifiers in IntelliSense ([#14339](https://github.com/tailwindlabs/tailwindcss/pull/14339))
- Fix a crash with older Node.js versions ([#14342](https://github.com/tailwindlabs/tailwindcss/pull/14342))
- Support defining theme values as arrays of strings in JS config files ([#14343](https://github.com/tailwindlabs/tailwindcss/pull/14343))
- Ensure `--default-font-*` and `--default-mono-font-*` variables respect theme customizations in JS config files ([#14344](https://github.com/tailwindlabs/tailwindcss/pull/14344))

## [4.0.0-alpha.21] - 2024-09-02

### Added

- Add new standalone builds of Tailwind CSS v4 ([#14270](https://github.com/tailwindlabs/tailwindcss/pull/14270))
- Support JavaScript configuration files using `@config` ([#14239](https://github.com/tailwindlabs/tailwindcss/pull/14239))
- Support plugin options in `@plugin` ([#14264](https://github.com/tailwindlabs/tailwindcss/pull/14264))
- Add support for using the Vite extension with `css.transformer` set to `lightningcss` ([#14269](https://github.com/tailwindlabs/tailwindcss/pull/14269))

### Fixed

- Bring back type exports for the cjs build of `@tailwindcss/postcss` ([#14256](https://github.com/tailwindlabs/tailwindcss/pull/14256))
- Correctly merge tuple values when using the plugin API ([#14260](https://github.com/tailwindlabs/tailwindcss/pull/14260))
- Handle arrays in the CSS `theme()` function when using plugins ([#14262](https://github.com/tailwindlabs/tailwindcss/pull/14262))
- Fix fallback values when using the CSS `theme()` function ([#14262](https://github.com/tailwindlabs/tailwindcss/pull/14262))
- Fix support for declaration fallbacks in plugins ([#14265](https://github.com/tailwindlabs/tailwindcss/pull/14265))
- Support bare values when using `tailwindcss/defaultTheme` ([#14257](https://github.com/tailwindlabs/tailwindcss/pull/14257))
- Correctly update builds when using the Vite extension with `build --watch` ([#14269](https://github.com/tailwindlabs/tailwindcss/pull/14269))

### Changed

- Remove named opacity support for color opacity modifiers ([#14278](https://github.com/tailwindlabs/tailwindcss/pull/14278))

## [4.0.0-alpha.20] - 2024-08-23

### Added

- Add support for `addBase` plugins using the `@plugin` directive ([#14172](https://github.com/tailwindlabs/tailwindcss/pull/14172))
- Add support for the `tailwindcss/plugin` export ([#14173](https://github.com/tailwindlabs/tailwindcss/pull/14173))
- Add support for the `theme()` function in plugins ([#14207](https://github.com/tailwindlabs/tailwindcss/pull/14207))
- Add support for `addComponents`, `matchComponents`, `prefix` plugin APIs ([#14221](https://github.com/tailwindlabs/tailwindcss/pull/14221))
- Add support for `tailwindcss/colors` and `tailwindcss/defaultTheme` exports for use with plugins ([#14221](https://github.com/tailwindlabs/tailwindcss/pull/14221))
- Add support for the `@tailwindcss/typography` and `@tailwindcss/forms` plugins ([#14221](https://github.com/tailwindlabs/tailwindcss/pull/14221))
- Add support for the `theme()` function in CSS and class names ([#14177](https://github.com/tailwindlabs/tailwindcss/pull/14177))
- Add support for matching multiple utility definitions for one candidate ([#14231](https://github.com/tailwindlabs/tailwindcss/pull/14231))

### Fixed

- Don't wrap relative selectors in arbitrary variants with `:is(…)` ([#14203](https://github.com/tailwindlabs/tailwindcss/pull/14203))

## [4.0.0-alpha.19] - 2024-08-09

### Added

- Add support for `inline` option when defining `@theme` values ([#14095](https://github.com/tailwindlabs/tailwindcss/pull/14095))
- Add `inert` variant ([#14129](https://github.com/tailwindlabs/tailwindcss/pull/14129))
- Add support for explicitly registering content paths using new `@source` at-rule ([#14078](https://github.com/tailwindlabs/tailwindcss/pull/14078))
- Add support for scanning `<style>` tags in Vue files to the Vite plugin ([#14158](https://github.com/tailwindlabs/tailwindcss/pull/14158))
- Add support for basic `addUtilities` and `matchUtilities` plugins using the `@plugin` directive ([#14114](https://github.com/tailwindlabs/tailwindcss/pull/14114))

### Fixed

- Ensure `@apply` works inside `@utility` ([#14144](https://github.com/tailwindlabs/tailwindcss/pull/14144))

## [4.0.0-alpha.18] - 2024-07-25

### Added

- Add support for basic `addVariant` plugins with new `@plugin` directive ([#13982](https://github.com/tailwindlabs/tailwindcss/pull/13982), [#14008](https://github.com/tailwindlabs/tailwindcss/pull/14008))
- Add `@variant` at-rule for defining custom variants in CSS ([#13992](https://github.com/tailwindlabs/tailwindcss/pull/13992), [#14008](https://github.com/tailwindlabs/tailwindcss/pull/14008))
- Add `@utility` at-rule for defining custom utilities in CSS ([#14044](https://github.com/tailwindlabs/tailwindcss/pull/14044))

### Fixed

- Discard invalid classes such as `bg-red-[#000]` ([#13970](https://github.com/tailwindlabs/tailwindcss/pull/13970))
- Fix parsing body-less at-rule without terminating semicolon ([#13978](https://github.com/tailwindlabs/tailwindcss/pull/13978))
- Ensure opacity modifier with variables work with `color-mix()` ([#13972](https://github.com/tailwindlabs/tailwindcss/pull/13972))
- Discard invalid `variants` and `utilities` with modifiers ([#13977](https://github.com/tailwindlabs/tailwindcss/pull/13977))
- Add missing utilities that exist in v3, such as `resize`, `fill-none`, `accent-none`, `drop-shadow-none`, and negative `hue-rotate` and `backdrop-hue-rotate` utilities ([#13971](https://github.com/tailwindlabs/tailwindcss/pull/13971))
- Don’t allow at-rule-only variants to be compounded ([#14015](https://github.com/tailwindlabs/tailwindcss/pull/14015))
- Ensure compound variants work with variants with multiple selectors ([#14016](https://github.com/tailwindlabs/tailwindcss/pull/14016))
- Ensure attribute values in `data-*` and `aria-*` modifiers are always quoted in the generated CSS ([#14040](https://github.com/tailwindlabs/tailwindcss/pull/14037))

### Changed

- Reduce the specificity of the `*` variant so those styles can be overridden by child elements ([#14056](https://github.com/tailwindlabs/tailwindcss/pull/14056))

## [4.0.0-alpha.17] - 2024-07-04

### Added

- Add `rounded-4xl` utility ([#13827](https://github.com/tailwindlabs/tailwindcss/pull/13827))
- Add `backdrop-blur-none` and `blur-none` utilities ([#13831](https://github.com/tailwindlabs/tailwindcss/pull/13831))
- Include variable in output for bare utilities like `rounded` ([#13836](https://github.com/tailwindlabs/tailwindcss/pull/13836))

### Fixed

- Support combining arbitrary shadows without a color with shadow color utilities ([#13876](https://github.com/tailwindlabs/tailwindcss/pull/13876))
- Ensure `@property` fallbacks work correctly with properties with no `initial-value` ([#13949](https://github.com/tailwindlabs/tailwindcss/pull/13949))

## [4.0.0-alpha.16] - 2024-06-07

### Added

- Add `nth-*` variants ([#13661](https://github.com/tailwindlabs/tailwindcss/pull/13661))
- Add `bg-linear-*` utilities as an alias for the existing `bg-gradient-*` utilities ([#13783](https://github.com/tailwindlabs/tailwindcss/pull/13783))
- Support arbitrary linear gradient angles (e.g. `bg-linear-[125deg]`) ([#13783](https://github.com/tailwindlabs/tailwindcss/pull/13783))

### Fixed

- Use `length` data type for `background-size` instead of `background-position` ([#13771](https://github.com/tailwindlabs/tailwindcss/pull/13771))
- Support negative values for `{col,row}-{start,end}` utilities ([#13780](https://github.com/tailwindlabs/tailwindcss/pull/13780))
- Use long form `<length> | <percentage>` syntax for properties ([#13660](https://github.com/tailwindlabs/tailwindcss/pull/13660))
- Fix background position value of `bg-right-top`, `bg-right-bottom`, `bg-left-bottom` and `bg-left-top` ([#13806](https://github.com/tailwindlabs/tailwindcss/pull/13806))

## [4.0.0-alpha.15] - 2024-05-08

### Fixed

- Make sure `contain-*` utility variables resolve to a valid value ([#13521](https://github.com/tailwindlabs/tailwindcss/pull/13521))
- Support unbalanced parentheses and braces in quotes in arbitrary values and variants ([#13608](https://github.com/tailwindlabs/tailwindcss/pull/13608))
- Add fallbacks for `@property` rules for Firefox ([#13655](https://github.com/tailwindlabs/tailwindcss/pull/13655))

### Changed

- Use `rem` units for breakpoints by default instead of `px` ([#13469](https://github.com/tailwindlabs/tailwindcss/pull/13469))
- Use natural sorting when sorting classes ([#13507](https://github.com/tailwindlabs/tailwindcss/pull/13507), [#13532](https://github.com/tailwindlabs/tailwindcss/pull/13532))

## [4.0.0-alpha.14] - 2024-04-09

### Fixed

- Ensure deterministic SSR builds in `@tailwindcss/vite` ([#13457](https://github.com/tailwindlabs/tailwindcss/pull/13457))

### Changed

- Apply variants from left to right instead of inside-out ([#13478](https://github.com/tailwindlabs/tailwindcss/pull/13478))
- Don't special-case `[hidden]` elements in `space-*`/`divide-*` utilities ([#13459](https://github.com/tailwindlabs/tailwindcss/pull/13459))

## [4.0.0-alpha.13] - 2024-04-04

### Fixed

- Always inline values for `shadow-*` utilities to ensure shadow colors work correctly ([#13449](https://github.com/tailwindlabs/tailwindcss/pull/13449))

## [4.0.0-alpha.12] - 2024-04-04

### Fixed

- Enable Vite's `waitForRequestsIdle()` for client requests only ([#13394](https://github.com/tailwindlabs/tailwindcss/pull/13394))
- Make sure `::first-letter` respects `::selection` styles ([#13408](https://github.com/tailwindlabs/tailwindcss/pull/13408))

## [4.0.0-alpha.11] - 2024-03-27

### Added

- Make `rotate-x/y/z-*` utilities composable ([#13319](https://github.com/tailwindlabs/tailwindcss/pull/13319))
- Apply Vite's CSS plugin transform to Tailwind-generated CSS in `@tailwindcss/vite` (e.g. inlining images) ([#13218](https://github.com/tailwindlabs/tailwindcss/pull/13218))
- Add `starting` variant for `@starting-style` ([#13329](https://github.com/tailwindlabs/tailwindcss/pull/13329))
- Target `:popover-open` in existing `open` variant ([#13331](https://github.com/tailwindlabs/tailwindcss/pull/13331))

### Fixed

- Remove percentage values for `translate-z` utilities ([#13321](https://github.com/tailwindlabs/tailwindcss/pull/13321), [#13327](https://github.com/tailwindlabs/tailwindcss/pull/13327))
- Generate unique CSS bundle hashes in `@tailwindcss/vite` when Tailwind-generated CSS changes ([#13218](https://github.com/tailwindlabs/tailwindcss/pull/13218))
- Inherit letter spacing in form controls ([#13328](https://github.com/tailwindlabs/tailwindcss/pull/13328))
- Ensure `build` command is executed when using `--output` instead of `-o` ([#13369](https://github.com/tailwindlabs/tailwindcss/pull/13369))
- Prevent `@tailwindcss/vite` from hanging in serve mode ([#13380](https://github.com/tailwindlabs/tailwindcss/pull/13380))

## [4.0.0-alpha.10] - 2024-03-19

### Added

- Add `inherit` as a universal color ([#13258](https://github.com/tailwindlabs/tailwindcss/pull/13258))
- Add 3D transform utilities ([#13248](https://github.com/tailwindlabs/tailwindcss/pull/13248), [#13288](https://github.com/tailwindlabs/tailwindcss/pull/13288))

### Fixed

- Validate bare values ([#13245](https://github.com/tailwindlabs/tailwindcss/pull/13245))
- Parse candidates in `.svelte` files with `class:abc="condition"` syntax ([#13274](https://github.com/tailwindlabs/tailwindcss/pull/13274))

### Changed

- Inline `@import` rules in `tailwindcss/index.css` at publish time for better performance ([#13233](https://github.com/tailwindlabs/tailwindcss/pull/13233))
- Include custom properties with fallbacks in utility class values ([#13177](https://github.com/tailwindlabs/tailwindcss/pull/13177))

## [4.0.0-alpha.9] - 2024-03-13

### Added

- Support `@theme reference { … }` for defining theme values without emitting variables ([#13222](https://github.com/tailwindlabs/tailwindcss/pull/13222))

### Fixed

- Fix incorrect properties in line-clamp utilities ([#13220](https://github.com/tailwindlabs/tailwindcss/pull/13220))
- Don't rely on existence of `--default-transition-*` variables in `transition-*` utilities ([#13219](https://github.com/tailwindlabs/tailwindcss/pull/13219))

### Changed

- Move `optimizeCss` to the packages where it's used ([#13230](https://github.com/tailwindlabs/tailwindcss/pull/13230))

## [4.0.0-alpha.8] - 2024-03-11

### Fixed

- Ensure `scale-*` utilities support percentage values ([#13182](https://github.com/tailwindlabs/tailwindcss/pull/13182))
- Prevent `content-none` from being overridden when conditionally styling `::before`/`::after` ([#13187](https://github.com/tailwindlabs/tailwindcss/pull/13187))
- Remove default borders from `iframe` elements ([#13189](https://github.com/tailwindlabs/tailwindcss/pull/13189))

### Changed

- Replace `--radius-none` and `--radius-full` theme values with static `rounded-none` and `rounded-full` utilities ([#13186](https://github.com/tailwindlabs/tailwindcss/pull/13186))

### Added

- Improve performance of incremental rebuilds for `@tailwindcss/cli` ([#13169](https://github.com/tailwindlabs/tailwindcss/pull/13169))
- Improve performance of incremental rebuilds for `@tailwindcss/postcss` ([#13170](https://github.com/tailwindlabs/tailwindcss/pull/13170))

## [4.0.0-alpha.7] - 2024-03-08

### Added

- Add `font-stretch` utilities ([#13153](https://github.com/tailwindlabs/tailwindcss/pull/13153))
- Publish packages with [npm provenance](https://docs.npmjs.com/generating-provenance-statements) ([#13160](https://github.com/tailwindlabs/tailwindcss/pull/13160))
- Build native packages for Android ([#13115](https://github.com/tailwindlabs/tailwindcss/pull/13115), [#13161](https://github.com/tailwindlabs/tailwindcss/pull/13161))
- Make CSS optimization and minification configurable in PostCSS plugin and CLI ([#13130](https://github.com/tailwindlabs/tailwindcss/pull/13130))

### Fixed

- Don't error on `@apply` with leading/trailing whitespace ([#13144](https://github.com/tailwindlabs/tailwindcss/pull/13144))
- Correctly parse CSS using Windows line endings ([#13162](https://github.com/tailwindlabs/tailwindcss/pull/13162))

## [4.0.0-alpha.6] - 2024-03-07

### Fixed

- Only set `border-style` for appropriate border side ([#13124](https://github.com/tailwindlabs/tailwindcss/pull/13124))

### Changed

- Error when `@theme` contains unsupported rules/declarations ([#13125](https://github.com/tailwindlabs/tailwindcss/pull/13125))

## [4.0.0-alpha.5] - 2024-03-06

### Fixed

- Don't scan ignored files even if a `.git` folder is not present ([#13119](https://github.com/tailwindlabs/tailwindcss/pull/13119))

## [4.0.0-alpha.4] - 2024-03-06

### Fixed

- Support importing framework CSS files without including a `.css` extension ([#13110](https://github.com/tailwindlabs/tailwindcss/pull/13110))

## [4.0.0-alpha.3] - 2024-03-06

### Added

- Support putting the important modifier at the beginning of a utility ([#13103](https://github.com/tailwindlabs/tailwindcss/pull/13103))

### Fixed

- Node compatibility fix ([#13104](https://github.com/tailwindlabs/tailwindcss/pull/13104))

### Changes

- Drop deprecated `decoration-slice` and `decoration-clone` utilities ([#13107](https://github.com/tailwindlabs/tailwindcss/pull/13107))

## [4.0.0-alpha.2] - 2024-03-06

### Changed

- Move the CLI into a separate `@tailwindcss/cli` package ([#13095](https://github.com/tailwindlabs/tailwindcss/pull/13095))

## [4.0.0-alpha.1] - 2024-03-06

- First 4.0.0-alpha.1 release

## [3.4.17] - 2024-12-17

### Fixed

- Work around Node v22.12+ issue ([#15421](https://github.com/tailwindlabs/tailwindcss/pull/15421))

## [3.4.16] - 2024-12-03

### Fixed

- Ensure the TypeScript types for `PluginsConfig` allow `undefined` values ([#14668](https://github.com/tailwindlabs/tailwindcss/pull/14668))

# Changed

- Bumped lilconfig to v3.x ([#15289](https://github.com/tailwindlabs/tailwindcss/pull/15289))

## [3.4.15] - 2024-11-14

- Bump versions for security vulnerabilities ([#14697](https://github.com/tailwindlabs/tailwindcss/pull/14697))
- Ensure the TypeScript types for the `boxShadow` theme configuration allows arrays ([#14856](https://github.com/tailwindlabs/tailwindcss/pull/14856))
- Set fallback for opacity variables to ensure setting colors with the `selection:*` variant works in Chrome 131 ([#15003](https://github.com/tailwindlabs/tailwindcss/pull/15003))

## [3.4.14] - 2024-10-15

### Fixed

- Don't set `display: none` on elements that use `hidden="until-found"` ([#14625](https://github.com/tailwindlabs/tailwindcss/pull/14625))

## [3.4.13] - 2024-09-23

### Fixed

- Improve source glob verification performance ([#14481](https://github.com/tailwindlabs/tailwindcss/pull/14481))

## [3.4.12] - 2024-09-17

### Fixed

- Ensure using `@apply` with utilities that use `@defaults` works with rules defined in the base layer when using `optimizeUniversalDefaults` ([#14427](https://github.com/tailwindlabs/tailwindcss/pull/14427))

## [3.4.11] - 2024-09-11

### Fixed

- Allow `anchor-size(…)` in arbitrary values ([#14393](https://github.com/tailwindlabs/tailwindcss/pull/14393))

## [3.4.10] - 2024-08-13

### Fixed

- Bump versions of plugins in the Standalone CLI ([#14185](https://github.com/tailwindlabs/tailwindcss/pull/14185))

## [3.4.9] - 2024-08-08

### Fixed

- No longer warns when broad glob patterns are detecting `vendor` folders

## [3.4.8] - 2024-08-07

### Fixed

- Fix minification when using nested CSS ([#14105](https://github.com/tailwindlabs/tailwindcss/pull/14105))
- Warn when broad glob patterns are used in the content configuration ([#14140](https://github.com/tailwindlabs/tailwindcss/pull/14140))

## [3.4.7] - 2024-07-25

### Fixed

- Fix class detection in Slim templates with attached attributes and ID ([#14019](https://github.com/tailwindlabs/tailwindcss/pull/14019))
- Ensure attribute values in `data-*` and `aria-*` modifiers are always quoted in the generated CSS ([#14037](https://github.com/tailwindlabs/tailwindcss/pull/14037))

## [3.4.6] - 2024-07-16

### Fixed

- Fix detection of some utilities in Slim/Pug templates ([#14006](https://github.com/tailwindlabs/tailwindcss/pull/14006))

### Changed

- Loosen `:is()` wrapping rules when using an important selector ([#13900](https://github.com/tailwindlabs/tailwindcss/pull/13900))

## [3.4.5] - 2024-07-15

### Fixed

- Disable automatic `var()` injection for anchor properties ([#13826](https://github.com/tailwindlabs/tailwindcss/pull/13826))
- Use no value instead of `blur(0px)` for `backdrop-blur-none` and `blur-none` utilities ([#13830](https://github.com/tailwindlabs/tailwindcss/pull/13830))
- Add `.mts` and `.cts` config file detection ([#13940](https://github.com/tailwindlabs/tailwindcss/pull/13940))
- Don't generate utilities like `px-1` unnecessarily when using utilities like `px-1.5` ([#13959](https://github.com/tailwindlabs/tailwindcss/pull/13959))
- Always generate `-webkit-backdrop-filter` for `backdrop-*` utilities ([#13997](https://github.com/tailwindlabs/tailwindcss/pull/13997))

## [3.4.4] - 2024-06-05

### Fixed

- Make it possible to use multiple `<alpha-value>` placeholders in a single color definition ([#13740](https://github.com/tailwindlabs/tailwindcss/pull/13740))
- Don't prefix classes in arbitrary values of `has-*`, `group-has-*`, and `peer-has-*` variants ([#13770](https://github.com/tailwindlabs/tailwindcss/pull/13770))
- Support negative values for `{col,row}-{start,end}` utilities ([#13781](https://github.com/tailwindlabs/tailwindcss/pull/13781))
- Update embedded browserslist database ([#13792](https://github.com/tailwindlabs/tailwindcss/pull/13792))

## [3.4.3] - 2024-03-27

### Fixed

- Revert changes to glob handling ([#13384](https://github.com/tailwindlabs/tailwindcss/pull/13384))

## [3.4.2] - 2024-03-27

### Fixed

- Ensure max specificity of `0,0,1` for button and input Preflight rules ([#12735](https://github.com/tailwindlabs/tailwindcss/pull/12735))
- Improve glob handling for folders with `(`, `)`, `[` or `]` in the file path ([#12715](https://github.com/tailwindlabs/tailwindcss/pull/12715))
- Split `:has` rules when using `experimental.optimizeUniversalDefaults` ([#12736](https://github.com/tailwindlabs/tailwindcss/pull/12736))
- Sort arbitrary properties alphabetically across multiple class lists ([#12911](https://github.com/tailwindlabs/tailwindcss/pull/12911))
- Add `mix-blend-plus-darker` utility ([#12923](https://github.com/tailwindlabs/tailwindcss/pull/12923))
- Ensure dashes are allowed in variant modifiers ([#13303](https://github.com/tailwindlabs/tailwindcss/pull/13303))
- Fix crash showing completions in Intellisense when using a custom separator ([#13306](https://github.com/tailwindlabs/tailwindcss/pull/13306))
- Transpile `import.meta.url` in config files ([#13322](https://github.com/tailwindlabs/tailwindcss/pull/13322))
- Reset letter spacing for form elements ([#13150](https://github.com/tailwindlabs/tailwindcss/pull/13150))
- Fix missing `xx-large` and remove double `x-large` absolute size ([#13324](https://github.com/tailwindlabs/tailwindcss/pull/13324))
- Don't error when encountering nested CSS unless trying to `@apply` a class that uses nesting ([#13325](https://github.com/tailwindlabs/tailwindcss/pull/13325))
- Ensure that arbitrary properties respect `important` configuration ([#13353](https://github.com/tailwindlabs/tailwindcss/pull/13353))
- Change dark mode selector so `@apply` works correctly with pseudo elements ([#13379](https://github.com/tailwindlabs/tailwindcss/pull/13379))

## [3.4.1] - 2024-01-05

### Fixed

- Don't remove keyframe stops when using important utilities ([#12639](https://github.com/tailwindlabs/tailwindcss/pull/12639))
- Don't add spaces to gradients and grid track names when followed by `calc()` ([#12704](https://github.com/tailwindlabs/tailwindcss/pull/12704))
- Restore old behavior for `class` dark mode strategy ([#12717](https://github.com/tailwindlabs/tailwindcss/pull/12717))
- Improve glob handling for folders with `(`, `)`, `[` or `]` in the file path ([#12715](https://github.com/tailwindlabs/tailwindcss/pull/12715))

### Added

- Add new `selector` and `variant` strategies for dark mode ([#12717](https://github.com/tailwindlabs/tailwindcss/pull/12717))

### Changed

- Support `rtl` and `ltr` variants on same element as `dir` attribute ([#12717](https://github.com/tailwindlabs/tailwindcss/pull/12717))

## [3.4.0] - 2023-12-19

### Added

- Add `svh`, `lvh`, and `dvh` values to default `height`/`min-height`/`max-height` theme ([#11317](https://github.com/tailwindlabs/tailwindcss/pull/11317))
- Add `has-*` variants for `:has(...)` pseudo-class ([#11318](https://github.com/tailwindlabs/tailwindcss/pull/11318))
- Add `text-wrap` utilities including `text-balance` and `text-pretty` ([#11320](https://github.com/tailwindlabs/tailwindcss/pull/11320), [#12031](https://github.com/tailwindlabs/tailwindcss/pull/12031))
- Extend default `opacity` scale to include all steps of 5 ([#11832](https://github.com/tailwindlabs/tailwindcss/pull/11832))
- Update Preflight `html` styles to include shadow DOM `:host` pseudo-class ([#11200](https://github.com/tailwindlabs/tailwindcss/pull/11200))
- Increase default values for `grid-rows-*` utilities from 1–6 to 1–12 ([#12180](https://github.com/tailwindlabs/tailwindcss/pull/12180))
- Add `size-*` utilities ([#12287](https://github.com/tailwindlabs/tailwindcss/pull/12287))
- Add utilities for CSS subgrid ([#12298](https://github.com/tailwindlabs/tailwindcss/pull/12298))
- Add spacing scale to `min-w-*`, `min-h-*`, and `max-w-*` utilities ([#12300](https://github.com/tailwindlabs/tailwindcss/pull/12300))
- Add `forced-color-adjust` utilities ([#11931](https://github.com/tailwindlabs/tailwindcss/pull/11931))
- Add `forced-colors` variant ([#11694](https://github.com/tailwindlabs/tailwindcss/pull/11694), [#12582](https://github.com/tailwindlabs/tailwindcss/pull/12582))
- Add `appearance-auto` utility ([#12404](https://github.com/tailwindlabs/tailwindcss/pull/12404))
- Add logical property values for `float` and `clear` utilities ([#12480](https://github.com/tailwindlabs/tailwindcss/pull/12480))
- Add `*` variant for targeting direct children ([#12551](https://github.com/tailwindlabs/tailwindcss/pull/12551))

### Changed

- Simplify the `sans` font-family stack ([#11748](https://github.com/tailwindlabs/tailwindcss/pull/11748))
- Disable the tap highlight overlay on iOS ([#12299](https://github.com/tailwindlabs/tailwindcss/pull/12299))
- Improve relative precedence of `rtl`, `ltr`, `forced-colors`, and `dark` variants ([#12584](https://github.com/tailwindlabs/tailwindcss/pull/12584))

## [3.3.7] - 2023-12-18

### Fixed

- Fix support for container query utilities with arbitrary values ([#12534](https://github.com/tailwindlabs/tailwindcss/pull/12534))
- Fix custom config loading in Standalone CLI ([#12616](https://github.com/tailwindlabs/tailwindcss/pull/12616))

## [3.3.6] - 2023-12-04

### Fixed

- Don’t add spaces to negative numbers following a comma ([#12324](https://github.com/tailwindlabs/tailwindcss/pull/12324))
- Don't emit `@config` in CSS when watching via the CLI ([#12327](https://github.com/tailwindlabs/tailwindcss/pull/12327))
- Improve types for `resolveConfig` ([#12272](https://github.com/tailwindlabs/tailwindcss/pull/12272))
- Ensure configured `font-feature-settings` for `mono` are included in Preflight ([#12342](https://github.com/tailwindlabs/tailwindcss/pull/12342))
- Improve candidate detection in minified JS arrays (without spaces) ([#12396](https://github.com/tailwindlabs/tailwindcss/pull/12396))
- Don't crash when given applying a variant to a negated version of a simple utility ([#12514](https://github.com/tailwindlabs/tailwindcss/pull/12514))
- Fix support for slashes in arbitrary modifiers ([#12515](https://github.com/tailwindlabs/tailwindcss/pull/12515))
- Fix source maps of variant utilities that come from an `@layer` rule ([#12508](https://github.com/tailwindlabs/tailwindcss/pull/12508))
- Fix loading of built-in plugins when using an ESM or TypeScript config with the Standalone CLI ([#12506](https://github.com/tailwindlabs/tailwindcss/pull/12506))

## [3.3.5] - 2023-10-25

### Fixed

- Fix incorrect spaces around `-` in `calc()` expression ([#12283](https://github.com/tailwindlabs/tailwindcss/pull/12283))

## [3.3.4] - 2023-10-24

### Fixed

- Improve normalisation of `calc()`-like functions ([#11686](https://github.com/tailwindlabs/tailwindcss/pull/11686))
- Skip `calc()` normalisation in nested `theme()` calls ([#11705](https://github.com/tailwindlabs/tailwindcss/pull/11705))
- Fix incorrectly generated CSS when using square brackets inside arbitrary properties ([#11709](https://github.com/tailwindlabs/tailwindcss/pull/11709))
- Make `content` optional for presets in TypeScript types ([#11730](https://github.com/tailwindlabs/tailwindcss/pull/11730))
- Handle variable colors that have variable fallback values ([#12049](https://github.com/tailwindlabs/tailwindcss/pull/12049))
- Batch reading content files to prevent `too many open files` error ([#12079](https://github.com/tailwindlabs/tailwindcss/pull/12079))
- Skip over classes inside `:not(…)` when nested in an at-rule ([#12105](https://github.com/tailwindlabs/tailwindcss/pull/12105))
- Update types to work with `Node16` module resolution ([#12097](https://github.com/tailwindlabs/tailwindcss/pull/12097))
- Don’t crash when important and parent selectors are equal in `@apply` ([#12112](https://github.com/tailwindlabs/tailwindcss/pull/12112))
- Eliminate irrelevant rules when applying variants ([#12113](https://github.com/tailwindlabs/tailwindcss/pull/12113))
- Improve RegEx parser, reduce possibilities as the key for arbitrary properties ([#12121](https://github.com/tailwindlabs/tailwindcss/pull/12121))
- Fix sorting of utilities that share multiple candidates ([#12173](https://github.com/tailwindlabs/tailwindcss/pull/12173))
- Ensure variants with arbitrary values and a modifier are correctly matched in the RegEx based parser ([#12179](https://github.com/tailwindlabs/tailwindcss/pull/12179))
- Fix crash when watching renamed files on FreeBSD ([#12193](https://github.com/tailwindlabs/tailwindcss/pull/12193))
- Allow plugins from a parent document to be used in an iframe ([#12208](https://github.com/tailwindlabs/tailwindcss/pull/12208))
- Add types for `tailwindcss/nesting` ([#12269](https://github.com/tailwindlabs/tailwindcss/pull/12269))
- Bump `jiti`, `fast-glob`, and `browserlist` dependencies ([#11550](https://github.com/tailwindlabs/tailwindcss/pull/11550))
- Improve automatic `var` injection for properties that accept a `<dashed-ident>` ([#12236](https://github.com/tailwindlabs/tailwindcss/pull/12236))

## [3.3.3] - 2023-07-13

### Fixed

- Fix issue where some pseudo-element variants generated the wrong selector ([#10943](https://github.com/tailwindlabs/tailwindcss/pull/10943), [#10962](https://github.com/tailwindlabs/tailwindcss/pull/10962), [#11111](https://github.com/tailwindlabs/tailwindcss/pull/11111))
- Make font settings propagate into buttons, inputs, etc. ([#10940](https://github.com/tailwindlabs/tailwindcss/pull/10940))
- Fix parsing of `theme()` inside `calc()` when there are no spaces around operators ([#11157](https://github.com/tailwindlabs/tailwindcss/pull/11157))
- Ensure `repeating-conic-gradient` is detected as an image ([#11180](https://github.com/tailwindlabs/tailwindcss/pull/11180))
- Move unknown pseudo-elements outside of `:is` by default ([#11345](https://github.com/tailwindlabs/tailwindcss/pull/11345))
- Escape animation names when prefixes contain special characters ([#11470](https://github.com/tailwindlabs/tailwindcss/pull/11470))
- Don't prefix arbitrary classes in `group` and `peer` variants ([#11454](https://github.com/tailwindlabs/tailwindcss/pull/11454))
- Sort classes using position of first matching rule ([#11504](https://github.com/tailwindlabs/tailwindcss/pull/11504))
- Allow variant to be an at-rule without a prelude ([#11589](https://github.com/tailwindlabs/tailwindcss/pull/11589))
- Make PostCSS plugin async to improve performance ([#11548](https://github.com/tailwindlabs/tailwindcss/pull/11548))
- Don’t error when a config file is missing ([f97759f](https://github.com/tailwindlabs/tailwindcss/commit/f97759f808d15ace66647b1405744fcf95a392e5))

### Added

- Add `aria-busy` utility ([#10966](https://github.com/tailwindlabs/tailwindcss/pull/10966))

### Changed

- Reset padding for `<dialog>` elements in preflight ([#11069](https://github.com/tailwindlabs/tailwindcss/pull/11069))

## [3.3.2] - 2023-04-25

### Fixed

- Don’t move unknown pseudo-elements to the end of selectors ([#10943](https://github.com/tailwindlabs/tailwindcss/pull/10943), [#10962](https://github.com/tailwindlabs/tailwindcss/pull/10962))
- Inherit gradient stop positions when using variants ([#11002](https://github.com/tailwindlabs/tailwindcss/pull/11002))
- Honor default `to` position of gradient when using implicit transparent colors ([#11002](https://github.com/tailwindlabs/tailwindcss/pull/11002))
- Ensure `@tailwindcss/oxide` doesn't leak in the stable engine ([#10988](https://github.com/tailwindlabs/tailwindcss/pull/10988))
- Ensure multiple `theme(spacing[5])` calls with bracket notation in arbitrary properties work ([#11039](https://github.com/tailwindlabs/tailwindcss/pull/11039))
- Normalize arbitrary modifiers ([#11057](https://github.com/tailwindlabs/tailwindcss/pull/11057))

### Changed

- Drop support for Node.js v12 ([#11089](https://github.com/tailwindlabs/tailwindcss/pull/11089))

## [3.3.1] - 2023-03-30

### Fixed

- Fix edge case bug when loading a TypeScript config file with webpack ([#10898](https://github.com/tailwindlabs/tailwindcss/pull/10898))
- Fix variant, `@apply`, and `important` selectors when using `:is()` or `:has()` with pseudo-elements ([#10903](https://github.com/tailwindlabs/tailwindcss/pull/10903))
- Fix `safelist` config types ([#10901](https://github.com/tailwindlabs/tailwindcss/pull/10901))
- Fix build errors caused by `@tailwindcss/line-clamp` warning ([#10915](https://github.com/tailwindlabs/tailwindcss/pull/10915), [#10919](https://github.com/tailwindlabs/tailwindcss/pull/10919))
- Fix "process is not defined" error ([#10919](https://github.com/tailwindlabs/tailwindcss/pull/10919))

## [3.3.0] - 2023-03-27

### Added

- Support ESM and TypeScript config files ([#10785](https://github.com/tailwindlabs/tailwindcss/pull/10785))
- Extend default color palette with new 950 shades ([#10879](https://github.com/tailwindlabs/tailwindcss/pull/10879))
- Add `line-height` modifier support to `font-size` utilities ([#9875](https://github.com/tailwindlabs/tailwindcss/pull/9875))
- Add support for using variables as arbitrary values without `var(...)` ([#9880](https://github.com/tailwindlabs/tailwindcss/pull/9880), [#9962](https://github.com/tailwindlabs/tailwindcss/pull/9962))
- Add logical properties support for inline direction ([#10166](https://github.com/tailwindlabs/tailwindcss/pull/10166))
- Add `hyphens` utilities ([#10071](https://github.com/tailwindlabs/tailwindcss/pull/10071))
- Add `from-{position}`, `via-{position}` and `to-{position}` utilities ([#10886](https://github.com/tailwindlabs/tailwindcss/pull/10886))
- Add `list-style-image` utilities ([#10817](https://github.com/tailwindlabs/tailwindcss/pull/10817))
- Add `caption-side` utilities ([#10470](https://github.com/tailwindlabs/tailwindcss/pull/10470))
- Add `line-clamp` utilities from `@tailwindcss/line-clamp` to core ([#10768](https://github.com/tailwindlabs/tailwindcss/pull/10768), [#10876](https://github.com/tailwindlabs/tailwindcss/pull/10876), [#10862](https://github.com/tailwindlabs/tailwindcss/pull/10862))
- Add `delay-0` and `duration-0` utilities ([#10294](https://github.com/tailwindlabs/tailwindcss/pull/10294))
- Add `justify-normal` and `justify-stretch` utilities ([#10560](https://github.com/tailwindlabs/tailwindcss/pull/10560))
- Add `content-normal` and `content-stretch` utilities ([#10645](https://github.com/tailwindlabs/tailwindcss/pull/10645))
- Add `whitespace-break-spaces` utility ([#10729](https://github.com/tailwindlabs/tailwindcss/pull/10729))
- Add support for configuring default `font-variation-settings` for a `font-family` ([#10034](https://github.com/tailwindlabs/tailwindcss/pull/10034), [#10515](https://github.com/tailwindlabs/tailwindcss/pull/10515))

### Fixed

- Disallow using multiple selectors in arbitrary variants ([#10655](https://github.com/tailwindlabs/tailwindcss/pull/10655))
- Sort class lists deterministically for Prettier plugin ([#10672](https://github.com/tailwindlabs/tailwindcss/pull/10672))
- Ensure CLI builds have a non-zero exit code on failure ([#10703](https://github.com/tailwindlabs/tailwindcss/pull/10703))
- Ensure module dependencies for value `null`, is an empty `Set` ([#10877](https://github.com/tailwindlabs/tailwindcss/pull/10877))
- Fix format assumption when resolving module dependencies ([#10878](https://github.com/tailwindlabs/tailwindcss/pull/10878))

### Changed

- Mark `rtl` and `ltr` variants as stable and remove warnings ([#10764](https://github.com/tailwindlabs/tailwindcss/pull/10764))
- Use `inset` instead of `top`, `right`, `bottom`, and `left` properties ([#10765](https://github.com/tailwindlabs/tailwindcss/pull/10765))
- Make `dark` and `rtl`/`ltr` variants insensitive to DOM order ([#10766](https://github.com/tailwindlabs/tailwindcss/pull/10766))
- Use `:is` to make important selector option insensitive to DOM order ([#10835](https://github.com/tailwindlabs/tailwindcss/pull/10835))

## [3.2.7] - 2023-02-16

### Fixed

- Fix use of `:where(.btn)` when matching `!btn` ([#10601](https://github.com/tailwindlabs/tailwindcss/pull/10601))
- Revert including `outline-color` in `transition` and `transition-colors` by default ([#10604](https://github.com/tailwindlabs/tailwindcss/pull/10604))

## [3.2.6] - 2023-02-08

### Fixed

- Fix installation failing with yarn and pnpm by dropping `oxide-api-shim` ([add1636](https://github.com/tailwindlabs/tailwindcss/commit/add16364b4b1100e1af23ad1ca6900a0b53cbba0))

## [3.2.5] - 2023-02-08

### Added

- Add standalone CLI build for 64-bit Windows on ARM (`node16-win-arm64`) ([#10001](https://github.com/tailwindlabs/tailwindcss/pull/10001))

### Fixed

- Cleanup unused `variantOrder` ([#9829](https://github.com/tailwindlabs/tailwindcss/pull/9829))
- Fix `foo-[abc]/[def]` not being handled correctly ([#9866](https://github.com/tailwindlabs/tailwindcss/pull/9866))
- Add container queries plugin to standalone CLI ([#9865](https://github.com/tailwindlabs/tailwindcss/pull/9865))
- Support renaming of output files by PostCSS plugins in CLI ([#9944](https://github.com/tailwindlabs/tailwindcss/pull/9944))
- Improve return value of `resolveConfig`, unwrap `ResolvableTo` ([#9972](https://github.com/tailwindlabs/tailwindcss/pull/9972))
- Clip unbalanced brackets in arbitrary values ([#9973](https://github.com/tailwindlabs/tailwindcss/pull/9973))
- Don’t reorder webkit scrollbar pseudo elements ([#9991](https://github.com/tailwindlabs/tailwindcss/pull/9991))
- Deterministic sorting of arbitrary variants ([#10016](https://github.com/tailwindlabs/tailwindcss/pull/10016))
- Add `data` key to theme types ([#10023](https://github.com/tailwindlabs/tailwindcss/pull/10023))
- Prevent invalid arbitrary variant selectors from failing the build ([#10059](https://github.com/tailwindlabs/tailwindcss/pull/10059))
- Properly handle subtraction followed by a variable ([#10074](https://github.com/tailwindlabs/tailwindcss/pull/10074))
- Fix missing `string[]` in the `theme.dropShadow` types ([#10072](https://github.com/tailwindlabs/tailwindcss/pull/10072))
- Update list of length units ([#10100](https://github.com/tailwindlabs/tailwindcss/pull/10100))
- Fix not matching arbitrary properties when closely followed by square brackets ([#10212](https://github.com/tailwindlabs/tailwindcss/pull/10212))
- Allow direct nesting in `root` or `@layer` nodes ([#10229](https://github.com/tailwindlabs/tailwindcss/pull/10229))
- Don't prefix classes in arbitrary variants ([#10214](https://github.com/tailwindlabs/tailwindcss/pull/10214))
- Fix perf regression when checking for changed content ([#10234](https://github.com/tailwindlabs/tailwindcss/pull/10234))
- Fix missing `blocklist` member in the `Config` type ([#10239](https://github.com/tailwindlabs/tailwindcss/pull/10239))
- Escape group names in selectors ([#10276](https://github.com/tailwindlabs/tailwindcss/pull/10276))
- Consider earlier variants before sorting functions ([#10288](https://github.com/tailwindlabs/tailwindcss/pull/10288))
- Allow variants with slashes ([#10336](https://github.com/tailwindlabs/tailwindcss/pull/10336))
- Ensure generated CSS is always sorted in the same order for a given set of templates ([#10382](https://github.com/tailwindlabs/tailwindcss/pull/10382))
- Handle variants when the same class appears multiple times in a selector ([#10397](https://github.com/tailwindlabs/tailwindcss/pull/10397))
- Handle group/peer variants with quoted strings ([#10400](https://github.com/tailwindlabs/tailwindcss/pull/10400))
- Parse alpha value from rgba/hsla colors when using variables ([#10429](https://github.com/tailwindlabs/tailwindcss/pull/10429))
- Sort by `layer` inside `variants` layer ([#10505](https://github.com/tailwindlabs/tailwindcss/pull/10505))
- Add `--watch=always` option to prevent exit when stdin closes ([#9966](https://github.com/tailwindlabs/tailwindcss/pull/9966))

### Changed

- Alphabetize `theme` keys in default config ([#9953](https://github.com/tailwindlabs/tailwindcss/pull/9953))
- Update esbuild to v17 ([#10368](https://github.com/tailwindlabs/tailwindcss/pull/10368))
- Include `outline-color` in `transition` and `transition-colors` utilities ([#10385](https://github.com/tailwindlabs/tailwindcss/pull/10385))

## [3.2.4] - 2022-11-11

### Added

- Add `blocklist` option to prevent generating unwanted CSS ([#9812](https://github.com/tailwindlabs/tailwindcss/pull/9812))

### Fixed

- Fix watching of files on Linux when renames are involved ([#9796](https://github.com/tailwindlabs/tailwindcss/pull/9796))
- Make sure errors are always displayed when watching for changes ([#9810](https://github.com/tailwindlabs/tailwindcss/pull/9810))

## [3.2.3] - 2022-11-09

### Fixed

- Fixed use of `raw` content in the CLI ([#9773](https://github.com/tailwindlabs/tailwindcss/pull/9773))
- Pick up changes from files that are both context and content deps ([#9787](https://github.com/tailwindlabs/tailwindcss/pull/9787))
- Sort pseudo-elements ONLY after classes when using variants and `@apply` ([#9765](https://github.com/tailwindlabs/tailwindcss/pull/9765))
- Support important utilities in the safelist (pattern must include a `!`) ([#9791](https://github.com/tailwindlabs/tailwindcss/pull/9791))

## [3.2.2] - 2022-11-04

### Fixed

- Escape special characters in resolved content base paths ([#9650](https://github.com/tailwindlabs/tailwindcss/pull/9650))
- Don't reuse container for array returning variant functions ([#9644](https://github.com/tailwindlabs/tailwindcss/pull/9644))
- Exclude non-relevant selectors when generating rules with the important modifier ([#9677](https://github.com/tailwindlabs/tailwindcss/issues/9677))
- Fix merging of arrays during config resolution ([#9706](https://github.com/tailwindlabs/tailwindcss/issues/9706))
- Ensure configured `font-feature-settings` are included in Preflight ([#9707](https://github.com/tailwindlabs/tailwindcss/pull/9707))
- Fix fractional values not being parsed properly inside arbitrary properties ([#9705](https://github.com/tailwindlabs/tailwindcss/pull/9705))
- Fix incorrect selectors when using `@apply` in selectors with combinators and pseudos ([#9722](https://github.com/tailwindlabs/tailwindcss/pull/9722))
- Fix cannot read properties of undefined (reading 'modifier') ([#9656](https://github.com/tailwindlabs/tailwindcss/pull/9656), [aa979d6](https://github.com/tailwindlabs/tailwindcss/commit/aa979d645f8bf4108c5fc938d7c0ba085b654c31))

## [3.2.1] - 2022-10-21

### Fixed

- Fix missing `supports` in types ([#9616](https://github.com/tailwindlabs/tailwindcss/pull/9616))
- Fix missing PostCSS dependencies in the CLI ([#9617](https://github.com/tailwindlabs/tailwindcss/pull/9617))
- Ensure `micromatch` is a proper CLI dependency ([#9620](https://github.com/tailwindlabs/tailwindcss/pull/9620))
- Ensure modifier values exist when using a `modifiers` object for `matchVariant` ([ba6551d](https://github.com/tailwindlabs/tailwindcss/commit/ba6551db0f2726461371b4f3c6cd4c7090888504))

## [3.2.0] - 2022-10-19

### Added

- Add new `@config` directive ([#9405](https://github.com/tailwindlabs/tailwindcss/pull/9405))
- Add new `relative: true` option to resolve content paths relative to the config file ([#9396](https://github.com/tailwindlabs/tailwindcss/pull/9396))
- Add new `supports-*` variant ([#9453](https://github.com/tailwindlabs/tailwindcss/pull/9453))
- Add new `min-*` and `max-*` variants ([#9558](https://github.com/tailwindlabs/tailwindcss/pull/9558))
- Add new `aria-*` variants ([#9557](https://github.com/tailwindlabs/tailwindcss/pull/9557), [#9588](https://github.com/tailwindlabs/tailwindcss/pull/9588))
- Add new `data-*` variants ([#9559](https://github.com/tailwindlabs/tailwindcss/pull/9559), [#9588](https://github.com/tailwindlabs/tailwindcss/pull/9588))
- Add new `break-keep` utility for `word-break: keep-all` ([#9393](https://github.com/tailwindlabs/tailwindcss/pull/9393))
- Add new `collapse` utility for `visibility: collapse` ([#9181](https://github.com/tailwindlabs/tailwindcss/pull/9181))
- Add new `fill-none` utility for `fill: none` ([#9403](https://github.com/tailwindlabs/tailwindcss/pull/9403))
- Add new `stroke-none` utility for `stroke: none` ([#9403](https://github.com/tailwindlabs/tailwindcss/pull/9403))
- Add new `place-content-baseline` utility for `place-content: baseline` ([#9498](https://github.com/tailwindlabs/tailwindcss/pull/9498))
- Add new `place-items-baseline` utility for `place-items: baseline` ([#9507](https://github.com/tailwindlabs/tailwindcss/pull/9507))
- Add new `content-baseline` utility for `align-content: baseline` ([#9507](https://github.com/tailwindlabs/tailwindcss/pull/9507))
- Add support for configuring default `font-feature-settings` for a font family ([#9039](https://github.com/tailwindlabs/tailwindcss/pull/9039))
- Add standalone CLI build for 32-bit Linux on ARM (`node16-linux-armv7`) ([#9084](https://github.com/tailwindlabs/tailwindcss/pull/9084))
- Add future flag to disable color opacity utility plugins ([#9088](https://github.com/tailwindlabs/tailwindcss/pull/9088))
- Add negative value support for `outline-offset` ([#9136](https://github.com/tailwindlabs/tailwindcss/pull/9136))
- Add support for modifiers to `matchUtilities` ([#9541](https://github.com/tailwindlabs/tailwindcss/pull/9541))
- Allow negating utilities using `min`/`max`/`clamp` ([#9237](https://github.com/tailwindlabs/tailwindcss/pull/9237))
- Implement fallback plugins when there is ambiguity between plugins when using arbitrary values ([#9376](https://github.com/tailwindlabs/tailwindcss/pull/9376))
- Support `sort` function in `matchVariant` ([#9423](https://github.com/tailwindlabs/tailwindcss/pull/9423))
- Upgrade to `postcss-nested` v6.0 ([#9546](https://github.com/tailwindlabs/tailwindcss/pull/9546))

### Fixed

- Use absolute paths when resolving changed files for resilience against working directory changes ([#9032](https://github.com/tailwindlabs/tailwindcss/pull/9032))
- Fix ring color utility generation when using `respectDefaultRingColorOpacity` ([#9070](https://github.com/tailwindlabs/tailwindcss/pull/9070))
- Sort tags before classes when `@apply`-ing a selector with joined classes ([#9107](https://github.com/tailwindlabs/tailwindcss/pull/9107))
- Remove invalid `outline-hidden` utility ([#9147](https://github.com/tailwindlabs/tailwindcss/pull/9147))
- Honor the `hidden` attribute on elements in preflight ([#9174](https://github.com/tailwindlabs/tailwindcss/pull/9174))
- Don't stop watching atomically renamed files ([#9173](https://github.com/tailwindlabs/tailwindcss/pull/9173), [#9215](https://github.com/tailwindlabs/tailwindcss/pull/9215))
- Fix duplicate utilities issue causing memory leaks ([#9208](https://github.com/tailwindlabs/tailwindcss/pull/9208))
- Fix `fontFamily` config TypeScript types ([#9214](https://github.com/tailwindlabs/tailwindcss/pull/9214))
- Handle variants on complex selector utilities ([#9262](https://github.com/tailwindlabs/tailwindcss/pull/9262))
- Fix shared config mutation issue ([#9294](https://github.com/tailwindlabs/tailwindcss/pull/9294))
- Fix ordering of parallel variants ([#9282](https://github.com/tailwindlabs/tailwindcss/pull/9282))
- Handle variants in utility selectors using `:where()` and `:has()` ([#9309](https://github.com/tailwindlabs/tailwindcss/pull/9309))
- Improve data type analysis for arbitrary values ([#9320](https://github.com/tailwindlabs/tailwindcss/pull/9320))
- Don't emit generated utilities with invalid uses of theme functions ([#9319](https://github.com/tailwindlabs/tailwindcss/pull/9319))
- Revert change that only listened for stdin close on TTYs ([#9331](https://github.com/tailwindlabs/tailwindcss/pull/9331))
- Ignore unset values (like `null` or `undefined`) when resolving the classList for intellisense ([#9385](https://github.com/tailwindlabs/tailwindcss/pull/9385))
- Improve type checking for formal syntax ([#9349](https://github.com/tailwindlabs/tailwindcss/pull/9349), [#9448](https://github.com/tailwindlabs/tailwindcss/pull/9448))
- Fix incorrect required `content` key in custom plugin configs ([#9502](https://github.com/tailwindlabs/tailwindcss/pull/9502), [#9545](https://github.com/tailwindlabs/tailwindcss/pull/9545))
- Fix content path detection on Windows ([#9569](https://github.com/tailwindlabs/tailwindcss/pull/9569))
- Ensure `--content` is used in the CLI when passed ([#9587](https://github.com/tailwindlabs/tailwindcss/pull/9587))

## [3.1.8] - 2022-08-05

### Fixed

- Don’t prefix classes within reused arbitrary variants ([#8992](https://github.com/tailwindlabs/tailwindcss/pull/8992))
- Fix usage of alpha values inside single-named colors that are functions ([#9008](https://github.com/tailwindlabs/tailwindcss/pull/9008))
- Fix `@apply` of user utilities when negative and non-negative versions both exist ([#9027](https://github.com/tailwindlabs/tailwindcss/pull/9027))

## [3.1.7] - 2022-07-29

### Fixed

- Don't rewrite source maps for `@layer` rules ([#8971](https://github.com/tailwindlabs/tailwindcss/pull/8971))

### Added

- Added types for `resolveConfig` ([#8924](https://github.com/tailwindlabs/tailwindcss/pull/8924))

## [3.1.6] - 2022-07-11

### Fixed

- Fix usage on Node 12.x ([b4e637e](https://github.com/tailwindlabs/tailwindcss/commit/b4e637e2e096a9d6f2210efba9541f6fd4f28e56))
- Handle theme keys with slashes when using `theme()` in CSS ([#8831](https://github.com/tailwindlabs/tailwindcss/pull/8831))

## [3.1.5] - 2022-07-07

### Added

- Support configuring a default `font-weight` for each font size utility ([#8763](https://github.com/tailwindlabs/tailwindcss/pull/8763))
- Add support for alpha values in safe list ([#8774](https://github.com/tailwindlabs/tailwindcss/pull/8774))

### Fixed

- Improve types to support fallback values in the CSS-in-JS syntax used in plugin APIs ([#8762](https://github.com/tailwindlabs/tailwindcss/pull/8762))
- Support including `tailwindcss` and `autoprefixer` in `postcss.config.js` in standalone CLI ([#8769](https://github.com/tailwindlabs/tailwindcss/pull/8769))
- Fix using special-characters as prefixes ([#8772](https://github.com/tailwindlabs/tailwindcss/pull/8772))
- Don’t prefix classes used within arbitrary variants ([#8773](https://github.com/tailwindlabs/tailwindcss/pull/8773))
- Add more explicit types for the default theme ([#8780](https://github.com/tailwindlabs/tailwindcss/pull/8780))

## [3.1.4] - 2022-06-21

### Fixed

- Provide default to `<alpha-value>` when using `theme()` ([#8652](https://github.com/tailwindlabs/tailwindcss/pull/8652))
- Detect arbitrary variants with quotes ([#8687](https://github.com/tailwindlabs/tailwindcss/pull/8687))
- Don’t add spaces around raw `/` that are preceded by numbers ([#8688](https://github.com/tailwindlabs/tailwindcss/pull/8688))

## [3.1.3] - 2022-06-14

### Fixed

- Fix extraction of multi-word utilities with arbitrary values and quotes ([#8604](https://github.com/tailwindlabs/tailwindcss/pull/8604))
- Fix casing of import of `corePluginList` type definition ([#8587](https://github.com/tailwindlabs/tailwindcss/pull/8587))
- Ignore PostCSS nodes returned by `addVariant` ([#8608](https://github.com/tailwindlabs/tailwindcss/pull/8608))
- Fix missing spaces around arithmetic operators ([#8615](https://github.com/tailwindlabs/tailwindcss/pull/8615))
- Detect alpha value in CSS `theme()` function when using quotes ([#8625](https://github.com/tailwindlabs/tailwindcss/pull/8625))
- Fix "Maximum call stack size exceeded" bug ([#8636](https://github.com/tailwindlabs/tailwindcss/pull/8636))
- Allow functions returning parallel variants to mutate the container ([#8622](https://github.com/tailwindlabs/tailwindcss/pull/8622))
- Remove text opacity CSS variables from `::marker` ([#8622](https://github.com/tailwindlabs/tailwindcss/pull/8622))

## [3.1.2] - 2022-06-10

### Fixed

- Ensure `\` is a valid arbitrary variant token ([#8576](https://github.com/tailwindlabs/tailwindcss/pull/8576))
- Enable `postcss-import` in the CLI by default in watch mode ([#8574](https://github.com/tailwindlabs/tailwindcss/pull/8574), [#8580](https://github.com/tailwindlabs/tailwindcss/pull/8580))

## [3.1.1] - 2022-06-09

### Fixed

- Fix candidate extractor regression ([#8558](https://github.com/tailwindlabs/tailwindcss/pull/8558))
- Split `::backdrop` into separate defaults group ([#8567](https://github.com/tailwindlabs/tailwindcss/pull/8567))
- Fix postcss plugin type ([#8564](https://github.com/tailwindlabs/tailwindcss/pull/8564))
- Fix class detection in markdown code fences and slim templates ([#8569](https://github.com/tailwindlabs/tailwindcss/pull/8569))

## [3.1.0] - 2022-06-08

### Fixed

- Types: allow for arbitrary theme values (for 3rd party plugins) ([#7926](https://github.com/tailwindlabs/tailwindcss/pull/7926))
- Don’t split vars with numbers in them inside arbitrary values ([#8091](https://github.com/tailwindlabs/tailwindcss/pull/8091))
- Require matching prefix when detecting negatives ([#8121](https://github.com/tailwindlabs/tailwindcss/pull/8121))
- Handle duplicate At Rules without children ([#8122](https://github.com/tailwindlabs/tailwindcss/pull/8122))
- Allow arbitrary values with commas in `@apply` ([#8125](https://github.com/tailwindlabs/tailwindcss/pull/8125))
- Fix intellisense for plugins with multiple `@apply` rules ([#8213](https://github.com/tailwindlabs/tailwindcss/pull/8213))
- Improve type detection for arbitrary color values ([#8201](https://github.com/tailwindlabs/tailwindcss/pull/8201))
- Support PostCSS config options in config file in CLI ([#8226](https://github.com/tailwindlabs/tailwindcss/pull/8226))
- Remove default `[hidden]` style in preflight ([#8248](https://github.com/tailwindlabs/tailwindcss/pull/8248))
- Only check selectors containing base apply candidates for circular dependencies ([#8222](https://github.com/tailwindlabs/tailwindcss/pull/8222))
- Rewrite default class extractor ([#8204](https://github.com/tailwindlabs/tailwindcss/pull/8204))
- Move `important` selector to the front when `@apply`-ing selector-modifying variants in custom utilities ([#8313](https://github.com/tailwindlabs/tailwindcss/pull/8313))
- Error when registering an invalid custom variant ([#8345](https://github.com/tailwindlabs/tailwindcss/pull/8345))
- Create tailwind.config.cjs file in ESM package when running init ([#8363](https://github.com/tailwindlabs/tailwindcss/pull/8363))
- Fix `matchVariant` that use at-rules and placeholders ([#8392](https://github.com/tailwindlabs/tailwindcss/pull/8392))
- Improve types of the `tailwindcss/plugin` ([#8400](https://github.com/tailwindlabs/tailwindcss/pull/8400))
- Allow returning parallel variants from `addVariant` or `matchVariant` callback functions ([#8455](https://github.com/tailwindlabs/tailwindcss/pull/8455))
- Try using local `postcss` installation first in the CLI ([#8270](https://github.com/tailwindlabs/tailwindcss/pull/8270))
- Allow default ring color to be a function ([#7587](https://github.com/tailwindlabs/tailwindcss/pull/7587))
- Don't inherit `to` value from parent gradients ([#8489](https://github.com/tailwindlabs/tailwindcss/pull/8489))
- Remove process dependency from log functions ([#8530](https://github.com/tailwindlabs/tailwindcss/pull/8530))
- Ensure we can use `@import 'tailwindcss/...'` without node_modules ([#8537](https://github.com/tailwindlabs/tailwindcss/pull/8537))

### Changed

- Only apply hover styles when supported (future) ([#8394](https://github.com/tailwindlabs/tailwindcss/pull/8394))
- Respect default ring color opacity (future) ([#8448](https://github.com/tailwindlabs/tailwindcss/pull/8448), [3f4005e](https://github.com/tailwindlabs/tailwindcss/commit/3f4005e833445f7549219eb5ae89728cbb3a2630))

### Added

- Support PostCSS `Document` nodes ([#7291](https://github.com/tailwindlabs/tailwindcss/pull/7291))
- Add `text-start` and `text-end` utilities ([#6656](https://github.com/tailwindlabs/tailwindcss/pull/6656))
- Support customizing class name when using `darkMode: 'class'` ([#5800](https://github.com/tailwindlabs/tailwindcss/pull/5800))
- Add `--poll` option to the CLI ([#7725](https://github.com/tailwindlabs/tailwindcss/pull/7725))
- Add new `border-spacing` utilities ([#7102](https://github.com/tailwindlabs/tailwindcss/pull/7102))
- Add `enabled` variant ([#7905](https://github.com/tailwindlabs/tailwindcss/pull/7905))
- Add TypeScript types for the `tailwind.config.js` file ([#7891](https://github.com/tailwindlabs/tailwindcss/pull/7891))
- Add `backdrop` variant ([#7924](https://github.com/tailwindlabs/tailwindcss/pull/7924), [#8526](https://github.com/tailwindlabs/tailwindcss/pull/8526))
- Add `grid-flow-dense` utility ([#8193](https://github.com/tailwindlabs/tailwindcss/pull/8193))
- Add `mix-blend-plus-lighter` utility ([#8288](https://github.com/tailwindlabs/tailwindcss/pull/8288))
- Add arbitrary variants ([#8299](https://github.com/tailwindlabs/tailwindcss/pull/8299))
- Add experimental `matchVariant` API ([#8310](https://github.com/tailwindlabs/tailwindcss/pull/8310), [34fd0fb8](https://github.com/tailwindlabs/tailwindcss/commit/34fd0fb82aa574cddc5c7aa3ad7d1af5e3735e5d))
- Add `prefers-contrast` media query variants ([#8410](https://github.com/tailwindlabs/tailwindcss/pull/8410))
- Add opacity support when referencing colors with `theme` function ([#8416](https://github.com/tailwindlabs/tailwindcss/pull/8416))
- Add `postcss-import` support to the CLI ([#8437](https://github.com/tailwindlabs/tailwindcss/pull/8437))
- Add `optional` variant ([#8486](https://github.com/tailwindlabs/tailwindcss/pull/8486))
- Add `<alpha-value>` placeholder support for custom colors ([#8501](https://github.com/tailwindlabs/tailwindcss/pull/8501))

## [3.0.24] - 2022-04-12

### Fixed

- Prevent nesting plugin from breaking other plugins ([#7563](https://github.com/tailwindlabs/tailwindcss/pull/7563))
- Recursively collapse adjacent rules ([#7565](https://github.com/tailwindlabs/tailwindcss/pull/7565))
- Preserve source maps for generated CSS ([#7588](https://github.com/tailwindlabs/tailwindcss/pull/7588))
- Split box shadows on top-level commas only ([#7479](https://github.com/tailwindlabs/tailwindcss/pull/7479))
- Use local user CSS cache for `@apply` ([#7524](https://github.com/tailwindlabs/tailwindcss/pull/7524))
- Invalidate context when main CSS changes ([#7626](https://github.com/tailwindlabs/tailwindcss/pull/7626))
- Only add `!` to selector class matching template candidate when using important modifier with multi-class selectors ([#7664](https://github.com/tailwindlabs/tailwindcss/pull/7664))
- Correctly parse and prefix animation names with dots ([#7163](https://github.com/tailwindlabs/tailwindcss/pull/7163))
- Fix extraction from template literal/function with array ([#7481](https://github.com/tailwindlabs/tailwindcss/pull/7481))
- Don't output unparsable arbitrary values ([#7789](https://github.com/tailwindlabs/tailwindcss/pull/7789))
- Fix generation of `div:not(.foo)` if `.foo` is never defined ([#7815](https://github.com/tailwindlabs/tailwindcss/pull/7815))
- Allow for custom properties in `rgb`, `rgba`, `hsl` and `hsla` colors ([#7933](https://github.com/tailwindlabs/tailwindcss/pull/7933))
- Remove autoprefixer as explicit peer-dependency to avoid invalid warnings in situations where it isn't actually needed ([#7949](https://github.com/tailwindlabs/tailwindcss/pull/7949))
- Ensure the `percentage` data type is validated correctly ([#8015](https://github.com/tailwindlabs/tailwindcss/pull/8015))
- Make sure `font-weight` is inherited by form controls in all browsers ([#8078](https://github.com/tailwindlabs/tailwindcss/pull/8078))

### Changed

- Replace `chalk` with `picocolors` ([#6039](https://github.com/tailwindlabs/tailwindcss/pull/6039))
- Replace `cosmiconfig` with `lilconfig` ([#6039](https://github.com/tailwindlabs/tailwindcss/pull/6038))
- Update `cssnano` to avoid removing empty variables when minifying ([#7818](https://github.com/tailwindlabs/tailwindcss/pull/7818))

## [3.0.23] - 2022-02-16

### Fixed

- Remove opacity variables from `:visited` pseudo class ([#7458](https://github.com/tailwindlabs/tailwindcss/pull/7458))
- Support arbitrary values + calc + theme with quotes ([#7462](https://github.com/tailwindlabs/tailwindcss/pull/7462))
- Don't duplicate layer output when scanning content with variants + wildcards ([#7478](https://github.com/tailwindlabs/tailwindcss/pull/7478))
- Implement `getClassOrder` instead of `sortClassList` ([#7459](https://github.com/tailwindlabs/tailwindcss/pull/7459))

## [3.0.22] - 2022-02-11

### Fixed

- Temporarily move `postcss` to dependencies ([#7424](https://github.com/tailwindlabs/tailwindcss/pull/7424))

## [3.0.21] - 2022-02-10

### Fixed

- Move prettier plugin to dev dependencies ([#7418](https://github.com/tailwindlabs/tailwindcss/pull/7418))

## [3.0.20] - 2022-02-10

### Added

- Expose `context.sortClassList(classes)` ([#7412](https://github.com/tailwindlabs/tailwindcss/pull/7412))

## [3.0.19] - 2022-02-07

### Fixed

- Fix preflight border color fallback ([#7288](https://github.com/tailwindlabs/tailwindcss/pull/7288))
- Correctly parse shadow lengths without a leading zero ([#7289](https://github.com/tailwindlabs/tailwindcss/pull/7289))
- Don't crash when scanning extremely long class candidates ([#7331](https://github.com/tailwindlabs/tailwindcss/pull/7331))
- Use less hacky fix for URLs detected as custom properties ([#7275](https://github.com/tailwindlabs/tailwindcss/pull/7275))
- Correctly generate negative utilities when dash is before the prefix ([#7295](https://github.com/tailwindlabs/tailwindcss/pull/7295))
- Detect prefixed negative utilities in the safelist ([#7295](https://github.com/tailwindlabs/tailwindcss/pull/7295))

## [3.0.18] - 2022-01-28

### Fixed

- Fix `@apply` order regression (in `addComponents`, `addUtilities`, ...) ([#7232](https://github.com/tailwindlabs/tailwindcss/pull/7232))
- Quick fix for incorrect arbitrary properties when using URLs ([#7252](https://github.com/tailwindlabs/tailwindcss/pull/7252))

## [3.0.17] - 2022-01-26

### Fixed

- Remove false positive warning in CLI when using the `--content` option ([#7220](https://github.com/tailwindlabs/tailwindcss/pull/7220))

## [3.0.16] - 2022-01-24

### Fixed

- Ensure to transpile the PostCSS Nesting plugin (tailwindcss/nesting) ([#7080](https://github.com/tailwindlabs/tailwindcss/pull/7080))
- Improve various warnings ([#7118](https://github.com/tailwindlabs/tailwindcss/pull/7118))
- Fix grammatical mistake ([cca5a38](https://github.com/tailwindlabs/tailwindcss/commit/cca5a3804e1d3ee0214491921e1aec35bf62a813))

## [3.0.15] - 2022-01-15

### Fixed

- Temporarily remove optional chaining in nesting plugin ([#7077](https://github.com/tailwindlabs/tailwindcss/pull/7077))

## [3.0.14] - 2022-01-14

### Added

- Show warnings for invalid content config ([#7065](https://github.com/tailwindlabs/tailwindcss/pull/7065))

### Fixed

- Only emit utility/component variants when those layers exist ([#7066](https://github.com/tailwindlabs/tailwindcss/pull/7066))
- Ensure nesting plugins can receive options ([#7016](https://github.com/tailwindlabs/tailwindcss/pull/7016))

## [3.0.13] - 2022-01-11

### Fixed

- Fix consecutive builds with at apply producing different CSS ([#6999](https://github.com/tailwindlabs/tailwindcss/pull/6999))

## [3.0.12] - 2022-01-07

### Fixed

- Allow use of falsy values in theme config ([#6917](https://github.com/tailwindlabs/tailwindcss/pull/6917))
- Ensure we can apply classes that are grouped with non-class selectors ([#6922](https://github.com/tailwindlabs/tailwindcss/pull/6922))
- Improve standalone CLI compatibility on Linux by switching to the `linuxstatic` build target ([#6914](https://github.com/tailwindlabs/tailwindcss/pull/6914))
- Ensure `@apply` works consistently with or without `@layer` ([#6938](https://github.com/tailwindlabs/tailwindcss/pull/6938))
- Only emit defaults when using base layer ([#6926](https://github.com/tailwindlabs/tailwindcss/pull/6926))
- Emit plugin defaults regardless of usage ([#6926](https://github.com/tailwindlabs/tailwindcss/pull/6926))
- Move default border color back to preflight ([#6926](https://github.com/tailwindlabs/tailwindcss/pull/6926))
- Change `experimental.optimizeUniversalDefaults` to only work with `@tailwind base` ([#6926](https://github.com/tailwindlabs/tailwindcss/pull/6926))

## [3.0.11] - 2022-01-05

### Fixed

- Preserve casing of CSS variables added by plugins ([#6888](https://github.com/tailwindlabs/tailwindcss/pull/6888))
- Ignore content paths that are passed in but don't actually exist ([#6901](https://github.com/tailwindlabs/tailwindcss/pull/6901))
- Revert change that applies Tailwind's defaults in isolated environments like CSS modules ([9fdc391](https://github.com/tailwindlabs/tailwindcss/commit/9fdc391d4ff93e7e350f5ce439060176b1f0162f))

## [3.0.10] - 2022-01-04

### Fixed

- Fix `@apply` in files without `@tailwind` directives ([#6580](https://github.com/tailwindlabs/tailwindcss/pull/6580), [#6875](https://github.com/tailwindlabs/tailwindcss/pull/6875))
- CLI: avoid unnecessary writes to output files ([#6550](https://github.com/tailwindlabs/tailwindcss/pull/6550))

### Added

- Allow piping data into the CLI ([#6876](https://github.com/tailwindlabs/tailwindcss/pull/6876))

## [3.0.9] - 2022-01-03

### Fixed

- Improve `DEBUG` flag ([#6797](https://github.com/tailwindlabs/tailwindcss/pull/6797), [#6804](https://github.com/tailwindlabs/tailwindcss/pull/6804))
- Ensure we can use `<` and `>` characters in modifiers ([#6851](https://github.com/tailwindlabs/tailwindcss/pull/6851))
- Validate `theme()` works in arbitrary values ([#6852](https://github.com/tailwindlabs/tailwindcss/pull/6852))
- Properly detect `theme()` value usage in arbitrary properties ([#6854](https://github.com/tailwindlabs/tailwindcss/pull/6854))
- Improve collapsing of duplicate declarations ([#6856](https://github.com/tailwindlabs/tailwindcss/pull/6856))
- Remove support for `TAILWIND_MODE=watch` ([#6858](https://github.com/tailwindlabs/tailwindcss/pull/6858))

## [3.0.8] - 2021-12-28

### Fixed

- Reduce specificity of `abbr` rule in preflight ([#6671](https://github.com/tailwindlabs/tailwindcss/pull/6671))
- Support HSL with hue units in arbitrary values ([#6726](https://github.com/tailwindlabs/tailwindcss/pull/6726))
- Add `node16-linux-arm64` target for standalone CLI ([#6693](https://github.com/tailwindlabs/tailwindcss/pull/6693))

## [3.0.7] - 2021-12-17

### Fixed

- Don't mutate custom color palette when overriding per-plugin colors ([#6546](https://github.com/tailwindlabs/tailwindcss/pull/6546))
- Improve circular dependency detection when using `@apply` ([#6588](https://github.com/tailwindlabs/tailwindcss/pull/6588))
- Only generate variants for non-`user` layers ([#6589](https://github.com/tailwindlabs/tailwindcss/pull/6589))
- Properly extract classes with arbitrary values in arrays and classes followed by escaped quotes ([#6590](https://github.com/tailwindlabs/tailwindcss/pull/6590))
- Improve jsx interpolation candidate matching ([#6593](https://github.com/tailwindlabs/tailwindcss/pull/6593))
- Ensure `@apply` of a rule inside an AtRule works ([#6594](https://github.com/tailwindlabs/tailwindcss/pull/6594))

## [3.0.6] - 2021-12-16

### Fixed

- Support square bracket notation in paths ([#6519](https://github.com/tailwindlabs/tailwindcss/pull/6519))
- Ensure all plugins are executed for a given candidate ([#6540](https://github.com/tailwindlabs/tailwindcss/pull/6540))

## [3.0.5] - 2021-12-15

### Fixed

- Revert: add `li` to list-style reset ([9777562d](https://github.com/tailwindlabs/tailwindcss/commit/9777562da37ee631bbf77374c0d14825f09ef9af))

## [3.0.4] - 2021-12-15

### Fixed

- Insert always-on defaults layer in correct spot ([#6526](https://github.com/tailwindlabs/tailwindcss/pull/6526))

## [3.0.3] - 2021-12-15

### Added

- Warn about invalid globs in `content` ([#6449](https://github.com/tailwindlabs/tailwindcss/pull/6449))
- Add standalone tailwindcss CLI ([#6506](https://github.com/tailwindlabs/tailwindcss/pull/6506))
- Add `li` to list-style reset ([00f60e6](https://github.com/tailwindlabs/tailwindcss/commit/00f60e61013c6e4e3419e4b699371a13eb30b75d))

### Fixed

- Don't output unparsable values ([#6469](https://github.com/tailwindlabs/tailwindcss/pull/6469))
- Fix text decoration utilities from overriding the new text decoration color/style/thickness utilities when used with a modifier ([#6378](https://github.com/tailwindlabs/tailwindcss/pull/6378))
- Move defaults to their own always-on layer ([#6500](https://github.com/tailwindlabs/tailwindcss/pull/6500))
- Support negative values in safelist patterns ([#6480](https://github.com/tailwindlabs/tailwindcss/pull/6480))

## [3.0.2] - 2021-12-13

### Fixed

- Temporarily disable optimize universal defaults, fixes issue with transforms/filters/rings not being `@apply`-able in CSS modules/Svelte components/Vue components ([#6461](https://github.com/tailwindlabs/tailwindcss/pull/6461))

## [3.0.1] - 2021-12-10

### Fixed

- Ensure complex variants with multiple classes work ([#6311](https://github.com/tailwindlabs/tailwindcss/pull/6311))
- Re-add `default` interop to public available functions ([#6348](https://github.com/tailwindlabs/tailwindcss/pull/6348))
- Detect circular dependencies when using `@apply` ([#6365](https://github.com/tailwindlabs/tailwindcss/pull/6365))
- Fix defaults optimization when vendor prefixes are involved ([#6369](https://github.com/tailwindlabs/tailwindcss/pull/6369))

## [3.0.0] - 2021-12-09

### Fixed

- Enforce the order of some variants (like `before` and `after`) ([#6018](https://github.com/tailwindlabs/tailwindcss/pull/6018))

### Added

- Add `placeholder` variant ([#6106](https://github.com/tailwindlabs/tailwindcss/pull/6106))
- Add composable `touch-action` utilities ([#6115](https://github.com/tailwindlabs/tailwindcss/pull/6115))
- Add support for "arbitrary properties" ([#6161](https://github.com/tailwindlabs/tailwindcss/pull/6161))
- Add `portrait` and `landscape` variants ([#6046](https://github.com/tailwindlabs/tailwindcss/pull/6046))
- Add `text-decoration-style`, `text-decoration-thickness`, and `text-underline-offset` utilities ([#6004](https://github.com/tailwindlabs/tailwindcss/pull/6004))
- Add `menu` reset to preflight ([#6213](https://github.com/tailwindlabs/tailwindcss/pull/6213))
- Allow `0` as a valid `length` value ([#6233](https://github.com/tailwindlabs/tailwindcss/pull/6233), [#6259](https://github.com/tailwindlabs/tailwindcss/pull/6259))
- Add CSS functions to data types ([#6258](https://github.com/tailwindlabs/tailwindcss/pull/6258))
- Support negative values for `scale-*` utilities ([c48e629](https://github.com/tailwindlabs/tailwindcss/commit/c48e629955585ad18dadba9f470fda59cc448ab7))
- Improve `length` data type, by validating each value individually ([#6283](https://github.com/tailwindlabs/tailwindcss/pull/6283))

### Changed

- Deprecate `decoration-slice` and `decoration-break` in favor `box-decoration-slice` and `box-decoration-break` _(non-breaking)_ ([#6004](https://github.com/tailwindlabs/tailwindcss/pull/6004))

## [3.0.0-alpha.2] - 2021-11-08

### Changed

- Don't use pointer cursor on disabled buttons by default ([#5772](https://github.com/tailwindlabs/tailwindcss/pull/5772))
- Set default content value in preflight instead of within each before/after utility ([#5820](https://github.com/tailwindlabs/tailwindcss/pull/5820))
- Remove `prefix` as a function ([#5829](https://github.com/tailwindlabs/tailwindcss/pull/5829))

### Added

- Add `flex-basis` utilities ([#5671](https://github.com/tailwindlabs/tailwindcss/pull/5671))
- Make negative values a first-class feature ([#5709](https://github.com/tailwindlabs/tailwindcss/pull/5709))
- Add `fit-content` values for `min/max-width/height` utilities ([#5638](https://github.com/tailwindlabs/tailwindcss/pull/5638))
- Add `min/max-content` values for `min/max-height` utilities ([#5729](https://github.com/tailwindlabs/tailwindcss/pull/5729))
- Add all standard `cursor-*` values by default ([#5734](https://github.com/tailwindlabs/tailwindcss/pull/5734))
- Add `grow-*` and `shrink-*` utilities, deprecate `flex-grow-*` and `flex-shrink-*` ([#5733](https://github.com/tailwindlabs/tailwindcss/pull/5733))
- Add `text-decoration-color` utilities ([#5760](https://github.com/tailwindlabs/tailwindcss/pull/5760))
- Add new declarative `addVariant` API ([#5809](https://github.com/tailwindlabs/tailwindcss/pull/5809))
- Add first-class `print` variant for targeting printed media ([#5885](https://github.com/tailwindlabs/tailwindcss/pull/5885))
- Add `outline-style`, `outline-color`, `outline-width` and `outline-offset` utilities ([#5887](https://github.com/tailwindlabs/tailwindcss/pull/5887))
- Add full color palette for `fill-*` and `stroke-*` utilities (#5933[](https://github.com/tailwindlabs/tailwindcss/pull/5933))
- Add composable API for colored box shadows ([#5979](https://github.com/tailwindlabs/tailwindcss/pull/5979))

### Fixed

- Configure chokidar's `awaitWriteFinish` setting to avoid occasional stale builds on Windows ([#5774](https://github.com/tailwindlabs/tailwindcss/pull/5774))
- Fix CLI `--content` option ([#5775](https://github.com/tailwindlabs/tailwindcss/pull/5775))
- Fix before/after utilities overriding custom content values at larger breakpoints ([#5820](https://github.com/tailwindlabs/tailwindcss/pull/5820))
- Cleanup duplicate properties ([#5830](https://github.com/tailwindlabs/tailwindcss/pull/5830))
- Allow `_` inside `url()` when using arbitrary values ([#5853](https://github.com/tailwindlabs/tailwindcss/pull/5853))
- Prevent crashes when using comments in `@layer` AtRules ([#5854](https://github.com/tailwindlabs/tailwindcss/pull/5854))
- Handle color transformations properly with `theme(...)` for all relevant plugins ([#4533](https://github.com/tailwindlabs/tailwindcss/pull/4533), [#5871](https://github.com/tailwindlabs/tailwindcss/pull/5871))
- Ensure `@apply`-ing a utility with multiple definitions works ([#5870](https://github.com/tailwindlabs/tailwindcss/pull/5870))

## [3.0.0-alpha.1] - 2021-10-01

### Changed

- Remove AOT engine, make JIT the default ([#5340](https://github.com/tailwindlabs/tailwindcss/pull/5340))
- Throw when trying to `@apply` the `group` class ([#4666](https://github.com/tailwindlabs/tailwindcss/pull/4666))
- Remove dependency on `modern-normalize`, inline and consolidate with Preflight ([#5358](https://github.com/tailwindlabs/tailwindcss/pull/5358))
- Enable extended color palette by default with updated color names ([#5384](https://github.com/tailwindlabs/tailwindcss/pull/5384))
- Move `vertical-align` values to config file instead of hard-coding ([#5487](https://github.com/tailwindlabs/tailwindcss/pull/5487))
- Rename `overflow-clip` to `text-clip` and `overflow-ellipsis` to `text-ellipsis` ([#5630](https://github.com/tailwindlabs/tailwindcss/pull/5630))

### Added

- Add native `aspect-ratio` utilities ([#5359](https://github.com/tailwindlabs/tailwindcss/pull/5359))
- Unify config callback helpers into single object ([#5382](https://github.com/tailwindlabs/tailwindcss/pull/5382))
- Preserve original color format when adding opacity whenever possible ([#5154](https://github.com/tailwindlabs/tailwindcss/pull/5154))
- Add `accent-color` utilities ([#5387](https://github.com/tailwindlabs/tailwindcss/pull/5387))
- Add `scroll-behavior` utilities ([#5388](https://github.com/tailwindlabs/tailwindcss/pull/5388))
- Add `will-change` utilities ([#5448](https://github.com/tailwindlabs/tailwindcss/pull/5448))
- Add `text-indent` utilities ([#5449](https://github.com/tailwindlabs/tailwindcss/pull/5449))
- Add `column` utilities ([#5457](https://github.com/tailwindlabs/tailwindcss/pull/5457))
- Add `border-hidden` utility ([#5485](https://github.com/tailwindlabs/tailwindcss/pull/5485))
- Add `align-sub` and `align-super` utilities by default ([#5486](https://github.com/tailwindlabs/tailwindcss/pull/5486))
- Add `break-before`, `break-inside` and `break-after` utilities ([#5530](https://github.com/tailwindlabs/tailwindcss/pull/5530))
- Add `file` variant for `::file-selector-button` pseudo element ([#4936](https://github.com/tailwindlabs/tailwindcss/pull/4936))
- Add comprehensive arbitrary value support ([#5568](https://github.com/tailwindlabs/tailwindcss/pull/5568))
- Add `touch-action` utilities ([#5603](https://github.com/tailwindlabs/tailwindcss/pull/5603))
- Add `inherit` to default color palette ([#5597](https://github.com/tailwindlabs/tailwindcss/pull/5597))
- Add `overflow-clip`, `overflow-x-clip` and `overflow-y-clip` utilities ([#5630](https://github.com/tailwindlabs/tailwindcss/pull/5630))
- Add `[open]` variant ([#5627](https://github.com/tailwindlabs/tailwindcss/pull/5627))
- Add `scroll-snap` utilities ([#5637](https://github.com/tailwindlabs/tailwindcss/pull/5637))
- Add `border-x` and `border-y` width and color utilities ([#5639](https://github.com/tailwindlabs/tailwindcss/pull/5639))

### Fixed

- Fix defining colors as functions when color opacity plugins are disabled ([#5470](https://github.com/tailwindlabs/tailwindcss/pull/5470))
- Fix using negated `content` globs ([#5625](https://github.com/tailwindlabs/tailwindcss/pull/5625))
- Fix using backslashes in `content` globs ([#5628](https://github.com/tailwindlabs/tailwindcss/pull/5628))

## [2.2.19] - 2021-10-29

### Fixed

- Ensure `corePlugins` order is consistent in AOT mode ([#5928](https://github.com/tailwindlabs/tailwindcss/pull/5928))

## [2.2.18] - 2021-10-29

### Fixed

- Bump versions for security vulnerabilities ([#5924](https://github.com/tailwindlabs/tailwindcss/pull/5924))

## [2.2.17] - 2021-10-13

### Fixed

- Configure chokidar's `awaitWriteFinish` setting to avoid occasional stale builds on Windows ([#5758](https://github.com/tailwindlabs/tailwindcss/pull/5758))

## [2.2.16] - 2021-09-26

### Fixed

- JIT: Properly handle animations that use CSS custom properties ([#5602](https://github.com/tailwindlabs/tailwindcss/pull/5602))

## [2.2.15] - 2021-09-10

### Fixed

- Ensure using CLI without `-i` for input file continues to work even though deprecated ([#5464](https://github.com/tailwindlabs/tailwindcss/pull/5464))

## [2.2.14] - 2021-09-08

### Fixed

- Only use `@defaults` in JIT, switch back to `clean-css` in case there's any meaningful differences in the output ([bf248cb](https://github.com/tailwindlabs/tailwindcss/commit/bf248cb0de889d48854fbdd26536f4a492556efd))

## [2.2.13] - 2021-09-08

### Fixed

- Replace `clean-css` with `cssnano` for CDN builds to fix minified builds ([75cc3ca](https://github.com/tailwindlabs/tailwindcss/commit/75cc3ca305aedddc8a85f3df1a420fefad3fb5c4))

## [2.2.12] - 2021-09-08

### Fixed

- Ensure that divide utilities inject a default border color ([#5438](https://github.com/tailwindlabs/tailwindcss/pull/5438))

## [2.2.11] - 2021-09-07

### Fixed

- Rebundle to fix missing CLI peer dependencies

## [2.2.10] - 2021-09-06

### Fixed

- Fix build error when using `presets: []` in config file ([#4903](https://github.com/tailwindlabs/tailwindcss/pull/4903))

### Added

- Reintroduce universal selector optimizations under experimental `optimizeUniversalDefaults` flag ([a9e160c](https://github.com/tailwindlabs/tailwindcss/commit/a9e160cf9acb75a2bbac34f8864568b12940f89a))

## [2.2.9] - 2021-08-30

### Fixed

- JIT: Fix `@apply`ing utilities that contain variants + the important modifier ([#4854](https://github.com/tailwindlabs/tailwindcss/pull/4854))
- JIT: Don't strip "null" when parsing tracked file paths ([#5008](https://github.com/tailwindlabs/tailwindcss/pull/5008))
- Pin `clean-css` to v5.1.4 to fix empty CSS variables in CDN builds ([#5338](https://github.com/tailwindlabs/tailwindcss/pull/5338))

## [2.2.8] - 2021-08-27

### Fixed

- Improve accessibility of default link focus styles in Firefox ([#5082](https://github.com/tailwindlabs/tailwindcss/pull/5082))
- JIT: Fix animation variants corrupting keyframes rules ([#5223](https://github.com/tailwindlabs/tailwindcss/pull/5223))
- JIT: Ignore escaped commas when splitting selectors to apply prefixes ([#5239](https://github.com/tailwindlabs/tailwindcss/pull/5239/))
- Nesting: Maintain PostCSS node sources when handling `@apply` ([#5249](https://github.com/tailwindlabs/tailwindcss/pull/5249))
- JIT: Fix support for animation lists ([#5252](https://github.com/tailwindlabs/tailwindcss/pull/5252))
- JIT: Fix arbitrary value support for `object-position` utilities ([#5245](https://github.com/tailwindlabs/tailwindcss/pull/5245))
- CLI: Abort watcher if stdin is closed to avoid zombie processes ([#4997](https://github.com/tailwindlabs/tailwindcss/pull/4997))
- JIT: Ignore arbitrary values with unbalanced brackets ([#5293](https://github.com/tailwindlabs/tailwindcss/pull/5293))

## [2.2.7] - 2021-07-23

### Fixed

- Temporarily revert runtime performance optimizations introduced in v2.2.5, use universal selector again ([#5060](https://github.com/tailwindlabs/tailwindcss/pull/5060))

## [2.2.6] - 2021-07-21

### Fixed

- Fix issue where base styles not generated for translate transforms in JIT ([#5038](https://github.com/tailwindlabs/tailwindcss/pull/5038))

## [2.2.5] - 2021-07-21

### Added

- Added `self-baseline` utility (I know this is a patch release, no one's going to die relax) ([#5000](https://github.com/tailwindlabs/tailwindcss/pull/5000))

### Changed

- JIT: Optimize universal selector usage by inlining only the relevant selectors ([#4850](https://github.com/tailwindlabs/tailwindcss/pull/4850)))

  This provides a very significant performance boost on pages with a huge number of DOM nodes, but there's a chance it could be a breaking change in very rare edge cases we haven't thought of. Please open an issue if anything related to shadows, rings, transforms, filters, or backdrop-filters seems to be behaving differently after upgrading.

### Fixed

- Fix support for `step-start` and `step-end` in animation utilities ([#4795](https://github.com/tailwindlabs/tailwindcss/pull/4795)))
- JIT: Prevent presence of `!*` in templates from ruining everything ([#4816](https://github.com/tailwindlabs/tailwindcss/pull/4816)))
- JIT: Improve support for quotes in arbitrary values ([#4817](https://github.com/tailwindlabs/tailwindcss/pull/4817)))
- Fix filter/backdrop-filter/transform utilities being inserted into the wrong position if not all core plugins are enabled ([#4852](https://github.com/tailwindlabs/tailwindcss/pull/4852)))
- JIT: Fix `@layer` rules being mistakenly inserted during incremental rebuilds ([#4853](https://github.com/tailwindlabs/tailwindcss/pull/4853)))
- Improve build performance for projects with many small non-Tailwind stylesheets ([#4644](https://github.com/tailwindlabs/tailwindcss/pull/4644))
- Ensure `[hidden]` works as expected on elements where we override the default `display` value in Preflight ([#4873](https://github.com/tailwindlabs/tailwindcss/pull/4873))
- Fix variant configuration not being applied to `backdropOpacity` utilities ([#4892](https://github.com/tailwindlabs/tailwindcss/pull/4892))

## [2.2.4] - 2021-06-23

### Fixed

- Remove `postinstall` script that was preventing people from installing the library ([1eacfb9](https://github.com/tailwindlabs/tailwindcss/commit/1eacfb98849c0d4737e0af3595ddec8c73addaac))

## [2.2.3] - 2021-06-23

### Added

- Pass extended color palette to theme closures so it can be used without installing Tailwind when using `npx tailwindcss` ([359252c](https://github.com/tailwindlabs/tailwindcss/commit/359252c9b429e81217c28eb3ca7bab73d8f81e6d))

### Fixed

- JIT: Explicitly error when `-` is used as a custom separator ([#4704](https://github.com/tailwindlabs/tailwindcss/pull/4704))
- JIT: Don't add multiple `~` when stacking `peer-*` variants ([#4757](https://github.com/tailwindlabs/tailwindcss/pull/4757))
- Remove outdated focus style fix in Preflight ([#4780](https://github.com/tailwindlabs/tailwindcss/pull/4780))
- Enable `purge` if provided on the CLI ([#4772](https://github.com/tailwindlabs/tailwindcss/pull/4772))
- JIT: Fix error when not using a config file with postcss-cli ([#4773](https://github.com/tailwindlabs/tailwindcss/pull/4773))
- Fix issue with `resolveConfig` not being importable in Next.js pages ([#4725](https://github.com/tailwindlabs/tailwindcss/pull/4725))

## [2.2.2] - 2021-06-18

### Fixed

- JIT: Reintroduce `transform`, `filter`, and `backdrop-filter` classes purely to create stacking contexts to minimize the impact of the breaking change ([#4700](https://github.com/tailwindlabs/tailwindcss/pull/4700))

## [2.2.1] - 2021-06-18

### Fixed

- Recover from errors gracefully in CLI watch mode ([#4693](https://github.com/tailwindlabs/tailwindcss/pull/4693))
- Fix issue with media queries not being generated properly when using PostCSS 7 ([#4695](https://github.com/tailwindlabs/tailwindcss/pull/4695))

## [2.2.0] - 2021-06-17

### Changed

- JIT: Use "tracking" context by default instead of "watching" context for improved reliability with most bundlers ([#4514](https://github.com/tailwindlabs/tailwindcss/pull/4514))

  Depending on which tooling you use, you may need to explicitly set `TAILWIND_MODE=watch` until your build runner has been updated to support PostCSS's `dir-dependency` message type.

### Added

- Add `background-origin` utilities ([#4117](https://github.com/tailwindlabs/tailwindcss/pull/4117))
- Improve `@apply` performance in projects that process many CSS sources ([#3178](https://github.com/tailwindlabs/tailwindcss/pull/3718))
- JIT: Don't use CSS variables for color utilities if color opacity utilities are disabled ([#3984](https://github.com/tailwindlabs/tailwindcss/pull/3984))
- JIT: Redesign `matchUtilities` API to make it more suitable for third-party use ([#4232](https://github.com/tailwindlabs/tailwindcss/pull/4232))
- JIT: Support applying important utility variants ([#4260](https://github.com/tailwindlabs/tailwindcss/pull/4260))
- JIT: Support coercing arbitrary values when the type isn't detectable ([#4263](https://github.com/tailwindlabs/tailwindcss/pull/4263))
- JIT: Support for `raw` syntax in `purge` config ([#4272](https://github.com/tailwindlabs/tailwindcss/pull/4272))
- Add `empty` variant ([#3298](https://github.com/tailwindlabs/tailwindcss/pull/3298))
- Update `modern-normalize` to v1.1 ([#4287](https://github.com/tailwindlabs/tailwindcss/pull/4287))
- Implement `theme` function internally, remove `postcss-functions` dependency ([#4317](https://github.com/tailwindlabs/tailwindcss/pull/4317))
- Add `screen` function to improve nesting plugin compatibility ([#4318](https://github.com/tailwindlabs/tailwindcss/pull/4318))
- JIT: Add universal shorthand color opacity syntax ([#4348](https://github.com/tailwindlabs/tailwindcss/pull/4348))
- JIT: Add `@tailwind variants` directive to replace `@tailwind screens` ([#4356](https://github.com/tailwindlabs/tailwindcss/pull/4356))
- JIT: Add support for PostCSS `dir-dependency` messages in `TAILWIND_DISABLE_TOUCH` mode ([#4388](https://github.com/tailwindlabs/tailwindcss/pull/4388))
- JIT: Add per-side border color utilities ([#4404](https://github.com/tailwindlabs/tailwindcss/pull/4404))
- JIT: Add support for `before` and `after` pseudo-element variants and `content` utilities ([#4461](https://github.com/tailwindlabs/tailwindcss/pull/4461))
- Add new `transform` and `extract` APIs to simplify PurgeCSS/JIT customization ([#4469](https://github.com/tailwindlabs/tailwindcss/pull/4469))
- JIT: Add exhaustive pseudo-class and pseudo-element variant support ([#4482](https://github.com/tailwindlabs/tailwindcss/pull/4482))
- JIT: Add `caret-color` utilities ([#4499](https://github.com/tailwindlabs/tailwindcss/pull/4499))
- Rename `lightBlue` to `sky`, emit console warning when using deprecated name ([#4513](https://github.com/tailwindlabs/tailwindcss/pull/4513))
- New CLI with improved JIT support, `--watch` mode, and more ([#4526](https://github.com/tailwindlabs/tailwindcss/pull/4526), [4558](https://github.com/tailwindlabs/tailwindcss/pull/4558))
- JIT: Add new `peer-*` variants for styling based on sibling state ([#4556](https://github.com/tailwindlabs/tailwindcss/pull/4556))
- Expose `safelist` as a top-level option under `purge` for both JIT and classic engines ([#4580](https://github.com/tailwindlabs/tailwindcss/pull/4580))
- JIT: Remove need for `transform` class when using classes like `scale-*`, `rotate-*`, etc. ([#4604](https://github.com/tailwindlabs/tailwindcss/pull/4604))
- JIT: Remove need for `filter` and `backdrop-filter` classes when using classes like `contrast-*`, `backdrop-blur-*`, etc. ([#4614](https://github.com/tailwindlabs/tailwindcss/pull/4614))
- Support passing a custom path for your PostCSS configuration in the Tailwind CLI ([#4607](https://github.com/tailwindlabs/tailwindcss/pull/4607))
- Add `blur-none` by default with intent to deprecate `blur-0` ([#4614](https://github.com/tailwindlabs/tailwindcss/pull/4614))

### Fixed

- JIT: Improve support for Svelte class bindings ([#4187](https://github.com/tailwindlabs/tailwindcss/pull/4187))
- JIT: Improve support for `calc` and `var` in arbitrary values ([#4147](https://github.com/tailwindlabs/tailwindcss/pull/4147))
- Convert `hsl` colors to `hsla` when transforming for opacity support instead of `rgba` ([#3850](https://github.com/tailwindlabs/tailwindcss/pull/3850))
- Fix `backdropBlur` variants not being generated ([#4188](https://github.com/tailwindlabs/tailwindcss/pull/4188))
- Improve animation value parsing ([#4250](https://github.com/tailwindlabs/tailwindcss/pull/4250))
- Ignore unknown object types when hashing config ([82f4eaa](https://github.com/tailwindlabs/tailwindcss/commit/82f4eaa6832ef8a4e3fd90869e7068efdf6e34f2))
- Ensure variants are grouped properly for plugins with order-dependent utilities ([#4273](https://github.com/tailwindlabs/tailwindcss/pull/4273))
- JIT: Fix temp file storage when node temp directories are kept on a different drive than the project itself ([#4044](https://github.com/tailwindlabs/tailwindcss/pull/4044))
- Support border-opacity utilities alongside default `border` utility ([#4277](https://github.com/tailwindlabs/tailwindcss/pull/4277))
- JIT: Fix source maps for expanded `@tailwind` directives ([2f15411](https://github.com/tailwindlabs/tailwindcss/commit/2f1541123dea29d8a2ab0f1411bf60c79eeb96b4))
- JIT: Ignore whitespace when collapsing adjacent rules ([15642fb](https://github.com/tailwindlabs/tailwindcss/commit/15642fbcc885eba9cc50b7678a922b09c90d6b51))
- JIT: Generate group parent classes correctly when using custom separator ([#4508](https://github.com/tailwindlabs/tailwindcss/pull/4508))
- JIT: Fix incorrect stacking of multiple `group` variants ([#4551](https://github.com/tailwindlabs/tailwindcss/pull/4551))
- JIT: Fix memory leak due to holding on to unused contexts ([#4571](https://github.com/tailwindlabs/tailwindcss/pull/4571))

### Internals

- Add integration tests for popular build runners ([#4354](https://github.com/tailwindlabs/tailwindcss/pull/4354))

## [2.1.4] - 2021-06-02

### Fixed

- Skip `raw` PurgeCSS sources when registering template dependencies ([#4542](https://github.com/tailwindlabs/tailwindcss/pull/4542))

## [2.1.3] - 2021-06-01

### Fixed

- Register PurgeCSS paths as PostCSS dependencies to guarantee proper cache-busting in webpack 5 ([#4530](https://github.com/tailwindlabs/tailwindcss/pull/4530))

## [2.1.2] - 2021-04-23

### Fixed

- Fix issue where JIT engine would generate the wrong CSS when using PostCSS 7 ([#4078](https://github.com/tailwindlabs/tailwindcss/pull/4078))

## [2.1.1] - 2021-04-05

### Fixed

- Fix issue where JIT engine would fail to compile when a source path isn't provided by the build runner for the current input file ([#3978](https://github.com/tailwindlabs/tailwindcss/pull/3978))

## [2.1.0] - 2021-04-05

### Added

- Add alternate JIT engine (in preview) ([#3905](https://github.com/tailwindlabs/tailwindcss/pull/3905))
- Add new `mix-blend-mode` and `background-blend-mode` utilities ([#3920](https://github.com/tailwindlabs/tailwindcss/pull/3920))
- Add new `box-decoration-break` utilities ([#3911](https://github.com/tailwindlabs/tailwindcss/pull/3911))
- Add new `isolation` utilities ([#3914](https://github.com/tailwindlabs/tailwindcss/pull/3914))
- Add `inline-table` display utility ([#3563](https://github.com/tailwindlabs/tailwindcss/pull/3563))
- Add `list-item` display utility ([#3929](https://github.com/tailwindlabs/tailwindcss/pull/3929))
- Add new `filter` and `backdrop-filter` utilities ([#3923](https://github.com/tailwindlabs/tailwindcss/pull/3923))

## [2.0.4] - 2021-03-17

### Fixed

- Pass full `var(--bg-opacity)` value as `opacityValue` when defining colors as functions

## [2.0.3] - 2021-02-07

### Fixed

- Ensure sourcemap input is deterministic when using `@apply` in Vue components ([#3356](https://github.com/tailwindlabs/tailwindcss/pull/3356))
- Ensure placeholder opacity is consistent across browsers ([#3308](https://github.com/tailwindlabs/tailwindcss/pull/3308))
- Fix issue where `theme()` didn't work with colors defined as functions ([#2919](https://github.com/tailwindlabs/tailwindcss/pull/2919))
- Enable `dark` variants by default for color opacity utilities ([#2975](https://github.com/tailwindlabs/tailwindcss/pull/2975))

### Added

- Add support for a `tailwind.config.cjs` file in Node ESM projects ([#3181](https://github.com/tailwindlabs/tailwindcss/pull/3181))
- Add version comment to Preflight ([#3255](https://github.com/tailwindlabs/tailwindcss/pull/3255))
- Add `cursor-help` by default ([#3199](https://github.com/tailwindlabs/tailwindcss/pull/3199))

## [2.0.2] - 2020-12-11

### Fixed

- Fix issue with `@apply` not working as expected with `!important` inside an at-rule ([#2824](https://github.com/tailwindlabs/tailwindcss/pull/2824))
- Fix issue with `@apply` not working as expected with defined classes ([#2832](https://github.com/tailwindlabs/tailwindcss/pull/2832))
- Fix memory leak, and broken `@apply` when splitting up files ([#3032](https://github.com/tailwindlabs/tailwindcss/pull/3032))

### Added

- Add default values for the `ring` utility ([#2951](https://github.com/tailwindlabs/tailwindcss/pull/2951))

## [2.0.1] - 2020-11-18

- Nothing, just the only thing I could do when I found out npm won't let me publish the same version under two tags.

## [2.0.0] - 2020-11-18

### Added

- Add redesigned color palette ([#2623](https://github.com/tailwindlabs/tailwindcss/pull/2623), [700866c](https://github.com/tailwindlabs/tailwindcss/commit/700866ce5e0c0b8d140be161c4d07fc6f31242bc), [#2633](https://github.com/tailwindlabs/tailwindcss/pull/2633))
- Add dark mode support ([#2279](https://github.com/tailwindlabs/tailwindcss/pull/2279), [#2631](https://github.com/tailwindlabs/tailwindcss/pull/2631))
- Add `overflow-ellipsis` and `overflow-clip` utilities ([#1289](https://github.com/tailwindlabs/tailwindcss/pull/1289))
- Add `transform-gpu` to force hardware acceleration on transforms when desired ([#1380](https://github.com/tailwindlabs/tailwindcss/pull/1380))
- Extend default spacing scale ([#2630](https://github.com/tailwindlabs/tailwindcss/pull/2630), [7f05204](https://github.com/tailwindlabs/tailwindcss/commit/7f05204ce7a5581b6845591448265c3c21afde86))
- Add spacing scale to `inset` plugin ([#2630](https://github.com/tailwindlabs/tailwindcss/pull/2630))
- Add percentage sizes to `translate`, `inset`, and `height` plugins ([#2630](https://github.com/tailwindlabs/tailwindcss/pull/2630), [5259560](https://github.com/tailwindlabs/tailwindcss/commit/525956065272dc53e8f8395f55f9ad13077a38d1))
- Extend default font size scale ([#2609](https://github.com/tailwindlabs/tailwindcss/pull/2609), [#2619](https://github.com/tailwindlabs/tailwindcss/pull/2619))
- Support using `@apply` with complex classes, including variants like `lg:hover:bg-blue-500` ([#2159](https://github.com/tailwindlabs/tailwindcss/pull/2159))
- Add new `2xl` breakpoint at 1536px by default ([#2609](https://github.com/tailwindlabs/tailwindcss/pull/2609))
- Add default line-height values for font-size utilities ([#2609](https://github.com/tailwindlabs/tailwindcss/pull/2609))
- Support defining theme values using arrays for CSS properties that support comma separated values ([e13f083c4](https://github.com/tailwindlabs/tailwindcss/commit/e13f083c4bc48bf9870d27c966136a9584943127))
- Enable `group-hover` for color plugins, `boxShadow`, and `textDecoration` by default ([28985b6](https://github.com/tailwindlabs/tailwindcss/commit/28985b6cd592e72d4849fdb9ce97eb045744e09c), [f6923b1](https://github.com/tailwindlabs/tailwindcss/commit/f6923b1))
- Enable `focus` for z-index utilities by default ([ae5b3d3](https://github.com/tailwindlabs/tailwindcss/commit/ae5b3d312d5000ae9c2065001f3df7add72dc365))
- Support `extend` in `variants` configuration ([#2651](https://github.com/tailwindlabs/tailwindcss/pull/2651))
- Add `max-w-prose` class by default ([#2574](https://github.com/tailwindlabs/tailwindcss/pull/2574))
- Support flattening deeply nested color objects ([#2148](https://github.com/tailwindlabs/tailwindcss/pull/2148))
- Support defining presets as functions ([#2680](https://github.com/tailwindlabs/tailwindcss/pull/2680))
- Support deep merging of objects under `extend` ([#2679](https://github.com/tailwindlabs/tailwindcss/pull/2679), [#2700](https://github.com/tailwindlabs/tailwindcss/pull/2700))
- Enable `focus-within` for all plugins that have `focus` enabled by default ([1a21f072](https://github.com/tailwindlabs/tailwindcss/commit/1a21f0721c7368d61fa3feef33d616de3f78c7d7), [f6923b1](https://github.com/tailwindlabs/tailwindcss/commit/f6923b1))
- Added new `ring` utilities for creating outline/focus rings using box shadows ([#2747](https://github.com/tailwindlabs/tailwindcss/pull/2747), [879f088](https://github.com/tailwindlabs/tailwindcss/commit/879f088), [e0788ef](https://github.com/tailwindlabs/tailwindcss/commit/879f088))
- Added `5` and `95` to opacity scale ([#2747](https://github.com/tailwindlabs/tailwindcss/pull/2747))
- Add support for default duration and timing function values whenever enabling transitions ([#2755](https://github.com/tailwindlabs/tailwindcss/pull/2755))

### Changed

- Completely redesign color palette ([#2623](https://github.com/tailwindlabs/tailwindcss/pull/2623), [700866c](https://github.com/tailwindlabs/tailwindcss/commit/700866ce5e0c0b8d140be161c4d07fc6f31242bc), [#2633](https://github.com/tailwindlabs/tailwindcss/pull/2633))
- Drop support for Node 8 and 10 ([#2582](https://github.com/tailwindlabs/tailwindcss/pull/2582))
- Removed `target` feature and dropped any compatibility with IE 11 ([#2571](https://github.com/tailwindlabs/tailwindcss/pull/2571))
- Upgrade to PostCSS 8 (but include PostCSS 7 compatibility build) ([729b400](https://github.com/tailwindlabs/tailwindcss/commit/729b400a685973f46af73c8a68b364f20f7c5e1e), [1d8679d](https://github.com/tailwindlabs/tailwindcss/commit/1d8679d37e0eb1ba8281b2076bade5fc754f47dd), [c238ed1](https://github.com/tailwindlabs/tailwindcss/commit/c238ed15b5c02ff51978965511312018f2bc2cae))
- Removed `shadow-outline`, `shadow-solid`, and `shadow-xs` by default in favor of new `ring` API ([#2747](https://github.com/tailwindlabs/tailwindcss/pull/2747))
- Switch `normalize.css` to `modern-normalize` ([#2572](https://github.com/tailwindlabs/tailwindcss/pull/2572))
- Rename `whitespace-no-wrap` to `whitespace-nowrap` ([#2664](https://github.com/tailwindlabs/tailwindcss/pull/2664))
- Rename `flex-no-wrap` to `flex-nowrap` ([#2676](https://github.com/tailwindlabs/tailwindcss/pull/2676))
- Remove `clearfix` utility, recommend `flow-root` instead ([#2766](https://github.com/tailwindlabs/tailwindcss/pull/2766))
- Disable `hover` and `focus` for `fontWeight` utilities by default ([f6923b1](https://github.com/tailwindlabs/tailwindcss/commit/f6923b1))
- Remove `grid-gap` fallbacks needed for old versions of Safari ([5ec45fa](https://github.com/tailwindlabs/tailwindcss/commit/5ec45fa))
- Change special use of 'default' in config to 'DEFAULT' ([#2580](https://github.com/tailwindlabs/tailwindcss/pull/2580))
- New `@apply` implementation, slight backwards incompatibilities with previous behavior ([#2159](https://github.com/tailwindlabs/tailwindcss/pull/2159))
- Make `theme` retrieve the expected resolved value when theme value is complex ([e13f083c4](https://github.com/tailwindlabs/tailwindcss/commit/e13f083c4bc48bf9870d27c966136a9584943127))
- Move `truncate` class to `textOverflow` core plugin ([#2562](https://github.com/tailwindlabs/tailwindcss/pull/2562))
- Remove `scrolling-touch` and `scrolling-auto` utilities ([#2573](https://github.com/tailwindlabs/tailwindcss/pull/2573))
- Modernize default system font stacks ([#1711](https://github.com/tailwindlabs/tailwindcss/pull/1711))
- Upgrade to PurgeCSS 3.0 ([8e4e0a0](https://github.com/tailwindlabs/tailwindcss/commit/8e4e0a0eb8dcbf84347c7562988b4f9afd344081))
- Change default `text-6xl` font-size to 3.75rem instead of 4rem ([#2619](https://github.com/tailwindlabs/tailwindcss/pull/2619))
- Ignore `[hidden]` elements within `space` and `divide` utilities instead of `template` elements ([#2642](https://github.com/tailwindlabs/tailwindcss/pull/2642))
- Automatically prefix keyframes and animation names when a prefix is configured ([#2621](https://github.com/tailwindlabs/tailwindcss/pull/2621), [#2641](https://github.com/tailwindlabs/tailwindcss/pull/2641))
- Merge `extend` objects deeply by default ([#2679](https://github.com/tailwindlabs/tailwindcss/pull/2679))
- Respect `preserveHtmlElements` option even when using custom PurgeCSS extractor ([#2704](https://github.com/tailwindlabs/tailwindcss/pull/2704))
- Namespace all internal custom properties under `tw-` to avoid collisions with end-user custom properties ([#2771](https://github.com/tailwindlabs/tailwindcss/pull/2771))

## [2.0.0-alpha.25] - 2020-11-17

### Fixed

- Fix issue where `ring-offset-0` didn't work due to unitless `0` in `calc` function ([3de0c48](https://github.com/tailwindlabs/tailwindcss/commit/3de0c48))

## [2.0.0-alpha.24] - 2020-11-16

### Changed

- Don't override ring color when overriding ring width with a variant ([e40079a](https://github.com/tailwindlabs/tailwindcss/commit/e40079a))

### Fixed

- Prevent shadow/ring styles from cascading to children ([e40079a](https://github.com/tailwindlabs/tailwindcss/commit/e40079a))
- Ensure rings have a default color even if `colors.blue.500` is not present in config ([e40079a](https://github.com/tailwindlabs/tailwindcss/commit/e40079a))

## [2.0.0-alpha.23] - 2020-11-16

### Added

- Add scripts for generating a PostCSS 7 compatible build alongside PostCSS 8 version ([#2773](https://github.com/tailwindlabs/tailwindcss/pull/2773))

### Changed

- All custom properties have been internally namespaced under `tw-` to avoid collisions with end-user custom properties ([#2771](https://github.com/tailwindlabs/tailwindcss/pull/2771))

## [2.0.0-alpha.22] - 2020-11-16

### Changed

- ~~All custom properties have been internally namespaced under `tw-` to avoid collisions with end-user custom properties ([#2771](https://github.com/tailwindlabs/tailwindcss/pull/2771))~~ I made a git boo-boo, check alpha.23 instead

## [2.0.0-alpha.21] - 2020-11-15

### Changed

- Upgrade to PostCSS 8, Autoprefixer 10, move `postcss` and `autoprefixer` to peerDependencies ([729b400](https://github.com/tailwindlabs/tailwindcss/commit/729b400))

## [2.0.0-alpha.20] - 2020-11-13

### Changed

- Remove `clearfix` utility, recommend `flow-root` instead ([#2766](https://github.com/tailwindlabs/tailwindcss/pull/2766))

## [2.0.0-alpha.19] - 2020-11-13

### Fixed

- Don't crash when color palette is empty ([278c203](https://github.com/tailwindlabs/tailwindcss/commit/278c203))

## [2.0.0-alpha.18] - 2020-11-13

### Changed

- `black` and `white` have been added to `colors.js` ([b3ed724](https://github.com/tailwindlabs/tailwindcss/commit/b3ed724))

### Fixed

- Add support for colors as closures to `ringColor` and `ringOffsetColor`, previously would crash build ([62a47f9](https://github.com/tailwindlabs/tailwindcss/commit/62a47f9))

## [2.0.0-alpha.17] - 2020-11-13

### Changed

- Remove `grid-gap` fallbacks needed for old versions of Safari ([5ec45fa](https://github.com/tailwindlabs/tailwindcss/commit/5ec45fa))

## [2.0.0-alpha.16] - 2020-11-12

### Added

- Enable `focus`, `focus-within`, and `dark` variants (when enabled) for all ring utilities by default ([e0788ef](https://github.com/tailwindlabs/tailwindcss/commit/879f088))

## [2.0.0-alpha.15] - 2020-11-11

### Added

- Added `ring-inset` utility for rendering rings as inset shadows ([879f088](https://github.com/tailwindlabs/tailwindcss/commit/879f088))

### Changed

- `ringWidth` utilities always reset ring styles to ensure no accidental variable inheritance through the cascade ([879f088](https://github.com/tailwindlabs/tailwindcss/commit/879f088))

## [2.0.0-alpha.14] - 2020-11-11

### Added

- Enable `focus-within` for `outline` utilities by default ([f6923b1](https://github.com/tailwindlabs/tailwindcss/commit/f6923b1))
- Enable `focus-within` for `ringWidth` utilities by default ([f6923b1](https://github.com/tailwindlabs/tailwindcss/commit/f6923b1))
- Enable `group-hover` for `boxShadow` utilities by default ([f6923b1](https://github.com/tailwindlabs/tailwindcss/commit/f6923b1))
- Enable `group-hover` and `focus-within` for `textDecoration` utilities by default ([f6923b1](https://github.com/tailwindlabs/tailwindcss/commit/f6923b1))

### Changed

- Disable `hover` and `focus` for `fontWeight` utilities by default ([f6923b1](https://github.com/tailwindlabs/tailwindcss/commit/f6923b1))

## [2.0.0-alpha.13] - 2020-11-11

### Added

- Add support for default duration and timing function values whenever enabling transitions ([#2755](https://github.com/tailwindlabs/tailwindcss/pull/2755))

## [2.0.0-alpha.12] - 2020-11-10

### Fixed

- Prevent `boxShadow` utilities from overriding ring shadows added by components like in the custom forms plugin ([c3dd3b6](https://github.com/tailwindlabs/tailwindcss/commit/c3dd3b68454ad418833a9edf7f3409cad66fb5b0))

## [2.0.0-alpha.11] - 2020-11-09

### Fixed

- Convert `none` to `0 0 #0000` when used for shadows to ensure compatibility with `ring` utilities ([4eecc27](https://github.com/tailwindlabs/tailwindcss/commit/4eecc2751ca0c461e8da5bd5772ae650197a2e5d))

## [2.0.0-alpha.10] - 2020-11-09

### Added

- Added new `ring` utilities ([#2747](https://github.com/tailwindlabs/tailwindcss/pull/2747))
- Added `5` and `95` to opacity scale ([#2747](https://github.com/tailwindlabs/tailwindcss/pull/2747))

### Changed

- Removed `shadow-outline`, `shadow-solid`, and `shadow-xs` in favor of new `ring` API ([#2747](https://github.com/tailwindlabs/tailwindcss/pull/2747))

## [2.0.0-alpha.9] - 2020-11-07

### Added

- Added `shadow-solid` utility, a 2px solid shadow that uses the current text color ([369cfae](https://github.com/tailwindlabs/tailwindcss/commit/369cfae2905a577033529c46a5e8ca58c69f5623))
- Enable `focus-within` where useful by default ([1a21f072](https://github.com/tailwindlabs/tailwindcss/commit/1a21f0721c7368d61fa3feef33d616de3f78c7d7))

### Changed

- Update `shadow-outline` to use the new blue ([b078238](https://github.com/tailwindlabs/tailwindcss/commit/b0782385c9832d35a10929b38b4fcaf27e055d6b))

## [2.0.0-alpha.8] - 2020-11-06

### Added

- Add `11` to spacing scale ([7f05204](https://github.com/tailwindlabs/tailwindcss/commit/7f05204ce7a5581b6845591448265c3c21afde86))
- Add percentage-based height values ([5259560](https://github.com/tailwindlabs/tailwindcss/commit/525956065272dc53e8f8395f55f9ad13077a38d1))
- Add indigo to the color palette by default ([700866c](https://github.com/tailwindlabs/tailwindcss/commit/700866ce5e0c0b8d140be161c4d07fc6f31242bc))

### Changed

- Use `coolGray` as the default gray ([700866c](https://github.com/tailwindlabs/tailwindcss/commit/700866ce5e0c0b8d140be161c4d07fc6f31242bc))

## [2.0.0-alpha.7] - 2020-11-05

### Changed

- Revert upgrading to PostCSS 8 lol

## [2.0.0-alpha.6] - 2020-11-04

### Changed

- Respect `preserveHtmlElements` option even when using custom PurgeCSS extractor ([#2704](https://github.com/tailwindlabs/tailwindcss/pull/2704))
- Set font-family and line-height to `inherit` on `body` to behave more like v1.x ([#2729](https://github.com/tailwindlabs/tailwindcss/pull/2729))

## [2.0.0-alpha.5] - 2020-10-30

### Changed

- Upgrade to PostCSS 8 ([59aa484](https://github.com/tailwindlabs/tailwindcss/commit/59aa484dfea0607d96bff6ef41b1150c78576c37))

## [2.0.0-alpha.4] - 2020-10-29

### Added

- Support deep merging of arrays of objects under `extend` ([#2700](https://github.com/tailwindlabs/tailwindcss/pull/2700))

## [2.0.0-alpha.3] - 2020-10-27

### Added

- Support flattening deeply nested color objects ([#2148](https://github.com/tailwindlabs/tailwindcss/pull/2148))
- Support defining presets as functions ([#2680](https://github.com/tailwindlabs/tailwindcss/pull/2680))

### Changed

- Merge `extend` objects deeply by default ([#2679](https://github.com/tailwindlabs/tailwindcss/pull/2679))
- Rename `flex-no-wrap` to `flex-nowrap` ([#2676](https://github.com/tailwindlabs/tailwindcss/pull/2676))

## [2.0.0-alpha.2] - 2020-10-25

### Added

- Support `extend` in `variants` configuration ([#2651](https://github.com/tailwindlabs/tailwindcss/pull/2651))
- Add `max-w-prose` class by default ([#2574](https://github.com/tailwindlabs/tailwindcss/pull/2574))

### Changed

- Revert use of logical properties for `space` and `divide` utilities ([#2644](https://github.com/tailwindlabs/tailwindcss/pull/2644))
- `space` and `divide` utilities ignore elements with `[hidden]` now instead of only ignoring `template` elements ([#2642](https://github.com/tailwindlabs/tailwindcss/pull/2642))
- Set default font on `body`, not just `html` ([#2643](https://github.com/tailwindlabs/tailwindcss/pull/2643))
- Automatically prefix keyframes and animation names when a prefix is configured ([#2621](https://github.com/tailwindlabs/tailwindcss/pull/2621), [#2641](https://github.com/tailwindlabs/tailwindcss/pull/2641))
- Rename `whitespace-no-wrap` to `whitespace-nowrap` ([#2664](https://github.com/tailwindlabs/tailwindcss/pull/2664))

## [1.9.6] - 2020-10-23

### Changed

- The `presets` feature had unexpected behavior where a preset config without its own `presets` key would not extend the default config. ([#2662](https://github.com/tailwindlabs/tailwindcss/pull/2662))

  If you were depending on this unexpected behavior, just add `presets: []` to your own preset to exclude the default configuration.

## [2.0.0-alpha.1] - 2020-10-20

### Added

- Added dark mode support ([#2279](https://github.com/tailwindlabs/tailwindcss/pull/2279), [#2631](https://github.com/tailwindlabs/tailwindcss/pull/2631))
- Added `overflow-ellipsis` and `overflow-clip` utilities ([#1289](https://github.com/tailwindlabs/tailwindcss/pull/1289))
- Add `transform-gpu` to force hardware acceleration on transforms when beneficial ([#1380](https://github.com/tailwindlabs/tailwindcss/pull/1380))
- Extended spacing scale ([#2630](https://github.com/tailwindlabs/tailwindcss/pull/2630))
- Add spacing scale to `inset` plugin ([#2630](https://github.com/tailwindlabs/tailwindcss/pull/2630))
- Enable useful relative sizes for more plugins ([#2630](https://github.com/tailwindlabs/tailwindcss/pull/2630))
- Extend font size scale ([#2609](https://github.com/tailwindlabs/tailwindcss/pull/2609), [#2619](https://github.com/tailwindlabs/tailwindcss/pull/2619))
- Support using `@apply` with complex classes ([#2159](https://github.com/tailwindlabs/tailwindcss/pull/2159))
- Add new `2xl` breakpoint ([#2609](https://github.com/tailwindlabs/tailwindcss/pull/2609))
- Add default line-height values for font-size utilities ([#2609](https://github.com/tailwindlabs/tailwindcss/pull/2609))
- Support defining theme values using arrays wherever it makes sense (box-shadow, transition-property, etc.) ([e13f083c4](https://github.com/tailwindlabs/tailwindcss/commit/e13f083c4bc48bf9870d27c966136a9584943127))
- Enable `group-hover` for color utilities by default ([28985b6](https://github.com/tailwindlabs/tailwindcss/commit/28985b6cd592e72d4849fdb9ce97eb045744e09c))
- Enable `focus` for z-index utilities by default ([ae5b3d3](https://github.com/tailwindlabs/tailwindcss/commit/ae5b3d312d5000ae9c2065001f3df7add72dc365))

### Changed

- New `@apply` implementation, slight backwards incompatibilities with previous behavior ([#2159](https://github.com/tailwindlabs/tailwindcss/pull/2159))
- Move `truncate` class to `textOverflow` core plugin ([#2562](https://github.com/tailwindlabs/tailwindcss/pull/2562))
- Removed `target` feature and dropped any compatibility with IE 11 ([#2571](https://github.com/tailwindlabs/tailwindcss/pull/2571))
- Switch `normalize.css` to `modern-normalize` ([#2572](https://github.com/tailwindlabs/tailwindcss/pull/2572))
- Remove `scrolling-touch` and `scrolling-auto` utilities ([#2573](https://github.com/tailwindlabs/tailwindcss/pull/2573))
- Change special use of 'default' in config to 'DEFAULT' ([#2580](https://github.com/tailwindlabs/tailwindcss/pull/2580))
- Drop support for Node 8 and 10 ([#2582](https://github.com/tailwindlabs/tailwindcss/pull/2582))
- Modernize default system font stacks ([#1711](https://github.com/tailwindlabs/tailwindcss/pull/1711))
- Upgrade to PurgeCSS 3.0
- ~~Upgrade to PostCSS 8.0~~ Reverted for now
- Use logical properties for `space` and `divide` utilities ([#1883](https://github.com/tailwindlabs/tailwindcss/pull/1883))
- Make `theme` retrieve the expected resolved value when theme value is complex ([e13f083c4](https://github.com/tailwindlabs/tailwindcss/commit/e13f083c4bc48bf9870d27c966136a9584943127))
- Adjust default font-size scale to include 60px instead of 64px ([#2619](https://github.com/tailwindlabs/tailwindcss/pull/2619))
- Update default colors in Preflight to match new color palette ([#2633](https://github.com/tailwindlabs/tailwindcss/pull/2633))

## [1.9.5] - 2020-10-19

### Fixed

- Fix issue where using `theme` with default line-heights did not resolve correctly

## [1.9.4] - 2020-10-17

### Fixed

- Fix issue changing plugins defined using the `withOptions` API would not trigger rebuilds in watch processes

## [1.9.3] - 2020-10-16

### Fixed

- Fix issue where `tailwindcss init --full` scaffolded a corrupt config file (https://github.com/tailwindlabs/tailwindcss/issues/2556)

### Changed

- Remove console warnings about upcoming breaking changes

## [1.9.2] - 2020-10-14

### Fixed

- Merge plugins when merging config with preset ([#2561](https://github.com/tailwindlabs/tailwindcss/pulls/#2561)
- Use `word-wrap` and `overflow-wrap` together, not one or the other since `word-wrap` is IE-only

## [1.9.1] - 2020-10-14

### Fixed

- Don't import `corePlugins` in `resolveConfig` to avoid bundling browser-incompatible code ([#2548](https://github.com/tailwindlabs/tailwindcss/pull/2548))

## [1.9.0] - 2020-10-12

### Added

- Add new `presets` config option ([#2474](https://github.com/tailwindlabs/tailwindcss/pull/2474))
- Scaffold new `tailwind.config.js` files with available `future` flags commented out ([#2379](https://github.com/tailwindlabs/tailwindcss/pull/2379))
- Add `col-span-full` and `row-span-full` ([#2471](https://github.com/tailwindlabs/tailwindcss/pull/2471))
- Make `outline` configurable, `outline-none` more accessible by default, and add `outline-black` and `outline-white` ([#2460](https://github.com/tailwindlabs/tailwindcss/pull/2460))
- Add additional small `rotate` and `skew` values ([#2528](https://github.com/tailwindlabs/tailwindcss/pull/2528))
- Add `xl`, `2xl`, and `3xl` border radius values ([#2529](https://github.com/tailwindlabs/tailwindcss/pull/2529))
- Add new utilities for `grid-auto-columns` and `grid-auto-rows` ([#2531](https://github.com/tailwindlabs/tailwindcss/pull/2531))
- Promote `defaultLineHeights` and `standardFontWeights` from experimental to future

### Fixed

- Don't escape keyframe values ([#2432](https://github.com/tailwindlabs/tailwindcss/pull/2432))
- Use `word-wrap` instead of `overflow-wrap` in `ie11` target mode ([#2391](https://github.com/tailwindlabs/tailwindcss/pull/2391))

### Experimental

- Add experimental `2xl` breakpoint ([#2468](https://github.com/tailwindlabs/tailwindcss/pull/2468))
- Rename `{u}-max-content` and `{u}-min-content` utilities to `{u}-max` and `{u}-min` in experimental extended spacing scale ([#2532](https://github.com/tailwindlabs/tailwindcss/pull/2532))
- Support disabling dark mode variants globally ([#2530](https://github.com/tailwindlabs/tailwindcss/pull/2530))

## [1.8.13] - 2020-10-09

### Fixed

- Support defining colors as closures even when opacity variables are not supported ([#2536](https://github.com/tailwindlabs/tailwindcss/pull/2515))

## [1.8.12] - 2020-10-07

### Fixed

- Reset color opacity variable in utilities generated using closure colors ([#2515](https://github.com/tailwindlabs/tailwindcss/pull/2515))

## [1.8.11] - 2020-10-06

- Make `tailwindcss.plugin` work in ESM environments for reasons

## [1.8.10] - 2020-09-14

### Fixed

- Prevent new `dark` experiment from causing third-party `dark` variants to inherit stacking behavior ([#2382](https://github.com/tailwindlabs/tailwindcss/pull/2382))

## [1.8.9] - 2020-09-13

### Fixed

- Add negative spacing values to inset plugin in the `extendedSpacingScale` experiment ([#2358](https://github.com/tailwindlabs/tailwindcss/pull/2358))
- Fix issue where `!important` was stripped from declarations within rules that used `@apply` with `applyComplexClasses` ([#2376](https://github.com/tailwindlabs/tailwindcss/pull/2376))

### Changed

- Add `future` section to config stubs ([#2372](https://github.com/tailwindlabs/tailwindcss/pull/2372), [3090b98](https://github.com/tailwindlabs/tailwindcss/commit/3090b98ece766b1046abe5bbaa94204e811f7fac))

## [1.8.8] - 2020-09-11

### Fixed

- Register dark mode plugin outside of `resolveConfig` code path ([#2368](https://github.com/tailwindlabs/tailwindcss/pull/2368))

## [1.8.7] - 2020-09-10

### Fixed

- Fix issue where classes in escaped strings (like `class=\"block\"`) weren't extracted properly for purging ([#2364](https://github.com/tailwindlabs/tailwindcss/pull/2364))

## [1.8.6] - 2020-09-09

### Fixed

- Fix issue where container padding not applied when using object syntax ([#2353](https://github.com/tailwindlabs/tailwindcss/pull/2353))

## [1.8.5] - 2020-09-07

### Fixed

- Fix issue where `resolveConfig` didn't take into account configs added by feature flags ([#2347](https://github.com/tailwindlabs/tailwindcss/pull/2347))

## [1.8.4] - 2020-09-06

### Fixed

- Fix [issue](https://github.com/tailwindlabs/tailwindcss/issues/2258) where inserting extra PurgeCSS control comments could break integrated PurgeCSS support
- Fix issue where dark variant in 'class' mode was incompatible with 'group-hover' variant ([#2337](https://github.com/tailwindlabs/tailwindcss/pull/2337))
- Support basic nesting structure with `@apply` when using the `applyComplexClasses` experiment ([#2271](https://github.com/tailwindlabs/tailwindcss/pull/2271))

### Changed

- Rename `font-hairline` and `font-thin` to `font-thin` and `font-extralight` behind `standardFontWeights` flag (experimental until v1.9.0) ([#2333](https://github.com/tailwindlabs/tailwindcss/pull/2333))

## [1.8.3] - 2020-09-05

### Fixed

- Fix issue where `font-variant-numeric` utilities would break in combination with most CSS minifier configurations ([f3660ce](https://github.com/tailwindlabs/tailwindcss/commit/f3660ceed391cfc9390ca4ea1a729a955e64b895))
- Only warn about `conservative` purge mode being deprecated once per process ([58781b5](https://github.com/tailwindlabs/tailwindcss/commit/58781b517daffbaf80fc5c0791d311f53b2d67d8))

## [1.8.2] - 2020-09-04

### Fixed

- Fix bug where dark mode variants would cause an error if you had a `plugins` array in your config ([#2322](https://github.com/tailwindlabs/tailwindcss/pull/2322))

## [1.8.1] - 2020-09-04

### Fixed

- Fix bug in the new font-variant-numeric utilities which broke the whole rule ([#2318](https://github.com/tailwindlabs/tailwindcss/pull/2318))
- Fix bug while purging ([#2320](https://github.com/tailwindlabs/tailwindcss/pull/2320))

## [1.8.0] - 2020-09-04

### Added

- Dark mode variant (experimental) ([#2279](https://github.com/tailwindlabs/tailwindcss/pull/2279))
- New `preserveHtmlElements` option for `purge` ([#2283](https://github.com/tailwindlabs/tailwindcss/pull/2283))
- New `layers` mode for `purge` ([#2288](https://github.com/tailwindlabs/tailwindcss/pull/2288))
- New `font-variant-numeric` utilities ([#2305](https://github.com/tailwindlabs/tailwindcss/pull/2305))
- New `place-items`, `place-content`, `place-self`, `justify-items`, and `justify-self` utilities ([#2306](https://github.com/tailwindlabs/tailwindcss/pull/2306))
- Support configuring variants as functions ([#2309](https://github.com/tailwindlabs/tailwindcss/pull/2309))

### Changed

- CSS within `@layer` at-rules are now grouped with the corresponding `@tailwind` at-rule ([#2312](https://github.com/tailwindlabs/tailwindcss/pull/2312))

### Deprecated

- `conservative` purge mode, deprecated in favor of `layers`

## [1.7.6] - 2020-08-29

### Fixed

- Fix bug where the new experimental `@apply` implementation broke when applying a variant class with the important option globally enabled

## [1.7.5] - 2020-08-28

### Changed

- Update lodash to latest to silence security warnings

## [1.7.4] - 2020-08-26

### Added

- Add new -p flag to CLI to quickly scaffold a `postcss.config.js` file

### Changed

- Make `@apply` insensitive to whitespace in the new `applyComplexClasses` experiment

### Fixed

- Fix bug where the new `applyComplexClasses` experiment didn't behave as expected with rules with multiple selectors, like `.foo, .bar { color: red }`

## [1.7.3] - 2020-08-20

### Changed

- Log feature flag notices to stderr instead of stdout to preserve compatibility with pipe-based build systems
- Add missing bg-none utility for disabling background images

### Fixed

- Fix bug that prevented defining colors as closures when the `gradientColorStops` plugin was enabled

## [1.7.2] - 2020-08-19

### Added

- Reuse generated CSS as much as possible in long-running processes instead of needlessly recalculating

## [1.7.1] - 2020-08-28

### Changed

- Don't issue duplicate flag notices in long-running build processes

## [1.7.0] - 2020-08-28

### Added

- Gradients
- New background-clip utilities
- New `contents` display utility
- Default letter-spacing per font-size
- Divide border styles
- Access entire config object from plugins
- Define colors as closures
- Use `@apply` with variants and other complex classes (experimental)
- New additional color-palette (experimental)
- Extended spacing scale (experimental)
- Default line-heights per font-size by default (experimental)
- Extended font size scale (experimental)

### Deprecated

- Deprecated gap utilities

## [1.6.3] - 2020-08-18

### Fixed

- Fixes issue where motion-safe and motion-reduce variants didn't stack correctly with group-hover variants

## [1.6.2] - 2020-08-03

### Fixed

- Fixes issue where `@keyframes` respecting the important option would break animations in Chrome

## [1.6.1] - 2020-08-02

### Fixed

- Fixes an issue where animation keyframes weren't included in the build without @tailwind base (#2108)

## [1.6.0] - 2020-07-28

### Added

- Animation support
- New `prefers-reduced-motion` variants
- New `overscroll-behaviour` utilities
- Generate CSS without an input file

## [1.5.2] - 2020-07-21

### Fixed

- Fixes issue where you could no longer use `@apply` with unprefixed class names if you had configured a prefix

## [1.5.1] - 2020-07-15

### Fixed

- Fixes accidental breaking change where adding component variants using the old manual syntax (as recommended in the docs) stopped working

## [1.5.0] - 2020-07-15

### Added

- Component `variants` support
- Responsive `container` variants
- New `focus-visible` variant
- New `checked` variant

## v0.0.0-658250a96 - 2020-07-12 [YANKED]

No release notes

## [1.4.6] - 2020-05-08

### Changed

- Explicitly error when using a class as the important config option instead of just generating the wrong CSS

## [1.4.5] - 2020-05-06

### Fixed

- Fix bug where the `divideColor` plugin was using the wrong '' in IE11 target mode

## [1.4.4] - 2020-05-01

### Fixed

- Fix bug where target: 'browserslist' didn't work, only `target: ['browserslist', {...}]` did

## [1.4.3] - 2020-05-01

### Changed

- Don't generate unnecessary CSS in color plugins when color opacity utilities are disabled

## [1.4.2] - 2020-05-01

### Fixed

- Fix issue where `purge: { enabled: false }` was ignored, add `purge: false` shorthand

## [1.4.1] - 2020-04-30

### Changed

- Improve built-in PurgeCSS extractor to better support Haml and Slim templates

## [1.4.0] - 2020-04-29

### Added

- New color opacity utilities
- Built-in PurgeCSS
- IE 11 target mode (experimental)

## [1.3.5] - 2020-04-23

### Removed

- Drop `fs-extra` dependency to `^8.0.0` to preserve Node 8 compatibility until Tailwind 2.0

### Fixed

- Fix missing unit in calc bug in space plugin (`space-x-0` didn't work for example)

## [1.3.4] - 2020-04-21

### Fixed

- Fix bug where `divide-{x/y}-0` utilities didn't work due to missing unit in `calc` call

## [1.3.3] - 2020-04-21

### Added

- Add forgotten responsive variants for `space`, `divideWidth`, and `divideColor` utilities

## [1.3.1] - 2020-04-21

### Fixed

- Fix bug where the `space-x` utilities were not being applied correctly due to referencing `--space-y-reverse` instead of `--space-x-reverse`

## [1.3.0] - 2020-04-21

### Added

- New `space` and `divide` layout utilities
- New `transition-delay` utilities
- New `group-focus` variant
- Support for specifying a default line-height for each font-size utility
- Support for breakpoint-specific padding for `container` class
- Added `current` to the default color palette
- New `inline-grid` utility
- New `flow-root` display utility
- New `clear-none` utility

## [1.2.0] - 2020-02-05

### Added

- CSS Transition support
- CSS Transform support
- CSS Grid support
- Added `max-w-{screen}` utilities
- Added `max-w-none` utility
- Added `rounded-md` utility
- Added `shadow-sm` utility
- Added `shadow-xs` utility
- Added `stroke-width` utilities
- Added fixed line-height utilities
- Added additional display utilities for table elements
- Added box-sizing utilities
- Added clear utilities
- Config file dependencies are now watchable
- Added new `plugin` and `plugin.withOptions` APIs

### Changed

- Allow plugins to extend the user's config

## [1.2.0-canary.8] - 2020-02-05

### Added

- Add additional fixed-size line-height utilities

## [1.2.0-canary.7] - 2020-02-04

### Removed

- Remove Inter from font-sans, plan to add later under new class

## [1.2.0-canary.6] - 2020-02-03

### Added

- Add system-ui to default font stack
- Add shadow-xs, increase shadow-sm alpha to 0.05
- Support import syntax even without postcss-import
- Alias tailwind bin to tailwindcss
- Add fill/stroke to transition-colors
- Add transition-shadow, add box-shadow to default transition
- Combine gap/columnGap/rowGap
- Add grid row utilities
- Add skew utilities

### Changed

- Use font-sans as default font

## [1.2.0-canary.5] - 2020-01-08

### Added

- Adds missing dependency `resolve` which is required for making config dependencies watchable

## [1.2.0-canary.4] - 2020-01-08

### Added

- CSS Transition support
- CSS Transform support
- CSS Grid support
- New `max-w-{screen}` utilities
- Added `max-w-none` utility
- Added "Inter" to the default sans-serif font stack
- Add `rounded-md` utility
- Add `shadow-sm` utility
- Added stroke-width utilities
- Added additional display utilities for table elements
- Added box-sizing utilities
- Added clear utilities
- Config file dependencies are now watchable
- Allow plugins to extend the user's config
- Add new `plugin` and `plugin.withOptions` APIs

## [v1.2.0-canary.3] - 2020-01-08 [YANKED]

No release notes

## [1.1.4] - 2019-11-25

### Changed

- Note: Although this is a bugfix it could affect your site if you were working around the bug in your own code by not prefixing the `.group` class. I'm sorry 😞

### Fixed

- Fixes a bug where the `.group` class was not receiving the user's configured prefix when using the `prefix` option

## [1.2.0-canary.1] - 2019-10-22

### Changed

- Don't watch `node_modules` files for changes

### Fixed

- Fixes significant build performance regression in `v1.2.0-canary.0`

## [1.1.3] - 2019-10-22

### Fixed

- Fixes an issue where in some cases function properties in the user's `theme` config didn't receive the second utils argument

## [1.2.0-canary.0] - 2019-10-14

### Added

- Automatically watch all config file dependencies (plugins, design tokens imported from other files, etc.) for changes when build watcher is running
- Add `justify-evenly` utility

### Changed

- Allow plugins to add their own config file to be resolved with the user's custom config

## [1.1.2] - 2019-08-14

### Fixed

- Fixes a bug with horizontal rules where they were displayed with a 2px border instead of a 1px border
- Fixes a bug with horizontal rules where they were rendered with default top/bottom margin

## [1.1.1] - 2019-08-09

### Fixed

- Fixes issue where values like `auto` would fail to make it through the default negative margin config

## [1.1.0] - 2019-08-06

### Added

- Added utilities for screenreader visibility
- Added utilities for placeholder color
- First, last, even, and odd child variants
- Disabled variant
- Visited variant
- Increase utility specificity using a scope instead of !important
- Add hover/focus variants for opacity by default
- Added `border-double` utility
- Support negative prefix for boxShadow and letterSpacing plugins
- Support passing config path via object

### Fixed

- Placeholders no longer have a default opacity
- Make horizontal rules visible by default
- Generate correct negative margins when using calc

## [1.0.6] - 2019-08-01

### Fixed

- Fixes issue where modifiers would mutate nested rules

## [1.0.5] - 2019-07-11

### Added

- Support built-in variants for utilities that include pseudo-elements

### Changed

- Update several dependencies, including postcss-js which fixes an issue with using `!important` directly in Tailwind utility plugins

## [1.0.4] - 2019-06-11

### Changed

- Increase precision of percentage width values to avoid 1px rounding issues in grid layouts

## [1.0.3] - 2019-06-01

### Changed

- Throws an error when someone tries to use `@tailwind preflight` instead of `@tailwind base`, this is the source of many support requests

## [1.0.2] - 2019-05-27

### Fixed

- Fixes a bug where `@screen` rules weren't bubbled properly when nested in plugins

## [1.0.1] - 2019-05-13

### Fixed

- Fixes a bug where global variants weren't properly merged

## [1.0.0] - 2019-05-13

No release notes

## [1.0.0-beta.10] - 2019-05-12

### Changed

- Use `9999` and `-9999` for `order-last` and `order-first` utilities respectively

## [1.0.0-beta.9] - 2019-05-12

### Added

- Add `bg-repeat-round` and `bg-repeat-space` utilities
- Add `select-all` and `select-auto` utilities

### Changed

- Make all utilities responsive by default

## [1.0.0-beta.8] - 2019-04-28

### Added

- Adds `responsive` variants for the new order utilities by default, should have been there all along

## [1.0.0-beta.7] - 2019-04-27

### Fixed

- Fixes a bug where you couldn't extend the margin config

## [1.0.0-beta.6] - 2019-04-27

### Added

- Added support for negative inset (`-top-6`, `-right-4`) and z-index (`-z-10`) utilities, using the same negative key syntax supported by the margin plugin
- Add missing fractions as well as x/12 fractions to width scale
- Add `order` utilities
- Add `cursor-text` class by default

### Changed

- Make it possible to access your fully merged config file in JS

### Removed

- Removed `negativeMargin` plugin, now the regular `margin` plugin supports generating negative classes (like `-mx-6`) by using negative keys in the config, like `-6`

## [1.0.0-beta.5] - 2019-04-18

### Changed

- Make it possible to disable all core plugins using `corePlugins: false`
- Make it possible to configure a single list of variants that applies to all utility plugins
- Make it possible to safelist which core plugins should be enabled

### Fixed

- Fix a bug where stroke and fill plugins didn't properly handle the next object syntax for color definitions
- Fix a bug where you couldn't have comments near `@apply` directives

## [1.0.0-beta.4] - 2019-03-29

### Added

- Add the `container` key to the scaffolded config file when generated with `--full`

### Changed

- Bumps node dependency to 8.9.0 so we can keep our default config file clean, 6.9.0 is EOL next month anyways

### Removed

- Removes `SFMono-Regular` from the beginning of the default monospace font stack, it has no italic support and Menlo looks better anyways

### Fixed

- Fixes an issue where the user's config object was being mutated during processing (only affects @bradlc 😅)
- Fixes an issue where you couldn't use a closure to define theme sections under `extend`

## [1.0.0-beta.3] - 2019-03-18

### Added

- Support lazy evaluation in `theme.extend`

### Changed

- Use lighter default border color
- Revert #745 and use `bolder` for strong tags by default instead of `fontWeight.bold`

## [1.0.0-beta.2] - 2019-03-17

### Changed

- Closures in the `theme` section of the config file are now passed a `theme` function instead of an object

### Fixed

- Fix issue where `@screen` didn't work at all 🙃

## [1.0.0-beta.1] - 2019-03-17

### Added

- New config file structure
- New expanded default color palette
- New default `maxWidth` scale
- Added utilities for `list-style-type` and `list-style-position`
- Added `break-all` utility

### Changed

- `object-position` utilities are now customizable under `theme.objectPosition`
- `cursor` utilities are now customizable under `theme.cursors`
- `flex-grow/shrink` utilities are now customizable under `theme.flexGrow/flexShrink`
- Default variant output position can be customized
- Extended default line-height scale
- Extended default letter-spacing scale

## [0.7.4] - 2019-01-23

### Changed

- Update our PostCSS related dependencies

### Fixed

- Fix bug where class names containing a `.`character had the responsive prefix added in the wrong place

## [0.7.3] - 2018-12-03

### Changed

- Update Normalize to v8.0.1

## [0.7.2] - 2018-11-05

### Added

- Add `--no-autoprefixer` option to CLI `build` command

## [0.7.1] - 2018-11-05

### Changed

- Update autoprefixer dependency

## [0.7.0] - 2018-10-31

### Added

- Registering new variants from plugins
- Variant order can be customized per module
- Added focus-within variant
- Fancy CLI updates
- Option to generate config without comments
- Make configured prefix optional when using @apply
- Improve Flexbox behavior in IE 10/11

### Changed

- Variant order in modules is now significant
- Normalize.css updated to v8.0.0
- Removed CSS fix for Chrome 62 button border radius change

## [0.6.6] - 2018-09-21

### Changed

- Promote `shadowLookup` from experiment to official feature

## [0.6.5] - 2018-08-18

### Fixed

- Fixes an issue where units were stripped from zero value properties

## [0.6.4] - 2018-07-16

### Fixed

- Fixes an issue where changes to your configuration file were ignored when using `webpack --watch`

## [0.6.3] - 2018-07-11

### Fixed

- Fixes an issue where `@tailwind utilities` generated no output

## [0.6.2] - 2018-03-11

### Added

- Added table layout utilities for styling tables
- Configuration can now be passed as an object
- Registering new variants from plugins (experimental)
- Allow `@apply`-ing classes that aren't defined but would be generated (experimental)

### Changed

- Default config file changes

## [0.6.1] - 2018-06-22

### Fixed

- Fix incorrect box-shadow syntax for the `.shadow-outline` utility 🤦‍♂️

## [0.6.0] - 2018-06-21

### Added

- Added border collapse utilities for styling tables
- Added more axis-specific overflow utilities
- Added `.outline-none` utility for suppressing focus styles
- Added `.shadow-outline` utility as an alternative to default browser focus styles
- Extended default padding, margin, negative margin, width, and height scales
- Enable focus and hover variants for more modules by default

### Changed

- Removed default `outline: none !important` styles from focusable but keyboard-inaccessible elements
- Moved screen prefix for responsive `group-hover` variants
- Default config file changes

## [0.5.3] - 2018-05-07

### Changed

- Improve sourcemaps for replaced styles like `preflight`

### Fixed

- Fix bug where informational messages were being logged to stdout during build, preventing the ability to use Tailwind's output in Unix pipelines

## [0.5.2] - 2018-03-29

### Fixed

- Fixes an issue with a dependency that had a security vulnerability

## [0.5.1] - 2018-03-13

### Removed

- Reverts a change that renamed the `.roman` class to `.not-italic` due to the fact that it breaks compatibility with cssnext: [postcss/postcss-selector-not#10](https://github.com/postcss/postcss-selector-not/issues/10). We'll stick with `.roman` for now with a plan to switch to `.not-italic` in another breaking version should that issue get resolved in postcss-selector-not.

## [0.5.0] - 2018-03-13

### Added

- Plugin system
- Added `.sticky position` utility
- Added `.cursor-wait` and `.cursor-move` utilities
- Added `.bg-auto` background size utility
- Background sizes are now customizable
- Support for active variants
- Better postcss-import support
- Configuration options for the `.container` component

### Changed

- The `.container` component is now a built-in plugin
- State variant precedence changes
- New config file keys
- `.overflow-x/y-scroll` now set `overflow: scroll` instead of `overflow: auto`
- `.roman` renamed to `.not-italic`

## [0.4.3] - 2018-03-13

### Changed

- Use `global.Object` to avoid issues with polyfills when importing the Tailwind config into other JS

## [0.4.2] - 2018-03-01

### Added

- Add support for using a function to define class prefixes in addition to a simple string

### Changed

- Improve the performance of @apply by using a lookup table instead of searching

### Fixed

- Fix an issue where borders couldn't be applied to `img` tags without specifying a border style

## [0.4.1] - 2018-01-22

### Changed

- Make default sans-serif font stack more future proof and safe to use with CSS `font` shorthand
- Replace stylefmt with Perfectionist to avoid weird stylelint conflicts

## [0.4.0] - 2017-12-15

### Added

- `@apply`'d classes can now be made `!important` explicitly

### Changed

- `@apply` now strips `!important` from any mixed in classes
- Default color palette tweaks

## [0.3.0] - 2017-12-01

### Added

- Enable/disable modules and control which variants are generated for each
- Focus variants
- Group hover variants
- New `@variants` at-rule
- Customize the separator character
- Missing config keys now fallback to their default values
- New utilities

### Changed

- Lists now have no margins by default
- `.pin` no longer sets width and height to 100%
- SVG `fill` no longer defaults to currentColor

## [0.2.2] - 2017-11-19

### Fixed

- Fix issue with dist files not being published due to bug in latest npm

## [0.2.1] - 2017-11-18

### Fixed

- Fix overly specific border-radius reset for Chrome 62 button styles

## [0.2.0] - 2017-11-17

### Added

- Add a custom prefix to all utilities
- Optionally make all utilities `!important`
- Round element corners independently
- Cascading border colors and styles

### Changed

- `auto` is no longer a hard-coded margin value
- The `defaultConfig` function is now a separate module
- Rounded utilities now combine position and radius size
- Border width utilities no longer affect border color/style
- `@apply` is now very strict about what classes can be applied
- Add `options` key to your config
- Spacing, radius, and border width utility declaration order changes

## [0.1.6] - 2017-11-09

### Fixed

- Fix CDN files not being published to npm

## [0.1.5] - 2017-11-08

### Changed

- Apply the same default placeholder styling that's applied to inputs to textareas

### Fixed

- Fix CLI tool not loading config files properly

## [0.1.4] - 2017-11-06

### Added

- Autoprefix dist assets for quick hacking and prototyping
- Add `my-auto`, `mt-auto`, and `mb-auto` margin utilities
- Add `sans-serif` to end of default `sans` font stack

### Changed

- If using Webpack, it will now watch your config file changes
- When running `tailwind init [filename]`, automatically append `.js` to filename if not present
- Support default fallback value in `config(...)` function, ie. `config('colors.blue', #0000ff)`
- Don't output empty media queries if Tailwind processes a file that doesn't use Tailwind

### Fixed

- Move list utilities earlier in stylesheet to allow overriding with spacing utilities

## [0.1.3] - 2017-11-02

### Added

- Add new `.scrolling-touch` and `.scrolling-auto` utilities for controlling inertial scroll behavior on WebKit touch devices
- Generate separate dist files for preflight, utilities, and tailwind for CDN usage

## [0.1.2] - 2017-11-01

### Changed

- Target Node 6.9.0 explicitly (instead of 8.6 implicitly) to support more users

### Fixed

- Fix issue with config option not being respected in `tailwind build`

## [0.1.1] - 2017-11-01

### Fixed

- Fix `tailwind build` CLI command not writing output files

## [0.1.0] - 2017-11-01

### Added

- Everything!

[unreleased]: https://github.com/tailwindlabs/tailwindcss/compare/v4.0.12...HEAD
[4.0.12]: https://github.com/tailwindlabs/tailwindcss/compare/v4.0.11...v4.0.12
[4.0.11]: https://github.com/tailwindlabs/tailwindcss/compare/v4.0.10...v4.0.11
[4.0.10]: https://github.com/tailwindlabs/tailwindcss/compare/v4.0.9...v4.0.10
[4.0.9]: https://github.com/tailwindlabs/tailwindcss/compare/v4.0.8...v4.0.9
[4.0.8]: https://github.com/tailwindlabs/tailwindcss/compare/v4.0.7...v4.0.8
[4.0.7]: https://github.com/tailwindlabs/tailwindcss/compare/v4.0.6...v4.0.7
[4.0.6]: https://github.com/tailwindlabs/tailwindcss/compare/v4.0.5...v4.0.6
[4.0.5]: https://github.com/tailwindlabs/tailwindcss/compare/v4.0.4...v4.0.5
[4.0.4]: https://github.com/tailwindlabs/tailwindcss/compare/v4.0.3...v4.0.4
[4.0.3]: https://github.com/tailwindlabs/tailwindcss/compare/v4.0.2...v4.0.3
[4.0.2]: https://github.com/tailwindlabs/tailwindcss/compare/v4.0.1...v4.0.2
[4.0.1]: https://github.com/tailwindlabs/tailwindcss/compare/v4.0.0...v4.0.1
[4.0.0]: https://github.com/tailwindlabs/tailwindcss/compare/v4.0.0-beta.10...v4.0.0
[4.0.0-beta.10]: https://github.com/tailwindlabs/tailwindcss/compare/v4.0.0-beta.9...v4.0.0-beta.10
[4.0.0-beta.9]: https://github.com/tailwindlabs/tailwindcss/compare/v4.0.0-beta.8...v4.0.0-beta.9
[4.0.0-beta.8]: https://github.com/tailwindlabs/tailwindcss/compare/v4.0.0-beta.7...v4.0.0-beta.8
[4.0.0-beta.7]: https://github.com/tailwindlabs/tailwindcss/compare/v4.0.0-beta.6...v4.0.0-beta.7
[4.0.0-beta.6]: https://github.com/tailwindlabs/tailwindcss/compare/v4.0.0-beta.5...v4.0.0-beta.6
[4.0.0-beta.5]: https://github.com/tailwindlabs/tailwindcss/compare/v4.0.0-beta.4...v4.0.0-beta.5
[4.0.0-beta.4]: https://github.com/tailwindlabs/tailwindcss/compare/v4.0.0-beta.3...v4.0.0-beta.4
[4.0.0-beta.3]: https://github.com/tailwindlabs/tailwindcss/compare/v4.0.0-beta.2...v4.0.0-beta.3
[4.0.0-beta.2]: https://github.com/tailwindlabs/tailwindcss/compare/v4.0.0-beta.1...v4.0.0-beta.2
[4.0.0-beta.1]: https://github.com/tailwindlabs/tailwindcss/compare/v4.0.0-alpha.36...v4.0.0-beta.1
[4.0.0-alpha.36]: https://github.com/tailwindlabs/tailwindcss/compare/v4.0.0-alpha.35...v4.0.0-alpha.36
[4.0.0-alpha.35]: https://github.com/tailwindlabs/tailwindcss/compare/v4.0.0-alpha.34...v4.0.0-alpha.35
[4.0.0-alpha.34]: https://github.com/tailwindlabs/tailwindcss/compare/v4.0.0-alpha.33...v4.0.0-alpha.34
[4.0.0-alpha.33]: https://github.com/tailwindlabs/tailwindcss/compare/v4.0.0-alpha.32...v4.0.0-alpha.33
[4.0.0-alpha.32]: https://github.com/tailwindlabs/tailwindcss/compare/v4.0.0-alpha.31...v4.0.0-alpha.32
[4.0.0-alpha.31]: https://github.com/tailwindlabs/tailwindcss/compare/v4.0.0-alpha.30...v4.0.0-alpha.31
[4.0.0-alpha.30]: https://github.com/tailwindlabs/tailwindcss/compare/v4.0.0-alpha.29...v4.0.0-alpha.30
[4.0.0-alpha.29]: https://github.com/tailwindlabs/tailwindcss/compare/v4.0.0-alpha.28...v4.0.0-alpha.29
[4.0.0-alpha.28]: https://github.com/tailwindlabs/tailwindcss/compare/v4.0.0-alpha.27...v4.0.0-alpha.28
[4.0.0-alpha.27]: https://github.com/tailwindlabs/tailwindcss/compare/v4.0.0-alpha.26...v4.0.0-alpha.27
[4.0.0-alpha.26]: https://github.com/tailwindlabs/tailwindcss/compare/v4.0.0-alpha.25...v4.0.0-alpha.26
[4.0.0-alpha.25]: https://github.com/tailwindlabs/tailwindcss/compare/v4.0.0-alpha.24...v4.0.0-alpha.25
[4.0.0-alpha.24]: https://github.com/tailwindlabs/tailwindcss/compare/v4.0.0-alpha.23...v4.0.0-alpha.24
[4.0.0-alpha.23]: https://github.com/tailwindlabs/tailwindcss/compare/v4.0.0-alpha.22...v4.0.0-alpha.23
[4.0.0-alpha.22]: https://github.com/tailwindlabs/tailwindcss/compare/v3.4.17...v4.0.0-alpha.22
[3.4.17]: https://github.com/tailwindlabs/tailwindcss/compare/v3.4.16...v3.4.17
[3.4.16]: https://github.com/tailwindlabs/tailwindcss/compare/v3.4.15...v3.4.16
[3.4.15]: https://github.com/tailwindlabs/tailwindcss/compare/v3.4.14...v3.4.15
[3.4.14]: https://github.com/tailwindlabs/tailwindcss/compare/v3.4.13...v3.4.14
[3.4.13]: https://github.com/tailwindlabs/tailwindcss/compare/v3.4.12...v3.4.13
[3.4.12]: https://github.com/tailwindlabs/tailwindcss/compare/v3.4.11...v3.4.12
[3.4.11]: https://github.com/tailwindlabs/tailwindcss/compare/v3.4.10...v3.4.11
[3.4.10]: https://github.com/tailwindlabs/tailwindcss/compare/v3.4.9...v3.4.10
[3.4.9]: https://github.com/tailwindlabs/tailwindcss/compare/v3.4.8...v3.4.9
[3.4.8]: https://github.com/tailwindlabs/tailwindcss/compare/v3.4.7...v3.4.8
[3.4.7]: https://github.com/tailwindlabs/tailwindcss/compare/v3.4.6...v3.4.7
[3.4.6]: https://github.com/tailwindlabs/tailwindcss/compare/v3.4.5...v3.4.6
[3.4.5]: https://github.com/tailwindlabs/tailwindcss/compare/v3.4.4...v3.4.5
[3.4.4]: https://github.com/tailwindlabs/tailwindcss/compare/v3.4.3...v3.4.4
[3.4.3]: https://github.com/tailwindlabs/tailwindcss/compare/v3.4.2...v3.4.3
[3.4.2]: https://github.com/tailwindlabs/tailwindcss/compare/v3.4.1...v3.4.2
[3.4.1]: https://github.com/tailwindlabs/tailwindcss/compare/v3.4.0...v3.4.1
[3.4.0]: https://github.com/tailwindlabs/tailwindcss/compare/v3.3.7...v3.4.0
[3.3.7]: https://github.com/tailwindlabs/tailwindcss/compare/v3.3.6...v3.3.7
[3.3.6]: https://github.com/tailwindlabs/tailwindcss/compare/v3.3.5...v3.3.6
[3.3.5]: https://github.com/tailwindlabs/tailwindcss/compare/v3.3.4...v3.3.5
[3.3.4]: https://github.com/tailwindlabs/tailwindcss/compare/v3.3.3...v3.3.4
[3.3.3]: https://github.com/tailwindlabs/tailwindcss/compare/v3.3.2...v3.3.3
[3.3.2]: https://github.com/tailwindlabs/tailwindcss/compare/v3.3.1...v3.3.2
[3.3.1]: https://github.com/tailwindlabs/tailwindcss/compare/v3.3.0...v3.3.1
[3.3.0]: https://github.com/tailwindlabs/tailwindcss/compare/v3.2.7...v3.3.0
[3.2.7]: https://github.com/tailwindlabs/tailwindcss/compare/v3.2.6...v3.2.7
[3.2.6]: https://github.com/tailwindlabs/tailwindcss/compare/v3.2.5...v3.2.6
[3.2.5]: https://github.com/tailwindlabs/tailwindcss/compare/v3.2.4...v3.2.5
[3.2.4]: https://github.com/tailwindlabs/tailwindcss/compare/v3.2.3...v3.2.4
[3.2.3]: https://github.com/tailwindlabs/tailwindcss/compare/v3.2.2...v3.2.3
[3.2.2]: https://github.com/tailwindlabs/tailwindcss/compare/v3.2.1...v3.2.2
[3.2.1]: https://github.com/tailwindlabs/tailwindcss/compare/v3.2.0...v3.2.1
[3.2.0]: https://github.com/tailwindlabs/tailwindcss/compare/v3.1.8...v3.2.0
[3.1.8]: https://github.com/tailwindlabs/tailwindcss/compare/v3.1.7...v3.1.8
[3.1.7]: https://github.com/tailwindlabs/tailwindcss/compare/v3.1.6...v3.1.7
[3.1.6]: https://github.com/tailwindlabs/tailwindcss/compare/v3.1.5...v3.1.6
[3.1.5]: https://github.com/tailwindlabs/tailwindcss/compare/v3.1.4...v3.1.5
[3.1.4]: https://github.com/tailwindlabs/tailwindcss/compare/v3.1.3...v3.1.4
[3.1.3]: https://github.com/tailwindlabs/tailwindcss/compare/v3.1.2...v3.1.3
[3.1.2]: https://github.com/tailwindlabs/tailwindcss/compare/v3.1.1...v3.1.2
[3.1.1]: https://github.com/tailwindlabs/tailwindcss/compare/v3.1.0...v3.1.1
[3.1.0]: https://github.com/tailwindlabs/tailwindcss/compare/v3.0.24...v3.1.0
[3.0.24]: https://github.com/tailwindlabs/tailwindcss/compare/v3.0.23...v3.0.24
[3.0.23]: https://github.com/tailwindlabs/tailwindcss/compare/v3.0.22...v3.0.23
[3.0.22]: https://github.com/tailwindlabs/tailwindcss/compare/v3.0.21...v3.0.22
[3.0.21]: https://github.com/tailwindlabs/tailwindcss/compare/v3.0.20...v3.0.21
[3.0.20]: https://github.com/tailwindlabs/tailwindcss/compare/v3.0.19...v3.0.20
[3.0.19]: https://github.com/tailwindlabs/tailwindcss/compare/v3.0.18...v3.0.19
[3.0.18]: https://github.com/tailwindlabs/tailwindcss/compare/v3.0.17...v3.0.18
[3.0.17]: https://github.com/tailwindlabs/tailwindcss/compare/v3.0.16...v3.0.17
[3.0.16]: https://github.com/tailwindlabs/tailwindcss/compare/v3.0.15...v3.0.16
[3.0.15]: https://github.com/tailwindlabs/tailwindcss/compare/v3.0.14...v3.0.15
[3.0.14]: https://github.com/tailwindlabs/tailwindcss/compare/v3.0.13...v3.0.14
[3.0.13]: https://github.com/tailwindlabs/tailwindcss/compare/v3.0.12...v3.0.13
[3.0.12]: https://github.com/tailwindlabs/tailwindcss/compare/v3.0.11...v3.0.12
[3.0.11]: https://github.com/tailwindlabs/tailwindcss/compare/v3.0.10...v3.0.11
[3.0.10]: https://github.com/tailwindlabs/tailwindcss/compare/v3.0.9...v3.0.10
[3.0.9]: https://github.com/tailwindlabs/tailwindcss/compare/v3.0.8...v3.0.9
[3.0.8]: https://github.com/tailwindlabs/tailwindcss/compare/v3.0.7...v3.0.8
[3.0.7]: https://github.com/tailwindlabs/tailwindcss/compare/v3.0.6...v3.0.7
[3.0.6]: https://github.com/tailwindlabs/tailwindcss/compare/v3.0.5...v3.0.6
[3.0.5]: https://github.com/tailwindlabs/tailwindcss/compare/v3.0.4...v3.0.5
[3.0.4]: https://github.com/tailwindlabs/tailwindcss/compare/v3.0.3...v3.0.4
[3.0.3]: https://github.com/tailwindlabs/tailwindcss/compare/v3.0.2...v3.0.3
[3.0.2]: https://github.com/tailwindlabs/tailwindcss/compare/v3.0.1...v3.0.2
[3.0.1]: https://github.com/tailwindlabs/tailwindcss/compare/v3.0.0...v3.0.1
[3.0.0]: https://github.com/tailwindlabs/tailwindcss/compare/v3.0.0-alpha.2...v3.0.0
[3.0.0-alpha.2]: https://github.com/tailwindlabs/tailwindcss/compare/v3.0.0-alpha.1...v3.0.0-alpha.2
[3.0.0-alpha.1]: https://github.com/tailwindlabs/tailwindcss/compare/v2.2.19...v3.0.0-alpha.1
[2.2.19]: https://github.com/tailwindlabs/tailwindcss/compare/v2.2.18...v2.2.19
[2.2.18]: https://github.com/tailwindlabs/tailwindcss/compare/v2.2.17...v2.2.18
[2.2.17]: https://github.com/tailwindlabs/tailwindcss/compare/v2.2.16...v2.2.17
[2.2.16]: https://github.com/tailwindlabs/tailwindcss/compare/v2.2.15...v2.2.16
[2.2.15]: https://github.com/tailwindlabs/tailwindcss/compare/v2.2.14...v2.2.15
[2.2.14]: https://github.com/tailwindlabs/tailwindcss/compare/v2.2.13...v2.2.14
[2.2.13]: https://github.com/tailwindlabs/tailwindcss/compare/v2.2.12...v2.2.13
[2.2.12]: https://github.com/tailwindlabs/tailwindcss/compare/v2.2.11...v2.2.12
[2.2.11]: https://github.com/tailwindlabs/tailwindcss/compare/v2.2.10...v2.2.11
[2.2.10]: https://github.com/tailwindlabs/tailwindcss/compare/v2.2.9...v2.2.10
[2.2.9]: https://github.com/tailwindlabs/tailwindcss/compare/v2.2.8...v2.2.9
[2.2.8]: https://github.com/tailwindlabs/tailwindcss/compare/v2.2.7...v2.2.8
[2.2.7]: https://github.com/tailwindlabs/tailwindcss/compare/v2.2.6...v2.2.7
[2.2.6]: https://github.com/tailwindlabs/tailwindcss/compare/v2.2.5...v2.2.6
[2.2.5]: https://github.com/tailwindlabs/tailwindcss/compare/v2.2.4...v2.2.5
[2.2.4]: https://github.com/tailwindlabs/tailwindcss/compare/v2.2.3...v2.2.4
[2.2.3]: https://github.com/tailwindlabs/tailwindcss/compare/v2.2.2...v2.2.3
[2.2.2]: https://github.com/tailwindlabs/tailwindcss/compare/v2.2.1...v2.2.2
[2.2.1]: https://github.com/tailwindlabs/tailwindcss/compare/v2.2.0...v2.2.1
[2.2.0]: https://github.com/tailwindlabs/tailwindcss/compare/v2.1.4...v2.2.0
[2.1.4]: https://github.com/tailwindlabs/tailwindcss/compare/v2.1.3...v2.1.4
[2.1.3]: https://github.com/tailwindlabs/tailwindcss/compare/v2.1.2...v2.1.3
[2.1.2]: https://github.com/tailwindlabs/tailwindcss/compare/v2.1.1...v2.1.2
[2.1.1]: https://github.com/tailwindlabs/tailwindcss/compare/v2.1.0...v2.1.1
[2.1.0]: https://github.com/tailwindlabs/tailwindcss/compare/v2.0.4...v2.1.0
[2.0.4]: https://github.com/tailwindlabs/tailwindcss/compare/v2.0.3...v2.0.4
[2.0.3]: https://github.com/tailwindlabs/tailwindcss/compare/v2.0.2...v2.0.3
[2.0.2]: https://github.com/tailwindlabs/tailwindcss/compare/v2.0.1...v2.0.2
[2.0.1]: https://github.com/tailwindlabs/tailwindcss/compare/v2.0.0...v2.0.1
[2.0.0]: https://github.com/tailwindlabs/tailwindcss/compare/v1.9.6...v2.0.0
[2.0.0-alpha.25]: https://github.com/tailwindlabs/tailwindcss/compare/v2.0.0-alpha.24...v2.0.0-alpha.25
[2.0.0-alpha.24]: https://github.com/tailwindlabs/tailwindcss/compare/v2.0.0-alpha.23...v2.0.0-alpha.24
[2.0.0-alpha.23]: https://github.com/tailwindlabs/tailwindcss/compare/v2.0.0-alpha.22...v2.0.0-alpha.23
[2.0.0-alpha.22]: https://github.com/tailwindlabs/tailwindcss/compare/v2.0.0-alpha.21...v2.0.0-alpha.22
[2.0.0-alpha.21]: https://github.com/tailwindlabs/tailwindcss/compare/v2.0.0-alpha.20...v2.0.0-alpha.21
[2.0.0-alpha.20]: https://github.com/tailwindlabs/tailwindcss/compare/v2.0.0-alpha.19...v2.0.0-alpha.20
[2.0.0-alpha.19]: https://github.com/tailwindlabs/tailwindcss/compare/v2.0.0-alpha.18...v2.0.0-alpha.19
[2.0.0-alpha.18]: https://github.com/tailwindlabs/tailwindcss/compare/v2.0.0-alpha.17...v2.0.0-alpha.18
[2.0.0-alpha.17]: https://github.com/tailwindlabs/tailwindcss/compare/v2.0.0-alpha.16...v2.0.0-alpha.17
[2.0.0-alpha.16]: https://github.com/tailwindlabs/tailwindcss/compare/v2.0.0-alpha.15...v2.0.0-alpha.16
[2.0.0-alpha.15]: https://github.com/tailwindlabs/tailwindcss/compare/v2.0.0-alpha.14...v2.0.0-alpha.15
[2.0.0-alpha.14]: https://github.com/tailwindlabs/tailwindcss/compare/v2.0.0-alpha.13...v2.0.0-alpha.14
[2.0.0-alpha.13]: https://github.com/tailwindlabs/tailwindcss/compare/v2.0.0-alpha.12...v2.0.0-alpha.13
[2.0.0-alpha.12]: https://github.com/tailwindlabs/tailwindcss/compare/v2.0.0-alpha.11...v2.0.0-alpha.12
[2.0.0-alpha.11]: https://github.com/tailwindlabs/tailwindcss/compare/v2.0.0-alpha.10...v2.0.0-alpha.11
[2.0.0-alpha.10]: https://github.com/tailwindlabs/tailwindcss/compare/v2.0.0-alpha.9...v2.0.0-alpha.10
[2.0.0-alpha.9]: https://github.com/tailwindlabs/tailwindcss/compare/v2.0.0-alpha.8...v2.0.0-alpha.9
[2.0.0-alpha.8]: https://github.com/tailwindlabs/tailwindcss/compare/v2.0.0-alpha.7...v2.0.0-alpha.8
[2.0.0-alpha.7]: https://github.com/tailwindlabs/tailwindcss/compare/v2.0.0-alpha.6...v2.0.0-alpha.7
[2.0.0-alpha.6]: https://github.com/tailwindlabs/tailwindcss/compare/v2.0.0-alpha.5...v2.0.0-alpha.6
[2.0.0-alpha.5]: https://github.com/tailwindlabs/tailwindcss/compare/v2.0.0-alpha.4...v2.0.0-alpha.5
[2.0.0-alpha.4]: https://github.com/tailwindlabs/tailwindcss/compare/v2.0.0-alpha.3...v2.0.0-alpha.4
[2.0.0-alpha.3]: https://github.com/tailwindlabs/tailwindcss/compare/v2.0.0-alpha.2...v2.0.0-alpha.3
[2.0.0-alpha.2]: https://github.com/tailwindlabs/tailwindcss/compare/v2.0.0-alpha.1...v2.0.0-alpha.2
[1.9.6]: https://github.com/tailwindlabs/tailwindcss/compare/v1.9.5...v1.9.6
[2.0.0-alpha.1]: https://github.com/tailwindlabs/tailwindcss/compare/v1.9.5...v2.0.0-alpha.1
[1.9.5]: https://github.com/tailwindlabs/tailwindcss/compare/v1.9.4...v1.9.5
[1.9.4]: https://github.com/tailwindlabs/tailwindcss/compare/v1.9.3...v1.9.4
[1.9.3]: https://github.com/tailwindlabs/tailwindcss/compare/v1.9.2...v1.9.3
[1.9.2]: https://github.com/tailwindlabs/tailwindcss/compare/v1.9.1...v1.9.2
[1.9.1]: https://github.com/tailwindlabs/tailwindcss/compare/v1.9.0...v1.9.1
[1.9.0]: https://github.com/tailwindlabs/tailwindcss/compare/v1.8.13...v1.9.0
[1.8.13]: https://github.com/tailwindlabs/tailwindcss/compare/v1.8.12...v1.8.13
[1.8.12]: https://github.com/tailwindlabs/tailwindcss/compare/v1.8.11...v1.8.12
[1.8.11]: https://github.com/tailwindlabs/tailwindcss/compare/v1.8.10...v1.8.11
[1.8.10]: https://github.com/tailwindlabs/tailwindcss/compare/v1.8.9...v1.8.10
[1.8.9]: https://github.com/tailwindlabs/tailwindcss/compare/v1.8.8...v1.8.9
[1.8.8]: https://github.com/tailwindlabs/tailwindcss/compare/v1.8.7...v1.8.8
[1.8.7]: https://github.com/tailwindlabs/tailwindcss/compare/v1.8.6...v1.8.7
[1.8.6]: https://github.com/tailwindlabs/tailwindcss/compare/v1.8.5...v1.8.6
[1.8.5]: https://github.com/tailwindlabs/tailwindcss/compare/v1.8.4...v1.8.5
[1.8.4]: https://github.com/tailwindlabs/tailwindcss/compare/v1.8.3...v1.8.4
[1.8.3]: https://github.com/tailwindlabs/tailwindcss/compare/v1.8.2...v1.8.3
[1.8.2]: https://github.com/tailwindlabs/tailwindcss/compare/v1.8.1...v1.8.2
[1.8.1]: https://github.com/tailwindlabs/tailwindcss/compare/v1.8.0...v1.8.1
[1.8.0]: https://github.com/tailwindlabs/tailwindcss/compare/v1.7.6...v1.8.0
[1.7.6]: https://github.com/tailwindlabs/tailwindcss/compare/v1.7.5...v1.7.6
[1.7.5]: https://github.com/tailwindlabs/tailwindcss/compare/v1.7.4...v1.7.5
[1.7.4]: https://github.com/tailwindlabs/tailwindcss/compare/v1.7.3...v1.7.4
[1.7.3]: https://github.com/tailwindlabs/tailwindcss/compare/v1.7.2...v1.7.3
[1.7.2]: https://github.com/tailwindlabs/tailwindcss/compare/v1.7.1...v1.7.2
[1.7.1]: https://github.com/tailwindlabs/tailwindcss/compare/v1.7.0...v1.7.1
[1.7.0]: https://github.com/tailwindlabs/tailwindcss/compare/v1.6.3...v1.7.0
[1.6.3]: https://github.com/tailwindlabs/tailwindcss/compare/v1.6.2...v1.6.3
[1.6.2]: https://github.com/tailwindlabs/tailwindcss/compare/v1.6.1...v1.6.2
[1.6.1]: https://github.com/tailwindlabs/tailwindcss/compare/v1.6.0...v1.6.1
[1.6.0]: https://github.com/tailwindlabs/tailwindcss/compare/v1.5.2...v1.6.0
[1.5.2]: https://github.com/tailwindlabs/tailwindcss/compare/v1.5.1...v1.5.2
[1.5.1]: https://github.com/tailwindlabs/tailwindcss/compare/v1.5.0...v1.5.1
[1.5.0]: https://github.com/tailwindlabs/tailwindcss/compare/v1.4.6...v1.5.0
[1.4.6]: https://github.com/tailwindlabs/tailwindcss/compare/v1.4.5...v1.4.6
[1.4.5]: https://github.com/tailwindlabs/tailwindcss/compare/v1.4.4...v1.4.5
[1.4.4]: https://github.com/tailwindlabs/tailwindcss/compare/v1.4.3...v1.4.4
[1.4.3]: https://github.com/tailwindlabs/tailwindcss/compare/v1.4.2...v1.4.3
[1.4.2]: https://github.com/tailwindlabs/tailwindcss/compare/v1.4.1...v1.4.2
[1.4.1]: https://github.com/tailwindlabs/tailwindcss/compare/v1.4.0...v1.4.1
[1.4.0]: https://github.com/tailwindlabs/tailwindcss/compare/v1.3.5...v1.4.0
[1.3.5]: https://github.com/tailwindlabs/tailwindcss/compare/v1.3.4...v1.3.5
[1.3.4]: https://github.com/tailwindlabs/tailwindcss/compare/v1.3.3...v1.3.4
[1.3.3]: https://github.com/tailwindlabs/tailwindcss/compare/v1.3.1...v1.3.3
[1.3.1]: https://github.com/tailwindlabs/tailwindcss/compare/v1.3.0...v1.3.1
[1.3.0]: https://github.com/tailwindlabs/tailwindcss/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/tailwindlabs/tailwindcss/compare/v1.1.4...v1.2.0
[1.2.0-canary.8]: https://github.com/tailwindlabs/tailwindcss/compare/v1.2.0-canary.7...v1.2.0-canary.8
[1.2.0-canary.7]: https://github.com/tailwindlabs/tailwindcss/compare/v1.2.0-canary.6...v1.2.0-canary.7
[1.2.0-canary.6]: https://github.com/tailwindlabs/tailwindcss/compare/v1.2.0-canary.5...v1.2.0-canary.6
[1.2.0-canary.5]: https://github.com/tailwindlabs/tailwindcss/compare/v1.2.0-canary.4...v1.2.0-canary.5
[1.2.0-canary.4]: https://github.com/tailwindlabs/tailwindcss/compare/v1.2.0-canary.3...v1.2.0-canary.4
[1.1.4]: https://github.com/tailwindlabs/tailwindcss/compare/v1.1.3...v1.1.4
[1.2.0-canary.1]: https://github.com/tailwindlabs/tailwindcss/compare/v1.2.0-canary.0...v1.2.0-canary.1
[1.1.3]: https://github.com/tailwindlabs/tailwindcss/compare/v1.1.2...v1.1.3
[1.2.0-canary.0]: https://github.com/tailwindlabs/tailwindcss/compare/v1.1.2...v1.2.0-canary.0
[1.1.2]: https://github.com/tailwindlabs/tailwindcss/compare/v1.1.1...v1.1.2
[1.1.1]: https://github.com/tailwindlabs/tailwindcss/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/tailwindlabs/tailwindcss/compare/v1.0.6...v1.1.0
[1.0.6]: https://github.com/tailwindlabs/tailwindcss/compare/v1.0.5...v1.0.6
[1.0.5]: https://github.com/tailwindlabs/tailwindcss/compare/v1.0.4...v1.0.5
[1.0.4]: https://github.com/tailwindlabs/tailwindcss/compare/v1.0.3...v1.0.4
[1.0.3]: https://github.com/tailwindlabs/tailwindcss/compare/v1.0.2...v1.0.3
[1.0.2]: https://github.com/tailwindlabs/tailwindcss/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/tailwindlabs/tailwindcss/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/tailwindlabs/tailwindcss/compare/v1.0.0-beta.10...v1.0.0
[1.0.0-beta.10]: https://github.com/tailwindlabs/tailwindcss/compare/v1.0.0-beta.9...v1.0.0-beta.10
[1.0.0-beta.9]: https://github.com/tailwindlabs/tailwindcss/compare/v1.0.0-beta.8...v1.0.0-beta.9
[1.0.0-beta.8]: https://github.com/tailwindlabs/tailwindcss/compare/v1.0.0-beta.7...v1.0.0-beta.8
[1.0.0-beta.7]: https://github.com/tailwindlabs/tailwindcss/compare/v1.0.0-beta.6...v1.0.0-beta.7
[1.0.0-beta.6]: https://github.com/tailwindlabs/tailwindcss/compare/v1.0.0-beta.5...v1.0.0-beta.6
[1.0.0-beta.5]: https://github.com/tailwindlabs/tailwindcss/compare/v1.0.0-beta.4...v1.0.0-beta.5
[1.0.0-beta.4]: https://github.com/tailwindlabs/tailwindcss/compare/v1.0.0-beta.3...v1.0.0-beta.4
[1.0.0-beta.3]: https://github.com/tailwindlabs/tailwindcss/compare/v1.0.0-beta.2...v1.0.0-beta.3
[1.0.0-beta.2]: https://github.com/tailwindlabs/tailwindcss/compare/v1.0.0-beta.1...v1.0.0-beta.2
[1.0.0-beta.1]: https://github.com/tailwindlabs/tailwindcss/compare/v0.7.4...v1.0.0-beta.1
[0.7.4]: https://github.com/tailwindlabs/tailwindcss/compare/v0.7.3...v0.7.4
[0.7.3]: https://github.com/tailwindlabs/tailwindcss/compare/v0.7.2...v0.7.3
[0.7.2]: https://github.com/tailwindlabs/tailwindcss/compare/v0.7.1...v0.7.2
[0.7.1]: https://github.com/tailwindlabs/tailwindcss/compare/v0.7.0...v0.7.1
[0.7.0]: https://github.com/tailwindlabs/tailwindcss/compare/v0.6.6...v0.7.0
[0.6.6]: https://github.com/tailwindlabs/tailwindcss/compare/v0.6.5...v0.6.6
[0.6.5]: https://github.com/tailwindlabs/tailwindcss/compare/v0.6.4...v0.6.5
[0.6.4]: https://github.com/tailwindlabs/tailwindcss/compare/v0.6.3...v0.6.4
[0.6.3]: https://github.com/tailwindlabs/tailwindcss/compare/v0.6.2...v0.6.3
[0.6.2]: https://github.com/tailwindlabs/tailwindcss/compare/v0.6.1...v0.6.2
[0.6.1]: https://github.com/tailwindlabs/tailwindcss/compare/v0.6.0...v0.6.1
[0.6.0]: https://github.com/tailwindlabs/tailwindcss/compare/v0.5.3...v0.6.0
[0.5.3]: https://github.com/tailwindlabs/tailwindcss/compare/v0.5.2...v0.5.3
[0.5.2]: https://github.com/tailwindlabs/tailwindcss/compare/v0.5.1...v0.5.2
[0.5.1]: https://github.com/tailwindlabs/tailwindcss/compare/v0.5.0...v0.5.1
[0.5.0]: https://github.com/tailwindlabs/tailwindcss/compare/v0.4.3...v0.5.0
[0.4.3]: https://github.com/tailwindlabs/tailwindcss/compare/v0.4.2...v0.4.3
[0.4.2]: https://github.com/tailwindlabs/tailwindcss/compare/v0.4.1...v0.4.2
[0.4.1]: https://github.com/tailwindlabs/tailwindcss/compare/v0.4.0...v0.4.1
[0.4.0]: https://github.com/tailwindlabs/tailwindcss/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/tailwindlabs/tailwindcss/compare/v0.2.2...v0.3.0
[0.2.2]: https://github.com/tailwindlabs/tailwindcss/compare/v0.2.1...v0.2.2
[0.2.1]: https://github.com/tailwindlabs/tailwindcss/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/tailwindlabs/tailwindcss/compare/v0.1.6...v0.2.0
[0.1.6]: https://github.com/tailwindlabs/tailwindcss/compare/v0.1.5...v0.1.6
[0.1.5]: https://github.com/tailwindlabs/tailwindcss/compare/v0.1.4...v0.1.5
[0.1.4]: https://github.com/tailwindlabs/tailwindcss/compare/v0.1.3...v0.1.4
[0.1.3]: https://github.com/tailwindlabs/tailwindcss/compare/v0.1.2...v0.1.3
[0.1.2]: https://github.com/tailwindlabs/tailwindcss/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/tailwindlabs/tailwindcss/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/tailwindlabs/tailwindcss/releases/tag/v0.1.0
