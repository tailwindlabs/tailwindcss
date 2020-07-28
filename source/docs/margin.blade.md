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

## Add margin to a single side

Control the margin on one side of an element using the `m{t|r|b|l}-{size}` utilities.

For example, `mt-6` would add `1.5rem` of margin to the top of an element, `mr-4` would add `1rem` of margin to the right of an element, `mb-8` would add `2rem` of margin to the bottom of an element, and `ml-2` would add `0.5rem` of margin to the left of an element.

@component('_partials.code-sample')
<div class="flex justify-around items-start">
  <div>
    <p class="text-center text-sm text-gray-600 mb-1">mt-8</p>
    <div class="flex bg-gray-400">
      <span class="mt-8 bg-yellow-200">Target</span>
    </div>
  </div>
  <div>
    <p class="text-center text-sm text-gray-600 mb-1">mr-8</p>
    <div class="flex bg-gray-400">
      <span class="mr-8 bg-yellow-200">Target</span>
    </div>
  </div>
  <div>
    <p class="text-center text-sm text-gray-600 mb-1">mb-8</p>
    <div class="flex bg-gray-400">
      <span class="mb-8 bg-yellow-200">Target</span>
    </div>
  </div>
  <div>
    <p class="text-center text-sm text-gray-600 mb-1">ml-8</p>
    <div class="flex bg-gray-400">
      <span class="ml-8 bg-yellow-200">Target</span>
    </div>
  </div>
</div>
@slot('code')
<div class="bg-gray-400"><span class="mt-8 bg-yellow-200">Target</span></div>
<div class="bg-gray-400"><span class="mr-8 bg-yellow-200">Target</span></div>
<div class="bg-gray-400"><span class="mb-8 bg-yellow-200">Target</span></div>
<div class="bg-gray-400"><span class="ml-8 bg-yellow-200">Target</span></div>
@endslot
@endcomponent

## Add horizontal margin

Control the horizontal margin of an element using the `mx-{size}` utilities.

@component('_partials.code-sample')
<div class="flex justify-around items-center">
  <div>
    <p class="text-center text-sm text-gray-600 mb-1">mx-8</p>
    <div class="flex bg-gray-400">
      <span class="mx-8 bg-yellow-200">Target</span>
    </div>
  </div>
</div>
@slot('code')
<div class="bg-gray-400"><span class="mx-8 bg-yellow-200">Target</span></div>
@endslot
@endcomponent

## Add vertical margin

Control the vertical margin of an element using the `my-{size}` utilities.

@component('_partials.code-sample')
<div class="flex justify-around items-center">
  <div>
    <p class="text-center text-sm text-gray-600 mb-1">my-8</p>
    <div class="flex bg-gray-400">
      <span class="my-8 bg-yellow-200">Target</span>
    </div>
  </div>
</div>
@slot('code')
<div class="bg-gray-400"><span class="my-8 bg-yellow-200">Target</span></div>
@endslot
@endcomponent

## Add margin to all sides

Control the margin on all sides of an element using the `m-{size}` utilities.

@component('_partials.code-sample')
<div class="flex justify-around items-center">
  <div>
    <p class="text-center text-sm text-gray-600 mb-1">m-8</p>
    <div class="flex bg-gray-400">
      <span class="m-8 bg-yellow-200">Target</span>
    </div>
  </div>
</div>
@slot('code')
<div class="bg-gray-400"><span class="m-8 bg-yellow-200">Target</span></div>
@endslot
@endcomponent

## Negative margins

Control the negative margin of an element using the `-m{side?}-{size}` utilities.

@component('_partials.code-sample')
<div class="flex justify-around items-center">
  <div>
    <div class="bg-gray-400 h-16 w-32"></div>
    <div class="bg-yellow-200 h-16 mx-auto -mt-8 w-24 flex items-center justify-center">
      -mt-8
    </div>
  </div>
</div>
@slot('code')
<div class="bg-gray-400 h-16 w-32"></div>
<div class="-mt-8 bg-yellow-200 mx-auto h-16 w-24 ...">
  -mt-8
</div>
@endslot
@endcomponent

---

## Responsive

To control the margin of an element at a specific breakpoint, add a `{screen}:` prefix to any existing margin utility. For example, adding the class `md:my-8` to an element would apply the `my-8` utility at medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

@component('_partials.responsive-code-sample', ['class' => 'text-center'])
@slot('none')
<div class="inline-block bg-gray-400">
  <div class="mt-8 bg-yellow-200">Target</div>
</div>
@endslot

@slot('sm')
<div class="inline-block bg-gray-400">
  <div class="mt-8 mr-6 bg-yellow-200">Target</div>
</div>
@endslot

@slot('md')
<div class="inline-block bg-gray-400">
  <div class="mt-8 mr-6 mb-4 bg-yellow-200">Target</div>
</div>
@endslot

@slot('lg')
<div class="inline-block bg-gray-400">
  <div class="mt-8 mr-8 mb-4 ml-2 bg-yellow-200">Target</div>
</div>
@endslot

@slot('xl')
<div class="inline-block bg-gray-400">
  <div class="m-0 bg-yellow-200">Target</div>
</div>
@endslot

@slot('code')
<div class="bg-gray-400 ...">
  <span class="none:mt-8 sm:mr-6 md:mb-4 lg:ml-2 xl:m-0 bg-yellow-200">Target</span>
</div>
@endslot
@endcomponent

---

## Customizing

### Margin scale

By default Tailwind provides 20 margin utilities for each side and axis.

If you'd like to customize these values for padding, margin, width, and height all at once, use the `theme.spacing` section of your `tailwind.config.js` file.

@component('_partials.customized-config', ['key' => 'theme.spacing'])
+ sm: '8px',
+ md: '16px',
+ lg: '24px',
+ xl: '48px',
@endcomponent

To customize only the margin values, use the `theme.margin` section of your `tailwind.config.js` file.

@component('_partials.customized-config', ['key' => 'theme.margin'])
+ sm: '8px',
+ md: '16px',
+ lg: '24px',
+ xl: '48px',
@endcomponent

Learn more about customizing the default theme in the [theme customization documentation](/docs/theme#customizing-the-default-theme).

### Negative values

If you'd like to add additional negative margin classes (taking the form `-m{side?}-{size}`), prefix the keys in your config file with a dash:

@component('_partials.customized-config', ['key' => 'theme.extend.margin'])
+ '-72': '-18rem',
@endcomponent

Tailwind is smart enough to generate classes like `-mx-72` when it sees the leading dash, not `mx--72` like you might expect.

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'margin',
        'property' => 'margin',
    ],
    'variants' => [
        'responsive',
    ],
])
