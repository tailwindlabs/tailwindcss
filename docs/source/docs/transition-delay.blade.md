---
extends: _layouts.documentation
title: "Transition Delay"
description: "Utilities for controlling the delay of CSS transitions."
features:
  responsive: false
  customizable: true
  hover: false
  focus: false
---

@include('_partials.work-in-progress')

@component('_partials.code-sample')
<div class="group flex bg-grey-lighter">
  <div class="flex-1 text-grey-darker text-center trans trans-delay group-hover:bg-white bg-grey-light px-4 py-2 m-2">
    delay
  </div>
  <div class="flex-1 text-grey-darker text-center trans trans-delay-long group-hover:bg-white bg-grey-light px-4 py-2 m-2">
    delay-long
  </div>
  <div class="flex-1 text-grey-darker text-center trans trans-delay-longer group-hover:bg-white bg-grey-light px-4 py-2 m-2">
    delay-longer
  </div>
  <div class="flex-1 text-grey-darker text-center trans trans-delay-longest group-hover:bg-white bg-grey-light px-4 py-2 m-2">
    delay-longest
  </div>
</div>
@endcomponent

@include('_partials.class-table', [
  'rows' => [
    [
      '.trans-delay',
      'transition-delay: 100ms;',
      "Delay the transition for 100 ms.",
    ],
    [
      '.trans-delay-long',
      'transition-delay: 200ms;',
      "Delay the transition for 200 ms.",
    ],
    [
      '.trans-delay-longer',
      'transition-delay: 300ms;',
      "Delay the transition for 300 ms.",
    ],
    [
      '.trans-delay-longest',
      'transition-delay: 400ms;',
      "Delay the transition for 400 ms.",
    ],
    [
      '.trans-delay-none',
      'transition-delay: unset;',
      "Unset any transition delay.",
    ],
  ]
])

## Customizing

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'transition delay',
        'property' => 'transitionDelay',
    ],
    'variants' => [],
])
