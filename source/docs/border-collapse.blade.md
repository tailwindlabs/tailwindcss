---
extends: _layouts.documentation
title: "Border Collapse"
description: "Utilities for controlling whether table borders should collapse or be separated."
---


@include('_partials.class-table', [
  'rows' => [
    [
      '.border-collapse',
      'border-collapse: collapse;',
      "Collapses the table borders into a single border when possible.",
    ],
    [
      '.border-separate',
      'border-collapse: separate;',
      "Separates the table borders; each cell will display its own borders.",
    ],
  ]
])

## Collapse

Use `.border-collapse` to combine adjacent cell borders into a single border when possible. Note that this includes collapsing borders on the top-level `<table>` tag.

@component('_partials.code-sample')
<table class="border-collapse border-2 border-gray-500">
  <thead>
    <tr>
      <th class="border border-gray-400 px-4 py-2 text-gray-800">State</th>
      <th class="border border-gray-400 px-4 py-2 text-gray-800">City</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="border border-gray-400 px-4 py-2">Indiana</td>
      <td class="border border-gray-400 px-4 py-2">Indianapolis</td>
    </tr>
    <tr>
      <td class="border border-gray-400 px-4 py-2">Ohio</td>
      <td class="border border-gray-400 px-4 py-2">Columbus</td>
    </tr>
    <tr>
      <td class="border border-gray-400 px-4 py-2">Michigan</td>
      <td class="border border-gray-400 px-4 py-2">Detroit</td>
    </tr>
  <tbody>
</table>
@endcomponent

## Separate

Use `.border-separate` to force each cell to display its own separate borders.

@component('_partials.code-sample')
<table class="border-separate border-2 border-gray-500">
  <thead>
    <tr>
      <th class="border border-gray-400 px-4 py-2 text-gray-800">State</th>
      <th class="border border-gray-400 px-4 py-2 text-gray-800">City</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="border border-gray-400 px-4 py-2">Indiana</td>
      <td class="border border-gray-400 px-4 py-2">Indianapolis</td>
    </tr>
    <tr>
      <td class="border border-gray-400 px-4 py-2">Ohio</td>
      <td class="border border-gray-400 px-4 py-2">Columbus</td>
    </tr>
    <tr>
      <td class="border border-gray-400 px-4 py-2">Michigan</td>
      <td class="border border-gray-400 px-4 py-2">Detroit</td>
    </tr>
  <tbody>
</table>
@endcomponent


## Customizing

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'border collapse',
        'property' => 'borderCollapse',
    ],
    'variants' => ['responsive'],
])
