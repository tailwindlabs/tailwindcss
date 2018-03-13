---
extends: _layouts.documentation
title: "Background Size"
description: "Utilities for controlling the background size of an element's background image."
features:
  responsive: true
  customizable: false
  hover: false
  focus: false
---

@include('_partials.work-in-progress')

@include('_partials.class-table', [
  'rows' => [
    [
      '.bg-auto',
      'background-size: auto;',
      "Display the image at its default size.",
    ],
    [
      '.bg-cover',
      'background-size: cover;',
      "Scale the image until it fills the background layer.",
    ],
    [
      '.bg-contain',
      'background-size: contain;',
      "Scale the image to the outer edges without cropping or stretching.",
    ],
  ]
])

## Customizing

By default Tailwind provides utilities for `auto`, `cover`, and `contain` background sizes. You can change, add, or remove these by editing the `backgroundSize` section of your config.

@component('_partials.customized-config', ['key' => 'backgroundSize'])
  'auto': 'auto',
  'cover': 'cover',
  'contain': 'contain',
+ '50%': '50%',
+ '16': '4rem',
@endcomponent

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'background size',
        'property' => 'backgroundSize',
    ],
    'variants' => [
        'responsive',
    ],
])
