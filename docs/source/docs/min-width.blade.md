---
extends: _layouts.documentation
title: "Min-Width"
description: "Utilities for setting the minimum width of an element"
features:
  responsive: true
  customizable: true
  hover: false
  focus: false
---

@include('_partials.work-in-progress')

@include('_partials.class-table', [
  'rows' => [
    [
      '.min-w-0',
      'min-width: 0;',
      "Set the element's minimum width to <code>0</code>.",
    ],
    [
      '.min-w-full',
      'min-width: 100%;',
      "Set the element's minimum width to <code>100%</code>.",
    ],
  ]
])
