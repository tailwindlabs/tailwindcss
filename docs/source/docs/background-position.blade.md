---
extends: _layouts.documentation
title: "Background Position"
description: "Utilities for controlling the position of an element's background image."
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
      '.bg-bottom',
      'background-position: bottom;',
      'Place the background image on the bottom edge.',
    ],
    [
      '.bg-center',
      'background-position: center;',
      'Place the background image in the center.',
    ],
    [
      '.bg-left',
      'background-position: left;',
      'Place the background image on the left edge.',
    ],
    [
      '.bg-left-bottom',
      'background-position: left bottom;',
      'Place the background image on the left bottom edge.',
    ],
    [
      '.bg-left-top',
      'background-position: left top;',
      'Place the background image on the left top edge.',
    ],
    [
      '.bg-right',
      'background-position: right;',
      'Place the background image on the right edge.',
    ],
    [
      '.bg-right-bottom',
      'background-position: right bottom;',
      'Place the background image on the right bottom edge.',
    ],
    [
      '.bg-right-top',
      'background-position: right top;',
      'Place the background image on the right top edge.',
    ],
    [
      '.bg-top',
      'background-position: top;',
      'Place the background image on the top edge.',
    ],
  ]
])

## Customizing

### Responsive, Hover, and Focus Variants

By default, only responsive variants are generated for background position utilities.

You can control which variants are generated for the background position utilities by modifying the `backgroundPosition` property in the `modules` section of your Tailwind config file.

For example, this config will _also_ generate hover and focus variants:

```js
{
    // ...
    modules: { 
        // ...
        backgroundPosition: ['responsive', 'hover', 'focus'],
    }
}
```

### Disabling

If you aren't using the background position utilities in your project, you can disable them entirely by setting the `backgroundPosition` property to `false` in the `modules` section of your config file:

```js
{
    // ...
    modules: {
        // ...
        backgroundPosition: false,
    }
}
```
