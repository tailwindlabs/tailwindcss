---
extends: _layouts.documentation
title: "Translate"
description: "Utilities for controlling the transform translate distance."
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
    ['translate-x', ['--transform-translate-x']],
    ['translate-y', ['--transform-translate-y']],
  ])->flatMap(function ($translate) use ($page) {
    return $page->config['theme']['translate']->map(function ($value, $name) use ($translate) {
      $class = starts_with($name, '-')
        ? ".-{$translate[0]}-".substr($name, 1)
        : ".{$translate[0]}-{$name}";
      $code = collect($translate[1])->map(function ($property) use ($value) {
        return "{$property}: {$value};";
      })->implode("\n");
      return [$class, $code];
    })->values();
  })
])
