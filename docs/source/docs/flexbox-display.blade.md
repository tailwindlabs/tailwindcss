---
extends: _layouts.documentation
title: "Flex Display"
description: "Utilities for creating flex containers."
features:
  responsive: true
  customizable: false
  hover: false
  focus: false
---

@include('_partials.class-table', [
  'rows' => [
    [
      '.flex',
      'display: flex;',
      "Create a block-level flex container.",
    ],
    [
      '.inline-flex',
      'display: inline-flex;',
      "Create an inline flex container.",
    ],
  ]
])

## Flex

Use `.flex` to create a block-level flex container:

@component('_partials.code-sample')
<div class="flex bg-smoke-light">
  <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">1</div>
  <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">2</div>
  <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">3</div>
</div>
@endcomponent

## Inline flex

Use `.inline-flex` to create an inline flex container:

@component('_partials.code-sample')
<div class="inline-flex bg-smoke-light">
  <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">1</div>
  <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">2</div>
  <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">3</div>
</div>
@endcomponent

## Responsive

To control the display property of an element at a specific breakpoint, add a `{screen}:` prefix to any existing display utility class. For example, use `md:inline-flex` to apply the `inline-flex` utility at only medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

@component('_partials.responsive-code-sample')
@slot('none')
<div class="flex bg-smoke-light">
  <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">1</div>
  <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">2</div>
  <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">3</div>
</div>
@endslot
@slot('sm')
<div class="inline-flex bg-smoke-light">
  <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">1</div>
  <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">2</div>
  <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">3</div>
</div>
@endslot
@slot('md')
<div class="block bg-smoke-light">
  <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">1</div>
  <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">2</div>
  <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">3</div>
</div>
@endslot
@slot('lg')
<div class="hidden bg-smoke-light">
  <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">1</div>
  <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">2</div>
  <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">3</div>
</div>
@endslot
@slot('xl')
<div class="flex bg-smoke-light">
  <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">1</div>
  <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">2</div>
  <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">3</div>
</div>
@endslot
@slot('code')
<div class="none:flex sm:inline-flex md:block lg:hidden xl:flex ...">
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

Note that modifying the `flexbox` property will affect what variants are generated for _all_ flexbox modules, not just the display utilities.

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
