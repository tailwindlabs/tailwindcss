---
extends: _layouts.documentation
title: "Skew"
description: "Utilities for skewing elements with transform."
features:
  responsive: true
  customizable: true
  hover: false
  focus: false
---

@include('_partials.class-table', [
  'scroll' => true,
  'rows' => collect([
    ['skew-x', ['--transform-skew-x']],
    ['skew-y', ['--transform-skew-y']],
  ])->flatMap(function ($skew) use ($page) {
    return $page->config['theme']['skew']->map(function ($value, $name) use ($skew) {
      $class = starts_with($name, '-')
        ? ".-{$skew[0]}-".substr($name, 1)
        : ".{$skew[0]}-{$name}";
      $code = collect($skew[1])->map(function ($property) use ($value) {
        return "{$property}: {$value};";
      })->implode("\n");
      return [$class, $code];
    })->values();
  })
])

## Usage

Skew an element by first enabling transforms with the `transform` utility, then specifying the skew angle using the `skew-x-{amount}` and `skew-y-{amount}` utilities.

@component('_partials.code-sample', ['class' => 'bg-white lg:flex justify-around items-center text-sm py-12'])
<img class="h-16 w-16 rounded transform skew-y-0" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80">
<img class="h-16 w-16 rounded transform skew-y-3" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80">
<img class="h-16 w-16 rounded transform skew-y-6" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80">
<img class="h-16 w-16 rounded transform skew-y-12" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80">
@slot('code')
<img class="transform skew-y-0 ...">
<img class="transform skew-y-3 ...">
<img class="transform skew-y-6 ...">
<img class="transform skew-y-12 ...">
@endslot
@endcomponent

Note that because Tailwind implements transforms using [CSS custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties), **the transform utilities are not supported in older browsers like IE11**. If you need transforms for your project and need to support older browsers, [add your own utilities](/docs/adding-new-utilities) or other custom CSS.

## Responsive

To control the scale of an element at a specific breakpoint, add a `{screen}:` prefix to any existing scale utility. For example, use `md:scale-75` to apply the `scale-75` utility at only medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

@component('_partials.responsive-code-sample', ['class' => 'bg-white flex justify-center items-center py-12'])
@slot('none')
<img class="h-16 w-16 rounded transform skew-y-0" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80">
@endslot
@slot('sm')
<img class="h-16 w-16 rounded transform skew-y-12" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80">
@endslot
@slot('md')
<img class="h-16 w-16 rounded transform -skew-y-12" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80">
@endslot
@slot('lg')
<img class="h-16 w-16 rounded transform skew-x-6" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80">
@endslot
@slot('xl')
<img class="h-16 w-16 rounded transform -skew-x-6" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80">
@endslot
@slot('code')
<img class="transform none:skew-y-0 sm:skew-y-12 md:-skew-y-12 lg:skew-x-6 xl:-skew-x-6...">
@endslot
@endcomponent

## Customizing

### Skew scale

By default Tailwind provides seven general purpose skew utilities. You change, add, or remove these by customizing the `skew` section of your Tailwind theme config.

@component('_partials.customized-config', ['key' => 'theme.extend.skew'])
+ '25': '25deg',
+ '60': '60deg',
@endcomponent

Learn more about customizing the default theme in the [theme customization documentation](/docs/theme#customizing-the-default-theme).

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'skew',
        'property' => 'skew',
    ],
    'variants' => [
        'responsive',
        'hover',
        'focus',
    ],
])
