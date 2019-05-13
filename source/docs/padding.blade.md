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

## Add padding to a single side

Control the padding on one side of an element using the `.p{t|r|b|l}-{size}` utilities.

For example, `.pt-6` would add `1.5rem` of padding to the top of an element, `pr-4` would add `1rem` of padding to the right of an element, `pb-8` would add `2rem` of padding to the bottom of an element, and `pl-2` would add `0.5rem` of padding to the left of an element.

@component('_partials.code-sample')
<div class="flex justify-around items-start">
  <div>
    <p class="text-center text-sm text-gray-600 mb-1">pt-8</p>
    <div class="flex pt-8 bg-gray-400">
      <span class="bg-yellow-200">Target</span>
    </div>
  </div>
  <div>
    <p class="text-center text-sm text-gray-600 mb-1">pr-8</p>
    <div class="flex pr-8 bg-gray-400">
      <span class="bg-yellow-200">Target</span>
    </div>
  </div>
  <div>
    <p class="text-center text-sm text-gray-600 mb-1">pb-8</p>
    <div class="flex pb-8 bg-gray-400">
      <span class="bg-yellow-200">Target</span>
    </div>
  </div>
  <div>
    <p class="text-center text-sm text-gray-600 mb-1">pl-8</p>
    <div class="flex pl-8 bg-gray-400">
      <span class="bg-yellow-200">Target</span>
    </div>
  </div>
</div>
@slot('code')
<div class="pt-8"><!-- ... --></div>
<div class="pr-8"><!-- ... --></div>
<div class="pb-8"><!-- ... --></div>
<div class="pl-8"><!-- ... --></div>
@endslot
@endcomponent

## Add horizontal padding

Control the horizontal padding of an element using the `.px-{size}` utilities.

@component('_partials.code-sample')
<div class="flex justify-around items-center">
  <div>
    <p class="text-center text-sm text-gray-600 mb-1">px-8</p>
    <div class="flex px-8 bg-gray-400">
      <span class="bg-yellow-200">Target</span>
    </div>
  </div>
</div>
@slot('code')
<div class="px-8"><!-- ... --></div>
@endslot
@endcomponent

## Add vertical padding

Control the vertical padding of an element using the `.py-{size}` utilities.

@component('_partials.code-sample')
<div class="flex justify-around items-center">
  <div>
    <p class="text-center text-sm text-gray-600 mb-1">py-8</p>
    <div class="flex py-8 bg-gray-400">
      <span class="bg-yellow-200">Target</span>
    </div>
  </div>
</div>
@slot('code')
<div class="py-8"><!-- ... --></div>
@endslot
@endcomponent

## Add padding to all sides

Control the padding on all sides of an element using the `.p-{size}` utilities.

@component('_partials.code-sample')
<div class="flex justify-around items-center">
  <div>
    <p class="text-center text-sm text-gray-600 mb-1">p-8</p>
    <div class="flex p-8 bg-gray-400">
      <span class="bg-yellow-200">Target</span>
    </div>
  </div>
</div>
@slot('code')
<div class="p-8"><!-- ... --></div>
@endslot
@endcomponent

---

## Responsive

To control the padding of an element at a specific breakpoint, add a `{screen}:` prefix to any existing padding utility. For example, adding the class `md:py-8` to an element would apply the `py-8` utility at medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

@component('_partials.responsive-code-sample', ['class' => 'text-center'])
@slot('none')
<div class="inline-block bg-gray-400 pt-8">
  <div class="bg-yellow-200">Target</div>
</div>
@endslot

@slot('sm')
<div class="inline-block bg-gray-400 pt-8 pr-6">
  <div class="bg-yellow-200">Target</div>
</div>
@endslot

@slot('md')
<div class="inline-block bg-gray-400 pt-8 pr-6 pb-4">
  <div class="bg-yellow-200">Target</div>
</div>
@endslot

@slot('lg')
<div class="inline-block bg-gray-400 pt-8 pr-8 pb-4 pl-2">
  <div class="bg-yellow-200">Target</div>
</div>
@endslot

@slot('xl')
<div class="inline-block bg-gray-400 p-0">
  <div class="bg-yellow-200">Target</div>
</div>
@endslot

@slot('code')
<div class="none:pt-8 sm:pr-6 md:pb-4 lg:pl-2 xl:p-0 ...">
    <!-- ... -->
</div>
@endslot
@endcomponent

---

## Customizing

### Padding scale

By default Tailwind provides 19 fixed padding utilities for each side and axis.

If you'd like to customize these values for padding, margin, width, and height all at once, use the `theme.spacing` section of your `tailwind.config.js` file.

@component('_partials.customized-config', ['key' => 'theme.spacing'])
+ sm: '8px',
+ md: '16px',
+ lg: '24px',
+ xl: '48px',
@endcomponent

To customize only the padding values, use the `theme.padding` section of your `tailwind.config.js` file.

@component('_partials.customized-config', ['key' => 'theme.padding'])
+ sm: '8px',
+ md: '16px',
+ lg: '24px',
+ xl: '48px',
@endcomponent

Learn more about customizing the default theme in the [theme customization documentation](/docs/theme#customizing-the-default-theme).


@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'padding',
        'property' => 'padding',
    ],
    'variants' => [
        'responsive',
    ],
])

