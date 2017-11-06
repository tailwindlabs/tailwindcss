---
extends: _layouts.documentation
title: "Spacing"
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

Control an element's padding and margin using the `.p{side?}-{size}`, `.m{side?}-{size}`, and `.-m{side?}-{size}` utilities.

For example, `.pt-2` would add `.5rem` of padding to the top of the element, `.mx-0` would make the horizontal margin zero, and `.-mb-6` would add a `1.5rem`negative margin to the bottom of an element.

<div class="flex items-start mt-8 text-sm">
    <div class="pr-12">
        <div class="mb-3 text-slate uppercase">Class</div>
        <div><code class="inline-block my-1 mr-1 px-2 py-1 font-mono border rounded">p</code> Padding</div>
        <div><code class="inline-block my-1 mr-1 px-2 py-1 font-mono border rounded">m</code> Margin</div>
        <div><code class="inline-block my-1 mr-1 px-2 py-1 font-mono border rounded">-m</code> Negative Margin</div>
    </div>
    <div class="pl-12 pr-12 border-l">
        <div class="mb-3 text-slate"><span class="uppercase">Side</span> <span class="text-slate-light text-xs">(optional)</span></div>
        <div><code class="inline-block my-1 mr-1 px-2 py-1 font-mono border rounded bg-smoke-light">&nbsp;</code> All <em class="text-xs text-slate-light">(default)</em></div>
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
        <div><code class="inline-block my-1 mr-1 px-1 py-1 font-mono border rounded">px</code> 1px</div>
        <div><code class="inline-block my-1 mr-1 px-1 py-1 font-mono border rounded">auto</code> auto <span class="text-slate-light text-xs">(margins only)</span></div>
    </div>
</div>
