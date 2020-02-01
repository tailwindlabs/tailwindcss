---
extends: _layouts.documentation
title: "Grid Column End"
description: "Utilities for controlling the grid column end position."
features:
  responsive: true
  customizable: true
  hover: false
  focus: false
---

@include('_partials.work-in-progress')

@include('_partials.class-table', [
  'scroll' => true,
  'rows' => $page->config['theme']['gridColumnEnd']->map(function ($value, $name) {
    $class = ".col-end-{$name}";
    $code = "grid-column-end: {$value};";
    return [$class, $code];
  })
])
