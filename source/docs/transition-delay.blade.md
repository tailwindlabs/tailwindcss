---
extends: _layouts.documentation
title: "Transition Delay"
description: "Utilities for controlling the delay of CSS transitions."
featureVersion: "v1.3.0+"
---

@include('_partials.class-table', [
  'scroll' => true,
  'rows' => $page->config['theme']['transitionDelay']->map(function ($value, $name) {
    $class = $name = ".delay-{$name}";
    $code = "transition-delay: {$value};";
    return [$class, $code];
  })
])

## Usage

Use the `delay-{amount}` utilities to control an element's transition-delay.

@component('_partials.code-sample', ['class' => 'bg-white flex justify-around items-center py-12'])
<button class="transition delay-150 duration-300 ease-in-out transform hover:scale-125 bg-blue-500 text-white font-bold py-2 px-4 rounded">
  Hover me
</button>
<button class="transition delay-300 duration-300 ease-in-out transform hover:scale-125 bg-blue-500 text-white font-bold py-2 px-4 rounded">
  Hover me
</button>
<button class="transition delay-700 duration-300 ease-in-out transform hover:scale-125 bg-blue-500 text-white font-bold py-2 px-4 rounded">
  Hover me
</button>
@slot('code')
<button class="transition delay-150 duration-300 ease-in-out ...">Hover me</button>
<button class="transition delay-300 duration-300 ease-in-out ...">Hover me</button>
<button class="transition delay-700 duration-300 ease-in-out ...">Hover me</button>
@endslot
@endcomponent

## Responsive

To control an element's transition-delay at a specific breakpoint, add a `{screen}:` prefix to any existing transition-delay utility. For example, use `md:delay-500` to apply the `delay-500` utility at only medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

## Customizing

### Delay values

By default Tailwind provides eight general purpose transition-delay utilities. You change, add, or remove these by customizing the `transitionDelay` section of your Tailwind theme config.

@component('_partials.customized-config', ['key' => 'theme.extend.transitionDelay'])
+ '0': '0ms',
+ '2000': '2000ms',
@endcomponent

Learn more about customizing the default theme in the [theme customization documentation](/docs/theme#customizing-the-default-theme).

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'transition-delay',
        'property' => 'transitionDelay',
    ],
    'variants' => [
        'responsive',
    ],
])
