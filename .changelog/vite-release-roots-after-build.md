### Fixed

- Ensure `@tailwindcss/vite` releases the compilers and scanners of a build when it finishes, instead of keeping them in memory while the process keeps running (e.g. while Astro renders pages)
- Ensure `@tailwindcss/vite` doesn't generate CSS for removed classes when the same Vite builder builds an environment again
