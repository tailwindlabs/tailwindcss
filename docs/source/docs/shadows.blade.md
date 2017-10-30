---
extends: _layouts.markdown
title: "Shadows"
---

# Shadows

<div class="text-xl text-slate-light mb-4">
    Utilities for controlling the box shadow of an element.
</div>

@include('_partials.feature-badges', [
    'responsive' => true,
    'customizable' => true,
    'hover' => false,
    'focus' => false
])

<div class="border-t border-grey-lighter">
    <table class="w-full text-left" style="border-collapse: collapse;">
      <colgroup>
        <col class="w-1/5">
        <col class="w-2/5">
        <col class="w-2/5">
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
                <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark">.shadow</td>
                <td class="w-2/5 p-2 border-t border-smoke font-mono text-xs text-blue-dark">box-shadow: 0 1px 3px rgba(0,0,0,.08), 0 1px 2px rgba(0,0,0,.15);</td>
                <td class="p-2 border-t border-smoke text-sm text-grey-darker">Apply a small box shadow to an element.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.shadow-md</td>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">box-shadow: 0 3px 6px rgba(0,0,0,.12), 0 3px 6px rgba(0,0,0,.13);</td>
                <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Apply a medium box shadow to an element.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.shadow-lg</td>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">box-shadow: 0 10px 20px rgba(0,0,0,.13), 0 6px 6px rgba(0,0,0,.13);</td>
                <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Apply a large box shadow to an element.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.shadow-inner</td>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05)</td>
                <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Apply a small inner box shadow to an element.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.shadow-none</td>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">box-shadow: none;</td>
                <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Remove a box shadow from an element.</td>
            </tr>
        </tbody>
    </table>
</div>

## Outer shadow

Use the `.shadow`, `.shadow-md`, or `.shadow-lg` utilities to apply different sized outer box shadows to an element.

@component('_partials.code-sample', ['class' => 'flex justify-around text-sm py-8'])
<div class="mr-3 p-4 shadow">.shadow</div>
<div class="mr-3 p-4 shadow-md">.shadow-md</div>
<div class="p-4 shadow-lg">.shadow-lg</div>
@slot('code')
<div class="shadow"></div>
<div class="shadow-md"></div>
<div class="shadow-lg"></div>
@endslot
@endcomponent

## Inner shadow

Use the `.shadow-inner` utility to apply a subtle inset box shadow to an element.

This can be useful for things like form controls or wells.

@component('_partials.code-sample', ['class' => 'flex justify-around text-sm py-8'])
<div class="p-4 bg-smoke-lighter shadow-inner">.shadow-inner</div>
@slot('code')
<div class="shadow-inner"></div>
@endslot
@endcomponent

## No shadow

Use `.shadow-none` to remove an existing box shadow from an element.

This is most commonly used to remove a shadow that was applied at a smaller breakpoint.

@component('_partials.code-sample', ['class' => 'flex justify-around text-sm py-8'])
<div class="p-4 shadow-none bg-grey-light">.shadow-none</div>
@slot('code')
<div class="shadow-none"></div>
@endslot
@endcomponent

## Responsive

To control the shadow of an element at a specific breakpoint, add a `{breakpoint}:` prefix to any existing shadow utility. For example, use `md:shadow-lg` to apply the `shadow-lg` utility at only medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/workflow/responsive-design) documentation.

@component('_partials.responsive-code-sample')
@slot('none')
<div class="flex justify-center">
    <div class="shadow px-4 py-2 bg-smoke-lighter opacity-100 w-24 h-24 rounded-pill"></div>
</div>
@endslot
@slot('sm')
<div class="flex justify-center">
    <div class="shadow-md px-4 py-2 bg-smoke-lighter opacity-100 w-24 h-24 rounded-pill"></div>
</div>
@endslot
@slot('md')
<div class="flex justify-center">
    <div class="shadow-lg px-4 py-2 bg-smoke-lighter opacity-100 w-24 h-24 rounded-pill"></div>
</div>
@endslot
@slot('lg')
<div class="flex justify-center">
    <div class="shadow-inner px-4 py-2 bg-smoke-lighter opacity-100 w-24 h-24 rounded-pill"></div>
</div>
@endslot
@slot('xl')
<div class="flex justify-center">
    <div class="shadow-none px-4 py-2 bg-smoke-lighter opacity-100 w-24 h-24 rounded-pill"></div>
</div>
@endslot
@slot('code')
<div class="none:shadow sm:shadow-md md:shadow-lg lg:shadow-inner xl:shadow-none ...">
    <!-- ... -->
</div>
@endslot
@endcomponent

## Customizing

By default Tailwind provides three drop shadow utilities, one inner shadow utility, and a utility for removing existing shadows. You change, add, or remove these by editing the `shadows` section of your Tailwind config.

If a `default` shadow is provided, it will be used for the non-suffixed `.shadow` utility. Any other keys will be used as suffixes, for example the key `'2'` will create a corresponding `.shadow-2` utility.

@component('_partials.customized-config', ['key' => 'shadows'])
- default: '0 1px 3px rgba(0,0,0,.08), 0 1px 2px rgba(0,0,0,.15)',
- 'md': '0 3px 6px rgba(0,0,0,.12), 0 3px 6px rgba(0,0,0,.13)',
- 'lg': '0 10px 20px rgba(0,0,0,.13), 0 6px 6px rgba(0,0,0,.13)',
- 'inner': 'inset 0 1px 2px rgba(0, 0, 0, 0.05)',
+ '1': '0 2px 4px rgba(0,0,0,0.05)',
+ '2': '0 4px 8px rgba(0,0,0,0.1)',
+ '3': '0 8px 16px rgba(0,0,0,0.15)',
  'none': 'none',
@endcomponent
