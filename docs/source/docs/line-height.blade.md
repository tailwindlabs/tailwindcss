---
extends: _layouts.documentation
title: "Line Height"
description: "Utilities for controlling the leading (line height) of an element."
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
      '.leading-none',
      'line-height: 1;',
      'Set the line height of an element to <code>1</code>.',
    ],
    [
      '.leading-tight',
      'line-height: 1.25;',
      'Set the line height of an element to <code>1.25</code>.',
    ],
    [
      '.leading-normal',
      'line-height: 1.5;',
      'Set the line height of an element to <code>1.5</code>.',
    ],
    [
      '.leading-loose',
      'line-height: 2;',
      'Set the line height of an element to <code>2</code>.',
    ],
  ]
])

## Customizing

### Responsive, Hover, and Focus Variants

By default, no hover, focus, or group-hover variants are generated for leading utilities.

You can control which variants are generated for the leading utilities by modifying the `leading` property in the `modules` section of your Tailwind config file.

For example, this config will _also_ generate hover and focus variants:

```js
{
    // ...
    modules: { 
        // ...
        leading: ['responsive', 'hover', 'focus'],
    }
}
```

### Disabling

If you aren't using the leading utilities in your project, you can disable them entirely by setting the `leading` property to `false` in the `modules` section of your config file:

```js
{
    // ...
    modules: {
        // ...
        leading: false,
    }
}
```
