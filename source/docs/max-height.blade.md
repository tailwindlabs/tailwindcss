---
extends: _layouts.documentation
title: "Max-Height"
description: "Utilities for setting the maximum height of an element"
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
      '.max-h-full',
      'max-height: 100%;',
      "Set the element's maximum height to 100%.",
    ],
    [
      '.max-h-screen',
      'max-height: 100vh;',
      "Set the element's maximum height to 100vh.",
    ],
  ]
])

## Usage

Set the maximum height of an element using the `max-h-full` or `max-h-screen` utilities.

@component('_partials.code-sample')
<div class="h-24 p-6 bg-gray-300">
  <div class="h-48 max-h-full p-6 bg-gray-400 flex items-center justify-center">
    <span>max-h-full</span>
  </div>
</div>
@slot('code')
<div class="h-24 ...">
  <div class="h-48 max-h-full ...">
    max-h-full
  </div>
</div>
@endslot
@endcomponent

---

## Responsive

To control the max-height of an element at a specific breakpoint, add a `{screen}:` prefix to any existing max-height utility.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

@component('_partials.responsive-code-sample')
@slot('none')
<div class="h-24 p-6 bg-gray-300">
  <div class="h-48 max-h-full p-6 bg-gray-400 flex items-center justify-center">
    <span>Target</span>
  </div>
</div>
@endslot
@slot('sm')
<div class="h-24 p-6 bg-gray-300">
  <div class="h-48 max-h-screen p-6 bg-gray-400 flex items-center justify-center">
    <span>Target</span>
  </div>
</div>
@endslot
@slot('md')
<div class="h-24 p-6 bg-gray-300">
  <div class="h-48 max-h-full p-6 bg-gray-400 flex items-center justify-center">
    <span>Target</span>
  </div>
</div>
@endslot
@slot('lg')
<div class="h-24 p-6 bg-gray-300">
  <div class="h-48 max-h-screen p-6 bg-gray-400 flex items-center justify-center">
    <span>Target</span>
  </div>
</div>
@endslot
@slot('xl')
<div class="h-24 p-6 bg-gray-300">
  <div class="h-48 max-h-full p-6 bg-gray-400 flex items-center justify-center">
    <span>Target</span>
  </div>
</div>
@endslot
@slot('code')
<div class="h-24 ...">
  <div class="h-48 none:max-h-full sm:max-h-screen md:max-h-full lg:max-h-screen xl:max-h-full ...">
    <span>Target</span>
  </div>
</div>
@endslot
@endcomponent

---

## Customizing

### Max-height scale

Customize Tailwind's default max-height scale in the `theme.maxHeight` section of your `tailwind.config.js` file.

@component('_partials.customized-config', ['key' => 'theme.maxHeight'])
+ '0': '0',
+ '1/4': '25%',
+ '1/2': '50%',
+ '3/4': '75%',
+ 'full': '100%',
@endcomponent

Learn more about customizing the default theme in the [theme customization documentation](/docs/theme#customizing-the-default-theme).

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'max-height',
        'property' => 'maxHeight',
    ],
    'variants' => [
        'responsive',
    ],
])
