---
extends: _layouts.documentation
title: "Width"
description: "Utilities for setting the width of an element"
features:
  responsive: true
  customizable: true
  hover: false
  focus: false
---

@include('_partials.work-in-progress')

@include('_partials.class-table', [
  'scroll' => false,
  'rows' => $page->config['theme']['width']->map(function ($value, $name) {
    $class = ".w-{$name}";
    $code = "width: {$value};";
    $description = "Set the width of an element to <code>{$value}</code>.";
    return [$class, $code, $description];
  })
])

## Customizing

### Width Scale

By default Tailwind provides 19 fixed `width` utilities, 12 percentage-based utilities, an `auto` utility, and a utility for setting the width of an element to match the viewport width. You change, add, or remove these by editing the `width` section of your Tailwind config.

@component('_partials.customized-config', ['key' => 'width'])
  'auto': 'auto',
  ...theme('spacing'),
+ '72': '18rem',
  '1/2': '50%',
  '1/3': '33.33333%',
  '2/3': '66.66667%',
  '1/4': '25%',
  '3/4': '75%',
  '1/5': '20%',
  '2/5': '40%',
  '3/5': '60%',
  '4/5': '80%',
- '1/6': '16.66667%',
- '5/6': '83.33333%',
  'full': '100%',
+ 'screen-1/2': '50vw'
- 'screen': '100vw'
+ 'screen-full': '100vw'
@endcomponent

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'width',
        'property' => 'width',
    ],
    'variants' => [
        'responsive',
    ],
])
