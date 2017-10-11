---
extends: _layouts.markdown
title: "Borders"
---

# Borders

<div class="subnav">
    <a class="subnav-link" href="#usage">Usage</a>
    <a class="subnav-link" href="#responsive">Responsive</a>
    <a class="subnav-link" href="#customizing">Customizing</a>
</div>

<h2 id="sizes">Sizes</h2>

Construct border size utilities using the `.border{-side?}{-width?}` syntax. For example, `.border` would add a `1px` border to all sides of the element, where `.border-b-4` would add a `4px` border to the bottom of the element. By default, borders are `solid`, and use the `@default-border-color`.

<div class="flex items-start mt-8 text-sm leading-none">
    <div class="pr-12">
        <div class="mb-3 text-dark-soft text-uppercase">Class</div>
        <div><code class="inline-block my-1 mr-1 px-2 py-1 mono border rounded">border</code></div>
    </div>
    <div class="pl-12 pr-12 border-l">
        <div class="mb-3 text-dark-soft"><span class="text-uppercase">Side</span> <span class="text-dark-softer text-xs">(optional)</span></div>
        <div><code class="inline-block my-1 mr-1 px-2 py-1 mono border rounded bg-light-softer">&nbsp;</code> All</div>
        <div><code class="inline-block my-1 mr-1 px-2 py-1 mono border rounded">t</code> Top</div>
        <div><code class="inline-block my-1 mr-1 px-2 py-1 mono border rounded">r</code> Right</div>
        <div><code class="inline-block my-1 mr-1 px-2 py-1 mono border rounded">b</code> Bottom</div>
        <div><code class="inline-block my-1 mr-1 px-2 py-1 mono border rounded">l</code> Left</div>
    </div>
    <div class="pl-12 border-l">
        <div class="mb-3 text-dark-soft"><span class="text-uppercase">Width</span> <span class="text-dark-softer text-xs">(optional)</span></div>
        <div><code class="inline-block my-1 mr-1 px-2 py-1 mono border rounded">0</code> 0px</div>
        <div><code class="inline-block my-1 mr-1 px-2 py-1 mono border rounded bg-light-softer">&nbsp;</code> 1px</div>
        <div><code class="inline-block my-1 mr-1 px-2 py-1 mono border rounded">2</code> 2px</div>
        <div><code class="inline-block my-1 mr-1 px-2 py-1 mono border rounded">4</code> 4px</div>
        <div><code class="inline-block my-1 mr-1 px-2 py-1 mono border rounded">8</code> 8px</div>
    </div>
</div>

### Border size examples

```html
<!-- Add a 1px border to all sides -->
<div class="border"></div>

<!-- Add a 1px border to the top side -->
<div class="border-t"></div>

<!-- Add a 2px border to the top side -->
<div class="border-t-2"></div>
```

```less
// Using the border size utilities in Less
div {
    .border;
    .border-t;
    .border-t-2;
}
```

### Customizing border sizes

You can easily customize the border size utilities using the `@border-width-scale` variable. Please note that the entire scale must be redefined. It's not possible to add a new value to the existing scale.

```less
// The default border width scale
@border-width-scale:
  '0' 0,
  default 1px,
  '2' 2px,
  '4' 4px,
  '8' 8px,
;
```
