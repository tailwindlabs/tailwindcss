---
extends: _layouts.markdown
title: "Flex, Grow, & Shrink - Flexbox"
category: "Flexbox"
---

# Flex, Grow, & Shrink


<div class="text-xl text-slate-light">
    Utilities for controlling how flex items grow and shrink.
</div>

<div class="subnav">
    <a class="subnav-link" href="#responsive">Responsive</a>
</div>

### Initial <span class="ml-2 font-semibold text-slate-light text-sm uppercase tracking-wide">Default</span>

Use `.flex-initial` to allow a flex item to shrink but not grow, taking into account it's initial size:

@component('_partials.code-sample')
<p class="text-sm text-slate-light mb-1">Items don't grow when there's extra space</p>
<div class="flex bg-smoke-light mb-6">
    <div class="flex-initial text-slate text-center bg-smoke px-4 py-2 m-2">
        Short
    </div>
    <div class="flex-initial text-slate text-center bg-smoke px-4 py-2 m-2">
        Medium length
    </div>
</div>

<p class="text-sm text-slate-light mb-1">Items shrink if possible when needed</p>
<div class="flex bg-smoke-light">
    <div class="flex-initial text-slate text-center bg-smoke px-4 py-2 m-2">
        Short
    </div>
    <div class="flex-initial text-slate text-center bg-smoke px-4 py-2 m-2">
        Medium length
    </div>
    <div class="flex-initial text-slate text-center bg-smoke px-4 py-2 m-2">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Qui ad labore ipsam, aut rem quo repellat esse tempore id, quidem
    </div>
</div>

@slot('code')
<div class="flex bg-smoke-light">
    <div class="flex-initial text-slate text-center bg-smoke px-4 py-2 m-2">
        Short
    </div>
    <div class="flex-initial text-slate text-center bg-smoke px-4 py-2 m-2">
        Medium length
    </div>
</div>

<div class="flex bg-smoke-light">
    <div class="flex-initial text-slate text-center bg-smoke px-4 py-2 m-2">
        Short
    </div>
    <div class="flex-initial text-slate text-center bg-smoke px-4 py-2 m-2">
        Medium length
    </div>
    <div class="flex-initial text-slate text-center bg-smoke px-4 py-2 m-2">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Qui ad labore ipsam, aut rem quo repellat esse tempore id, quidem
    </div>
</div>
@endslot
@endcomponent

### Flex 1

Use `.flex-1` to allow a flex item to grow and shrink as needed, ignoring it's initial size:

@component('_partials.code-sample')
<p class="text-sm text-slate-light mb-1">Default behavior</p>
<div class="flex bg-smoke-light mb-6">
    <div class="text-slate text-center bg-smoke px-4 py-2 m-2">
        Short
    </div>
    <div class="text-slate text-center bg-smoke px-4 py-2 m-2">
        Medium length
    </div>
    <div class="text-slate text-center bg-smoke px-4 py-2 m-2">
        Significantly larger amount of content
    </div>
</div>
<p class="text-sm text-slate-light mb-1">With <code>.flex-1</code></p>
<div class="flex bg-smoke-light">
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">
        Short
    </div>
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">
        Medium length
    </div>
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">
        Significantly larger amount of content
    </div>
</div>

@slot('code')
<div class="flex bg-smoke-light">
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">
        Short
    </div>
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">
        Medium length
    </div>
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">
        Significantly larger amount of content
    </div>
</div>
@endslot
@endcomponent

### Auto

Use `.flex-auto` to allow a flex item to grow and shrink, taking into account it's initial size:

@component('_partials.code-sample')
<p class="text-sm text-slate-light mb-1">Default behavior</p>
<div class="flex bg-smoke-light mb-6">
    <div class="text-slate text-center bg-smoke px-4 py-2 m-2">
        Short
    </div>
    <div class="text-slate text-center bg-smoke px-4 py-2 m-2">
        Medium length
    </div>
    <div class="text-slate text-center bg-smoke px-4 py-2 m-2">
        Significantly larger amount of content
    </div>
</div>
<p class="text-sm text-slate-light mb-1">With <code>.flex-auto</code></p>
<div class="flex bg-smoke-light">
    <div class="flex-auto text-slate text-center bg-smoke px-4 py-2 m-2">
        Short
    </div>
    <div class="flex-auto text-slate text-center bg-smoke px-4 py-2 m-2">
        Medium length
    </div>
    <div class="flex-auto text-slate text-center bg-smoke px-4 py-2 m-2">
        Significantly larger amount of content
    </div>
</div>

@slot('code')
<div class="flex bg-smoke-light">
    <div class="flex-auto text-slate text-center bg-smoke px-4 py-2 m-2">
        Short
    </div>
    <div class="flex-auto text-slate text-center bg-smoke px-4 py-2 m-2">
        Medium length
    </div>
    <div class="flex-auto text-slate text-center bg-smoke px-4 py-2 m-2">
        Significantly larger amount of content
    </div>
</div>
@endslot
@endcomponent

### None

