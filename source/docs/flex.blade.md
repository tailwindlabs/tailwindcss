---
extends: _layouts.documentation
title: "Flex"
description: "Utilities for controlling how flex items both grow and shrink."
features:
  responsive: true
  customizable: true
  hover: false
  focus: false
---

@include('_partials.class-table', [
  'rows' => [
    [
      '.flex-initial',
      'flex: 0 1 auto;',
      "Allow a flex item to shrink but not grow, taking into account its initial size.",
    ],
    [
      '.flex-1',
      'flex: 1 1 0%;',
      "Allow a flex item to grow and shrink as needed, ignoring its initial size.",
    ],
    [
      '.flex-auto',
      'flex: 1 1 auto;',
      "Allow a flex item to grow and shrink, taking into account its initial size.",
    ],
    [
      '.flex-none',
      'flex: none;',
      "Prevent a flex item from growing or shrinking.",
    ],
  ]
])

## Initial <span class="ml-2 font-semibold text-gray-600 text-sm uppercase tracking-wide">Default</span>

Use `.flex-initial` to allow a flex item to shrink but not grow, taking into account its initial size:

@component('_partials.code-sample')
<p class="text-sm text-gray-600 mb-1">Items don't grow when there's extra space</p>
<div class="flex bg-gray-200 mb-6">
  <div class="flex-initial text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">
    Short
  </div>
  <div class="flex-initial text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">
    Medium length
  </div>
</div>

<p class="text-sm text-gray-600 mb-1">Items shrink if possible when needed</p>
<div class="flex bg-gray-200">
  <div class="flex-initial text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">
    Short
  </div>
  <div class="flex-initial text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">
    Medium length
  </div>
  <div class="flex-initial text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Qui ad labore ipsam, aut rem quo repellat esse tempore id, quidem
  </div>
</div>

@slot('code')
<div class="flex bg-gray-200">
  <div class="flex-initial text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">
    Short
  </div>
  <div class="flex-initial text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">
    Medium length
  </div>
</div>

<div class="flex bg-gray-200">
  <div class="flex-initial text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">
    Short
  </div>
  <div class="flex-initial text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">
    Medium length
  </div>
  <div class="flex-initial text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Qui ad labore ipsam, aut rem quo repellat esse tempore id, quidem
  </div>
</div>
@endslot
@endcomponent

## Flex 1

Use `.flex-1` to allow a flex item to grow and shrink as needed, ignoring its initial size:

@component('_partials.code-sample')
<p class="text-sm text-gray-600 mb-1">Default behavior</p>
<div class="flex bg-gray-200 mb-6">
  <div class="text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">
    Short
  </div>
  <div class="text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">
    Medium length
  </div>
  <div class="text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">
    Significantly larger amount of content
  </div>
</div>
<p class="text-sm text-gray-600 mb-1">With <code>.flex-1</code></p>
<div class="flex bg-gray-200">
  <div class="flex-1 text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">
    Short
  </div>
  <div class="flex-1 text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">
    Medium length
  </div>
  <div class="flex-1 text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">
    Significantly larger amount of content
  </div>
</div>

@slot('code')
<div class="flex bg-gray-200">
  <div class="flex-1 text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">
    Short
  </div>
  <div class="flex-1 text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">
    Medium length
  </div>
  <div class="flex-1 text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">
    Significantly larger amount of content
  </div>
</div>
@endslot
@endcomponent

## Auto

Use `.flex-auto` to allow a flex item to grow and shrink, taking into account its initial size:

@component('_partials.code-sample')
<p class="text-sm text-gray-600 mb-1">Default behavior</p>
<div class="flex bg-gray-200 mb-6">
  <div class="text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">
    Short
  </div>
  <div class="text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">
    Medium length
  </div>
  <div class="text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">
    Significantly larger amount of content
  </div>
</div>
<p class="text-sm text-gray-600 mb-1">With <code>.flex-auto</code></p>
<div class="flex bg-gray-200">
  <div class="flex-auto text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">
    Short
  </div>
  <div class="flex-auto text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">
    Medium length
  </div>
  <div class="flex-auto text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">
    Significantly larger amount of content
  </div>
</div>

@slot('code')
<div class="flex bg-gray-200">
  <div class="flex-auto text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">
    Short
  </div>
  <div class="flex-auto text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">
    Medium length
  </div>
  <div class="flex-auto text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">
    Significantly larger amount of content
  </div>
</div>
@endslot
@endcomponent

## None

Use `.flex-none` to prevent a flex item from growing or shrinking:

@component('_partials.code-sample')
<div class="flex bg-gray-200">
  <div class="flex-1 text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">
    Item that can grow or shrink if needed
  </div>
  <div class="flex-none text-gray-800 text-center bg-gray-500 px-4 py-2 m-2">
    Item that cannot grow or shrink
  </div>
  <div class="flex-1 text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">
    Item that can grow or shrink if needed
  </div>
</div>
@endcomponent

## Responsive

To control how a flex item both grows and shrinks at a specific breakpoint, add a `{screen}:` prefix to any existing utility class. For example, use `md:flex-1` to apply the `flex-1` utility at only medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

@component('_partials.responsive-code-sample')
@slot('none')
<div class="flex bg-gray-200">
  <div class="flex-1 text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">
    Item that can grow or shrink if needed
  </div>
  <div class="flex-none text-gray-800 text-center bg-gray-500 px-4 py-2 m-2">
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
  <div class="flex-1 text-gray-800 text-center bg-gray-500 px-4 py-2 m-2">
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
  <div class="flex-auto text-gray-800 text-center bg-gray-500 px-4 py-2 m-2">
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
  <div class="flex-initial text-gray-800 text-center bg-gray-500 px-4 py-2 m-2">
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
  <div class="flex-1 text-gray-800 text-center bg-gray-500 px-4 py-2 m-2">
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
  <div class="none:flex-none sm:flex-1 md:flex-auto lg:flex-initial xl:flex-1 ...">
    Responsive flex item
  </div>
  <!-- ... -->
</div>
@endslot
@endcomponent

## Customizing

### Flex Values

By default Tailwind provides four `flex` utilities. You change, add, or remove these by editing the `theme.flex` section of your Tailwind config.

@component('_partials.customized-config', ['key' => 'theme.flex'])
  '1': '1 1 0%',
  auto: '1 1 auto',
- initial: '0 1 auto',
+ inherit: 'inherit',
  none: 'none',
+ '2': '2 2 0%',
@endcomponent

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'flex',
        'property' => 'flex',
    ],
    'variants' => [
        'responsive',
    ],
])
