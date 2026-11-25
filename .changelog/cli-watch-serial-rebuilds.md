### Fixed

- Prevent `@tailwindcss/cli` in `--watch` mode from overwriting newer CSS with the output of an older rebuild
- Ensure `@tailwindcss/cli` in `--watch` mode finishes the current rebuild before it exits when stdin closes
- Ensure `@tailwindcss/cli` in `--watch` mode writes the initial build before it exits when stdin is already closed
