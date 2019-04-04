---
extends: _layouts.documentation
title: "Cursor"
description: "Utilities for controlling the cursor style when hovering over an element."
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
      '.cursor-auto',
      'cursor: auto;',
      "Set the mouse cursor based on the context.",
    ],
    [
      '.cursor-default',
      'cursor: default;',
      "Set the mouse cursor to the default arrow cursor.",
    ],
    [
      '.cursor-pointer',
      'cursor: pointer;',
      "Set the mouse cursor to a pointer to indicate a link.",
    ],
    [
      '.cursor-wait',
      'cursor: wait;',
      "Set the mouse cursor to indicate that the application is busy.",
    ],
    [
      '.cursor-move',
      'cursor: move;',
      "Set the mouse cursor to indicate that the element can be moved.",
    ],
    [
      '.cursor-not-allowed',
      'cursor: not-allowed;',
      "Set the mouse cursor to indicate that the action will not be executed.",
    ],
  ]
])

## Customizing

### Cursors

By default Tailwind provides six `cursor` utilities. You change, add, or remove these by editing the `theme.cursor` section of your Tailwind config.

@component('_partials.customized-config', ['key' => 'theme.cursor'])
  auto: 'auto',
  default: 'default',
  pointer: 'pointer',
- wait: 'wait',
- move: 'move',
  'not-allowed': 'not-allowed',
+ crosshair: 'crosshair',
+ 'zoom-in': 'zoom-in',
@endcomponent

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'cursor',
        'property' => 'cursor',
    ],
    'variants' => [
        'responsive',
    ],
])
