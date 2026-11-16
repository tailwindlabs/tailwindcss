### Fixed

- Canonicalization: don't replace `@scope` variants with unrelated `@scope` variants (e.g. `[@scope_(.card)]:flex` no longer becomes `in-blue:flex`)
- Canonicalization: don't treat `.foo .bar` and `.foo.bar` as the same in at-rule variants (e.g. `@scope (…)` or `@supports selector(…)`)
