---
extends: _layouts.documentation
title: "Flex, Grow, &amp; Shrink"
description: "Utilities for controlling how flex items grow and shrink."
features:
  responsive: true
  customizable: false
  hover: false
  focus: false
---

@include('_partials.class-table', [
  'rows' => [
    [
      '.flex-initial',
      'flex: initial;',
      "Allow a flex item to shrink but not grow, taking into account its initial size.",
    ],
    [
      '.flex-1',
      'flex: 1;',
      "Allow a flex item to grow and shrink as needed, ignoring its initial size.",
    ],
    [
      '.flex-auto',
      'flex: auto;',
      "Allow a flex item to grow and shrink, taking into account its initial size.",
    ],
    [
      '.flex-none',
      'flex: none;',
      "Prevent a flex item from growing or shrinking.",
    ],
    [
      '.flex-grow',
      'flex-grow: 1;',
      "Allow a flex item to grow to fill any available space.",
    ],
    [
      '.flex-shrink',
      'flex-shrink: 1;',
      "Allow a flex item to shrink if needed.",
    ],
    [
      '.flex-grow-0',
      'flex-grow: 0;',
      "Prevent a flex item from growing.",
    ],
    [
      '.flex-shrink-0',
      'flex-shrink: 0;',
      "Prevent a flex item from shrinking.",
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
  <div class="flex-none text-gray-800 text-center bg-grey px-4 py-2 m-2">
    Item that cannot grow or shrink
  </div>
  <div class="flex-1 text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">
    Item that can grow or shrink if needed
  </div>
</div>
@endcomponent

## Grow

Use `.flex-grow` to allow a flex item to grow to fill any available space:

@component('_partials.code-sample')
<div class="flex bg-gray-200">
  <div class="flex-none text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">
    Content that cannot flex
  </div>
  <div class="flex-grow text-gray-800 text-center bg-grey px-4 py-2 m-2">
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
  <div class="flex-grow-0 text-gray-800 text-center bg-grey px-4 py-2 m-2">
    Will not grow
  </div>
  <div class="flex-grow text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">
    Will grow
  </div>
</div>
@endcomponent

## Shrink

Use `.flex-shrink` to allow a flex item to shrink if needed:

@component('_partials.code-sample')
<div class="flex bg-gray-200">
  <div class="flex-none text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">
    Longer content that cannot flex
  </div>
  <div class="flex-shrink text-gray-800 text-center bg-grey px-4 py-2 m-2">
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
  <div class="flex-shrink-0 text-gray-800 text-center bg-grey px-4 py-2 m-2">
    Item that cannot shrink below its initial size
  </div>
  <div class="flex-shrink text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">
    Item that can shrink if needed
  </div>
</div>
@endcomponent

## Responsive

To control how a flex item grows or shrinks at a specific breakpoint, add a `{screen}:` prefix to any existing utility class. For example, use `md:flex-shrink-0` to apply the `flex-shrink-0` utility at only medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

@component('_partials.responsive-code-sample')
@slot('none')
<div class="flex bg-gray-200">
  <div class="flex-1 text-gray-700 text-center bg-gray-400 px-4 py-2 m-2">
    Item that can grow or shrink if needed
  </div>
  <div class="flex-none text-gray-800 text-center bg-grey px-4 py-2 m-2">
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
  <div class="flex-grow text-gray-800 text-center bg-grey px-4 py-2 m-2">
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
  <div class="flex-shrink text-gray-800 text-center bg-grey px-4 py-2 m-2">
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
  <div class="flex-1 text-gray-800 text-center bg-grey px-4 py-2 m-2">
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
  <div class="flex-initial text-gray-800 text-center bg-grey px-4 py-2 m-2">
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
  <div class="none:flex-none sm:flex-grow md:flex-shrink lg:flex-1 xl:flex-auto ...">
    Responsive flex item
  </div>
  <!-- ... -->
</div>
@endslot
@endcomponent

## Customizing

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'flex, grow, and shrink',
        'property' => 'flexbox',
    ],
    'variants' => [
        'responsive',
    ],
    'extraMessage' => 'Note that modifying the <code>flexbox</code> property will affect which variants are generated for <em>all</em> Flexbox utilities, not just the flex, grow, and shrink utilities.'
])
