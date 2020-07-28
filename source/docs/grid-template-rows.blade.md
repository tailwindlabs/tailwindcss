---
extends: _layouts.documentation
title: "Grid Template Rows"
description: "Utilities for specifying the rows in a grid layout."
featureVersion: "v1.2.0+"
---

@include('_partials.class-table', [
  'scroll' => false,
  'rows' => $page->config['theme']['gridTemplateRows']->map(function ($value, $name) {
    $class = ".grid-rows-{$name}";
    $code = "grid-template-rows: {$value};";
    return [$class, $code];
  })
])

## Usage

Use the `grid-rows-{n}` utilities to create grids with _n_ equally sized rows.

@component('_partials.code-sample', ['class' => 'bg-white p-8'])
<div class="h-64 grid grid-rows-3 grid-flow-col gap-4">
  <div class="bg-gray-300 flex items-center justify-center">1</div>
  <div class="bg-gray-500 flex items-center justify-center">2</div>
  <div class="bg-gray-300 flex items-center justify-center">3</div>
  <div class="bg-gray-500 flex items-center justify-center">4</div>
  <div class="bg-gray-300 flex items-center justify-center">5</div>
  <div class="bg-gray-500 flex items-center justify-center">6</div>
  <div class="bg-gray-300 flex items-center justify-center">7</div>
  <div class="bg-gray-500 flex items-center justify-center">8</div>
  <div class="bg-gray-300 flex items-center justify-center">9</div>
</div>
@slot('code')
<div class="h-64 grid grid-rows-3 grid-flow-col gap-4">
  <div>1</div>
  <!-- ... -->
  <div>9</div>
</div>
@endslot
@endcomponent

## Responsive

To control the rows of a grid at a specific breakpoint, add a `{screen}:` prefix to any existing grid-template-rows utility. For example, use `md:grid-rows-6` to apply the `grid-rows-6` utility at only medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

@component('_partials.responsive-code-sample', ['class' => 'bg-white p-8'])
@slot('none')
<div class="h-64 grid grid-rows-2 grid-flow-col gap-4">
  <div class="bg-gray-300 flex items-center justify-center">1</div>
  <div class="bg-gray-500 flex items-center justify-center">2</div>
  <div class="bg-gray-300 flex items-center justify-center">3</div>
  <div class="bg-gray-500 flex items-center justify-center">4</div>
  <div class="bg-gray-300 flex items-center justify-center">5</div>
  <div class="bg-gray-500 flex items-center justify-center">6</div>
  <div class="bg-gray-300 flex items-center justify-center">7</div>
  <div class="bg-gray-500 flex items-center justify-center">8</div>
  <div class="bg-gray-300 flex items-center justify-center">9</div>
</div>
@endslot
@slot('sm')
<div class="h-64 grid grid-rows-3 grid-flow-col gap-4">
  <div class="bg-gray-300 flex items-center justify-center">1</div>
  <div class="bg-gray-500 flex items-center justify-center">2</div>
  <div class="bg-gray-300 flex items-center justify-center">3</div>
  <div class="bg-gray-500 flex items-center justify-center">4</div>
  <div class="bg-gray-300 flex items-center justify-center">5</div>
  <div class="bg-gray-500 flex items-center justify-center">6</div>
  <div class="bg-gray-300 flex items-center justify-center">7</div>
  <div class="bg-gray-500 flex items-center justify-center">8</div>
  <div class="bg-gray-300 flex items-center justify-center">9</div>
</div>
@endslot
@slot('md')
<div class="h-64 grid grid-rows-4 grid-flow-col gap-4">
  <div class="bg-gray-300 flex items-center justify-center">1</div>
  <div class="bg-gray-500 flex items-center justify-center">2</div>
  <div class="bg-gray-300 flex items-center justify-center">3</div>
  <div class="bg-gray-500 flex items-center justify-center">4</div>
  <div class="bg-gray-300 flex items-center justify-center">5</div>
  <div class="bg-gray-500 flex items-center justify-center">6</div>
  <div class="bg-gray-300 flex items-center justify-center">7</div>
  <div class="bg-gray-500 flex items-center justify-center">8</div>
  <div class="bg-gray-300 flex items-center justify-center">9</div>
</div>
@endslot
@slot('lg')
<div class="h-64 grid grid-rows-5 grid-flow-col gap-4">
  <div class="bg-gray-300 flex items-center justify-center">1</div>
  <div class="bg-gray-500 flex items-center justify-center">2</div>
  <div class="bg-gray-300 flex items-center justify-center">3</div>
  <div class="bg-gray-500 flex items-center justify-center">4</div>
  <div class="bg-gray-300 flex items-center justify-center">5</div>
  <div class="bg-gray-500 flex items-center justify-center">6</div>
  <div class="bg-gray-300 flex items-center justify-center">7</div>
  <div class="bg-gray-500 flex items-center justify-center">8</div>
  <div class="bg-gray-300 flex items-center justify-center">9</div>
</div>
@endslot
@slot('xl')
<div class="h-64 grid grid-rows-6 grid-flow-col gap-4">
  <div class="bg-gray-300 flex items-center justify-center">1</div>
  <div class="bg-gray-500 flex items-center justify-center">2</div>
  <div class="bg-gray-300 flex items-center justify-center">3</div>
  <div class="bg-gray-500 flex items-center justify-center">4</div>
  <div class="bg-gray-300 flex items-center justify-center">5</div>
  <div class="bg-gray-500 flex items-center justify-center">6</div>
  <div class="bg-gray-300 flex items-center justify-center">7</div>
  <div class="bg-gray-500 flex items-center justify-center">8</div>
  <div class="bg-gray-300 flex items-center justify-center">9</div>
</div>
@endslot
@slot('code')
<div class="grid grid-flow-col none:grid-rows-2 sm:grid-rows-3 md:grid-rows-4 lg:grid-rows-5 xl:grid-rows-6 ...">
  <!-- ... -->
</div>
@endslot
@endcomponent

## Customizing

By default Tailwind includes grid-template-row utilities for creating basic grids with up to 6 equal width rows. You change, add, or remove these by customizing the `gridTemplateRows` section of your Tailwind theme config.

You have direct access to the `grid-template-rows` CSS property here so you can make your custom rows values as generic or as complicated and site-specific as you like.

@component('_partials.customized-config', ['key' => 'theme.extend.gridTemplateRows'])
  // Simple 8 row grid
+ '8': 'repeat(8, minmax(0, 1fr))',

  // Complex site-specific row configuration
+ 'layout': '200px minmax(900px, 1fr) 100px',
@endcomponent

Learn more about customizing the default theme in the [theme customization documentation](/docs/theme#customizing-the-default-theme).

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'grid-template-rows',
        'property' => 'gridTemplateRows',
    ],
    'variants' => ['responsive'],
])
