---
extends: _layouts.documentation
title: "Margin"
description: "Utilities for controlling an element's margin."
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
    ['m', ['margin']],
    ['my', ['margin-top', 'margin-bottom']],
    ['mx', ['margin-right', 'margin-left']],
    ['mt', ['margin-top']],
    ['mr', ['margin-right']],
    ['mb', ['margin-bottom']],
    ['ml', ['margin-left']],
  ])->flatMap(function ($side) use ($page) {
    return $page->config['theme']['margin']->map(function ($value, $name) use ($side) {
      $class = ".{$side[0]}-{$name}";
      $code = collect($side[1])->map(function ($property) use ($value) {
        return "{$property}: {$value};";
      })->implode("\n");
      return [$class, $code];
    });
  })
])

## Usage

Control an element's margin using the `.m{side?}-{size}` utilities.

For example, `.m-6` would add `1.5rem` of margin on all sides of an element, `.mx-0` would make the horizontal margin zero, and `.mt-2` would add `.5rem` of margin to the top of the element.

## Customizing

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'margin',
        'property' => 'margin',
    ],
    'variants' => [
        'responsive',
    ],
])

