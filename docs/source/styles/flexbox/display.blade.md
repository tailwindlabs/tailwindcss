---
extends: _layouts.markdown
title: "Display – Flexbox"
category: "Flexbox"
---

# Display

<div class="text-xl text-slate-light">
    Utilities for creating flex containers.
</div>

<div class="subnav">
    <a class="subnav-link" href="#responsive">Responsive</a>
</div>

### Flex

Use `.flex` to create a block-level flex container:

@component('_partials.code-sample')
<div class="flex bg-smoke-light">
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">1</div>
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">2</div>
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">3</div>
</div>
@endcomponent

### Inline flex

Use `.inline-flex` to create an inline flex container:

@component('_partials.code-sample')
<div class="inline-flex bg-smoke-light">
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">1</div>
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">2</div>
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">3</div>
</div>
@endcomponent

## Responsive

To control the display property of an element at a specific breakpoint, add a `{breakpoint}:` prefix to any existing display utility class. For example, use `md:inline-flex` to apply the `inline-flex` utility at only medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](#) documentation.

@component('_partials.responsive-code-sample')
@slot('none')
<div class="flex bg-smoke-light">
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">1</div>
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">2</div>
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">3</div>
</div>
@endslot
@slot('sm')
<div class="inline-flex bg-smoke-light">
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">1</div>
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">2</div>
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">3</div>
</div>
@endslot
@slot('md')
<div class="block bg-smoke-light">
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">1</div>
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">2</div>
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">3</div>
</div>
@endslot
@slot('lg')
<div class="hidden bg-smoke-light">
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">1</div>
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">2</div>
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">3</div>
</div>
@endslot
@slot('xl')
<div class="flex bg-smoke-light">
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">1</div>
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">2</div>
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">3</div>
</div>
@endslot
@slot('code')
<div class="none:flex sm:inline-flex md:block lg:hidden xl:flex ...">
    <!-- ... -->
</div>
@endslot
@endcomponent
