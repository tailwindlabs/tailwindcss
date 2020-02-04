---
extends: _layouts.documentation
title: "Rotate"
description: "Utilities for rotating elements with transform."
---

@include('_partials.class-table', [
  'scroll' => true,
  'rows' => $page->config['theme']['rotate']->map(function ($value, $name) {
    $class = starts_with($name, '-')
        ? ".-rotate-".substr($name, 1)
        : ".rotate-{$name}";
    $code = "--transform-rotate: {$value};";
    return [$class, $code];
  })
])

## Usage

Rotate an element by first enabling transforms with the `transform` utility, then specifying the rotation angle using the `rotate-{angle}` utilities.

@component('_partials.code-sample', ['class' => 'bg-white lg:flex justify-around items-center text-sm py-12'])
<img class="h-16 w-16 rounded transform rotate-0" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80">
<img class="h-16 w-16 rounded transform rotate-45" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80">
<img class="h-16 w-16 rounded transform rotate-90" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80">
<img class="h-16 w-16 rounded transform rotate-180" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80">
@slot('code')
<img class="transform rotate-0 ...">
<img class="transform rotate-45 ...">
<img class="transform rotate-90 ...">
<img class="transform rotate-180 ...">
@endslot
@endcomponent

Note that because Tailwind implements transforms using [CSS custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties), **the transform utilities are not supported in older browsers like IE11**. If you need transforms for your project and need to support older browsers, [add your own utilities](/docs/adding-new-utilities) or other custom CSS.

## Responsive

To control the scale of an element at a specific breakpoint, add a `{screen}:` prefix to any existing scale utility. For example, use `md:scale-75` to apply the `scale-75` utility at only medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

@component('_partials.responsive-code-sample', ['class' => 'bg-white flex justify-center items-center py-12'])
@slot('none')
<img class="h-16 w-16 rounded transform rotate-0" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80">
@endslot
@slot('sm')
<img class="h-16 w-16 rounded transform rotate-45" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80">
@endslot
@slot('md')
<img class="h-16 w-16 rounded transform rotate-90" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80">
@endslot
@slot('lg')
<img class="h-16 w-16 rounded transform rotate-180" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80">
@endslot
@slot('xl')
<img class="h-16 w-16 rounded transform -rotate-90" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80">
@endslot
@slot('code')
<img class="transform none:rotate-0 sm:rotate-45 md:rotate-90 lg:rotate-180 xl:-rotate-90...">
@endslot
@endcomponent

## Customizing

### Rotate scale

By default Tailwind provides seven general purpose rotate utilities. You change, add, or remove these by editing the `theme.rotate` section of your Tailwind config.

@component('_partials.customized-config', ['key' => 'theme.rotate'])
- '-180': '-180deg',
  '-90': '-90deg',
- '-45': '-45deg',
  '0': '0',
  '45': '45deg',
  '90': '90deg',
+ '135': '135deg',
  '180': '180deg',
+ '270': '270deg',
@endcomponent

Learn more about customizing the default theme in the [theme customization documentation](/docs/theme#customizing-the-default-theme).

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'rotate',
        'property' => 'rotate',
    ],
    'variants' => [
        'responsive',
        'hover',
        'focus',
    ],
])
