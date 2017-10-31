---
extends: _layouts.documentation
title: "Wrapping - Flexbox"
category: "Flexbox"
---

# Flex Wrapping

<div class="text-xl text-slate-light mb-4">
    Utilities for controlling how flex items wrap.
</div>

@include('_partials.feature-badges', [
    'responsive' => true,
    'customizable' => false,
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
                <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark">.flex-no-wrap</td>
                <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark">flex-wrap: nowrap;</td>
                <td class="p-2 border-t border-smoke text-sm text-grey-darker">Don't allow flex items to wrap.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.flex-wrap</td>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">flex-wrap: wrap;</td>
                <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Allow flex items to wrap in the normal direction.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.flex-wrap-reverse</td>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">flex-wrap: wrap-reverse;</td>
                <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Allow flex items to wrap in the reverse direction.</td>
            </tr>
        </tbody>
    </table>
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

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

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
