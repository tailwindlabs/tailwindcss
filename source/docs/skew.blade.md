---
extends: _layouts.documentation
title: "Skew"
description: "Utilities for controlling the transform skew amount."
features:
  responsive: true
  customizable: true
  hover: false
  focus: false
---

@include('_partials.work-in-progress')

We do not include any default values for skew. If you'd like to add skew utilities to your project, add the values you need under the skew key in your theme.

@component('_partials.customized-config', ['key' => 'theme.skew'])
+ '15': '15deg, 15deg',
+ 'tilt': '.312rad',
@endcomponent
