---
extends: _layouts.documentation
title: "Grid Template Rows"
description: "Utilities for controlling the grid template rows."
features:
  responsive: true
  customizable: true
  hover: false
  focus: false
---

@include('_partials.work-in-progress')

@include('_partials.class-table', [
  'scroll' => false,
  'rows' => $page->config['theme']['gridTemplateRows']->map(function ($value, $name) {
    $class = ".grid-rows-{$name}";
    $code = "grid-template-rows: {$value};";
    return [$class, $code];
  })
])
