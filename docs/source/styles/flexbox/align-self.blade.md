---
extends: _layouts.markdown
title: "Flexbox"
---

<div class="font-semibold text-slate-light text-base uppercase tracking-wide mb-2">Flexbox</div>

# Align Self

<div class="subnav">
    <a class="subnav-link" href="#usage">Usage</a>
    <a class="subnav-link" href="#responsive">Responsive</a>
    <a class="subnav-link" href="#customizing">Customizing</a>
</div>

Tailwind provides a comprehensive set of Flexbox utilities out of the box to make it easy for you to implement complex layouts without having to write any new CSS.

## Start

Use `.self-start` to align an item to the start of the flex container's cross axis, despite the container's `align-items` value:

@component('_partials.code-sample')
<div class="flex items-stretch bg-smoke-light h-24">
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">1</div>
    <div class="self-start flex-1 text-slate-dark text-center bg-smoke-dark px-4 py-2 m-2">2</div>
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">3</div>
</div>
@endcomponent

## End

Use `.self-end` to align an item to the end of the flex container's cross axis, despite the container's `align-items` value:

@component('_partials.code-sample')
<div class="flex items-stretch bg-smoke-light h-24">
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">1</div>
    <div class="self-end flex-1 text-slate-dark text-center bg-smoke-dark px-4 py-2 m-2">2</div>
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">3</div>
</div>
@endcomponent

## Center

Use `.self-center` to align an item along the center of the flex container's cross axis, despite the container's `align-items` value:

@component('_partials.code-sample')
<div class="flex items-stretch bg-smoke-light h-24">
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">1</div>
    <div class="self-center flex-1 text-slate-dark text-center bg-smoke-dark px-4 py-2 m-2">2</div>
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">3</div>
</div>
@endcomponent

## Stretch

Use `.self-stretch` to stretch an item to fill the flex container's cross axis, despite the container's `align-items` value:

@component('_partials.code-sample')
<div class="flex items-start bg-smoke-light h-24">
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">1</div>
    <div class="self-stretch flex-1 text-slate-dark text-center bg-smoke-dark px-4 py-2 m-2">2</div>
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">3</div>
</div>
@endcomponent
