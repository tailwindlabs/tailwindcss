---
extends: _layouts.documentation
title: "Grid Row End"
description: "Utilities for controlling the grid row end position."
features:
  responsive: true
  customizable: true
  hover: false
  focus: false
---

@include('_partials.work-in-progress')

We do not include any default values for grid row end. If you'd like to add grid row end utilities to your project, add the values you need under the gridRowEnd key in your theme.

@component('_partials.customized-config', ['key' => 'theme.gridRowEnd'])
+ '1': '1',
+ 'span-2': 'span 2',
@endcomponent
