---
extends: _layouts.documentation
title: "Background Color"
description: "Utilities for controlling an element's background color."
features:
  responsive: true
  customizable: true
  hover: true
  focus: false
---

@include('_partials.work-in-progress')

@include('_partials.class-table', [
  'rows' => $page->config['colors']->map(function ($value, $name) {
    $class = ".bg-{$name}";
    $code = "background-color: {$value};";
    $color = implode(' ', array_reverse(explode('-', $name)));
    $description = "Set the background color of an element to {$color}.";
    return [
      $class,
      $code,
      $description,
    ];
  })->values()->all()
])

## Hover

In addition to the standard responsive variations, background colors also come in `hover:` variations that apply the given background color on hover.

@component('_partials.code-sample')
<div class="bg-blue hover:bg-purple text-center text-white font-semibold mx-auto px-4 py-2">
  Hover over this element
</div>
@endcomponent

Hover utilities can also be combined with responsive utilities by adding the responsive `{screen}:` prefix *before* the `hover:` prefix.

```html
<button class="... md:bg-orange md:hover:bg-red ...">Button</button>
```

## Customizing

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'background color',
        'property' => 'backgroundColors',
    ],
    'variants' => [
        'responsive',
        'hover',
    ],
])
