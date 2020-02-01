---
extends: _layouts.documentation
title: "Row Gap"
description: "Utilities for controlling the row gap spacing."
features:
  responsive: true
  customizable: true
  hover: false
  focus: false
---

@include('_partials.work-in-progress')

We do not include any default values for row gap. If you'd like to add row gap utilities to your project, add the values you need under the rowGap key in your theme.

@component('_partials.customized-config', ['key' => 'theme.rowGap'])
+ '1': '0.25rem',
+ '4': '1rem',
+ '35': '35px',
@endcomponent
