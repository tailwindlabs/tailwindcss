---
extends: _layouts.documentation
title: "Min-Height"
description: "Utilities for setting the minimum height of an element"
features:
  responsive: true
  customizable: true
  hover: false
  focus: false
---

@include('_partials.work-in-progress')

@include('_partials.class-table', [
  'scroll' => false,
  'rows' => [
    [
      '.min-h-0',
      'min-height: 0;',
      "Set the element's minimum height to 0.",
    ],
    [
      '.min-h-full',
      'min-height: 100%;',
      "Set the element's minimum height to 100%.",
    ],
    [
      '.min-h-screen',
      'min-height: 100vh;',
      "Set the element's minimum height to 100vh.",
    ],
  ]
])

## Customizing

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'min-height',
        'property' => 'minHeight',
    ],
    'variants' => [
        'responsive',
    ],
])
