### Fixed

- Canonicalization: improve performance when using a theme prefix (e.g. `@import 'tailwindcss' prefix(tw)`), by no longer switching to the slower compatibility lookup for theme values
