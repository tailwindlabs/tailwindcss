### Fixed

- Canonicalization: make `collapse: true` combine a font size with `leading-none` into the `/none` modifier without depending on whether `text-{x}/none` was seen before (e.g. `text-xs leading-none` → `text-xs/none`)
