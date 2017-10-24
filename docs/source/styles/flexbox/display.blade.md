---
extends: _layouts.markdown
title: "Display – Flexbox"
---

<div class="font-semibold text-slate-light text-base uppercase tracking-wide mb-2">Flexbox</div>

# Display

<div class="subnav">
    <a class="subnav-link" href="#usage">Usage</a>
    <a class="subnav-link" href="#responsive">Responsive</a>
    <a class="subnav-link" href="#customizing">Customizing</a>
</div>

Tailwind provides a comprehensive set of Flexbox utilities out of the box to make it easy for you to implement complex layouts without having to write any new CSS.

## Flex

Use `.flex` to create a block-level flex container:

@component('_partials.code-sample')
<div class="flex bg-smoke-light">
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">1</div>
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">2</div>
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">3</div>
</div>
@endcomponent

## Inline flex

Use `.inline-flex` to create an inline flex container:

@component('_partials.code-sample')
<div class="inline-flex bg-smoke-light">
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">1</div>
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">2</div>
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">3</div>
</div>
@endcomponent
