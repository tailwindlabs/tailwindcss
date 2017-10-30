---
extends: _layouts.markdown
title: "Installation"
---

# Installation

<div class="text-xl text-slate-light mb-4">
    Quick start guide for installing and configuring Tailwind.
</div>

## 1. Install the dependency

Tailwind is [available on npm](https://www.npmjs.com/package/tailwindcss) and can be installed using npm or Yarn.

<div class="bg-smoke-lighter font-mono text-sm p-4">
    <div class="text-smoke-darker"># Using npm</div>
    <div class="text-purple-dark">npm install <span class="text-blue-dark">tailwindcss</span></div>
    <div class="text-smoke-darker mt-6"># Using Yarn</div>
    <div class="text-purple-dark">yarn install <span class="text-blue-dark">tailwindcss</span></div>
</div>

## 2. Create a Tailwind config file

Tailwind is configured almost entirely in plain JavaScript. To do this you'll need to generate a Tailwind config file for your project. We recommend creating a `tailwind.js` file in your project's root. We've provided a CLI utility to do this easily:

<div class="bg-smoke-lighter font-mono text-sm p-4">
<div class="text-purple-dark">./node_modules/.bin/tailwind <span class="text-blue-dark">init</span> <span class="text-smoke-darker">[filename]</span></div>
</div>

Alternatively, you can simply copy the default config file [from here](https://github.com/nothingworksinc/tailwindcss/blob/master/defaultConfig.js).

## 3. Add Tailwind to your CSS

Next, you need to add Tailwind to your main stylesheet. This can be plain CSS, Less, Sass, Stylus, or something else. There order here is important, so please follow this structure:

```less
/**
 * This injects Tailwind's base styles, which is a combination of
 * Normalize.css and some additional base styles.
 *
 * You can see the styles here:
 * https://github.com/nothingworksinc/tailwindcss/blob/master/css/preflight.css
 */
@tailwind reset;

/**
 * Here you would import any custom component classes; stuff that you'd
 * want loaded *before* the utilities so that the utilities can still
 * override them.
 */
@import "my-components/foo";
@import "my-components/bar";

/**
 * This injects all of Tailwind's utility classes, generated based on your
 * config file.
 */
@tailwind utilities;

/**
 * Here you would add any custom utilities you need that don't come out of the box with Tailwind.
 */
.bg-hero-image {
    background-image: url('/some/image/file.png');
}
```

## 4. Add Tailwind to your build process

Finally, you'll need to add Tailwind to your build process. Fair warning: this can be the trickiest step. For simple projects you can use the Tailwind CLI tool to generate your CSS:

<div class="bg-smoke-lighter font-mono text-sm p-4">
<div class="text-purple-dark">./node_modules/.bin/tailwind <span class="text-blue-dark">styles.css</span> <span class="text-smoke-darker">[-c ./custom-config.js] [-o ./output.css]</span></div>
</div>

For most projects, you'll want to add Tailwind as a PostCSS plugin in your build chain, passing your config object as a parameter. Here's an example using [Laravel Mix](https://laravel.com/docs/5.5/mix):

```js
const mix = require('laravel-mix');
const tailwind = require('tailwindcss');

mix.less('resources/assets/less/app.less', 'public/css')
  .options({
    postCss: [
      tailwind(require('./path/to/your/tailwind/config.js'))
    ]
  });
```
