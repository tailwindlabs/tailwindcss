---
extends: _layouts.documentation
title: "Functions &amp; Directives"
description: null
---

Tailwind exposes a few custom CSS functions and directives that can be used in your actual CSS files.

### `@@tailwind`

Use the `@@tailwind` directive to insert Tailwind's `preflight`, `utilities` and `screens` styles into your CSS. Here's a full example of how you might do this:

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
 * This injects all of Tailwind's utility classes, generated based on your
 * config file.
 */
@@tailwind utilities;

/**
 * Use this directive to control where Tailwind injects the responsive
 * variations of each utility.
 *
 * If omitted, Tailwind will append these classes to the very end of
 * your stylesheet by default.
 */
 @@tailwind screens;
```

### `@@apply`

Use `@@apply` to mixin the contents of existing classes into your custom CSS.

This is extremely useful when you find a common utility pattern in your HTML that you'd like to extract to a new component.

```less
.btn {
  @@apply .font-bold .py-2 .px-4 .rounded;
}
.btn-blue {
  @@apply .bg-blue .text-white;
}
.btn-blue:hover {
  @@apply .bg-blue-dark;
}
```

Rules can listed on a single line or with multiple calls to `@@apply`:

```less
.btn {
  @@apply .font-bold;
  @@apply .py-2;
  @@apply .px-4;
  @@apply .rounded;
}
```

You can mix `@@apply` declarations with normal CSS declarations too of course:

```less
.btn:hover {
  @@apply .bg-blue-dark;
  transform: translateY(-1px);
}
```

Any rules mixed in with `@@apply` will have `!important` **removed** by default to avoid specificity issues:

```less
// Input
.foo {
  @@apply .bar;
}

.bar {
  color: blue !important;
}

// Output
.foo {
  color: blue;
}

.bar {
  color: blue !important;
}
```

If you'd like to `@@apply` an existing class and make it `!important`, simply add `!important` to the end of the declaration:


```less
// Input
.btn {
  @@apply .font-bold .py-2 .px-4 .rounded !important;
}

// Output
.btn {
  font-weight: 700 !important;
  padding-top: .5rem !important;
  padding-bottom: .5rem !important;
  padding-right: 1rem !important;
  padding-left: 1rem !important;
  border-radius: .25rem !important;
}
```

Note that `@@apply` **will not work** for mixing in hover, focus, or responsive variants of another utility. Instead, mix in the plain version of that utility into the appropriate pseudo-selector or a new media query:

```less
// Won't work:
.btn {
  @@apply .block .bg-red;
  @@apply .md:inline-block;
  @@apply .hover:bg-blue;
}

// Do this instead:
.btn {
  @@apply .block .bg-red;
}
.btn:hover {
  @@apply .bg-blue;
}
@@screen md {
  .btn {
    @@apply .inline-block;
  }
}
```

### `@variants`

You can generate `responsive`, `hover`, `focus`, and `group-hover` versions of your own utilities by wrapping their definitions in the `@variants` directive

```less
@@variants hover, focus {
  .banana {
    color: yellow;
  }
  .chocolate {
    color: brown;
  }
}
```

This will generate the following CSS:

```less
.banana {
  color: yellow;
}
.chocolate {
  color: brown;
}
.focus\:banana:focus {
  color: yellow;
}
.focus\:chocolate:focus {
  color: brown;
}
.hover\:banana:hover {
  color: yellow;
}
.hover\:chocolate:hover {
  color: brown;
}
```

The `@variants` at-rule supports all of the values that are supported in the `modules` section of your config file:

- `responsive`
- `hover`
- `focus`
- `group-hover`

### `@@responsive`

You can generate responsive versions of your own classes by wrapping their definitions in the `@responsive` directive:

```less
@@responsive {
  .bg-gradient-brand {
    background-image: linear-gradient(blue, green);
  }
}
```

Using the default breakpoints, this would generate these classes:

```less
.bg-gradient-brand {
  background-image: linear-gradient(blue, green);
}

// ...

@@media (min-width: 576px) {
  .sm\:bg-gradient-brand {
    background-image: linear-gradient(blue, green);
  }
  // ...
}

@@media (min-width: 768px) {
  .md\:bg-gradient-brand {
    background-image: linear-gradient(blue, green);
  }
  // ...
}

@@media (min-width: 992px) {
  .lg\:bg-gradient-brand {
    background-image: linear-gradient(blue, green);
  }
  // ...
}

@@media (min-width: 1200px) {
  .xl\:bg-gradient-brand {
    background-image: linear-gradient(blue, green);
  }
  // ...
}
```

The responsive versions will be added to Tailwind's existing media queries **at the end of your stylesheet.** This makes sure that classes with a responsive prefix always defeat non-responsive classes that are targeting the same CSS property.

### `@@screen`

The `@@screen` directive allows you to create media queries that reference your breakpoints by name instead of duplicating their values in your own CSS.

For example, say you have a `sm` breakpoint at `576px` and you need to write some custom CSS that references this breakpoint.

Instead of writing a raw media query that duplicates that value like this:

```less
{{ '@media (min-width: 576px) {' }}
  /* ... */
}
```

...you can use the `@@screen` directive and reference the breakpoint by name:

```less
@@screen sm {
  /* ... */
}
```

### `config()`

While it's recommended to use the `@@apply` directive to compose custom CSS out of existing utility classes whenever possible, sometimes you need direct access to your Tailwind config values.

Use the `config()` function to access your Tailwind config values using dot notation:

```less
// Source
.error {
  font-size: config('textSizes.xs');
  color: config('colors.red-darker');
}

// Output
.error {
  font-size: .75rem;
  color: #a61611;
}
```
