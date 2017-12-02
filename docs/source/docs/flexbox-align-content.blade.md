---
extends: _layouts.documentation
title: "Align Content"
description: "Utilities for controlling how lines are positioned in multi-line flex containers."
features:
  responsive: true
  customizable: false
  hover: false
  focus: false
---

@include('_partials.class-table', [
  'rows' => [
    [
      '.content-start',
      'align-content: flex-start;',
      "Pack lines against the start of the cross axis.",
    ],
    [
      '.content-center',
      'align-content: center;',
      "Pack lines in the center of the cross axis.",
    ],
    [
      '.content-end',
      'align-content: flex-end;',
      "Pack lines against the end of the cross axis.",
    ],
    [
      '.content-between',
      'align-content: space-between;',
      "Distribute lines along the cross axis by adding an equal amount of space between each line.",
    ],
    [
      '.content-around',
      'align-content: space-around;',
      "Distribute lines along the cross axis by adding an equal amount of space around each line.",
    ],
  ]
])

### Start <span class="ml-2 font-semibold text-slate-light text-sm uppercase tracking-wide">Default</span>

Use `.content-start` to pack lines in a flex container against the start of the cross axis:

@component('_partials.code-sample')
<div class="flex content-start flex-wrap bg-smoke-light h-48">
  <div class="w-1/3 p-2">
    <div class="text-slate text-center bg-smoke p-2">1</div>
  </div>
  <div class="w-1/3 p-2">
    <div class="text-slate text-center bg-smoke p-2">2</div>
  </div>
  <div class="w-1/3 p-2">
    <div class="text-slate text-center bg-smoke p-2">3</div>
  </div>
  <div class="w-1/3 p-2">
    <div class="text-slate text-center bg-smoke p-2">4</div>
  </div>
  <div class="w-1/3 p-2">
    <div class="text-slate text-center bg-smoke p-2">5</div>
  </div>
</div>
@endcomponent

### Center

Use `.content-center` to pack lines in a flex container in the center of the cross axis:

@component('_partials.code-sample')
<div class="flex content-center flex-wrap bg-smoke-light h-48">
  <div class="w-1/3 p-2">
    <div class="text-slate text-center bg-smoke p-2">1</div>
  </div>
  <div class="w-1/3 p-2">
    <div class="text-slate text-center bg-smoke p-2">2</div>
  </div>
  <div class="w-1/3 p-2">
    <div class="text-slate text-center bg-smoke p-2">3</div>
  </div>
  <div class="w-1/3 p-2">
    <div class="text-slate text-center bg-smoke p-2">4</div>
  </div>
  <div class="w-1/3 p-2">
    <div class="text-slate text-center bg-smoke p-2">5</div>
  </div>
</div>
@endcomponent

### End

Use `.content-end` to pack lines in a flex container against the end of the cross axis:

@component('_partials.code-sample')
<div class="flex content-end flex-wrap bg-smoke-light h-48">
  <div class="w-1/3 p-2">
    <div class="text-slate text-center bg-smoke p-2">1</div>
  </div>
  <div class="w-1/3 p-2">
    <div class="text-slate text-center bg-smoke p-2">2</div>
  </div>
  <div class="w-1/3 p-2">
    <div class="text-slate text-center bg-smoke p-2">3</div>
  </div>
  <div class="w-1/3 p-2">
    <div class="text-slate text-center bg-smoke p-2">4</div>
  </div>
  <div class="w-1/3 p-2">
    <div class="text-slate text-center bg-smoke p-2">5</div>
  </div>
</div>
@endcomponent

### Space between

Use `.content-between` to distribute lines in a flex container such that there is an equal amount of space between each line:

@component('_partials.code-sample')
<div class="flex content-between flex-wrap bg-smoke-light h-48">
  <div class="w-1/3 p-2">
    <div class="text-slate text-center bg-smoke p-2">1</div>
  </div>
  <div class="w-1/3 p-2">
    <div class="text-slate text-center bg-smoke p-2">2</div>
  </div>
  <div class="w-1/3 p-2">
    <div class="text-slate text-center bg-smoke p-2">3</div>
  </div>
  <div class="w-1/3 p-2">
    <div class="text-slate text-center bg-smoke p-2">4</div>
  </div>
  <div class="w-1/3 p-2">
    <div class="text-slate text-center bg-smoke p-2">5</div>
  </div>
</div>
@endcomponent

### Space around

Use `.content-around` to distribute lines in a flex container such that there is an equal amount of space around each line:

