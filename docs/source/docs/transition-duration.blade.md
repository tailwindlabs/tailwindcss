---
extends: _layouts.documentation
title: "Transition Duration"
description: "Utilities for controlling the duration of CSS transitions."
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
      '.transition',
      'transition-duration: .25s;',
      "Set the transition duration to 0.25 seconds.",
    ],
    [
      '.transition-slow',
      'transition-duration: .5s;',
      "Set the transition duration to 0.5 seconds.",
    ],
    [
      '.transition-slower',
      'transition-duration: .75s;',
      "Set the transition duration to 0.75 seconds.",
    ],
    [
      '.transition-fast',
      'transition-duration: .15s;',
      "Set the transition duration to 0.15 seconds.",
    ],
    [
      '.transition-faster',
      'transition-duration: .075s;',
      "Set the transition duration to 0.075 seconds.",
    ],
  ]
])

## Customizing

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'transition duration',
        'property' => 'transitionDuration',
    ],
    'variants' => [],
])
