---
extends: _layouts.documentation
title: "Display"
description: "Utilities for controlling the display box type of an element."
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
      '.block',
      'display: block;',
      "Set the box type of the element to <code>block</code>.",
    ],
    [
      '.inline-block',
      'display: inline-block;',
      "Set the box type of the element to <code>inline-block</code>.",
    ],
    [
      '.inline',
      'display: inline;',
      "Set the box type of the element to <code>inline</code>.",
    ],
    [
      '.table',
      'display: table;',
      "Set the box type of the element to <code>table</code>.",
    ],
    [
      '.table-row',
      'display: table-row;',
      "Set the box type of the element to <code>table-row</code>.",
    ],
    [
      '.table-cell',
      'display: table-cell;',
      "Set the box type of the element to <code>table-cell</code>.",
    ],
    [
      '.hidden',
      'display: none;',
      "Set the box type of the element to <code>none</code>.",
    ],
    [
      '.flex',
      'display: flex;',
      "Set the box type of the element to <code>flex</code>.",
    ],
    [
      '.inline-flex',
      'display: inline-flex;',
      "Set the box type of the element to <code>inline-flex</code>.",
    ],
  ]
])

## Customizing

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'display',
        'property' => 'display',
    ],
    'variants' => [
        'responsive',
    ],
])
