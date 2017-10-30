---
extends: _layouts.markdown
title: "Functions &amp; Directives"
---

# Functions & Directives

Tailwind exposes a few CSS functions and directives that can be used in your actual CSS files.

## `@tailwind`

Use the `@tailwind` directive to insert the Tailwind reset styles and utilities into your CSS file. Here is a full example of how you might do this:

```less
/**
 * This injects Tailwind's base styles, which is a combination of
 * Normalize.css and some additional base styles.
 *
 * You can see the styles here:
 * https://github.com/nothingworksinc/tailwindcss/blob/master/css/preflight.css
 */
@tailwind  reset;

/**
 * Here you would import any custom component classes; stuff that you'd
 * want loaded *before* the utilities so that the utilities can still
 * override them.
 */
@import  "my-components/foo";
@import  "my-components/bar";

/**
 * This injects all of Tailwind's utility classes, generated based on your
 * config file.
 */
@tailwind  utilities;

/**
 * Here you would add any custom utilities you need that don't come out of the box with Tailwind.
 */
.bg-hero-image {
    background-image: url('/some/image/file.png');
}
```

## `@responsive`

You can generate responsive versions of your own utilities by wrapping their definitions in the `@responsive` directive:

```less
@responsive {
  .bg-gradient-brand {
    background-image: linear-gradient(blue, green);
  }
}
```

This will generate these classes (assuming you haven't changed the default breakpoints):

```less
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

## `@screen`

Say you have a `sm` breakpoint at `576px`, and you need to write some custom CSS that references this breakpoint.

Instead of duplicating the values like this:

```less
@media (min-width: 576px) {
  /* ... */
}
```

...you can use the `@screen` directive and pass the breakpoint name:

```less
@screen sm {
  /* ... */
}
```

## `config()`

With all your variables defined in your JavaScript-based Tailwind config file, you may be wondering how you access those values in your custom CSS. This can be done using the `config()` helper function. Here is an example:

```less
.error {
  font-size: config('textSizes.xs');
  color: config('colors.slate-darker');
}
