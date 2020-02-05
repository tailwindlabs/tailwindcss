---
extends: _layouts.documentation
title: "Grid Row Start / End"
description: "Utilities for controlling how elements are sized and placed across grid rows."
---


@include('_partials.class-table', [
  'scroll' => true,
  'rows' => $page->config['theme']['gridRow']->map(function ($value, $name) {
    $class = ".row-{$name}";
    $code = "grid-row: {$value};";
    return [$class, $code];
  })->concat(
    $page->config['theme']['gridRowStart']->map(function ($value, $name) {
      $class = ".row-start-{$name}";
      $code = "grid-row-start: {$value};";
      return [$class, $code];
    })
  )->concat(
    $page->config['theme']['gridRowEnd']->map(function ($value, $name) {
      $class = ".row-end-{$name}";
      $code = "grid-row-end: {$value};";
      return [$class, $code];
    })
  )
])

## Spanning rows

Use the `rows-span-{n}` utilities to make an element span _n_ rows.

@component('_partials.code-sample', ['class' => 'bg-white p-8'])
<div class="h-64 grid grid-rows-3 grid-flow-col gap-4">
  <div class="row-span-3 bg-gray-500"></div>
  <div class="row-span-1 col-span-2 bg-gray-300"></div>
  <div class="row-span-2 col-span-2 bg-gray-300"></div>
</div>
@slot('code')
<div class="grid grid-rows-3 grid-flow-col gap-4">
  <div class="row-span-3 ..."></div>
  <div class="row-span-1 col-span-2 ..."></div>
  <div class="row-span-2 col-span-2 ..."></div>
</div>
@endslot
@endcomponent

## Starting and ending lines

Use the `row-start-{n}` and `row-end-{n}` utilities to make an element start or end at the _nth_ grid line. These can also be combined with the `row-span-{n}` utilities to span a specific number of rows.

Note that CSS grid lines start at 1, not 0, so a full-height element in a 3-row grid would start at line 1 and end at line 4.

@component('_partials.code-sample', ['class' => 'bg-white p-8'])
<div class="h-64 grid grid-rows-3 grid-flow-col gap-4">
  <div class="row-start-2 row-span-2 bg-gray-500"></div>
  <div class="row-end-3 row-span-2 bg-gray-300"></div>
  <div class="row-start-1 row-end-4 bg-gray-500"></div>
</div>
@slot('code')
<div class="grid grid-rows-3 grid-flow-col gap-4">
  <div class="row-start-2 row-span-2 ..."></div>
  <div class="row-end-3 row-span-2 ..."></div>
  <div class="row-start-1 row-end-4 ..."></div>
</div>
@endslot
@endcomponent

## Responsive

To control the row placement of an element at a specific breakpoint, add a `{screen}:` prefix to any existing grid-row utility. For example, use `md:row-span-3` to apply the `row-span-3` utility at only medium screen sizes and above.

```html
<div class="grid grid-rows-3 ...">
  <div class="row-span-3 sm:row-span-1 md:row-span-2 lg:row-span-3 xl:row-span-1 ..."></div>
</div>
```

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

## Customizing

By default Tailwind includes grid-row utilities for working with grids with up to 6 explicit rows. You change, add, or remove these by customizing the `gridRow`, `gridRowStart`, and `gridRowEnd` sections of your Tailwind theme config.

For creating more `row-{value}` utilities that control the `grid-row` shorthand property directly, customize the `gridRow` section of your Tailwind theme config:

@component('_partials.customized-config', ['key' => 'theme.extend.gridRow'])
+ 'span-16': 'span 16 / span 16',
@endcomponent

We use this internally for our `row-span-{n}` utilities. Note that since this configures the `grid-row` shorthand property directly, we include the word `span` directly in the value name, it's _not_ baked into the class name automatically. That means you are free to add entries that do whatever you want here — they don't just have to be `span` utilities.

To add new `row-start-{n}` utilities, use the `gridRowStart` section of your Tailwind theme config:

@component('_partials.customized-config', ['key' => 'theme.extend.gridRowStart'])
+ '8': '8',
+ '9': '9',
+ '10': '10',
+ '11': '11',
+ '12': '12',
+ '13': '13',
@endcomponent

To add new `row-end-{n}` utilities, use the `gridRowEnd` section of your Tailwind theme config:

@component('_partials.customized-config', ['key' => 'theme.extend.gridRowEnd'])
+ '8': '8',
+ '9': '9',
+ '10': '10',
+ '11': '11',
+ '12': '12',
+ '13': '13',
@endcomponent

Learn more about customizing the default theme in the [theme customization documentation](/docs/theme#customizing-the-default-theme).


### Responsive and pseudo-class variants

By default, only responsive variants are generated for grid-row utilities.

You can control which variants are generated for the grid-row utilities by modifying the `gridRow`, `gridRowStart`, and `gridRowEnd` properties in the `variants` section of your `tailwind.config.js` file.

@component('_partials.customized-config', ['key' => 'variants'])
  // ...
+ gridRow: ['responsive', 'hover'],
+ gridRowStart: ['responsive', 'hover'],
+ gridRowStartEnd: ['responsive', 'hover'],
@endcomponent

Learn more about configuring variants in the [configuring variants documentation](/docs/configuring-variants/).

### Disabling

If you don't plan to use the grid-row utilities in your project, you can disable them entirely by setting the `gridRow`, `gridRowStart`, and `gridRowEnd` properties to `false` in the `corePlugins` section of your `tailwind.config.js` file.

@component('_partials.customized-config', ['key' => 'corePlugins'])
  // ...
+ gridRow: false,
+ gridRowStart: false,
+ gridRowStartEnd: false,
@endcomponent