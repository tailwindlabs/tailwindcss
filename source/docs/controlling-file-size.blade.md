---
extends: _layouts.documentation
title: "Controlling File Size"
description: "Strategies for keeping your generated CSS small and performant."
titleBorder: true
---

Using the default configuration, Tailwind CSS comes in at 58.1kb minified and gzipped.

Here are a few other popular frameworks for comparison:

| Framework | Original Size | Minified | Gzip | Brotli |
| --------- | ------------- | -------- | ---- | ------ |
| Tailwind  | 472.5kb | 347.7kb | 58.1kb | 17.3kb |
| Bootstrap  | 187.8kb | 152.1kb |  22.7K  | 16.7K  |
| Bulma  | 205.6kb   | 172.4kb   | 23.0kb  | 18.0kb  |
| Foundation  | 154.1kb   | 119.2kb   | 15.9kb  | 12.9kb  | 
| Tachyons  | 111.7kb   | 71.8kb    | 13.4kb  | 7.5kb   | 
| Semantic UI  | 809.4kb   | 613.8kb   | 100.6kb | 77.8kb  | 
| Materialize  | 175.0kb   | 138.5kb   | 21.1kb  | 17.1kb  |

By comparison Tailwind definitely seems on the heavy side *(although if you use [Brotli](https://github.com/google/brotli) instead of gzip it's still very reasonable)*, but there are a number of strategies you can use to reduce this file size dramatically.

## Removing unused CSS

Mozilla's [Firefox Send](https://send.firefox.com/) is built with Tailwind, yet somehow their CSS is only 13.1kb minified, and only 4.7kb gzipped! How?

They're using [Purgecss](https://www.purgecss.com/), a tool for removing CSS that you're not actually using in your project. Purgecss is particularly effective with Tailwind because Tailwind generates thousands of utility classes for you, most of which you probably won't actually use.

For example, Tailwind generates margin utilities for every size in your spacing scale, for every side of an element you might want to apply margin to, at every breakpoint you are using in your project. This leads to hundreds of different combinations that are all important to have available, but not all likely to be needed.

When using Purgecss with Tailwind, it's very hard to end up with more than 10kb of compressed CSS.

### Setting up Purgecss

In the future we may incorporate Purgecss directly into Tailwind, but for now the best way to use it in your project is as a PostCSS plugin.

To get started with Purgecss, first install `@fullhuman/postcss-purgecss`:

```bash
# Using npm
npm install @fullhuman/postcss-purgecss

# Using yarn
yarn add @fullhuman/postcss-purgecss
```

Next, add it as the last plugin in your `postcss.config.js` file:

```js
// postcss.config.js
const purgecss = require('@fullhuman/postcss-purgecss')({

  // Specify the paths to all of the template files in your project 
  content: [
    './src/**/*.html',
    './src/**/*.vue',
    './src/**/*.jsx',
  ],
  extractors: [
    {
      extractor: class {
        static extract(content) {
          return content.match(/[A-Za-z0-9-_:/]+/g) || [];
        }
      },

      // Specify all of the extensions of your template files 
      extensions: ['html', 'vue', 'jsx']
    }
  ]
})

module.exports = {
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
    process.env.NODE_ENV === 'production'
      ? ...[purgecss]
      : ...[]
  ]
}
```

Note that in this example, **we're only enabling Purgecss in production**. We recommend configuring Purgecss this way because it can be slow to run, and during development it's nice to have every class available so you don't need to wait for a rebuild every time you change some HTML.

### Writing purgeable HTML

Purgecss uses "extractors" to determine what strings in your templates are classes. In the example above, we use a custom extractor that will find all of the classes Tailwind generates by default:

```js
class {
  static extract(content) {
    return content.match(/[A-Za-z0-9-_:/]+/g) || [];
  }
}
```

The way it works is intentionally very "dumb". It doesn't try to parse your HTML and look for class attributes or dynamically execute your JavaScript — it simply looks for any strings in the entire file that match this regular expression:

```js
/[A-Za-z0-9-_:/]+/g
```

That means that **it is important to avoid dynamically creating class strings in your templates with string concatenation**, otherwise Purgecss won't know to preserve those classes.

<p class="flex items-center mt-8 mb-0">
  <svg class="h-6 w-6 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon-close-circle"><circle cx="12" cy="12" r="10" fill="#fed7d7"/><path fill="#f56565" d="M13.41 12l2.83 2.83a1 1 0 0 1-1.41 1.41L12 13.41l-2.83 2.83a1 1 0 1 1-1.41-1.41L10.59 12 7.76 9.17a1 1 0 0 1 1.41-1.41L12 10.59l2.83-2.83a1 1 0 0 1 1.41 1.41L13.41 12z"/></svg>
  <strong class="text-s  font-semibold text-gray-600">Don't use string concatenation to create class names</strong>
</p>

<pre class="language-html mt-2" v-pre><code>&lt;div :class="text-@{{ error ? 'red' : 'green' }}-600"&gt;&lt;/div&gt;</code></pre>

<p class="flex items-center mt-8 mb-0">
  <svg class="h-6 w-6 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon-check"><circle class="text-green-200 fill-current" cx="12" cy="12" r="10" /><path class="text-green-600 fill-current" d="M10 14.59l6.3-6.3a1 1 0 0 1 1.4 1.42l-7 7a1 1 0 0 1-1.4 0l-3-3a1 1 0 0 1 1.4-1.42l2.3 2.3z"/></svg>
  <strong class="text-s  font-semibold text-gray-600">Do dynamically select a complete class name</strong>
</p>

<pre class="language-html mt-2" v-pre><code>&lt;div :class="@{{ error ? 'text-red-600' : 'text-green-600' }}"&gt;&lt;/div&gt;</code></pre>

As long as a class name appears in your template _in its entirety_, Purgecss will not remove it.

### Customizing the regular expression

In the example above, we use a regular expression that matches all of the non-standard characters Tailwind uses by default, like `:` and `/`.

If you are using any other special characters in your class names, make sure to update the regular expression to include those as well.

For example, if you have customized Tailwind to create classes like `w-50%`, you'll want to add `%` to the regular expression:

```js
/[A-Za-z0-9-_:/%]+/g
```

<hr class="my-16">

## Removing unused theme values

If you can't use Purgecss for one reason or another, you can also reduce Tailwind's footprint by removing unused values from [your configuration file](/docs/configuration).

The default theme provides a very generous set of colors, breakpoints, sizes, margins, etc. to make sure that when you pull Tailwind down to prototype something, create a CodePen demo, or just try out the workflow, the experience is as enjoyable and fluid as possible.

We don't want you to have to go and write new CSS because we didn't provide enough padding helpers out of the box, or because you wanted to use an orange color scheme for your demo and we only gave you blue.

This comes with a trade-off though: the default build is significantly heavier than it would be on a project with a purpose-built configuration file.

Here are a few strategies you can use to keep your generated CSS small and performant.

### Limiting your color palette

The default theme includes a whopping [93 colors](/docs/colors) used for backgrounds, borders, and text, all of which also have `hover:` and `focus` variants, as well as responsive variants at the five default screen sizes.

This means that by default, there are 4185 classes generated from this color palette out of 8271 classes total in the entire default build.

Very few projects actually need this many colors, and removing colors you don't need can have a huge impact on the overall file size.

Here's how using a smaller color palette affects the final size:

| Colors | Original | Minified | Gzip   | Brotli |
| --- | --- | --- | --- | --- |
| 93 *(default)* | 472.5kb   | 347.7kb   | 58.1kb  | 17.3kb  |
| 50 | 356.3kb   | 257.5kb   | 45.1kb  | 13.7kb  |
| 25 | 288.0kb   | 204.5kb   | 37.4kb  | 11.9kb  |

### Removing unused breakpoints

Since almost every Tailwind utility is copied for every screen size, using fewer screen sizes can have a huge impact on the overall file size as well.

Here's how defining fewer screens affects the output:

| Breakpoints | Original | Minified | Gzip   | Brotli |
| --- | --- | --- | --- | --- |
| 4 *(default)* | 472.5kb   | 347.7kb   | 58.1kb  | 17.3kb  |
| 3 | 376.9kb   | 277.5kb   | 46.9kb  | 16.1kb  |
| 2 | 281.2kb   | 207.4kb   | 35.5kb  | 14.9kb  |
| 1 | 185.6kb   | 137.2kb   | 24.3kb  | 13.4kb  |

If you only need 3 screen sizes and 35 colors, you're down to 32.5kb after gzip _(11.7kb after Brotli!)_ without changing anything else.

### Disabling unused utilities and variants

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

If you need a utility but don't need the responsive versions, set its variants to an empty array to generate 80% fewer classes:
	
```js
module.exports = {
  // ...
  variants: {
    appearance: []
  }
}
```

These are mostly small wins compared to limiting your color palette or using fewer breakpoints, but they can still add up.

