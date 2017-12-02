---
extends: _layouts.documentation
title: "Display"
description: "Utilities for controlling the display box type of an element."
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
      '.block',
      'display: block;',
      "Set the box type of the element to <code>block</code>.",
    ],
    [
      '.inline-block',
      'display: inline-block;',
      "Set the box type of the element to <code>inline-block</code>.",
    ],
    [
      '.inline',
      'display: inline;',
      "Set the box type of the element to <code>inline</code>.",
    ],
    [
      '.table',
      'display: table;',
      "Set the box type of the element to <code>table</code>.",
    ],
    [
      '.table-row',
      'display: table-row;',
      "Set the box type of the element to <code>table-row</code>.",
    ],
    [
      '.table-cell',
      'display: table-cell;',
      "Set the box type of the element to <code>table-cell</code>.",
    ],
    [
      '.hidden',
      'display: none;',
      "Set the box type of the element to <code>none</code>.",
    ],
    [
      '.flex',
      'display: flex;',
      "Set the box type of the element to <code>flex</code>.",
    ],
    [
      '.inline-flex',
      'display: inline-flex;',
      "Set the box type of the element to <code>inline-flex</code>.",
    ],
  ]
])

## Customizing

### Responsive, Hover, and Focus Variants

By default, no hover, focus, or group-hover variants are generated for display utilities.

You can control which variants are generated for the display utilities by modifying the `display` property in the `modules` section of your Tailwind config file.

For example, this config will _also_ generate hover and focus variants:

```js
{
    // ...
    modules: { 
        // ...
        display: ['responsive', 'hover', 'focus'],
    }
}
```

### Disabling

If you aren't using the display utilities in your project, you can disable them entirely by setting the `display` property to `false` in the `modules` section of your config file:

```js
{
    // ...
    modules: {
        // ...
        display: false,
    }
}
```
