# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

Nothing yet!

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

- Ensure `corePlugins` order is consisent in AOT mode ([#5928](https://github.com/tailwindlabs/tailwindcss/pull/5928))

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
- Fix issue with `resolveConfig` not being importable in Next.js pags ([#4725](https://github.com/tailwindlabs/tailwindcss/pull/4725))

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

- Fix issue with `@apply` not working as expected with `!important` inside an atrule ([#2824](https://github.com/tailwindlabs/tailwindcss/pull/2824))
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

[unreleased]: https://github.com/tailwindlabs/tailwindcss/compare/v3.0.19...HEAD
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
