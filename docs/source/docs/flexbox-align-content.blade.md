---
extends: _layouts.documentation
title: "Align Content - Flexbox"
---

# Align Content

<div class="text-xl text-slate-light mb-4">
    Utilities for controlling how lines are positioned in multi-line flex containers.
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
          <col class="w-1/5">
          <col class="w-1/3">
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
                <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark">.content-start</td>
                <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark">align-content: flex-start;</td>
                <td class="p-2 border-t border-smoke text-sm text-grey-darker">Pack lines against the start of the cross axis.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.content-center</td>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">align-content: center;</td>
                <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Pack lines in the center of the cross axis.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.content-end</td>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">align-content: flex-end;</td>
                <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Pack lines against the end of the cross axis.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.content-between</td>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">align-content: space-between;</td>
                <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Distribute lines along the cross axis by adding an equal amount of space between each line.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.content-around</td>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">align-content: space-around;</td>
                <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Distribute lines along the cross axis by adding an equal amount of space around each line.</td>
            </tr>
        </tbody>
    </table>
</div>

### Start <span class="ml-2 font-semibold text-slate-light text-sm uppercase tracking-wide">Default</span>

Use `.content-start` to pack lines in a flex container against the start of the cross axis:

@component('_partials.code-sample')
<div class="flex content-start flex-wrap bg-smoke-light h-48">
    <div class="w-1/3 p-2">
        <div class="text-slate text-center bg-smoke p-2">1</div>
    </div>
    <div class="w-1/3 p-2">
        <div class="text-slate text-center bg-smoke p-2">2</div>
    </div>
    <div class="w-1/3 p-2">
        <div class="text-slate text-center bg-smoke p-2">3</div>
    </div>
    <div class="w-1/3 p-2">
        <div class="text-slate text-center bg-smoke p-2">4</div>
    </div>
    <div class="w-1/3 p-2">
        <div class="text-slate text-center bg-smoke p-2">5</div>
    </div>
</div>
@endcomponent

### Center

Use `.content-center` to pack lines in a flex container in the center of the cross axis:

@component('_partials.code-sample')
<div class="flex content-center flex-wrap bg-smoke-light h-48">
    <div class="w-1/3 p-2">
        <div class="text-slate text-center bg-smoke p-2">1</div>
    </div>
    <div class="w-1/3 p-2">
        <div class="text-slate text-center bg-smoke p-2">2</div>
    </div>
    <div class="w-1/3 p-2">
        <div class="text-slate text-center bg-smoke p-2">3</div>
    </div>
    <div class="w-1/3 p-2">
        <div class="text-slate text-center bg-smoke p-2">4</div>
    </div>
    <div class="w-1/3 p-2">
        <div class="text-slate text-center bg-smoke p-2">5</div>
    </div>
</div>
@endcomponent

### End

Use `.content-end` to pack lines in a flex container against the end of the cross axis:

@component('_partials.code-sample')
<div class="flex content-end flex-wrap bg-smoke-light h-48">
    <div class="w-1/3 p-2">
        <div class="text-slate text-center bg-smoke p-2">1</div>
    </div>
    <div class="w-1/3 p-2">
        <div class="text-slate text-center bg-smoke p-2">2</div>
    </div>
    <div class="w-1/3 p-2">
        <div class="text-slate text-center bg-smoke p-2">3</div>
    </div>
    <div class="w-1/3 p-2">
        <div class="text-slate text-center bg-smoke p-2">4</div>
    </div>
    <div class="w-1/3 p-2">
        <div class="text-slate text-center bg-smoke p-2">5</div>
    </div>
</div>
@endcomponent

### Space between

Use `.content-between` to distribute lines in a flex container such that there is an equal amount of space between each line:

@component('_partials.code-sample')
<div class="flex content-between flex-wrap bg-smoke-light h-48">
    <div class="w-1/3 p-2">
        <div class="text-slate text-center bg-smoke p-2">1</div>
    </div>
    <div class="w-1/3 p-2">
        <div class="text-slate text-center bg-smoke p-2">2</div>
    </div>
    <div class="w-1/3 p-2">
        <div class="text-slate text-center bg-smoke p-2">3</div>
    </div>
    <div class="w-1/3 p-2">
        <div class="text-slate text-center bg-smoke p-2">4</div>
    </div>
    <div class="w-1/3 p-2">
        <div class="text-slate text-center bg-smoke p-2">5</div>
    </div>
</div>
@endcomponent

### Space around

Use `.content-around` to distribute lines in a flex container such that there is an equal amount of space around each line:

