---
extends: _layouts.documentation
title: "Controlling File Size"
description: "Strategies for keeping your generated CSS small and performant."
---

Using the default configuration, Tailwind CSS comes in at **36.4kb minified and gzipped.**

Here's a few other popular frameworks for comparison:

- Bootstrap: 22.1kb
- Bulma: 22.0kb
- Foundation: 16.7kb
- Tachyons: 13.6kb

By comparison Tailwind seems really heavy *(over 1.5x larger than Bootstrap!)*, but it turns out that this comparison isn't totally fair.

Tailwind is not a pre-packaged set of styles like a traditional CSS framework. Instead, Tailwind is a tool for generating CSS based on the style guide you define for your own project.

Because of this, **the generated file size will vary wildly from project to project** depending on your configuration file.

The default configuration file provides a **very generous** set of colors, breakpoints, sizes, margins, etc. by design. When you pull Tailwind down to prototype something, create a CodePen demo, or just try out the workflow, we want the experience to be as enjoyable and fluid as possible.

We don't want you to have to go and write new CSS because we didn't provide enough padding helpers out of the box, or because you wanted to use an orange color scheme for your demo and we only gave you blue.

This comes with a trade-off though: The default Tailwind build is significantly heavier than it would be on a real project with a purpose-built configuration file.

That said, here are a few strategies you can use to keep your generated CSS small and performant.

## Limiting your color palette

The default color palette includes a whopping [73 colors](/docs/colors) to make sure that if you're pulling Tailwind in for a prototype or demo, the color you're looking for is already there.

These colors are used for background colors, border colors, and text colors, all of which also have `hover:` variants, all of which have responsive variants at the five default screen sizes.

This means that by default, **there are 2190 classes generated** from this color palette, out of a total 4732 classes in the entire default build.

Here's how using a smaller color palette affects the overall file size:

- 73 colors *(default)*: 36.4kb
- 50 colors: 30.4kb
- 25 colors: 18.3kb

Not only can colors be removed globally, you can also remove them for a specific module.

For example, maybe you need 25 background colors but only 15 text colors. Instead of assigning your entire `colors` variable to the `textColors` property in your config, assign only the colors you need:

```js
// ...

module.exports = {
  // ...
  
  textColors: {
    'black': colors['black'],
    'grey-darker': colors['grey-darker'],
    'grey-dark': colors['grey-dark'],
    'red-dark': colors['red-dark'],
    'red': colors['red'],
    'blue-dark': colors['blue-dark'],
    'blue': colors['blue'],
    // ...
  }
}

```

Since your config file is just JavaScript, you could even use a function like [`lodash#pick`](https://lodash.com/docs/4.17.4#pick) to make this a little less monotonous:

```js
// ...

module.exports = {
  // ...
  
  textColors: _.pick(colors, [
    'black',
    'grey-darker',
    'grey-dark',
    'red-dark',
    'red',
    'blue-dark',
    'blue',
  ]),
}
```

## Removing unused breakpoints

Since every Tailwind utility is copied for every screen size, using fewer screen sizes can have a huge impact on overall file size.

Here's how defining fewer screens affects the output:

- 5 screen sizes *(default)*: 36.4kb
- 4 screen sizes: 29.4kb
- 3 screen sizes: 22.4kb
- 2 screen sizes: 15.4kb
- 1 screen size: 8.4kb

If you only need 3 screen sizes and 35 colors, you're down to 13.4kb without changing anything else.

## Disabling unused modules and variants

If you don't expect to need a module at all in your project, you can completely disable it by setting it to `false` in your config file:

```js
// ...

module.exports = {
  // ...

  modules: {
    // ...
    float: false,
    // ...
  },

  // ...
}
```

If you need a module but don't need the responsive versions, set it to an empty array:

```js
// ...

module.exports = {
  // ...

  modules: {
    // ...
    appearance: [],
    // ...
  },

  // ...
}
```

These are mostly small wins compared to limiting your color palette or using fewer breakpoints, but they can still add up.

## Removing unused CSS with PurgeCSS

[PurgeCSS](https://github.com/FullHuman/purgecss) is a tool for removing unused CSS from your project. It works by building a list of all of the class names used in your templates, then comparing that against your CSS and removing any CSS rules that you aren't using.

**Combining it with Tailwind is a match made in heaven.**

You can have as many colors and breakpoints as you like, generate responsive, hover, and focus variants for every module, and your generated CSS file will never be bigger than absolutely necessary.

With PurgeCSS, **you'll have a hard time generating CSS that *isn't* under 10kb minified and gzipped.**

Here's an example of what it might look like to setup with Laravel Mix:

```js
// Based on https://medium.com/@AndrewDelPrete/using-purifycss-to-remove-unused-tailwind-css-classes-173b3ee8ee01

let mix = require("laravel-mix");
let tailwindcss = require("tailwindcss");
let glob = require("glob-all");
let PurgecssPlugin = require("purgecss-webpack-plugin");

// Custom PurgeCSS extractor for Tailwind that allows special characters in
// class names.
// 
// https://github.com/FullHuman/purgecss#extractor
class TailwindExtractor {
  static extract(content) {
    return content.match(/[A-z0-9-:\/]+/g);
  }
}

mix.postCss("./src/styles.css", "public/css", [tailwindcss("./tailwind.js")]);

// Only run PurgeCSS during production builds for faster development builds
// and so you still have the full set of utilities available during
// development.
if (mix.inProduction()) {
  mix.webpackConfig({
    plugins: [
      new PurgecssPlugin({

        // Specify the locations of any files you want to scan for class names.
        paths: glob.sync([
          path.join(__dirname, "resources/views/**/*.blade.php"),
          path.join(__dirname, "resources/assets/js/**/*.vue")
        ]),
        extractors: [
          {
            extractor: TailwindExtractor,

            // Specify the file extensions to include when scanning for
            // class names.
            extensions: ["html", "js", "php", "vue"]
          }
        ]
      })
    ]
  });
}
```

For more information on working with PurgeCSS, [visit the PurgeCSS documentation](https://github.com/FullHuman/purgecss).







