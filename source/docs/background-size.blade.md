---
extends: _layouts.documentation
title: "Background Size"
description: "Utilities for controlling the background size of an element's background image."
features:
  responsive: true
  customizable: false
  hover: false
  focus: false
---

@include('_partials.class-table', [
  'rows' => [
    [
      '.bg-auto',
      'background-size: auto;',
      "Display the image at its default size.",
    ],
    [
      '.bg-cover',
      'background-size: cover;',
      "Scale the image until it fills the background layer.",
    ],
    [
      '.bg-contain',
      'background-size: contain;',
      "Scale the image to the outer edges without cropping or stretching.",
    ],
  ]
])

## Auto <span class="ml-2 font-semibold text-gray-600 text-sm uppercase tracking-wide">Default</span>

Use `.bg-auto` to display the background image at its default size.

@component('_partials.code-sample')
<div class="w-full bg-gray-400 h-48 bg-center bg-auto" style="background-image:url('https://images.unsplash.com/photo-1459262838948-3e2de6c1ec80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80');">
</div>
@slot('code')
<div class="bg-auto bg-center ..." style="background-image: url(...)"></div>
@endslot
@endcomponent

## Cover

Use `.bg-cover` to scale the background image until it fills the background layer.

@component('_partials.code-sample')
<div class="w-full mx-auto bg-gray-400 h-48 bg-center bg-cover" style="background-image:url('https://images.unsplash.com/photo-1459262838948-3e2de6c1ec80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80');">
</div>
@slot('code')
<div class="bg-cover bg-center ..." style="background-image: url(...)"></div>
@endslot
@endcomponent

## Contain

Use `.bg-contain` to scale the background image to the outer edges without cropping or stretching.

@component('_partials.code-sample')
<div class="w-full bg-gray-400 h-48 bg-center bg-no-repeat bg-contain" style="background-image:url('https://images.unsplash.com/photo-1459262838948-3e2de6c1ec80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80');">
</div>
@slot('code')
<div class="bg-contain bg-center ..." style="background-image: url(...)"></div>
@endslot
@endcomponent

## Responsive

To control the size of an element's background image at a specific breakpoint, add a `{screen}:` prefix to any existing background size utility. For example, adding the class `md:bg-contain` to an element would apply the `bg-contain` utility at medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

@component('_partials.responsive-code-sample')
@slot('none')
<div class="mx-auto w-64 bg-gray-400 h-48 bg-center bg-no-repeat bg-auto" style="background-image:url('https://images.unsplash.com/photo-1459262838948-3e2de6c1ec80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80');">
</div>
@endslot

@slot('sm')
<div class="mx-auto w-64 bg-gray-400 h-48 bg-center bg-no-repeat bg-cover" style="background-image:url('https://images.unsplash.com/photo-1459262838948-3e2de6c1ec80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80');">
</div>
@endslot

@slot('md')
<div class="mx-auto w-64 bg-gray-400 h-48 bg-center bg-no-repeat bg-contain" style="background-image:url('https://images.unsplash.com/photo-1459262838948-3e2de6c1ec80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80');">
</div>
@endslot

@slot('lg')
<div class="mx-auto w-64 bg-gray-400 h-48 bg-center bg-no-repeat bg-auto" style="background-image:url('https://images.unsplash.com/photo-1459262838948-3e2de6c1ec80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80');">
</div>
@endslot

@slot('xl')
<div class="mx-auto w-64 bg-gray-400 h-48 bg-center bg-no-repeat bg-cover" style="background-image:url('https://images.unsplash.com/photo-1459262838948-3e2de6c1ec80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80');">
</div>
@endslot

@slot('code')
<div class="none:bg-auto sm:bg-cover md:bg-contain lg:bg-auto xl:bg-cover ..." style="background-image: url(...)"></div>
@endslot
@endcomponent

## Customizing

By default Tailwind provides utilities for `auto`, `cover`, and `contain` background sizes. You can change, add, or remove these by editing the `theme.backgroundSize` section of your config.

@component('_partials.customized-config', ['key' => 'theme.backgroundSize'])
  'auto': 'auto',
  'cover': 'cover',
  'contain': 'contain',
+ '50%': '50%',
+ '16': '4rem',
@endcomponent

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'background size',
        'property' => 'backgroundSize',
    ],
    'variants' => [
        'responsive',
    ],
])
