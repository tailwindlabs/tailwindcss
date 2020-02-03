---
extends: _layouts.documentation
title: "Grid Template Rows"
description: "Utilities for controlling the grid template rows."
features:
  responsive: true
  customizable: true
  hover: false
  focus: false
---

@include('_partials.work-in-progress')

We do not include any default values for grid template rows. If you'd like to add grid template row utilities to your project, add the values you need under the gridTemplateRows key in your theme.

@component('_partials.customized-config', ['key' => 'theme.gridTemplateRows'])
+ '1': 'repeat(1, minmax(0, 1fr))',
+ '2': 'repeat(2, minmax(0, 1fr))',
@endcomponent
