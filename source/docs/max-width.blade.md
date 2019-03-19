---
extends: _layouts.documentation
title: "Max-Width"
description: "Utilities for setting the maximum width of an element"
features:
  responsive: true
  customizable: true
  hover: false
  focus: false
---

@include('_partials.work-in-progress')

@include('_partials.class-table', [
  'scroll' => false,
  'rows' => [
    [
      '.max-w-xs',
      'max-width: 20rem;',
      "Set the element's maximum width to 20rem.",
    ],
    [
      '.max-w-sm',
      'max-width: 24rem;',
      "Set the element's maximum width to 24rem.",
    ],
    [
      '.max-w-md',
      'max-width: 28rem;',
      "Set the element's maximum width to 28rem.",
    ],
    [
      '.max-w-lg',
      'max-width: 32rem;',
      "Set the element's maximum width to 32rem.",
    ],
    [
      '.max-w-xl',
      'max-width: 36rem;',
      "Set the element's maximum width to 36rem.",
    ],
    [
      '.max-w-2xl',
      'max-width: 42rem;',
      "Set the element's maximum width to 42rem.",
    ],
    [
      '.max-w-3xl',
      'max-width: 48rem;',
      "Set the element's maximum width to 48rem.",
    ],
    [
      '.max-w-4xl',
      'max-width: 56rem;',
      "Set the element's maximum width to 56rem.",
    ],
    [
      '.max-w-5xl',
      'max-width: 64rem;',
      "Set the element's maximum width to 64rem.",
    ],
    [
      '.max-w-6xl',
      'max-width: 72rem;',
      "Set the element's maximum width to 72rem.",
    ],
    [
      '.max-w-full',
      'max-width: 100%;',
      "Set the element's maximum width to 100%.",
    ],
  ]
])

## Customizing

### Max-Width Scale

By default Tailwind provides ten `max-width` utilities. You change, add, or remove these by editing the `maxWidth` values in the `theme` section of your Tailwind config.

@component('_partials.customized-config', ['key' => 'maxWidth'])
  'xs': '20rem',
  'sm': '24rem',
  'md': '28rem',
  'lg': '32rem',
  'xl': '36rem',
- '2xl': '42rem',
- '3xl': '48rem',
- '4xl': '56rem',
- '5xl': '64rem',
- '6xl': '72rem',
+ '1/4': '25%',
+ '1/2': '50%',
+ '3/4': '75%',
  'full': '100%',
@endcomponent

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'max-width',
        'property' => 'maxWidth',
    ],
    'variants' => [
        'responsive',
    ],
])
