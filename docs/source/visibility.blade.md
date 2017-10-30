---
extends: _layouts.markdown
title: "Visibility"
---

# Visibility


<div class="text-xl text-slate-light mb-4">
    Utilities for controlling the visible of an element.
</div>

@include('_partials.feature-badges', [
    'responsive' => true,
    'customizable' => false,
    'hover' => false,
    'focus' => false
])

<div class="border-t border-grey-lighter">
    <table class="w-full text-left" style="border-collapse: collapse;">
      <colgroup>
        <col class="w-1/4">
        <col class="w-1/4">
        <col class="w-1/2">
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
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.visible</td>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">visibility: visible;</td>
                <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Make an element visible.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.invisible</td>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">visibility: invisible;</td>
                <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Hide an element without affecting the layout of the document.</td>
            </tr>
        </tbody>
    </table>
</div>


### Visible <span class="ml-2 font-semibold text-slate-light text-sm uppercase tracking-wide">Default</span>

Use `.visible` to make an element visible. This will typically be used as a reset when using the `.invisible` utility.

@component('_partials.code-sample', ['class' => 'flex justify-center'])
<div class="visible bg-smoke w-24 h-24 rounded-pill"></div>
@endcomponent

### Invisible

Use `.invisible` to hide an element, but still maintain it's space.

@component('_partials.code-sample', ['class' => 'flex justify-center'])
<div class="invisible bg-smoke w-24 h-24 rounded-pill"></div>
@endcomponent


## Responsive

To apply an overflow utility only at a specific breakpoint, add a `{breakpoint}:` prefix to the existing class name. For example, adding the class `md:overflow-scroll` to an element would apply the `overflow-scroll` utility at medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/workflow/responsive-design) documentation.

@component('_partials.responsive-code-sample')
@slot('none')
<div class="flex justify-center">
    <div class="visible bg-smoke w-24 h-24 rounded-pill"></div>
</div>
@endslot
@slot('sm')
<div class="flex justify-center">
    <div class="invisible bg-smoke w-24 h-24 rounded-pill"></div>
</div>
@endslot
@slot('md')
<div class="flex justify-center">
    <div class="visible bg-smoke w-24 h-24 rounded-pill"></div>
</div>
@endslot
@slot('lg')
<div class="flex justify-center">
    <div class="invisible bg-smoke w-24 h-24 rounded-pill"></div>
</div>
@endslot
@slot('xl')
<div class="flex justify-center">
    <div class="visible bg-smoke w-24 h-24 rounded-pill"></div>
</div>
@endslot
@slot('code')
<div class="none:visible sm:invisible md:visible lg:invisible xl:visible ..."></div>
@endslot
@endcomponent
