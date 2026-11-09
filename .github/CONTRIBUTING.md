# Contributing

## Requirements

Before getting started, ensure your system has access to the following tools:

- [Node.js](https://nodejs.org/)
- [Rustup](https://rustup.rs/)
- [pnpm](https://pnpm.io/)

## Getting started

```sh
# Install dependencies
pnpm install

# Install Rust toolchain and WASM targets
rustup default stable
rustup target add wasm32-wasip1 wasm32-wasip1-threads

# Build the project
pnpm build
```

## Development workflow

During development, you can run tests in watch mode:

```sh
pnpm tdd
```

The `playgrounds` directory contains example projects you can use to test your changes. To start the Vite playground, use:

```sh
pnpm build && pnpm vite
```

## Bug fixes

If you've found a bug in Tailwind that you'd like to fix, [submit a pull request](https://github.com/tailwindlabs/tailwindcss/pulls) with your changes. Include a helpful description of the problem and how your changes address it, and provide tests so we can verify the fix works as expected.

## New features

If there's a new feature you'd like to see added to Tailwind, [share your idea with us](https://github.com/tailwindlabs/tailwindcss/discussions/new?category=ideas) in our discussion forum to get it on our radar as something to consider for a future release before starting work on it.

**Please note that we don't often accept pull requests for new features.** Adding a new feature to Tailwind requires us to think through the entire problem ourselves to make sure we agree with the proposed API, which means the feature needs to be high on our own priority list for us to be able to give it the attention it needs.

If you open a pull request for a new feature, we're likely to close it not because it's a bad idea, but because we aren't ready to prioritize the feature and don't want the PR to sit open for months or even years.

## Coding standards

Our code formatting rules are defined in the `"prettier"` section of [package.json](https://github.com/tailwindlabs/tailwindcss/blob/main/package.json). You can check your code against these standards by running:

```sh
pnpm run lint
```

To automatically fix any style violations in your code, you can run:

```sh
pnpm run format
```

## Running tests

You can run the TypeScript and Rust test suites using the following command:

```sh
pnpm test
```

To run the integration tests, use:

```sh
pnpm build && pnpm test:integrations
```

Additionally, some features require testing in browsers (i.e. to ensure CSS variable resolution works as expected). These can be run via:

```sh
pnpm build && pnpm test:ui
```

Please ensure that all tests are passing when submitting a pull request. If you're adding new features to Tailwind CSS, always include tests.

After a successful build, you can also use the npm package tarballs created inside the `dist/` folder to install your build in other local projects.

## Changelog

If your change fixes a bug, adds a feature, or changes something that users can see, add a changelog entry. Do not edit `CHANGELOG.md`. Add a new file in `.changelog/` instead, for example `.changelog/vite-full-reload.md`:

```md
### Fixed

- Prevent `@tailwindcss/vite` from doing a full page reload for external files (e.g. `.php` files)
```

Use the sections `### Added`, `### Fixed`, `### Changed`, `### Deprecated`, `### Removed` and `### Security`. Do not add a link to your pull request: a workflow adds it when it moves your entry into `CHANGELOG.md` after the merge. See [.changelog/README.md](https://github.com/tailwindlabs/tailwindcss/blob/main/.changelog/README.md) for all details, and run `pnpm changelog check` to check your file.

Write the entry in the same style as the existing entries in [CHANGELOG.md](https://github.com/tailwindlabs/tailwindcss/blob/main/CHANGELOG.md). In short:

- Write one line that describes the change for a user, not how you fixed it.
- Show what changes with an example when it helps, for example ``(e.g. `var(--tw-blur,)` → `var(--tw-blur, )`)``.
- Start an entry about canonicalization with `Canonicalization:`.
- Only add an entry when users can see the change. A bug fix needs an entry. A refactor, a test, a CI change or a bump of an internal dependency does not. A bump that fixes a real problem does.

## Pull request process

When submitting a pull request:

- Ensure the pull request title and description explain the changes you made and why you made them.
- Include a test plan section that outlines how you tested your contributions. We do not accept contributions without tests.
- Ensure all tests pass. You can add the tag `[ci-all]` in your pull request description to run the test suites across all platforms.

When a pull request is created, Tailwind CSS maintainers will be notified automatically.

## Communication

- **GitHub discussions**: For feature ideas and general questions
- **GitHub issues**: For bug reports
- **GitHub pull requests**: For code contributions
