---
extends: _layouts.documentation
title: "Transition Timing"
description: "Utilities for controlling the timing of CSS transitions."
features:
  responsive: false
  customizable: true
  hover: false
  focus: false
---

@include('_partials.work-in-progress')

@include('_partials.class-table', [
  'rows' => [
    [
      '.trans',
      'transition-timing-function: ease-in-out;',
      "Use the 'ease-in-out' timing function for transitions.",
    ],
    [
      '.trans-linear',
      'transition-timing-function: linear;',
      "Use the 'linear' timing function for transitions.",
    ],
    [
      '.trans-ease',
      'transition-timing-function: ease;',
      "Use the 'ease' timing function for transitions.",
    ],
    [
      '.trans-ease-in',
      'transition-timing-function: ease-in;',
      "Use the 'ease-in' timing function for transitions.",
    ],
    [
      '.trans-ease-out',
      'transition-timing-function: ease-out;',
      "Use the 'ease-out' timing function for transitions.",
    ],
    [
      '.trans-ease-in-out',
      'transition-timing-function: ease-in-out;',
      "Use the 'ease-in-out' timing function for transitions.",
    ],
  ]
])

## Customizing

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'transition timing',
        'property' => 'transitionTimingFunction',
    ],
    'variants' => [],
])
