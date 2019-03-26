---
extends: _layouts.documentation
title: "Word Break"
description: "Utilities for controlling word breaks in an element."
---

@include('_partials.work-in-progress')

@include('_partials.class-table', [
  'rows' => [
    [
      '.break-normal',
      "word-break: normal;\noverflow-wrap: normal",
      'Only add line breaks at normal word break points.',
    ],
    [
      '.break-words',
      'overflow-wrap: break-word;',
      'Add line breaks mid-word if needed.',
    ],
    [
      '.break-all',
      'word-break: normal;',
      'Break whenever necessary, without trying to preserve whole words.',
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
        'name' => 'word break',
        'property' => 'wordBreak',
    ],
    'variants' => [
        'responsive',
    ],
])
