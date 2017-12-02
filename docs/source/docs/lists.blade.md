---
extends: _layouts.documentation
title: "Lists"
description: "Utilities for controlling list styles."
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
      '.list-reset',
      "list-style: none;\npadding: 0;",
      "Disable default browser styling for lists and list items.",
    ],
  ]
])

## Customizing

### Responsive, Hover, and Focus Variants

By default, no hover, focus, or group-hover variants are generated for list utilities.

You can control which variants are generated for the list utilities by modifying the `lists` property in the `modules` section of your Tailwind config file.

For example, this config will _also_ generate hover and focus variants:

```js
{
    // ...
    modules: { 
        // ...
        lists: ['responsive', 'hover', 'focus'],
    }
}
```

### Disabling

If you aren't using the list utilities in your project, you can disable them entirely by setting the `lists` property to `false` in the `modules` section of your config file:

```js
{
    // ...
    modules: {
        // ...
        lists: false,
    }
}
```
