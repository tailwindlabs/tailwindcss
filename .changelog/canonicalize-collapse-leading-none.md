### Fixed

- Canonicalization: always collapse a font size with `leading-none` into the `/none` modifier, instead of only after `text-{x}/none` was seen before (e.g. `text-xs leading-none` → `text-xs/none`)
