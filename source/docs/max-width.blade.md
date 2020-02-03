---
extends: _layouts.documentation
title: "Max-Width"
description: "Utilities for setting the maximum width of an element"
---

@include('_partials.class-table', [
  'scroll' => false,
  'rows' => [
    [
      '.max-w-xs',
      'max-width: 20rem;',
      "Set the element's maximum width to 20rem.",
    ],
    [
      '.max-w-sm',
      'max-width: 24rem;',
      "Set the element's maximum width to 24rem.",
    ],
    [
      '.max-w-md',
      'max-width: 28rem;',
      "Set the element's maximum width to 28rem.",
    ],
    [
      '.max-w-lg',
      'max-width: 32rem;',
      "Set the element's maximum width to 32rem.",
    ],
    [
      '.max-w-xl',
      'max-width: 36rem;',
      "Set the element's maximum width to 36rem.",
    ],
    [
      '.max-w-2xl',
      'max-width: 42rem;',
      "Set the element's maximum width to 42rem.",
    ],
    [
      '.max-w-3xl',
      'max-width: 48rem;',
      "Set the element's maximum width to 48rem.",
    ],
    [
      '.max-w-4xl',
      'max-width: 56rem;',
      "Set the element's maximum width to 56rem.",
    ],
    [
      '.max-w-5xl',
      'max-width: 64rem;',
      "Set the element's maximum width to 64rem.",
    ],
    [
      '.max-w-6xl',
      'max-width: 72rem;',
      "Set the element's maximum width to 72rem.",
    ],
    [
      '.max-w-full',
      'max-width: 100%;',
      "Set the element's maximum width to 100%.",
    ],
    [
      '.max-w-screen-sm',
      'max-width: 640px;',
      "Set the element's maximum width to the small screen breakpoint.",
    ],
    [
      '.max-w-screen-md',
      'max-width: 768px;',
      "Set the element's maximum width to the medium screen breakpoint.",
    ],
    [
      '.max-w-screen-lg',
      'max-width: 1024px;',
      "Set the element's maximum width to the large screen breakpoint.",
    ],
    [
      '.max-w-screen-xl',
      'max-width: 1280px;',
      "Set the element's maximum width to the extra large screen breakpoint.",
    ],
    [
      '.max-w-none',
      'max-width: none;',
      "Remove the element's maximum width.",
    ],
  ]
])

## Usage

Set the maximum width of an element using the `max-w-{size}` utilities.

@component('_partials.code-sample')
<div class="max-w-md mx-auto text-center p-6 bg-gray-300">
  max-w-md
</div>
@slot('code')
<div class="max-w-md mx-auto ...">
  max-w-md
</div>
@endslot
@endcomponent

---

## Responsive

To control the min-width of an element at a specific breakpoint, add a `{screen}:` prefix to any existing min-width utility.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

@component('_partials.responsive-code-sample')
@slot('none')
<div class="max-w-sm mx-auto text-center p-6 bg-gray-300">
  Target
</div>
@endslot
@slot('sm')
<div class="max-w-md mx-auto text-center p-6 bg-gray-300">
  Target
</div>
@endslot
@slot('md')
<div class="max-w-lg mx-auto text-center p-6 bg-gray-300">
  Target
</div>
@endslot
@slot('lg')
<div class="max-w-xl mx-auto text-center p-6 bg-gray-300">
  Target
</div>
@endslot
@slot('xl')
<div class="max-w-2xl mx-auto text-center p-6 bg-gray-300">
  Target
</div>
@endslot
@slot('code')
<div class="none:max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl ...">
  Target
</div>
@endslot
@endcomponent

---

## Customizing

### Max-Width Scale

Customize Tailwind's default max-width scale in the `theme.maxWidth` section of your `tailwind.config.js` file.

@component('_partials.customized-config', ['key' => 'theme.maxWidth'])
+ '1/4': '25%',
+ '1/2': '50%',
+ '3/4': '75%',
@endcomponent

Learn more about customizing the default theme in the [theme customization documentation](/docs/theme#customizing-the-default-theme).

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'max-width',
        'property' => 'maxWidth',
    ],
    'variants' => [
        'responsive',
    ],
])
