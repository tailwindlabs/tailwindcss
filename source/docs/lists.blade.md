---
extends: _layouts.documentation
title: "Lists"
description: "Utilities for controlling list styles."
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
      '.list-reset',
      "list-style: none;\npadding: 0;",
      "Disable default browser styling for lists and list items.",
    ],
  ]
])

## Customizing

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'list',
        'property' => 'lists',
    ],
    'variants' => [
        'responsive',
    ],
])
