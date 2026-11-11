### Fixed

- Ignore arbitrary values, properties, modifiers and variants with a `/*` outside of a string or an unquoted `url(…)` (e.g. `bg-[red/*]`) instead of commenting out the CSS that comes after them
