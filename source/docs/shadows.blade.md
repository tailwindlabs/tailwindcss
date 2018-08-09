---
extends: _layouts.documentation
title: "Box Shadows"
description: "Utilities for controlling the box shadow of an element."
features:
  responsive: true
  customizable: true
  hover: false
  focus: false
---

@include('_partials.class-table', [
  'rows' => [
    [
      '.shadow',
      "box-shadow: 0 2px 4px 0 rgba(0,0,0,0.10);",
      "Apply a small box shadow to an element.",
    ],
    [
      '.shadow-md',
      "box-shadow: 0 4px 8px 0 rgba(0,0,0,0.12),\n            0 2px 4px 0 rgba(0,0,0,0.08);",
      "Apply a medium box shadow to an element.",
    ],
    [
      '.shadow-lg',
      "box-shadow: 0 15px 30px 0 rgba(0,0,0,0.11),\n            0 5px 15px 0 rgba(0,0,0,0.08);",
      "Apply a large box shadow to an element.",
    ],
    [
      '.shadow-inner',
      "box-shadow: inset 0 2px 4px 0 rgba(0,0,0,0.06);",
      "Apply a small inner box shadow to an element.",
    ],
    [
      '.shadow-outline',
      "box-shadow: 0 0 0 3px rgba(52,144,220,0.5);",
      "Apply a small inner box shadow to an element.",
    ],
    [
      '.shadow-none',
      "box-shadow: none;",
      "Remove a box shadow from an element.",
    ],
  ]
])

## Outer shadow

Use the `.shadow`, `.shadow-md`, or `.shadow-lg` utilities to apply different sized outer box shadows to an element.

@component('_partials.code-sample', ['class' => 'flex justify-around text-sm py-8'])
<div class="mr-3 p-4 shadow">.shadow</div>
<div class="mr-3 p-4 shadow-md">.shadow-md</div>
<div class="p-4 shadow-lg">.shadow-lg</div>
@slot('code')
<div class="shadow"></div>
<div class="shadow-md"></div>
<div class="shadow-lg"></div>
@endslot
@endcomponent

## Inner shadow

Use the `.shadow-inner` utility to apply a subtle inset box shadow to an element. This can be useful for things like form controls or wells.

@component('_partials.code-sample', ['class' => 'flex justify-around text-sm py-8'])
<div class="p-4 bg-grey-lightest shadow-inner">.shadow-inner</div>
@slot('code')
<div class="shadow-inner"></div>
@endslot
@endcomponent

## Outline shadow

Use the `.shadow-outline` utility to apply a focus-ring-style shadow to an element. This can be useful when combined with `.focus:outline-none` to create a better looking focus style that follows an element's border radius.

@component('_partials.code-sample', ['class' => 'flex justify-center text-sm py-8'])
<button class="focus:outline-none focus:shadow-outline bg-grey-light hover:bg-grey text-grey-darkest font-bold py-2 px-4 rounded w-24 mr-6">
  Unfocused
</button>
<button class="focus:outline-none shadow-outline bg-grey-light hover:bg-grey text-grey-darkest font-bold py-2 px-4 rounded w-24">
  Focused
</button>
@slot('code')
<button class="focus:outline-none focus:shadow-outline ...">
  Button
</button>
@endslot
@endcomponent

## No shadow

Use `.shadow-none` to remove an existing box shadow from an element. This is most commonly used to remove a shadow that was applied at a smaller breakpoint.

@component('_partials.code-sample', ['class' => 'flex justify-around text-sm py-8'])
<div class="p-4 shadow-none bg-grey-light">.shadow-none</div>
@slot('code')
<div class="shadow-none"></div>
@endslot
@endcomponent

## Responsive

To control the shadow of an element at a specific breakpoint, add a `{screen}:` prefix to any existing shadow utility. For example, use `md:shadow-lg` to apply the `shadow-lg` utility at only medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

@component('_partials.responsive-code-sample')
@slot('none')
<div class="flex justify-center">
  <div class="shadow px-4 py-2 bg-grey-lightest opacity-100 w-24 h-24 rounded-full"></div>
</div>
@endslot
@slot('sm')
<div class="flex justify-center">
  <div class="shadow-md px-4 py-2 bg-grey-lightest opacity-100 w-24 h-24 rounded-full"></div>
</div>
@endslot
@slot('md')
<div class="flex justify-center">
  <div class="shadow-lg px-4 py-2 bg-grey-lightest opacity-100 w-24 h-24 rounded-full"></div>
</div>
@endslot
@slot('lg')
<div class="flex justify-center">
  <div class="shadow-inner px-4 py-2 bg-grey-lightest opacity-100 w-24 h-24 rounded-full"></div>
</div>
@endslot
@slot('xl')
<div class="flex justify-center">
  <div class="shadow-none px-4 py-2 bg-grey-lightest opacity-100 w-24 h-24 rounded-full"></div>
</div>
@endslot
@slot('code')
<div class="none:shadow sm:shadow-md md:shadow-lg lg:shadow-inner xl:shadow-none ...">
  <!-- ... -->
</div>
@endslot
@endcomponent

## Customizing

### Box Shadows

By default Tailwind provides three drop shadow utilities, one inner shadow utility, and a utility for removing existing shadows. You can change, add, or remove these by editing the `shadows` section of your Tailwind config.

If a `default` shadow is provided, it will be used for the non-suffixed `.shadow` utility. Any other keys will be used as suffixes, for example the key `'2'` will create a corresponding `.shadow-2` utility.

@component('_partials.customized-config', ['key' => 'shadows'])
- default: '0 2px 4px 0 rgba(0,0,0,0.10)',
- 'md': '0 4px 8px 0 rgba(0,0,0,0.12), 0 2px 4px 0 rgba(0,0,0,0.08)',
- 'lg': '0 15px 30px 0 rgba(0,0,0,0.11), 0 5px 15px 0 rgba(0,0,0,0.08)',
- 'inner': 'inset 0 2px 4px 0 rgba(0,0,0,0.06)',
- 'outline': '0 0 0 3px rgba(52,144,220,0.5)',
+ '1': '0 2px 4px rgba(0,0,0,0.05)',
+ '2': '0 4px 8px rgba(0,0,0,0.1)',
+ '3': '0 8px 16px rgba(0,0,0,0.15)',
  'none': 'none',
@endcomponent

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'shadow',
        'property' => 'shadows',
    ],
    'variants' => [
        'responsive',
        'hover',
        'focus',
    ],
])
