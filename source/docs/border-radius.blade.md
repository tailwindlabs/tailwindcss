---
extends: _layouts.documentation
title: "Border Radius"
description: "Utilities for controlling the border radius of an element."
features:
  responsive: true
  customizable: true
  hover: false
  focus: false
---

@include('_partials.class-table', [
  'rows' => [
    [
      '.rounded-none',
      'border-radius: 0;',
      "Remove any border radius from all corners of an element.",
    ],
    [
      '.rounded-sm',
      'border-radius: .125rem;',
      "Apply a small border radius to all corners of an element.",
    ],
    [
      '.rounded',
      'border-radius: .25rem;',
      "Apply the default border radius to all corners of an element.",
    ],
    [
      '.rounded-lg',
      'border-radius: .5rem;',
      "Apply a large border radius to all corners of an element.",
    ],
    [
      '.rounded-full',
      'border-radius: 9999px;',
      "Fully round all corners of an element.",
    ],
    [
      '.rounded-t-none',
      "border-top-left-radius: 0;\nborder-top-right-radius: 0;",
      "Remove any border radius from the top corners of an element.",
    ],
    [
      '.rounded-r-none',
      "border-top-right-radius: 0;\nborder-bottom-right-radius: 0;",
      "Remove any border radius from the right corners of an element.",
    ],
    [
      '.rounded-b-none',
      "border-bottom-right-radius: 0;\nborder-bottom-left-radius: 0;",
      "Remove any border radius from the bottom corners of an element.",
    ],
    [
      '.rounded-l-none',
      "border-top-left-radius: 0;\nborder-bottom-left-radius: 0;",
      "Remove any border radius from the left corners of an element.",
    ],
    [
      '.rounded-t-sm',
      "border-top-left-radius: .125rem;\nborder-top-right-radius: .125rem;",
      "Apply a small border radius to the top corners of an element.",
    ],
    [
      '.rounded-r-sm',
      "border-top-right-radius: .125rem;\nborder-bottom-right-radius: .125rem;",
      "Apply a small border radius to the right corners of an element.",
    ],
    [
      '.rounded-b-sm',
      "border-bottom-right-radius: .125rem;\nborder-bottom-left-radius: .125rem;",
      "Apply a small border radius to the bottom corners of an element.",
    ],
    [
      '.rounded-l-sm',
      "border-top-left-radius: .125rem;\nborder-bottom-left-radius: .125rem;",
      "Apply a small border radius to the left corners of an element.",
    ],
    [
      '.rounded-t',
      "border-top-left-radius: .25rem;\nborder-top-right-radius: .25rem;",
      "Apply the default border radius to the top corners of an element.",
    ],
    [
      '.rounded-r',
      "border-top-right-radius: .25rem;\nborder-bottom-right-radius: .25rem;",
      "Apply the default border radius to the right corners of an element.",
    ],
    [
      '.rounded-b',
      "border-bottom-right-radius: .25rem;\nborder-bottom-left-radius: .25rem;",
      "Apply the default border radius to the bottom corners of an element.",
    ],
    [
      '.rounded-l',
      "border-top-left-radius: .25rem;\nborder-bottom-left-radius: .25rem;",
      "Apply the default border radius to the left corners of an element.",
    ],
    [
      '.rounded-t-lg',
      "border-top-left-radius: .5rem;\nborder-top-right-radius: .5rem;",
      "Apply a large border radius to the top corners of an element.",
    ],
    [
      '.rounded-r-lg',
      "border-top-right-radius: .5rem;\nborder-bottom-right-radius: .5rem;",
      "Apply a large border radius to the right corners of an element.",
    ],
    [
      '.rounded-b-lg',
      "border-bottom-right-radius: .5rem;\nborder-bottom-left-radius: .5rem;",
      "Apply a large border radius to the bottom corners of an element.",
    ],
    [
      '.rounded-l-lg',
      "border-top-left-radius: .5rem;\nborder-bottom-left-radius: .5rem;",
      "Apply a large border radius to the left corners of an element.",
    ],
    [
      '.rounded-t-full',
      "border-top-left-radius: 9999px;\nborder-top-right-radius: 9999px;",
      "Fully round the top corners of an element.",
    ],
    [
      '.rounded-r-full',
      "border-top-right-radius: 9999px;\nborder-bottom-right-radius: 9999px;",
      "Fully round the right corners of an element.",
    ],
    [
      '.rounded-b-full',
      "border-bottom-right-radius: 9999px;\nborder-bottom-left-radius: 9999px;",
      "Fully round the bottom corners of an element.",
    ],
    [
      '.rounded-l-full',
      "border-top-left-radius: 9999px;\nborder-bottom-left-radius: 9999px;",
      "Fully round the left corners of an element.",
    ],
    [
      '.rounded-tl-none',
      'border-top-left-radius: 0;',
      "Remove any border radius from the top left corner of an element.",
    ],
    [
      '.rounded-tr-none',
      'border-top-right-radius: 0;',
      "Remove any border radius from the top right corner of an element.",
    ],
    [
      '.rounded-br-none',
      'border-bottom-right-radius: 0;',
      "Remove any border radius from the bottom right corner of an element.",
    ],
    [
      '.rounded-bl-none',
      'border-bottom-left-radius: 0;',
      "Remove any border radius from the bottom left corner of an element.",
    ],
    [
      '.rounded-tl-sm',
      'border-top-left-radius: .125rem;',
      "Apply a small border radius to the top left corner of an element.",
    ],
    [
      '.rounded-tr-sm',
      'border-top-right-radius: .125rem;',
      "Apply a small border radius to the top right corner of an element.",
    ],
    [
      '.rounded-br-sm',
      'border-bottom-right-radius: .125rem;',
      "Apply a small border radius to the bottom right corner of an element.",
    ],
    [
      '.rounded-bl-sm',
      'border-bottom-left-radius: .125rem;',
      "Apply a small border radius to the bottom left corner of an element.",
    ],
    [
      '.rounded-tl',
      'border-top-left-radius: .25rem;',
      "Apply the default border radius to the top left corner of an element.",
    ],
    [
      '.rounded-tr',
      'border-top-right-radius: .25rem;',
      "Apply the default border radius to the top right corner of an element.",
    ],
    [
      '.rounded-br',
      'border-bottom-right-radius: .25rem;',
      "Apply the default border radius to the bottom right corner of an element.",
    ],
    [
      '.rounded-bl',
      'border-bottom-left-radius: .25rem;',
      "Apply the default border radius to the bottom left corner of an element.",
    ],
    [
      '.rounded-tl-lg',
      'border-top-left-radius: .5rem;',
      "Apply a large border radius to the top left corner of an element.",
    ],
    [
      '.rounded-tr-lg',
      'border-top-right-radius: .5rem;',
      "Apply a large border radius to the top right corner of an element.",
    ],
    [
      '.rounded-br-lg',
      'border-bottom-right-radius: .5rem;',
      "Apply a large border radius to the bottom right corner of an element.",
    ],
    [
      '.rounded-bl-lg',
      'border-bottom-left-radius: .5rem;',
      "Apply a large border radius to the bottom left corner of an element.",
    ],
    [
      '.rounded-tl-full',
      'border-top-left-radius: 9999px;',
      "Fully round the top left corner of an element.",
    ],
    [
      '.rounded-tr-full',
      'border-top-right-radius: 9999px;',
      "Fully round the top right corner of an element.",
    ],
    [
      '.rounded-br-full',
      'border-bottom-right-radius: 9999px;',
      "Fully round the bottom right corner of an element.",
    ],
    [
      '.rounded-bl-full',
      'border-bottom-left-radius: 9999px;',
      "Fully round the bottom left corner of an element.",
    ],
  ]
])

