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

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'width',
        'property' => 'width',
    ],
    'variants' => [
        'responsive',
    ],
])
