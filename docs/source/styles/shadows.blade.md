---
extends: _layouts.markdown
title: "Shadows"
---

# Shadows

<div class="text-xl text-slate-light">
    Utilities for controlling the box shadow of an element.
</div>

<div class="subnav">
    <a class="subnav-link" href="#responsive">Responsive</a>
    <a class="subnav-link" href="#customizing">Customizing</a>
</div>

Box shadows can be applied using the `.shadow-{size}` utilities. By default these are a size scale, where the smaller sizes represent more shallow shadows, and larger sizes represent deeper shadows. If you use the `.shadow` utility without a suffix, you'll get the default shadow.

@component('_partials.code-sample', ['class' => 'flex justify-around text-sm py-8'])
<div class="mr-3 p-4 bg-smoke-lighter shadow-inner">.shadow-inner</div>
<div class="mr-3 p-4 shadow">.shadow</div>
<div class="mr-3 p-4 shadow-md">.shadow-md</div>
<div class="mr-3 p-4 shadow-lg">.shadow-lg</div>
@slot('code')
<div class="shadow-inner"></div>
<div class="shadow"></div>
<div class="shadow-md"></div>
<div class="shadow-lg"></div>
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

By default Tailwind provides three drop shadows and one inner shadow. You can, of course, modify these values as needed. This is done in the `shadows` section of your Tailwind config. As you can see from the defaults we provide, it's possible to apply multiple shadows per utility using comma separation.

Take note that a `default` shadow is required. This is the value used for the non-suffixed version of this utility (`.shadow`).

@component('_partials.customized-config')
@slot('default')
{
  // ...
  shadows: {
    default: '0 1px 3px rgba(0,0,0,.08), 0 1px 2px rgba(0,0,0,.15)',
    'md': '0 3px 6px rgba(0,0,0,.12), 0 3px 6px rgba(0,0,0,.13)',
    'lg': '0 10px 20px rgba(0,0,0,.13), 0 6px 6px rgba(0,0,0,.13)',
    'inner': 'inset 0 1px 2px rgba(0, 0, 0, 0.05)',
    'none': 'none',
  },
}
@endslot
@slot('customized')
{
  // ...
  shadows: {
    default: '0 1px 3px rgba(0,0,0,.08), 0 1px 2px rgba(0,0,0,.15)',
    'big': '0 3px 6px rgba(0,0,0,.12), 0 3px 6px rgba(0,0,0,.13)',
    'huge': '0 10px 20px rgba(0,0,0,.13), 0 6px 6px rgba(0,0,0,.13)',
    'none': 'none',
  },
}
@endslot
@endcomponent
