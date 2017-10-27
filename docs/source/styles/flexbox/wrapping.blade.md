---
extends: _layouts.markdown
title: "Wrapping - Flexbox"
category: "Flexbox"
---

# Flex Wrapping

<div class="text-xl text-slate-light">
    Utilities for controlling how flex items wrap.
</div>

<div class="subnav">
    <a class="subnav-link" href="#responsive">Responsive</a>
</div>

### Don't wrap <span class="ml-2 font-semibold text-slate-light text-sm uppercase tracking-wide">Default</span>

Use `.flex-no-wrap` to prevent flex items from wrapping, causing inflexible items to overflow the container if necessary:

@component('_partials.code-sample')
<div class="flex flex-no-wrap bg-smoke-light">
    <div class="w-2/5 flex-none p-2">
        <div class="text-slate text-center bg-smoke p-2">1</div>
    </div>
    <div class="w-2/5 flex-none p-2">
        <div class="text-slate text-center bg-smoke p-2">2</div>
    </div>
    <div class="w-2/5 flex-none p-2">
        <div class="text-slate text-center bg-smoke p-2">3</div>
    </div>
</div>
@endcomponent

### Wrap normally

Use `.flex-wrap` to allow flex items to wrap:

@component('_partials.code-sample')
<div class="flex flex-wrap bg-smoke-light">
    <div class="w-2/5 p-2">
        <div class="text-slate text-center bg-smoke p-2">1</div>
    </div>
    <div class="w-2/5 p-2">
        <div class="text-slate text-center bg-smoke p-2">2</div>
    </div>
    <div class="w-2/5 p-2">
        <div class="text-slate text-center bg-smoke p-2">3</div>
    </div>
</div>
@endcomponent

### Wrap reversed

Use `.flex-wrap-reverse` to wrap flex items in the reverse direction:

@component('_partials.code-sample')
<div class="flex flex-wrap-reverse bg-smoke-light">
    <div class="w-2/5 p-2">
        <div class="text-slate text-center bg-smoke p-2">1</div>
    </div>
    <div class="w-2/5 p-2">
        <div class="text-slate text-center bg-smoke p-2">2</div>
    </div>
    <div class="w-2/5 p-2">
        <div class="text-slate text-center bg-smoke p-2">3</div>
    </div>
</div>
@endcomponent

## Responsive

To control how flex items wrap at a specific breakpoint, add a `{breakpoint}:` prefix to any existing utility class. For example, use `md:flex-wrap-reverse` to apply the `flex-wrap-reverse` utility at only medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](#) documentation.

@component('_partials.responsive-code-sample')
@slot('none')
<div class="flex flex-no-wrap bg-smoke-light">
    <div class="w-2/5 flex-none p-2">
        <div class="text-slate text-center bg-smoke p-2">1</div>
    </div>
    <div class="w-2/5 flex-none p-2">
        <div class="text-slate text-center bg-smoke p-2">2</div>
    </div>
    <div class="w-2/5 flex-none p-2">
        <div class="text-slate text-center bg-smoke p-2">3</div>
    </div>
</div>
@endslot
@slot('sm')
<div class="flex flex-wrap bg-smoke-light">
    <div class="w-2/5 flex-none p-2">
        <div class="text-slate text-center bg-smoke p-2">1</div>
    </div>
    <div class="w-2/5 flex-none p-2">
        <div class="text-slate text-center bg-smoke p-2">2</div>
    </div>
    <div class="w-2/5 flex-none p-2">
        <div class="text-slate text-center bg-smoke p-2">3</div>
    </div>
</div>
@endslot
@slot('md')
<div class="flex flex-wrap-reverse bg-smoke-light">
    <div class="w-2/5 flex-none p-2">
        <div class="text-slate text-center bg-smoke p-2">1</div>
    </div>
    <div class="w-2/5 flex-none p-2">
        <div class="text-slate text-center bg-smoke p-2">2</div>
    </div>
    <div class="w-2/5 flex-none p-2">
        <div class="text-slate text-center bg-smoke p-2">3</div>
    </div>
</div>
@endslot
@slot('lg')
<div class="flex flex-no-wrap bg-smoke-light">
    <div class="w-2/5 flex-none p-2">
        <div class="text-slate text-center bg-smoke p-2">1</div>
    </div>
    <div class="w-2/5 flex-none p-2">
        <div class="text-slate text-center bg-smoke p-2">2</div>
    </div>
    <div class="w-2/5 flex-none p-2">
        <div class="text-slate text-center bg-smoke p-2">3</div>
    </div>
</div>
@endslot
@slot('xl')
<div class="flex flex-wrap bg-smoke-light">
    <div class="w-2/5 flex-none p-2">
        <div class="text-slate text-center bg-smoke p-2">1</div>
    </div>
    <div class="w-2/5 flex-none p-2">
        <div class="text-slate text-center bg-smoke p-2">2</div>
    </div>
    <div class="w-2/5 flex-none p-2">
        <div class="text-slate text-center bg-smoke p-2">3</div>
    </div>
</div>
@endslot
@slot('code')
<div class="none:flex-no-wrap sm:flex-wrap md:flex-wrap-reverse lg:flex-no-wrap xl:flex-wrap ...">
    <!-- ... -->
</div>
@endslot
@endcomponent
