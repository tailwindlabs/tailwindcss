---
extends: _layouts.markdown
title: "Opacity"
---

# Opacity

<div class="subnav">
    <a class="subnav-link" href="#responsive">Responsive</a>
    <a class="subnav-link" href="#customizing">Customizing</a>
</div>

Control the opacity of an element in Tailwind using the `.opacity` utilities.

@component('_partials.code-sample')
<div class="flex -mx-2">
@foreach ($page->config['opacity'] as $name => $value)
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 mx-2 opacity-{{ $name }}">.opacity-{{ $name }}</div>
@endforeach
</div>
@slot('code')
@foreach ($page->config['opacity'] as $name => $value)
<div class="opacity-{{ $name }}">.opacity-{{ $name }}</div>
@endforeach
@endslot
@endcomponent

## Responsive

To apply an opacity utility only at a specific breakpoint, add a `{breakpoint}:` prefix to the existing class name. For example, adding the class `md:opacity-50` to an element would apply the `opacity-50` utility at medium screen sizes and above.

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
