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
  'rows' => [
    [
      '.h-1',
      'height: 0.25rem;',
      "Set the element's height to <code>0.25rem</code>.",
    ],
    [
      '.h-2',
      'height: 0.5rem;',
      "Set the element's height to <code>0.5rem</code>.",
    ],
    [
      '.h-3',
      'height: 0.75rem;',
      "Set the element's height to <code>0.75rem</code>.",
    ],
    [
      '.h-4',
      'height: 1rem;',
      "Set the element's height to <code>1rem</code>.",
    ],
    [
      '.h-6',
      'height: 1.5rem;',
      "Set the element's height to <code>1.5rem</code>.",
    ],
    [
      '.h-8',
      'height: 2rem;',
      "Set the element's height to <code>2rem</code>.",
    ],
    [
      '.h-10',
      'height: 2.5rem;',
      "Set the element's height to <code>2.5rem</code>.",
    ],
    [
      '.h-12',
      'height: 3rem;',
      "Set the element's height to <code>3rem</code>.",
    ],
    [
      '.h-16',
      'height: 4rem;',
      "Set the element's height to <code>4rem</code>.",
    ],
    [
      '.h-24',
      'height: 6rem;',
      "Set the element's height to <code>6rem</code>.",
    ],
    [
      '.h-32',
      'height: 8rem;',
      "Set the element's height to <code>8rem</code>.",
    ],
    [
      '.h-48',
      'height: 12rem;',
      "Set the element's height to <code>12rem</code>.",
    ],
    [
      '.h-64',
      'height: 16rem;',
      "Set the element's height to <code>16rem</code>.",
    ],
    [
      '.h-auto',
      'height: auto;',
      "Set the element's height to <code>auto</code>.",
    ],
    [
      '.h-px',
      'height: 1px;',
      "Set the element's height to <code>1px</code>.",
    ],
    [
      '.h-full',
      'height: 100%;',
      "Set the element's height to <code>100%</code>.",
    ],
    [
      '.h-screen',
      'height: 100vh;',
      "Set the element's height to <code>100vh</code>.",
    ],
  ]
])
