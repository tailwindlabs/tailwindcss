---
extends: _layouts.documentation
title: "Width"
description: "Utilities for setting the width of an element"
features:
  responsive: true
  customizable: true
  hover: false
  focus: false
---

@include('_partials.class-table', [
  'scroll' => true,
  'rows' => $page->config['theme']['width']->map(function ($value, $name) {
    $class = ".w-{$name}";
    $code = "width: {$value};";
    $description = "Set the width of an element to <code>{$value}</code>.";
    return [$class, $code, $description];
  })
])

## Auto <span class="ml-2 font-semibold text-gray-600 text-sm uppercase tracking-wide">Default</span>

Use `.w-auto` to let the browser calculate and select the width for the element.

@component('_partials.code-sample')
<div class="w-auto bg-gray-400 mb-4 px-2">.w-auto on block element</div>
<div class="w-auto inline-block bg-gray-400 px-2">.w-auto on inline-block element</div>
@slot('code')
<div class="w-auto ..."></div>
<div class="w-auto inline-block ..."></div>
@endslot
@endcomponent

## Screen Width

Use `.w-screen` to make an element span the entire width of the viewport.

@component('_partials.code-sample', ['class' => 'overflow-x-scroll'])
<div class="w-screen bg-gray-400 h-4"></div>
@endcomponent

## Fixed Width

Use `.w-{number}` or `.w-px` to set an element to a fixed width.

@component('_partials.code-sample')
@foreach (collect([0 => '0', 'px' => '1px'])->union($page->config['theme']['spacing']->except(['0', 'px'])) as $name => $width)
<div class="flex items-center mb-1">
  <p class="text-sm text-gray-600 w-12 mr-2">.w-{{ $name }}</p>
  <div class="h-4 bg-gray-400 w-{{ $name }}"></div>
</div>
@endforeach
@slot('code')
@foreach (collect([0 => '0', 'px' => '1px'])->union($page->config['theme']['spacing']->except(['0', 'px'])) as $name => $width)
<div class="w-{{ $name }} ..."></div>
@endforeach
@endslot
@endcomponent

## Fluid Width

Use `.w-{fraction}` or `.w-full` to set an element to a percentage based width.

@component('_partials.code-sample')
<div class="bg-gray-200 p-4">
  <div class="flex mb-4">
    <div class="w-1/2 p-2 bg-gray-400 text-center">.w-1/2</div>
    <div class="w-1/2 p-2 bg-gray-500 text-center">.w-1/2</div>
  </div>
  <div class="flex mb-4">
    <div class="w-2/5 p-2 bg-gray-400 text-center">.w-2/5</div>
    <div class="w-3/5 p-2 bg-gray-500 text-center">.w-3/5</div>
  </div>
  <div class="flex mb-4">
    <div class="w-1/3 p-2 bg-gray-400 text-center">.w-1/3</div>
    <div class="w-2/3 p-2 bg-gray-500 text-center">.w-2/3</div>
  </div>
  <div class="flex mb-4">
    <div class="w-1/4 p-2 bg-gray-400 text-center">.w-1/4</div>
    <div class="w-3/4 p-2 bg-gray-500 text-center">.w-3/4</div>
  </div>
  <div class="flex mb-4">
    <div class="w-1/5 p-2 bg-gray-400 text-center">.w-1/5</div>
    <div class="w-4/5 p-2 bg-gray-500 text-center">.w-4/5</div>
  </div>
  <div class="flex mb-4">
    <div class="w-1/6 p-2 bg-gray-400 text-center">.w-1/6</div>
    <div class="w-5/6 p-2 bg-gray-500 text-center">.w-5/6</div>
  </div>
  <div class="w-full p-2 bg-gray-400 text-center">.w-full</div>
</div>
@endcomponent

## Responsive

To control the width of an element at a specific breakpoint, add a `{screen}:` prefix to any existing width utility. For example, adding the class `md:w-full` to an element would apply the `w-full` utility at medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

@component('_partials.responsive-code-sample')
@slot('none')
<div class="bg-gray-400 p-4 text-center">
  <div class="inline-block bg-gray-800 text-white p-2 truncate w-1/2">Responsive Element</div>
</div>
@endslot

@slot('sm')
<div class="bg-gray-400 p-4 text-center">
  <div class="inline-block bg-gray-800 text-white p-2 truncate w-auto">Responsive Element</div>
</div>
@endslot

@slot('md')
<div class="bg-gray-400 p-4 text-center">
  <div class="inline-block bg-gray-800 text-white p-2 truncate w-full">Responsive Element</div>
</div>
@endslot

@slot('lg')
<div class="bg-gray-400 p-4 text-center">
  <div class="inline-block bg-gray-800 text-white p-2 truncate w-32">Responsive Element</div>
</div>
@endslot

@slot('xl')
<div class="bg-gray-400 p-4 text-center">
  <div class="inline-block bg-gray-800 text-white p-2 truncate w-3/4">Responsive Element</div>
</div>
@endslot

@slot('code')
<div class="bg-gray-400 p-4 text-center">
  <div class="none:w-1/2 sm:w-auto md:w-full lg:w-32 xl:w-3/4 ...">
    Responsive Element
  </div>
</div>
@endslot
@endcomponent

## Customizing

### Width Scale

By default Tailwind provides 19 fixed `width` utilities, 12 percentage-based utilities, an `auto` utility, and a utility for setting the width of an element to match the viewport width. You change, add, or remove these by editing the `theme.width` section of your `tailwind.config.js` file.

@component('_partials.customized-config', ['key' => 'theme.width', 'usesTheme' => true])
  'auto': 'auto',
  ...theme('spacing'),
+ '72': '18rem',
  '1/2': '50%',
  '1/3': '33.33333%',
  '2/3': '66.66667%',
  '1/4': '25%',
  '3/4': '75%',
  '1/5': '20%',
  '2/5': '40%',
  '3/5': '60%',
  '4/5': '80%',
- '1/6': '16.66667%',
- '5/6': '83.33333%',
  'full': '100%',
+ 'screen-1/2': '50vw'
- 'screen': '100vw'
+ 'screen-full': '100vw'
@endcomponent

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'width',
        'property' => 'width',
    ],
    'variants' => [
        'responsive',
    ],
])
