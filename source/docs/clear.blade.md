---
extends: _layouts.documentation
title: "Clear"
description: "Utilities for controlling the wrapping of content around an element."
features:
  responsive: true
  customizable: false
  hover: false
  focus: false
---

@include('_partials.work-in-progress')

@include('_partials.class-table', [
  'rows' => [
    [
      '.clear-left',
      'clear: left;',
      "Moves the element below the floating elements on the left side.",
    ],
    [
      '.clear-right',
      'clear: right;',
      "Moves the element below the floating elements on the right side.",
    ],
    [
      '.clear-both',
      'clear: both;',
      "Moves the element below the floating elements on either side.",
    ],
    [
      '.clearfix',
      "&amp;::after {\n&nbsp;&nbsp;content: \"\";\n&nbsp;&nbsp;display: table;\n&nbsp;&nbsp;clear: both;\n}",
      "Clear any floats within an element.",
    ],
  ]
])

## Clearfix

Use `.clearfix` to force an element to self-clear its children.

@component('_partials.code-sample')
<div class="clearfix mb-6">
  <p class="text-sm text-gray-600">Without clearfix</p>
  <div class="bg-gray-200 p-4">
    <img class="float-left mr-4 my-2 h-32" src="https://images.unsplash.com/photo-1459262838948-3e2de6c1ec80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80">
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam venenatis et lorem sit amet vehicula.</p>
  </div>
</div>
<div>
  <p class="text-sm text-gray-600">With clearfix</p>
  <div class="clearfix bg-gray-200 p-4">
    <img class="float-left mr-4 my-2 h-32" src="https://images.unsplash.com/photo-1459262838948-3e2de6c1ec80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80">
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam venenatis et lorem sit amet vehicula.</p>
  </div>
</div>
@slot('code')
<div class="clearfix">
  <img class="float-left mr-4 my-2 h-32" src="https://images.unsplash.com/photo-1459262838948-3e2de6c1ec80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80">
  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam venenatis et lorem sit amet vehicula.</p>
</div>
@endslot
@endcomponent


## Customizing

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'clear',
        'property' => 'clear',
    ],
    'variants' => [
        'responsive',
    ],
])
