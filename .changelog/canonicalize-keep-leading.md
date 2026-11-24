### Fixed

- Canonicalization: don't collapse `leading-*` into the `text-*/*` modifier, because it drops the `--tw-leading` variable that `text-*` utilities in variants on the same element rely on (e.g. `text-sm leading-7 md:text-base`)
