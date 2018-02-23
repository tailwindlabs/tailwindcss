---
extends: _layouts.documentation
title: "Appearance"
description: "Utilities for suppressing native form control styling."
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
      '.appearance-none',
      'appearance: none;',
      "Remove any special styling applied to an element by the browser.",
    ],
  ]
])

## Customizing

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'appearance',
        'property' => 'appearance',
    ],
    'variants' => [
        'responsive',
    ],
])
