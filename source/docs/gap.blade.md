---
extends: _layouts.documentation
title: "Gap"
description: "Utilities for controlling the grid gap (gutter) spacing."
features:
  responsive: true
  customizable: true
  hover: false
  focus: false
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

## Gap

Use `.gap-{number}` to change the gap (gutter) size between rows and columns.

@component('_partials.code-sample')
<div class="grid grid-cols-2 gap-1 bg-red-200">
  <div class="text-gray-700 text-center bg-gray-400 p-2">1</div>
  <div class="text-gray-700 text-center bg-gray-400 p-2">2</div>
  <div class="text-gray-700 text-center bg-gray-400 p-2">3</div>
  <div class="text-gray-700 text-center bg-gray-400 p-2">4</div>
</div>

<div class="grid grid-cols-2 gap-2 bg-red-200 my-6">
  <div class="text-gray-700 text-center bg-gray-400 p-2">1</div>
  <div class="text-gray-700 text-center bg-gray-400 p-2">2</div>
  <div class="text-gray-700 text-center bg-gray-400 p-2">3</div>
  <div class="text-gray-700 text-center bg-gray-400 p-2">4</div>
</div>

<div class="grid grid-cols-2 gap-6 bg-red-200">
  <div class="text-gray-700 text-center bg-gray-400 p-2">1</div>
  <div class="text-gray-700 text-center bg-gray-400 p-2">2</div>
  <div class="text-gray-700 text-center bg-gray-400 p-2">3</div>
  <div class="text-gray-700 text-center bg-gray-400 p-2">4</div>
</div>
@endcomponent

## Row Gap

Use `.row-gap-{number}` to change the gap (gutter) size between rows.

@component('_partials.code-sample')
<div class="grid grid-cols-2 row-gap-1 bg-red-200">
  <div class="text-gray-700 text-center bg-gray-400 p-2">1</div>
  <div class="text-gray-700 text-center bg-gray-400 p-2">2</div>
  <div class="text-gray-700 text-center bg-gray-400 p-2">3</div>
  <div class="text-gray-700 text-center bg-gray-400 p-2">4</div>
</div>

<div class="grid grid-cols-2 row-gap-2 bg-red-200 my-6">
  <div class="text-gray-700 text-center bg-gray-400 p-2">1</div>
  <div class="text-gray-700 text-center bg-gray-400 p-2">2</div>
  <div class="text-gray-700 text-center bg-gray-400 p-2">3</div>
  <div class="text-gray-700 text-center bg-gray-400 p-2">4</div>
</div>

<div class="grid grid-cols-2 row-gap-6 bg-red-200">
  <div class="text-gray-700 text-center bg-gray-400 p-2">1</div>
  <div class="text-gray-700 text-center bg-gray-400 p-2">2</div>
  <div class="text-gray-700 text-center bg-gray-400 p-2">3</div>
  <div class="text-gray-700 text-center bg-gray-400 p-2">4</div>
</div>
@endcomponent

## Column Gap

Use `.col-gap-{number}` to change the gap (gutter) size between columns.

@component('_partials.code-sample')
<div class="grid grid-cols-2 col-gap-1 bg-red-200">
  <div class="text-gray-700 text-center bg-gray-400 p-2">1</div>
  <div class="text-gray-700 text-center bg-gray-400 p-2">2</div>
  <div class="text-gray-700 text-center bg-gray-400 p-2">3</div>
  <div class="text-gray-700 text-center bg-gray-400 p-2">4</div>
</div>

<div class="grid grid-cols-2 col-gap-2 bg-red-200 my-6">
  <div class="text-gray-700 text-center bg-gray-400 p-2">1</div>
  <div class="text-gray-700 text-center bg-gray-400 p-2">2</div>
  <div class="text-gray-700 text-center bg-gray-400 p-2">3</div>
  <div class="text-gray-700 text-center bg-gray-400 p-2">4</div>
</div>

