---
extends: _layouts.documentation
title: "Opacity"
description: "Utilities for controlling the opacity of an element."
features:
  responsive: true
  customizable: true
  hover: false
  focus: false
---

@include('_partials.class-table', [
  'rows' => [
    [
      '.opacity-100',
      'opacity: 1;',
      "Set the opacity of an element to 100%.",
    ],
    [
      '.opacity-75',
      'opacity: .75;',
      "Set the opacity of an element to 75%.",
    ],
    [
      '.opacity-50',
      'opacity: .5;',
      "Set the opacity of an element to 50%.",
    ],
    [
      '.opacity-25',
      'opacity: .25;',
      "Set the opacity of an element to 25%.",
    ],
    [
      '.opacity-0',
      'opacity: 0;',
      "Set the opacity of an element to 0%.",
    ],
  ]
])

## Example

@component('_partials.code-sample')
<div class="flex -mx-2">
  @foreach ($page->config['opacity']->reverse() as $name => $value)
    <div class="flex-1 text-grey-darker text-center bg-grey-light px-4 py-2 mx-2 opacity-{{ $name }}">.opacity-{{ $name }}</div>
  @endforeach
</div>
@slot('code')
@foreach ($page->config['opacity']->reverse() as $name => $value)
<div class="opacity-{{ $name }}">.opacity-{{ $name }}</div>
@endforeach
@endslot
@endcomponent

## Responsive

To control the opacity of an element at a specific breakpoint, add a `{screen}:` prefix to any existing opacity utility. For example, use `md:opacity-50` to apply the `opacity-50` utility at only medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

@component('_partials.responsive-code-sample')
@slot('none')
<div class="text-center">
  <div class="px-4 py-2 bg-grey-light opacity-100 w-24 h-24 rounded-full inline-block"></div>
</div>
@endslot
@slot('sm')
<div class="text-center">
  <div class="px-4 py-2 bg-grey-light opacity-75 w-24 h-24 rounded-full inline-block"></div>
</div>
@endslot
@slot('md')
<div class="text-center">
  <div class="px-4 py-2 bg-grey-light opacity-50 w-24 h-24 rounded-full inline-block"></div>
</div>
@endslot
@slot('lg')
<div class="text-center">
  <div class="px-4 py-2 bg-grey-light opacity-25 w-24 h-24 rounded-full inline-block"></div>
</div>
@endslot
@slot('xl')
<div class="text-center">
  <div class="px-4 py-2 bg-grey-light opacity-0 w-24 h-24 rounded-full inline-block"></div>
</div>
@endslot
@slot('code')
<div class="none:opacity-100 sm:opacity-75 md:opacity-50 lg:opacity-25 xl:opacity-0 ...">
  <!-- ... -->
</div>
@endslot
@endcomponent

## Customizing

### Opacity Scale

By default Tailwind provides five opacity utilities based on a simple numeric scale. You change, add, or remove these by editing the `opacity` section of your Tailwind config.

@component('_partials.customized-config', ['key' => 'opacity'])
  '0': '0',
- '25': '.25',
- '50': '.5',
- '75': '.75',
+ '10': '.1',
+ '20': '.2',
+ '30': '.3',
+ '40': '.4',
+ '50': '.5',
+ '60': '.6',
+ '70': '.7',
+ '80': '.8',
+ '90': '.9',
  '100': '1',
@endcomponent

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'opacity',
        'property' => 'opacity',
    ],
    'variants' => [
        'responsive',
    ],
])
