---
extends: _layouts.documentation
title: "Installation"
description: "Quick start guide for installing and configuring Tailwind CSS."
---

## CDN

Before getting started please note, **many of the features that make Tailwind CSS great are not available using the CDN builds.** To take full advantage of Tailwind's features, [install Tailwind via npm](#npm).

To pull in Tailwind for quick demos or just giving the framework a spin, grab the latest default configuration build via CDN:

```html
<link href="https://cdn.jsdelivr.net/npm/tailwindcss/dist/tailwind.min.css" rel="stylesheet">
```

Or if you'd like to pull in the base styles separate from the utility classes:

```html
<link href="https://cdn.jsdelivr.net/npm/tailwindcss/dist/preflight.min.css" rel="stylesheet">

<!-- Any of your own CSS would go here -->

<link href="https://cdn.jsdelivr.net/npm/tailwindcss/dist/utilities.min.css" rel="stylesheet">
```

## NPM

For most projects (and to take advantage of Tailwind's customization features), you'll want to install Tailwind via npm.

### 1. Install Tailwind via npm

Tailwind is [available on npm](https://www.npmjs.com/package/tailwindcss) and can be installed using npm or Yarn.

<div class="rounded bg-grey-lightest border-2 border-grey-light font-mono text-sm p-4">
  <div class="text-grey-dark"># Using npm</div>
  <div class="text-purple-dark">npm install <span class="text-blue-dark">tailwindcss</span> <span class="text-grey-darker">--save-dev</span></div>
  <div class="text-grey-dark mt-6"># Using Yarn</div>
  <div class="text-purple-dark">yarn add <span class="text-blue-dark">tailwindcss</span> <span class="text-grey-darker">--dev</span></div>
</div>

### 2. Create a Tailwind config file

Tailwind is configured almost entirely in plain JavaScript. To do this you'll need to generate a Tailwind config file for your project. We recommend creating a `tailwind.js` file in your project's root.

We've provided a CLI utility to do this easily:

<div class="rounded bg-grey-lightest border-2 border-grey-light font-mono text-sm p-4">
  <div class="text-purple-dark">./node_modules/.bin/tailwind <span class="text-blue-dark">init</span> <span class="text-grey-dark">[filename]</span></div>
</div>

### 3. Use Tailwind in your CSS

Use the `@@tailwind` directive to inject Tailwind's `preflight` and `utilities` styles into your CSS.

To avoid specificity issues, we highly recommend structuring your main stylesheet like this:

```less
/**
 * This injects Tailwind's base styles, which is a combination of
 * Normalize.css and some additional base styles.
 *
 * You can see the styles here:
 * https://github.com/tailwindcss/tailwindcss/blob/master/css/preflight.css
 *
 * If using `postcss-import`, you should import this line from it's own file:
 *
 * @@import "./tailwind-preflight.css";
 *
 * See: https://github.com/tailwindcss/tailwindcss/issues/53#issuecomment-341413622
 */
@@tailwind preflight;

/**
 * Here you would add any of your custom component classes; stuff that you'd
 * want loaded *before* the utilities so that the utilities could still
 * override them.
 *
 * Example:
 *
 * .btn { ... }
 * .form-input { ... }
 *
 * Or if using a preprocessor or `postcss-import`:
 *
 * @@import "components/buttons";
 * @@import "components/forms";
 */

/**
 * This injects all of Tailwind's utility classes, generated based on your
 * config file.
 *
 * If using `postcss-import`, you should import this line from it's own file:
 *
 * @@import "./tailwind-utilities.css";
 *
 * See: https://github.com/tailwindcss/tailwindcss/issues/53#issuecomment-341413622
 */
@@tailwind utilities;

/**
 * Here you would add any custom utilities you need that don't come out of the
 * box with Tailwind.
 *
 * Example :
 *
 * .bg-pattern-graph-paper { ... }
 * .skew-45 { ... }
 *
 * Or if using a preprocessor or `postcss-import`:
 *
 * @@import "utilities/background-patterns";
 * @@import "utilities/skew-transforms";
 */
```

### 4. Process your CSS with Tailwind

#### Using Tailwind CLI

For simple projects or just giving Tailwind a spin, you can use the Tailwind CLI tool to process your CSS:

<div class="bg-grey-lightest font-mono text-sm p-4">
  <div class="text-purple-dark">./node_modules/.bin/tailwind build <span class="text-blue-dark">styles.css</span> <span class="text-grey-dark">[-c ./tailwind.js] [-o ./output.css]</span></div>
</div>

#### Using Tailwind with PostCSS

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

For a complete example, check out our [webpack-starter](https://github.com/tailwindcss/webpack-starter) template.

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

mix.less('resources/assets/less/app.less', 'public/css')
  .options({
    postCss: [
      tailwindcss('./path/to/your/tailwind-config.js'),
    ]
  });
```

**Note for Sass users:** Due to [an unresolved issue](https://github.com/bholloway/resolve-url-loader/issues/28) with one of Mix's dependencies, to use Sass with Tailwind you'll need to disable `processCssUrls`:

```js
var tailwindcss = require('tailwindcss');

mix.sass('resources/assets/sass/app.scss', 'public/css')
  .options({
    processCssUrls: false,
    postCss: [ tailwindcss('./path/to/your/tailwind-config.js') ],
  });
```

For more information on what this feature does and the implications of disabling it, [see the Laravel Mix documentation](https://github.com/JeffreyWay/laravel-mix/blob/master/docs/css-preprocessors.md#css-url-rewriting).
