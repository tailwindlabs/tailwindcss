---
extends: _layouts.documentation
title: "Text Color"
description: "Utilities for controlling the text color of an element."
features:
  responsive: true
  customizable: true
  hover: true
  active: false
  focus: false
---

@include('_partials.work-in-progress')

@include('_partials.class-table', [
  'rows' => $page->config['colors']->map(function ($value, $name) {
    $class = ".text-{$name}";
    $code = "color: {$value};";
    $color = implode(' ', array_reverse(explode('-', $name)));
    $description = "Set the text color of an element to {$color}.";
    return [
      $class,
      $code,
      $description,
    ];
  })->values()->all()
])

## Hover

In addition to the standard responsive variations, text colors also come in `hover:` variations that apply the given text color on hover.

@component('_partials.code-sample', ['class' => 'text-center'])
<button class="text-blue-dark hover:text-red-dark border-2 border-blue hover:border-red bg-transparent py-2 px-4 font-semibold rounded">
  Button
</button>
@endcomponent

Hover utilities can also be combined with responsive utilities by adding the responsive `{screen}:` prefix *before* the `hover:` prefix.

```html
<button class="... md:text-blue md:hover:text-red ...">Button</button>
```

## Customizing

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'text color',
        'property' => 'textColors',
    ],
    'variants' => [
        'responsive',
        'hover',
    ],
])
