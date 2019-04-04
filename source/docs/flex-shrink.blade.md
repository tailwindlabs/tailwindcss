---
extends: _layouts.documentation
title: "Flex Shrink"
description: "Utilities for controlling how flex items shrink."
features:
  responsive: true
  customizable: true
  hover: false
  focus: false
---

@include('_partials.class-table', [
  'rows' => [
    [
      '.flex-shrink',
      'flex-shrink: 1;',
      "Allow a flex item to shrink if needed.",
    ],
    [
      '.flex-shrink-0',
      'flex-shrink: 0;',
      "Prevent a flex item from shrinking.",
    ],
  ]
])

## Shrink

Use `.flex-shrink` to allow a flex item to shrink if needed:

@component('_partials.code-sample')
<div class="flex bg-gray-200">
  <div class="flex-none text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">
    Longer content that cannot flex
  </div>
  <div class="flex-shrink text-gray-800 text-center bg-gray-500 px-4 py-2 m-2">
    Item that will shrink even if it causes the content to wrap
  </div>
  <div class="flex-none text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">
    Longer content that cannot flex
  </div>
</div>
@endcomponent

## Don't shrink

Use `.flex-shrink-0` to prevent a flex item from shrinking:

@component('_partials.code-sample')
<div class="flex bg-gray-200">
  <div class="flex-shrink text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">
    Item that can shrink if needed
  </div>
  <div class="flex-shrink-0 text-gray-800 text-center bg-gray-500 px-4 py-2 m-2">
    Item that cannot shrink below its initial size
  </div>
  <div class="flex-shrink text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">
    Item that can shrink if needed
  </div>
</div>
@endcomponent

## Responsive

To control how a flex item shrinks at a specific breakpoint, add a `{screen}:` prefix to any existing utility class. For example, use `md:flex-shrink-0` to apply the `flex-shrink-0` utility at only medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

@component('_partials.responsive-code-sample')
@slot('none')
<div class="flex bg-gray-200">
  <div class="flex-shrink text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">
    Item that can grow or shrink if needed
  </div>
  <div class="flex-shrink text-gray-800 text-center bg-gray-500 px-4 py-2 m-2">
    Responsive flex item
  </div>
  <div class="flex-shrink text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">
    Item that can grow or shrink if needed
  </div>
</div>
@endslot
@slot('sm')
<div class="flex bg-gray-200">
  <div class="flex-shrink text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">
    Item that can grow or shrink if needed
  </div>
  <div class="flex-shrink-0 text-gray-800 text-center bg-gray-500 px-4 py-2 m-2">
    Responsive flex item
  </div>
  <div class="flex-shrink text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">
    Item that can grow or shrink if needed
  </div>
</div>
@endslot
@slot('md')
<div class="flex bg-gray-200">
  <div class="flex-shrink text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">
    Item that can grow or shrink if needed
  </div>
  <div class="flex-shrink text-gray-800 text-center bg-gray-500 px-4 py-2 m-2">
    Responsive flex item
  </div>
  <div class="flex-shrink text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">
    Item that can grow or shrink if needed
  </div>
</div>
@endslot
@slot('lg')
<div class="flex bg-gray-200">
  <div class="flex-shrink text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">
    Item that can grow or shrink if needed
  </div>
  <div class="flex-shrink-0 text-gray-800 text-center bg-gray-500 px-4 py-2 m-2">
    Responsive flex item
  </div>
  <div class="flex-shrink text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">
    Item that can grow or shrink if needed
  </div>
</div>
@endslot
@slot('xl')
<div class="flex bg-gray-200">
  <div class="flex-shrink text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">
    Item that can grow or shrink if needed
  </div>
  <div class="flex-shrink text-gray-800 text-center bg-gray-500 px-4 py-2 m-2">
    Responsive flex item
  </div>
  <div class="flex-shrink text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">
    Item that can grow or shrink if needed
  </div>
</div>
@endslot
@slot('code')
<div class="flex ...">
  <!-- ... -->
  <div class="none:flex-shrink sm:flex-shrink-0 md:flex-shrink lg:flex-shrink-0 xl:flex-shrink ...">
    Responsive flex item
  </div>
  <!-- ... -->
</div>
@endslot
@endcomponent

## Customizing

### Shrink Values

By default Tailwind provides two `flex-shrink` utilities. You change, add, or remove these by editing the `theme.flexShrink` section of your Tailwind config.

@component('_partials.customized-config', ['key' => 'theme.flexShrink'])
  '0': 0,
- default: 1,
+ default: 2,
+ '1': 1,
@endcomponent

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'flex shrink',
        'property' => 'flexShrink',
    ],
    'variants' => [
        'responsive',
    ],
])
