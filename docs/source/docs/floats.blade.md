---
extends: _layouts.documentation
title: "Floats"
description: "Utilities for controlling the wrapping of content around an element."
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
      '.float-right',
      'float: right;',
      "Moves the element to the right side of its container.",
    ],
    [
      '.float-left',
      'float: left;',
      "Moves the element to the left side of its container.",
    ],
    [
      '.float-none',
      'float: none;',
      "Removes any previously defined float value.",
    ],
    [
      '.clearfix',
      "&amp;::after {\n&nbsp;&nbsp;content: \"\";\n&nbsp;&nbsp;display: table;\n&nbsp;&nbsp;clear: both;\n}",
      "Clear any floats within an element.",
    ],
  ]
])

## Customizing

### Responsive, Hover, and Focus Variants

By default, only responsive variants are generated for float utilities.

You can control which variants are generated for the float utilities by modifying the `float` property in the `modules` section of your Tailwind config file.

For example, this config will _also_ generate hover and focus variants:

```js
{
    // ...
    modules: { 
        // ...
        float: ['responsive', 'hover', 'focus'],
    }
}
```

### Disabling

If you aren't using the float utilities in your project, you can disable them entirely by setting the `float` property to `false` in the `modules` section of your config file:

```js
{
    // ...
    modules: {
        // ...
        float: false,
    }
}
```
