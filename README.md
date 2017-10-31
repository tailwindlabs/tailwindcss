# TailwindCSS

A utility-first CSS framework for rapid UI development.

## Getting Started

1. Add the library to your project as a Git repo dependency:

    ```sh
    # Using npm
    npm install git+ssh://git@github.com:nothingworksinc/tailwindcss.git#master

    # Using Yarn
    yarn add git+ssh://git@github.com:nothingworksinc/tailwindcss.git#master
    ```

2. Create a Tailwind config file for your project by saving a copy of the default config file somewhere sensible, like `tailwind.js` in your project's root.

    You can copy the default config file from here:

    https://github.com/nothingworksinc/tailwindcss/blob/master/src/defaultConfig.js

3. Create a CSS (or Less, Sass, Stylus, whatever) file as your main stylesheet, structured like this:

    ```less
    /**
     * This injects Tailwind's base styles, which is a combination of
     * Normalize.css and some additional base styles.
     *
     * You can see the styles here:
     * https://github.com/nothingworksinc/tailwindcss/blob/master/css/preflight.css
     */
    @tailwind preflight;

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

4. For simple projects or just taking Tailwind for a spin, use the `tailwind` CLI tool to process your CSS:

    ```sh
    ./node_modules/.bin/tailwind styles.css [-c ./custom-config.js] [-o ./output.css]
    ```

    For most projects, you'll want to add Tailwind as a PostCSS plugin in your build chain, passing your config object as a parameter.

    Here's an example using Laravel Mix:

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

## Style Reference

Until the real documentation is ready, you can reference this file to see which classes exist and what they do:

https://github.com/nothingworksinc/tailwindcss/blob/master/dist/tailwind.css

## Additional Features

### Using utilities as mixins

To use existing utility classes as mixins in your custom component classes, use the `@apply` custom at-rule:

```less
// Input
.btn-primary {
  @apply .bg-blue;
  @apply .px-4;
  @apply .py-2;
  @apply .text-white;
}
.btn-primary:hover {
  @apply .bg-blue-dark;
}

// Output
.btn-primary {
  background-color: #4aa2ea;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: .5rem;
  padding-bottom: .5rem;
  color: #fff;
}
.btn-primary:hover {
  background-color: #3687c8;
}
```


### Referencing config values in your CSS

It's not always possible to build components purely out of existing utilities. If you need to reference any of your Tailwind config values directly, you can do so with the `tailwind(...)` helper function:

```less
.markdown pre {
    border: 1px solid tailwind('borders.defaults.color');
    border-left: 4px solid tailwind('borders.colors.dark');
}
```

### Creating responsive versions of your own utilities

You can generate responsive versions of your own utilities by wrapping their definitions in the `@responsive` at-rule:

```css
@responsive {
  .bg-gradient-brand {
    background-image: linear-gradient(blue, green);
  }
}
```

This will generate these classes (assuming you haven't changed the default breakpoints):

```css
.bg-gradient-brand {
  background-image: linear-gradient(blue, green);
}
@media (min-width: 576px) {
  .sm\:bg-gradient-brand {
    background-image: linear-gradient(blue, green);
  }
}
@media (min-width: 768px) {
  .md\:bg-gradient-brand {
    background-image: linear-gradient(blue, green);
  }
}
@media (min-width: 992px) {
  .lg\:bg-gradient-brand {
    background-image: linear-gradient(blue, green);
  }
}
@media (min-width: 1200px) {
  .xl\:bg-gradient-brand {
    background-image: linear-gradient(blue, green);
  }
}
```

### Media query shorthand

Say you have a `sm` breakpoint at 576px, and you need to write some custom CSS that references this breakpoint.

Instead of duplicating the values like this:

```css
@media (min-width: 576px) {
  /* ... */
}
```

...you can use the `@screen` at-rule and pass the breakpoint name:

```css
@screen sm {
  /* ... */
}
```
