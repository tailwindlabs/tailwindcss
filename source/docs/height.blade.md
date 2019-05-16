---
extends: _layouts.documentation
title: "Height"
description: "Utilities for setting the height of an element"
---

@include('_partials.class-table', [
  'scroll' => true,
  'rows' => $page->config['theme']['height']->map(function ($value, $name) {
    $class = ".h-{$name}";
    $code = "height: {$value};";
    return [$class, $code];
  })
])

## Auto

Use `h-auto` to let the browser determine the height for the element.

@component('_partials.code-sample')
<div class="h-auto w-32 text-center mx-auto bg-gray-400 p-6">h-auto</div>
@slot('code')
<div class="h-auto w-32 p-6 ...">h-auto</div>
@endslot
@endcomponent

## Screen height

Use `h-screen` to make an element span the entire height of the viewport.

@component('_partials.code-sample', ['class' => 'overflow-x-scroll'])
<div class="bg-gray-400 h-screen"></div>
@endcomponent

## Fixed height

Use `h-{number}` or `h-px` to set an element to a fixed height.

@component('_partials.code-sample', ['class' => 'flex justify-around items-end text-sm'])
<div class="mr-3">
  <div class="h-8 w-8 bg-gray-400"></div>
  <p class="text-center mt-2 text-sm">h-8</p>
</div>
<div class="mr-3">
  <div class="h-12 w-12 bg-gray-400"></div>
  <p class="text-center mt-2 text-sm">h-12</p>
</div>
<div>
  <div class="h-16 w-16 bg-gray-400"></div>
  <p class="text-center mt-2 text-sm">h-16</p>
</div>
@slot('code')
<div class="h-8 w-8 ..."></div>
<div class="h-12 w-12 ..."></div>
<div class="h-16 w-16 ..."></div>
@endslot
@endcomponent

## Full height

Use `h-full` to set an element's height to 100% of its parent, as long as the parent has a defined height.

@component('_partials.code-sample', ['class' => 'flex justify-around items-end text-sm'])
<div class="h-48">
  <div class="h-full p-6 bg-gray-400">h-full</div>
</div>
@slot('code')
<div class="h-48">
  <div class="h-full p-6 bg-gray-400">h-full</div>
</div>
@endslot
@endcomponent

---

## Responsive

To control the width of an element at a specific breakpoint, add a `{screen}:` prefix to any existing width utility. For example, adding the class `md:w-full` to an element would apply the `w-full` utility at medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

@component('_partials.responsive-code-sample')
@slot('none')
<div class="h-8 w-32 bg-gray-400"></div>
@endslot

@slot('sm')
<div class="h-12 w-32 bg-gray-400"></div>
@endslot

@slot('md')
<div class="h-16 w-32 bg-gray-400"></div>
@endslot

@slot('lg')
<div class="h-20 w-32 bg-gray-400"></div>
@endslot

@slot('xl')
<div class="h-24 w-32 bg-gray-400"></div>
@endslot

@slot('code')
<div class="none:h-8 none:h-12 none:h-16 none:h-20 none:h-24 w-32 bg-gray-400"></div>
@endslot
@endcomponent

---

## Customizing

### Height Scale

By default, Tailwind's height scale is a combination of the [default spacing scale](/docs/customizing-spacing#default-spacing-scale) as well as some additional values specific to heights.

You can customize the spacing scale for padding, margin, width, and height all at once in the `theme.spacing` section of your `tailwind.config.js` file:

@component('_partials.customized-config', ['key' => 'theme.spacing'])
+ sm: '8px',
+ md: '16px',
+ lg: '24px',
+ xl: '48px',
@endcomponent

To customize height separately, use the `theme.height` section of your `tailwind.config.js` file.

@component('_partials.customized-config', ['key' => 'theme.height'])
+ sm: '8px',
+ md: '16px',
+ lg: '24px',
+ xl: '48px',
@endcomponent

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'height',
        'property' => 'height',
    ],
    'variants' => [
        'responsive',
    ],
])
