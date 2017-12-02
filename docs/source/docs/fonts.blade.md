---
extends: _layouts.documentation
title: "Font Families"
description: "Utilities for controlling the font family of an element."
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
      '.font-sans',
      "font-family:\n  -apple-system,\n  BlinkMacSystemFont,\n  Segoe UI,\n  Roboto,\n  Oxygen,\n  Ubuntu,\n  Cantarell,\n  Fira Sans,\n  Droid Sans,\n  Helvetica Neue,\n  sans-serif;",
      'Set the font family to the sans font stack.',
    ],
    [
      '.font-serif',
      "font-family:\n  Constantia,\n  Lucida Bright,\n  Lucidabright,\n  Lucida Serif,\n  Lucida,\n  DejaVu Serif,\n  Bitstream Vera Serif,\n  Liberation Serif,\n  Georgia,\n  serif;",
      'Set the font family to the serif font stack.',
    ],
    [
      '.font-mono',
      "font-family:\n  Menlo,\n  Monaco,\n  Consolas,\n  Liberation Mono,\n  Courier New,\n  monospace;",
      'Set the font family to the mono font stack.',
    ],
  ]
])

## Customizing

### Responsive, Hover, and Focus Variants

By default, only responsive variants are generated for font utilities.

You can control which variants are generated for the font utilities by modifying the `fonts` property in the `modules` section of your Tailwind config file.

For example, this config will _also_ generate hover and focus variants:

```js
{
    // ...
    modules: { 
        // ...
        fonts: ['responsive', 'hover', 'focus'],
    }
}
```

### Disabling

If you aren't using the font utilities in your project, you can disable them entirely by setting the `fonts` property to `false` in the `modules` section of your config file:

```js
{
    // ...
    modules: {
        // ...
        fonts: false,
    }
}
```
