---
extends: _layouts.documentation
title: "Grid Column"
description: "Utilities for controlling the grid columns."
features:
  responsive: true
  customizable: true
  hover: false
  focus: false
---

@include('_partials.work-in-progress')

@include('_partials.class-table', [
  'scroll' => true,
  'rows' => $page->config['theme']['gridColumn']->map(function ($value, $name) {
    $class = ".col-{$name}";
    $code = "grid-column: {$value};";
    return [$class, $code];
  })
])
