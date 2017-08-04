---
extends: _layouts.master
title: "Spacing"
---

# Spacing

The syntax below is combined to create a system for padding and margins. For example, <code class="inline">.pt-2</code> would add padding to the top of the element to the value of <code class="inline">0.5rem</code> and <code class="inline">.mx-0</code> would make the horizontal margin zero.

<div class="flex flex-top mt-8 text-sm">
    <div class="pr-12">
        <div class="mb-3 text-dark-soft text-uppercase">Class</div>
        <div><code class="inline-block my-1 mr-1 px-2 py-1 text-mono border rounded">p</code> Padding</div>
        <div><code class="inline-block my-1 mr-1 px-2 py-1 text-mono border rounded">m</code> Margin</div>
        <div><code class="inline-block my-1 mr-1 px-2 py-1 text-mono border rounded">pull</code> Negative Margin</div>
    </div>
    <div class="pl-12 pr-12 border-l">
        <div class="mb-3 text-dark-soft"><span class="text-uppercase">Position</span> <span class="text-dark-softer text-xs">(optional)</span></div>
        <div><code class="inline-block my-1 mr-1 px-2 py-1 text-mono border rounded">t</code> Top</div>
        <div><code class="inline-block my-1 mr-1 px-2 py-1 text-mono border rounded">r</code> Right</div>
        <div><code class="inline-block my-1 mr-1 px-2 py-1 text-mono border rounded">b</code> Bottom</div>
        <div><code class="inline-block my-1 mr-1 px-2 py-1 text-mono border rounded">l</code> Left</div>
        <div><code class="inline-block my-1 mr-1 px-2 py-1 text-mono border rounded">x</code> Horizontal</div>
        <div><code class="inline-block my-1 mr-1 px-2 py-1 text-mono border rounded">y</code> Vertical</div>
    </div>
    <div class="pl-12 border-l">
        <div class="mb-3 text-dark-soft text-uppercase">Space</div>
        <div><code class="inline-block my-1 mr-1 px-2 py-1 text-mono border rounded">0</code> 0</div>
        <div><code class="inline-block my-1 mr-1 px-2 py-1 text-mono border rounded">1</code> 0.25rem</div>
        <div><code class="inline-block my-1 mr-1 px-2 py-1 text-mono border rounded">2</code> 0.5rem</div>
        <div><code class="inline-block my-1 mr-1 px-2 py-1 text-mono border rounded">3</code> 0.75rem</div>
        <div><code class="inline-block my-1 mr-1 px-2 py-1 text-mono border rounded">4</code> 1rem</div>
        <div><code class="inline-block my-1 mr-1 px-2 py-1 text-mono border rounded">6</code> 1.5rem</div>
        <div><code class="inline-block my-1 mr-1 px-2 py-1 text-mono border rounded">8</code> 2rem</div>
    </div>
</div>

## Responsive

The spacing utitlies can also be used with <a href="/responsive">responsive</a> prefixes:

```html
<!-- Using the utilities in HTML: -->

<div class="p-1 sm:p-2 md:p-3 lg:p-4"></div>
<div class="m-1 sm:m-2 md:m-3 lg:m-4"></div>
<div class="pull-1 sm:pull-2 md:pull-3 lg:pull-4"></div>
```

```less
// Using the utilities in Less:

div {
  .screen(lg, {
    .mt-6;
  });
}
```
