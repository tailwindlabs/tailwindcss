---
extends: _layouts.documentation
title: "Text Alignment"
description: "Utilities for controlling the alignment of text."
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
      '.text-left',
      'text-align: left;',
      'Align text to the left.',
    ],
    [
      '.text-center',
      'text-align: center;',
      'Align text to the center.',
    ],
    [
      '.text-right',
      'text-align: right;',
      'Align text to the right.',
    ],
    [
      '.text-justify',
      'text-align: justify;',
      'Justify text.',
    ],
  ]
])
