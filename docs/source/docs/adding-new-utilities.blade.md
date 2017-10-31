---
extends: _layouts.documentation
title: "Adding New Utilities"
---

# Adding New Utilities

Although Tailwind provides a pretty comprehensive set of utility classes out of the box, you're inevitably going to run into situations where you need to add a few of your own.

Deciding on the best way to extend a framework can be paralyzing, so here's some best practices and tools to help you add your own utilities "the Tailwind way."

## CSS Structure

A bare-bones Tailwind setup is a single CSS file that looks like this:

```less
@@tailwind reset;

@@tailwind utilities;
```

In CSS, **the order of your rule definitions is extremely important**.

If two rules have the same [specificity](https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity), the rule defined *last* is the rule that is applied.

For example, given the following CSS:

```less
.bg-red {
  background: #ff0000;
}

.bg-green {
  background-color: #0000ff;
}
```

...and the following HTML:

```html
<div class="bg-green bg-red"></div>
```

...the `div` would be green, because `.bg-green` is defined *after* `.bg-red` in the CSS file.

For this reason, **we recommend defining any custom utility classes at the end of your stylesheet,** *after* you inject Tailwind's utility classes:


```less
@@tailwind reset;

@@tailwind utilities;

.bg-cover-image {
  background-image: url('/path/to/image.jpg');
}
```

This way your custom utilities can override Tailwind utilities if needed, although you should strive to avoid applying two utility classes to an element that target the same CSS property if at all possible.

If you're using a preprocessor like Less, Sass, or Stylus, consider keeping your utilities in a separate file and importing them:

```less
@@tailwind reset;

@@tailwind utilities;

@import "custom-utilities";
```

## Making custom utilities responsive

If you'd like to create responsive versions of your own utilities based on the breakpoints defined in your Tailwind config file, wrap your utilities in the `@responsive { ... }` directive:

```less
@@tailwind reset;

@@tailwind utilities;

@@responsive {
  .bg-cover-image {
    background-image: url('/path/to/image.jpg');
  }
}
```

Tailwind will intelligently group the responsive versions into it's existing media queries which are output at the very end of the stylesheet. This ensures that any responsive utilities will always take precedence over unprefixed utilities.

The above code would generate CSS that looks something like this:

```css
/* Preflight styles rendered here... */
html { ... }
/* ... */

/* Tailwind utilities rendered here... */
.bg-red { ... }
/* ... */

.bg-cover-image {
  background-image: url('/path/to/image.jpg');
}

@media (min-width: 576px) {
  /* Tailwind utilities rendered here... */
  .sm\:bg-red { ... }
  /* ... */

  .sm\:bg-cover-image {
    background-image: url('/path/to/image.jpg');
  }
}

@media (min-width: 768px) {
  /* Tailwind utilities rendered here... */
  .md\:bg-red { ... }
  /* ... */

  .md\:bg-cover-image {
    background-image: url('/path/to/image.jpg');
  }
}

@media (min-width: 992px) {
  /* Tailwind utilities rendered here... */
  .lg\:bg-red { ... }
  /* ... */

  .lg\:bg-cover-image {
    background-image: url('/path/to/image.jpg');
  }
}

@media (min-width: 1200px) {
  /* Tailwind utilities rendered here... */
  .xl\:bg-red { ... }
  /* ... */

  .xl\:bg-cover-image {
    background-image: url('/path/to/image.jpg');
  }
}
```


