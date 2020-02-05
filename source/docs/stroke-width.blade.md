---
extends: _layouts.documentation
title: "Stroke Width"
description: "Utilities for styling the stroke width of SVG elements."
---

@include('_partials.class-table', [
  'scroll' => true,
  'rows' => $page->config['theme']['strokeWidth']->map(function ($value, $name) {
    $class = ".stroke-{$name}";
    $code = "stroke-width: {$value};";
    return [$class, $code];
  })
])

## Usage

Use the `.stroke-1` or `.stroke-2` utilities to set the stroke width of an SVG. Note that `.stroke-0` will cause no stroke to be painted.

Useful for styling icon sets like [Feather](https://feathericons.com/) that are drawn entirely with strokes.

@component('_partials.code-sample', ['class' => 'text-center'])
<svg class="stroke-current stroke-1 text-green-500 inline-block h-24 w-24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="10"></circle>
  <line x1="14.31" y1="8" x2="20.05" y2="17.94"></line>
  <line x1="9.69" y1="8" x2="21.17" y2="8"></line>
  <line x1="7.38" y1="12" x2="13.12" y2="2.06"></line>
  <line x1="9.69" y1="16" x2="3.95" y2="6.06"></line>
  <line x1="14.31" y1="16" x2="2.83" y2="16"></line>
  <line x1="16.62" y1="12" x2="10.88" y2="21.94"></line>
</svg>
<svg class="stroke-current stroke-2 text-green-500 inline-block h-24 w-24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="10"></circle>
  <line x1="14.31" y1="8" x2="20.05" y2="17.94"></line>
  <line x1="9.69" y1="8" x2="21.17" y2="8"></line>
  <line x1="7.38" y1="12" x2="13.12" y2="2.06"></line>
  <line x1="9.69" y1="16" x2="3.95" y2="6.06"></line>
  <line x1="14.31" y1="16" x2="2.83" y2="16"></line>
  <line x1="16.62" y1="12" x2="10.88" y2="21.94"></line>
</svg>
@slot('code')
<svg class="stroke-current stroke-1 text-green-500 ..."></svg>
<svg class="stroke-current stroke-2 text-green-500 ..."></svg>
@endslot
@endcomponent

## Responsive

To control the stroke width of an SVG element at a specific breakpoint, add a `{screen}:` prefix to any existing width utility. For example, adding the class `md:stroke-2` to an element would apply the `stroke-2` utility at medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

@component('_partials.responsive-code-sample', ['class' => 'text-center'])
@slot('none')
<svg class="stroke-current stroke-1 text-green-500 inline-block h-24 w-24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="10"></circle>
  <line x1="14.31" y1="8" x2="20.05" y2="17.94"></line>
  <line x1="9.69" y1="8" x2="21.17" y2="8"></line>
  <line x1="7.38" y1="12" x2="13.12" y2="2.06"></line>
  <line x1="9.69" y1="16" x2="3.95" y2="6.06"></line>
  <line x1="14.31" y1="16" x2="2.83" y2="16"></line>
  <line x1="16.62" y1="12" x2="10.88" y2="21.94"></line>
</svg>
@endslot

@slot('sm')
<svg class="stroke-current stroke-2 text-green-500 inline-block h-24 w-24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="10"></circle>
  <line x1="14.31" y1="8" x2="20.05" y2="17.94"></line>
  <line x1="9.69" y1="8" x2="21.17" y2="8"></line>
  <line x1="7.38" y1="12" x2="13.12" y2="2.06"></line>
  <line x1="9.69" y1="16" x2="3.95" y2="6.06"></line>
  <line x1="14.31" y1="16" x2="2.83" y2="16"></line>
  <line x1="16.62" y1="12" x2="10.88" y2="21.94"></line>
</svg>
@endslot

@slot('md')
<svg class="stroke-current stroke-1 text-green-500 inline-block h-24 w-24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="10"></circle>
  <line x1="14.31" y1="8" x2="20.05" y2="17.94"></line>
  <line x1="9.69" y1="8" x2="21.17" y2="8"></line>
  <line x1="7.38" y1="12" x2="13.12" y2="2.06"></line>
  <line x1="9.69" y1="16" x2="3.95" y2="6.06"></line>
  <line x1="14.31" y1="16" x2="2.83" y2="16"></line>
  <line x1="16.62" y1="12" x2="10.88" y2="21.94"></line>
</svg>
@endslot

@slot('lg')
<svg class="stroke-current stroke-0 text-green-500 inline-block h-24 w-24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="10"></circle>
  <line x1="14.31" y1="8" x2="20.05" y2="17.94"></line>
  <line x1="9.69" y1="8" x2="21.17" y2="8"></line>
  <line x1="7.38" y1="12" x2="13.12" y2="2.06"></line>
  <line x1="9.69" y1="16" x2="3.95" y2="6.06"></line>
  <line x1="14.31" y1="16" x2="2.83" y2="16"></line>
  <line x1="16.62" y1="12" x2="10.88" y2="21.94"></line>
</svg>
@endslot

@slot('xl')
<svg class="stroke-current stroke-1 text-green-500 inline-block h-24 w-24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="10"></circle>
  <line x1="14.31" y1="8" x2="20.05" y2="17.94"></line>
  <line x1="9.69" y1="8" x2="21.17" y2="8"></line>
  <line x1="7.38" y1="12" x2="13.12" y2="2.06"></line>
  <line x1="9.69" y1="16" x2="3.95" y2="6.06"></line>
  <line x1="14.31" y1="16" x2="2.83" y2="16"></line>
  <line x1="16.62" y1="12" x2="10.88" y2="21.94"></line>
</svg>
@endslot

@slot('code')
<svg class="none:stroke-1 sm:stroke-2 md:stroke-1 lg:stroke-0 xl:stroke-1 ...">
  <!-- ... -->
</svg>
@endslot
@endcomponent

## Customizing

Control which stroke utilities Tailwind generates by customizing the `theme.strokeWidth` section in your `tailwind.config.js` file:

@component('_partials.customized-config', ['key' => 'theme.extend.strokeWidth'])
+ '3': '3',
+ '4': '4',
@endcomponent

Learn more about customizing the default theme in the [theme customization documentation](/docs/theme#customizing-the-default-theme).

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'strokeWidth',
        'property' => 'strokeWidth',
    ],
    'variants' => ['responsive'],
])