@component('_partials.code-sample')
<div class="flex content-around flex-wrap bg-smoke-light h-48">
  <div class="w-1/3 p-2">
    <div class="text-slate text-center bg-smoke p-2">1</div>
  </div>
  <div class="w-1/3 p-2">
    <div class="text-slate text-center bg-smoke p-2">2</div>
  </div>
  <div class="w-1/3 p-2">
    <div class="text-slate text-center bg-smoke p-2">3</div>
  </div>
  <div class="w-1/3 p-2">
    <div class="text-slate text-center bg-smoke p-2">4</div>
  </div>
  <div class="w-1/3 p-2">
    <div class="text-slate text-center bg-smoke p-2">5</div>
  </div>
</div>
@endcomponent

## Responsive

To control the alignment of flex content at a specific breakpoint, add a `{screen}:` prefix to any existing utility class. For example, use `md:content-around` to apply the `content-around` utility at only medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

@component('_partials.responsive-code-sample')
@slot('none')
<div class="flex content-start flex-wrap bg-smoke-light h-48">
  <div class="w-1/3 p-2">
    <div class="text-slate text-center bg-smoke p-2">1</div>
  </div>
  <div class="w-1/3 p-2">
    <div class="text-slate text-center bg-smoke p-2">2</div>
  </div>
  <div class="w-1/3 p-2">
    <div class="text-slate text-center bg-smoke p-2">3</div>
  </div>
  <div class="w-1/3 p-2">
    <div class="text-slate text-center bg-smoke p-2">4</div>
  </div>
  <div class="w-1/3 p-2">
    <div class="text-slate text-center bg-smoke p-2">5</div>
  </div>
</div>
@endslot
@slot('sm')
<div class="flex content-end flex-wrap bg-smoke-light h-48">
  <div class="w-1/3 p-2">
    <div class="text-slate text-center bg-smoke p-2">1</div>
  </div>
  <div class="w-1/3 p-2">
    <div class="text-slate text-center bg-smoke p-2">2</div>
  </div>
  <div class="w-1/3 p-2">
    <div class="text-slate text-center bg-smoke p-2">3</div>
  </div>
  <div class="w-1/3 p-2">
    <div class="text-slate text-center bg-smoke p-2">4</div>
  </div>
  <div class="w-1/3 p-2">
    <div class="text-slate text-center bg-smoke p-2">5</div>
  </div>
</div>
@endslot
@slot('md')
<div class="flex content-center flex-wrap bg-smoke-light h-48">
  <div class="w-1/3 p-2">
    <div class="text-slate text-center bg-smoke p-2">1</div>
  </div>
  <div class="w-1/3 p-2">
    <div class="text-slate text-center bg-smoke p-2">2</div>
  </div>
  <div class="w-1/3 p-2">
    <div class="text-slate text-center bg-smoke p-2">3</div>
  </div>
  <div class="w-1/3 p-2">
    <div class="text-slate text-center bg-smoke p-2">4</div>
  </div>
  <div class="w-1/3 p-2">
    <div class="text-slate text-center bg-smoke p-2">5</div>
  </div>
</div>
@endslot
@slot('lg')
<div class="flex content-between flex-wrap bg-smoke-light h-48">
  <div class="w-1/3 p-2">
    <div class="text-slate text-center bg-smoke p-2">1</div>
  </div>
  <div class="w-1/3 p-2">
    <div class="text-slate text-center bg-smoke p-2">2</div>
  </div>
  <div class="w-1/3 p-2">
    <div class="text-slate text-center bg-smoke p-2">3</div>
  </div>
  <div class="w-1/3 p-2">
    <div class="text-slate text-center bg-smoke p-2">4</div>
  </div>
  <div class="w-1/3 p-2">
    <div class="text-slate text-center bg-smoke p-2">5</div>
  </div>
</div>
@endslot
@slot('xl')
<div class="flex content-around flex-wrap bg-smoke-light h-48">
  <div class="w-1/3 p-2">
    <div class="text-slate text-center bg-smoke p-2">1</div>
  </div>
  <div class="w-1/3 p-2">
    <div class="text-slate text-center bg-smoke p-2">2</div>
  </div>
  <div class="w-1/3 p-2">
    <div class="text-slate text-center bg-smoke p-2">3</div>
  </div>
  <div class="w-1/3 p-2">
    <div class="text-slate text-center bg-smoke p-2">4</div>
  </div>
  <div class="w-1/3 p-2">
    <div class="text-slate text-center bg-smoke p-2">5</div>
  </div>
</div>
@endslot
@slot('code')
<div class="none:content-start sm:content-end md:content-center lg:content-between xl:content-around ...">
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

Note that modifying the `flexbox` property will affect what variants are generated for _all_ flexbox modules, not just the align-content utilities.

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
