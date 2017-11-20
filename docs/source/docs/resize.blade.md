---
extends: _layouts.documentation
title: "Resize"
description: "Utilities for controlling the how a textarea can be resized."
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
      "Make a textarea not resizable.",
    ],
    [
      '.resize-y',
      'resize: vertical;',
      "Make a textarea resizable vertically.",
    ],
    [
      '.resize-x',
      'resize: horizontal;',
      "Make a textarea resizable horizontally.",
    ],
  ]
])
