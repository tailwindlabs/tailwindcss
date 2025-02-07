# Contributing

## Bug fixes

If you've found a bug in Tailwind that you'd like to fix, [submit a pull request](https://github.com/tailwindlabs/tailwindcss/pulls) with your changes. Include a helpful description of the problem and how your changes address it, and provide tests so we can verify the fix works as expected.

## New features

If there's a new feature you'd like to see added to Tailwind, [share your idea with us](https://github.com/tailwindlabs/tailwindcss/discussions/new?category=ideas) in our discussion forum to get it on our radar as something to consider for a future release.

**Please note that we don't often accept pull requests for new features.** Adding a new feature to Tailwind requires us to think through the entire problem ourselves to make sure we agree with the proposed API, which means the feature needs to be high on our own priority list for us to be able to give it the attention it needs.

If you open a pull request for a new feature, we're likely to close it not because it's a bad idea, but because we aren't ready to prioritize the feature and don't want the PR to sit open for months or even years.

## Coding standards

Our code formatting rules are defined in the `"prettier"` section of [package.json](https://github.com/tailwindcss/tailwindcss/blob/main/package.json). You can check your code against these standards by running:

```sh
pnpm run lint
```

To automatically fix any style violations in your code, you can run:

```sh
pnpm run format
```

## Running tests

You can run the test suite using the following commands:

```sh
pnpm build && pnpm test
```

Please ensure that the tests are passing when submitting a pull request. If you're adding new features to Tailwind, please include tests.
