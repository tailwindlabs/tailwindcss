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

# `@tailwindcss/vite`

## Documentation

For full documentation, visit [tailwindcss.com](https://tailwindcss.com).

---

## Advanced topics

### API reference

The Vite plugin can be configured by passing an object to the `tailwindcss()`. Here is a full list of available options:

| Property                                      | Values                                    |
| --------------------------------------------- | ----------------------------------------- |
| [`scanner`](#disabling-module-graph-scanning) | `module-graph` _(default)_, `file-system` |

### Disabling module-graph scanning

Our Vite plugin is designed to take the Vite module graph into account when scanning for utilities used in your project. This will work well in most cases since the module graph contains all markup that will be in your final build.

However, sometimes your Vite setup is split across different build steps (e.g. when using SSR builds). If that is the case, you might find that the client build might contain more utilities since it traverses all components while the server build doesn't.

To ensure that both builds read all components from your project, set the `scanner` option to `file-system`:

```js
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss({ scanner: 'file-system' })],
})
```

---

## Community

For help, discussion about best practices, or any other conversation that would benefit from being searchable:

[Discuss Tailwind CSS on GitHub](https://github.com/tailwindcss/tailwindcss/discussions)

For chatting with others using the framework:

[Join the Tailwind CSS Discord Server](https://discord.gg/7NF8GNe)

## Contributing

If you're interested in contributing to Tailwind CSS, please read our [contributing docs](https://github.com/tailwindcss/tailwindcss/blob/next/.github/CONTRIBUTING.md) **before submitting a pull request**.
