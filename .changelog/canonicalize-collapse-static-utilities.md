### Fixed

- Canonicalization: collapse static utilities without depending on the candidates that were canonicalized before (e.g. `overflow-x-hidden overflow-y-hidden` → `overflow-hidden`)
- Canonicalization: canonicalize utilities and variants whose name starts with the prefix (e.g. `o:outline-[2px]` → `o:outline-2` and `f:[&:focus]:flex` → `f:focus:flex`)
