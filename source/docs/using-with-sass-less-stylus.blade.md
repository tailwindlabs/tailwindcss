---
extends: _layouts.documentation
title: "Using with Sass/Less/Stylus"
description: "A guide to using Tailwind with common CSS preprocessors."
titleBorder: true
---

Coming soon.

In a nutshell:

- You don't really need Sass/Less/Stylus if you're already making use of PostCSS plugins like Tailwind — in fact for the best possible Tailwind experience ditch your preprocessor and check out [postcss-import](https://github.com/postcss/postcss-import) for file organization, and [postcss-preset-env](https://preset-env.cssdb.org/) for fancy stuff like [variables](https://preset-env.cssdb.org/features#custom-properties) and [nesting](https://preset-env.cssdb.org/features#nesting-rules).
- If you're using Sass, the gotcha you're most likely to run into is that you can't do `@apply some-utility !important`. You need to do `@apply some-utility #{!important}` instead.
- If you're using Less, the gotcha you're most likely to run into is that you can't nest `@screen` directives. Use `@media (min-width: theme('screens.md'))` or similar instead.
- If you're using Stylus, you can't `@apply` without wrapping your entire CSS rule in `@css` which means you can't use Stylus features in that block. You also can't nest `@screen` just like with Less.
- In short, if you can you should really just use PostCSS.