Use `.flex-none` to prevent a flex item from growing or shrinking:

@component('_partials.code-sample')
<div class="flex bg-smoke-light">
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">
        Item that can grow or shrink if needed
    </div>
    <div class="flex-none text-slate-dark text-center bg-smoke-dark px-4 py-2 m-2">
        Item that cannot grow or shrink
    </div>
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">
        Item that can grow or shrink if needed
    </div>
</div>
@endcomponent

### Grow

Use `.flex-grow` to allow a flex item to grow to fill any available space:

@component('_partials.code-sample')
<div class="flex bg-smoke-light">
    <div class="flex-none text-slate text-center bg-smoke px-4 py-2 m-2">
        Content that cannot flex
    </div>
    <div class="flex-grow text-slate-dark text-center bg-smoke-dark px-4 py-2 m-2">
        Item that will grow
    </div>
    <div class="flex-none text-slate text-center bg-smoke px-4 py-2 m-2">
        Content that cannot flex
    </div>
</div>
@endcomponent

### Don't grow

Use `.flex-no-grow` to prevent a flex item from growing:

@component('_partials.code-sample')
<div class="flex bg-smoke-light">
    <div class="flex-grow text-slate text-center bg-smoke px-4 py-2 m-2">
        Will grow
    </div>
    <div class="flex-no-grow text-slate-dark text-center bg-smoke-dark px-4 py-2 m-2">
        Will not grow
    </div>
    <div class="flex-grow text-slate text-center bg-smoke px-4 py-2 m-2">
        Will grow
    </div>
</div>
@endcomponent

### Shrink

Use `.flex-shrink` to allow a flex item to shrink if needed:

@component('_partials.code-sample')
<div class="flex bg-smoke-light">
    <div class="flex-none text-slate text-center bg-smoke px-4 py-2 m-2">
        Longer content that cannot flex
    </div>
    <div class="flex-shrink text-slate-dark text-center bg-smoke-dark px-4 py-2 m-2">
        Item that will shrink even if it causes the content to wrap
    </div>
    <div class="flex-none text-slate text-center bg-smoke px-4 py-2 m-2">
        Longer content that cannot flex
    </div>
</div>
@endcomponent

### Don't shrink

Use `.flex-no-shrink` to prevent a flex item from shrinking:

@component('_partials.code-sample')
<div class="flex bg-smoke-light">
    <div class="flex-shrink text-slate text-center bg-smoke px-4 py-2 m-2">
        Item that can shrink if needed
    </div>
    <div class="flex-no-shrink text-slate-dark text-center bg-smoke-dark px-4 py-2 m-2">
        Item that cannot shrink below it's initial size
    </div>
    <div class="flex-shrink text-slate text-center bg-smoke px-4 py-2 m-2">
        Item that can shrink if needed
    </div>
</div>
@endcomponent

## Responsive

To control how a flex item grows or shrinks at a specific breakpoint, add a `{breakpoint}:` prefix to any existing utility class. For example, use `md:flex-no-shrink` to apply the `flex-no-shrink` utility at only medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

@component('_partials.responsive-code-sample')
@slot('none')
<div class="flex bg-smoke-light">
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">
        Item that can grow or shrink if needed
    </div>
    <div class="flex-none text-slate-dark text-center bg-smoke-dark px-4 py-2 m-2">
        Responsive flex item
    </div>
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">
        Item that can grow or shrink if needed
    </div>
</div>
@endslot
@slot('sm')
<div class="flex bg-smoke-light">
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">
        Item that can grow or shrink if needed
    </div>
    <div class="flex-grow text-slate-dark text-center bg-smoke-dark px-4 py-2 m-2">
        Responsive flex item
    </div>
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">
        Item that can grow or shrink if needed
    </div>
</div>
@endslot
@slot('md')
<div class="flex bg-smoke-light">
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">
        Item that can grow or shrink if needed
    </div>
    <div class="flex-shrink text-slate-dark text-center bg-smoke-dark px-4 py-2 m-2">
        Responsive flex item
    </div>
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">
        Item that can grow or shrink if needed
    </div>
</div>
@endslot
@slot('lg')
<div class="flex bg-smoke-light">
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">
        Item that can grow or shrink if needed
    </div>
    <div class="flex-1 text-slate-dark text-center bg-smoke-dark px-4 py-2 m-2">
        Responsive flex item
    </div>
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">
        Item that can grow or shrink if needed
    </div>
</div>
@endslot
@slot('xl')
<div class="flex bg-smoke-light">
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">
        Item that can grow or shrink if needed
    </div>
    <div class="flex-initial text-slate-dark text-center bg-smoke-dark px-4 py-2 m-2">
        Responsive flex item
    </div>
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">
        Item that can grow or shrink if needed
    </div>
</div>
@endslot
@slot('code')
<div class="flex ...">
    <!-- ... -->
    <div class="none:flex-none sm:flex-grow md:flex-shrink lg:flex-1 xl:flex-auto ...">
        Item that cannot grow or shrink
    </div>
    <!-- ... -->
</div>
@endslot
@endcomponent
