### Fixed

- Ignore candidates with more than 16 nested compound variants (e.g. `in-in-…-in-hover:flex`) or more than 64 stacked variants (e.g. `hover:hover:…:hover:flex`) instead of slowing down or crashing the build
- Improve performance of parsing long candidates with many dashes (e.g. `data-a-a-…-a:flex`)
