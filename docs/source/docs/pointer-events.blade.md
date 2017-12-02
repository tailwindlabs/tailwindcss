---
extends: _layouts.documentation
title: "Pointer Events"
description: "Utilities for controlling whether an element responds to pointer events."
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
      '.pointer-events-none',
      'pointer-events: none;',
      "Make element not react to pointer events, like <code>:hover</code> or <code>click</code>.",
    ],
    [
      '.pointer-events-auto',
      'pointer-events: auto;',
      "Make element react to pointer events, like <code>:hover</code> or <code>click</code>.",
    ],
  ]
])

## Customizing

### Responsive, Hover, and Focus Variants

By default, only responsive variants are generated for pointer event utilities.

You can control which variants are generated for the pointer event utilities by modifying the `pointerEvents` property in the `modules` section of your Tailwind config file.

For example, this config will _also_ generate hover and focus variants:

```js
{
    // ...
    modules: { 
        // ...
        pointerEvents: ['responsive', 'hover', 'focus'],
    }
}
```

### Disabling

If you aren't using the pointer event utilities in your project, you can disable them entirely by setting the `pointerEvents` property to `false` in the `modules` section of your config file:

```js
{
    // ...
    modules: {
        // ...
        pointerEvents: false,
    }
}
```
