---
extends: _layouts.documentation
title: "Flex Wrapping"
description: "Utilities for controlling how flex items wrap."
features:
  responsive: true
  customizable: false
  hover: false
  focus: false
---

@include('_partials.class-table', [
  'rows' => [
    [
      '.flex-no-wrap',
      'flex-wrap: nowrap;',
      "Don't allow flex items to wrap.",
    ],
    [
      '.flex-wrap',
      'flex-wrap: wrap;',
      "Allow flex items to wrap in the normal direction.",
    ],
    [
      '.flex-wrap-reverse',
      'flex-wrap: wrap-reverse;',
      "Allow flex items to wrap in the reverse direction.",
    ],
  ]
])

### Don't wrap <span class="ml-2 font-semibold text-slate-light text-sm uppercase tracking-wide">Default</span>

Use `.flex-no-wrap` to prevent flex items from wrapping, causing inflexible items to overflow the container if necessary:

@component('_partials.code-sample')
<div class="flex flex-no-wrap bg-smoke-light">
  <div class="w-2/5 flex-none p-2">
    <div class="text-slate text-center bg-smoke p-2">1</div>
  </div>
  <div class="w-2/5 flex-none p-2">
    <div class="text-slate text-center bg-smoke p-2">2</div>
  </div>
  <div class="w-2/5 flex-none p-2">
    <div class="text-slate text-center bg-smoke p-2">3</div>
  </div>
</div>
@endcomponent

### Wrap normally

Use `.flex-wrap` to allow flex items to wrap:

@component('_partials.code-sample')
<div class="flex flex-wrap bg-smoke-light">
  <div class="w-2/5 p-2">
    <div class="text-slate text-center bg-smoke p-2">1</div>
  </div>
  <div class="w-2/5 p-2">
    <div class="text-slate text-center bg-smoke p-2">2</div>
  </div>
  <div class="w-2/5 p-2">
    <div class="text-slate text-center bg-smoke p-2">3</div>
  </div>
</div>
@endcomponent

### Wrap reversed

Use `.flex-wrap-reverse` to wrap flex items in the reverse direction:

@component('_partials.code-sample')
<div class="flex flex-wrap-reverse bg-smoke-light">
  <div class="w-2/5 p-2">
    <div class="text-slate text-center bg-smoke p-2">1</div>
  </div>
  <div class="w-2/5 p-2">
    <div class="text-slate text-center bg-smoke p-2">2</div>
  </div>
  <div class="w-2/5 p-2">
    <div class="text-slate text-center bg-smoke p-2">3</div>
  </div>
</div>
@endcomponent

## Responsive

To control how flex items wrap at a specific breakpoint, add a `{screen}:` prefix to any existing utility class. For example, use `md:flex-wrap-reverse` to apply the `flex-wrap-reverse` utility at only medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

@component('_partials.responsive-code-sample')
@slot('none')
<div class="flex flex-no-wrap bg-smoke-light">
  <div class="w-2/5 flex-none p-2">
    <div class="text-slate text-center bg-smoke p-2">1</div>
  </div>
  <div class="w-2/5 flex-none p-2">
    <div class="text-slate text-center bg-smoke p-2">2</div>
  </div>
  <div class="w-2/5 flex-none p-2">
    <div class="text-slate text-center bg-smoke p-2">3</div>
  </div>
</div>
@endslot
@slot('sm')
<div class="flex flex-wrap bg-smoke-light">
  <div class="w-2/5 flex-none p-2">
    <div class="text-slate text-center bg-smoke p-2">1</div>
  </div>
  <div class="w-2/5 flex-none p-2">
    <div class="text-slate text-center bg-smoke p-2">2</div>
  </div>
  <div class="w-2/5 flex-none p-2">
    <div class="text-slate text-center bg-smoke p-2">3</div>
  </div>
</div>
@endslot
@slot('md')
<div class="flex flex-wrap-reverse bg-smoke-light">
  <div class="w-2/5 flex-none p-2">
    <div class="text-slate text-center bg-smoke p-2">1</div>
  </div>
  <div class="w-2/5 flex-none p-2">
    <div class="text-slate text-center bg-smoke p-2">2</div>
  </div>
  <div class="w-2/5 flex-none p-2">
    <div class="text-slate text-center bg-smoke p-2">3</div>
  </div>
</div>
@endslot
@slot('lg')
<div class="flex flex-no-wrap bg-smoke-light">
  <div class="w-2/5 flex-none p-2">
    <div class="text-slate text-center bg-smoke p-2">1</div>
  </div>
  <div class="w-2/5 flex-none p-2">
    <div class="text-slate text-center bg-smoke p-2">2</div>
  </div>
  <div class="w-2/5 flex-none p-2">
    <div class="text-slate text-center bg-smoke p-2">3</div>
  </div>
</div>
@endslot
@slot('xl')
<div class="flex flex-wrap bg-smoke-light">
  <div class="w-2/5 flex-none p-2">
    <div class="text-slate text-center bg-smoke p-2">1</div>
  </div>
  <div class="w-2/5 flex-none p-2">
    <div class="text-slate text-center bg-smoke p-2">2</div>
  </div>
  <div class="w-2/5 flex-none p-2">
    <div class="text-slate text-center bg-smoke p-2">3</div>
  </div>
</div>
@endslot
@slot('code')
<div class="none:flex-no-wrap sm:flex-wrap md:flex-wrap-reverse lg:flex-no-wrap xl:flex-wrap ...">
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

Note that modifying the `flexbox` property will affect what variants are generated for _all_ flexbox modules, not just the flex-wrap utilities.

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
