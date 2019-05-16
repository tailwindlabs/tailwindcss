---
extends: _layouts.documentation
title: "Installation"
description: "Quick start guide for installing and configuring Tailwind CSS."
titleBorder: true
---

<div class="heading mt-0">
  <h2 class="flex markdown mt-0">
    <span class="text-lg bg-gray-200 text-gray-700 h-6 w-6 rounded-full inline-flex justify-center items-center mt-px mr-3">1</span>
    Install Tailwind via npm
  </h2>
</div>

For most projects (and to take advantage of Tailwind's customization features), you'll want to install Tailwind via npm.

```bash
# Using npm
npm install tailwindcss --save-dev

# Using Yarn
yarn add tailwindcss --dev
```

<div class="heading mt-0">
  <h2 class="flex markdown">
    <span class="text-lg bg-gray-200 text-gray-700 h-6 w-6 rounded-full inline-flex justify-center items-center mt-px mr-3">2</span>
    Add Tailwind to your CSS
  </h2>
</div>

Use the `@@tailwind` directive to inject Tailwind's `base`, `components`, and `utilities` styles into your CSS:

```css
@@tailwind base;

@@tailwind components;

@@tailwind utilities;
```

Tailwind will swap these directives out at build time with all of its generated CSS.

If you're using `postcss-import` (or a tool that uses it under the hood, such as [Webpacker](https://github.com/rails/webpacker) for Rails), use our imports instead of the `@@tailwind` directive to avoid issues when importing any of your own additional files:

```css
@@import "tailwindcss/base";

@@import "tailwindcss/components";

@@import "tailwindcss/utilities";
```

<div class="heading mt-0">
  <h2 class="flex markdown">
    <span class="text-lg bg-gray-200 text-gray-700 h-6 w-6 rounded-full inline-flex justify-center items-center mt-px mr-3">3</span>
    Process your CSS with Tailwind
  </h2>
</div>

### Using Tailwind CLI

For simple projects or just giving Tailwind a spin, you can use the Tailwind CLI tool to process your CSS:

```bash
npx tailwind build styles.css -o output.css
```

Use the `npx tailwind help build` command to learn more about the various CLI options.

### Using Tailwind with PostCSS

For most projects, you'll want to add Tailwind as a PostCSS plugin in your build chain.

Generally this means adding Tailwind as a plugin in your `postcss.config.js` file:

```js
module.exports = {
  plugins: [
    // ...
    require('tailwindcss'),
    require('autoprefixer'),
    // ...
  ]
}
```

We've included more specific instructions for a few popular tools below, but for instructions on getting started with PostCSS in general, see the [PostCSS documentation](https://github.com/postcss/postcss#usage).

### Webpack

Add `tailwindcss` as a plugin in your  `postcss.config.js` file:

```js
module.exports = {
  plugins: [
    // ...
    require('tailwindcss'),
    require('autoprefixer'),
    // ...
  ]
}
```

...or include it directly in your [postcss-loader](https://github.com/postcss/postcss-loader) configuration in your `webpack.config.js` file:

```js
// webpack.config.js
module.exports = {
  // ...
  module: {
    rules: [
      // ...
      use: [
        // ...
        {
          loader: 'postcss-loader',
          options: {
            ident: 'postcss',
            plugins: [
              require('tailwindcss'),
              require('autoprefixer'),
            ],
          },
        },
      ],
    ],
  }
}
```

### Gulp

Add `tailwindcss` to the list of plugins you pass to [gulp-postcss](https://github.com/postcss/gulp-postcss):

```js
gulp.task('css', function () {
  const postcss = require('gulp-postcss')

  return gulp.src('src/styles.css')
    // ...
    .pipe(postcss([
      // ...
      require('tailwindcss'),
      require('autoprefixer'),
      // ...
    ]))
    // ...
    .pipe(gulp.dest('build/'))
})
```

### Laravel Mix

If you're writing your project in plain CSS, use Mix's `postCss` method to process your CSS and include `tailwindcss` as a plugin:

```js
mix.postCss('resources/css/main.css', 'public/css', [
  require('tailwindcss'),
])
```

If you're using a preprocessor, use the `options` method to add `tailwindcss` as a PostCSS plugin:

```js
const tailwindcss = require('tailwindcss')

mix.less('resources/less/app.less', 'public/css')
  .options({
    postCss: [
      tailwindcss('./path/to/your/tailwind.config.js'),
    ]
  })
```

**Note for Sass users:** Due to [an unresolved issue](https://github.com/bholloway/resolve-url-loader/issues/28) with one of Mix's dependencies, to use Sass with Tailwind you'll need to disable `processCssUrls`:

```js
const tailwindcss = require('tailwindcss')

mix.sass('resources/sass/app.scss', 'public/css')
  .options({
    processCssUrls: false,
    postCss: [ tailwindcss('./path/to/your/tailwind.config.js') ],
  })
```

For more information on what this feature does and the implications of disabling it, [see the Laravel Mix documentation](https://laravel-mix.com/docs/4.0/css-preprocessors#css-url-rewriting).

### Webpack Encore

Create a `postcss.config.js` file, add `tailwindcss` as a plugin and pass the path to your config file:

```js
module.exports = {
  plugins: [
    require('tailwindcss'),
  ]
}
```

Within `webpack.config.js`, create a style entry and enable the PostCSS loader.

```js
const Encore = require('@symfony/webpack-encore')

Encore
  .setOutputPath('public/build/')
  .setPublicPath('/build')
  .addStyleEntry('app', './css/app.css')
  .enablePostCssLoader()

module.exports = Encore.getWebpackConfig()
```

You can also pass options into the PostCSS loader by passing a callback, as per the [Encore PostCSS docs](https://symfony.com/doc/current/frontend/encore/postcss.html):

```js
Encore.enablePostCssLoader(function(options) {
  options.config = {
    path: 'config/postcss.config.js'
  }
})
```

**Note for Sass users:** Due to [an unresolved issue](https://github.com/bholloway/resolve-url-loader/issues/28) with one of Encore's dependencies, to use Sass with Tailwind you'll need to disable `resolveUrlLoader`:

```js
Encore.enableSassLoader(function (options) {}, {
  resolveUrlLoader: false
})
```


### Brunch

Add `tailwindcss` to the list of processors you pass to [postcss-brunch](https://github.com/brunch/postcss-brunch):

```js
exports.config = {
  // ..
  plugins: {
    // ...
    postcss: {
      processors: [
        require('tailwindcss'),
      ]
    }
    // ...
  }
}
```

#### Ember.js

Add `tailwindcss` to the list of plugins you pass to [ember-cli-postcss](https://github.com/jeffjewiss/ember-cli-postcss):

```
// ember-cli-build.js 
'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  let app = new EmberApp(defaults, {
    postcssOptions: {
      compile: {
        plugins: [
          require('tailwindcss')
        ]
      }
    }
  });
  return app.toTree();
};
```

<hr class="my-16">

## Using Tailwind via CDN

Before using the CDN build please note, many of the features that make Tailwind CSS great are not available without incorporating Tailwind into your build process.

<ul class="list-none pl-0">
  <li class="flex items-center">
    <svg class="h-6 w-6 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon-close-circle"><circle cx="12" cy="12" r="10" fill="#fed7d7"/><path fill="#f56565" d="M13.41 12l2.83 2.83a1 1 0 0 1-1.41 1.41L12 13.41l-2.83 2.83a1 1 0 1 1-1.41-1.41L10.59 12 7.76 9.17a1 1 0 0 1 1.41-1.41L12 10.59l2.83-2.83a1 1 0 0 1 1.41 1.41L13.41 12z"/></svg>
    <span>You can't customize Tailwind's default theme</span>
  </li>
  <li class="flex items-center">
    <svg class="h-6 w-6 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon-close-circle"><circle cx="12" cy="12" r="10" fill="#fed7d7"/><path fill="#f56565" d="M13.41 12l2.83 2.83a1 1 0 0 1-1.41 1.41L12 13.41l-2.83 2.83a1 1 0 1 1-1.41-1.41L10.59 12 7.76 9.17a1 1 0 0 1 1.41-1.41L12 10.59l2.83-2.83a1 1 0 0 1 1.41 1.41L13.41 12z"/></svg>
    <span>You can't use any <a href="/docs/functions-and-directives">directives</a> like <code>@apply</code>, <code>@variants</code>, etc.</span>
  </li>
  <li class="flex items-center">
    <svg class="h-6 w-6 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon-close-circle"><circle cx="12" cy="12" r="10" fill="#fed7d7"/><path fill="#f56565" d="M13.41 12l2.83 2.83a1 1 0 0 1-1.41 1.41L12 13.41l-2.83 2.83a1 1 0 1 1-1.41-1.41L10.59 12 7.76 9.17a1 1 0 0 1 1.41-1.41L12 10.59l2.83-2.83a1 1 0 0 1 1.41 1.41L13.41 12z"/></svg>
    <span>You can't enable features like <a href="/docs/pseudo-class-variants#group-hover"><code>group-hover</code></a></span>
  </li>
  <li class="flex items-center">
    <svg class="h-6 w-6 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon-close-circle"><circle cx="12" cy="12" r="10" fill="#fed7d7"/><path fill="#f56565" d="M13.41 12l2.83 2.83a1 1 0 0 1-1.41 1.41L12 13.41l-2.83 2.83a1 1 0 1 1-1.41-1.41L10.59 12 7.76 9.17a1 1 0 0 1 1.41-1.41L12 10.59l2.83-2.83a1 1 0 0 1 1.41 1.41L13.41 12z"/></svg>
    <span>You can't install third-party plugins</span>
  </li>
</ul>

To get the most out of Tailwind, you really should [install it via npm](#step-1-install-tailwind-via-npm).

To pull in Tailwind for quick demos or just giving the framework a spin, grab the latest default configuration build via CDN:

```html
<link href="https://unpkg.com/tailwindcss/dist/tailwind.min.css" rel="stylesheet">
```

Note that while the CDN build is large *(27kb compressed, 348kb raw)*, **it's not representative of the sizes you see when including Tailwind as part of your build process**.

Sites that follow our [best practices](/docs/controlling-file-size) are almost always under 10kb compressed. For example, [Firefox Send](https://send.firefox.com/) is built with Tailwind and their CSS is under 4kb compressed and minified.
