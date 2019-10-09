---
extends: _layouts.documentation
title: "Table Layout"
description: "Utilities for controlling the table layout algorithm."
features:
  responsive: true
  customizable: false
  hover: false
  focus: false
---

@include('_partials.class-table', [
  'rows' => [
    [
      '.table-auto',
      'table-layout: auto;',
      "Use an automatic table layout algorithm.",
    ],
    [
      '.table-fixed',
      'table-layout: fixed;',
      "Sets a fixed table layout algorithm.",
    ],
  ]
])

## Auto

Use `.table-auto` to allow the table to automatically size columns to fit the contents of the cell.

@component('_partials.code-sample', ['class' => 'text-center'])
<table class="table-auto">
  <thead>
    <tr>
      <th>Title</th>
      <th>Author</th>
      <th>Views</th>
      <th>Shares</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="border">Intro to CSS</td>
      <td class="border">Adam</td>
      <td class="border">858</td>
      <td class="border">64</td>
    </tr>
    <tr class="bg-gray-200">
      <td class="border">A Long and Winding Tour of the History of UI Frameworks and Tools and the Impact on Design</td>
      <td class="border">Adam</td>
      <td class="border">112</td>
      <td class="border">7</td>
    </tr>
    <tr>
      <td class="border">Into to JavaScript</td>
      <td class="border">Chris</td>
      <td class="border">1,280,223</td>
      <td class="border">315,584</td>
    </tr>
  </tbody>
</table>
@slot('code')
<table class="table-auto">
  <thead>
    <tr>
      <th>Title</th>
      <th>Author</th>
      <th>Views</th>
      <th>Shares</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="border">Intro to CSS</td>
      <td class="border">Adam</td>
      <td class="border">858</td>
      <td class="border">64</td>
    </tr>
    <tr class="bg-gray-200">
      <td class="border">A Long and Winding Tour of the History of UI Frameworks and Tools and the Impact on Design</td>
      <td class="border">Adam</td>
      <td class="border">112</td>
      <td class="border">7</td>
    </tr>
    <tr>
      <td class="border">Into to JavaScript</td>
      <td class="border">Chris</td>
      <td class="border">1,280,223</td>
      <td class="border">315,584</td>
    </tr>
  </tbody>
</table>
@endslot
@endcomponent

## Fixed

Use `.table-fixed` to allow the table to ignore the content and use fixed widths for columns. The width of the first row will set the column widths for the whole table.

You can manually set the widths for some columns and the rest of the available width will be divided evenly amongst the columns without explicit width.

@component('_partials.code-sample', ['class' => 'text-center'])
<table class="table-fixed">
  <thead>
    <tr>
      <th class="w-1/2">Title</th>
      <th class="w-40">Author</th>
      <th>Views</th>
      <th>Shares</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="border">Intro to CSS</td>
      <td class="border">Adam</td>
      <td class="border">858</td>
      <td class="border">64</td>
    </tr>
    <tr class="bg-gray-200">
      <td class="border">A Long and Winding Tour of the History of UI Frameworks and Tools and the Impact on Design</td>
      <td class="border">Adam</td>
      <td class="border">112</td>
      <td class="border">7</td>
    </tr>
    <tr>
      <td class="border">Into to JavaScript</td>
      <td class="border">Chris</td>
      <td class="border">1,280,223</td>
      <td class="border">315,584</td>
    </tr>
  </tbody>
</table>
@slot('code')
<table class="table-fixed">
  <thead>
    <tr>
      <th class="w-1/2">Title</th>
      <th class="w-40">Author</th>
      <th>Views</th>
      <th>Shares</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="border">Intro to CSS</td>
      <td class="border">Adam</td>
      <td class="border">858</td>
      <td class="border">64</td>
    </tr>
    <tr class="bg-gray-200">
      <td class="border">A Long and Winding Tour of the History of UI Frameworks and Tools and the Impact on Design</td>
      <td class="border">Adam</td>
      <td class="border">112</td>
      <td class="border">7</td>
    </tr>
    <tr>
      <td class="border">Into to JavaScript</td>
      <td class="border">Chris</td>
      <td class="border">1,280,223</td>
      <td class="border">315,584</td>
    </tr>
  </tbody>
</table>
@endslot
@endcomponent

## Customizing

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'table layout',
        'property' => 'tableLayout',
    ],
    'variants' => [
        'responsive',
    ],
])
