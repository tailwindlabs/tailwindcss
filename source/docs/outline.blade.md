---
extends: _layouts.documentation
title: "Outline"
description: "Utilities for controlling an element's outline."
---

@include('_partials.class-table', [
  'rows' => [
    [
      '.outline-none',
      'outline: 0;',
      "Remove an element's outline.",
    ],
  ]
])

## Usage

Use `.outline-none` to remove browser specific outlining of focused elements.

It is highly recommended to apply your own focus styling for accessibility when using this utility.

@component('_partials.code-sample', ['class' => 'text-center bg-gray-200'])
<input type="text" class="px-2 m-2" placeholder="Focus me" />
<input type="text" class="px-2 m-2 outline-none" placeholder="Focus me (no outline)" />
<input type="text" class="px-2 m-2 outline-none focus:shadow-outline focus:bg-blue-100" placeholder="Focus me (custom)" />
@slot('code')
<input type="text"
  placeholder="Focus me (no outline)"
  class="outline-none ..." />

<input type="text"
  placeholder="Focus me (custom)"
  class="outline-none focus:shadow-outline focus:bg-blue-100 ..." />
@endslot
@endcomponent

## Customizing

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'outline',
        'property' => 'outline',
    ],
    'variants' => ['focus'],
])
