---
extends: _layouts.documentation
title: "Transition Timing Function"
description: "Utilities for controlling the easing of CSS transitions."
features:
  responsive: true
  customizable: true
  hover: false
  focus: false
---

@include('_partials.work-in-progress')

@include('_partials.class-table', [
  'scroll' => true,
  'rows' => $page->config['theme']['transitionTimingFunction']->map(function ($value, $name) {
    $class = $name = ".ease-{$name}";
    $code = "transition-timing-function: {$value};";
    return [$class, $code];
  })
])
