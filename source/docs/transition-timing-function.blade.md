---
extends: _layouts.documentation
title: "Transition Timing Function"
description: "Utilities for controlling the easing of CSS transitions."
---

@include('_partials.class-table', [
  'scroll' => true,
  'rows' => $page->config['theme']['transitionTimingFunction']->map(function ($value, $name) {
    $class = $name = ".ease-{$name}";
    $code = "transition-timing-function: {$value};";
    return [$class, $code];
  })
])

## Usage

Use the `ease-{timing}` utilities to control an element's easing curve.

@component('_partials.code-sample', ['class' => 'bg-white flex justify-around items-center py-12'])
<button class="transition duration-700 ease-in transform hover:scale-125 bg-blue-500 text-white font-bold py-2 px-4 rounded">
  Hover me
</button>
<button class="transition duration-700 ease-out transform hover:scale-125 bg-blue-500 text-white font-bold py-2 px-4 rounded">
  Hover me
</button>
<button class="transition duration-700 ease-in-out transform hover:scale-125 bg-blue-500 text-white font-bold py-2 px-4 rounded">
  Hover me
</button>
@slot('code')
<button class="transition ease-in duration-700 ...">Hover me</button>
<button class="transition ease-out duration-700 ...">Hover me</button>
<button class="transition ease-in-out duration-700 ...">Hover me</button>
@endslot
@endcomponent

## Responsive

To control an element's transition-duration at a specific breakpoint, add a `{screen}:` prefix to any existing transition-duration utility. For example, use `md:duration-500` to apply the `duration-500` utility at only medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

## Customizing

### Timing values

By default Tailwind provides four general purpose transition-timing-function utilities. You change, add, or remove these by customizing the `transitionTimingFunction` section of your Tailwind theme config.

@component('_partials.customized-config', ['key' => 'theme.extend.transitionTimingFunction'])
+ 'ease-in-expo': 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
+ 'ease-out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
@endcomponent

Learn more about customizing the default theme in the [theme customization documentation](/docs/theme#customizing-the-default-theme).

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'transition-timing-function',
        'property' => 'transitionTimingFunction',
    ],
    'variants' => [
        'responsive',
    ],
])
