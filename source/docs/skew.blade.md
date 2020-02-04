---
extends: _layouts.documentation
title: "Skew"
description: "Utilities for controlling the transform skew amount."
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
    ['skew-x', ['--transform-skew-x']],
    ['skew-y', ['--transform-skew-y']],
  ])->flatMap(function ($skew) use ($page) {
    return $page->config['theme']['skew']->map(function ($value, $name) use ($skew) {
      $class = starts_with($name, '-')
        ? ".-{$skew[0]}-".substr($name, 1)
        : ".{$skew[0]}-{$name}";
      $code = collect($skew[1])->map(function ($property) use ($value) {
        return "{$property}: {$value};";
      })->implode("\n");
      return [$class, $code];
    })->values();
  })
])

