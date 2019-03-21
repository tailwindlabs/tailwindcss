---
extends: _layouts.documentation
title: "Installation"
description: "Quick start guide for installing and configuring Tailwind CSS."
---

## CDN

Before getting started please note, **many of the features that make Tailwind CSS great are not available using the CDN builds.** To take full advantage of Tailwind's features, [install Tailwind via npm](#npm).

To pull in Tailwind for quick demos or just giving the framework a spin, grab the latest default configuration build via CDN:

```html
<link href="https://unpkg.com/tailwindcss@next/dist/tailwind.min.css" rel="stylesheet">
```

Note that while the CDN build is large *(58kb compressed, 348kb raw)*, it's not representative of the sizes you see when including Tailwind as part of your build process. Sites that follow our [best practices](/docs/controlling-file-size) are almost always under 10kb compressed. For example, [Firefox Send](https://send.firefox.com/) is built with Tailwind and gets a perfect performance score in [Lighthouse](https://developers.google.com/web/tools/lighthouse/).

## NPM

For most projects (and to take advantage of Tailwind's customization features), you'll want to install Tailwind via npm.

### 1. Install Tailwind via npm

Tailwind is [available on npm](https://www.npmjs.com/package/tailwindcss) and can be installed using npm or Yarn.

<div class="rounded bg-gray-100 border border-gray-400 font-mono text-xs p-4">
  <div class="text-gray-600"># Using npm</div>
  <div class="text-purple-700">npm install <span class="text-blue-700">tailwindcss</span> <span class="text-gray-700">--save-dev</span></div>
  <div class="text-gray-600 mt-6"># Using Yarn</div>
  <div class="text-purple-700">yarn add <span class="text-blue-700">tailwindcss</span> <span class="text-gray-700">--dev</span></div>
</div>

### 2. Create a Tailwind config file

Tailwind is configured almost entirely in plain JavaScript. To do this you'll need to generate a Tailwind config file for your project. We recommend creating a `tailwind.config.js` file in your project's root.

We've provided a CLI utility to do this easily:

<div class="rounded bg-gray-100 border border-gray-400 font-mono text-xs p-4">
  <div class="text-gray-600"># Using npm</div>
  <div class="text-purple-700">npx tailwind <span class="text-blue-700">init</span> <span class="text-gray-600">[filename]</span></div>
  <div class="text-gray-600 mt-6"># Using Yarn</div>
  <div class="text-purple-700">yarn tailwind <span class="text-blue-700">init</span> <span class="text-gray-600">[filename]</span></div>
</div>

If you're an experienced Tailwind user who doesn't need the comments in the config file, use the `--no-comments` flag when generating your config file to strip them out.

### 3. Use Tailwind in your CSS

Use the `@@tailwind` directive to inject Tailwind's `base` and `utilities` styles into your CSS.

To avoid specificity issues, we highly recommend structuring your main stylesheet like this:

```less
/**
 * This injects Tailwind's base styles, which is a combination of
 * Normalize.css and some additional base styles.
 *
 * You can see the styles here:
 * https://github.com/tailwindcss/tailwindcss/blob/master/css/base.css
 *
 * If using `postcss-import`, use this import instead:
 *
 * @@import "tailwindcss/base";
 */
@@tailwind base;

/**
 * This injects any component classes registered by plugins.
 *
 * If using `postcss-import`, use this import instead:
 *
 * @@import "tailwindcss/components";
 */
@@tailwind components;

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
 * If using `postcss-import`, use this import instead:
 *
 * @@import "tailwindcss/utilities";
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

<div class="bg-gray-100 border rounded font-mono text-sm p-4">
  <div class="text-purple-700">npx tailwind <span class="text-blue-700">build styles.css</span> <span class="text-gray-600">[-c ./tailwind.config.js] [-o ./output.css] [--no-autoprefixer]</span></div>
</div>

Use the `npx tailwind help build` command to learn more about the various CLI options.

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
    tailwindcss('./path/to/your/tailwind.config.js'),
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
      tailwindcss('./path/to/your/tailwind.config.js'),
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

mix.postCss('resources/css/main.css', 'public/css', [
  tailwindcss('./path/to/your/tailwind.config.js'),
]);
```

If you're using a preprocessor, use the `options` method to add `tailwindcss` as a PostCSS plugin:

```js
var tailwindcss = require('tailwindcss');

mix.less('resources/less/app.less', 'public/css')
  .options({
    postCss: [
      tailwindcss('./path/to/your/tailwind.config.js'),
    ]
  });
```

**Note for Sass users:** Due to [an unresolved issue](https://github.com/bholloway/resolve-url-loader/issues/28) with one of Mix's dependencies, to use Sass with Tailwind you'll need to disable `processCssUrls`:

```js
var tailwindcss = require('tailwindcss');

mix.sass('resources/sass/app.scss', 'public/css')
  .options({
    processCssUrls: false,
    postCss: [ tailwindcss('./path/to/your/tailwind.config.js') ],
  });
```

For more information on what this feature does and the implications of disabling it, [see the Laravel Mix documentation](https://github.com/JeffreyWay/laravel-mix/blob/master/docs/css-preprocessors.md#css-url-rewriting).

#### Webpack Encore

Create a `postcss.config.js` file, add `tailwindcss` as a plugin and pass the path to your config file:

```js
module.exports = {
  plugins: [
    require('tailwindcss')('./path/to/your/tailwind.config.js'),
  ]
}
```

Within `webpack.config.js`, create a style entry and enable the PostCSS loader.

```js
var Encore = require('@symfony/webpack-encore');

Encore
    .setOutputPath('public/build/')
    .setPublicPath('/build')
    .addStyleEntry('app', './css/app.css')
    .enablePostCssLoader()
;

module.exports = Encore.getWebpackConfig();
```

You can also pass options into the PostCSS loader by passing a callback, as per the [Encore PostCSS docs](https://symfony.com/doc/current/frontend/encore/postcss.html):

```js
.enablePostCssLoader(function(options) {
    options.config = {
        path: 'config/postcss.config.js'
    };
})
```

**Note for Sass users:** Due to [an unresolved issue](https://github.com/bholloway/resolve-url-loader/issues/28) with one of Encore's dependencies, to use Sass with Tailwind you'll need to disable `resolveUrlLoader`:

```js
Encore
    .enableSassLoader(function (options) {}, {
        resolveUrlLoader: false
    })
    ;
```


#### Brunch

Add `tailwindcss` to the list of processors you pass to [postcss-brunch](https://github.com/brunch/postcss-brunch), passing the path to your config file:

```js
exports.config = {
  // ..
  plugins: {
    // ...
    postcss: {
      processors: [
        require('tailwindcss')('./tailwind.config.js')
      ]
    }
    // ...
  }
};
```
