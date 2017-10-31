---
extends: _layouts.documentation
title: "Align Items - Flexbox"
category: "Flexbox"
---

# Align Self

<div class="text-xl text-slate-light mb-4">
    Utilities for controlling how an individual flex item is positioned along its container's cross axis.
</div>

@include('_partials.feature-badges', [
    'responsive' => true,
    'customizable' => false,
    'hover' => false,
    'focus' => false
])

<div class="border-t border-grey-lighter">
    <table class="w-full text-left" style="border-collapse: collapse;">
        <thead>
          <tr>
              <th class="text-sm font-semibold text-grey-darker p-2 bg-grey-lightest">Class</th>
              <th class="text-sm font-semibold text-grey-darker p-2 bg-grey-lightest">Properties</th>
              <th class="text-sm font-semibold text-grey-darker p-2 bg-grey-lightest">Description</th>
          </tr>
        </thead>
        <tbody class="align-baseline">
            <tr>
                <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark">.self-auto</td>
                <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark">align-self: auto;</td>
                <td class="p-2 border-t border-smoke text-sm text-grey-darker">Align item based on the container's <code>align-items</code> property.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.self-start</td>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">align-self: flex-start;</td>
                <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Align item against the start of the cross axis.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.self-center</td>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">align-self: center;</td>
                <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Align item along the center of the cross axis.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.self-end</td>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">align-self: flex-end;</td>
                <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Align item against the end of the cross axis.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.self-stretch</td>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">align-self: stretch;</td>
                <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Stretch item to fill the cross axis.</td>
            </tr>
        </tbody>
    </table>
</div>

### Auto <span class="ml-2 font-semibold text-slate-light text-sm uppercase tracking-wide">Default</span>

Use `.self-auto` to align an item based on the value of the flex container's `align-items` property:

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

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

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
