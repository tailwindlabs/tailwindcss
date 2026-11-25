### Fixed

- Fix crash in canonicalization when an arbitrary value contains an empty `var()` (e.g. `p-[var(--spacing-2,var())]`)
- Canonicalize arbitrary values that use theme variables with escaped characters (e.g. `p-[var(--spacing-1\.5)]` → `p-1.5`)
