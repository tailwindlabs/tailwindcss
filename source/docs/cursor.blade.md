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
      '.cursor-text',
      'cursor: text;',
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

## Auto <span class="ml-2 font-semibold text-gray-600 text-sm uppercase tracking-wide">Default</span>

Use `.cursor-auto` to allow the browser to change the cursor based on the current content (e.g. automatically change to `text` cursor when hovering over text).

@component('_partials.code-sample', ['class' => 'text-center'])
<div class="cursor-auto max-w-xs p-2 bg-gray-200 mx-auto">
  Hover over this text
</div>
@slot('code')
<div class="cursor-auto ...">
  Hover over this text
</div>
@endslot
@endcomponent

## Default

Use `.cursor-default` to change the mouse cursor to always use the platform-dependent default cursor (usually an arrow).

@component('_partials.code-sample', ['class' => 'text-center'])
<div class="cursor-default max-w-xs p-2 bg-gray-200 mx-auto">
  Hover over this text
</div>
@slot('code')
<div class="cursor-default ...">
  Hover over this text
</div>
@endslot
@endcomponent

## Pointer

Use `.cursor-pointer` to change the mouse cursor to indicate an interactive element (usually a pointing hand).

@component('_partials.code-sample', ['class' => 'text-center'])
<div class="cursor-pointer max-w-xs p-2 bg-gray-200 mx-auto">
  Hover me
</div>
@slot('code')
<div class="cursor-pointer ...">
  Hover me
</div>
@endslot
@endcomponent

## Pointer

Use `.cursor-wait` to change the mouse cursor to indicate something is happening in the background (usually an hourglass or watch).

@component('_partials.code-sample', ['class' => 'text-center'])
<div class="cursor-wait max-w-xs p-2 bg-gray-200 mx-auto">
  Hover me
</div>
@slot('code')
<div class="cursor-wait ...">
  Hover me
</div>
@endslot
@endcomponent

## Text

Use `.cursor-text` to change the mouse cursor to indicate the text can be selected (usually an I-beam shape).

@component('_partials.code-sample', ['class' => 'text-center'])
<div class="cursor-text max-w-xs p-2 bg-gray-200 mx-auto">
  Hover me
</div>
@slot('code')
<div class="cursor-text ...">
  Hover me
</div>
@endslot
@endcomponent

## Move

Use `.cursor-move` to change the mouse cursor to indicate something that can be moved.

@component('_partials.code-sample', ['class' => 'text-center'])
<div class="cursor-move max-w-xs p-2 bg-gray-200 mx-auto">
  Hover me
</div>
@slot('code')
<div class="cursor-move ...">
  Hover me
</div>
@endslot
@endcomponent

## Not Allowed

Use `.cursor-not-allowed` to change the mouse cursor to indicate something can not be interacted with or clicked.

@component('_partials.code-sample', ['class' => 'text-center'])
<div class="cursor-not-allowed max-w-xs p-2 bg-gray-200 mx-auto">
  Hover me
</div>
@slot('code')
<div class="cursor-not-allowed ...">
  Hover me
</div>
@endslot
@endcomponent

## Customizing

### Cursors

By default Tailwind provides six `cursor` utilities. You change, add, or remove these by editing the `theme.cursor` section of your Tailwind config.

@component('_partials.customized-config', ['key' => 'theme.cursor'])
  auto: 'auto',
  default: 'default',
  pointer: 'pointer',
- wait: 'wait',
  text: 'text',
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
