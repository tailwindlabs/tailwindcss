---
extends: _layouts.documentation
title: "Clear"
description: "Utilities for controlling the wrapping of content around an element."
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
      '.clear-left',
      'clear: left;',
      "Moves the element below the floating elements on the left side.",
    ],
    [
      '.clear-right',
      'clear: right;',
      "Moves the element below the floating elements on the right side.",
    ],
    [
      '.clear-both',
      'clear: both;',
      "Moves the element below the floating elements on either side.",
    ],
  ]
])


## Customizing

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'clear',
        'property' => 'clear',
    ],
    'variants' => [
        'responsive',
    ],
])
