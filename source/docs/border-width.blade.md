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
    <div class="mb-3 text-grey-darker uppercase">Class</div>
    <div><code class="inline-block my-1 mr-1 px-2 py-1 font-mono border rounded">border</code></div>
  </div>
  <div class="pl-12 pr-12 border-l">
    <div class="mb-3 text-grey-darker"><span class="uppercase">Side</span> <span class="text-grey-dark text-xs">(optional)</span></div>
    <div><code class="inline-block my-1 mr-1 px-2 py-1 font-mono border rounded bg-grey-lighter">&nbsp;</code> All <em class="text-xs text-grey-dark">(default)</em></div>
    <div><code class="inline-block my-1 mr-1 px-2 py-1 font-mono border rounded">t</code> Top</div>
    <div><code class="inline-block my-1 mr-1 px-2 py-1 font-mono border rounded">r</code> Right</div>
    <div><code class="inline-block my-1 mr-1 px-2 py-1 font-mono border rounded">b</code> Bottom</div>
    <div><code class="inline-block my-1 mr-1 px-2 py-1 font-mono border rounded">l</code> Left</div>
  </div>
  <div class="pl-12 border-l">
    <div class="mb-3 text-grey-darker"><span class="uppercase">Width</span> <span class="text-grey-dark text-xs">(optional)</span></div>
    <div><code class="inline-block my-1 mr-1 px-2 py-1 font-mono border rounded">0</code> 0px</div>
    <div><code class="inline-block my-1 mr-1 px-2 py-1 font-mono border rounded bg-grey-lighter">&nbsp;</code> 1px <em class="text-xs text-grey-dark">(default)</em></div>
    <div><code class="inline-block my-1 mr-1 px-2 py-1 font-mono border rounded">2</code> 2px</div>
    <div><code class="inline-block my-1 mr-1 px-2 py-1 font-mono border rounded">4</code> 4px</div>
    <div><code class="inline-block my-1 mr-1 px-2 py-1 font-mono border rounded">8</code> 8px</div>
  </div>
</div>

## Customizing

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'border width',
        'property' => 'borderWidths',
    ],
    'variants' => [
        'responsive',
    ],
])
