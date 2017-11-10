---
extends: _layouts.documentation
title: "Align Items"
description: "Utilities for controlling how flex items are positioned along a container's cross axis."
features:
  responsive: true
  customizable: false
  hover: false
  focus: false
---

<div class="border-t border-grey-lighter">
  <table class="w-full text-left table-collapse">
    <colgroup>
      <col class="w-1/5">
      <col class="w-1/3">
      <col>
    </colgroup>
    <thead>
      <tr>
        <th class="text-sm font-semibold text-grey-darker p-2 bg-grey-lightest">Class</th>
        <th class="text-sm font-semibold text-grey-darker p-2 bg-grey-lightest">Properties</th>
        <th class="text-sm font-semibold text-grey-darker p-2 bg-grey-lightest">Description</th>
      </tr>
    </thead>
    <tbody class="align-baseline">
      <tr>
        <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark">.items-stretch</td>
        <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark">align-items: flex-stretch;</td>
        <td class="p-2 border-t border-smoke text-sm text-grey-darker">Stretch items to fill the cross axis.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.items-start</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">align-items: flex-start;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Align items against the start of the cross axis.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.items-center</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">align-items: center;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Align items along the center of the cross axis.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.items-end</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">align-items: flex-end;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Align items against the end of the cross axis.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.items-baseline</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">align-items: baseline;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Align the baselines of each item.</td>
      </tr>
    </tbody>
  </table>
</div>

### Stretch <span class="ml-2 font-semibold text-slate-light text-sm uppercase tracking-wide">Default</span>

Use `.items-stretch` to stretch items to fill the flex container's cross axis:

@component('_partials.code-sample')
<div class="flex items-stretch bg-smoke-light h-24">
  <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">1</div>
  <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">2</div>
  <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">3</div>
</div>
@endcomponent

### Start

Use `.items-start` to align items to the start of the flex container's cross axis:

@component('_partials.code-sample')
<div class="flex items-start bg-smoke-light h-24">
  <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">1</div>
  <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">2</div>
  <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">3</div>
</div>
@endcomponent

### Center

Use `.items-center` to align items along the center of the flex container's cross axis:

@component('_partials.code-sample')
<div class="flex items-center bg-smoke-light h-24">
  <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">1</div>
  <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">2</div>
  <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">3</div>
</div>
@endcomponent

### End

Use `.items-end` to align items to the end of the flex container's cross axis:

@component('_partials.code-sample')
<div class="flex items-end bg-smoke-light h-24">
  <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">1</div>
  <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">2</div>
  <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">3</div>
</div>
@endcomponent

### Baseline

Use `.items-baseline` to align items along the flex container's cross axis such that all of their baselines align:

@component('_partials.code-sample')
<div class="flex items-baseline bg-smoke-light h-24">
  <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2 text-base">1</div>
  <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2 text-2xl">2</div>
  <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2 text-lg">3</div>
</div>
@endcomponent

## Responsive

To control the alignment of flex items at a specific breakpoint, add a `{screen}:` prefix to any existing utility class. For example, use `md:items-center` to apply the `items-center` utility at only medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

@component('_partials.responsive-code-sample')
@slot('none')
<div class="flex items-stretch bg-smoke-light h-24">
  <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2 text-base">1</div>
  <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2 text-2xl">2</div>
  <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2 text-lg">3</div>
</div>
@endslot
@slot('sm')
<div class="flex items-start bg-smoke-light h-24">
  <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2 text-base">1</div>
  <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2 text-2xl">2</div>
  <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2 text-lg">3</div>
</div>
@endslot
@slot('md')
<div class="flex items-center bg-smoke-light h-24">
  <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2 text-base">1</div>
  <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2 text-2xl">2</div>
  <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2 text-lg">3</div>
</div>
@endslot
@slot('lg')
<div class="flex items-end bg-smoke-light h-24">
  <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2 text-base">1</div>
  <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2 text-2xl">2</div>
  <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2 text-lg">3</div>
</div>
@endslot
@slot('xl')
<div class="flex items-baseline bg-smoke-light h-24">
  <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2 text-base">1</div>
  <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2 text-2xl">2</div>
  <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2 text-lg">3</div>
</div>
@endslot
@slot('code')
<div class="none:items-stretch sm:items-start md:items-center lg:items-end xl:items-baseline ...">
  <!-- ... -->
</div>
@endslot
@endcomponent
