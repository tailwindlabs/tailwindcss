---
extends: _layouts.documentation
title: "Cursor"
description: "Utilities for controlling the cursor style when hovering over an element."
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
      '.cursor-auto',
      'cursor: auto;',
      "Set the mouse cursor to the default browser behavior.",
    ],
    [
      '.cursor-pointer',
      'cursor: pointer;',
      "Set the mouse cursor to a pointer and indicate a link.",
    ],
    [
      '.cursor-not-allowed',
      'cursor: not-allowed;',
      "Set the mouse cursor to indicate that the action will not be executed.",
    ],
  ]
])

## Customizing

### Responsive, Hover, and Focus Variants

By default, only responsive variants are generated for cursor utilities.

You can control which variants are generated for the cursor utilities by modifying the `cursor` property in the `modules` section of your Tailwind config file.

For example, this config will _also_ generate hover and focus variants:

```js
{
    // ...
    modules: { 
        // ...
        cursor: ['responsive', 'hover', 'focus'],
    }
}
```

### Disabling

If you aren't using the cursor utilities in your project, you can disable them entirely by setting the `cursor` property to `false` in the `modules` section of your config file:

```js
{
    // ...
    modules: {
        // ...
        cursor: false,
    }
}
```
