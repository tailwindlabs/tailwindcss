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

@component('_partials.code-sample', ['class' => 'text-center'])
<table class="table-fixed border-collapse border-4 border-red-400">
  <thead>
    <tr>
      <th class="border border-blue-400 px-4">State</th>
      <th class="border border-blue-400 px-4">City</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="border border-blue-400 px-4">Indiana</td>
      <td class="border border-blue-400 px-4">Indianapolis</td>
    </tr>
    <tr>
      <td class="border border-blue-400 px-4">Ohio</td>
      <td class="border border-blue-400 px-4">Columbus</td>
    </tr>
    <tr>
      <td class="border border-blue-400 px-4">Michigan</td>
      <td class="border border-blue-400 px-4">Detroit</td>
    </tr>
  <tbody>
</table>
@slot('code')
<table class="table-fixed border-collapse border-4 border-red-400">
  <thead>
    <tr>
      <th class="border border-blue-400 px-4">State</th>
      <th class="border border-blue-400 px-4">City</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="border border-blue-400 px-4">Indiana</td>
      <td class="border border-blue-400 px-4">Indianapolis</td>
    </tr>
    <tr>
      <td class="border border-blue-400 px-4">Ohio</td>
      <td class="border border-blue-400 px-4">Columbus</td>
    </tr>
    <tr>
      <td class="border border-blue-400 px-4">Michigan</td>
      <td class="border border-blue-400 px-4">Detroit</td>
    </tr>
  <tbody>
</table>
@endslot
@endcomponent

## Separate

Use `.border-separate` to force each cell to display its own separate borders.

@component('_partials.code-sample', ['class' => 'text-center'])
<table class="table-fixed border-separate border-4 border-red-400">
  <thead>
    <tr>
      <th class="border border-blue-400 px-4">State</th>
      <th class="border border-blue-400 px-4">City</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="border border-blue-400 px-4">Indiana</td>
      <td class="border border-blue-400 px-4">Indianapolis</td>
    </tr>
    <tr>
      <td class="border border-blue-400 px-4">Ohio</td>
      <td class="border border-blue-400 px-4">Columbus</td>
    </tr>
    <tr>
      <td class="border border-blue-400 px-4">Michigan</td>
      <td class="border border-blue-400 px-4">Detroit</td>
    </tr>
  <tbody>
</table>
@slot('code')
<table class="table-fixed border-separate border-4 border-red-400">
  <thead>
    <tr>
      <th class="border border-blue-400 px-4">State</th>
      <th class="border border-blue-400 px-4">City</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="border border-blue-400 px-4">Indiana</td>
      <td class="border border-blue-400 px-4">Indianapolis</td>
    </tr>
    <tr>
      <td class="border border-blue-400 px-4">Ohio</td>
      <td class="border border-blue-400 px-4">Columbus</td>
    </tr>
    <tr>
      <td class="border border-blue-400 px-4">Michigan</td>
      <td class="border border-blue-400 px-4">Detroit</td>
    </tr>
  <tbody>
</table>
@endslot
@endcomponent


## Customizing

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'border collapse',
        'property' => 'borderCollapse',
    ],
    'variants' => ['responsive'],
])
