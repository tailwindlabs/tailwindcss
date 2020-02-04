---
extends: _layouts.documentation
title: "Box Sizing"
description: "Utilities for controlling the box sizing model."
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
      '.box-border',
      'box-sizing: border-box;',
    ],
    [
      '.box-content',
      'box-sizing: content-box;',
    ],
  ]
])
