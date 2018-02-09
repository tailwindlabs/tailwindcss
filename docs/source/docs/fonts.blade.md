---
extends: _layouts.documentation
title: "Font Families"
description: "Utilities for controlling the font family of an element."
features:
  responsive: true
  customizable: true
  hover: false
  active: false
  focus: false
---

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

### Sans-serif

Use `.font-sans` to apply a web safe sans-serif font family:

@component('_partials.code-sample')
<p class="font-sans text-lg text-grey-darkest text-center">
  I'm a sans-serif paragraph.
</p>
@endcomponent

### Serif

Use `.font-serif` to apply a web safe serif font family:

@component('_partials.code-sample')
<p class="font-serif text-lg text-grey-darkest text-center">
  I'm a serif paragraph.
</p>
@endcomponent

### Monospaced

Use `.font-mono` to apply a web safe monospaced font family:

@component('_partials.code-sample')
<p class="font-mono text-lg text-grey-darkest text-center">
  I'm a monospaced paragraph.
</p>
@endcomponent

## Customizing

By default Tailwind provides three font family utilities: a cross-browser sans-serif stack, a cross-browser serif stack, and a cross-browser monospaced stack. You can change, add, or remove these by editing the `fonts` section of your Tailwind config.

@component('_partials.customized-config', ['key' => 'fonts'])
- 'sans': ['system-ui', 'BlinkMacSystemFont', ...],
- 'serif': ['Constantia', 'Lucida Bright', ...],
- 'mono': ['Menlo', 'Monaco', ...],
+ 'display': ['Oswald', ...],
+ 'body': ['Open Sans', ...],
@endcomponent

Font families can be specified as an array or as a simple comma-delimited string:

```js
{
  // Array format:
  'sans': ['Helvetica', 'Arial', 'sans-serif'],

  // Comma-delimited format:
  'sans': 'Helvetica, Arial, sans-serif',
}
```

Note that **Tailwind does not automatically escape font names** for you. If you're using a font that contains an invalid identifier, wrap it in quotes or escape the invalid characters.

```js
{
  // Won't work:
  'sans': ['Exo 2', ...],

  // Add quotes:
  'sans': ['"Exo 2"', ...],

  // ...or escape the space:
  'sans': ['Exo\\ 2', ...],
}

```

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'font',
        'property' => 'fonts',
    ],
    'variants' => [
        'responsive',
    ],
])
