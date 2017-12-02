---
extends: _layouts.documentation
title: "Letter Spacing"
description: "Utilities for controlling the tracking (letter spacing) of an element."
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
      '.tracking-tight',
      'letter-spacing: -0.05em;',
      'Set the letter spacing of an element to <code>-0.05em</code>.',
    ],
    [
      '.tracking-normal',
      'letter-spacing: 0;',
      'Set the letter spacing of an element to <code>0</code>.',
    ],
    [
      '.tracking-wide',
      'letter-spacing: 0.05em;',
      'Set the letter spacing of an element to <code>0.05em</code>.',
    ],
  ]
])

## Customizing

### Responsive, Hover, and Focus Variants

By default, no hover, focus, or group-hover variants are generated for tracking utilities.

You can control which variants are generated for the tracking utilities by modifying the `tracking` property in the `modules` section of your Tailwind config file.

For example, this config will _also_ generate hover and focus variants:

```js
{
    // ...
    modules: { 
        // ...
        tracking: ['responsive', 'hover', 'focus'],
    }
}
```

### Disabling

If you aren't using the tracking utilities in your project, you can disable them entirely by setting the `tracking` property to `false` in the `modules` section of your config file:

```js
{
    // ...
    modules: {
        // ...
        tracking: false,
    }
}
```
