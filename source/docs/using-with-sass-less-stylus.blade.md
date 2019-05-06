---
extends: _layouts.documentation
title: "Using with Sass/Less/Stylus"
description: "A guide to using Tailwind with common CSS preprocessors."
titleBorder: true
---

Since Tailwind is a PostCSS plugin, there's nothing stopping you from using it with Sass, Less, Stylus, or other preprocessors, just like you can with other PostCSS plugins like [Autoprefixer](https://github.com/postcss/autoprefixer).

## Using PostCSS as your preprocessor

If you're using Tailwind for a brand new project and don't need to integrate it with any existing Sass/Less/Stylus stylesheets, you should highly consider relying on other PostCSS plugins to add the preprocessor features you use instead of using a separate preprocessor.

This has a few benefits:

- **Your builds will be faster**. Since your CSS doesn't have to be parsed and processed by multiple tools, your CSS will compile much quicker using only PostCSS.
- **No quirks or workarounds.** Because Tailwind adds some new non-standard keywords to CSS (like `@@tailwind`, `@@apply`, `theme()`, etc.), you often have to write your CSS in annoying, unintuitive ways to get a preprocessor to give you the expected output. Working exclusively with PostCSS avoids this.

All of the useful preprocessor features you're used to are available as PostCSS plugins. Here are a few we use on our own projects and can recommend.

### Build-time imports

One of the most useful features preprocessors offer is the ability to organize your CSS into multiple files and combine them at build time by processing `@import` statements in advance, instead of in the browser.

The canonical plugin for handling this with PostCSS is [postcss-import](https://github.com/postcss/postcss-import).

To use it, install the plugin:

```bash
# npm
npm install postcss-import

# yarn
yarn add postcss-import
```

Then add it as the very first plugin in your PostCSS configuration:

```js
// postcss.config.js
module.exports {
  plugins: {
    require('postcss-import'),
    require('tailwindcss'),
    require('autoprefixer'),
  }
}
```

One important thing to note about `postcss-import` is that it strictly adheres to the CSS spec and disallows `@import` statements anywhere except at the very top of a file.

<p class="flex items-center mt-8 mb-0">
  <svg class="h-6 w-6 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon-close-circle"><circle cx="12" cy="12" r="10" fill="#fed7d7"/><path fill="#f56565" d="M13.41 12l2.83 2.83a1 1 0 0 1-1.41 1.41L12 13.41l-2.83 2.83a1 1 0 1 1-1.41-1.41L10.59 12 7.76 9.17a1 1 0 0 1 1.41-1.41L12 10.59l2.83-2.83a1 1 0 0 1 1.41 1.41L13.41 12z"/></svg>
  <strong class="text-s  font-semibold text-gray-700">Won't work, `@@import` statements must come first</strong>
</p>

```css
/* components.css */

.btn {
  @@apply px-4 py-2 rounded font-semibold bg-gray-200 text-black;
}

/* Will not work */
@@import "./components/card";
```

The easiest solution to this problem is to never mix regular CSS and imports in the same file. Instead, create one main entry-point file for your imports, and keep all of your actual CSS in separate files.

<p class="flex items-center mt-8 mb-0">
  <svg class="h-6 w-6 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon-check"><circle class="text-green-200 fill-current" cx="12" cy="12" r="10" /><path class="text-green-600 fill-current" d="M10 14.59l6.3-6.3a1 1 0 0 1 1.4 1.42l-7 7a1 1 0 0 1-1.4 0l-3-3a1 1 0 0 1 1.4-1.42l2.3 2.3z"/></svg>
  <strong class="text-s  font-semibold text-gray-700">Use separate files for imports and actual CSS</strong>
</p>

```css
/* components.css */
@@import "./components/buttons.css";
@@import "./components/card.css";
```

```css
/* components/buttons.css */
.btn {
  @@apply px-4 py-2 rounded font-semibold bg-gray-200 text-black;
}
```

```css
/* components/card.css */
.card {
  @@apply p-4 bg-white shadow rounded;
}
```

The place you are most likely to run into this situation is in your main CSS file that includes your `@@tailwind` declarations.

<p class="flex items-center mt-8 mb-0">
  <svg class="h-6 w-6 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon-close-circle"><circle cx="12" cy="12" r="10" fill="#fed7d7"/><path fill="#f56565" d="M13.41 12l2.83 2.83a1 1 0 0 1-1.41 1.41L12 13.41l-2.83 2.83a1 1 0 1 1-1.41-1.41L10.59 12 7.76 9.17a1 1 0 0 1 1.41-1.41L12 10.59l2.83-2.83a1 1 0 0 1 1.41 1.41L13.41 12z"/></svg>
  <strong class="text-s  font-semibold text-gray-700">Won't work, `@@import` statements must come first</strong>
</p>

```css
@@tailwind base;
@@import "./custom-base-styles.css";

@@tailwind components;
@@import "./custom-components.css";

@@tailwind utilities;
@@import "./custom-utilities.css";
```

You can solve this by putting your `@@tailwind` declarations each in their own file. To make this easy, we provide separate files for each `@@tailwind` declaration with the framework itself that you can import directly from `node_modules`.

<p class="flex items-center mt-8 mb-0">
  <svg class="h-6 w-6 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon-check"><circle class="text-green-200 fill-current" cx="12" cy="12" r="10" /><path class="text-green-600 fill-current" d="M10 14.59l6.3-6.3a1 1 0 0 1 1.4 1.42l-7 7a1 1 0 0 1-1.4 0l-3-3a1 1 0 0 1 1.4-1.42l2.3 2.3z"/></svg>
  <strong class="text-s  font-semibold text-gray-700">Import our provided CSS files</strong>
</p>

```css
@@import "tailwindcss/base";
@@import "./custom-base-styles.css";

@@import "tailwindcss/components";
@@import "./custom-components.css";

@@import "tailwindcss/utilities";
@@import "./custom-utilities.css";
```

`postcss-import` is smart enough to look for files in the `node_modules` folder automatically, so you don't need to provide the entire path — `"tailwindcss/base"` for example is enough.

### Nesting



## Using with Sass

## Using with Less

## Using with Stylus

Coming soon.

In a nutshell:

- You don't really need Sass/Less/Stylus if you're already making use of PostCSS plugins like Tailwind — in fact for the best possible Tailwind experience ditch your preprocessor and check out [postcss-import](https://github.com/postcss/postcss-import) for file organization, and [postcss-preset-env](https://preset-env.cssdb.org/) for fancy stuff like [variables](https://preset-env.cssdb.org/features#custom-properties) and [nesting](https://preset-env.cssdb.org/features#nesting-rules).
- If you're using Sass, the gotcha you're most likely to run into is that you can't do `@apply some-utility !important`. You need to do `@apply some-utility #{!important}` instead.
- If you're using Less, the gotcha you're most likely to run into is that you can't nest `@screen` directives. Use `@media (min-width: theme('screens.md'))` or similar instead.
- If you're using Stylus, you can't `@apply` without wrapping your entire CSS rule in `@css` which means you can't use Stylus features in that block. You also can't nest `@screen` just like with Less.
- In short, if you can you should really just use PostCSS.
