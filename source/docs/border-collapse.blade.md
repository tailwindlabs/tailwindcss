---
extends: _layouts.documentation
title: "Border Collapse"
description: "Utilities for controlling whether table borders should collapse or be separated."
---

@include('_partials.work-in-progress')

@include('_partials.class-table', [
  'rows' => [
    [
      '.border-collapse',
      'border-collapse: collapse;',
      "Collapses the table borders into a single border when possible.",
    ],
    [
      '.border-separate',
      'border-collapse: separate;',
      "Separates the table borders; each cell will display its own borders.",
    ],
  ]
])


## Customizing

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'border collapse',
        'property' => 'borderCollapse',
    ],
    'variants' => [],
])
