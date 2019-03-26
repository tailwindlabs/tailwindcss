---
extends: _layouts.documentation
title: "Floats"
description: "Utilities for controlling the wrapping of content around an element."
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
      '.float-right',
      'float: right;',
      "Moves the element to the right side of its container.",
    ],
    [
      '.float-left',
      'float: left;',
      "Moves the element to the left side of its container.",
    ],
    [
      '.float-none',
      'float: none;',
      "Removes any previously defined float value.",
    ],
    [
      '.clearfix',
      "&amp;::after {\n&nbsp;&nbsp;content: \"\";\n&nbsp;&nbsp;display: table;\n&nbsp;&nbsp;clear: both;\n}",
      "Clear any floats within an element.",
    ],
  ]
])

## Customizing

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'float',
        'property' => 'float',
    ],
    'variants' => [
        'responsive',
    ],
])
