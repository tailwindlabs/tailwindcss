---
extends: _layouts.documentation
title: "Border Style"
description: "Utilities for controlling the style of an element's borders."
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
      '.border-solid',
      'border-style: solid;',
      "Sets the border style on an element to solid.",
    ],
    [
      '.border-dashed',
      'border-style: dashed;',
      "Sets the border style on an element to dashed.",
    ],
    [
      '.border-dotted',
      'border-style: dotted;',
      "Sets the border style on an element to dotted.",
    ],
    [
      '.border-none',
      'border-style: none;',
      "Disables the border on an element.",
    ],
  ]
])


## Customizing

### Responsive, Hover, and Focus Variants

By default, no hover, focus, or group-hover variants are generated for border style utilities.

You can control which variants are generated for the border style utilities by modifying the `borderStyle` property in the `modules` section of your Tailwind config file.

For example, this config will _also_ generate hover and focus variants:

```js
{
    // ...
    modules: { 
        // ...
        borderStyle: ['responsive', 'hover', 'focus'],
    }
}
```

### Disabling

If you aren't using the border style utilities in your project, you can disable them entirely by setting the `borderStyle` property to `false` in the `modules` section of your config file:

```js
{
    // ...
    modules: {
        // ...
        borderStyle: false,
    }
}
```
