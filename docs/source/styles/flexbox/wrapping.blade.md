---
extends: _layouts.markdown
title: "Flexbox"
---

<div class="font-semibold text-slate-light text-base uppercase tracking-wide mb-2">Flexbox</div>

# Flex Wrapping

<div class="subnav">
    <a class="subnav-link" href="#usage">Usage</a>
    <a class="subnav-link" href="#responsive">Responsive</a>
    <a class="subnav-link" href="#customizing">Customizing</a>
</div>

Tailwind provides a comprehensive set of Flexbox utilities out of the box to make it easy for you to implement complex layouts without having to write any new CSS.

<h2>Don't wrap <span class="ml-2 font-semibold text-slate-light text-sm uppercase tracking-wide">Default</span></h2>

Use `.flex-no-wrap` to prevent flex items from wrapping, causing inflexible items to overflow the container if necessary:

@component('_partials.code-sample')
<div class="flex flex-no-wrap bg-smoke-light">
    <div class="w-2/5 flex-none p-2">
        <div class="text-slate text-center bg-smoke p-2">1</div>
    </div>
    <div class="w-2/5 flex-none p-2">
        <div class="text-slate text-center bg-smoke p-2">2</div>
    </div>
    <div class="w-2/5 flex-none p-2">
        <div class="text-slate text-center bg-smoke p-2">3</div>
    </div>
</div>
@endcomponent

## Wrap normally

Use `.flex-wrap` to allow flex items to wrap:

@component('_partials.code-sample')
<div class="flex flex-wrap bg-smoke-light">
    <div class="w-2/5 p-2">
        <div class="text-slate text-center bg-smoke p-2">1</div>
    </div>
    <div class="w-2/5 p-2">
        <div class="text-slate text-center bg-smoke p-2">2</div>
    </div>
    <div class="w-2/5 p-2">
        <div class="text-slate text-center bg-smoke p-2">3</div>
    </div>
</div>
@endcomponent

## Wrap reversed

Use `.flex-wrap-reverse` to wrap flex items in the reverse direction:

@component('_partials.code-sample')
<div class="flex flex-wrap-reverse bg-smoke-light">
    <div class="w-2/5 p-2">
        <div class="text-slate text-center bg-smoke p-2">1</div>
    </div>
    <div class="w-2/5 p-2">
        <div class="text-slate text-center bg-smoke p-2">2</div>
    </div>
    <div class="w-2/5 p-2">
        <div class="text-slate text-center bg-smoke p-2">3</div>
    </div>
</div>
@endcomponent
