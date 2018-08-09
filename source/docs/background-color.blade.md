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

To control the background color of an element on hover, add the `hover:` prefix to any existing background color utility. For example, use `hover:bg-blue` to apply the `bg-blue` utility on hover.

@component('_partials.code-sample', ['class' => 'text-center'])
<button type="button" class="bg-blue hover:bg-blue-dark text-white font-semibold px-4 py-2 rounded">
  Hover me
</button>

@slot('code')
<button class="bg-blue hover:bg-blue-dark ...">
  Hover me
</button>
@endslot
@endcomponent

Hover utilities can also be combined with responsive utilities by adding the responsive `{screen}:` prefix *before* the `focus:` prefix.

```html
<button class="... md:bg-blue md:hover:bg-blue-dark ...">Button</button>
```

## Focus

To control the background color of an element on focus, add the `focus:` prefix to any existing background color utility. For example, use `focus:bg-blue` to apply the `bg-blue` utility on focus.

@component('_partials.code-sample', ['lang' => 'html'])
<div class="max-w-xs w-full mx-auto">
  <input class="border border-grey-lighter bg-grey-lighter focus:bg-white focus:shadow-outline text-black appearance-none inline-block w-full text-black border rounded py-3 px-4 focus:outline-none" placeholder="Focus me">
</div>

@slot('code')
<input class="bg-grey-lighter focus:bg-white ...">
@endslot
@endcomponent

Focus utilities can also be combined with responsive utilities by adding the responsive `{screen}:` prefix *before* the `focus:` prefix.

```html
<input class="... md:bg-grey-lighter md:focus:bg-white ...">
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
        'focus'
    ],
])
