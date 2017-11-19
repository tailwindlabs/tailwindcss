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
      "Set the element's maximum width to <code>20rem</code>.",
    ],
    [
      '.max-w-sm',
      'max-width: 30rem;',
      "Set the element's maximum width to <code>30rem</code>.",
    ],
    [
      '.max-w-md',
      'max-width: 40rem;',
      "Set the element's maximum width to <code>40rem</code>.",
    ],
    [
      '.max-w-lg',
      'max-width: 50rem;',
      "Set the element's maximum width to <code>50rem</code>.",
    ],
    [
      '.max-w-xl',
      'max-width: 60rem;',
      "Set the element's maximum width to <code>60rem</code>.",
    ],
    [
      '.max-w-2xl',
      'max-width: 70rem;',
      "Set the element's maximum width to <code>70rem</code>.",
    ],
    [
      '.max-w-3xl',
      'max-width: 80rem;',
      "Set the element's maximum width to <code>80rem</code>.",
    ],
    [
      '.max-w-4xl',
      'max-width: 90rem;',
      "Set the element's maximum width to <code>90rem</code>.",
    ],
    [
      '.max-w-5xl',
      'max-width: 100rem;',
      "Set the element's maximum width to <code>100rem</code>.",
    ],
    [
      '.max-w-full',
      'max-width: 100%;',
      "Set the element's maximum width to <code>100%</code>.",
    ],
  ]
])
