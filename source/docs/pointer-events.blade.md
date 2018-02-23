---
extends: _layouts.documentation
title: "Pointer Events"
description: "Utilities for controlling whether an element responds to pointer events."
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
      '.pointer-events-none',
      'pointer-events: none;',
      "Make element not react to pointer events, like <code>:hover</code> or <code>click</code>.",
    ],
    [
      '.pointer-events-auto',
      'pointer-events: auto;',
      "Make element react to pointer events, like <code>:hover</code> or <code>click</code>.",
    ],
  ]
])

## Customizing

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'pointer event',
        'property' => 'pointerEvents',
    ],
    'variants' => [
        'responsive',
    ],
])
