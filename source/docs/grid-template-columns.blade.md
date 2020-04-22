---
extends: _layouts.documentation
title: "Grid Template Columns"
description: "Utilities for specifying the columns in a grid layout."
featureVersion: "v1.2.0+"
---

@include('_partials.class-table', [
  'scroll' => true,
  'rows' => $page->config['theme']['gridTemplateColumns']->map(function ($value, $name) {
    $class = ".grid-cols-{$name}";
    $code = "grid-template-columns: {$value};";
    return [$class, $code];
  })
])

## Usage

Use the `grid-cols-{n}` utilities to create grids with _n_ equally sized columns.

@component('_partials.code-sample', ['class' => 'bg-white p-8'])
<div class="grid grid-cols-3 gap-4">
  <div class="bg-gray-300 h-12 flex items-center justify-center">1</div>
  <div class="bg-gray-500 h-12 flex items-center justify-center">2</div>
  <div class="bg-gray-300 h-12 flex items-center justify-center">3</div>
  <div class="bg-gray-500 h-12 flex items-center justify-center">4</div>
  <div class="bg-gray-300 h-12 flex items-center justify-center">5</div>
  <div class="bg-gray-500 h-12 flex items-center justify-center">6</div>
  <div class="bg-gray-300 h-12 flex items-center justify-center">7</div>
  <div class="bg-gray-500 h-12 flex items-center justify-center">8</div>
  <div class="bg-gray-300 h-12 flex items-center justify-center">9</div>
</div>
@slot('code')
<div class="grid grid-cols-3 gap-4">
  <div>1</div>
  <!-- ... -->
  <div>9</div>
</div>
@endslot
@endcomponent

## Responsive

To control the columns of a grid at a specific breakpoint, add a `{screen}:` prefix to any existing grid-template-columns utility. For example, use `md:grid-cols-6` to apply the `grid-cols-6` utility at only medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

@component('_partials.responsive-code-sample', ['class' => 'bg-white p-8'])
@slot('none')
<div class="grid grid-cols-1 gap-4">
  <div class="bg-gray-300 h-12"></div>
  <div class="bg-gray-500 h-12"></div>
  <div class="bg-gray-300 h-12"></div>
  <div class="bg-gray-500 h-12"></div>
  <div class="bg-gray-300 h-12"></div>
  <div class="bg-gray-500 h-12"></div>
  <div class="bg-gray-300 h-12"></div>
  <div class="bg-gray-500 h-12"></div>
  <div class="bg-gray-300 h-12"></div>
  <div class="bg-gray-500 h-12"></div>
  <div class="bg-gray-300 h-12"></div>
  <div class="bg-gray-500 h-12"></div>
</div>
@endslot
@slot('sm')
<div class="grid grid-cols-2 gap-4">
  <div class="bg-gray-300 h-12"></div>
  <div class="bg-gray-500 h-12"></div>
  <div class="bg-gray-300 h-12"></div>
  <div class="bg-gray-500 h-12"></div>
  <div class="bg-gray-300 h-12"></div>
  <div class="bg-gray-500 h-12"></div>
  <div class="bg-gray-300 h-12"></div>
  <div class="bg-gray-500 h-12"></div>
  <div class="bg-gray-300 h-12"></div>
  <div class="bg-gray-500 h-12"></div>
  <div class="bg-gray-300 h-12"></div>
  <div class="bg-gray-500 h-12"></div>
</div>
@endslot
@slot('md')
<div class="grid grid-cols-3 gap-4">
  <div class="bg-gray-300 h-12"></div>
  <div class="bg-gray-500 h-12"></div>
  <div class="bg-gray-300 h-12"></div>
  <div class="bg-gray-500 h-12"></div>
  <div class="bg-gray-300 h-12"></div>
  <div class="bg-gray-500 h-12"></div>
  <div class="bg-gray-300 h-12"></div>
  <div class="bg-gray-500 h-12"></div>
  <div class="bg-gray-300 h-12"></div>
  <div class="bg-gray-500 h-12"></div>
  <div class="bg-gray-300 h-12"></div>
  <div class="bg-gray-500 h-12"></div>
</div>
@endslot
@slot('lg')
<div class="grid grid-cols-4 gap-4">
  <div class="bg-gray-300 h-12"></div>
  <div class="bg-gray-500 h-12"></div>
  <div class="bg-gray-300 h-12"></div>
  <div class="bg-gray-500 h-12"></div>
  <div class="bg-gray-300 h-12"></div>
  <div class="bg-gray-500 h-12"></div>
  <div class="bg-gray-300 h-12"></div>
  <div class="bg-gray-500 h-12"></div>
  <div class="bg-gray-300 h-12"></div>
  <div class="bg-gray-500 h-12"></div>
  <div class="bg-gray-300 h-12"></div>
  <div class="bg-gray-500 h-12"></div>
</div>
@endslot
@slot('xl')
<div class="grid grid-cols-6 gap-4">
  <div class="bg-gray-300 h-12"></div>
  <div class="bg-gray-500 h-12"></div>
  <div class="bg-gray-300 h-12"></div>
  <div class="bg-gray-500 h-12"></div>
  <div class="bg-gray-300 h-12"></div>
  <div class="bg-gray-500 h-12"></div>
  <div class="bg-gray-300 h-12"></div>
  <div class="bg-gray-500 h-12"></div>
  <div class="bg-gray-300 h-12"></div>
  <div class="bg-gray-500 h-12"></div>
  <div class="bg-gray-300 h-12"></div>
  <div class="bg-gray-500 h-12"></div>
</div>
@endslot
@slot('code')
<div class="grid none:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
  <!-- ... -->
</div>
@endslot
@endcomponent

## Customizing

By default Tailwind includes grid-template-column utilities for creating basic grids with up to 12 equal width columns. You change, add, or remove these by customizing the `gridTemplateColumns` section of your Tailwind theme config.

You have direct access to the `grid-template-columns` CSS property here so you can make your custom column values as generic or as complicated and site-specific as you like.

@component('_partials.customized-config', ['key' => 'theme.extend.gridTemplateColumns'])
  // Simple 16 column grid
+ '16': 'repeat(16, minmax(0, 1fr))',

  // Complex site-specific column configuration
+ 'footer': '200px minmax(900px, 1fr) 100px',
@endcomponent

Learn more about customizing the default theme in the [theme customization documentation](/docs/theme#customizing-the-default-theme).

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'grid-template-columns',
        'property' => 'gridTemplateColumns',
    ],
    'variants' => ['responsive'],
])
