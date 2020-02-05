---
extends: _layouts.documentation
title: "Grid Column Start / End"
description: "Utilities for controlling how elements are sized and placed across grid columns."
---

@include('_partials.class-table', [
  'scroll' => true,
  'rows' => $page->config['theme']['gridColumn']->map(function ($value, $name) {
    $class = ".col-{$name}";
    $code = "grid-column: {$value};";
    return [$class, $code];
  })->concat(
    $page->config['theme']['gridColumnStart']->map(function ($value, $name) {
      $class = ".col-start-{$name}";
      $code = "grid-column-start: {$value};";
      return [$class, $code];
    })
  )->concat(
    $page->config['theme']['gridColumnEnd']->map(function ($value, $name) {
      $class = ".col-end-{$name}";
      $code = "grid-column-end: {$value};";
      return [$class, $code];
    })
  )
])

## Spanning columns

Use the `col-span-{n}` utilities to make an element span _n_ columns.

@component('_partials.code-sample', ['class' => 'bg-white p-8'])
<div class="grid grid-cols-3 gap-4">
  <div class="col-span-3 bg-gray-300 h-12 flex items-center justify-center"></div>
  <div class="col-span-2 bg-gray-500 h-12 flex items-center justify-center"></div>
  <div class="col-span-1 bg-gray-300 h-12 flex items-center justify-center"></div>
  <div class="col-span-1 bg-gray-300 h-12 flex items-center justify-center"></div>
  <div class="col-span-2 bg-gray-500 h-12 flex items-center justify-center"></div>
</div>
@slot('code')
<div class="grid grid-cols-3 gap-4">
  <div class="col-span-3 ..."></div>
  <div class="col-span-2 ..."></div>
  <div class="col-span-1 ..."></div>
  <div class="col-span-1 ..."></div>
  <div class="col-span-2 ..."></div>
</div>
@endslot
@endcomponent

## Starting and ending lines

Use the `col-start-{n}` and `col-end-{n}` utilities to make an element start or end at the _nth_ grid line. These can also be combined with the `col-span-{n}` utilities to span a specific number of columns.

Note that CSS grid lines start at 1, not 0, so a full-width element in a 6-column grid would start at line 1 and end at line 7.

@component('_partials.code-sample', ['class' => 'bg-white p-8'])
<div class="grid grid-cols-6 gap-4">
  <div class="col-start-2 col-span-4 bg-gray-300 h-12 flex items-center justify-center"></div>
  <div class="col-start-1 col-end-3 bg-gray-500 h-12 flex items-center justify-center"></div>
  <div class="col-end-7 col-span-2 bg-gray-500 h-12 flex items-center justify-center"></div>
  <div class="col-start-1 col-end-7 bg-gray-300 h-12 flex items-center justify-center"></div>
</div>
@slot('code')
<div class="grid grid-cols-6 gap-4">
  <div class="col-start-2 col-span-4 ..."></div>
  <div class="col-start-1 col-end-3 ..."></div>
  <div class="col-end-7 col-span-2 ..."></div>
  <div class="col-start-1 col-end-7 ..."></div>
</div>
@endslot
@endcomponent

## Responsive

To control the column placement of an element at a specific breakpoint, add a `{screen}:` prefix to any existing grid-column utility. For example, use `md:col-span-6` to apply the `col-span-6` utility at only medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

@component('_partials.responsive-code-sample', ['class' => 'bg-white p-8'])
@slot('none')
<div class="grid grid-cols-6 gap-4">
  <div class="col-span-6 bg-gray-500 h-12 flex items-center justify-center"></div>
  <div class="col-span-3 bg-gray-300 h-12 flex items-center justify-center"></div>
  <div class="col-span-3 bg-gray-300 h-12 flex items-center justify-center"></div>
  <div class="col-span-6 bg-gray-500 h-12 flex items-center justify-center"></div>
</div>
@endslot
@slot('sm')
<div class="grid grid-cols-6 gap-4">
  <div class="col-span-4 bg-gray-500 h-12 flex items-center justify-center"></div>
  <div class="col-span-2 bg-gray-300 h-12 flex items-center justify-center"></div>
  <div class="col-span-2 bg-gray-300 h-12 flex items-center justify-center"></div>
  <div class="col-span-4 bg-gray-500 h-12 flex items-center justify-center"></div>
