---
extends: _layouts.documentation
title: "Grid Row Start / End"
description: "Utilities for controlling the grid rows."
features:
  responsive: true
  customizable: true
  hover: false
  focus: false
---

@include('_partials.work-in-progress')

@include('_partials.class-table', [
  'scroll' => true,
  'rows' => $page->config['theme']['gridRow']->map(function ($value, $name) {
    $class = ".row-{$name}";
    $code = "grid-row: {$value};";
    return [$class, $code];
  })->concat(
    $page->config['theme']['gridRowStart']->map(function ($value, $name) {
      $class = ".row-start-{$name}";
      $code = "grid-row-start: {$value};";
      return [$class, $code];
    })
  )->concat(
    $page->config['theme']['gridRowEnd']->map(function ($value, $name) {
      $class = ".row-end-{$name}";
      $code = "grid-row-end: {$value};";
      return [$class, $code];
    })
  )
])
