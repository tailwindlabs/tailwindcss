---
extends: _layouts.documentation
title: "SVG"
description: "Utilities for styling SVG elements."
---

@include('_partials.class-table', [
  'rows' => [
    [
      '.fill-current',
      'fill: currentColor;',
      'Set the fill color to the current text color.',
    ],
    [
      '.stroke-current',
      'stroke: currentColor;',
      'Set the stroke color to the current text color.',
    ],
  ]
])

## Fill color

Use `.fill-current` to set the fill color of an SVG to the current text color. This makes it easy to set an element's fill color by combining this class with an existing [text color utility](/docs/text-color).

Useful for styling icon sets like [Zondicons](http://www.zondicons.com/) that are drawn entirely with fills.

@component('_partials.code-sample', ['class' => 'text-center'])
<svg class="fill-current text-teal inline-block h-12 w-12" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
  <path d="M18 9.87V20H2V9.87a4.25 4.25 0 0 0 3-.38V14h10V9.5a4.26 4.26 0 0 0 3 .37zM3 0h4l-.67 6.03A3.43 3.43 0 0 1 3 9C1.34 9 .42 7.73.95 6.15L3 0zm5 0h4l.7 6.3c.17 1.5-.91 2.7-2.42 2.7h-.56A2.38 2.38 0 0 1 7.3 6.3L8 0zm5 0h4l2.05 6.15C19.58 7.73 18.65 9 17 9a3.42 3.42 0 0 1-3.33-2.97L13 0z"/>
</svg>
@endcomponent

## Stroke color

Use `.stroke-current` to set the stroke color of an SVG to the current text color. This makes it easy to set an element's stroke color by combining this class with an existing [text color utility](/docs/text-color).

Useful for styling icon sets like [Feather](https://feathericons.com/) that are drawn entirely with strokes.

@component('_partials.code-sample', ['class' => 'text-center'])
<svg class="stroke-current text-purple inline-block h-12 w-12" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="8" cy="21" r="2"></circle>
    <circle cx="20" cy="21" r="2"></circle>
    <path d="M5.67 6H23l-1.68 8.39a2 2 0 0 1-2 1.61H8.75a2 2 0 0 1-2-1.74L5.23 2.74A2 2 0 0 0 3.25 1H1"></path>
</svg>
@endcomponent

## Sizing

Tailwind doesn't provide SVG-specific sizing utilities, but sizing SVGs is a perfect use case for the existing [width](/docs/width) and [height](/docs/height) utilities.

@component('_partials.code-sample', ['class' => 'flex justify-around items-end'])
<svg class="h-8 w-8 fill-current text-blue inline-block" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
  <path d="M18 9.87V20H2V9.87a4.25 4.25 0 0 0 3-.38V14h10V9.5a4.26 4.26 0 0 0 3 .37zM3 0h4l-.67 6.03A3.43 3.43 0 0 1 3 9C1.34 9 .42 7.73.95 6.15L3 0zm5 0h4l.7 6.3c.17 1.5-.91 2.7-2.42 2.7h-.56A2.38 2.38 0 0 1 7.3 6.3L8 0zm5 0h4l2.05 6.15C19.58 7.73 18.65 9 17 9a3.42 3.42 0 0 1-3.33-2.97L13 0z"/>
</svg>
<svg class="h-12 w-12 fill-current text-blue inline-block" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
  <path d="M18 9.87V20H2V9.87a4.25 4.25 0 0 0 3-.38V14h10V9.5a4.26 4.26 0 0 0 3 .37zM3 0h4l-.67 6.03A3.43 3.43 0 0 1 3 9C1.34 9 .42 7.73.95 6.15L3 0zm5 0h4l.7 6.3c.17 1.5-.91 2.7-2.42 2.7h-.56A2.38 2.38 0 0 1 7.3 6.3L8 0zm5 0h4l2.05 6.15C19.58 7.73 18.65 9 17 9a3.42 3.42 0 0 1-3.33-2.97L13 0z"/>
</svg>
<svg class="h-16 w-16 fill-current text-blue inline-block" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
  <path d="M18 9.87V20H2V9.87a4.25 4.25 0 0 0 3-.38V14h10V9.5a4.26 4.26 0 0 0 3 .37zM3 0h4l-.67 6.03A3.43 3.43 0 0 1 3 9C1.34 9 .42 7.73.95 6.15L3 0zm5 0h4l.7 6.3c.17 1.5-.91 2.7-2.42 2.7h-.56A2.38 2.38 0 0 1 7.3 6.3L8 0zm5 0h4l2.05 6.15C19.58 7.73 18.65 9 17 9a3.42 3.42 0 0 1-3.33-2.97L13 0z"/>
</svg>
@endcomponent

## Customizing

### Fill colors

Control which fill utilities Tailwind generates by customizing the `svgFill` key in your Tailwind config file:

@component('_partials.customized-config', ['key' => 'svgFill'])
- 'current': 'currentColor',
+ 'red': colors['red'],
+ 'blue': colors['blue'],
+ 'green': colors['green'],
@endcomponent

### Stroke colors

Control which stroke utilities Tailwind generates by customizing the `svgStroke` key in your Tailwind config file:

@component('_partials.customized-config', ['key' => 'svgStroke'])
- 'current': 'currentColor',
+ 'red': colors['red'],
+ 'blue': colors['blue'],
+ 'green': colors['green'],
@endcomponent

### Responsive and State Variants

By default, no responsive, hover, focus, active, or group-hover variants are generated for fill and stroke utilities.

You can control which variants are generated for both fill and stroke utilities by modifying the `svgFill` and `svgStroke` properties in the `modules` section of your Tailwind config file.

For example, this config will generate responsive and hover variants of the fill utilities and focus variants of the stroke utilities:

```js
{
    // ...
    modules: {
        // ...
        svgFill: ['responsive', 'hover'],
        svgStroke: ['focus'],
    }
}
```

### Disabling

If you aren't using the fill or stroke utilities in your project, you can disable them entirely by setting the `svgFill` and `svgStroke` properties to `false` in the `modules` section of your config file:

```js
{
    // ...
    modules: {
        // ...
        svgFill: false,
        svgStroke: false,
    }
}
```
