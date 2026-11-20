### Fixed

- Match at-rule names and `!important` case-insensitively (e.g. `@THEME`, `@UTILITY`, `@APPLY`, `@IMPORT "tailwindcss"` or `color: red !IMPORTANT`)
- Match function names case-insensitively in arbitrary values (e.g. `w-[THEME(spacing.1)]` or `bg-[URL(/a/*.png)]`)
- Replace `&` in pseudo-class functions with uppercase names when flattening nested CSS (e.g. `.a { :IS(&) .b {} }` → `:is(.a) .b`)
- Infer the type of arbitrary values with uppercase units (e.g. `border-[2PX]` sets `border-width` instead of `border-color`)
- Match CSS-wide keywords case-insensitively in `@theme` (e.g. `--color-*: INITIAL` removes the colors instead of throwing an error)
- Allow `not-*` with variants that use an at-rule with an uppercase name (e.g. `not-[@MEDIA_print]:flex`)
- Don't treat `@import`s and `url(…)`s with an uppercase URL scheme as local files (e.g. `@import "HTTPS://example.com/a.css"` or `url(HTTPS://example.com/a.png)`)
- Canonicalization: lowercase the case-insensitive parts of arbitrary values and variants, so more of them match named utilities and variants (e.g. `rotate-[45DEG]` → `rotate-45`, `text-[INHERIT]` → `text-inherit`, `[&:FOCUS]:flex` → `focus:flex` or `bg-[URL(HTTPS://a.com/b.png)]` → `bg-[url(https://a.com/b.png)]`)

### Changed

- Print at-rule names, CSS-wide keywords, `!important` and pseudo-classes in nested selectors in lowercase (e.g. `@MEDIA print` → `@media print`, `color: INHERIT` → `color: inherit` or `&:HOVER` → `:hover`)
