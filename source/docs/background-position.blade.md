---
extends: _layouts.documentation
title: "Background Position"
description: "Utilities for controlling the position of an element's background image."
features:
  responsive: true
  customizable: false
  hover: false
  focus: false
---

@include('_partials.class-table', [
  'rows' => [
    [
      '.bg-bottom',
      'background-position: bottom;',
      'Place the background image on the bottom edge.',
    ],
    [
      '.bg-center',
      'background-position: center;',
      'Place the background image in the center.',
    ],
    [
      '.bg-left',
      'background-position: left;',
      'Place the background image on the left edge.',
    ],
    [
      '.bg-left-bottom',
      'background-position: left bottom;',
      'Place the background image on the left bottom edge.',
    ],
    [
      '.bg-left-top',
      'background-position: left top;',
      'Place the background image on the left top edge.',
    ],
    [
      '.bg-right',
      'background-position: right;',
      'Place the background image on the right edge.',
    ],
    [
      '.bg-right-bottom',
      'background-position: right bottom;',
      'Place the background image on the right bottom edge.',
    ],
    [
      '.bg-right-top',
      'background-position: right top;',
      'Place the background image on the right top edge.',
    ],
    [
      '.bg-top',
      'background-position: top;',
      'Place the background image on the top edge.',
    ],
  ]
])

## Usage

Use the `.bg-{side}` utilities to control the position of an element's background image.

@component('_partials.code-sample')
<div class="flex justify-around mb-8">
  <div class="flex-1">
    <p class="text-center text-sm text-gray-600 mb-1">.bg-left-top</p>
    <div class="mx-auto bg-gray-400 w-24 h-24 bg-left-top bg-no-repeat"
        style="background-image:url('https://images.unsplash.com/photo-1459262838948-3e2de6c1ec80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=64&h=64&q=80');"></div>
  </div>
  <div class="flex-1">
    <p class="text-center text-sm text-gray-600 mb-1">.bg-top</p>
    <div class="mx-auto bg-gray-400 w-24 h-24 bg-top bg-no-repeat"
         style="background-image:url('https://images.unsplash.com/photo-1459262838948-3e2de6c1ec80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=64&h=64&q=80');"></div>
  </div>
  <div class="flex-1">
    <p class="text-center text-sm text-gray-600 mb-1">.bg-right-top</p>
    <div class="mx-auto bg-gray-400 w-24 h-24 bg-right-top bg-no-repeat"
         style="background-image:url('https://images.unsplash.com/photo-1459262838948-3e2de6c1ec80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=64&h=64&q=80');"></div>
  </div>
</div>
<div class="flex justify-around mb-8">
  <div class="flex-1">
    <p class="text-center text-sm text-gray-600 mb-1">.bg-left</p>
    <div class="mx-auto bg-gray-400 w-24 h-24 bg-left bg-no-repeat"
         style="background-image:url('https://images.unsplash.com/photo-1459262838948-3e2de6c1ec80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=64&h=64&q=80');"></div>
  </div>
  <div class="flex-1">
    <p class="text-center text-sm text-gray-600 mb-1">.bg-center</p>
    <div class="mx-auto bg-gray-400 w-24 h-24 bg-center bg-no-repeat"
         style="background-image:url('https://images.unsplash.com/photo-1459262838948-3e2de6c1ec80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=64&h=64&q=80');"></div>
  </div>
  <div class="flex-1">
    <p class="text-center text-sm text-gray-600 mb-1">.bg-right</p>
    <div class="mx-auto bg-gray-400 w-24 h-24 bg-right bg-no-repeat"
         style="background-image:url('https://images.unsplash.com/photo-1459262838948-3e2de6c1ec80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=64&h=64&q=80');"></div>
  </div>
