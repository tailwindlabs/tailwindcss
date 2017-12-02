---
extends: _layouts.documentation
title: "Max-Height"
description: "Utilities for setting the maximum height of an element"
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
      '.max-h-full',
      'max-height: 100%;',
      "Set the element's maximum height to 100%.",
    ],
    [
      '.max-h-screen',
      'max-height: 100vh;',
      "Set the element's maximum height to 100vh.",
    ],
  ]
])

## Customizing

### Responsive, Hover, and Focus Variants

By default, only responsive variants are generated for max height utilities.

You can control which variants are generated for the max height utilities by modifying the `maxHeight` property in the `modules` section of your Tailwind config file.

For example, this config will _also_ generate hover and focus variants:

```js
{
    // ...
    modules: { 
        // ...
        maxHeight: ['responsive', 'hover', 'focus'],
    }
}
```

### Disabling

If you aren't using the max height utilities in your project, you can disable them entirely by setting the `maxHeight` property to `false` in the `modules` section of your config file:

```js
{
    // ...
    modules: {
        // ...
        maxHeight: false,
    }
}
```
