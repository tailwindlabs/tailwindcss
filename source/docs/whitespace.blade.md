---
extends: _layouts.documentation
title: "Whitespace"
description: "Utilities for controlling an element's white-space property."
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
  ]
])

## Customizing

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'whitespace',
        'property' => 'whitespace',
    ],
    'variants' => [
        'responsive',
    ],
])
