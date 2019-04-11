---
extends: _layouts.documentation
title: "Margin"
description: "Utilities for controlling an element's margin."
features:
  responsive: true
  customizable: true
  hover: false
  focus: false
---

@include('_partials.class-table', [
  'scroll' => true,
  'rows' => collect([
    ['m', ['margin']],
    ['my', ['margin-top', 'margin-bottom']],
    ['mx', ['margin-right', 'margin-left']],
    ['mt', ['margin-top']],
    ['mr', ['margin-right']],
    ['mb', ['margin-bottom']],
    ['ml', ['margin-left']],
  ])->flatMap(function ($side) use ($page) {
    return $page->config['theme']['margin']->map(function ($value, $name) use ($side) {
      $class = ".{$side[0]}-{$name}";
      $code = collect($side[1])->map(function ($property) use ($value) {
        return "{$property}: {$value};";
      })->implode("\n");
      return [$class, $code];
    })->values();
  })
])

## Usage

Control an element's margin using the `.m{side?}-{size}` utilities.

For example, `.m-6` would add `1.5rem` of margin on all sides of an element, `.mx-0` would make the horizontal margin zero, and `.mt-2` would add `.5rem` of margin to the top of the element.

## Responsive

To control the margin of an element at a specific breakpoint, add a `{screen}:` prefix to any existing background color utility. For example, use `md:mx-4` to apply the `mx-4` utility at only medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

@component('_partials.responsive-code-sample')
@slot('none')
<div class="bg-orange-400 flex">
  <div class="bg-gray-200 flex-1"></div>
  <div class="bg-gray-600 w-12 h-12 m-0"></div>
  <div class="bg-gray-200 flex-1"></div>
</div>
@endslot
@slot('sm')
<div class="bg-orange-400 flex">
  <div class="bg-gray-200 flex-1"></div>
  <div class="bg-gray-600 w-12 h-12 ml-4"></div>
  <div class="bg-gray-200 flex-1"></div>
</div>
@endslot
@slot('md')
<div class="bg-orange-400 flex">
  <div class="bg-gray-200 flex-1"></div>
  <div class="bg-gray-600 w-12 h-12 ml-4 mr-4"></div>
  <div class="bg-gray-200 flex-1"></div>
</div>
@endslot
@slot('lg')
<div class="bg-orange-400 flex">
  <div class="bg-gray-200 flex-1"></div>
  <div class="bg-gray-600 w-12 h-12 ml-4 mr-4 mt-4"></div>
  <div class="bg-gray-200 flex-1"></div>
</div>
@endslot
@slot('xl')
<div class="bg-orange-400 flex">
  <div class="bg-gray-200 flex-1"></div>
  <div class="bg-gray-600 w-12 h-12 ml-4 mr-4 mt-4 mb-4"></div>
  <div class="bg-gray-200 flex-1"></div>
</div>
@endslot
@slot('code')
<div class="bg-orange-400 flex">
  <!-- ... -->
  <div class="none:m-0 sm:ml-4 md:mr-4 lg:mt-4 xl:mb-4 ..."></div>
  <!-- ... -->
</div>
@endslot
@endcomponent

## Customizing

### Margins

By default Tailwind provides 19 fixed `margin` utilities and an `auto` utility. These utilities will also be generated for every side and axis. You change, add, or remove these by editing the `theme.margin` section of your `tailwind.config.js` file.

@component('_partials.customized-config', ['key' => 'theme.margin', 'usesTheme' => true])
- 'auto': 'auto',
  ...theme('spacing'),
+ '72': '18rem',
+ '2px': '2px',
@endcomponent

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'margin',
        'property' => 'margin',
    ],
    'variants' => [
        'responsive',
    ],
])

