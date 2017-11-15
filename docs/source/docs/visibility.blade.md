---
extends: _layouts.documentation
title: "Visibility"
description: "Utilities for controlling the visible of an element."
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
      <col class="w-1/4">
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
        <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark">.visible</td>
        <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark">visibility: visible;</td>
        <td class="p-2 border-t border-smoke text-sm text-grey-darker">Make an element visible.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.invisible</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">visibility: hidden;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Hide an element without affecting the layout of the document.</td>
      </tr>
    </tbody>
  </table>
</div>

### Visible <span class="ml-2 font-semibold text-slate-light text-sm uppercase tracking-wide">Default</span>

Use `.visible` to make an element visible. This will typically be used as a reset when using the `.invisible` utility.

@component('_partials.code-sample', ['class' => 'flex justify-center'])
<div class="visible bg-smoke w-24 h-24 rounded-full"></div>
@endcomponent

### Invisible

Use `.invisible` to hide an element, but still maintain its space.

@component('_partials.code-sample', ['class' => 'flex justify-center'])
<div class="invisible bg-smoke w-24 h-24 rounded-full"></div>
@endcomponent

## Responsive

To apply an overflow utility only at a specific breakpoint, add a `{screen}:` prefix to the existing class name. For example, adding the class `md:overflow-scroll` to an element would apply the `overflow-scroll` utility at medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

@component('_partials.responsive-code-sample')
@slot('none')
<div class="flex justify-center">
  <div class="visible bg-smoke w-24 h-24 rounded-full"></div>
</div>
@endslot
@slot('sm')
<div class="flex justify-center">
  <div class="invisible bg-smoke w-24 h-24 rounded-full"></div>
</div>
@endslot
@slot('md')
<div class="flex justify-center">
  <div class="visible bg-smoke w-24 h-24 rounded-full"></div>
</div>
@endslot
@slot('lg')
<div class="flex justify-center">
  <div class="invisible bg-smoke w-24 h-24 rounded-full"></div>
</div>
@endslot
@slot('xl')
<div class="flex justify-center">
  <div class="visible bg-smoke w-24 h-24 rounded-full"></div>
</div>
@endslot
@slot('code')
<div class="none:visible sm:invisible md:visible lg:invisible xl:visible ..."></div>
@endslot
@endcomponent
