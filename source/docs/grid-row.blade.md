---
extends: _layouts.documentation
title: "Grid Row"
description: "Utilities for controlling the grid rows."
features:
  responsive: true
  customizable: true
  hover: false
  focus: false
---

@include('_partials.work-in-progress')

We do not include any default values for grid rows. If you'd like to add grid row utilities to your project, add the values you need under the gridRow key in your theme.

@component('_partials.customized-config', ['key' => 'theme.gridRow'])
+ 'span-1': 'span 1 / span 1'
@endcomponent
