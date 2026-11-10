### Fixed

- Improve `@tailwindcss/vite` build performance by scanning the same sources only once per build, and by not looking for files to watch outside of watch mode
- Ensure `@tailwindcss/vite` generates the same CSS for the client and SSR environments when they share the plugin, even when the build output is not ignored (e.g. React Router with the Vite Environment API)
