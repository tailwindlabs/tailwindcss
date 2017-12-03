---
extends: _layouts.documentation
title: "Background Position"
description: "Utilities for controlling the position of an element's background image."
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
      '.bg-bottom',
      'background-position: bottom;',
      'Place the background image on the bottom edge.',
    ],
    [
      '.bg-center',
      'background-position: center;',
      'Place the background image in the center.',
    ],
    [
      '.bg-left',
      'background-position: left;',
      'Place the background image on the left edge.',
    ],
    [
      '.bg-left-bottom',
      'background-position: left bottom;',
      'Place the background image on the left bottom edge.',
    ],
    [
      '.bg-left-top',
      'background-position: left top;',
      'Place the background image on the left top edge.',
    ],
    [
      '.bg-right',
      'background-position: right;',
      'Place the background image on the right edge.',
    ],
    [
      '.bg-right-bottom',
      'background-position: right bottom;',
      'Place the background image on the right bottom edge.',
    ],
    [
      '.bg-right-top',
      'background-position: right top;',
      'Place the background image on the right top edge.',
    ],
    [
      '.bg-top',
      'background-position: top;',
      'Place the background image on the top edge.',
    ],
  ]
])

## Customizing

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'background position',
        'property' => 'backgroundPosition',
    ],
    'variants' => [
        'responsive',
    ],
])
