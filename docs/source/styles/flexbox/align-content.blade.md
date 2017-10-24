---
extends: _layouts.markdown
title: "Flexbox"
---

<div class="font-semibold text-slate-light text-base uppercase tracking-wide mb-2">Flexbox</div>

# Align Content

<div class="subnav">
    <a class="subnav-link" href="#usage">Usage</a>
    <a class="subnav-link" href="#responsive">Responsive</a>
    <a class="subnav-link" href="#customizing">Customizing</a>
</div>

Tailwind provides a comprehensive set of Flexbox utilities out of the box to make it easy for you to implement complex layouts without having to write any new CSS.

## Start

Use `.content-start` to pack lines in a flex container against the start of the main axis *(this is also the default behavior)*:

@component('_partials.code-sample')
<div class="flex content-start flex-wrap bg-smoke-light h-48">
    <div class="w-1/3 p-2">
        <div class="text-slate text-center bg-smoke p-2">1</div>
    </div>
    <div class="w-1/3 p-2">
        <div class="text-slate text-center bg-smoke p-2">2</div>
    </div>
    <div class="w-1/3 p-2">
        <div class="text-slate text-center bg-smoke p-2">3</div>
    </div>
    <div class="w-1/3 p-2">
        <div class="text-slate text-center bg-smoke p-2">4</div>
    </div>
    <div class="w-1/3 p-2">
        <div class="text-slate text-center bg-smoke p-2">5</div>
    </div>
</div>
@endcomponent

## Center

Use `.content-center` to pack lines in a flex container in the center of the main axis:

@component('_partials.code-sample')
<div class="flex content-center flex-wrap bg-smoke-light h-48">
    <div class="w-1/3 p-2">
        <div class="text-slate text-center bg-smoke p-2">1</div>
    </div>
    <div class="w-1/3 p-2">
        <div class="text-slate text-center bg-smoke p-2">2</div>
    </div>
    <div class="w-1/3 p-2">
        <div class="text-slate text-center bg-smoke p-2">3</div>
    </div>
    <div class="w-1/3 p-2">
        <div class="text-slate text-center bg-smoke p-2">4</div>
    </div>
    <div class="w-1/3 p-2">
        <div class="text-slate text-center bg-smoke p-2">5</div>
    </div>
</div>
@endcomponent

## End

Use `.content-end` to pack lines in a flex container against the end of the main axis:

@component('_partials.code-sample')
<div class="flex content-end flex-wrap bg-smoke-light h-48">
    <div class="w-1/3 p-2">
        <div class="text-slate text-center bg-smoke p-2">1</div>
    </div>
    <div class="w-1/3 p-2">
        <div class="text-slate text-center bg-smoke p-2">2</div>
    </div>
    <div class="w-1/3 p-2">
        <div class="text-slate text-center bg-smoke p-2">3</div>
    </div>
    <div class="w-1/3 p-2">
        <div class="text-slate text-center bg-smoke p-2">4</div>
    </div>
    <div class="w-1/3 p-2">
        <div class="text-slate text-center bg-smoke p-2">5</div>
    </div>
</div>
@endcomponent

## Space between

Use `.content-between` to distribute lines in a flex container such that there is an equal amount of space between each line:

@component('_partials.code-sample')
<div class="flex content-between flex-wrap bg-smoke-light h-48">
    <div class="w-1/3 p-2">
        <div class="text-slate text-center bg-smoke p-2">1</div>
    </div>
    <div class="w-1/3 p-2">
        <div class="text-slate text-center bg-smoke p-2">2</div>
    </div>
    <div class="w-1/3 p-2">
        <div class="text-slate text-center bg-smoke p-2">3</div>
    </div>
    <div class="w-1/3 p-2">
        <div class="text-slate text-center bg-smoke p-2">4</div>
    </div>
    <div class="w-1/3 p-2">
        <div class="text-slate text-center bg-smoke p-2">5</div>
    </div>
</div>
@endcomponent

## Space around

Use `.content-around` to distribute lines in a flex container such that there is an equal amount of space around each line:

@component('_partials.code-sample')
<div class="flex content-around flex-wrap bg-smoke-light h-48">
    <div class="w-1/3 p-2">
        <div class="text-slate text-center bg-smoke p-2">1</div>
    </div>
    <div class="w-1/3 p-2">
        <div class="text-slate text-center bg-smoke p-2">2</div>
    </div>
    <div class="w-1/3 p-2">
        <div class="text-slate text-center bg-smoke p-2">3</div>
    </div>
    <div class="w-1/3 p-2">
        <div class="text-slate text-center bg-smoke p-2">4</div>
    </div>
    <div class="w-1/3 p-2">
        <div class="text-slate text-center bg-smoke p-2">5</div>
    </div>
</div>
@endcomponent
