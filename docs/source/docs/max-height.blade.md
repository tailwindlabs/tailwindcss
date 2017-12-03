---
extends: _layouts.documentation
title: "Max-Height"
description: "Utilities for setting the maximum height of an element"
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
      '.max-h-full',
      'max-height: 100%;',
      "Set the element's maximum height to 100%.",
    ],
    [
      '.max-h-screen',
      'max-height: 100vh;',
      "Set the element's maximum height to 100vh.",
    ],
  ]
])

## Customizing

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'max-height',
        'property' => 'maxHeight',
    ],
    'variants' => [
        'responsive',
    ],
])