</div>
@endslot
@slot('md')
<div class="grid grid-cols-6 gap-4">
  <div class="col-span-3 bg-gray-500 h-12 flex items-center justify-center"></div>
  <div class="col-span-3 bg-gray-300 h-12 flex items-center justify-center"></div>
  <div class="col-span-3 bg-gray-300 h-12 flex items-center justify-center"></div>
  <div class="col-span-3 bg-gray-500 h-12 flex items-center justify-center"></div>
</div>
@endslot
@slot('lg')
<div class="grid grid-cols-6 gap-4">
  <div class="col-span-5 bg-gray-500 h-12 flex items-center justify-center"></div>
  <div class="col-span-1 bg-gray-300 h-12 flex items-center justify-center"></div>
  <div class="col-span-4 bg-gray-300 h-12 flex items-center justify-center"></div>
  <div class="col-span-2 bg-gray-500 h-12 flex items-center justify-center"></div>
</div>
@endslot
@slot('xl')
<div class="grid grid-cols-6 gap-4">
  <div class="col-span-2 bg-gray-500 h-12 flex items-center justify-center"></div>
  <div class="col-span-4 bg-gray-300 h-12 flex items-center justify-center"></div>
  <div class="col-span-2 bg-gray-300 h-12 flex items-center justify-center"></div>
  <div class="col-span-4 bg-gray-500 h-12 flex items-center justify-center"></div>
</div>
@endslot
@slot('code')
<div class="grid grid-cols-6 gap-4">
  <div class="none:col-span-6 sm:col-span-4 md:col-span-3 lg:col-span-5 xl:col-span-2..."></div>
  <div class="none:col-span-3 sm:col-span-2 md:col-span-3 lg:col-span-1 xl:col-span-4..."></div>
  <div class="none:col-span-3 sm:col-span-2 md:col-span-3 lg:col-span-4 xl:col-span-2..."></div>
  <div class="none:col-span-6 sm:col-span-4 md:col-span-3 lg:col-span-2 xl:col-span-4..."></div>
</div>
@endslot
@endcomponent

## Customizing

By default Tailwind includes grid-column utilities for working with grids with up to 12 columns. You change, add, or remove these by customizing the `gridColumn`, `gridColumnStart`, and `gridColumnEnd` sections of your Tailwind theme config.

For creating more `col-{value}` utilities that control the `grid-column` shorthand property directly, customize the `gridColumn` section of your Tailwind theme config:

@component('_partials.customized-config', ['key' => 'theme.extend.gridColumn'])
+ 'span-16': 'span 16 / span 16',
@endcomponent

We use this internally for our `col-span-{n}` utilities. Note that since this configures the `grid-column` shorthand property directly, we include the word `span` directly in the value name, it's _not_ baked into the class name automatically. That means you are free to add entries that do whatever you want here — they don't just have to be `span` utilities.

To add new `col-start-{n}` utilities, use the `gridColumnStart` section of your Tailwind theme config:

@component('_partials.customized-config', ['key' => 'theme.extend.gridColumnStart'])
+ '13': '13',
+ '14': '14',
+ '15': '15',
+ '16': '16',
+ '17': '17',
@endcomponent

To add new `col-end-{n}` utilities, use the `gridColumnEnd` section of your Tailwind theme config:

@component('_partials.customized-config', ['key' => 'theme.extend.gridColumnEnd'])
+ '13': '13',
+ '14': '14',
+ '15': '15',
+ '16': '16',
+ '17': '17',
@endcomponent

Learn more about customizing the default theme in the [theme customization documentation](/docs/theme#customizing-the-default-theme).


### Responsive and pseudo-class variants

By default, only responsive variants are generated for grid-column utilities.

You can control which variants are generated for the grid-column utilities by modifying the `gridColumn`, `gridColumnStart`, and `gridColumnEnd` properties in the `variants` section of your `tailwind.config.js` file.

@component('_partials.customized-config', ['key' => 'variants'])
  // ...
+ gridColumn: ['responsive', 'hover'],
+ gridColumnStart: ['responsive', 'hover'],
+ gridColumnStartEnd: ['responsive', 'hover'],
@endcomponent

Learn more about configuring variants in the [configuring variants documentation](/docs/configuring-variants/).

### Disabling

If you don't plan to use the grid-column utilities in your project, you can disable them entirely by setting the `gridColumn`, `gridColumnStart`, and `gridColumnEnd` properties to `false` in the `corePlugins` section of your `tailwind.config.js` file.

@component('_partials.customized-config', ['key' => 'corePlugins'])
  // ...
+ gridColumn: false,
+ gridColumnStart: false,
+ gridColumnStartEnd: false,
@endcomponent