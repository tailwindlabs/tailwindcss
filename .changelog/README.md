# Changelog fragments

Each pull request that needs a changelog entry adds a file to this folder. At each release, `scripts/changelog.mjs` moves the entries of these files into `CHANGELOG.md`. Thus pull requests do not conflict with each other in `CHANGELOG.md`.

## Add an entry

Add a Markdown file with a unique name, for example `.changelog/vite-full-reload.md`:

```md
### Fixed

- Prevent `@tailwindcss/vite` from doing a full page reload for external files (e.g. `.php` files)
```

- Use one or more of these sections: `### Added`, `### Fixed`, `### Changed`, `### Deprecated`, `### Removed` and `### Security`.
- Start each entry with `- `, and write it on one line.
- Do not add a link to the pull request. The script adds the link of the pull request that added the file.
- To link to an issue, or to more than one pull request, add the links at the end of the entry, for example `([#12345](https://github.com/tailwindlabs/tailwindcss/issues/12345))`. The script then adds no link.

## Commands

```sh
# Print `CHANGELOG.md`, with the entries of the fragments in `[Unreleased]`
pnpm --silent changelog

# Check the fragments
pnpm changelog check

# Move the entries into a new `## [<version>] - <date>` section, and delete the fragments
pnpm changelog release <version> [<date>]
```

The entries that are already in `[Unreleased]` in `CHANGELOG.md` come first. The entries of the fragments follow, in the order in which their pull requests merged.

After each merge into `main`, a workflow writes the preview to the [`changelog` branch](https://github.com/tailwindlabs/tailwindcss/blob/changelog/CHANGELOG.md#unreleased).
