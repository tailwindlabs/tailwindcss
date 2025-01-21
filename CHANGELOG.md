# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

- Nothing yet

## [4.0.0] - 2025-01-21
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
- Remove fixed line-height theme values and derive `leading-*` utilites from `--spacing-*` scale ([#14857](https://github.com/tailwindlabs/tailwindcss/pull/14857))
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
