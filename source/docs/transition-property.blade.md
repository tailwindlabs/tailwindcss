---
extends: _layouts.documentation
title: "Transition Property"
description: "Utilities for controlling which CSS properties transition."
features:
  responsive: true
  customizable: true
  hover: false
  focus: false
---

@include('_partials.work-in-progress')

@include('_partials.class-table', [
  'scroll' => true,
  'rows' => $page->config['theme']['transitionProperty']->map(function ($value, $name) {
    $class = $name === 'default' ? '.transition' : ".transition-{$name}";
    $code = "transition-property: {$value};";
    return [$class, $code];
  })
])
