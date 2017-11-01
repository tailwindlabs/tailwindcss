---
extends: _layouts.documentation
title: "Installation"
---

# Installation

<div class="text-xl text-slate-light mb-4">
    Quick start guide for installing and configuring Tailwind.
</div>

## 1. Install Tailwind via npm

Tailwind is [available on npm](https://www.npmjs.com/package/tailwindcss) and can be installed using npm or Yarn.

<div class="bg-smoke-lighter font-mono text-sm p-4">
    <div class="text-smoke-darker"># Using npm</div>
    <div class="text-purple-dark">npm install <span class="text-blue-dark">tailwindcss</span> <span class="text-grey-darker">--save-dev</span></div>
    <div class="text-smoke-darker mt-6"># Using Yarn</div>
    <div class="text-purple-dark">yarn add <span class="text-blue-dark">tailwindcss</span> <span class="text-grey-darker">--dev</span></div>
</div>

## 2. Create a Tailwind config file

Tailwind is configured almost entirely in plain JavaScript. To do this you'll need to generate a Tailwind config file for your project. We recommend creating a `tailwind.js` file in your project's root. We've provided a CLI utility to do this easily:

<div class="bg-smoke-lighter font-mono text-sm p-4">
<div class="text-purple-dark">./node_modules/.bin/tailwind <span class="text-blue-dark">init</span> <span class="text-smoke-darker">[filename]</span></div>
</div>

Alternatively, you can simply copy the default config file [from here](https://github.com/tailwindcss/tailwindcss/blob/master/defaultConfig.js).

## 3. Use Tailwind in your CSS

Use the `@@tailwind` directive to inject Tailwind's `preflight` and `utilities` styles into your CSS.

To avoid specificity issues, we highly recommend structuring your main stylesheet like this:

```less
/**
 * This injects Tailwind's base styles, which is a combination of
 * Normalize.css and some additional base styles.
 *
 * You can see the styles here:
 * https://github.com/tailwindcss/tailwindcss/blob/master/css/preflight.css
 */
@@tailwind preflight;

/**
 * Here you would import any custom component classes; stuff that you'd
 * want loaded *before* the utilities so that the utilities can still
 * override them.
 * 
 * @@import "my-components/foo";
 * @@import "my-components/bar";
 */

/**
 * This injects all of Tailwind's utility classes, generated based on your
 * config file.
 */
@@tailwind utilities;

/**
 * Here you would add any custom utilities you need that don't come out of the
 * box with Tailwind.
 *
 * @@import "my-utilities/background-images";
 * @@import "my-utilities/skew-transforms";
 */
```

## 4. Process your CSS with Tailwind

### Using Tailwind CLI

For simple projects or just giving Tailwind a spin, you can use the Tailwind CLI tool to process your CSS:

<div class="bg-smoke-lighter font-mono text-sm p-4">
<div class="text-purple-dark">./node_modules/.bin/tailwind build <span class="text-blue-dark">styles.css</span> <span class="text-smoke-darker">[-c ./config.js] [-o ./output.css]</span></div>
</div>

### Using Tailwind with PostCSS

For most projects, you'll want to add Tailwind as a PostCSS plugin in your build chain.

We've included the Tailwind-specific instructions for a few popular tools below, but for instructions on getting started with PostCSS in general, see the [PostCSS documentation](https://github.com/postcss/postcss#usage).

#### Webpack

Add `tailwindcss` as a plugin in your  `postcss.config.js` file, passing the path to your config file:

```js
var tailwindcss = require('tailwindcss');
module.exports = {
  plugins: [
    // ...
    tailwindcss('./path/to/your/tailwind-config.js'),
    require('autoprefixer'),
    // ...
  ]
}
```

#### Gulp

Add `tailwindcss` to the list of plugins you pass to [gulp-postcss](https://github.com/postcss/gulp-postcss), passing the path to your config file:

```js
gulp.task('css', function () {
    var postcss = require('gulp-postcss');
    var tailwindcss = require('tailwindcss');

    return gulp.src('src/styles.css')
        // ...
        .pipe(postcss([
          // ...
          tailwindcss('./path/to/your/tailwind-config.js'),
          require('autoprefixer'),
          // ...
        ]))
        // ...
        .pipe(gulp.dest('build/'));
});
```

#### Laravel Mix

If you're writing your project in plain CSS, use Mix's `postCss` method to process your CSS. Include `tailwindcss` as a plugin and pass the path to your config file:

```js
var tailwindcss = require('tailwindcss');

mix.postCss('resources/assets/css/main.css', 'public/css', [
  tailwindcss('./path/to/your/tailwind-config.js'),
]);
```

If you're using a preprocessor, use the `options` method to add `tailwindcss` as a PostCSS plugin:

```js
var tailwindcss = require('tailwindcss');

mix.less('source/_assets/less/main.less', 'source/css')
  .options({
    postCss: [
      tailwindcss('./path/to/your/tailwind-config.js'),
    ]
  })
```
