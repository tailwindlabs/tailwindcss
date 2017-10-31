---
extends: _layouts.documentation
title: "Padding"
---

# Spacing

<div class="text-xl text-slate-light mb-4">
    Utilities for controlling an element's padding and margin.
</div>

@include('_partials.feature-badges', [
    'responsive' => true,
    'customizable' => true,
    'hover' => false,
    'focus' => false
])

@include('_partials.work-in-progress')

The syntax below is combined to create a system for padding and margins. For example, `.pt-2` would add padding to the top of the element to the value of `0.5rem`, `.mx-0` would make the horizontal margin zero, and `.-mb-6` would add negative margin to the bottom of an element.

<div class="flex items-start mt-8 text-sm">
    <div class="pr-12">
        <div class="mb-3 text-slate uppercase">Class</div>
        <div><code class="inline-block my-1 mr-1 px-2 py-1 font-mono border rounded">p</code> Padding</div>
        <div><code class="inline-block my-1 mr-1 px-2 py-1 font-mono border rounded">m</code> Margin</div>
        <div><code class="inline-block my-1 mr-1 px-2 py-1 font-mono border rounded">-m</code> Negative Margin</div>
    </div>
    <div class="pl-12 pr-12 border-l">
        <div class="mb-3 text-slate"><span class="uppercase">Position</span> <span class="text-slate-light text-xs">(optional)</span></div>
        <div><code class="inline-block my-1 mr-1 px-2 py-1 font-mono border rounded">t</code> Top</div>
        <div><code class="inline-block my-1 mr-1 px-2 py-1 font-mono border rounded">r</code> Right</div>
        <div><code class="inline-block my-1 mr-1 px-2 py-1 font-mono border rounded">b</code> Bottom</div>
        <div><code class="inline-block my-1 mr-1 px-2 py-1 font-mono border rounded">l</code> Left</div>
        <div><code class="inline-block my-1 mr-1 px-2 py-1 font-mono border rounded">x</code> Horizontal</div>
        <div><code class="inline-block my-1 mr-1 px-2 py-1 font-mono border rounded">y</code> Vertical</div>
    </div>
    <div class="pl-12 border-l">
        <div class="mb-3 text-slate uppercase">Space</div>
        <div><code class="inline-block my-1 mr-1 px-2 py-1 font-mono border rounded">0</code> 0</div>
        <div><code class="inline-block my-1 mr-1 px-2 py-1 font-mono border rounded">1</code> 0.25rem</div>
        <div><code class="inline-block my-1 mr-1 px-2 py-1 font-mono border rounded">2</code> 0.5rem</div>
        <div><code class="inline-block my-1 mr-1 px-2 py-1 font-mono border rounded">3</code> 0.75rem</div>
        <div><code class="inline-block my-1 mr-1 px-2 py-1 font-mono border rounded">4</code> 1rem</div>
        <div><code class="inline-block my-1 mr-1 px-2 py-1 font-mono border rounded">6</code> 1.5rem</div>
        <div><code class="inline-block my-1 mr-1 px-2 py-1 font-mono border rounded">8</code> 2rem</div>
    </div>
</div>
