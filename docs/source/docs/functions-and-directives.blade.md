---
extends: _layouts.documentation
title: "Functions &amp; Directives"
---

# Functions & Directives

Tailwind exposes a few custom CSS functions and directives that can be used in your actual CSS files.

### `@@tailwind`

Use the `@@tailwind` directive to insert Tailwind's `reset` and `utilities` styles into your CSS. Here's a full example of how you might do this:

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

Note that `@@apply` **will not work** for mixing in hover or responsive variants of another utility. Instead, mixin the plain version of that utility into the `:hover` pseudo-selector or a new media query:

```less
// Won't work:
.btn {
  @@apply .md:inline-block;
  @@apply .hover:bg-blue;
}

// Do this instead:
.btn {
  &:hover {
    @@apply .bg-blue;
  }
  @@screen md {
    @@apply .inline-block;
  }
}
```

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

