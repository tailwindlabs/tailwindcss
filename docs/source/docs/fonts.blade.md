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
      "font-family:\n  system-ui,\n  BlinkMacSystemFont,\n  -apple-system,\n  Segoe UI,\n  Roboto,\n  Oxygen,\n  Ubuntu,\n  Cantarell,\n  Fira Sans,\n  Droid Sans,\n  Helvetica Neue,\n  sans-serif;",
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

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'font',
        'property' => 'fonts',
    ],
    'variants' => [
        'responsive',
    ]
])

### Note

Some fonts, such as fonts with an integer in their name, are required to be wrapped in quotes. 

For example:
```js
// ...

module.exports = {
  // ...
    fonts: {
      sans: [
        'Exo 2',   // Replace this...
        '"Exo 2"', // With this...
        '-apple-system',
        'BlinkMacSystemFont',
        'Segoe UI',
        'Roboto',
        'Oxygen',
        'Ubuntu',
        'Cantarell',
        'Fira Sans',
        'Droid Sans',
        'Helvetica Neue',
        'sans-serif'
      ],
    // ...
  }
}
```