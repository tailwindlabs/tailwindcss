---
extends: _layouts.documentation
title: "Grid Template Columns"
description: "Utilities for controlling the grid template columns."
features:
  responsive: true
  customizable: true
  hover: false
  focus: false
---

@include('_partials.work-in-progress')

@include('_partials.class-table', [
  'scroll' => true,
  'rows' => $page->config['theme']['gridTemplateColumns']->map(function ($value, $name) {
    $class = ".grid-cols-{$name}";
    $code = "grid-template-columns: {$value};";
    return [$class, $code];
  })
])
