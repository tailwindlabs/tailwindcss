---
extends: _layouts.documentation
title: "Vertical Alignment"
description: "Utilities for controlling the vertical alignment of an inline or table-cell box."
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
      '.align-baseline',
      'vertical-align: baseline;',
      "Align the baseline of an element with the baseline of its parent.",
    ],
    [
      '.align-top',
      'vertical-align: top;',
      "Align the top of an element and its descendants with the top of the entire line.",
    ],
    [
      '.align-middle',
      'vertical-align: middle;',
      "Align the middle of an element with the baseline plus half the x-height of the parent.",
    ],
    [
      '.align-bottom',
      'vertical-align: bottom;',
      "Align the bottom of an element and its descendants with the bottom of the entire line.",
    ],
    [
      '.align-text-top',
      'vertical-align: text-top;',
      "Align the top of an element with the top of the parent element's font.",
    ],
    [
      '.align-text-bottom',
      'vertical-align: text-bottom;',
      "Align the bottom of an element with the bottom of the parent element's font.",
    ],
  ]
])

## Customizing

### Responsive, Hover, and Focus Variants

By default, no hover, focus, or group-hover variants are generated for vertical alignment utilities.

You can control which variants are generated for the vertical alignment utilities by modifying the `verticalAlign` property in the `modules` section of your Tailwind config file.

For example, this config will _also_ generate hover and focus variants:

```js
{
    // ...
    modules: { 
        // ...
        verticalAlign: ['responsive', 'hover', 'focus'],
    }
}
```

### Disabling

If you aren't using the vertical alignment utilities in your project, you can disable them entirely by setting the `verticalAlign` property to `false` in the `modules` section of your config file:

```js
{
    // ...
    modules: {
        // ...
        verticalAlign: false,
    }
}
```
