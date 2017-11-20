---
extends: _layouts.documentation
title: "Border Color"
description: "Utilities for controlling the color of an element's borders."
features:
  responsive: true
  customizable: true
  hover: true
  focus: false
---

@include('_partials.work-in-progress')

@include('_partials.class-table', [
  'rows' => $page->config['colors']->map(function ($value, $name) {
    $class = ".border-{$name}";
    $code = "border-color: {$value};";
    $color = implode(' ', array_reverse(explode('-', $name)));
    $description = "Set the border color of an element to {$color}.";
    return [
      $class,
      $code,
      $description,
    ];
  })->values()->all()
])

## Hover

In addition to the standard responsive variations, border colors also come in `hover:` variations that apply the given border color on hover.

@component('_partials.code-sample', ['class' => 'text-center'])
<button class="border-2 border-blue hover:border-red bg-transparent text-blue-dark hover:text-red-dark py-2 px-4 font-semibold rounded">
  Button
</button>
@endcomponent

Hover utilities can also be combined with responsive utilities by adding the responsive `{screen}:` prefix *before* the `hover:` prefix.

```html
<button class="... md:border-blue md:hover:border-red ...">Button</button>
```
