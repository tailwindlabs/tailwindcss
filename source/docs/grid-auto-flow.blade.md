---
extends: _layouts.documentation
title: "Grid Auto Flow"
description: "Utilities for controlling how elements in a grid are auto-placed."
featureVersion: "v1.2.0+"
---

@include('_partials.class-table', [
  'rows' => [
    [
      '.grid-flow-row',
      'grid-auto-flow: row;',
    ],
    [
      '.grid-flow-col',
      'grid-auto-flow: column;',
    ],
    [
      '.grid-flow-row-dense',
      'grid-auto-flow: row dense;',
    ],
    [
      '.grid-flow-col-dense',
      'grid-auto-flow: column dense;',
    ],
  ]
])

## Usage

Use the `grid-flow-{keyword}` utilities to control how the auto-placement algorithm works for a grid layout.

@component('_partials.code-sample', ['class' => 'bg-white p-8'])
<div class="grid grid-cols-3 grid-rows-3 grid-flow-col gap-4">
  <div class="bg-gray-300 h-12 flex items-center justify-center">1</div>
  <div class="bg-gray-500 h-12 flex items-center justify-center">2</div>
  <div class="bg-gray-300 h-12 flex items-center justify-center">3</div>
  <div class="bg-gray-500 h-12 flex items-center justify-center">4</div>
  <div class="bg-gray-300 h-12 flex items-center justify-center">5</div>
  <div class="bg-gray-500 h-12 flex items-center justify-center">6</div>
  <div class="bg-gray-300 h-12 flex items-center justify-center">7</div>
  <div class="bg-gray-500 h-12 flex items-center justify-center">8</div>
  <div class="bg-gray-300 h-12 flex items-center justify-center">9</div>
</div>
@slot('code')
<div class="grid grid-flow-col grid-cols-3 grid-rows-3 gap-4">
  <div>1</div>
  <!-- ... -->
  <div>9</div>
</div>
@endslot
@endcomponent

## Responsive

To control the grid-auto-flow property at a specific breakpoint, add a `{screen}:` prefix to any existing grid-auto-flow utility. For example, use `md:grid-flow-col` to apply the `grid-flow-col` utility at only medium screen sizes and above.

```html
<div class="grid grid-flow-col sm:grid-flow-row md:grid-flow-col-dense lg:grid-flow-row-dense xl:grid-flow-col ...">
  <div>1</div>
  <!-- ... -->
  <div>9</div>
</div>
```

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

## Customizing

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'grid-auto-flow',
        'property' => 'gridAutoFlow',
    ],
    'variants' => ['responsive'],
])
