---
extends: _layouts.documentation
title: "Scale"
description: "Utilities for controlling the transform scale."
features:
  responsive: true
  customizable: true
  hover: false
  focus: false
---

@include('_partials.work-in-progress')

@include('_partials.class-table', [
  'scroll' => true,
  'rows' => collect([
    ['scale', ['--transform-scale-x', '--transform-scale-y']],
    ['scale-x', ['--transform-scale-x']],
    ['scale-y', ['--transform-scale-y']],
  ])->flatMap(function ($scale) use ($page) {
    return $page->config['theme']['scale']->map(function ($value, $name) use ($scale) {
      $class = ".{$scale[0]}-{$name}";
      $code = collect($scale[1])->map(function ($property) use ($value) {
        return "{$property}: {$value};";
      })->implode("\n");
      return [$class, $code];
    })->values();
  })
])
