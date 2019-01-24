---
extends: _layouts.documentation
title: "Width"
description: "Utilities for setting the width of an element"
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
        '.w-1',
        'width: 0.25rem;',
        "Set the element's width to 0.25rem.",
      ],
      [
        '.w-2',
        'width: 0.5rem;',
        "Set the element's width to 0.5rem.",
      ],
      [
        '.w-3',
        'width: 0.75rem;',
        "Set the element's width to 0.75rem.",
      ],
      [
        '.w-4',
        'width: 1rem;',
        "Set the element's width to 1rem.",
      ],
      [
        '.w-6',
        'width: 1.5rem;',
        "Set the element's width to 1.5rem.",
      ],
      [
        '.w-8',
        'width: 2rem;',
        "Set the element's width to 2rem.",
      ],
      [
        '.w-10',
        'width: 2.5rem;',
        "Set the element's width to 2.5rem.",
      ],
      [
        '.w-12',
        'width: 3rem;',
        "Set the element's width to 3rem.",
      ],
      [
        '.w-16',
        'width: 4rem;',
        "Set the element's width to 4rem.",
      ],
      [
        '.w-24',
        'width: 6rem;',
        "Set the element's width to 6rem.",
      ],
      [
        '.w-32',
        'width: 8rem;',
        "Set the element's width to 8rem.",
      ],
      [
        '.w-48',
        'width: 12rem;',
        "Set the element's width to 12rem.",
      ],
      [
        '.w-64',
        'width: 16rem;',
        "Set the element's width to 16rem.",
      ],
      [
        '.w-auto',
        'width: auto;',
        "Set the element's width to auto.",
      ],
      [
        '.w-px',
        'width: 1px;',
        "Set the element's width to 1px.",
      ],
      [
        '.w-1/2',
        'width: 50%;',
        "Set the element's width to 50%.",
      ],
      [
        '.w-1/3',
        'width: 33.33333%;',
        "Set the element's width to 33.33333%.",
      ],
      [
        '.w-2/3',
        'width: 66.66667%;',
        "Set the element's width to 66.66667%.",
      ],
      [
        '.w-1/4',
        'width: 25%;',
        "Set the element's width to 25%.",
      ],
      [
        '.w-3/4',
        'width: 75%;',
        "Set the element's width to 75%.",
      ],
      [
        '.w-1/5',
        'width: 20%;',
        "Set the element's width to 20%.",
      ],
      [
        '.w-2/5',
        'width: 40%;',
        "Set the element's width to 40%.",
      ],
      [
        '.w-3/5',
        'width: 60%;',
        "Set the element's width to 60%.",
      ],
      [
        '.w-4/5',
        'width: 80%;',
        "Set the element's width to 80%.",
      ],
      [
        '.w-1/6',
        'width: 16.66667%;',
        "Set the element's width to 16.66667%.",
      ],
      [
        '.w-5/6',
        'width: 83.33333%;',
        "Set the element's width to 83.33333%.",
      ],
      [
        '.w-full',
        'width: 100%;',
        "Set the element's width to 100%.",
      ],
      [
        '.w-screen',
        'width: 100vw;',
        "Set the element's width to 100vw.",
      ],
  ]
])

## Customizing

### Width Scale

By default Tailwind provides 15 fixed `width` utilities, 12 percentage-based utilities, an `auto` utility, and a utility for setting the width of an element to match the viewport width. You change, add, or remove these by editing the `width` section of your Tailwind config.

@component('_partials.customized-config', ['key' => 'width'])
  'auto': 'auto',
  'px': '1px',
+ '2px': '2px',
  '1': '0.25rem',
  '2': '0.5rem',
  '3': '0.75rem',
  '4': '1rem',
  '5': '1.25rem',
  '6': '1.5rem',
  '8': '2rem',
- '10': '2.5rem',
- '12': '3rem',
- '16': '4rem',
- '24': '6rem',
- '32': '8rem',
- '48': '12rem',
- '64': '16rem',
  '1/2': '50%',
  '1/3': '33.33333%',
  '2/3': '66.66667%',
  '1/4': '25%',
  '3/4': '75%',
  '1/5': '20%',
  '2/5': '40%',
  '3/5': '60%',
  '4/5': '80%',
  '1/6': '16.66667%',
  '5/6': '83.33333%',
  'full': '100%',
+ 'screen-1/2': '50vw'
- 'screen': '100vw'
+ 'screen-full': '100vw'
@endcomponent

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'width',
        'property' => 'width',
    ],
    'variants' => [
        'responsive',
    ],
])
