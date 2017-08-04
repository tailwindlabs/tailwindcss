---
extends: _layouts.master
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

Construct border size utilities using the <code class="inline">.border-side-width</code> syntax. For example, <code class="inline">.border</code> would add a <code class="inline">1px</code> border to the element, where <code class="inline">.border-b-3</code> would add a <code class="inline">4px</code> bottom border to the element. Note that that the default border style is <code class="inline">solid</code>, and will get the <code class="inline">@border-default-color</code> applied.

<div class="flex flex-top mt-8 text-sm">
    <div class="pr-12">
        <div class="mb-3 text-dark-soft text-uppercase">Class</div>
        <div><code class="inline-block my-1 mr-1 px-2 py-1 text-mono border rounded">border</code></div>
    </div>
    <div class="pl-12 pr-12 border-l">
        <div class="mb-3 text-dark-soft"><span class="text-uppercase">Side</span> <span class="text-dark-softer text-xs">(optional)</span></div>
        <div><code class="inline-block my-1 mr-1 px-2 py-1 text-mono border rounded bg-light-softer">&nbsp;</code> All</div>
        <div><code class="inline-block my-1 mr-1 px-2 py-1 text-mono border rounded">t</code> Top</div>
        <div><code class="inline-block my-1 mr-1 px-2 py-1 text-mono border rounded">r</code> Right</div>
        <div><code class="inline-block my-1 mr-1 px-2 py-1 text-mono border rounded">b</code> Bottom</div>
        <div><code class="inline-block my-1 mr-1 px-2 py-1 text-mono border rounded">l</code> Left</div>
    </div>
    <div class="pl-12 border-l">
        <div class="mb-3 text-dark-soft"><span class="text-uppercase">Width</span> <span class="text-dark-softer text-xs">(optional)</span></div>
        <div><code class="inline-block my-1 mr-1 px-2 py-1 text-mono border rounded bg-light-softer">&nbsp;</code> 1px</div>
        <div><code class="inline-block my-1 mr-1 px-2 py-1 text-mono border rounded">2</code> 2px</div>
        <div><code class="inline-block my-1 mr-1 px-2 py-1 text-mono border rounded">3</code> 4px</div>
        <div><code class="inline-block my-1 mr-1 px-2 py-1 text-mono border rounded">4</code> 8px</div>
    </div>
</div>

<h2 id="colors">Colors</h2>

By default borders receive the <code class="inline">@border-default-color</code>. However, these can be modified using the border color utilities.

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

@border-default-color:  @border-dark-soft;
```

<h2 id="styles">Styles</h2>

By default borders styles are set to <code class="inline">solid</code>. This be modified using the border style utilities.

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

To apply a <code class="inline">border-radius</code> to an element, using the rounded utilities.

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

