---
extends: _layouts.documentation
title: "Gap"
description: "Utilities for controlling gutters between grid rows and columns."
---

@include('_partials.class-table', [
  'scroll' => true,
  'rows' => collect([
    ['gap', ['gap']],
    ['row-gap', ['row-gap']],
    ['col-gap', ['column-gap']],
  ])->flatMap(function ($side) use ($page) {
    return $page->config['theme']['gap']->map(function ($value, $name) use ($side) {
      $class = starts_with($name, '-')
        ? ".-{$side[0]}-".substr($name, 1)
        : ".{$side[0]}-{$name}";
      $code = collect($side[1])->map(function ($property) use ($value) {
        return "{$property}: {$value};";
      })->implode("\n");
      return [$class, $code];
    })->values();
  })
])


## Usage

Use the `gap-{size}`, `col-gap-{size}`, and `row-gap-{size}` utilities to control the gutter size in grid layouts.

@component('_partials.code-sample', ['class' => 'bg-white p-8'])
<div class="grid gap-4 grid-cols-3">
  <div class="bg-gray-300 h-12"></div>
  <div class="bg-gray-500 h-12"></div>
  <div class="bg-gray-300 h-12"></div>
  <div class="bg-gray-500 h-12"></div>
  <div class="bg-gray-300 h-12"></div>
  <div class="bg-gray-500 h-12"></div>
  <div class="bg-gray-300 h-12"></div>
  <div class="bg-gray-500 h-12"></div>
  <div class="bg-gray-300 h-12"></div>
</div>
@slot('code')
<div class="grid gap-4 grid-cols-3">
  <!-- ... -->
</div>
@endslot
@endcomponent

## Responsive

To control the gap at a specific breakpoint, add a `{screen}:` prefix to any existing gap utility. For example, use `md:gap-6` to apply the `gap-6` utility at only medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

## Customizing

### Gap values

By default Tailwind's gap scale matches your configured [spacing scale](/docs/customizing-spacing).

You can customize the global spacing scale in the `theme.spacing` or `theme.extend.spacing` sections of your `tailwind.config.js` file:

@component('_partials.customized-config', ['key' => 'theme.extend.spacing'])
+ '72': '18rem',
+ '84': '21rem',
+ '96': '24rem',
@endcomponent

To customize the gap scale separately, use the `gap` section of your Tailwind theme config.

@component('_partials.customized-config', ['key' => 'theme.extend.gap'])
+ '11': '2.75rem',
+ '13': '3.25rem',
@endcomponent

Learn more about customizing the default theme in the [theme customization documentation](/docs/theme#customizing-the-default-theme).

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'gap',
        'property' => 'gap',
    ],
    'variants' => $page->config['variants']['gap'],
])
