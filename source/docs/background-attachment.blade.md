---
extends: _layouts.documentation
title: "Background Attachment"
description: "Utilities for controlling how a background image behaves when scrolling."
features:
  responsive: true
  customizable: false
  hover: false
  focus: false
---

@include('_partials.class-table', [
  'rows' => [
    [
      '.bg-fixed',
      'background-attachment: fixed;',
      'Fix the background image relative to the viewport.',
    ],
    [
      '.bg-local',
      'background-attachment: local;',
      'Scroll the background image with the container and the viewport.',
    ],
    [
      '.bg-scroll',
      'background-attachment: scroll;',
      'Scroll the background image with the viewport but not with the container.',
    ],
  ]
])

## Fixed

Use `.bg-fixed` to fix the background image relative to the viewport.

@component('_partials.code-sample')
<div class="w-full h-48 bg-fixed bg-center overflow-y-scroll" style="background-image:url('https://images.unsplash.com/photo-1459262838948-3e2de6c1ec80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80');">
    <div class="h-64"></div>
</div>
@slot('code')
<div class="bg-fixed ..." style="background-image: url(...)"></div>
@endslot
@endcomponent

## Local

Use `.bg-local` to scroll the background image with the container and the viewport.

@component('_partials.code-sample')
<div class="w-full h-48 bg-local bg-center overflow-y-scroll" style="background-image:url('https://images.unsplash.com/photo-1459262838948-3e2de6c1ec80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80');">
    <div class="h-64"></div>
</div>
@slot('code')
<div class="bg-local ..." style="background-image: url(...)"></div>
@endslot
@endcomponent

## Scroll

Use `.bg-scroll` to scroll the background image with the viewport, but not with the container.

@component('_partials.code-sample')
<div class="w-full h-48 bg-scroll bg-center overflow-y-scroll" style="background-image:url('https://images.unsplash.com/photo-1459262838948-3e2de6c1ec80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80');">
    <div class="h-64"></div>
</div>
@slot('code')
<div class="bg-scroll ..." style="background-image: url(...)"></div>
@endslot
@endcomponent

## Responsive

To control the background attachment of an element at a specific breakpoint, add a `{screen}:` prefix to any existing background attachment utility. For example, use `md:bg-fixed` to apply the `bg-fixed` utility at only medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

@component('_partials.responsive-code-sample')
@slot('none')
<div class="w-full h-48 bg-fixed bg-center overflow-y-scroll" style="background-image:url('https://images.unsplash.com/photo-1459262838948-3e2de6c1ec80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80');">
    <div class="h-64"></div>
</div>
@endslot
@slot('sm')
<div class="w-full h-48 bg-local bg-center overflow-y-scroll" style="background-image:url('https://images.unsplash.com/photo-1459262838948-3e2de6c1ec80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80');">
    <div class="h-64"></div>
</div>
@endslot
@slot('md')
<div class="w-full h-48 bg-scroll bg-center overflow-y-scroll" style="background-image:url('https://images.unsplash.com/photo-1459262838948-3e2de6c1ec80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80');">
    <div class="h-64"></div>
</div>
@endslot
@slot('lg')
<div class="w-full h-48 bg-local bg-center overflow-y-scroll" style="background-image:url('https://images.unsplash.com/photo-1459262838948-3e2de6c1ec80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80');">
    <div class="h-64"></div>
</div>
@endslot
@slot('xl')
<div class="w-full h-48 bg-fixed bg-center overflow-y-scroll" style="background-image:url('https://images.unsplash.com/photo-1459262838948-3e2de6c1ec80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80');">
    <div class="h-64"></div>
</div>
@endslot
@slot('code')
<div class="none:bg-fixed sm:bg-local md:bg-scroll lg:bg-local xl:bg-fixed ...">
    <!-- ... -->
</div>
@endslot
@endcomponent

## Customizing

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'background attachment',
        'property' => 'backgroundAttachment',
    ],
    'variants' => [
        'responsive',
    ],
])
