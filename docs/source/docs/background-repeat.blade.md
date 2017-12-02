---
extends: _layouts.documentation
title: "Background Repeat"
description: "Utilities for controlling the repetition of an element's background image."
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
      '.bg-repeat',
      'background-repeat: repeat;',
      'Repeat the background image both vertically and horizontally.',
    ],
    [
      '.bg-no-repeat',
      'background-repeat: no-repeat;',
      'Don\'t repeat the background image.',
    ],
    [
      '.bg-repeat-x',
      'background-repeat: repeat-x;',
      'Repeat the background image only horizontally.',
    ],
    [
      '.bg-repeat-y',
      'background-repeat: repeat-y;',
      'Repeat the background image only vertically.',
    ],
  ]
])

## Customizing

### Responsive, Hover, and Focus Variants

By default, no hover, focus, or group-hover variants are generated for background repeat utilities.

You can control which variants are generated for the background repeat utilities by modifying the `backgroundRepeat` property in the `modules` section of your Tailwind config file.

For example, this config will _also_ generate hover and focus variants:

```js
{
    // ...
    modules: { 
        // ...
        backgroundRepeat: ['responsive', 'hover', 'focus'],
    }
}
```

### Disabling

If you aren't using the background repeat utilities in your project, you can disable them entirely by setting the `backgroundRepeat` property to `false` in the `modules` section of your config file:

```js
{
    // ...
    modules: {
        // ...
        backgroundRepeat: false,
    }
}
```
