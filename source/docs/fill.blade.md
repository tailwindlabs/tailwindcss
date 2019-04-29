---
extends: _layouts.documentation
title: "Fill"
description: "Utilities for styling the fill of SVG elements."
---

@include('_partials.class-table', [
  'rows' => [
    [
      '.fill-current',
      'fill: currentColor;',
      'Set the fill color to the current text color.',
    ],
  ]
])

## Usage

Use `.fill-current` to set the fill color of an SVG to the current text color. This makes it easy to set an element's fill color by combining this class with an existing [text color utility](/docs/text-color).

Useful for styling icon sets like [Zondicons](http://www.zondicons.com/) that are drawn entirely with fills.

@component('_partials.code-sample', ['class' => 'text-center'])
<svg class="fill-current text-teal-500 inline-block h-12 w-12" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
  <path d="M18 9.87V20H2V9.87a4.25 4.25 0 0 0 3-.38V14h10V9.5a4.26 4.26 0 0 0 3 .37zM3 0h4l-.67 6.03A3.43 3.43 0 0 1 3 9C1.34 9 .42 7.73.95 6.15L3 0zm5 0h4l.7 6.3c.17 1.5-.91 2.7-2.42 2.7h-.56A2.38 2.38 0 0 1 7.3 6.3L8 0zm5 0h4l2.05 6.15C19.58 7.73 18.65 9 17 9a3.42 3.42 0 0 1-3.33-2.97L13 0z"/>
</svg>
@endcomponent

## Customizing

Control which fill utilities Tailwind generates by customizing the `theme.fill` section of your `tailwind.config.js` file:

@component('_partials.customized-config', ['key' => 'theme'])
- fill: {
- &nbsp;&nbsp;current: 'currentColor',
- }
+ fill: theme => ({
+ &nbsp;&nbsp;'red': theme('colors.red.500'),
+ &nbsp;&nbsp;'green': theme('colors.green.500'),
+ &nbsp;&nbsp;'blue': theme('colors.blue.500'),
+ })
@endcomponent

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'fill',
        'property' => 'fill',
    ],
    'variants' => [],
])
