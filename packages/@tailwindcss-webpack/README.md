<p align="center">
  <a href="https://tailwindcss.com" target="_blank">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/tailwindlabs/tailwindcss/HEAD/.github/logo-dark.svg">
      <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/tailwindlabs/tailwindcss/HEAD/.github/logo-light.svg">
      <img alt="Tailwind CSS" src="https://raw.githubusercontent.com/tailwindlabs/tailwindcss/HEAD/.github/logo-light.svg" width="350" height="70" style="max-width: 100%;">
    </picture>
  </a>
</p>

<p align="center">
  A utility-first CSS framework for rapidly building custom user interfaces.
</p>

<p align="center">
    <a href="https://github.com/tailwindlabs/tailwindcss/actions"><img src="https://img.shields.io/github/actions/workflow/status/tailwindlabs/tailwindcss/ci.yml?branch=main" alt="Build Status"></a>
    <a href="https://www.npmjs.com/package/tailwindcss"><img src="https://img.shields.io/npm/dt/tailwindcss.svg" alt="Total Downloads"></a>
    <a href="https://github.com/tailwindlabs/tailwindcss/releases"><img src="https://img.shields.io/npm/v/tailwindcss.svg" alt="Latest Release"></a>
    <a href="https://github.com/tailwindlabs/tailwindcss/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/tailwindcss.svg" alt="License"></a>
</p>

---

## Documentation

For full documentation, visit [tailwindcss.com](https://tailwindcss.com).

## Community

For help, discussion about best practices, or feature ideas:

[Discuss Tailwind CSS on GitHub](https://github.com/tailwindlabs/tailwindcss/discussions)

## Contributing

If you're interested in contributing to Tailwind CSS, please read our [contributing docs](https://github.com/tailwindlabs/tailwindcss/blob/main/.github/CONTRIBUTING.md) **before submitting a pull request**.

---

## @tailwindcss/webpack

A webpack loader for Tailwind CSS v4.

## Installation

```sh
npm install @tailwindcss/webpack
```

### Usage

```javascript
// webpack.config.js
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  plugins: [new MiniCssExtractPlugin()],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', '@tailwindcss/webpack'],
      },
    ],
  },
}
```

Then create a CSS file that imports Tailwind:

```css
/* src/index.css */
@import 'tailwindcss';
```

### Options

#### `base`

The base directory to scan for class candidates. Defaults to the current working directory.

```javascript
{
  loader: '@tailwindcss/webpack',
  options: {
    base: process.cwd(),
  },
}
```

#### `optimize`

Whether to optimize and minify the output CSS. Defaults to `true` in production mode.

```javascript
{
  loader: '@tailwindcss/webpack',
  options: {
    optimize: true, // or { minify: true }
  },
}
```
