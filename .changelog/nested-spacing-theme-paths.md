### Fixed

- Canonicalization: ensure nested spacing paths in `theme(…)` keep all of their keys (e.g. `p-[theme(spacing.1.5)]` stays as is instead of becoming `p-1`)
- Upgrade: ensure nested spacing paths in `theme(…)` in CSS keep all of their keys (e.g. `theme(spacing.1.5)` stays as is instead of becoming `--spacing(1)`)
