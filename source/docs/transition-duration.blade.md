---
extends: _layouts.documentation
title: "Transition Duration"
description: "Utilities for controlling the duration of CSS transitions."
features:
  responsive: true
  customizable: true
  hover: false
  focus: false
---

@include('_partials.class-table', [
  'scroll' => true,
  'rows' => $page->config['theme']['transitionDuration']->map(function ($value, $name) {
    $class = $name = ".duration-{$name}";
    $code = "transition-duration: {$value};";
    return [$class, $code];
  })
])

## Usage

Use the `duration-{amount}` utilities to control an element's transition-duration.

@component('_partials.code-sample', ['class' => 'bg-white flex justify-around items-center py-12'])
<button class="transition duration-150 ease-in-out transform hover:scale-125 bg-blue-500 text-white font-bold py-2 px-4 rounded">
  Hover me
</button>
<button class="transition duration-300 ease-in-out transform hover:scale-125 bg-blue-500 text-white font-bold py-2 px-4 rounded">
  Hover me
</button>
<button class="transition duration-700 ease-in-out transform hover:scale-125 bg-blue-500 text-white font-bold py-2 px-4 rounded">
  Hover me
</button>
@slot('code')
<button class="transition duration-150 ease-in-out ...">Hover me</button>
<button class="transition duration-300 ease-in-out ...">Hover me</button>
<button class="transition duration-700 ease-in-out ...">Hover me</button>
@endslot
@endcomponent

## Responsive

To control an element's transition-duration at a specific breakpoint, add a `{screen}:` prefix to any existing transition-duration utility. For example, use `md:duration-500` to apply the `duration-500` utility at only medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

## Customizing

### Duration values

By default Tailwind provides eight general purpose transition-duration utilities. You change, add, or remove these by customizing the `transitionDuration` section of your Tailwind theme config.

@component('_partials.customized-config', ['key' => 'theme.extend.transitionDuration'])
+ '0': '0ms',
+ '2000': '2000ms',
@endcomponent

Learn more about customizing the default theme in the [theme customization documentation](/docs/theme#customizing-the-default-theme).

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'transition-duration',
        'property' => 'transitionDuration',
    ],
    'variants' => [
        'responsive',
    ],
])
