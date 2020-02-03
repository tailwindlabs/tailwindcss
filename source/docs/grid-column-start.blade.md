---
extends: _layouts.documentation
title: "Grid Column Start"
description: "Utilities for controlling the grid column start position."
features:
  responsive: true
  customizable: true
  hover: false
  focus: false
---

@include('_partials.work-in-progress')

@include('_partials.class-table', [
  'scroll' => true,
  'rows' => $page->config['theme']['gridColumnStart']->map(function ($value, $name) {
    $class = ".col-start-{$name}";
    $code = "grid-column-start: {$value};";
    return [$class, $code];
  })
])
