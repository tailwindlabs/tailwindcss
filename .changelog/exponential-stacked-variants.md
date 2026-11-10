### Fixed

- Discard candidates whose selectors grow exponentially when variants are stacked, instead of running out of memory (e.g. `[&_&]:[&_&]:[&_&]:…:flex`)
