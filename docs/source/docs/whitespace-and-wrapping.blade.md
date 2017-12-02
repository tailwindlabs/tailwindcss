---
extends: _layouts.documentation
title: "Whitespace &amp; Wrapping"
description: "Utilities for controlling the whitespace and wrapping of an element."
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
      '.whitespace-normal',
      'white-space: normal;',
      'Cause text to wrap normally within an element.',
    ],
    [
      '.whitespace-no-wrap',
      'white-space: nowrap;',
      'Prevent text from wrapping within an element.',
    ],
    [
      '.whitespace-pre',
      'white-space: pre;',
      'Preserve line returns and spaces within an element.',
    ],
    [
      '.whitespace-pre-line',
      'white-space: pre-line;',
      'Preserve line returns but not spaces within an element.',
    ],
    [
      '.whitespace-pre-wrap',
      'white-space: pre-wrap;',
      'Preserve spaces but not line returns within an element.',
    ],
    [
      '.break-words',
      'word-wrap: break-word;',
      'Add line breaks mid-word if needed.',
    ],
    [
      '.break-normal',
      'word-wrap: normal;',
      'Only add line breaks at normal word break points.',
    ],
    [
      '.truncate',
      "overflow: hidden;\ntext-overflow: ellipsis;\nwhite-space: nowrap",
      'Truncate overflowing text with an ellipsis (<code>…</code>) if needed.',
    ],
  ]
])

## Customizing

### Responsive, Hover, and Focus Variants

By default, only responsive variants are generated for whitespace & wrapping utilities.

You can control which variants are generated for the whitespace & wrapping utilities by modifying the `whitespace` property in the `modules` section of your Tailwind config file.

For example, this config will _also_ generate hover and focus variants:

```js
{
    // ...
    modules: { 
        // ...
        whitespace: ['responsive', 'hover', 'focus'],
    }
}
```

### Disabling

If you aren't using the whitespace & wrapping utilities in your project, you can disable them entirely by setting the `whitespace` property to `false` in the `modules` section of your config file:

```js
{
    // ...
    modules: {
        // ...
        whitespace: false,
    }
}
```
