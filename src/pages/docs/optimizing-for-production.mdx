---
title: Optimizing for Production
description: Removing unused CSS from your production builds for maximum performance.
---

import { Heading } from '@/components/Heading'
import { TipGood, TipBad } from '@/components/Tip'
import stats from '@/utils/stats'

## <Heading hidden>Overview</Heading>

<p>Using the default configuration, the development build of Tailwind CSS is {stats.default.original} uncompressed, {stats.default.gzipped} minified and compressed with <a href="https://www.gnu.org/software/gzip/">Gzip</a>, and {stats.default.brotlified} when compressed with <a href="https://github.com/google/brotli">Brotli</a>.</p>

<table>
  <thead>
    <tr>
      <th>Uncompressed</th>
      <th>Minified</th>
      <th>Gzip</th>
      <th>Brotli</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>{stats.default.original}</td>
      <td>{stats.default.minified}</td>
      <td>{stats.default.gzipped}</td>
      <td>{stats.default.brotlified}</td>
    </tr>
  </tbody>
</table>

This might sound enormous but **the development build is large by design**.

To make the development experience as productive as possible, Tailwind generates thousands of utility classes for you, most of which you probably won't actually use.

Think of Tailwind like a giant box of LEGO — you dump it all out on the floor and build what you want to build, then when you're done you put all the pieces you didn't use back into the box.

For example, Tailwind generates margin utilities for every size in your spacing scale, for every side of an element you might want to apply margin to, at every breakpoint you are using in your project. This leads to hundreds of different combinations that are all important to have available, but not all likely to be needed.

**When building for production, you should always use Tailwind's `purge` option to tree-shake unused styles and optimize your final build size.** When removing unused styles with Tailwind, it's very hard to end up with more than 10kb of compressed CSS.

## Writing purgeable HTML

Before getting started with the `purge` feature, it's important to understand how it works and build the correct mental model to make sure you never accidentally remove important styles when building for production.

