---
extends: _layouts.documentation
title: "Floats"
description: "Utilities for controlling the wrapping of content around an element."
features:
  responsive: true
  customizable: false
  hover: false
  focus: false
---

@include('_partials.class-table', [
  'rows' => [
    [
      '.float-right',
      'float: right;',
      "Moves the element to the right side of its container.",
    ],
    [
      '.float-left',
      'float: left;',
      "Moves the element to the left side of its container.",
    ],
    [
      '.float-none',
      'float: none;',
      "Removes any previously defined float value.",
    ],
    [
      '.clearfix',
      "&amp;::after {\n&nbsp;&nbsp;content: \"\";\n&nbsp;&nbsp;display: table;\n&nbsp;&nbsp;clear: both;\n}",
      "Clear any floats within an element.",
    ],
  ]
])

## Float right

Use `.float-right` to float an element to the right of its container.

@component('_partials.code-sample')
<div class="clearfix bg-gray-200 p-4">
  <div class="float-right text-gray-700 text-center bg-gray-400 px-4 py-2 ml-2">1</div>
  <div class="float-right text-gray-700 text-center bg-gray-400 px-4 py-2 ml-2">2</div>
  <div class="float-right text-gray-700 text-center bg-gray-400 px-4 py-2">3</div>
</div>
@endcomponent

## Float left

Use `.float-left` to float an element to the left of its container.

@component('_partials.code-sample')
<div class="clearfix bg-gray-200 p-4">
  <div class="float-left text-gray-700 text-center bg-gray-400 px-4 py-2 mr-2">1</div>
  <div class="float-left text-gray-700 text-center bg-gray-400 px-4 py-2 mr-2">2</div>
  <div class="float-left text-gray-700 text-center bg-gray-400 px-4 py-2">3</div>
</div>
@endcomponent

## Don't float

Use `.float-none` to reset any floats that are applied to an element. This is the default value for the float property.

## Clearfix

Use `.clearfix` to force an element to self-clear its children.

@component('_partials.code-sample')
<div class="clearfix mb-6">
  <p class="text-sm text-gray-600">Without clearfix</p>
  <div class="bg-gray-200 p-4">
    <div class="float-left text-gray-700 text-center bg-gray-400 px-4 py-2 mr-2">1</div>
    <div class="float-left text-gray-700 text-center bg-gray-400 px-4 py-2 mr-2">2</div>
    <div class="float-left text-gray-700 text-center bg-gray-400 px-4 py-2">3</div>
  </div>
</div>
<div>
  <p class="text-sm text-gray-600">With clearfix</p>
  <div class="clearfix bg-gray-200 p-4">
    <div class="float-left text-gray-700 text-center bg-gray-400 px-4 py-2 mr-2">1</div>
    <div class="float-left text-gray-700 text-center bg-gray-400 px-4 py-2 mr-2">2</div>
    <div class="float-left text-gray-700 text-center bg-gray-400 px-4 py-2">3</div>
  </div>
</div>
@slot('code')
<div class="bg-gray-200 p-4">
  <div class="float-left bg-gray-400 px-4 py-2 mr-2">1</div>
  <div class="float-left bg-gray-400 px-4 py-2 mr-2">2</div>
  <div class="float-left bg-gray-400 px-4 py-2">3</div>
</div>

<div class="clearfix bg-gray-200 p-4">
  <div class="float-left bg-gray-400 px-4 py-2 mr-2">1</div>
  <div class="float-left bg-gray-400 px-4 py-2 mr-2">2</div>
  <div class="float-left bg-gray-400 px-4 py-2">3</div>
</div>
@endslot
@endcomponent

## Responsive

To control the float of an element at a specific breakpoint, add a `{screen}:` prefix to any existing float utility class. For example, use `md:float-left` to apply the `float-left` utility at only medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

@component('_partials.responsive-code-sample')
@slot('none')
<div class="clearfix bg-gray-200 p-2">
  <div class="float-left text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">1</div>
  <div class="float-left text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">2</div>
  <div class="float-left text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">3</div>
</div>
@endslot
@slot('sm')
<div class="clearfix bg-gray-200 p-2">
  <div class="float-right text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">1</div>
  <div class="float-right text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">2</div>
  <div class="float-right text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">3</div>
</div>
@endslot
@slot('md')
<div class="clearfix bg-gray-200 p-2">
  <div class="float-none text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">1</div>
  <div class="float-none text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">2</div>
  <div class="float-none text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">3</div>
</div>
@endslot
@slot('lg')
<div class="clearfix bg-gray-200 p-2">
  <div class="float-left text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">1</div>
  <div class="float-left text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">2</div>
  <div class="float-left text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">3</div>
</div>
@endslot
@slot('xl')
<div class="clearfix bg-gray-200 p-2">
  <div class="float-right text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">1</div>
  <div class="float-right text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">2</div>
  <div class="float-right text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">3</div>
</div>
@endslot
@slot('code')
<div class="clearfix bg-gray-200 p-2">
  <div class="none:float-left sm:float-right md:float-none lg:float-left xl:float-right">1</div>
  <!-- ... -->
</div>
@endslot
@endcomponent

## Customizing

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'float',
        'property' => 'float',
    ],
    'variants' => [
        'responsive',
    ],
])
