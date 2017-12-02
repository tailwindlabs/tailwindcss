---
extends: _layouts.documentation
title: "Text Color"
description: "Utilities for controlling the text color of an element."
features:
  responsive: true
  customizable: true
  hover: true
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

### Responsive, Hover, and Focus Variants

By default, no focus, or group-hover variants are generated for text color utilities.

You can control which variants are generated for the text color utilities by modifying the `textColors` property in the `modules` section of your Tailwind config file.

For example, this config will _also_ generate focus variants:

```js
{
    // ...
    modules: { 
        // ...
        textColors: ['responsive', 'hover', 'focus'],
    }
}
```

### Disabling

If you aren't using the text color utilities in your project, you can disable them entirely by setting the `textColors` property to `false` in the `modules` section of your config file:

```js
{
    // ...
    modules: {
        // ...
        textColors: false,
    }
}
```
