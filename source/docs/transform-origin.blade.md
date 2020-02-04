---
extends: _layouts.documentation
title: "Transform Origin"
description: "Utilities for specifying the origin for an element's transformations."
---

@include('_partials.class-table', [
  'scroll' => true,
  'rows' => $page->config['theme']['transformOrigin']->map(function ($value, $name) {
    $class = $name = ".origin-{$name}";
    $code = "transform-origin: {$value};";
    return [$class, $code];
  })
])

## Usage

Specify an element's transform origin using the `origin-{keyword}` utilities.

@component('_partials.code-sample', ['class' => 'bg-white lg:flex justify-around items-center text-sm py-12'])
<div class="bg-gray-600">
  <img class="h-16 w-16 origin-center transform rotate-45" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80">
</div>
<div class="bg-gray-600">
  <img class="h-16 w-16 origin-top-left transform rotate-45" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80">
</div>
<div class="bg-gray-600">
  <img class="h-16 w-16 origin-bottom-right transform rotate-45" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80">
</div>
<div class="bg-gray-600">
  <img class="h-16 w-16 origin-left transform rotate-45" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80">
</div>
@slot('code')
<img class="origin-center transform rotate-45 ...">
<img class="origin-top-left transform rotate-45 ...">
<img class="origin-bottom-right transform rotate-45 ...">
<img class="origin-left transform rotate-45 ...">
@endslot
@endcomponent

## Responsive

To control the transform-origin of an element at a specific breakpoint, add a `{screen}:` prefix to any existing transform-origin utility. For example, use `md:origin-top` to apply the `origin-top` utility at only medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

@component('_partials.responsive-code-sample', ['class' => 'bg-white flex justify-center items-center py-12'])
@slot('none')
<div class="bg-gray-600">
  <img class="h-16 w-16 origin-center transform rotate-45" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80">
</div>
@endslot
@slot('sm')
<div class="bg-gray-600">
  <img class="h-16 w-16 origin-top-left transform rotate-45" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80">
</div>
@endslot
@slot('md')
<div class="bg-gray-600">
  <img class="h-16 w-16 origin-top-right transform rotate-45" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80">
</div>
@endslot
@slot('lg')
<div class="bg-gray-600">
  <img class="h-16 w-16 origin-bottom-right transform rotate-45" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80">
</div>
@endslot
@slot('xl')
<div class="bg-gray-600">
  <img class="h-16 w-16 origin-bottom-left transform rotate-45" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80">
</div>
@endslot
@slot('code')
<img class="origin-center sm:origin-top-left md:origin-top-right lg:origin-bottom-right xl:origin-bottom-left ...">
@endslot
@endcomponent

## Customizing

### Origin values

By default Tailwind provides transform-origin utilities for all of the built-in browser keyword options. You change, add, or remove these by customizing the `transformOrigin` section of your Tailwind theme config.

@component('_partials.customized-config', ['key' => 'theme.extend.transformOrigin'])
+ '24': '6rem',
+ 'full': '100%',
@endcomponent

Learn more about customizing the default theme in the [theme customization documentation](/docs/theme#customizing-the-default-theme).

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'transform-origin',
        'property' => 'transformOrigin',
    ],
    'variants' => [
        'responsive',
    ],
])
