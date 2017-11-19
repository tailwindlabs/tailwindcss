---
extends: _layouts.documentation
title: "Line Height"
description: "Utilities for controlling the leading (line height) of an element."
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
      '.leading-none',
      'line-height: 1;',
      'Set the line height of an element to <code>1</code>.',
    ],
    [
      '.leading-tight',
      'line-height: 1.25;',
      'Set the line height of an element to <code>1.25</code>.',
    ],
    [
      '.leading-normal',
      'line-height: 1.5;',
      'Set the line height of an element to <code>1.5</code>.',
    ],
    [
      '.leading-loose',
      'line-height: 2;',
      'Set the line height of an element to <code>2</code>.',
    ],
  ]
])
