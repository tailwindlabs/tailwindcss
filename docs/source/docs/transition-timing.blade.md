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

## Customizing

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'transition timing',
        'property' => 'transitionTimingFunction',
    ],
    'variants' => [],
])
