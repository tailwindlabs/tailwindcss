---
extends: _layouts.documentation
title: "Transform Origin"
description: "Utilities for controlling the transform origin."
features:
  responsive: true
  customizable: true
  hover: false
  focus: false
---

@include('_partials.work-in-progress')

@include('_partials.class-table', [
  'scroll' => true,
  'rows' => $page->config['theme']['transformOrigin']->map(function ($value, $name) {
    $class = $name = ".origin-{$name}";
    $code = "transform-origin: {$value};";
    return [$class, $code];
  })
])
