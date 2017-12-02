---
extends: _layouts.documentation
title: "Resize"
description: "Utilities for controlling how an element can be resized."
features:
  responsive: true
  customizable: false
  hover: false
  focus: false
---

@include('_partials.work-in-progress')


@include('_partials.class-table', [
  'rows' => [
    [
      '.resize-none',
      'resize: none;',
      "Make an element not resizable.",
    ],
    [
      '.resize',
      'resize: both;',
      "Make an element resizable along both axes.",
    ],
    [
      '.resize-y',
      'resize: vertical;',
      "Make an element resizable vertically.",
    ],
    [
      '.resize-x',
      'resize: horizontal;',
      "Make an element resizable horizontally.",
    ],
  ]
])

## Customizing

### Responsive, Hover, and Focus Variants

By default, only responsive variants are generated for resizing utilities.

You can control which variants are generated for the resizing utilities by modifying the `resize` property in the `modules` section of your Tailwind config file.

For example, this config will _also_ generate hover and focus variants:

```js
{
    // ...
    modules: { 
        // ...
        resize: ['responsive', 'hover', 'focus'],
    }
}
```

### Disabling

If you aren't using the resizing utilities in your project, you can disable them entirely by setting the `resize` property to `false` in the `modules` section of your config file:

```js
{
    // ...
    modules: {
        // ...
        resize: false,
    }
}
```