<div class="grid grid-cols-2 col-gap-6 bg-red-200">
  <div class="text-gray-700 text-center bg-gray-400 p-2">1</div>
  <div class="text-gray-700 text-center bg-gray-400 p-2">2</div>
  <div class="text-gray-700 text-center bg-gray-400 p-2">3</div>
  <div class="text-gray-700 text-center bg-gray-400 p-2">4</div>
</div>
@endcomponent

## Responsive

To control how grid gaps are sized at a specific breakpoint, add a `{screen}:` prefix to any existing utility class. For example, use `md:gap-4` to apply the `gap-4` utility at only medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

@component('_partials.responsive-code-sample')
@slot('none')
<div class="grid grid-cols-2 gap-2 bg-red-200 my-6">
  <div class="text-gray-700 text-center bg-gray-400 p-2">1</div>
  <div class="text-gray-700 text-center bg-gray-400 p-2">2</div>
  <div class="text-gray-700 text-center bg-gray-400 p-2">3</div>
  <div class="text-gray-700 text-center bg-gray-400 p-2">4</div>
</div>
@endslot
@slot('sm')
<div class="grid grid-cols-2 gap-1 bg-red-200 my-6">
  <div class="text-gray-700 text-center bg-gray-400 p-2">1</div>
  <div class="text-gray-700 text-center bg-gray-400 p-2">2</div>
  <div class="text-gray-700 text-center bg-gray-400 p-2">3</div>
  <div class="text-gray-700 text-center bg-gray-400 p-2">4</div>
</div>
@endslot
@slot('md')
<div class="grid grid-cols-2 gap-4 bg-red-200 my-6">
  <div class="text-gray-700 text-center bg-gray-400 p-2">1</div>
  <div class="text-gray-700 text-center bg-gray-400 p-2">2</div>
  <div class="text-gray-700 text-center bg-gray-400 p-2">3</div>
  <div class="text-gray-700 text-center bg-gray-400 p-2">4</div>
</div>
@endslot
@slot('lg')
<div class="grid grid-cols-2 row-gap-2 bg-red-200 my-6">
  <div class="text-gray-700 text-center bg-gray-400 p-2">1</div>
  <div class="text-gray-700 text-center bg-gray-400 p-2">2</div>
  <div class="text-gray-700 text-center bg-gray-400 p-2">3</div>
  <div class="text-gray-700 text-center bg-gray-400 p-2">4</div>
</div>
@endslot
@slot('xl')
<div class="grid grid-cols-2 col-gap-6 bg-red-200 my-6">
  <div class="text-gray-700 text-center bg-gray-400 p-2">1</div>
  <div class="text-gray-700 text-center bg-gray-400 p-2">2</div>
  <div class="text-gray-700 text-center bg-gray-400 p-2">3</div>
  <div class="text-gray-700 text-center bg-gray-400 p-2">4</div>
</div>
@endslot
@slot('code')
<div class="grid none:gap-2 sm:gap-1 md:gap-4 lg:row-gap-2 xl:col-gap-6 ...">
  <!-- ... -->
</div>
@endslot
@endcomponent

## Customizing

### Gap scale

By default, Tailwind's grid gap (gutter) scale uses the [default spacing scale](/docs/customizing-spacing#default-spacing-scale).

You can customize the spacing scale for padding, margin, width, and height all at once in the `theme.spacing` or `theme.extend.spacing` sections of your `tailwind.config.js` file:

@component('_partials.customized-config', ['key' => 'theme.extend.spacing'])
+ '72': '18rem',
+ '84': '21rem',
+ '96': '24rem',
@endcomponent

To customize grid gap separately, use the `theme.width` section of your `tailwind.config.js` file.

@component('_partials.customized-config', ['key' => 'theme.extend.width'])
+ '14': '3.5rem',
+ '28': '7rem',
@endcomponent

Learn more about customizing the default theme in the [theme customization documentation](/docs/theme#customizing-the-default-theme).

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'grid gap',
        'property' => 'gap',
    ],
    'variants' => [
        'responsive',
    ],
])
