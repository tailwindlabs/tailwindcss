---
extends: _layouts.documentation
title: "Column Gap"
description: "Utilities for controlling the column gap spacing."
features:
  responsive: true
  customizable: true
  hover: false
  focus: false
---

@include('_partials.work-in-progress')

We do not include any default values for column gap. If you'd like to add column gap utilities to your project, add the values you need under the columnGap key in your theme.

@component('_partials.customized-config', ['key' => 'theme.columnGap'])
+ '1': '0.25rem',
+ '4': '1rem',
+ '35': '35px',
@endcomponent
