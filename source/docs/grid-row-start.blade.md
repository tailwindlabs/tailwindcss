---
extends: _layouts.documentation
title: "Grid Row Start"
description: "Utilities for controlling the grid row start position."
features:
  responsive: true
  customizable: true
  hover: false
  focus: false
---

@include('_partials.work-in-progress')

We do not include any default values for grid row start. If you'd like to add grid row start utilities to your project, add the values you need under the gridRowStart key in your theme.

@component('_partials.customized-config', ['key' => 'theme.gridRowStart'])
+ '1': '1',
+ 'span-2': 'span 2',
@endcomponent
