---
extends: _layouts.documentation
title: "Screen readers"
description: "Utilities for improving accessibility with screen readers."
---

@include('_partials.class-table', [
  'rows' => [
    [
      '.sr-only',
      "position: absolute;\nwidth: 1px;\nheight: 1px;\npadding: 0;\nmargin: -1px;\noverflow: hidden;\nclip: rect(0, 0, 0, 0);\nwhite-space: nowrap;\nborder-width: 0;",
    ],
    [
      '.not-sr-only',
      "position: static;\nwidth: auto;\nheight: auto;\npadding: 0;\nmargin: 0;\noverflow: visible;\nclip: auto;\nwhite-space: normal;",
    ],
  ]
])

## Usage

Use `sr-only` to hide an element visually without hiding it from screen readers:

```html
<a href="#">
  <svg><!-- ... --></svg>
  <span class="sr-only">Settings</span>
</a>
```

Use `not-sr-only` to undo `sr-only`, making an element visible to sighted users as well as screen readers. This can be useful when you want to visually hide something on small screens but show it on larger screens for example:

```html
<a href="#">
  <svg><!-- ... --></svg>
  <span class="sr-only sm:not-sr-only">Settings</span>
</a>
```

By default, `responsive` and `focus` variants are generated for these utilities. You can use `focus:not-sr-only` to make an element visually hidden by default but visible when the user tabs to it — useful for "skip to content" links:

```html
<a href="#" class="sr-only focus:not-sr-only">
  Skip to content
</a>
```

## Customizing

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'accessibility',
        'property' => 'accessibility',
    ],
    'variants' => [
        'responsive', 'hover', 'focus', 'active'
    ],
])