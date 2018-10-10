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
      'max-width: 30rem;',
      "Set the element's maximum width to 30rem.",
    ],
    [
      '.max-w-md',
      'max-width: 40rem;',
      "Set the element's maximum width to 40rem.",
    ],
    [
      '.max-w-lg',
      'max-width: 50rem;',
      "Set the element's maximum width to 50rem.",
    ],
    [
      '.max-w-xl',
      'max-width: 60rem;',
      "Set the element's maximum width to 60rem.",
    ],
    [
      '.max-w-2xl',
      'max-width: 70rem;',
      "Set the element's maximum width to 70rem.",
    ],
    [
      '.max-w-3xl',
      'max-width: 80rem;',
      "Set the element's maximum width to 80rem.",
    ],
    [
      '.max-w-4xl',
      'max-width: 90rem;',
      "Set the element's maximum width to 90rem.",
    ],
    [
      '.max-w-5xl',
      'max-width: 100rem;',
      "Set the element's maximum width to 100rem.",
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

By default Tailwind provides ten `max-width` utilities. You change, add, or remove these by editing the `maxWidth` section of your Tailwind config.

@component('_partials.customized-config', ['key' => 'maxWidth'])
  'xs': '20rem',
  'sm': '30rem',
  'md': '40rem',
  'lg': '50rem',
  'xl': '60rem',
- '2xl': '70rem',
- '3xl': '80rem',
- '4xl': '90rem',
- '5xl': '100rem',
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
