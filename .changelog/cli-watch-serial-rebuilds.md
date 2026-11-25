### Fixed

- Prevent `@tailwindcss/cli` in `--watch` mode from overwriting newer CSS with the output of an older rebuild
- Ensure `@tailwindcss/cli` in `--watch` mode finishes the current rebuild before it exits when stdin closes
