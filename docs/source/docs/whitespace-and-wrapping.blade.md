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

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'whitespace & wrapping',
        'property' => 'whitespace',
    ],
    'variants' => [
        'responsive',
    ],
])