[PurgeCSS](https://purgecss.com/) _(the library we use under the hood)_ is intentionally very naive in the way it looks for classes in your HTML. It doesn't try to parse your HTML and look for class attributes or dynamically execute your JavaScript — it simply looks for any strings in the entire file that match this regular expression:

```js
/[^<>"'`\s]*[^<>"'`\s:]/g
```

This basically matches any string separated by spaces, quotes or angle brackets, including HTML tags, attributes, classes, and even the actual written content in your markup.

```html
<template preview>
<div class="md:flex">
  <div class="md:flex-shrink-0">
    <img class="rounded-lg md:w-56" src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=448&q=80" width="448" height="299" alt="Woman paying for a purchase">
  </div>
  <div class="mt-4 md:mt-0 md:ml-6">
    <div class="uppercase tracking-wide text-sm text-indigo-600 font-bold">Marketing</div>
    <a href="#" class="block mt-1 text-lg leading-tight font-semibold text-gray-900 hover:underline">Finding customers for your new business</a>
    <p class="mt-2 text-gray-600">Getting a new business off the ground is a lot of hard work. Here are five ideas you can use to find your first customers.</p>
  </div>
</div>
</template>

<**div** **class**="**md:flex**">
  <**div** **class**="**md:flex-shrink-0**">
    <**img** **class**="**rounded-lg** **md:w-56**" **src**="**/img/shopping.jpg**" **alt**="**Woman** **paying** **for** **a** **purchase**">
  </**div**>
  <**div** **class**="**mt-4** **md:mt-0** **md:ml-6**">
    <**div** **class**="**uppercase** **tracking-wide** **text-sm** **text-indigo-600** **font-bold**">
      **Marketing**
    </**div**>
    <**a** **href**="**/get-started**" **class**="**block** **mt-1** **text-lg** **leading-tight** **font-semibold** **text-gray-900** **hover:underline**">
      **Finding** **customers** **for** **your** **new** **business**
    </**a**>
    <**p** **class**="**mt-2** **text-gray-600**">
      **Getting** **a** **new** **business** **off** **the** **ground** **is** **a** **lot** **of** **hard** **work.**
      **Here** **are** **five** **ideas** **you** **can** **use** **to** **find** **your** **first** **customers.**
    </**p**>
  </**div**>
</**div**>
```

That means that **it is important to avoid dynamically creating class strings in your templates with string concatenation**, otherwise PurgeCSS won't know to preserve those classes.

<TipBad>Don't use string concatenation to create class names</TipBad>

```html mt-4
<div class="**text-{{**  **error**  **?**  '**red**'  **:**  '**green**'  **}}-600**"></div>
```

<TipGood>Do dynamically select a complete class name</TipGood>

```html mt-4
<div class="**{{**  **error**  **?**  '**text-red-600**'  **:**  '**text-green-600**'  **}}**"></div>
```

As long as a class name appears in your template _in its entirety_, PurgeCSS will not remove it.

## Removing unused CSS

### Basic usage

To get started, provide an array of paths to all of your template files using the `purge` option:

```js
// tailwind.config.js
module.exports = {
  purge: [
    './src/**/*.html',
    './src/**/*.vue',
    './src/**/*.jsx',
  ],
  theme: {},
  variants: {},
  plugins: [],
}
```

**This list should include *any* files in your project that reference any of your styles by name.** For example, if you have a JS file in your project that dynamically toggles some classes in your HTML, you should make sure to include that file in this list.

Now whenever you compile your CSS with `NODE_ENV` set to `production`, Tailwind will automatically purge unused styles from your CSS.

### Enabling manually

If you want to manually control whether unused styles should be removed (instead of depending implicitly on the environment variable), you can use an object syntax and provide the `enabled` option, specifying your templates using the `content` option:

```js
// tailwind.config.js
module.exports = {
  purge: {
    enabled: true,
    content: ['./src/**/*.html'],
  },
  // ...
}
```

We recommend only removing unused styles in production, as removing them in development means you need to recompile any time you change your templates and compiling with PurgeCSS enabled is much slower.

### Preserving HTML elements

By default, Tailwind will preserve all basic HTML element styles in your CSS, like styles for the `html`, `body`, `p`, `h1`, etc. tags. This is to minimize accidentally over-purging in cases where you are using markdown source files for example (where there is no actual `h1` tag present), or using a framework that hides the document shell (containing the `html` and `body` tags) somewhere in a vendor directory (like Next.js does).

If you want to disable this behavior, you can set `preserveHtmlElements` to false:


```js
// tailwind.config.js
module.exports = {
  purge: {
    preserveHtmlElements: false,
    content: ['./src/**/*.html'],
  },
  // ...
}
```

We generally do not recommend this and believe that the risks outweigh the benefits, but we're not the cops, do whatever you want.

### Purging specific layers

By default, Tailwind will purge all styles in the `base`, `components`, and `utilities` layers. If you'd like to change this, use the `layers` option to manually specify the layers you'd like to purge:

```js
// tailwind.config.js
module.exports = {
  purge: {
    layers: ['components', 'utilities'],
    content: ['./src/**/*.html'],
  },
  // ...
}
```

### Removing all unused styles

By default, Tailwind will only remove unused classes that it generates itself, or has been explicitly wrapped in a `@layer` directive. It will _not_ remove unused styles from third-party CSS you pull in to your project, like a datepicker library you pull in for example.

```css
/* These styles will all be purged */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* These styles will be purged */
@layer components {
  .btn { /* ... */ }
}

