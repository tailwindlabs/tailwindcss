### Fixed

- Don't treat CSS custom functions whose name ends in a math function name as math functions (e.g. `text-[--my-calc(1px)]` is now a `color` instead of a `font-size`, and `w-[--my-calc(1px-2px)]` doesn't get spaces around the `-`)
