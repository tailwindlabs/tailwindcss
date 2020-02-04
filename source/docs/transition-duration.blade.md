---
extends: _layouts.documentation
title: "Transition Duration"
description: "Utilities for controlling the speed of CSS transitions."
features:
  responsive: true
  customizable: true
  hover: false
  focus: false
---

@include('_partials.work-in-progress')

@include('_partials.class-table', [
  'scroll' => true,
  'rows' => $page->config['theme']['transitionDuration']->map(function ($value, $name) {
    $class = $name = ".duration-{$name}";
    $code = "transition-duration: {$value};";
    return [$class, $code];
  })
])
