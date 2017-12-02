---
extends: _layouts.documentation
title: "Font Weight"
description: "Utilities for controlling the font weight of an element."
features:
  responsive: true
  customizable: true
  hover: false
  focus: false
---

@include('_partials.work-in-progress')

@include('_partials.class-table', [
  'rows' => [
    [
      '.font-hairline',
      'font-weight: 100;',
      'Set the font weight of an element to hairline.',
    ],
    [
      '.font-thin',
      'font-weight: 200;',
      'Set the font weight of an element to thin.',
    ],
    [
      '.font-light',
      'font-weight: 300;',
      'Set the font weight of an element to light.',
    ],
    [
      '.font-normal',
      'font-weight: 400;',
      'Set the font weight of an element to normal.',
    ],
    [
      '.font-medium',
      'font-weight: 500;',
      'Set the font weight of an element to medium.',
    ],
    [
      '.font-semibold',
      'font-weight: 600;',
      'Set the font weight of an element to semibold.',
    ],
    [
      '.font-bold',
      'font-weight: 700;',
      'Set the font weight of an element to bold.',
    ],
    [
      '.font-extrabold',
      'font-weight: 800;',
      'Set the font weight of an element to extrabold.',
    ],
    [
      '.font-black',
      'font-weight: 900;',
      'Set the font weight of an element to black.',
    ],
  ]
])

## Customizing

### Responsive, Hover, and Focus Variants

By default, no focus, or group-hover variants are generated for font weight utilities.

You can control which variants are generated for the font weight utilities by modifying the `fontWeights` property in the `modules` section of your Tailwind config file.

For example, this config will _also_ generate focus variants:

```js
{
    // ...
    modules: { 
        // ...
        fontWeights: ['responsive', 'hover', 'focus'],
    }
}
```

### Disabling

If you aren't using the font weight utilities in your project, you can disable them entirely by setting the `fontWeights` property to `false` in the `modules` section of your config file:

```js
{
    // ...
    modules: {
        // ...
        fontWeights: false,
    }
}
```
