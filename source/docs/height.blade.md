---
extends: _layouts.documentation
title: "Height"
description: "Utilities for setting the height of an element"
features:
  responsive: true
  customizable: true
  hover: false
  focus: false
---

@include('_partials.work-in-progress')

@include('_partials.class-table', [
  'scroll' => true,
  'rows' => $page->config['theme']['height']->map(function ($value, $name) {
    $class = ".h-{$name}";
    $code = "height: {$value};";
    return [$class, $code];
  })
])

## Customizing

### Height Scale

By default Tailwind provides 19 fixed `height` utilities, a 100% height utility, an `auto` utility, and a utility for setting the height of an element to match the viewport height. You change, add, or remove these by editing the `theme.height` section of your Tailwind config.

@component('_partials.customized-config', ['key' => 'theme.height', 'usesTheme' => true])
  'auto': 'auto',
  ...theme('spacing'),
+ '72': '18rem',
+ '1/2': '50%',
  'full': '100%',
+ 'screen-1/2': '50vw'
- 'screen': '100vw'
+ 'screen-full': '100vw'
@endcomponent

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'height',
        'property' => 'height',
    ],
    'variants' => [
        'responsive',
    ],
])
