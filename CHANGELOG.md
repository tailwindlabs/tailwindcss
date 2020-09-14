# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

- Nothing yet!

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
- Make it possible to whitelist which core plugins should be enabled

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

[unreleased]: https://github.com/tailwindlabs/tailwindcss/compare/v1.8.10...HEAD
[1.8.9]: https://github.com/tailwindlabs/tailwindcss/compare/v1.8.9...v1.8.10
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