@component('_partials.code-sample')
<div class="flex content-around flex-wrap bg-smoke-light h-48">
    <div class="w-1/3 p-2">
        <div class="text-slate text-center bg-smoke p-2">1</div>
    </div>
    <div class="w-1/3 p-2">
        <div class="text-slate text-center bg-smoke p-2">2</div>
    </div>
    <div class="w-1/3 p-2">
        <div class="text-slate text-center bg-smoke p-2">3</div>
    </div>
    <div class="w-1/3 p-2">
        <div class="text-slate text-center bg-smoke p-2">4</div>
    </div>
    <div class="w-1/3 p-2">
        <div class="text-slate text-center bg-smoke p-2">5</div>
    </div>
</div>
@endcomponent


## Responsive

To control the alignment of flex content at a specific breakpoint, add a `{breakpoint}:` prefix to any existing utility class. For example, use `md:content-around` to apply the `content-around` utility at only medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

@component('_partials.responsive-code-sample')
@slot('none')
<div class="flex content-start flex-wrap bg-smoke-light h-48">
    <div class="w-1/3 p-2">
        <div class="text-slate text-center bg-smoke p-2">1</div>
    </div>
    <div class="w-1/3 p-2">
        <div class="text-slate text-center bg-smoke p-2">2</div>
    </div>
    <div class="w-1/3 p-2">
        <div class="text-slate text-center bg-smoke p-2">3</div>
    </div>
    <div class="w-1/3 p-2">
        <div class="text-slate text-center bg-smoke p-2">4</div>
    </div>
    <div class="w-1/3 p-2">
        <div class="text-slate text-center bg-smoke p-2">5</div>
    </div>
</div>
@endslot
@slot('sm')
<div class="flex content-end flex-wrap bg-smoke-light h-48">
    <div class="w-1/3 p-2">
        <div class="text-slate text-center bg-smoke p-2">1</div>
    </div>
    <div class="w-1/3 p-2">
        <div class="text-slate text-center bg-smoke p-2">2</div>
    </div>
    <div class="w-1/3 p-2">
        <div class="text-slate text-center bg-smoke p-2">3</div>
    </div>
    <div class="w-1/3 p-2">
        <div class="text-slate text-center bg-smoke p-2">4</div>
    </div>
    <div class="w-1/3 p-2">
        <div class="text-slate text-center bg-smoke p-2">5</div>
    </div>
</div>
@endslot
@slot('md')
<div class="flex content-center flex-wrap bg-smoke-light h-48">
    <div class="w-1/3 p-2">
        <div class="text-slate text-center bg-smoke p-2">1</div>
    </div>
    <div class="w-1/3 p-2">
        <div class="text-slate text-center bg-smoke p-2">2</div>
    </div>
    <div class="w-1/3 p-2">
        <div class="text-slate text-center bg-smoke p-2">3</div>
    </div>
    <div class="w-1/3 p-2">
        <div class="text-slate text-center bg-smoke p-2">4</div>
    </div>
    <div class="w-1/3 p-2">
        <div class="text-slate text-center bg-smoke p-2">5</div>
    </div>
</div>
@endslot
@slot('lg')
<div class="flex content-between flex-wrap bg-smoke-light h-48">
    <div class="w-1/3 p-2">
        <div class="text-slate text-center bg-smoke p-2">1</div>
    </div>
    <div class="w-1/3 p-2">
        <div class="text-slate text-center bg-smoke p-2">2</div>
    </div>
    <div class="w-1/3 p-2">
        <div class="text-slate text-center bg-smoke p-2">3</div>
    </div>
    <div class="w-1/3 p-2">
        <div class="text-slate text-center bg-smoke p-2">4</div>
    </div>
    <div class="w-1/3 p-2">
        <div class="text-slate text-center bg-smoke p-2">5</div>
    </div>
</div>
@endslot
@slot('xl')
<div class="flex content-around flex-wrap bg-smoke-light h-48">
    <div class="w-1/3 p-2">
        <div class="text-slate text-center bg-smoke p-2">1</div>
    </div>
    <div class="w-1/3 p-2">
        <div class="text-slate text-center bg-smoke p-2">2</div>
    </div>
    <div class="w-1/3 p-2">
        <div class="text-slate text-center bg-smoke p-2">3</div>
    </div>
    <div class="w-1/3 p-2">
        <div class="text-slate text-center bg-smoke p-2">4</div>
    </div>
    <div class="w-1/3 p-2">
        <div class="text-slate text-center bg-smoke p-2">5</div>
    </div>
</div>
@endslot
@slot('code')
<div class="none:content-start sm:content-end md:content-center lg:content-between xl:content-around ...">
    <!-- ... -->
</div>
@endslot
@endcomponent
