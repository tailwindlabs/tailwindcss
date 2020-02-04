---
extends: _layouts.documentation
title: "Scale"
description: "Utilities for scaling elements with transform."
---

@include('_partials.class-table', [
  'scroll' => true,
  'rows' => collect([
    ['scale', ['--transform-scale-x', '--transform-scale-y']],
    ['scale-x', ['--transform-scale-x']],
    ['scale-y', ['--transform-scale-y']],
  ])->flatMap(function ($scale) use ($page) {
    return $page->config['theme']['scale']->map(function ($value, $name) use ($scale) {
      $class = ".{$scale[0]}-{$name}";
      $code = collect($scale[1])->map(function ($property) use ($value) {
        return "{$property}: {$value};";
      })->implode("\n");
      return [$class, $code];
    })->values();
  })
])


## Usage

Control the scale of an element by first enabling transforms with the `transform` utility, then specifying the scale using the `scale-{percentage}`, `scale-x-{percentage}`, and `scale-y-{percentage}` utilities.

@component('_partials.code-sample', ['class' => 'bg-white lg:flex justify-around items-center text-sm py-12'])
<img class="h-16 w-16 rounded transform scale-75" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80">
<img class="h-16 w-16 rounded transform scale-100" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80">
<img class="h-16 w-16 rounded transform scale-125" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80">
<img class="h-16 w-16 rounded transform scale-150" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80">
@slot('code')
<img class="transform scale-75 ...">
<img class="transform scale-100 ...">
<img class="transform scale-125 ...">
<img class="transform scale-150 ...">
@endslot
@endcomponent

Note that because Tailwind implements transforms using [CSS custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties), **the transform utilities are not supported in older browsers like IE11**. If you need transforms for your project and need to support older browsers, [add your own utilities](/docs/adding-new-utilities) or other custom CSS.

## Responsive

To control the scale of an element at a specific breakpoint, add a `{screen}:` prefix to any existing scale utility. For example, use `md:scale-75` to apply the `scale-75` utility at only medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

@component('_partials.responsive-code-sample', ['class' => 'bg-white flex justify-center items-center py-16'])
@slot('none')
<img class="h-16 w-16 rounded transform scale-100" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80">
@endslot
@slot('sm')
<img class="h-16 w-16 rounded transform scale-150" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80">
@endslot
@slot('md')
<img class="h-16 w-16 rounded transform scale-75" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80">
@endslot
@slot('lg')
<img class="h-16 w-16 rounded transform scale-125" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80">
@endslot
@slot('xl')
<img class="h-16 w-16 rounded transform scale-100" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80">
@endslot
@slot('code')
<img class="transform none:scale-100 sm:scale-150 md:scale-75 lg:scale-125 xl:scale-100 ...">
@endslot
@endcomponent

## Customizing

### Scale values

By default Tailwind provides ten general purpose scale utilities. You change, add, or remove these by editing the `theme.scale` section of your Tailwind config.

@component('_partials.customized-config', ['key' => 'theme.scale'])
  '0': '0',
+ '25': '.25',
  '50': '.5',
  '75': '.75',
  '90': '.9',
- '95': '.95',
  '100': '1',
- '105': '1.05',
- '110': '1.1',
  '125': '1.25',
  '150': '1.5',
+ '200': '2',
@endcomponent

Learn more about customizing the default theme in the [theme customization documentation](/docs/theme#customizing-the-default-theme).

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'scale',
        'property' => 'scale',
    ],
    'variants' => [
        'responsive',
        'hover',
        'focus',
    ],
])
