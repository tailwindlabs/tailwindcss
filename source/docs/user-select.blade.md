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

@include('_partials.class-table', [
 'rows' => [
    [
     '.select-auto',
     'user-select: auto;',
     "Default browser behavior",
   ],
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
   [
     '.select-all',
     'user-select: all;',
     "Allow clicking to select all text in an element.",
   ],
 ]
])

## Select Auto <span class="ml-2 font-semibold text-gray-600 text-sm uppercase tracking-wide">Default</span>

Use `.select-auto` to use the default browser behavior for selecting text.

## Select None

Use `.select-none` to prevent selecting text in an element and its children.

@component('_partials.code-sample', ['class' => 'text-center'])
<div class="mx-auto max-w-sm bg-gray-200 p-2 select-none">
  This text is not selectable
</div>
@slot('code')
<div class="select-none ...">
  This text is not selectable
</div>
@endslot
@endcomponent

## Select Text

Use `.select-text` to allow selecting text in an element and its children.

@component('_partials.code-sample', ['class' => 'text-center'])
<div class="mx-auto max-w-sm bg-gray-200 p-2 select-text">
  This text is selectable
</div>
@slot('code')
<div class="select-text ...">
  This text is selectable
</div>
@endslot
@endcomponent

## Select All

Use `.select-all` to allow selecting all text in an element when double-clicking.

@component('_partials.code-sample', ['class' => 'text-center'])
<div class="mx-auto max-w-sm bg-gray-200 p-2 select-all">
  Click anywhere in this text to select it all
</div>
@slot('code')
<div class="select-all ...">
  Click anywhere in this text to select it all
</div>
@endslot
@endcomponent

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
