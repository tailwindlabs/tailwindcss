---
extends: _layouts.documentation
title: "SVG"
---

# SVG

<div class="text-xl text-slate-light mb-4">
    Useful utilities for styling SVG elements.
</div>

<div class="mb-8">
    @include('_partials.work-in-progress')
</div>

Tailwind doesn't provide SVG-specific utilites. Instead, use the generic sizing utilites to control an SVG's width and height, and the text color utilities to control an SVG's fill color.

@component('_partials.code-sample', ['class' => 'text-center'])
<svg class="inline-block h-12 w-12 text-teal" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
    <path d="M18 9.87V20H2V9.87a4.25 4.25 0 0 0 3-.38V14h10V9.5a4.26 4.26 0 0 0 3 .37zM3 0h4l-.67 6.03A3.43 3.43 0 0 1 3 9C1.34 9 .42 7.73.95 6.15L3 0zm5 0h4l.7 6.3c.17 1.5-.91 2.7-2.42 2.7h-.56A2.38 2.38 0 0 1 7.3 6.3L8 0zm5 0h4l2.05 6.15C19.58 7.73 18.65 9 17 9a3.42 3.42 0 0 1-3.33-2.97L13 0z"/>
</svg>
@endcomponent
