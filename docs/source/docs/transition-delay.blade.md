---
extends: _layouts.documentation
title: "Transition Timing"
description: "Utilities for controlling the timing of CSS transitions."
features:
  responsive: false
  customizable: true
  hover: false
  focus: false
---

@include('_partials.work-in-progress')

@include('_partials.class-table', [
  'rows' => [
    [
      '.trans-delay',
      'transition-delay: 0.25s;',
      "Delay the transition for 0.25 seconds.",
    ],
    [
      '.trans-delay-long',
      'transition-delay: 0.5s;',
      "Delay the transition for 0.5 seconds.",
    ],
    [
      '.trans-delay-longer',
      'transition-delay: 0.75s;',
      "Delay the transition for 0.75 seconds.",
    ],
    [
      '.trans-delay-longest',
      'transition-delay: 1s;',
      "Delay the transition for a second.",
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