## Rounded corners

Use the `.rounded-sm`, `.rounded`, or `.rounded-lg` utilities to apply different border radius sizes to an element.

@component('_partials.code-sample', ['class' => 'flex justify-around text-sm'])
<div class="bg-grey-light mr-3 p-4 rounded-sm">.rounded-sm</div>
<div class="bg-grey-light mr-3 p-4 rounded">.rounded</div>
<div class="bg-grey-light p-4 rounded-lg">.rounded-lg</div>
@slot('code')
<div class="rounded-sm"></div>
<div class="rounded"></div>
<div class="rounded-lg"></div>
@endslot
@endcomponent

<a id="test" style="position: relative; top: -64px; display: block; visibility: hidden;"></a>
## Pills and circles

Use the `.rounded-full` utility to create pills and circles.

@component('_partials.code-sample', ['class' => 'flex items-center justify-around text-sm'])
<div class="bg-grey-light mr-3 py-2 px-4 rounded-full">Pill shape</div>
<div class="bg-grey-light h-16 w-16 rounded-full flex items-center justify-center">Circle</div>
@slot('code')
<div class="rounded-full py-2 px-4">Pill shape</div>
<div class="rounded-full h-16 w-16 flex items-center justify-center">Circle</div>
@endslot
@endcomponent

