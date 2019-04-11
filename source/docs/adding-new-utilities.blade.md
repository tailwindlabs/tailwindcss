---
extends: _layouts.documentation
title: "Adding New Utilities"
description: null
titleBorder: true
---

Although Tailwind provides a pretty comprehensive set of utility classes out of the box, you're inevitably going to run into situations where you need to add a few of your own.

Deciding on the best way to extend a framework can be paralyzing, so here are some best practices and tools to help you add your own utilities "the Tailwind way."

## CSS Structure

A bare-bones Tailwind setup is a single CSS file that looks like this:

```css
@@tailwind base;

@@tailwind components;

@@tailwind utilities;
```

In CSS, **the order of your rule definitions is extremely important**.

If two rules have the same [specificity](https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity), the rule defined *last* is the rule that is applied.

For example, given the following CSS:

```css
.bg-red-500 {
  background: #ff0000;
}

.bg-green-500 {
  background-color: #00ff00;
}
```

...and the following HTML:

```html
<div class="bg-green-500 bg-red-500"></div>
```

...the `div` would be green, because `.bg-green-500` is defined *after* `.bg-red-500` in the CSS file.

For this reason, **we recommend defining any custom utility classes at the end of your stylesheet,** *after* you inject Tailwind's utility classes:

```css
@@tailwind base;
@@tailwind components;
@@tailwind utilities;

.bg-cover-image {
  background-image: url('/path/to/image.jpg');
}
```

This way your custom utilities can override Tailwind utilities if needed, although you should strive to avoid applying two utility classes to an element that target the same CSS property if at all possible.

If you're using `postcss-import` or a preprocessor like Less, Sass, or Stylus, consider keeping your utilities in a separate file and importing them:

```css
/* Using postcss-import */
@@import "tailwindcss/base";
@@import "tailwindcss/components";
@@import "tailwindcss/utilities";
@@import "custom-utilities";

/* Using Sass or Less */
@@tailwind base;
@@tailwind components;
@@tailwind utilities;
@@import "custom-utilities";
```

## Responsive Variants

If you'd like to create responsive versions of your own utilities based on the breakpoints defined in your `tailwind.config.js` file, wrap your utilities in the `@responsive { ... }` directive:

```css
@@tailwind base;
@@tailwind components;
@@tailwind utilities;

@@responsive {
  .bg-cover-image {
    background-image: url('/path/to/image.jpg');
  }
}
```

Tailwind will intelligently group the responsive versions into its existing media queries which are output at the very end of the stylesheet. This ensures that any responsive utilities will always take precedence over unprefixed utilities.

The above code would generate CSS that looks something like this:

```css
/* Tailwind base styles rendered here... */
html { /* ... */ }
/* ... */

/* Tailwind components rendered here... */
.container { /* ... */ }
/* ... */

/* Tailwind utilities rendered here... */
.bg-red-100 { /* ... */ }
/* ... */

.bg-cover-image {
  background-image: url('/path/to/image.jpg');
}

@media (min-width: 640px) {
  .sm\:bg-red-100 { /* ... */ }
  /* ... */

  .sm\:bg-cover-image {
    background-image: url('/path/to/image.jpg');
  }
}

@media (min-width: 768px) {
  .md\:bg-red-100 { /* ... */ }
  /* ... */

  .md\:bg-cover-image {
    background-image: url('/path/to/image.jpg');
  }
}

@media (min-width: 1024px) {
  .lg\:bg-red-100 { /* ... */ }
  /* ... */

  .lg\:bg-cover-image {
    background-image: url('/path/to/image.jpg');
  }
}

@media (min-width: 1280px) {
  .xl\:bg-red-100 { /* ... */ }
  /* ... */

  .xl\:bg-cover-image {
    background-image: url('/path/to/image.jpg');
  }
}
```
