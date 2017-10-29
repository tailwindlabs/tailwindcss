---
extends: _layouts.markdown
title: "Opacity"
---

# Opacity

<div class="text-xl text-slate-light mb-4">
    Utilities for controlling the opacity of an element.
</div>

<div class="flex mb-6">
    <span class="inline-flex items-center rounded-pill border border-grey-light bg-grey-lightest text-xs font-semibold pl-1 pt-1 pb-1 pr-2 leading-none mr-2">
        <span class="inline-flex rounded-pill bg-green-light text-white mr-1">
            <svg class="h-4 w-4" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M5.8 9.4c-.33-.442-.958-.53-1.4-.2-.442.33-.53.958-.2 1.4l3 4c.38.508 1.134.537 1.553.06l7-8c.363-.417.32-1.05-.094-1.413-.417-.363-1.05-.32-1.413.094L8.06 12.414 5.8 9.4z"/></svg>
        </span>
        <span>Responsive</span>
    </span>

    <span class="inline-flex items-center rounded-pill border border-grey-light bg-grey-lightest text-xs font-semibold pl-1 pt-1 pb-1 pr-2 leading-none mr-2">
        <span class="inline-flex rounded-pill bg-green-light text-white mr-1">
            <svg class="h-4 w-4" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M5.8 9.4c-.33-.442-.958-.53-1.4-.2-.442.33-.53.958-.2 1.4l3 4c.38.508 1.134.537 1.553.06l7-8c.363-.417.32-1.05-.094-1.413-.417-.363-1.05-.32-1.413.094L8.06 12.414 5.8 9.4z"/></svg>
        </span>
        <span>Customizable</span>
    </span>

    <span class="inline-flex items-center rounded-pill border border-grey-light bg-grey-lightest text-xs font-semibold pl-1 pt-1 pb-1 pr-2 leading-none opacity-50 mr-2">
        <span class="inline-flex rounded-pill bg-grey text-white mr-1">
            <svg class="h-4 w-4" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 8.586L6.707 5.293c-.39-.39-1.024-.39-1.414 0-.39.39-.39 1.024 0 1.414L8.586 10l-3.293 3.293c-.39.39-.39 1.024 0 1.414.39.39 1.024.39 1.414 0L10 11.414l3.293 3.293c.39.39 1.024.39 1.414 0 .39-.39.39-1.024 0-1.414L11.414 10l3.293-3.293c.39-.39.39-1.024 0-1.414-.39-.39-1.024-.39-1.414 0L10 8.586z"/></svg>
        </span>
        <span>Hover</span>
    </span>

    <span class="inline-flex items-center rounded-pill border border-grey-light bg-grey-lightest text-xs font-semibold pl-1 pt-1 pb-1 pr-2 leading-none opacity-50">
        <span class="inline-flex rounded-pill bg-grey text-white mr-1">
            <svg class="h-4 w-4" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 8.586L6.707 5.293c-.39-.39-1.024-.39-1.414 0-.39.39-.39 1.024 0 1.414L8.586 10l-3.293 3.293c-.39.39-.39 1.024 0 1.414.39.39 1.024.39 1.414 0L10 11.414l3.293 3.293c.39.39 1.024.39 1.414 0 .39-.39.39-1.024 0-1.414L11.414 10l3.293-3.293c.39-.39.39-1.024 0-1.414-.39-.39-1.024-.39-1.414 0L10 8.586z"/></svg>
        </span>
        <span>Focus</span>
    </span>
</div>

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




<!-- <div class="bg-smoke-lighter px-4 py-2 border-2 border-smoke rounded">
    <table class="font-mono text-sm text-grey-darkest">
        <tr>
            <td class="text-purple-dark pr-4">.opacity-100</td>
            <td class="pr-2">{</td>
            <td class="text-blue-dark pr-2">opacity:</td>
            <td class="text-blue-dark text-right">1;</td>
            <td class="pl-2">}</td>
        </tr>
        <tr>
            <td class="text-purple-dark pr-4">.opacity-75</td>
            <td>{</td>
            <td class="text-blue-dark pr-2">opacity:</td>
            <td class="text-blue-dark text-right">.75;</td>
            <td class="pl-2">}</td>
        </tr>
        <tr>
            <td class="text-purple-dark pr-4">.opacity-50</td>
            <td>{</td>
            <td class="text-blue-dark pr-2">opacity:</td>
            <td class="text-blue-dark text-right">.5;</td>
            <td class="pl-2">}</td>
        </tr>
        <tr>
            <td class="text-purple-dark pr-4">.opacity-25</td>
            <td>{</td>
            <td class="text-blue-dark pr-2">opacity:</td>
            <td class="text-blue-dark text-right">.25;</td>
            <td class="pl-2">}</td>
        </tr>
        <tr>
            <td class="text-purple-dark pr-4">.opacity-0</td>
            <td>{</td>
            <td class="text-blue-dark pr-2">opacity:</td>
            <td class="text-blue-dark text-right">0;</td>
            <td class="pl-2">}</td>
        </tr>
    </table>
</div>
 -->
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
    <div class="px-4 py-2 bg-smoke opacity-100 w-24 h-24 rounded-pill inline-block"></div>
</div>
@endslot
@slot('sm')
<div class="text-center">
    <div class="px-4 py-2 bg-smoke opacity-75 w-24 h-24 rounded-pill inline-block"></div>
</div>
@endslot
@slot('md')
<div class="text-center">
    <div class="px-4 py-2 bg-smoke opacity-50 w-24 h-24 rounded-pill inline-block"></div>
</div>
@endslot
@slot('lg')
<div class="text-center">
    <div class="px-4 py-2 bg-smoke opacity-25 w-24 h-24 rounded-pill inline-block"></div>
</div>
@endslot
@slot('xl')
<div class="text-center">
    <div class="px-4 py-2 bg-smoke opacity-0 w-24 h-24 rounded-pill inline-block"></div>
</div>
@endslot
@slot('code')
<div class="none:opacity-100 sm:opacity-75 md:opacity-50 lg:opacity-25 xl:opacity-0 ...">
    <!-- ... -->
</div>
@endslot
@endcomponent

## Customizing

By default Tailwind provides a sensible numeric opacity scale. You can, of course, modify these values as needed. This is done in the `opacity` section of your Tailwind config.

@component('_partials.customized-config')
@slot('default')
{
  // ...
  opacity: {
    '0': '0',
    '25': '.25',
    '50': '.5',
    '75': '.75',
    '100': '1',
  }
}
@endslot
@slot('customized')
{
  // ...
  opacity: {
    'none': '0',
    '10': '.1',
    '20': '.2',
    '30': '.3',
    '40': '.4',
    '50': '.5',
    '60': '.6',
    '70': '.7',
    '80': '.8',
    '90': '.9',
    '100': '1',
  },
}
@endslot
@endcomponent
