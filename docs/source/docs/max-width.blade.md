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
