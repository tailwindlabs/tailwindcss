---
extends: _layouts.documentation
title: "Appearance"
description: "Utilities for suppressing native form control styling."
features:
  responsive: true
  customizable: false
  hover: false
  focus: false
---

@include('_partials.class-table', [
  'rows' => [
    [
      '.appearance-none',
      'appearance: none;',
      "Remove any special styling applied to an element by the browser.",
    ],
  ]
])

## Usage

Use `.appearance-none` to reset any browser specific styling on an element. This utility is often used when creating [custom Form components](/docs/examples/forms).

@component('_partials.code-sample', ['class' => 'text-center'])
<div class="max-w-sm mx-auto">
  <div class="flex my-4">
    <select class="w-16">
      <option>Yes</option>
      <option>No</option>
      <option>Maybe</option>
    </select>
    <div class="mx-4">
      Default browser styles applied
    </div>
  </div>
  <div class="flex my-4">
    <select class="appearance-none w-16">
      <option>Yes</option>
      <option>No</option>
      <option>Maybe</option>
    </select>
    <div class="mx-4">
      Default styles removed
    </div>
  </div>
</div>
@slot('code')
<select>
  <option>Yes</option>
  <option>No</option>
  <option>Maybe</option>
</select>

<select class="appearance-none">
  <option>Yes</option>
  <option>No</option>
  <option>Maybe</option>
</select>
@endslot
@endcomponent

## Customizing

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'appearance',
        'property' => 'appearance',
    ],
    'variants' => [
        'responsive',
    ],
])
