---
extends: _layouts.documentation
title: "Min-Height"
description: "Utilities for setting the minimum height of an element"
features:
  responsive: true
  customizable: true
  hover: false
  focus: false
---

@include('_partials.class-table', [
  'scroll' => false,
  'rows' => [
    [
      '.min-h-0',
      'min-height: 0;',
      "Set the element's minimum height to 0.",
    ],
    [
      '.min-h-full',
      'min-height: 100%;',
      "Set the element's minimum height to 100%.",
    ],
    [
      '.min-h-screen',
      'min-height: 100vh;',
      "Set the element's minimum height to 100vh.",
    ],
  ]
])

## Usage

Set the minimum height of an element using the `min-h-0`, `min-h-full`, or `min-h-screen` utilities.

@component('_partials.code-sample')
<div class="h-48 p-6 bg-gray-300">
  <div class="h-24 min-h-full p-6 bg-gray-400 flex items-center justify-center">
    <span>min-h-full</span>
  </div>
</div>
@slot('code')
<div class="h-48 ...">
  <div class="h-24 min-h-full ...">
    min-h-full
  </div>
</div>
@endslot
@endcomponent

---

## Responsive

To control the min-width of an element at a specific breakpoint, add a `{screen}:` prefix to any existing min-width utility.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

@component('_partials.responsive-code-sample')
@slot('none')
<div class="h-48 p-6 bg-gray-300">
  <div class="h-24 min-h-full p-6 bg-gray-400 flex items-center justify-center">
    <span>Target</span>
  </div>
</div>
@endslot
@slot('sm')
<div class="h-48 p-6 bg-gray-300">
  <div class="h-24 min-h-0 p-6 bg-gray-400 flex items-center justify-center">
    <span>Target</span>
  </div>
</div>
@endslot
@slot('md')
<div class="h-48 p-6 bg-gray-300">
  <div class="h-24 min-h-full p-6 bg-gray-400 flex items-center justify-center">
    <span>Target</span>
  </div>
</div>
@endslot
@slot('lg')
<div class="h-48 p-6 bg-gray-300">
  <div class="h-24 min-h-0 p-6 bg-gray-400 flex items-center justify-center">
    <span>Target</span>
  </div>
</div>
@endslot
@slot('xl')
<div class="h-48 p-6 bg-gray-300">
  <div class="h-24 min-h-full p-6 bg-gray-400 flex items-center justify-center">
    <span>Target</span>
  </div>
</div>
@endslot
@slot('code')
<div class="h-48 ...">
  <div class="h-24 none:min-h-full sm:min-h-0 md:min-h-full lg:min-h-0 xl:min-h-full ...">
    min-h-full
  </div>
</div>
@endslot
@endcomponent

---

## Customizing

### Min-height scale

Customize Tailwind's default min-height scale in the `theme.minHeight` section of your `tailwind.config.js` file.

@component('_partials.customized-config', ['key' => 'theme.minHeight'])
+ '0': '0',
+ '1/4': '25%',
+ '1/2': '50%',
+ '3/4': '75%',
+ 'full': '100%',
@endcomponent

Learn more about customizing the default theme in the [theme customization documentation](/docs/theme#customizing-the-default-theme).

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'min-height',
        'property' => 'minHeight',
    ],
    'variants' => [
        'responsive',
    ],
])
