---
extends: _layouts.documentation
title: "Borders"
---

# Borders

<div class="subnav">
    <a class="subnav-link" href="#usage">Usage</a>
    <a class="subnav-link" href="#responsive">Responsive</a>
    <a class="subnav-link" href="#customizing">Customizing</a>
</div>

## Usage

Add borders to any element using the `.border{-side?}{-width?}` syntax. For example, `.border` would add a `1px` border to all sides of the element, where `.border-b-4` would add a `4px` border to the bottom of the element.

<div class="flex items-start mt-8 text-sm leading-none">
    <div class="pr-12">
        <div class="mb-3 text-slate uppercase">Class</div>
        <div><code class="inline-block my-1 mr-1 px-2 py-1 font-mono border rounded">border</code></div>
    </div>
    <div class="pl-12 pr-12 border-l">
        <div class="mb-3 text-slate"><span class="uppercase">Side</span> <span class="text-slate-light text-xs">(optional)</span></div>
        <div><code class="inline-block my-1 mr-1 px-2 py-1 font-mono border rounded bg-smoke-light">&nbsp;</code> All <em class="text-xs text-slate-light">(default)</em></div>
        <div><code class="inline-block my-1 mr-1 px-2 py-1 font-mono border rounded">t</code> Top</div>
        <div><code class="inline-block my-1 mr-1 px-2 py-1 font-mono border rounded">r</code> Right</div>
        <div><code class="inline-block my-1 mr-1 px-2 py-1 font-mono border rounded">b</code> Bottom</div>
        <div><code class="inline-block my-1 mr-1 px-2 py-1 font-mono border rounded">l</code> Left</div>
    </div>
    <div class="pl-12 border-l">
        <div class="mb-3 text-slate"><span class="uppercase">Width</span> <span class="text-slate-light text-xs">(optional)</span></div>
        <div><code class="inline-block my-1 mr-1 px-2 py-1 font-mono border rounded">0</code> 0px</div>
        <div><code class="inline-block my-1 mr-1 px-2 py-1 font-mono border rounded bg-smoke-light">&nbsp;</code> 1px <em class="text-xs text-slate-light">(default)</em></div>
        <div><code class="inline-block my-1 mr-1 px-2 py-1 font-mono border rounded">2</code> 2px</div>
        <div><code class="inline-block my-1 mr-1 px-2 py-1 font-mono border rounded">4</code> 4px</div>
        <div><code class="inline-block my-1 mr-1 px-2 py-1 font-mono border rounded">8</code> 8px</div>
    </div>
</div>

### Examples

```html
<!-- Add a 1px border to all sides -->
<div class="border"></div>

<!-- Add a 1px border to the top side -->
<div class="border-t"></div>

<!-- Add a 2px border to all sides -->
<div class="border-2"></div>

<!-- Add a 2px border to the top side -->
<div class="border-t-2"></div>
```

## Responsive

## Customizing
