---
extends: _layouts.documentation
title: "Min-Width"
description: "Utilities for setting the minimum width of an element"
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
      '.min-w-0',
      'min-width: 0;',
      "Set the element's minimum width to 0.",
    ],
    [
      '.min-w-full',
      'min-width: 100%;',
      "Set the element's minimum width to 100%.",
    ],
  ]
])

## Usage

Set the minimum width of an element using the `min-w-0` or `min-w-full` utilities.

@component('_partials.code-sample')
<div class="w-24 min-w-full text-center p-6 bg-gray-300">
  min-w-full
</div>
@slot('code')
<div class="w-24 min-w-full ...">
  min-w-full
</div>
@endslot
@endcomponent

---

## Responsive

To control the min-width of an element at a specific breakpoint, add a `{screen}:` prefix to any existing min-width utility.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

@component('_partials.responsive-code-sample')
@slot('none')
<div class="w-24 min-w-0 text-center p-6 bg-gray-300">
  Target
</div>
@endslot
@slot('sm')
<div class="w-24 min-w-full text-center p-6 bg-gray-300">
  Target
</div>
@endslot
@slot('md')
<div class="w-24 min-w-0 text-center p-6 bg-gray-300">
  Target
</div>
@endslot
@slot('lg')
<div class="w-24 min-w-full text-center p-6 bg-gray-300">
  Target
</div>
@endslot
@slot('xl')
<div class="w-24 min-w-0 text-center p-6 bg-gray-300">
  Target
</div>
@endslot
@slot('code')
<div class="w-24 none:min-w-0 sm:min-w-full md:min-w-0 lg:min-w-full xl:min-w-0 ...">
  <!-- ... -->
</div>
@endslot
@endcomponent

---

## Customizing

### Min-width scale

To customize Tailwind's default min-width scale, use the `theme.minWidth` section of your `tailwind.config.js` file.

@component('_partials.customized-config', ['key' => 'theme.minWidth'])
+ '0': '0',
+ '1/4': '25%',
+ '1/2': '50%',
+ '3/4': '75%',
+ 'full': '100%',
@endcomponent

Learn more about customizing the default theme in the [theme customization documentation](/docs/theme#customizing-the-default-theme).

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'min-width',
        'property' => 'minWidth',
    ],
    'variants' => [
        'responsive',
    ],
])
