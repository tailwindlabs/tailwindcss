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
    <a href="https://github.com/tailwindlabs/tailwindcss/actions"><img src="https://img.shields.io/github/actions/workflow/status/tailwindlabs/tailwindcss/ci.yml?branch=next" alt="Build Status"></a>
    <a href="https://www.npmjs.com/package/tailwindcss"><img src="https://img.shields.io/npm/dt/tailwindcss.svg" alt="Total Downloads"></a>
    <a href="https://github.com/tailwindcss/tailwindcss/releases"><img src="https://img.shields.io/npm/v/tailwindcss.svg" alt="Latest Release"></a>
    <a href="https://github.com/tailwindcss/tailwindcss/blob/master/LICENSE"><img src="https://img.shields.io/npm/l/tailwindcss.svg" alt="License"></a>
</p>

---

## Documentation

For full documentation, visit [tailwindcss.com](https://tailwindcss.com).

## Community

For help, discussion about best practices, or feature ideas:

[Discuss Tailwind CSS on GitHub](https://github.com/tailwindcss/tailwindcss/discussions)

## Contributing

If you're interested in contributing to Tailwind CSS, please read our [contributing docs](https://github.com/tailwindcss/tailwindcss/blob/next/.github/CONTRIBUTING.md) **before submitting a pull request**.

---

## `@tailwindcss/postcss` plugin API

### Changing where the plugin searches for source files

You can use the `base` option (defaults to the current working directory) to change the directory in which the plugin searches for source files:

```js
import tailwindcss from "@tailwindcss/postcss"

export default {
 plugins: [
  tailwindcss({
    base: path.resolve(__dirname, "./path)
  })
 ]
}
```

### Enabling or disabling Lightning CSS

By default, this plugin detects whether or not the CSS is being built for production by checking the `NODE_ENV` environment variable. When building for production Lightning CSS will be enabled otherwise it is disabled.

If you want to always enable or disable Lightning CSS the `optimize` option may be used:

```js
import tailwindcss from '@tailwindcss/postcss'

export default {
  plugins: [
    tailwindcss({
      // Enable or disable Lightning CSS
      optimize: false,
    }),
  ],
}
```

It's also possible to keep Lightning CSS enabled but disable minification:

```js
import tailwindcss from '@tailwindcss/postcss'

export default {
  plugins: [
    tailwindcss({
      optimize: { minify: false },
    }),
  ],
}
```

### Enabling or disabling `url(…)` rewriting

Our PostCSS plugin can rewrite `url(…)`s for you since it also handles `@import` (no `postcss-import` is needed). This feature is enabled by default.

In some situations the bundler or framework you're using may provide this feature itself. In this case you can set `transformAssetUrls` to `false` to disable this feature:

```js
import tailwindcss from '@tailwindcss/postcss'

export default {
  plugins: [
    tailwindcss({
      // Disable `url(…)` rewriting
      transformAssetUrls: false,

      // Enable `url(…)` rewriting (the default)
      transformAssetUrls: true,
    }),
  ],
}
```

You may also pass options to `optimize` to enable Lighting CSS but prevent minification:

```js
import tailwindcss from '@tailwindcss/postcss'

export default {
  plugins: [
    tailwindcss({
      // Enables Lightning CSS but disables minification
      optimize: { minify: false },
    }),
  ],
}
```
