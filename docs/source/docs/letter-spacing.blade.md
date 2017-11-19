---
extends: _layouts.documentation
title: "Letter Spacing"
description: "Utilities for controlling the tracking (letter spacing) of an element."
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
      '.tracking-tight',
      'letter-spacing: -0.05em;',
      'Set the letter spacing of an element to <code>-0.05em</code>.',
    ],
    [
      '.tracking-normal',
      'letter-spacing: 0;',
      'Set the letter spacing of an element to <code>0</code>.',
    ],
    [
      '.tracking-wide',
      'letter-spacing: 0.05em;',
      'Set the letter spacing of an element to <code>0.05em</code>.',
    ],
  ]
])
