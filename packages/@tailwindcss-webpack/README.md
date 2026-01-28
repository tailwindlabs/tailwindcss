# @tailwindcss/webpack

A webpack loader for Tailwind CSS v4.

## Installation

```sh
npm install @tailwindcss/webpack
```

## Usage

```javascript
// webpack.config.js
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  plugins: [new MiniCssExtractPlugin()],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          '@tailwindcss/webpack',
        ],
      },
    ],
  },
}
```

Then create a CSS file that imports Tailwind:

```css
/* src/index.css */
@import 'tailwindcss/theme';
@import 'tailwindcss/utilities';
```

## Options

### `base`

The base directory to scan for class candidates. Defaults to the current working directory.

```javascript
{
  loader: '@tailwindcss/webpack',
  options: {
    base: process.cwd(),
  },
}
```

### `optimize`

Whether to optimize and minify the output CSS. Defaults to `true` in production mode.

```javascript
{
  loader: '@tailwindcss/webpack',
  options: {
    optimize: true, // or { minify: true }
  },
}
```
