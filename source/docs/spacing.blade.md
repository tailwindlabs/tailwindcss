---
extends: _layouts.documentation
title: "Spacing"
description: "Utilities for controlling an element's padding and margin."
features:
  responsive: true
  customizable: true
  hover: false
  focus: false
---

@include('_partials.work-in-progress')

Control an element's padding and margin using the `.p{side?}-{size}`, `.m{side?}-{size}`, and `.-m{side?}-{size}` utilities.

For example, `.pt-2` would add `.5rem` of padding to the top of the element, `.mx-0` would make the horizontal margin zero, and `.-mb-6` would add a `1.5rem` negative margin to the bottom of an element.

<div class="flex items-start mt-8 text-sm">
  <div class="pr-12">
    <div class="mb-3 text-grey-darker uppercase">Class</div>
    <div><code class="inline-block my-1 mr-1 px-2 py-1 font-mono border rounded">p</code> Padding</div>
    <div><code class="inline-block my-1 mr-1 px-2 py-1 font-mono border rounded">m</code> Margin</div>
    <div><code class="inline-block my-1 mr-1 px-2 py-1 font-mono border rounded">-m</code> Negative Margin</div>
  </div>
  <div class="pl-12 pr-12 border-l">
    <div class="mb-3 text-grey-darker"><span class="uppercase">Side</span> <span class="text-grey-dark text-xs">(optional)</span></div>
    <div><code class="inline-block my-1 mr-1 px-2 py-1 font-mono border rounded bg-grey-lighter">&nbsp;</code> All <em class="text-xs text-grey-dark">(default)</em></div>
    <div><code class="inline-block my-1 mr-1 px-2 py-1 font-mono border rounded">t</code> Top</div>
    <div><code class="inline-block my-1 mr-1 px-2 py-1 font-mono border rounded">r</code> Right</div>
    <div><code class="inline-block my-1 mr-1 px-2 py-1 font-mono border rounded">b</code> Bottom</div>
    <div><code class="inline-block my-1 mr-1 px-2 py-1 font-mono border rounded">l</code> Left</div>
    <div><code class="inline-block my-1 mr-1 px-2 py-1 font-mono border rounded">x</code> Horizontal</div>
    <div><code class="inline-block my-1 mr-1 px-2 py-1 font-mono border rounded">y</code> Vertical</div>
  </div>
  <div class="pl-12 border-l">
    <div class="mb-3 text-grey-darker uppercase">Space</div>
    <div><code class="inline-block my-1 mr-1 px-2 py-1 font-mono border rounded">0</code> 0</div>
    <div><code class="inline-block my-1 mr-1 px-2 py-1 font-mono border rounded">1</code> 0.25rem</div>
    <div><code class="inline-block my-1 mr-1 px-2 py-1 font-mono border rounded">2</code> 0.5rem</div>
    <div><code class="inline-block my-1 mr-1 px-2 py-1 font-mono border rounded">3</code> 0.75rem</div>
    <div><code class="inline-block my-1 mr-1 px-2 py-1 font-mono border rounded">4</code> 1rem</div>
    <div><code class="inline-block my-1 mr-1 px-2 py-1 font-mono border rounded">5</code> 1.25rem</div>
    <div><code class="inline-block my-1 mr-1 px-2 py-1 font-mono border rounded">6</code> 1.5rem</div>
    <div><code class="inline-block my-1 mr-1 px-2 py-1 font-mono border rounded">8</code> 2rem</div>
    <div><code class="inline-block my-1 mr-1 px-2 py-1 font-mono border rounded">10</code> 2.5rem</div>
    <div><code class="inline-block my-1 mr-1 px-2 py-1 font-mono border rounded">12</code> 3rem</div>
    <div><code class="inline-block my-1 mr-1 px-2 py-1 font-mono border rounded">16</code> 4rem</div>
    <div><code class="inline-block my-1 mr-1 px-2 py-1 font-mono border rounded">20</code> 5rem</div>
    <div><code class="inline-block my-1 mr-1 px-2 py-1 font-mono border rounded">24</code> 6rem</div>
    <div><code class="inline-block my-1 mr-1 px-2 py-1 font-mono border rounded">32</code> 8rem</div>
    <div><code class="inline-block my-1 mr-1 px-1 py-1 font-mono border rounded">px</code> 1px</div>
    <div><code class="inline-block my-1 mr-1 px-1 py-1 font-mono border rounded">auto</code> auto <span class="text-grey-dark text-xs">(margins only)</span></div>
  </div>
</div>

## Customizing

### Responsive and State Variants

By default, only responsive variants are generated for margin, negative margin and padding utilities.

You can control which variants are generated for the list utilities by modifying the `margin`, `negativeMargin` and `padding` property in the `modules` section of your Tailwind config file.

For example, this config will _also_ generate hover and focus variants of the margin utilities, hover variants of the negative margin utilities, and focus variants of the padding utilities:

```js
{
    // ...
    modules: {
        // ...
        margin: ['responsive', 'hover', 'focus'],
        negativeMargin: ['responsive', 'hover'],
        padding: ['responsive', 'focus'],
    }
}
```

### Disabling

If you aren't using the margin, the negative margin, or padding utilities in your project, you can disable them entirely by setting the `margin`, `negativeMargin` and `padding` property to `false` in the `modules` section of your config file:

```js
{
    // ...
    modules: {
        // ...
        margin: false,
        negativeMargin: false,
        padding: false,
    }
}
```
