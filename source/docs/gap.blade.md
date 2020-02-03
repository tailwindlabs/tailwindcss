---
extends: _layouts.documentation
title: "Gap"
description: "Utilities for controlling the grid gap spacing."
features:
  responsive: true
  customizable: true
  hover: false
  focus: false
---

@include('_partials.work-in-progress')

@include('_partials.class-table', [
  'scroll' => true,
  'rows' => $page->config['theme']['gap']->map(function ($value, $name) {
    $class = ".gap-{$name}";
    $code = "grid-gap: {$value};\ngap: {$value};";
    return [$class, $code];
  })
])
