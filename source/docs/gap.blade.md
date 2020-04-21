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

## Gap

Use `.gap-{size}` to change the gutter size in grid layouts.

@component('_partials.code-sample')
<div>
  <div class="mb-1 text-sm text-gray-600">gap-1</div>
  <div class="grid grid-cols-2 gap-1">
    <div class="text-gray-700 text-center bg-gray-400 h-16"></div>
    <div class="text-gray-700 text-center bg-gray-500 h-16"></div>
    <div class="text-gray-700 text-center bg-gray-500 h-16"></div>
    <div class="text-gray-700 text-center bg-gray-400 h-16"></div>
  </div>
</div>

<div class="mt-8">
  <div class="mb-1 text-sm text-gray-600">gap-2</div>
  <div class="grid grid-cols-2 gap-2">
    <div class="text-gray-700 text-center bg-gray-400 h-16"></div>
    <div class="text-gray-700 text-center bg-gray-500 h-16"></div>
    <div class="text-gray-700 text-center bg-gray-500 h-16"></div>
    <div class="text-gray-700 text-center bg-gray-400 h-16"></div>
  </div>
</div>

<div class="mt-8">
  <div class="mb-1 text-sm text-gray-600">gap-6</div>
  <div class="grid grid-cols-2 gap-6">
    <div class="text-gray-700 text-center bg-gray-400 h-16"></div>
    <div class="text-gray-700 text-center bg-gray-500 h-16"></div>
    <div class="text-gray-700 text-center bg-gray-500 h-16"></div>
    <div class="text-gray-700 text-center bg-gray-400 h-16"></div>
  </div>
</div>
@slot('code')
<div class="grid gap-1 grid-cols-2">
  <!-- ... -->
</div>

<div class="grid gap-2 grid-cols-2">
  <!-- ... -->
</div>

<div class="grid gap-6 grid-cols-2">
  <!-- ... -->
</div>
@endslot
@endcomponent

## Row Gap

Use `.row-gap-{size}` to change the gutter size between rows in grid layouts.

@component('_partials.code-sample')
<div>
  <div class="mb-1 text-sm text-gray-600">row-gap-1</div>
  <div class="grid grid-cols-2 row-gap-1">
    <div class="text-gray-700 text-center bg-gray-400 h-16"></div>
    <div class="text-gray-700 text-center bg-gray-500 h-16"></div>
    <div class="text-gray-700 text-center bg-gray-500 h-16"></div>
    <div class="text-gray-700 text-center bg-gray-400 h-16"></div>
  </div>
</div>

<div class="mt-8">
  <div class="mb-1 text-sm text-gray-600">row-gap-2</div>
  <div class="grid grid-cols-2 row-gap-2">
    <div class="text-gray-700 text-center bg-gray-400 h-16"></div>
    <div class="text-gray-700 text-center bg-gray-500 h-16"></div>
    <div class="text-gray-700 text-center bg-gray-500 h-16"></div>
    <div class="text-gray-700 text-center bg-gray-400 h-16"></div>
  </div>
</div>

<div class="mt-8">
  <div class="mb-1 text-sm text-gray-600">row-gap-6</div>
  <div class="grid grid-cols-2 row-gap-6">
    <div class="text-gray-700 text-center bg-gray-400 h-16"></div>
    <div class="text-gray-700 text-center bg-gray-500 h-16"></div>
    <div class="text-gray-700 text-center bg-gray-500 h-16"></div>
    <div class="text-gray-700 text-center bg-gray-400 h-16"></div>
  </div>
</div>
@slot('code')
<div class="grid row-gap-1 grid-cols-2">
  <!-- ... -->
</div>

<div class="grid row-gap-2 grid-cols-2">
  <!-- ... -->
</div>

<div class="grid row-gap-6 grid-cols-2">
  <!-- ... -->
</div>
@endslot
@endcomponent

## Column Gap

Use `.col-gap-{size}` to change the gutter size between columns in grid layouts.

@component('_partials.code-sample')
<div>
  <div class="mb-1 text-sm text-gray-600">col-gap-1</div>
  <div class="grid grid-cols-2 col-gap-1">
    <div class="text-gray-700 text-center bg-gray-400 h-16"></div>
    <div class="text-gray-700 text-center bg-gray-500 h-16"></div>
    <div class="text-gray-700 text-center bg-gray-500 h-16"></div>
    <div class="text-gray-700 text-center bg-gray-400 h-16"></div>
  </div>
</div>

<div class="mt-8">
  <div class="mb-1 text-sm text-gray-600">col-gap-2</div>
  <div class="grid grid-cols-2 col-gap-2">
    <div class="text-gray-700 text-center bg-gray-400 h-16"></div>
    <div class="text-gray-700 text-center bg-gray-500 h-16"></div>
    <div class="text-gray-700 text-center bg-gray-500 h-16"></div>
    <div class="text-gray-700 text-center bg-gray-400 h-16"></div>
  </div>
</div>

<div class="mt-8">
  <div class="mb-1 text-sm text-gray-600">col-gap-6</div>
  <div class="grid grid-cols-2 col-gap-6">
    <div class="text-gray-700 text-center bg-gray-400 h-16"></div>
    <div class="text-gray-700 text-center bg-gray-500 h-16"></div>
    <div class="text-gray-700 text-center bg-gray-500 h-16"></div>
    <div class="text-gray-700 text-center bg-gray-400 h-16"></div>
  </div>
</div>
@slot('code')
<div class="grid col-gap-1 grid-cols-2">
  <!-- ... -->
</div>

<div class="grid col-gap-2 grid-cols-2">
  <!-- ... -->
</div>

<div class="grid col-gap-6 grid-cols-2">
  <!-- ... -->
</div>
@endslot
@endcomponent

## Responsive

To control the gap at a specific breakpoint, add a `{screen}:` prefix to any existing gap utility. For example, use `md:gap-6` to apply the `gap-6` utility at only medium screen sizes and above.

```html
<div class="grid gap-4 sm:gap-6 md:gap-8 lg:gap-12 xl:gap-16 ...">
  <!-- ... -->
</div>
```

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
    'variants' => $page->config['variants']['gap']->all(),
])
