---
extends: _layouts.documentation
title: "User Select"
description: "Utilities for controlling whether the user can select text in an element."
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
      '.select-none',
      'user-select: none;',
      "Disable selecting text in an element.",
    ],
    [
      '.select-text',
      'user-select: text;',
      "Allow selecting text in an element.",
    ],
  ]
])

## Customizing

### Responsive, Hover, and Focus Variants

By default, no hover, focus, or group-hover variants are generated for user select utilities.

You can control which variants are generated for the user select utilities by modifying the `userSelect` property in the `modules` section of your Tailwind config file.

For example, this config will _also_ generate hover and focus variants:

```js
{
    // ...
    modules: { 
        // ...
        userSelect: ['responsive', 'hover', 'focus'],
    }
}
```

### Disabling

If you aren't using the user select utilities in your project, you can disable them entirely by setting the `userSelect` property to `false` in the `modules` section of your config file:

```js
{
    // ...
    modules: {
        // ...
        userSelect: false,
    }
}
```
