---
extends: _layouts.documentation
title: "Transition Property"
description: "Utilities for controlling the properties that are transitioned in CSS transitions."
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
        'name' => 'transition property',
        'property' => 'transitionProperty',
    ],
    'variants' => [],
])
