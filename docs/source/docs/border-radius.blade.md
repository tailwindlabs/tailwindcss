---
extends: _layouts.markdown
title: "Border Radius"
---

# Border Radius

<div class="text-xl text-slate-light mb-4">
    Utilities for controlling the border radius of an element.
</div>

@include('_partials.feature-badges', [
    'responsive' => true,
    'customizable' => true,
    'hover' => false,
    'focus' => false
])

<div class="border-t border-grey-lighter">
    <table class="w-full text-left" style="border-collapse: collapse; table-layout: fixed;">
        <colgroup>
            <col class="w-1/6">
            <col class="w-1/3">
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
                <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark">.rounded</td>
                <td class="w-2/5 p-2 border-t border-smoke font-mono text-xs text-blue-dark">border-radius: .25rem;</td>
                <td class="p-2 border-t border-smoke text-sm text-grey-darker">Apply a medium border radius to all corners of an element.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.rounded-sm</td>
                <td class="w-2/5 p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">border-radius: .125rem;</td>
                <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Apply a small border radius to all corners of an element.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.rounded-lg</td>
                <td class="w-2/5 p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">border-radius: .5rem;</td>
                <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Apply a large border radius to all corners of an element.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.rounded-pill</td>
                <td class="w-2/5 p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">border-radius: 9999px;</td>
                <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Fully round all corners of an element.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.rounded-none</td>
                <td class="w-2/5 p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">border-radius: 0;</td>
                <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Remove any border radius from all sides of an element.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.rounded-t</td>
                <td class="w-2/5 p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">
                    border-bottom-left-radius: 0;<br>
                    border-bottom-right-radius: 0;
                </td>
                <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Only round the top corners of an element.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.rounded-r</td>
                <td class="w-2/5 p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">
                    border-top-left-radius: 0;<br>
                    border-bottom-left-radius: 0;
                </td>
                <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Only round the right side corners of an element.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.rounded-b</td>
                <td class="w-2/5 p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">
                    border-top-right-radius: 0;<br>
                    border-top-left-radius: 0;
                </td>
                <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Only round the bottom corners of an element.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.rounded-l</td>
                <td class="w-2/5 p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">
                    border-top-right-radius: 0;<br>
                    border-bottom-right-radius: 0;
                </td>
                <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Only round the left side corners of an element.</td>
            </tr>
        </tbody>
    </table>
</div>

## Rounded corners

Use the `.rounded`, `.shadow-sm`, or `.rounded-lg` utilities to apply different border radius sizes to an element.

@component('_partials.code-sample', ['class' => 'flex justify-around text-sm'])
<div class="bg-grey-light mr-3 p-4 rounded-sm">.rounded-sm</div>
<div class="bg-grey-light mr-3 p-4 rounded">.rounded</div>
<div class="bg-grey-light p-4 rounded-lg">.rounded-lg</div>
@slot('code')
<div class="rounded-sm"></div>
<div class="rounded"></div>
<div class="rounded-lg"></div>
@endslot
@endcomponent

## Pills and circles

Use the `.rounded-full` utility to create pills and circles.

@component('_partials.code-sample', ['class' => 'flex items-center justify-around text-sm'])
<div class="bg-grey-light mr-3 py-2 px-4 rounded-full">Pill shape</div>
<div class="bg-grey-light h-16 w-16 rounded-full flex items-center justify-center">Circle</div>
@slot('code')
<div class="rounded-full py-2 px-4">Pill shape</div>
<div class="rounded-full h-16 w-16 flex items-center justify-center">Circle</div>
@endslot
@endcomponent

## No rounding

Use `.rounded-none` to remove an existing border radius from an element.

This is most commonly used to remove a border radius that was applied at a smaller breakpoint.

@component('_partials.code-sample', ['class' => 'flex justify-around text-sm py-8'])
<div class="p-4 rounded-none bg-grey-light">.rounded-none</div>
@slot('code')
<div class="rounded-none"></div>
@endslot
@endcomponent

## Rounding sides separately

Use the `.rounded-t`, `.rounded-r`, `.rounded-b`, or `.rounded-l` utilities to only round one side of an element.

@component('_partials.code-sample', ['class' => 'flex justify-around text-sm'])
<div class="bg-grey-light mr-3 p-4 rounded-lg rounded-t">.rounded-t</div>
<div class="bg-grey-light mr-3 p-4 rounded-lg rounded-r">.rounded-r</div>
<div class="bg-grey-light mr-3 p-4 rounded-lg rounded-b">.rounded-b</div>
<div class="bg-grey-light p-4 rounded-lg rounded-l">.rounded-l</div>
@slot('code')
<div class="rounded-t"></div>
<div class="rounded-r"></div>
<div class="rounded-b"></div>
<div class="rounded-t"></div>
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
