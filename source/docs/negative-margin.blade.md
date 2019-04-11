---
extends: _layouts.documentation
title: "Negative Margin"
description: "Utilities for controlling an element's negative margin."
features:
  responsive: true
  customizable: true
  hover: false
  focus: false
---

@include('_partials.class-table', [
  'scroll' => true,
  'rows' => collect([
    ['-m', ['margin']],
    ['-my', ['margin-top', 'margin-bottom']],
    ['-mx', ['margin-right', 'margin-left']],
    ['-mt', ['margin-top']],
    ['-mr', ['margin-right']],
    ['-mb', ['margin-bottom']],
    ['-ml', ['margin-left']],
  ])->flatMap(function ($side) use ($page) {
    return $page->config['theme']['negativeMargin']->map(function ($value, $name) use ($side) {
      $class = ".{$side[0]}-{$name}";
      $code = collect($side[1])->map(function ($property) use ($value) {
      $value = $value === '0' ? '0' : "-{$value}";
        return "{$property}: {$value};";
      })->implode("\n");
      return [$class, $code];
    })->values();
  })
])

## Usage

Control an element's negative margin using the `.-m{side?}-{size}` utilities.

For example, `.-m-6` would add `-1.5rem` of margin on all sides of an element, `.-mx-4` would make the horizontal margin `-1rem`, and `.-mt-2` would add `-.5rem` of margin to the top of the element.

## Responsive

To control the negative margin of an element at a specific breakpoint, add a `{screen}:` prefix to any existing negative margin utility. For example, adding the class `md:-mt-4` to an element would apply the `-mt-4` utility at medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

@component('_partials.responsive-code-sample', ['class' => 'text-center pt-8'])
@slot('none')
<div class="inline-block bg-purple-400 p-8">
    <div class="w-48 h-48 bg-gray-300 -ml-6"></div>
</div>
@endslot

@slot('sm')
<div class="inline-block bg-purple-400 p-8">
    <div class="w-48 h-48 bg-gray-300 -ml-6 -mr-6"></div>
</div>
@endslot

@slot('md')
<div class="inline-block bg-purple-400 p-8">
    <div class="w-48 h-48 bg-gray-300 -ml-6 -mr-6 -mt-12"></div>
</div>
@endslot

@slot('lg')
<div class="inline-block bg-purple-400 p-8">
    <div class="w-48 h-48 bg-gray-300 -ml-6 -mr-6 -mt-12 -mb-2"></div>
</div>
@endslot

@slot('xl')
<div class="inline-block bg-purple-400 p-8">
    <div class="w-48 h-48 bg-gray-300 -m-2"></div>
</div>
@endslot

@slot('code')
<div class="p-8 ...">
    <div class="none:-ml-6 sm:-mr-6 md:-mt-12 lg:-mb-2 xl:-m-2 ..."></div>
</div>
@endslot
@endcomponent

## Customizing

### Negative Margins

By default Tailwind provides 19 fixed negative `margin` utilities. These utilities will also be generated for every side and axis. You change, add, or remove these by editing the `theme.negativeMargin` section of your `tailwind.config.js` file.

@component('_partials.customized-config', ['key' => 'theme.negativeMargin', 'usesTheme' => true])
  ...theme('spacing'),
+ '72': '18rem',
+ '2px': '2px',
@endcomponent

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'negativeMargin',
        'property' => 'negativeMargin',
    ],
    'variants' => [
        'responsive',
    ],
])

