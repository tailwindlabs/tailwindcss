### Fixed

- Canonicalization: don't replace arbitrary variants inside compound variants with variants they can't compound with (e.g. `not-[&>*]:flex` no longer becomes `not-*:flex`)
