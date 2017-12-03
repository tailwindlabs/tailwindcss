---
extends: _layouts.documentation
title: "Text Sizing"
description: "Utilities for controlling the text size of an element."
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
      '.text-xs',
      'font-size: .75rem;',
      'Set the text size to <code>.75rem</code> (<code>12px</code>).',
    ],
    [
      '.text-sm',
      'font-size: .875rem;',
      'Set the text size to <code>.875rem</code> (<code>14px</code>).',
    ],
    [
      '.text-base',
      'font-size: 1rem;',
      'Set the text size to <code>1rem</code> (<code>16px</code>).',
    ],
    [
      '.text-lg',
      'font-size: 1.125rem;',
      'Set the text size to <code>1.125rem</code> (<code>18px</code>).',
    ],
    [
      '.text-xl',
      'font-size: 1.25rem;',
      'Set the text size to <code>1.25rem</code> (<code>20px</code>).',
    ],
    [
      '.text-2xl',
      'font-size: 1.5rem;',
      'Set the text size to <code>1.5rem</code> (<code>24px</code>).',
    ],
    [
      '.text-3xl',
      'font-size: 1.875rem;',
      'Set the text size to <code>1.875rem</code> (<code>30px</code>).',
    ],
    [
      '.text-4xl',
      'font-size: 2.25rem;',
      'Set the text size to <code>2.25rem</code> (<code>36px</code>).',
    ],
    [
      '.text-5xl',
      'font-size: 3rem;',
      'Set the text size to <code>3rem</code> (<code>48px</code>).',
    ],
  ]
])

## Customizing

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'text sizing',
        'property' => 'textSizes',
    ],
    'variants' => [
        'responsive',
    ],
])
