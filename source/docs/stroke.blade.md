---
extends: _layouts.documentation
title: "Stroke"
description: "Utilities for styling the stroke of SVG elements."
---

@include('_partials.class-table', [
  'rows' => [
    [
      '.stroke-current',
      'stroke: currentColor;',
      'Set the stroke color to the current text color.',
    ],
  ]
])

## Usage

Use `.stroke-current` to set the stroke color of an SVG to the current text color. This makes it easy to set an element's stroke color by combining this class with an existing [text color utility](/docs/text-color).

Useful for styling icon sets like [Feather](https://feathericons.com/) that are drawn entirely with strokes.

@component('_partials.code-sample', ['class' => 'text-center'])
<svg class="stroke-current text-purple-500 inline-block h-12 w-12" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="8" cy="21" r="2"></circle>
    <circle cx="20" cy="21" r="2"></circle>
    <path d="M5.67 6H23l-1.68 8.39a2 2 0 0 1-2 1.61H8.75a2 2 0 0 1-2-1.74L5.23 2.74A2 2 0 0 0 3.25 1H1"></path>
</svg>
@endcomponent

## Customizing

Control which stroke utilities Tailwind generates by customizing the `theme.stroke` section in your `tailwind.config.js` file:

@component('_partials.customized-config', ['key' => 'theme'])
- stroke: {
- &nbsp;&nbsp;current: 'currentColor',
- }
+ stroke: theme => ({
+ &nbsp;&nbsp;'red': theme('colors.red.500'),
+ &nbsp;&nbsp;'green': theme('colors.green.500'),
+ &nbsp;&nbsp;'blue': theme('colors.blue.500'),
+ })
@endcomponent

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'stroke',
        'property' => 'stroke',
    ],
    'variants' => ['responsive'],
])
