---
extends: _layouts.documentation
title: "Min-Width"
description: "Utilities for setting the minimum width of an element"
features:
  responsive: true
  customizable: true
  hover: false
  focus: false
---

@include('_partials.work-in-progress')

@include('_partials.class-table', [
  'scroll' => false,
  'rows' => [
    [
      '.min-w-0',
      'min-width: 0;',
      "Set the element's minimum width to 0.",
    ],
    [
      '.min-w-full',
      'min-width: 100%;',
      "Set the element's minimum width to 100%.",
    ],
  ]
])

## Customizing

### Responsive, Hover, and Focus Variants

By default, no hover, focus, or group-hover variants are generated for min width utilities.

You can control which variants are generated for the min width utilities by modifying the `minWidth` property in the `modules` section of your Tailwind config file.

For example, this config will _also_ generate hover and focus variants:

```js
{
    // ...
    modules: { 
        // ...
        minWidth: ['responsive', 'hover', 'focus'],
    }
}
```

### Disabling

If you aren't using the min width utilities in your project, you can disable them entirely by setting the `minWidth` property to `false` in the `modules` section of your config file:

```js
{
    // ...
    modules: {
        // ...
        minWidth: false,
    }
}
```
