---
extends: _layouts.documentation
title: "Max-Width"
description: "Utilities for setting the maximum width of an element"
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
      '.max-w-xs',
      'max-width: 20rem;',
      "Set the element's maximum width to 20rem.",
    ],
    [
      '.max-w-sm',
      'max-width: 30rem;',
      "Set the element's maximum width to 30rem.",
    ],
    [
      '.max-w-md',
      'max-width: 40rem;',
      "Set the element's maximum width to 40rem.",
    ],
    [
      '.max-w-lg',
      'max-width: 50rem;',
      "Set the element's maximum width to 50rem.",
    ],
    [
      '.max-w-xl',
      'max-width: 60rem;',
      "Set the element's maximum width to 60rem.",
    ],
    [
      '.max-w-2xl',
      'max-width: 70rem;',
      "Set the element's maximum width to 70rem.",
    ],
    [
      '.max-w-3xl',
      'max-width: 80rem;',
      "Set the element's maximum width to 80rem.",
    ],
    [
      '.max-w-4xl',
      'max-width: 90rem;',
      "Set the element's maximum width to 90rem.",
    ],
    [
      '.max-w-5xl',
      'max-width: 100rem;',
      "Set the element's maximum width to 100rem.",
    ],
    [
      '.max-w-full',
      'max-width: 100%;',
      "Set the element's maximum width to 100%.",
    ],
  ]
])

## Customizing

### Responsive, Hover, and Focus Variants

By default, no hover, focus, or group-hover variants are generated for max width utilities.

You can control which variants are generated for the max width utilities by modifying the `maxWidth` property in the `modules` section of your Tailwind config file.

For example, this config will _also_ generate hover and focus variants:

```js
{
    // ...
    modules: { 
        // ...
        maxWidth: ['responsive', 'hover', 'focus'],
    }
}
```

### Disabling

If you aren't using the max width utilities in your project, you can disable them entirely by setting the `maxWidth` property to `false` in the `modules` section of your config file:

```js
{
    // ...
    modules: {
        // ...
        maxWidth: false,
    }
}
```
