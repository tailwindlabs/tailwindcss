---
extends: _layouts.documentation
title: "Height"
description: "Utilities for setting the height of an element"
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
      '.h-1',
      'height: 0.25rem;',
      "Set the element's height to 0.25rem.",
    ],
    [
      '.h-2',
      'height: 0.5rem;',
      "Set the element's height to 0.5rem.",
    ],
    [
      '.h-3',
      'height: 0.75rem;',
      "Set the element's height to 0.75rem.",
    ],
    [
      '.h-4',
      'height: 1rem;',
      "Set the element's height to 1rem.",
    ],
    [
      '.h-6',
      'height: 1.5rem;',
      "Set the element's height to 1.5rem.",
    ],
    [
      '.h-8',
      'height: 2rem;',
      "Set the element's height to 2rem.",
    ],
    [
      '.h-10',
      'height: 2.5rem;',
      "Set the element's height to 2.5rem.",
    ],
    [
      '.h-12',
      'height: 3rem;',
      "Set the element's height to 3rem.",
    ],
    [
      '.h-16',
      'height: 4rem;',
      "Set the element's height to 4rem.",
    ],
    [
      '.h-24',
      'height: 6rem;',
      "Set the element's height to 6rem.",
    ],
    [
      '.h-32',
      'height: 8rem;',
      "Set the element's height to 8rem.",
    ],
    [
      '.h-48',
      'height: 12rem;',
      "Set the element's height to 12rem.",
    ],
    [
      '.h-64',
      'height: 16rem;',
      "Set the element's height to 16rem.",
    ],
    [
      '.h-auto',
      'height: auto;',
      "Set the element's height to auto.",
    ],
    [
      '.h-px',
      'height: 1px;',
      "Set the element's height to 1px.",
    ],
    [
      '.h-full',
      'height: 100%;',
      "Set the element's height to 100%.",
    ],
    [
      '.h-screen',
      'height: 100vh;',
      "Set the element's height to 100vh.",
    ],
  ]
])

## Customizing

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'height',
        'property' => 'height',
    ],
    'variants' => [
        'responsive',
    ],
])
