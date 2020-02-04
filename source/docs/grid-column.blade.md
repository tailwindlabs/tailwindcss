---
extends: _layouts.documentation
title: "Grid Column Start / End"
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
  })->concat(
    $page->config['theme']['gridColumnStart']->map(function ($value, $name) {
      $class = ".col-start-{$name}";
      $code = "grid-column-start: {$value};";
      return [$class, $code];
    })
  )->concat(
    $page->config['theme']['gridColumnEnd']->map(function ($value, $name) {
      $class = ".col-end-{$name}";
      $code = "grid-column-end: {$value};";
      return [$class, $code];
    })
  )
])
