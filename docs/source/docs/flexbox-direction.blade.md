---
extends: _layouts.documentation
title: "Flex Direction"
description: "Utilities for controlling the direction of flex items."
features:
  responsive: true
  customizable: false
  hover: false
  focus: false
---

@include('_partials.class-table', [
  'rows' => [
    [
      '.flex-row',
      'flex-direction: row;',
      "Position flex items in the normal horizontal direction.",
    ],
    [
     '.flex-row-reverse',
     'flex-direction: row-reverse;',
     "Position flex items in the reverse horizontal direction.",
    ],
    [
      '.flex-col',
      'flex-direction: column;',
      "Position flex items vertically.",
    ],
    [
      '.flex-col-reverse',
      'flex-direction: column-reverse;',
      "Position flex items vertically in the reverse direction.",
    ],
  ]
])

### Row <span class="ml-2 font-semibold text-slate-light text-sm uppercase tracking-wide">Default</span>

Use `.flex-row` to position flex items horizontally in the same direction as text:

@component('_partials.code-sample')
<div class="flex flex-row bg-smoke-light">
  <div class="text-slate text-center bg-smoke px-4 py-2 m-2">1</div>
  <div class="text-slate text-center bg-smoke px-4 py-2 m-2">2</div>
  <div class="text-slate text-center bg-smoke px-4 py-2 m-2">3</div>
</div>
@endcomponent

### Row reversed

Use `.flex-row-reverse` to position flex items horizontally in the opposite direction:

@component('_partials.code-sample')
<div class="flex flex-row-reverse bg-smoke-light">
  <div class="text-slate text-center bg-smoke px-4 py-2 m-2">1</div>
  <div class="text-slate text-center bg-smoke px-4 py-2 m-2">2</div>
  <div class="text-slate text-center bg-smoke px-4 py-2 m-2">3</div>
</div>
@endcomponent

### Column

Use `.flex-col` to position flex items vertically:

@component('_partials.code-sample')
<div class="flex flex-col bg-smoke-light">
  <div class="text-slate text-center bg-smoke px-4 py-2 m-2">1</div>
  <div class="text-slate text-center bg-smoke px-4 py-2 m-2">2</div>
  <div class="text-slate text-center bg-smoke px-4 py-2 m-2">3</div>
</div>
@endcomponent

### Column reversed

Use `.flex-col-reverse` to position flex items vertically in the opposite direction:

@component('_partials.code-sample')
<div class="flex flex-col-reverse bg-smoke-light">
  <div class="text-slate text-center bg-smoke px-4 py-2 m-2">1</div>
  <div class="text-slate text-center bg-smoke px-4 py-2 m-2">2</div>
  <div class="text-slate text-center bg-smoke px-4 py-2 m-2">3</div>
</div>
@endcomponent

## Responsive

To apply a flex direction utility only at a specific breakpoint, add a `{screen}:` prefix to the existing class name. For example, adding the class `md:flex-row` to an element would apply the `flex-row` utility at medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

@component('_partials.responsive-code-sample')
@slot('none')
<div class="flex flex-row bg-smoke-light">
  <div class="text-slate text-center bg-smoke px-4 py-2 m-2">1</div>
  <div class="text-slate text-center bg-smoke px-4 py-2 m-2">2</div>
  <div class="text-slate text-center bg-smoke px-4 py-2 m-2">3</div>
</div>
@endslot
@slot('sm')
<div class="flex flex-col bg-smoke-light">
  <div class="text-slate text-center bg-smoke px-4 py-2 m-2">1</div>
  <div class="text-slate text-center bg-smoke px-4 py-2 m-2">2</div>
  <div class="text-slate text-center bg-smoke px-4 py-2 m-2">3</div>
</div>
@endslot
@slot('md')
<div class="flex flex-row-reverse bg-smoke-light">
  <div class="text-slate text-center bg-smoke px-4 py-2 m-2">1</div>
  <div class="text-slate text-center bg-smoke px-4 py-2 m-2">2</div>
  <div class="text-slate text-center bg-smoke px-4 py-2 m-2">3</div>
</div>
@endslot
@slot('lg')
<div class="flex flex-col-reverse bg-smoke-light">
  <div class="text-slate text-center bg-smoke px-4 py-2 m-2">1</div>
  <div class="text-slate text-center bg-smoke px-4 py-2 m-2">2</div>
  <div class="text-slate text-center bg-smoke px-4 py-2 m-2">3</div>
</div>
@endslot
@slot('xl')
<div class="flex flex-row bg-smoke-light">
  <div class="text-slate text-center bg-smoke px-4 py-2 m-2">1</div>
  <div class="text-slate text-center bg-smoke px-4 py-2 m-2">2</div>
  <div class="text-slate text-center bg-smoke px-4 py-2 m-2">3</div>
</div>
@endslot
@slot('code')
<div class="none:flex-row sm:flex-col md:flex-row-reverse lg:flex-col-reverse xl:flex-row ...">
  <!-- ... -->
</div>
@endslot
@endcomponent

## Customizing

### Responsive, Hover, and Focus Variants

By default, only responsive variants are generated for flexbox utilities.

You can control which variants are generated for the flexbox utilities by modifying the `flexbox` property in the `modules` section of your Tailwind config file.

For example, this config will _also_ generate hover and focus variants:

```js
{
    // ...
    modules: { 
        // ...
        flexbox: ['responsive', 'hover', 'focus'],
    }
}
```

Note that modifying the `flexbox` property will affect what variants are generated for _all_ flexbox modules, not just the flex-direction utilities.

### Disabling

If you aren't using the flexbox utilities in your project, you can disable them entirely by setting the `flexbox` property to `false` in the `modules` section of your config file:

```js
{
    // ...
    modules: {
        // ...
        flexbox: false,
    }
}
```
