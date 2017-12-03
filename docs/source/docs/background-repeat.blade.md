---
extends: _layouts.documentation
title: "Background Repeat"
description: "Utilities for controlling the repetition of an element's background image."
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
      '.bg-repeat',
      'background-repeat: repeat;',
      'Repeat the background image both vertically and horizontally.',
    ],
    [
      '.bg-no-repeat',
      'background-repeat: no-repeat;',
      'Don\'t repeat the background image.',
    ],
    [
      '.bg-repeat-x',
      'background-repeat: repeat-x;',
      'Repeat the background image only horizontally.',
    ],
    [
      '.bg-repeat-y',
      'background-repeat: repeat-y;',
      'Repeat the background image only vertically.',
    ],
  ]
])

## Customizing

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'background repeat',
        'property' => 'backgroundRepeat',
    ],
    'variants' => [
        'responsive',
    ],
])
