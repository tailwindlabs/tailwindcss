---
extends: _layouts.documentation
title: "Vertical Alignment"
description: "Utilities for controlling the vertical alignment of an inline or table-cell box."
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
      '.align-baseline',
      'vertical-align: baseline;',
      "Align the baseline of an element with the baseline of its parent.",
    ],
    [
      '.align-top',
      'vertical-align: top;',
      "Align the top of an element and its descendants with the top of the entire line.",
    ],
    [
      '.align-middle',
      'vertical-align: middle;',
      "Align the middle of an element with the baseline plus half the x-height of the parent.",
    ],
    [
      '.align-bottom',
      'vertical-align: bottom;',
      "Align the bottom of an element and its descendants with the bottom of the entire line.",
    ],
    [
      '.align-text-top',
      'vertical-align: text-top;',
      "Align the top of an element with the top of the parent element's font.",
    ],
    [
      '.align-text-bottom',
      'vertical-align: text-bottom;',
      "Align the bottom of an element with the bottom of the parent element's font.",
    ],
  ]
])

## Customizing

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'vertical alignment',
        'property' => 'verticalAlign',
    ],
    'variants' => [
        'responsive',
    ],
])
