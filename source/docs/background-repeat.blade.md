---
extends: _layouts.documentation
title: "Background Repeat"
description: "Utilities for controlling the repetition of an element's background image."
features:
  responsive: true
  customizable: false
  hover: false
  focus: false
---

@include('_partials.class-table', [
  'rows' => [
    [
      '.bg-repeat',
      'background-repeat: repeat;',
      'Repeat the background image both vertically and horizontally.',
    ],
    [
      '.bg-no-repeat',
      'background-repeat: no-repeat;',
      'Don\'t repeat the background image.',
    ],
    [
      '.bg-repeat-x',
      'background-repeat: repeat-x;',
      'Repeat the background image only horizontally.',
    ],
    [
      '.bg-repeat-y',
      'background-repeat: repeat-y;',
      'Repeat the background image only vertically.',
    ],
    [
      '.bg-repeat-round',
      'background-repeat: round;',
      'Repeat the background image as much as possible without clipping, stretching the image until there is room for another one to be added, leaving no gap between them.',
    ],
    [
      '.bg-repeat-space',
      'background-repeat: space;',
      'Repeat the background image as much as possible without clipping, distributing whitespace evenly between the images.',
    ],
  ]
])

## Repeat <span class="ml-2 font-semibold text-gray-600 text-sm uppercase tracking-wide">Default</span>

Use `.bg-repeat` to repeat the background image both vertically and horizontally.

@component('_partials.code-sample')
<div class="w-full bg-gray-400 h-48 bg-center bg-repeat" style="background-image:url('https://images.unsplash.com/photo-1459262838948-3e2de6c1ec80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=128&q=80');">
</div>
@slot('code')
<div class="bg-repeat bg-center ..." style="background-image: url(...)"></div>
@endslot
@endcomponent

## No Repeat

Use `.bg-no-repeat` when you don't want to repeat the background image.

@component('_partials.code-sample')
<div class="w-full bg-gray-400 h-48 bg-center bg-no-repeat" style="background-image:url('https://images.unsplash.com/photo-1459262838948-3e2de6c1ec80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=128&q=80');">
</div>
@slot('code')
<div class="bg-no-repeat bg-center ..." style="background-image: url(...)"></div>
@endslot
@endcomponent

## Repeat Horizontally

Use `.bg-repeat-x` to repeat the background image only horizontally.

@component('_partials.code-sample')
<div class="w-full bg-gray-400 h-48 bg-center bg-repeat-x" style="background-image:url('https://images.unsplash.com/photo-1459262838948-3e2de6c1ec80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=128&q=80');">
</div>
@slot('code')
<div class="bg-repeat-x bg-center ..." style="background-image: url(...)"></div>
@endslot
@endcomponent

## Repeat Vertically

Use `.bg-repeat-y` to repeat the background image only vertically.

@component('_partials.code-sample')
<div class="w-full bg-gray-400 h-48 bg-center bg-repeat-y" style="background-image:url('https://images.unsplash.com/photo-1459262838948-3e2de6c1ec80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=128&q=80');">
</div>
@slot('code')
<div class="bg-repeat-y bg-center ..." style="background-image: url(...)"></div>
@endslot
@endcomponent

## Responsive

To control the repetition of an element's background image at a specific breakpoint, add a `{screen}:` prefix to any existing background repeat utility. For example, adding the class `md:bg-repeat-x` to an element would apply the `bg-repeat-x` utility at medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

@component('_partials.responsive-code-sample')
@slot('none')
<div class="w-full bg-gray-400 h-48 bg-center bg-repeat" style="background-image:url('https://images.unsplash.com/photo-1459262838948-3e2de6c1ec80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=128&q=80');">
</div>
@endslot

@slot('sm')
<div class="w-full bg-gray-400 h-48 bg-center bg-no-repeat" style="background-image:url('https://images.unsplash.com/photo-1459262838948-3e2de6c1ec80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=128&q=80');">
</div>
@endslot

@slot('md')
<div class="w-full bg-gray-400 h-48 bg-center bg-repeat-x" style="background-image:url('https://images.unsplash.com/photo-1459262838948-3e2de6c1ec80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=128&q=80');">
</div>
@endslot

@slot('lg')
<div class="w-full bg-gray-400 h-48 bg-center bg-repeat-y" style="background-image:url('https://images.unsplash.com/photo-1459262838948-3e2de6c1ec80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=128&q=80');">
</div>
@endslot

@slot('xl')
<div class="w-full bg-gray-400 h-48 bg-center bg-no-repeat" style="background-image:url('https://images.unsplash.com/photo-1459262838948-3e2de6c1ec80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=128&q=80');">
</div>
@endslot

@slot('code')
<div class="none:bg-repeat sm:bg-no-repeat md:bg-repeat-x lg:bg-repeat-y xl:bg-no-repeat ..." style="background-image: url(...)"></div>
@endslot
@endcomponent


## Customizing

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'background repeat',
        'property' => 'backgroundRepeat',
    ],
    'variants' => [
        'responsive',
    ],
])
