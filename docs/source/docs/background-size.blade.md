---
extends: _layouts.documentation
title: "Background Size"
description: "Utilities for controlling the background size of an element's background image."
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
      '.bg-cover',
      'background-size: cover;',
      "Scale the image until it fills the background layer.",
    ],
    [
      '.bg-contain',
      'background-size: contain;',
      "Scale the image to the outer edges without cropping or stretching.",
    ],
  ]
])
