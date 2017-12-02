---
extends: _layouts.documentation
title: "Min-Height"
description: "Utilities for setting the minimum height of an element"
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
      '.min-h-0',
      'min-height: 0;',
      "Set the element's minimum height to 0.",
    ],
    [
      '.min-h-full',
      'min-height: 100%;',
      "Set the element's minimum height to 100%.",
    ],
    [
      '.min-h-screen',
      'min-height: 100vh;',
      "Set the element's minimum height to 100vh.",
    ],
  ]
])

## Customizing

### Responsive, Hover, and Focus Variants

By default, no hover, focus, or group-hover variants are generated for min height utilities.

You can control which variants are generated for the min height utilities by modifying the `minHeight` property in the `modules` section of your Tailwind config file.

For example, this config will _also_ generate hover and focus variants:

```js
{
    // ...
    modules: { 
        // ...
        minHeight: ['responsive', 'hover', 'focus'],
    }
}
```

### Disabling

If you aren't using the min height utilities in your project, you can disable them entirely by setting the `minHeight` property to `false` in the `modules` section of your config file:

```js
{
    // ...
    modules: {
        // ...
        minHeight: false,
    }
}
```
