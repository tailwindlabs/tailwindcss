---
extends: _layouts.documentation
title: "Resize"
description: "Utilities for controlling how an element can be resized."
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
      '.resize-none',
      'resize: none;',
      "Make an element not resizable.",
    ],
    [
      '.resize',
      'resize: both;',
      "Make an element resizable along both axes.",
    ],
    [
      '.resize-y',
      'resize: vertical;',
      "Make an element resizable vertically.",
    ],
    [
      '.resize-x',
      'resize: horizontal;',
      "Make an element resizable horizontally.",
    ],
  ]
])

## Customizing

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'resizing',
        'property' => 'resize',
    ],
    'variants' => [
        'responsive',
    ],
])
