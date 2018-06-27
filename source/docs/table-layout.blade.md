---
extends: _layouts.documentation
title: "Table Layout"
description: "Utilities for controlling the table layout algorithm."
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
      '.table-auto',
      'table-layout: auto;',
      "Use an automatic table layout algorithm.",
    ],
    [
      '.table-fixed',
      'table-layout: fixed;',
      "Sets a fixed table layout algorithm.",
    ],
  ]
])


## Customizing

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'table layout',
        'property' => 'tableLayout',
    ],
    'variants' => [
        'responsive',
    ],
])
