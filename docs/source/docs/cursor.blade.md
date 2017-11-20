---
extends: _layouts.documentation
title: "Cursor"
description: "Utilities for controlling the cursor style when hovering over an element."
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
      '.cursor-auto',
      'cursor: auto;',
      "Set the mouse cursor to the default browser behavior.",
    ],
    [
      '.cursor-pointer',
      'cursor: pointer;',
      "Set the mouse cursor to a pointer and indicate a link.",
    ],
    [
      '.cursor-not-allowed',
      'cursor: not-allowed;',
      "Set the mouse cursor to indicate that the action will not be executed.",
    ],
  ]
])
