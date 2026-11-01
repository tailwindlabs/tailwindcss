# Changelog fragments

Each pull request that needs a changelog entry adds a file to this folder. After the merge, a workflow moves the entries of the file into `[Unreleased]` in `CHANGELOG.md`, and deletes the file. Thus pull requests do not conflict with each other in `CHANGELOG.md`.

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

# Move the entries into `[Unreleased]` in `CHANGELOG.md`, and delete the fragments
pnpm changelog compile

# Check the fragments
pnpm changelog check

# Move the entries into a new `## [<version>] - <date>` section, and delete the fragments
pnpm changelog release <version> [<date>]
```

The entries of the fragments go after the entries that are already in `[Unreleased]`, in the order in which their pull requests merged.

After each merge into `main` that adds a fragment, `.github/workflows/changelog.yml` runs `compile` and pushes the result to `main`. It uses the `CHANGELOG_TOKEN` secret, a personal access token of an admin, because only admins can push to `main` without a pull request.
