---
extends: _layouts.documentation
title: "Border Style"
description: "Utilities for controlling the style of an element's borders."
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
      '.border-solid',
      'border-style: solid;',
      "Sets the border style on an element to solid.",
    ],
    [
      '.border-dashed',
      'border-style: dashed;',
      "Sets the border style on an element to dashed.",
    ],
    [
      '.border-dotted',
      'border-style: dotted;',
      "Sets the border style on an element to dotted.",
    ],
    [
      '.border-none',
      'border-style: none;',
      "Disables the border on an element.",
    ],
  ]
])


## Customizing

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'border style',
        'property' => 'borderStyle',
    ],
    'variants' => [
        'responsive',
    ],
])
