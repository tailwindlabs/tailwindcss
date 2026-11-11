### Changed

- Reduce the size of `@tailwindcss/browser` by leaving out code that is never used in the browser, and by minifying the stylesheets it embeds
- Improve `@tailwindcss/browser` performance by only looking for classes in the elements that changed instead of the whole document
- Only resolve legacy `theme()` paths that map to a theme variable in `@tailwindcss/browser` (e.g. `theme(colors.red.500)` but not `theme(spacing.4)`)

### Fixed

- Ensure `@tailwindcss/browser` keeps generating CSS after a build failed (e.g. because of an `@apply` with a class that does not exist)
