---
extends: _layouts.documentation
title: "Padding"
description: "Utilities for controlling an element's padding."
features:
  responsive: true
  customizable: true
  hover: false
  focus: false
---

@include('_partials.class-table', [
  'scroll' => true,
  'rows' => collect([
    ['p', ['padding']],
    ['py', ['padding-top', 'padding-bottom']],
    ['px', ['padding-right', 'padding-left']],
    ['pt', ['padding-top']],
    ['pr', ['padding-right']],
    ['pb', ['padding-bottom']],
    ['pl', ['padding-left']],
  ])->flatMap(function ($side) use ($page) {
    return $page->config['theme']['padding']->map(function ($value, $name) use ($side) {
      $class = ".{$side[0]}-{$name}";
      $code = collect($side[1])->map(function ($property) use ($value) {
        return "{$property}: {$value};";
      })->implode("\n");
      return [$class, $code];
    })->values();
  })
])

## Usage

Control an element's padding using the `.p{side?}-{size}` utilities.

For example, `.p-6` would add `1.5rem` of padding on all sides of an element, `.px-0` would make the horizontal padding zero, and `.pt-2` would add `.5rem` of padding to the top of the element.

## Responsive

To control the padding of an element at a specific breakpoint, add a `{screen}:` prefix to any existing padding utility. For example, adding the class `md:py-8` to an element would apply the `py-8` utility at medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

@component('_partials.responsive-code-sample', ['class' => 'text-center'])
@slot('none')
<div class="inline-block bg-purple-400 pt-8">
    <div class="w-48 h-48 bg-gray-300"></div>
</div>
@endslot

@slot('sm')
<div class="inline-block bg-purple-400 pt-8 pr-6">
    <div class="w-48 h-48 bg-gray-300"></div>
</div>
@endslot

@slot('md')
<div class="inline-block bg-purple-400 pt-8 pr-6 pb-4">
    <div class="w-48 h-48 bg-gray-300"></div>
</div>
@endslot

@slot('lg')
<div class="inline-block bg-purple-400 pt-8 pr-8 pb-4 pl-2">
    <div class="w-48 h-48 bg-gray-300"></div>
</div>
@endslot

@slot('xl')
<div class="inline-block bg-purple-400 p-0">
    <div class="w-48 h-48 bg-gray-300"></div>
</div>
@endslot

@slot('code')
<div class="none:pt-8 sm:pr-6 md:pb-4 lg:pl-2 xl:p-0 ...">
    <!-- ... -->
</div>
@endslot
@endcomponent

## Customizing

### Paddings

By default Tailwind provides 19 fixed `padding` utilities. These utilities will also be generated for every side and axis. You change, add, or remove these by editing the `theme.padding` section of your `tailwind.config.js` file.

@component('_partials.customized-config', ['key' => 'theme.padding', 'usesTheme' => true])
  ...theme('spacing'),
+ '72': '18rem',
+ '2px': '2px',
@endcomponent

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'padding',
        'property' => 'padding',
    ],
    'variants' => [
        'responsive',
    ],
])

