---
extends: _layouts.documentation
title: "Transition Property"
description: "Utilities for controlling the properties that are transitioned in CSS transitions."
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
      'transition-property: all;',
      "Transition all properties.",
    ],
    [
      '.trans-none',
      'transition-property: none;',
      "Transition no properties.",
    ],
    [
      '.trans-bg',
      'transition-property: background;',
      "Transition the element's background.",
    ],
    [
      '.trans-opacity',
      'transition-property: opacity;',
      "Transition the element's opacity.",
    ],
    [
      '.trans-color',
      'transition-property: color;',
      "Transition the element's color.",
    ],
    [
      '.trans-shadow',
      'transition-property: box-shadow;',
      "Transition the element's box shadow.",
    ],
  ]
])

## Customizing

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'transition property',
        'property' => 'transitionProperty',
    ],
    'variants' => [],
])
