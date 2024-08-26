# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed

- Bring back type exports for the cjs build of `@tailwindcss/postcss`. ([#14256](https://github.com/tailwindlabs/tailwindcss/pull/14256))
- Correctly merge tuple values when using the plugin API ([#14260](https://github.com/tailwindlabs/tailwindcss/pull/14260))

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
