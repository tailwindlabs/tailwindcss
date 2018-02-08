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

## Customizing

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'transition duration',
        'property' => 'transitionDuration',
    ],
    'variants' => [],
])
