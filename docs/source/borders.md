---
extends: _layouts.markdown
title: "Borders"
---

# Borders

<div class="subnav">
    <a class="subnav-link" href="#sizes">Sizes</a>
    <a class="subnav-link" href="#colors">Colors</a>
    <a class="subnav-link" href="#styles">Styles</a>
    <a class="subnav-link" href="#radius">Radius</a>
    <a class="subnav-link" href="#responsive">Responsive</a>
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

<h2 id="colors">Colors</h2>

By default, borders use the `@default-border-color`. To override a border color, add one of the border color utilities.

```html
<div class="border border-dark"></div>
<div class="border border-dark-soft"></div>
<div class="border border-dark-softer"></div>

<div class="border border-light"></div>
<div class="border border-light-soft"></div>
<div class="border border-light-softer"></div>

<div class="border border-invisible"></div>
```

```less
div {
  .border-dark;
  .border-dark-soft;
  .border-dark-softer;

  .border-light;
  .border-light-soft;
  .border-light-softer;

  .border-invisible;
}
```

The default border colors can also be modified using the following variables.

```less
// Variable:            Default:
@border-dark:           hsl(0, 0%, 82%);
@border-dark-soft:      hsl(0, 0%, 90%);
@border-dark-softer:    hsl(0, 0%, 96%);

@border-light:          hsl(0, 0%, 100%);
@border-light-soft:     hsl(0, 0%, 60%);
@border-light-softer:   hsl(0, 0%, 35%);

@default-border-color:  @border-dark-soft;
```

<h2 id="styles">Styles</h2>

By default borders styles are set to `solid`. This be modified using the border style utilities.

```html
<div class="border border-dashed"></div>
<div class="border border-dotted"></div>
```

```less
div {
  .border-dashed;
  .border-dotted;
}
```

<h2 id="radius">Radius</h2>

To apply a `border-radius` to an element, using the rounded utilities.

```less
div {
  .rounded-sm;
  .rounded-t-sm;
  .rounded-r-sm;
  .rounded-b-sm;
  .rounded-l-sm;
  .rounded;
  .rounded-t;
  .rounded-r;
  .rounded-b;
  .rounded-l;
  .rounded-lg;
  .rounded-t-lg;
  .rounded-r-lg;
  .rounded-b-lg;
  .rounded-l-lg;
  .pill;
}
```

<h2 id="responsive">Responsive</h2>

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

