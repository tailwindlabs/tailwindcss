---
extends: _layouts.documentation
title: "Min-Width"
description: "Utilities for setting the minimum width of an element"
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
      '.min-w-0',
      'min-width: 0;',
      "Set the element's minimum width to 0.",
    ],
    [
      '.min-w-full',
      'min-width: 100%;',
      "Set the element's minimum width to 100%.",
    ],
  ]
])

## Customizing

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'min-width',
        'property' => 'minWidth',
    ],
    'variants' => [
        'responsive',
    ],
])
