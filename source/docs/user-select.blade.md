---
extends: _layouts.documentation
title: "User Select"
description: "Utilities for controlling whether the user can select text in an element."
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
      '.select-none',
      'user-select: none;',
      "Disable selecting text in an element.",
    ],
    [
      '.select-text',
      'user-select: text;',
      "Allow selecting text in an element.",
    ],
  ]
])

## Customizing

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'user-select',
        'property' => 'userSelect',
    ],
    'variants' => [
        'responsive',
    ],
])
