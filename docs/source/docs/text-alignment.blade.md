---
extends: _layouts.documentation
title: "Text Alignment"
description: "Utilities for controlling the alignment of text."
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
      '.text-left',
      'text-align: left;',
      'Align text to the left.',
    ],
    [
      '.text-center',
      'text-align: center;',
      'Align text to the center.',
    ],
    [
      '.text-right',
      'text-align: right;',
      'Align text to the right.',
    ],
    [
      '.text-justify',
      'text-align: justify;',
      'Justify text.',
    ],
  ]
])

## Customizing

### Responsive, Hover, and Focus Variants

By default, no hover, focus, or group-hover variants are generated for text align utilities.

You can control which variants are generated for the text align utilities by modifying the `textAlign` property in the `modules` section of your Tailwind config file.

For example, this config will _also_ generate hover and focus variants:

```js
{
    // ...
    modules: { 
        // ...
        textAlign: ['responsive', 'hover', 'focus'],
    }
}
```

### Disabling

If you aren't using the text align utilities in your project, you can disable them entirely by setting the `textAlign` property to `false` in the `modules` section of your config file:

```js
{
    // ...
    modules: {
        // ...
        textAlign: false,
    }
}
```