</div>
<div class="flex justify-around">
  <div class="flex-1">
    <p class="text-center text-sm text-gray-600 mb-1">.bg-left-bottom</p>
    <div class="mx-auto bg-gray-400 w-24 h-24 bg-left-bottom bg-no-repeat"
         style="background-image:url('https://images.unsplash.com/photo-1459262838948-3e2de6c1ec80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=64&h=64&q=80');"></div>
  </div>
  <div class="flex-1">
    <p class="text-center text-sm text-gray-600 mb-1">.bg-bottom</p>
    <div class="mx-auto bg-gray-400 w-24 h-24 bg-bottom bg-no-repeat"
         style="background-image:url('https://images.unsplash.com/photo-1459262838948-3e2de6c1ec80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=64&h=64&q=80');"></div>
  </div>
  <div class="flex-1">
    <p class="text-center text-sm text-gray-600 mb-1">.bg-right-bottom</p>
    <div class="mx-auto bg-gray-400 w-24 h-24 bg-right-bottom bg-no-repeat"
         style="background-image:url('https://images.unsplash.com/photo-1459262838948-3e2de6c1ec80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=64&h=64&q=80');"></div>
  </div>
</div>
@slot('code')
<div class="bg-no-repeat bg-left-top bg-gray-400 w-24 h-24" style="background-image: url(...);"></div>
<div class="bg-no-repeat bg-top bg-gray-400 w-24 h-24" style="background-image: url(...);"></div>
<div class="bg-no-repeat bg-right-top bg-gray-400 w-24 h-24" style="background-image: url(...);"></div>
<div class="bg-no-repeat bg-left bg-gray-400 w-24 h-24" style="background-image: url(...);"></div>
<div class="bg-no-repeat bg-center bg-gray-400 w-24 h-24" style="background-image: url(...);"></div>
<div class="bg-no-repeat bg-right bg-gray-400 w-24 h-24" style="background-image: url(...);"></div>
<div class="bg-no-repeat bg-left-bottom bg-gray-400 w-24 h-24" style="background-image: url(...);"></div>
<div class="bg-no-repeat bg-bottom bg-gray-400 w-24 h-24" style="background-image: url(...);"></div>
<div class="bg-no-repeat bg-right-bottom bg-gray-400 w-24 h-24" style="background-image: url(...);"></div>
@endslot
@endcomponent

## Responsive

To control the position of an element's background image at a specific breakpoint, add a `{screen}:` prefix to any existing background position utility. For example, adding the class `md:bg-top` to an element would apply the `bg-top` utility at medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

@component('_partials.responsive-code-sample')
@slot('none')
<div class="mx-auto bg-gray-400 w-48 h-48 bg-center bg-no-repeat" style="background-image: url('https://images.unsplash.com/photo-1459262838948-3e2de6c1ec80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=128&h=128&q=80')"></div>
@endslot

@slot('sm')
<div class="mx-auto bg-gray-400 w-48 h-48 bg-top bg-no-repeat" style="background-image: url('https://images.unsplash.com/photo-1459262838948-3e2de6c1ec80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=128&h=128&q=80')"></div>
@endslot

@slot('md')
<div class="mx-auto bg-gray-400 w-48 h-48 bg-right bg-no-repeat" style="background-image: url('https://images.unsplash.com/photo-1459262838948-3e2de6c1ec80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=128&h=128&q=80')"></div>
@endslot

@slot('lg')
<div class="mx-auto bg-gray-400 w-48 h-48 bg-bottom bg-no-repeat" style="background-image: url('https://images.unsplash.com/photo-1459262838948-3e2de6c1ec80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=128&h=128&q=80')"></div>
@endslot

@slot('xl')
<div class="mx-auto bg-gray-400 w-48 h-48 bg-left bg-no-repeat" style="background-image: url('https://images.unsplash.com/photo-1459262838948-3e2de6c1ec80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=128&h=128&q=80')"></div>
@endslot

@slot('code')
<div class="none:bg-center sm:bg-top md:bg-right lg:bg-bottom xl:bg-left ..." style="background-image: url(...)"></div>
@endslot
@endcomponent

## Customizing

### Background Positions

By default Tailwind provides nine `background-position` utilities. You change, add, or remove these by editing the `theme.backgroundPosition` section of your Tailwind config.

@component('_partials.customized-config', ['key' => 'theme.backgroundPosition'])
  bottom: 'bottom',
+ 'bottom-4': 'center bottom 1rem',
  center: 'center',
  left: 'left',
- 'left-bottom': 'left bottom',
- 'left-top': 'left top',
  right: 'right',
  'right-bottom': 'right bottom',
  'right-top': 'right top',
  top: 'top',
+ 'top-4': 'center top 1rem',
@endcomponent


@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'background position',
        'property' => 'backgroundPosition',
    ],
    'variants' => [
        'responsive',
    ],
])