## No rounding

Use `.rounded-none` to remove an existing border radius from an element.

This is most commonly used to remove a border radius that was applied at a smaller breakpoint.

@component('_partials.code-sample', ['class' => 'flex justify-around text-sm py-8'])
<div class="p-4 rounded-none bg-grey-light">.rounded-none</div>
@slot('code')
<div class="rounded-none"></div>
@endslot
@endcomponent

## Rounding sides separately

Use `.rounded-{t|r|b|l}{-size?}` to only round one side an element.

@component('_partials.code-sample', ['class' => 'flex justify-around text-sm'])
<div class="bg-grey-light mr-3 p-4 rounded-t-lg">.rounded-t-lg</div>
<div class="bg-grey-light mr-3 p-4 rounded-r-lg">.rounded-r-lg</div>
<div class="bg-grey-light mr-3 p-4 rounded-b-lg">.rounded-b-lg</div>
<div class="bg-grey-light p-4 rounded-l-lg">.rounded-l-lg</div>
@slot('code')
<div class="rounded-t-lg"></div>
<div class="rounded-r-lg"></div>
<div class="rounded-b-lg"></div>
<div class="rounded-l-lg"></div>
@endslot
@endcomponent

## Rounding corners separately

Use `.rounded-{tl|tr|br|bl}{-size?}` to only round one corner an element.

@component('_partials.code-sample', ['class' => 'flex justify-around text-sm'])
<div class="bg-grey-light mr-3 p-4 rounded-tl-lg">.rounded-tl-lg</div>
<div class="bg-grey-light mr-3 p-4 rounded-tr-lg">.rounded-tr-lg</div>
<div class="bg-grey-light mr-3 p-4 rounded-br-lg">.rounded-br-lg</div>
<div class="bg-grey-light p-4 rounded-bl-lg">.rounded-bl-lg</div>
@slot('code')
<div class="rounded-tl-lg"></div>
<div class="rounded-tr-lg"></div>
<div class="rounded-br-lg"></div>
<div class="rounded-bl-lg"></div>
@endslot
@endcomponent

## Responsive

To control the border radius of an element at a specific breakpoint, add a `{screen}:` prefix to any existing border radius utility. For example, use `md:rounded-lg` to apply the `rounded-lg` utility at only medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

@component('_partials.responsive-code-sample')
@slot('none')
<div class="flex justify-center">
  <div class="bg-grey w-12 h-12 rounded"></div>
</div>
@endslot
@slot('sm')
<div class="flex justify-center">
  <div class="bg-grey w-12 h-12 rounded-t"></div>
</div>
@endslot
@slot('md')
<div class="flex justify-center">
  <div class="bg-grey w-12 h-12 rounded-b-lg"></div>
</div>
@endslot
@slot('lg')
<div class="flex justify-center">
  <div class="bg-grey w-12 h-12 rounded-none"></div>
</div>
@endslot
@slot('xl')
<div class="flex justify-center">
  <div class="bg-grey w-12 h-12 rounded-r"></div>
</div>
@endslot
@slot('code')
<div class="none:rounded sm:rounded-t md:rounded-b-lg lg:rounded-none xl:rounded-r ...">
  <!-- ... -->
</div>
@endslot
@endcomponent

## Customizing

### Border Radiuses

By default Tailwind provides five border radius size utilities. You can change, add, or remove these by editing the `borderRadius` section of your Tailwind config.

@component('_partials.customized-config', ['key' => 'borderRadius'])
  'none': '0',
- 'sm': '.125rem',
- default: '.25rem',
+ default: '4px',
- 'lg': '.5rem',
- 'full': '9999px',
+ 'large': '12px',
@endcomponent

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'border radius',
        'property' => 'borderRadius',
    ],
    'variants' => [
        'responsive',
    ],
])

