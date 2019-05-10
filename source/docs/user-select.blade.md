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
      '.select-none',
      'user-select: none;',
      "Disable selecting text in an element.",
    ],
    [
      '.select-text',
      'user-select: text;',
      "Allow selecting text in an element.",
    ],
  ]
])

## Disabling text selection

Use `.select-none` to prevent selecting text in an element and its children.

@component('_partials.code-sample', ['class' => 'text-center'])
<div class="mx-auto max-w-sm bg-gray-200 p-2 select-none">
  This text is not selectable
</div>
@slot('code')
<div class="... select-none">
  This text is not selectable
</div>
@endslot
@endcomponent

## Allowing text selection

Use `.select-text` to allow selecting text in an element and its children.

@component('_partials.code-sample', ['class' => 'text-center'])
<div class="mx-auto max-w-sm bg-gray-200 p-2 select-text">
  This text is selectable
</div>
@slot('code')
<div class="... select-text">
  This text is selectable
</div>
@endslot
@endcomponent

## Customizing

### User select values

By default Tailwind provides two `user-select` utilities. You can change, add, or remove these by editing the `theme.userSelect` section of your Tailwind config.

@component('_partials.customized-config', ['key' => 'theme.userSelect'])
+ all: 'all',
+ auto: 'auto',
- none: 'none',
  text: 'text',
@endcomponent

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'user-select',
        'property' => 'userSelect',
    ],
    'variants' => [
        'responsive',
    ],
])
