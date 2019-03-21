---
extends: _layouts.documentation
title: "Padding"
description: "Utilities for controlling an element's padding."
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
    ['p', ['padding']],
    ['py', ['padding-top', 'padding-bottom']],
    ['px', ['padding-right', 'padding-left']],
    ['pt', ['padding-top']],
    ['pr', ['padding-right']],
    ['pb', ['padding-bottom']],
    ['pl', ['padding-left']],
  ])->flatMap(function ($side) use ($page) {
    return $page->config['theme']['padding']->map(function ($value, $name) use ($side) {
      $class = ".{$side[0]}-{$name}";
      $code = collect($side[1])->map(function ($property) use ($value) {
        return "{$property}: {$value};";
      })->implode("\n");
      return [$class, $code];
    });
  })
])

## Usage

Control an element's padding using the `.p{side?}-{size}` utilities.

For example, `.p-6` would add `1.5rem` of padding on all sides of an element, `.px-0` would make the horizontal padding zero, and `.pt-2` would add `.5rem` of padding to the top of the element.

## Customizing

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'padding',
        'property' => 'padding',
    ],
    'variants' => [
        'responsive',
    ],
])

