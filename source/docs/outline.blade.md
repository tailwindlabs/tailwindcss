---
extends: _layouts.documentation
title: "Outline"
description: "Utilities for controlling an element's outline."
---

@include('_partials.work-in-progress')

@include('_partials.class-table', [
  'rows' => [
    [
      '.outline-none',
      'outline: 0;',
      "Remove an element's outline.",
    ],
  ]
])


## Customizing

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'outline',
        'property' => 'outline',
    ],
    'variants' => ['focus'],
])
