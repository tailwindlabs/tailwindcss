---
extends: _layouts.documentation
title: "Flex Grow"
description: "Utilities for controlling how flex items grow."
features:
  responsive: true
  customizable: true
  hover: false
  focus: false
---

@include('_partials.class-table', [
  'rows' => [
    [
      '.flex-grow',
      'flex-grow: 1;',
      "Allow a flex item to grow to fill any available space.",
    ],
    [
      '.flex-grow-0',
      'flex-grow: 0;',
      "Prevent a flex item from growing.",
    ],
  ]
])

## Grow

Use `.flex-grow` to allow a flex item to grow to fill any available space:

@component('_partials.code-sample')
<div class="flex bg-gray-200">
  <div class="flex-none text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">
    Content that cannot flex
  </div>
  <div class="flex-grow text-gray-800 text-center bg-gray-500 px-4 py-2 m-2">
    Item that will grow
  </div>
  <div class="flex-none text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">
    Content that cannot flex
  </div>
</div>
@endcomponent

## Don't grow

Use `.flex-grow-0` to prevent a flex item from growing:

@component('_partials.code-sample')
<div class="flex bg-gray-200">
  <div class="flex-grow text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">
    Will grow
  </div>
  <div class="flex-grow-0 text-gray-800 text-center bg-gray-500 px-4 py-2 m-2">
    Will not grow
  </div>
  <div class="flex-grow text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">
    Will grow
  </div>
</div>
@endcomponent

## Responsive

To control how a flex item grows at a specific breakpoint, add a `{screen}:` prefix to any existing utility class. For example, use `md:flex-grow-0` to apply the `flex-grow-0` utility at only medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

@component('_partials.responsive-code-sample')
@slot('none')
<div class="flex bg-gray-200">
  <div class="flex-1 text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">
    Item that can grow or shrink if needed
  </div>
  <div class="flex-grow-0 text-gray-800 text-center bg-gray-500 px-4 py-2 m-2">
    Responsive flex item
  </div>
  <div class="flex-1 text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">
    Item that can grow or shrink if needed
  </div>
</div>
@endslot
@slot('sm')
<div class="flex bg-gray-200">
  <div class="flex-1 text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">
    Item that can grow or shrink if needed
  </div>
  <div class="flex-grow text-gray-800 text-center bg-gray-500 px-4 py-2 m-2">
    Responsive flex item
  </div>
  <div class="flex-1 text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">
    Item that can grow or shrink if needed
  </div>
</div>
@endslot
@slot('md')
<div class="flex bg-gray-200">
  <div class="flex-1 text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">
    Item that can grow or shrink if needed
  </div>
  <div class="flex-grow-0 text-gray-800 text-center bg-gray-500 px-4 py-2 m-2">
    Responsive flex item
  </div>
  <div class="flex-1 text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">
    Item that can grow or shrink if needed
  </div>
</div>
@endslot
@slot('lg')
<div class="flex bg-gray-200">
  <div class="flex-1 text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">
    Item that can grow or shrink if needed
  </div>
  <div class="flex-grow text-gray-800 text-center bg-gray-500 px-4 py-2 m-2">
    Responsive flex item
  </div>
  <div class="flex-1 text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">
    Item that can grow or shrink if needed
  </div>
</div>
@endslot
@slot('xl')
<div class="flex bg-gray-200">
  <div class="flex-1 text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">
    Item that can grow or shrink if needed
  </div>
  <div class="flex-grow-0 text-gray-800 text-center bg-gray-500 px-4 py-2 m-2">
    Responsive flex item
  </div>
  <div class="flex-1 text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">
    Item that can grow or shrink if needed
  </div>
</div>
@endslot
@slot('code')
<div class="flex ...">
  <!-- ... -->
  <div class="none:flex-grow-0 sm:flex-grow md:flex-grow-0 lg:flex-grow xl:flex-grow-0 ...">
    Responsive flex item
  </div>
  <!-- ... -->
</div>
@endslot
@endcomponent

## Customizing

### Grow Values

By default Tailwind provides two `flex-grow` utilities. You change, add, or remove these by editing the `flexGrow` section of your Tailwind config.

@component('_partials.customized-config', ['key' => 'flexGrow'])
  '0': 0,
- default: 1,
+ default: 2,
+ '1': 1,
@endcomponent

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'flex grow',
        'property' => 'flexGrow',
    ],
    'variants' => [
        'responsive',
    ],
])
