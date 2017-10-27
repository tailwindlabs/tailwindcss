---
extends: _layouts.markdown
title: "Align Items - Flexbox"
category: "Flexbox"
---

# Align Self

<div class="text-xl text-slate-light">
    Utilities for controlling how an individual flex item is positioned along its container's cross axis.
</div>

<div class="subnav">
    <a class="subnav-link" href="#responsive">Responsive</a>
</div>

### Auto <span class="ml-2 font-semibold text-slate-light text-sm uppercase tracking-wide">Default</span>

Use `.self-auto` to align an item based on the flex container's `align-items` value:

@component('_partials.code-sample')
<div class="flex items-stretch bg-smoke-light h-24">
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">1</div>
    <div class="self-auto flex-1 text-slate-dark text-center bg-smoke-dark px-4 py-2 m-2">2</div>
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">3</div>
</div>
@endcomponent

### Start

Use `.self-start` to align an item to the start of the flex container's cross axis, despite the container's `align-items` value:

@component('_partials.code-sample')
<div class="flex items-stretch bg-smoke-light h-24">
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">1</div>
    <div class="self-start flex-1 text-slate-dark text-center bg-smoke-dark px-4 py-2 m-2">2</div>
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">3</div>
</div>
@endcomponent

### Center

Use `.self-center` to align an item along the center of the flex container's cross axis, despite the container's `align-items` value:

@component('_partials.code-sample')
<div class="flex items-stretch bg-smoke-light h-24">
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">1</div>
    <div class="self-center flex-1 text-slate-dark text-center bg-smoke-dark px-4 py-2 m-2">2</div>
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">3</div>
</div>
@endcomponent

### End

Use `.self-end` to align an item to the end of the flex container's cross axis, despite the container's `align-items` value:

@component('_partials.code-sample')
<div class="flex items-stretch bg-smoke-light h-24">
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">1</div>
    <div class="self-end flex-1 text-slate-dark text-center bg-smoke-dark px-4 py-2 m-2">2</div>
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">3</div>
</div>
@endcomponent

### Stretch

Use `.self-stretch` to stretch an item to fill the flex container's cross axis, despite the container's `align-items` value:

@component('_partials.code-sample')
<div class="flex items-start bg-smoke-light h-24">
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">1</div>
    <div class="self-stretch flex-1 text-slate-dark text-center bg-smoke-dark px-4 py-2 m-2">2</div>
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">3</div>
</div>
@endcomponent

## Responsive

To control the alignment of a flex item at a specific breakpoint, add a `{breakpoint}:` prefix to any existing utility class. For example, use `md:self-end` to apply the `self-end` utility at only medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](#) documentation.

@component('_partials.responsive-code-sample')
@slot('none')
<div class="flex items-stretch bg-smoke-light h-24">
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">1</div>
    <div class="self-auto flex-1 text-slate-dark text-center bg-smoke-dark px-4 py-2 m-2">2</div>
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">3</div>
</div>
@endslot
@slot('sm')
<div class="flex items-stretch bg-smoke-light h-24">
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">1</div>
    <div class="self-start flex-1 text-slate-dark text-center bg-smoke-dark px-4 py-2 m-2">2</div>
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">3</div>
</div>
@endslot
@slot('md')
<div class="flex items-stretch bg-smoke-light h-24">
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">1</div>
    <div class="self-end flex-1 text-slate-dark text-center bg-smoke-dark px-4 py-2 m-2">2</div>
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">3</div>
</div>
@endslot
@slot('lg')
<div class="flex items-stretch bg-smoke-light h-24">
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">1</div>
    <div class="self-center flex-1 text-slate-dark text-center bg-smoke-dark px-4 py-2 m-2">2</div>
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">3</div>
</div>
@endslot
@slot('xl')
<div class="flex items-stretch bg-smoke-light h-24">
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">1</div>
    <div class="self-stretch flex-1 text-slate-dark text-center bg-smoke-dark px-4 py-2 m-2">2</div>
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">3</div>
</div>
@endslot
@slot('code')
<div class="items-stretch ...">
    <!-- ... -->
    <div class="none:self-auto sm:self-start md:self-end lg:self-center xl:self-stretch ...">2</div>
    <!-- ... -->
</div>
@endslot
@endcomponent
