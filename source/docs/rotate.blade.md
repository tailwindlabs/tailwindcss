---
extends: _layouts.documentation
title: "Rotate"
description: "Utilities for controlling the transform rotation angle."
features:
  responsive: true
  customizable: true
  hover: false
  focus: false
---

@include('_partials.work-in-progress')

@include('_partials.class-table', [
  'scroll' => true,
  'rows' => $page->config['theme']['rotate']->map(function ($value, $name) {
    $class = starts_with($name, '-')
        ? ".-rotate-".substr($name, 1)
        : ".rotate-{$name}";
    $code = "--transform-rotate: {$value};";
    return [$class, $code];
  })
])
