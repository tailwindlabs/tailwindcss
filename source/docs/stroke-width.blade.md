---
extends: _layouts.documentation
title: "Stroke Width"
description: "Utilities for styling the stroke width of SVG elements."
---

@include('_partials.work-in-progress')

@include('_partials.class-table', [
  'scroll' => true,
  'rows' => $page->config['theme']['strokeWidth']->map(function ($value, $name) {
    $class = ".stroke-{$name}";
    $code = "stroke-width: {$value};";
    return [$class, $code];
  })
])