/* These styles will not be purged */
.flatpickr-innerContainer { /* ... */ }
.flatpickr-weekdayContainer { /* ... */ }
.flatpickr-weekday { /* ... */ }
```

This is to avoid accidentally removing styles that you might need but are not directly referenced in your templates, like classes that are only referenced deep in your `node_modules` folder that are part of some other dependency.

If you really want to remove _all_ unused styles, set `mode: 'all'` and `preserveHtmlElements: false` and **be very careful** to provide the paths to _all_ files that might reference any classes or HTML elements:

```js
// tailwind.config.js
module.exports = {
  purge: {
    mode: 'all',
    preserveHtmlElements: false,
    content: [
      './src/**/*.js',
      './node_modules/flatpickr/**/*.js',
    ],
  },
  // ...
}
```

**We do not recommend this**, and generally find you get 99% of the file size benefits by sticking with the more conservative default approach.

### Removing unused keyframes

PurgeCSS does not remove unused `@keyframes` rules by default, so you may notice some animation related styles left over in your stylesheet even if you aren't using them. You can remove these using PurgeCSS's `keyframes` option under `options`:

```js
// tailwind.config.js
module.exports = {
  purge: {
    content: ['./src/**/*.html'],
    options: {
      keyframes: true,
    },
  },
  // ...
}
```

### PurgeCSS options

If you need to pass any other options directly to PurgeCSS, you can do so using `options`:

```js
// tailwind.config.js
module.exports = {
  purge: {
    content: ['./src/**/*.html'],

    // These options are passed through directly to PurgeCSS
    options: {
      safelist: ['bg-red-500', 'px-4'],
      blocklist: [/^debug-/],
      keyframes: true,
      fontFace: true,
    },
  },
  // ...
}
```

A list of available options can be found in the [PurgeCSS documentation](https://purgecss.com/configuration.html#options).

---

## Alternate approaches

If you can't use PurgeCSS for one reason or another, you can also reduce Tailwind's footprint by removing unused values from [your configuration file](/docs/configuration).

The default theme provides a very generous set of colors, breakpoints, sizes, margins, etc. to make sure that when you pull Tailwind down to prototype something, create a CodePen demo, or just try out the workflow, the experience is as enjoyable and fluid as possible.

We don't want you to have to go and write new CSS because we didn't provide enough padding helpers out of the box, or because you wanted to use an orange color scheme for your demo and we only gave you blue.

This comes with a trade-off though: the default build is significantly heavier than it would be on a project with a purpose-built configuration file.

Here are a few strategies you can use to keep your generated CSS small and performant.

### Limiting your color palette

The default theme includes a whopping [84 colors](/docs/customizing-colors) used for backgrounds, borders, text, and placeholders, all of which also have `hover:` and `focus:` variants, as well as responsive variants at the six default screen sizes.

By default, there are _thousands_ of classes generated to accommodate these colors, and it makes up close to half of the final build size.

Very few projects actually need this many colors, and removing colors you don't need can have a huge impact on the overall file size.

Here's how using a smaller color palette affects the final size:

<table>
  <thead>
    <tr>
      <th>Colors</th>
      <th>Original</th>
      <th>Minified</th>
      <th>Gzip</th>
      <th>Brotli</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>84 <em>(default)</em></td>
      <td>{stats.default.original}</td>
      <td>{stats.default.minified}</td>
      <td>{stats.default.gzipped}</td>
      <td>{stats.default.brotlified}</td>
    </tr>
    <tr>
      <td>50</td>
      <td>{stats['50-colors'].original}</td>
      <td>{stats['50-colors'].minified}</td>
      <td>{stats['50-colors'].gzipped}</td>
      <td>{stats['50-colors'].brotlified}</td>
    </tr>
    <tr>
      <td>25</td>
      <td>{stats['25-colors'].original}</td>
      <td>{stats['25-colors'].minified}</td>
      <td>{stats['25-colors'].gzipped}</td>
      <td>{stats['25-colors'].brotlified}</td>
    </tr>
  </tbody>
</table>

### Removing unused breakpoints

Since almost every Tailwind utility is copied for every screen size, using fewer screen sizes can have a huge impact on the overall file size as well.

Here's how defining fewer screens affects the output:

<table>
  <thead>
    <tr>
      <th>Breakpoints</th>
      <th>Original</th>
      <th>Minified</th>
      <th>Gzip</th>
      <th>Brotli</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>5 <em>(default)</em></td>
      <td>{stats.default.original}</td>
      <td>{stats.default.minified}</td>
      <td>{stats.default.gzipped}</td>
      <td>{stats.default.brotlified}</td>
    </tr>
    <tr>
      <td>3</td>
      <td>{stats['3-screens'].original}</td>
      <td>{stats['3-screens'].minified}</td>
      <td>{stats['3-screens'].gzipped}</td>
      <td>{stats['3-screens'].brotlified}</td>
    </tr>
    <tr>
      <td>2</td>
      <td>{stats['2-screens'].original}</td>
      <td>{stats['2-screens'].minified}</td>
      <td>{stats['2-screens'].gzipped}</td>
      <td>{stats['2-screens'].brotlified}</td>
    </tr>
    <tr>
      <td>1</td>
      <td>{stats['1-screen'].original}</td>
      <td>{stats['1-screen'].minified}</td>
      <td>{stats['1-screen'].gzipped}</td>
      <td>{stats['1-screen'].brotlified}</td>
    </tr>
  </tbody>
</table>

<p>If you only need 3 screen sizes and 35 colors, you're down to {stats['35-colors-3-screens'].brotlified} compressed without changing anything else.</p>

### Disabling unused core plugins and variants

If you don't expect to need a certain utility plugin in your project at all, you can disable it completely by setting it to `false` in the `corePlugins` section of your config file:

```js
// tailwind.config.js
module.exports = {
  // ...
  corePlugins: {
    float: false
  }
}
```

If you only need a handful of utilities, you can pass an array to `corePlugins` with the utility plugins you want to keep.

```js
// tailwind.config.js
module.exports = {
  // ...
  corePlugins: [
    margin,
    padding
  ]
}
```

The above would disable all utilities except margin and padding.

If you need a utility but don't need the responsive versions, set its variants to an empty array to generate 83% fewer classes:

```js
module.exports = {
  // ...
  variants: {
    appearance: []
  }
}
```

These are mostly small wins compared to limiting your color palette or using fewer breakpoints, but they can still add up.
