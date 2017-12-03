---
extends: _layouts.documentation
title: "Background Attachment"
description: "Utilities for controlling how a background image behaves when scrolling."
features:
  responsive: true
  customizable: false
  hover: false
  focus: false
---

@include('_partials.work-in-progress')

@include('_partials.class-table', [
  'rows' => [
    [
      '.bg-fixed',
      'background-attachment: fixed;',
      'Fix the background image relative to the viewport.',
    ],
    [
      '.bg-local',
      'background-attachment: local;',
      'Scroll the background image with the container and the viewport.',
    ],
    [
      '.bg-scroll',
      'background-attachment: scroll;',
      'Scroll the background image with the viewport but not with the container.',
    ],
  ]
])

## Customizing

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'background attachment',
        'property' => 'backgroundAttachment',
    ],
    'variants' => [
        'responsive',
    ],
])
