### Fixed

- Prevent `@tailwindcss/vite` from rebuilding in a loop with `vite build --watch` when the build output directory is not ignored (e.g. a custom `build.outDir`)
