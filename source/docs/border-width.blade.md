---
extends: _layouts.documentation
title: "Border Width"
description: "Utilities for controlling the width an element's borders."
features:
  responsive: true
  customizable: true
  hover: false
  focus: false
---

@include('_partials.work-in-progress')

Add borders to any element using the `.border{-side?}{-width?}` syntax.

For example, `.border` would add a `1px` border to all sides of the element, where `.border-b-4` would add a `4px` border to the bottom of the element.

<div class="flex items-start mt-8 text-sm leading-none">
  <div class="pr-12">
    <div class="mb-3 text-gray-700 uppercase">Class</div>
    <div><code class="inline-block my-1 mr-1 px-2 py-1 font-mono border rounded">border</code></div>
  </div>
  <div class="pl-12 pr-12 border-l">
    <div class="mb-3 text-gray-700"><span class="uppercase">Side</span> <span class="text-gray-600 text-xs">(optional)</span></div>
    <div><code class="inline-block my-1 mr-1 px-2 py-1 font-mono border rounded bg-gray-200">&nbsp;</code> All <em class="text-xs text-gray-600">(default)</em></div>
    <div><code class="inline-block my-1 mr-1 px-2 py-1 font-mono border rounded">t</code> Top</div>
    <div><code class="inline-block my-1 mr-1 px-2 py-1 font-mono border rounded">r</code> Right</div>
    <div><code class="inline-block my-1 mr-1 px-2 py-1 font-mono border rounded">b</code> Bottom</div>
    <div><code class="inline-block my-1 mr-1 px-2 py-1 font-mono border rounded">l</code> Left</div>
  </div>
  <div class="pl-12 border-l">
    <div class="mb-3 text-gray-700"><span class="uppercase">Width</span> <span class="text-gray-600 text-xs">(optional)</span></div>
    <div><code class="inline-block my-1 mr-1 px-2 py-1 font-mono border rounded">0</code> 0px</div>
    <div><code class="inline-block my-1 mr-1 px-2 py-1 font-mono border rounded bg-gray-200">&nbsp;</code> 1px <em class="text-xs text-gray-600">(default)</em></div>
    <div><code class="inline-block my-1 mr-1 px-2 py-1 font-mono border rounded">2</code> 2px</div>
    <div><code class="inline-block my-1 mr-1 px-2 py-1 font-mono border rounded">4</code> 4px</div>
    <div><code class="inline-block my-1 mr-1 px-2 py-1 font-mono border rounded">8</code> 8px</div>
  </div>
</div>

## Responsive

To control the border width of an element at a specific breakpoint, add a `{screen}:` prefix to any existing border width utility. For example, use `md:border-t-4` to apply the `border-t-4` utility at only medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

@component('_partials.responsive-code-sample', ['class' => 'text-center'])
@slot('none')
<div class="w-12 h-12 mx-auto border-2 border-gray-600 bg-gray-200"></div>
@endslot
@slot('sm')
<div class="w-12 h-12 mx-auto border-2 border-t-8 border-gray-600 bg-gray-200"></div>
@endslot
@slot('md')
<div class="w-12 h-12 mx-auto border-2 border-t-8 border-r-8 border-gray-600 bg-gray-200"></div>
@endslot
@slot('lg')
<div class="w-12 h-12 mx-auto border-2 border-t-8 border-r-8 border-b-8 border-gray-600 bg-gray-200"></div>
@endslot
@slot('xl')
<div class="w-12 h-12 mx-auto border-8 border-gray-600 bg-gray-200"></div>
@endslot
@slot('code')
<div class="none:border-2 sm:border-t-8 md:border-r-8 lg:border-b-8 xl:border-8">
</div>
@endslot
@endcomponent

## Customizing

### Border Widths

By default Tailwind provides five `border-width` utilities, and the same number of utilities per side (top, right, bottom, and left). You change, add, or remove these by editing the `theme.borderWidth` section of your Tailwind config. The values in this section will also control which utilities will be generated side.

@component('_partials.customized-config', ['key' => 'theme.borderWidth'])
  default: '1px',
  '0': '0',
  '2': '2px',
+ '3': '3px',
  '4': '4px',
+ '6': '6px',
- '8': '8px',
@endcomponent

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'border width',
        'property' => 'borderWidth',
    ],
    'variants' => [
        'responsive',
    ],
])
