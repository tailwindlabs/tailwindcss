---
extends: _layouts.documentation
title: "Resize"
description: "Utilities for controlling how an element can be resized."
---

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

## Resize in all directions

Use `.resize` to make an element horizontally and vertically resizable.

@component('_partials.code-sample')
<textarea class="resize border rounded focus:outline-none focus:shadow-outline"></textarea>
@endcomponent

## Resize vertically

Use `.resize-y` to make an element vertically resizable.

@component('_partials.code-sample')
<textarea class="resize-y border rounded focus:outline-none focus:shadow-outline"></textarea>
@endcomponent

## Resize horizontally

Use `.resize-x` to make an element horizontally resizable.

@component('_partials.code-sample')
<textarea class="resize-x border rounded focus:outline-none focus:shadow-outline"></textarea>
@endcomponent

## Prevent resizing

Use `.resize-none` to prevent an element from being resizable.

@component('_partials.code-sample')
<textarea class="resize-none border rounded focus:outline-none focus:shadow-outline"></textarea>
@endcomponent

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
