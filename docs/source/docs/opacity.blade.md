---
extends: _layouts.markdown
title: "Opacity"
---

# Opacity

<div class="text-xl text-slate-light mb-4">
    Utilities for controlling the opacity of an element.
</div>

@include('_partials.feature-badges', [
    'responsive' => true,
    'customizable' => true,
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
                <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark">.opacity-100</td>
                <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark">opacity: 1;</td>
                <td class="p-2 border-t border-smoke text-sm text-grey-darker">Set the opacity of an element to 100%.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.opacity-75</td>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">opacity: .75;</td>
                <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Set the opacity of an element to 75%.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.opacity-50</td>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">opacity: .5;</td>
                <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Set the opacity of an element to 50%.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.opacity-25</td>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">opacity: .25;</td>
                <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Set the opacity of an element to 25%.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.opacity-0</td>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">opacity: 0;</td>
                <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Set the opacity of an element to 0%.</td>
            </tr>
        </tbody>
    </table>
</div>

## Example

@component('_partials.code-sample')
<div class="flex -mx-2">
@foreach ($page->config['opacity']->reverse() as $name => $value)
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 mx-2 opacity-{{ $name }}">.opacity-{{ $name }}</div>
@endforeach
</div>
@slot('code')
@foreach ($page->config['opacity']->reverse() as $name => $value)
<div class="opacity-{{ $name }}">.opacity-{{ $name }}</div>
@endforeach
@endslot
@endcomponent

## Responsive

To control the opacity of an element at a specific breakpoint, add a `{breakpoint}:` prefix to any existing opacity utility. For example, use `md:opacity-50` to apply the `opacity-50` utility at only medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/workflow/responsive-design) documentation.

@component('_partials.responsive-code-sample')
@slot('none')
<div class="text-center">
    <div class="px-4 py-2 bg-smoke opacity-100 w-24 h-24 rounded-full
- 'md': '0 3px 6px rgba(0,0,0,.12), 0 3px 6px rgba(0,0,0,.13)',
- 'lg': '0 10px 20px rgba(0,0,0,.13), 0 6px 6px rgba(0,0,0,.13)',
 inline-block"></div>
</div>
@endslot
@slot('sm')
<div class="text-center">
    <div class="px-4 py-2 bg-smoke opacity-75 w-24 h-24 rounded-full
- 'md': '0 3px 6px rgba(0,0,0,.12), 0 3px 6px rgba(0,0,0,.13)',
- 'lg': '0 10px 20px rgba(0,0,0,.13), 0 6px 6px rgba(0,0,0,.13)',
 inline-block"></div>
</div>
@endslot
@slot('md')
<div class="text-center">
    <div class="px-4 py-2 bg-smoke opacity-50 w-24 h-24 rounded-full
- 'md': '0 3px 6px rgba(0,0,0,.12), 0 3px 6px rgba(0,0,0,.13)',
- 'lg': '0 10px 20px rgba(0,0,0,.13), 0 6px 6px rgba(0,0,0,.13)',
 inline-block"></div>
</div>
@endslot
@slot('lg')
<div class="text-center">
    <div class="px-4 py-2 bg-smoke opacity-25 w-24 h-24 rounded-full
- 'md': '0 3px 6px rgba(0,0,0,.12), 0 3px 6px rgba(0,0,0,.13)',
- 'lg': '0 10px 20px rgba(0,0,0,.13), 0 6px 6px rgba(0,0,0,.13)',
 inline-block"></div>
</div>
@endslot
@slot('xl')
<div class="text-center">
    <div class="px-4 py-2 bg-smoke opacity-0 w-24 h-24 rounded-full
- 'md': '0 3px 6px rgba(0,0,0,.12), 0 3px 6px rgba(0,0,0,.13)',
- 'lg': '0 10px 20px rgba(0,0,0,.13), 0 6px 6px rgba(0,0,0,.13)',
 inline-block"></div>
</div>
@endslot
@slot('code')
<div class="none:opacity-100 sm:opacity-75 md:opacity-50 lg:opacity-25 xl:opacity-0 ...">
    <!-- ... -->
</div>
@endslot
@endcomponent

## Customizing

By default Tailwind provides five opacity utilities based on a simple numeric scale. You change, add, or remove these by editing the `opacity` section of your Tailwind config.

@component('_partials.customized-config', ['key' => 'opacity'])
  '0': '0',
- '25': '.25',
- '50': '.5',
- '75': '.75',
+ '10': '.1',
+ '20': '.2',
+ '30': '.3',
+ '40': '.4',
+ '50': '.5',
+ '60': '.6',
+ '70': '.7',
+ '80': '.8',
+ '90': '.9',
  '100': '1',
@endcomponent
