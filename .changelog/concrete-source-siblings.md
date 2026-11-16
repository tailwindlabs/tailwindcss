### Fixed

- Don't scan every sibling of a concrete `@source` file when it sits behind an ignored directory inside the project root (e.g. `@source "./node_modules/.generated/ui/button.ts"` no longer scans the whole `ui` folder)
