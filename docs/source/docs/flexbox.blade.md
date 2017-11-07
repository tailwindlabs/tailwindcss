---
extends: _layouts.documentation
title: "Flexbox"
description: null
---

<div class="subnav">
    <a class="subnav-link" href="#usage">Usage</a>
    <a class="subnav-link" href="#responsive">Responsive</a>
    <a class="subnav-link" href="#customizing">Customizing</a>
</div>

Tailwind provides a comprehensive set of Flexbox utilities out of the box to make it easy for you to implement complex layouts without having to write any new CSS.

## Display

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

---

## Flex Direction

### Row

Use `.flex-row` to position flex items horizontally in the same direction as text *(this is also the default behavior)*:

@component('_partials.code-sample')
<div class="flex flex-row bg-smoke-light">
    <div class="text-slate text-center bg-smoke px-4 py-2 m-2">1</div>
    <div class="text-slate text-center bg-smoke px-4 py-2 m-2">2</div>
    <div class="text-slate text-center bg-smoke px-4 py-2 m-2">3</div>
</div>
@endcomponent

### Row reversed

Use `.flex-row-reverse` to position flex items horizontally in the opposite direction:

@component('_partials.code-sample')
<div class="flex flex-row-reverse bg-smoke-light">
    <div class="text-slate text-center bg-smoke px-4 py-2 m-2">1</div>
    <div class="text-slate text-center bg-smoke px-4 py-2 m-2">2</div>
    <div class="text-slate text-center bg-smoke px-4 py-2 m-2">3</div>
</div>
@endcomponent

### Column

Use `.flex-col` to position flex items vertically:

@component('_partials.code-sample')
<div class="flex flex-col bg-smoke-light">
    <div class="text-slate text-center bg-smoke px-4 py-2 m-2">1</div>
    <div class="text-slate text-center bg-smoke px-4 py-2 m-2">2</div>
    <div class="text-slate text-center bg-smoke px-4 py-2 m-2">3</div>
</div>
@endcomponent

### Column reversed

Use `.flex-col-reverse` to position flex items vertically in the opposite direction:

@component('_partials.code-sample')
<div class="flex flex-col-reverse bg-smoke-light">
    <div class="text-slate text-center bg-smoke px-4 py-2 m-2">1</div>
    <div class="text-slate text-center bg-smoke px-4 py-2 m-2">2</div>
    <div class="text-slate text-center bg-smoke px-4 py-2 m-2">3</div>
</div>
@endcomponent

---

## Flex Wrapping

### No wrapping

Use `.flex-nowrap` to prevent flex items from wrapping *(this is also the default behavior)*:

@component('_partials.code-sample')
<div class="flex flex-nowrap bg-smoke-light">
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

---

## Justify Content

### Start

Use `.justify-start` to justify items against the start of the flex container's main axis *(this is also the default behavior)*:

@component('_partials.code-sample')
<div class="flex justify-start bg-smoke-light">
    <div class="text-slate text-center bg-smoke px-4 py-2 m-2">1</div>
    <div class="text-slate text-center bg-smoke px-4 py-2 m-2">2</div>
    <div class="text-slate text-center bg-smoke px-4 py-2 m-2">3</div>
</div>
@endcomponent

### End

Use `.justify-end` to justify items against the end of the flex container's main axis:

@component('_partials.code-sample')
<div class="flex justify-end bg-smoke-light">
    <div class="text-slate text-center bg-smoke px-4 py-2 m-2">1</div>
    <div class="text-slate text-center bg-smoke px-4 py-2 m-2">2</div>
    <div class="text-slate text-center bg-smoke px-4 py-2 m-2">3</div>
</div>
@endcomponent

### Center

Use `.justify-center` to justify items along the center of the flex container's main axis:

@component('_partials.code-sample')
<div class="flex justify-center bg-smoke-light">
    <div class="text-slate text-center bg-smoke px-4 py-2 m-2">1</div>
    <div class="text-slate text-center bg-smoke px-4 py-2 m-2">2</div>
    <div class="text-slate text-center bg-smoke px-4 py-2 m-2">3</div>
</div>
@endcomponent

### Space between

Use `.justify-between` to justify items along the flex container's main axis such that there is an equal amount of space between each item:

@component('_partials.code-sample')
<div class="flex justify-between bg-smoke-light">
    <div class="text-slate text-center bg-smoke px-4 py-2 m-2">1</div>
    <div class="text-slate text-center bg-smoke px-4 py-2 m-2">2</div>
    <div class="text-slate text-center bg-smoke px-4 py-2 m-2">3</div>
</div>
@endcomponent

### Space around

Use `.justify-around` to justify items along the flex container's main axis such that there is an equal amount of space around each item:

@component('_partials.code-sample')
<div class="flex justify-around bg-smoke-light">
    <div class="text-slate text-center bg-smoke px-4 py-2 m-2">1</div>
    <div class="text-slate text-center bg-smoke px-4 py-2 m-2">2</div>
    <div class="text-slate text-center bg-smoke px-4 py-2 m-2">3</div>
</div>
@endcomponent

---

## Align Items

### Stretch

Use `.items-stretch` to stretch items to fill the flex container's cross axis *(this is also the default behavior)*:

@component('_partials.code-sample')
<div class="flex items-stretch bg-smoke-light h-24">
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">1</div>
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">2</div>
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">3</div>
</div>
@endcomponent

### Start

Use `.items-start` to align items to the start of the flex container's cross axis:

@component('_partials.code-sample')
<div class="flex items-start bg-smoke-light h-24">
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">1</div>
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">2</div>
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">3</div>
</div>
@endcomponent

### End

Use `.items-end` to align items to the end of the flex container's cross axis:

@component('_partials.code-sample')
<div class="flex items-end bg-smoke-light h-24">
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">1</div>
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">2</div>
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">3</div>
</div>
@endcomponent

### Center

Use `.items-center` to align items along the center of the flex container's cross axis:

@component('_partials.code-sample')
<div class="flex items-center bg-smoke-light h-24">
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">1</div>
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">2</div>
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">3</div>
</div>
@endcomponent

### Baseline

Use `.items-baseline` to align items along the flex container's cross axis such that all of their baselines align:

@component('_partials.code-sample')
<div class="flex items-baseline bg-smoke-light h-24">
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2 text-base">1</div>
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2 text-2xl">2</div>
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2 text-lg">3</div>
</div>
@endcomponent

---

## Align Content

### Start

Use `.content-start` to pack lines in a flex container against the start of the main axis *(this is also the default behavior)*:

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

Use `.content-center` to pack lines in a flex container in the center of the main axis:

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

Use `.content-end` to pack lines in a flex container against the end of the main axis:

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

---

## Flex

### 1

Use `.flex-1` to allow a flex item to grow and shrink as needed, ignoring its initial size:

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

Use `.flex-auto` to allow a flex item to grow and shrink, taking into account its initial size:

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

### Initial

Use `.flex-initial` to allow a flex item to shrink but not grow, taking into account its initial size *(this is also the default behavior)*:

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

---

## Flex Grow

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

---

## Flex shrink

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
        Item that cannot shrink below its initial size
    </div>
    <div class="flex-shrink text-slate text-center bg-smoke px-4 py-2 m-2">
        Item that can shrink if needed
    </div>
</div>
@endcomponent

---

## Align Self

### Start

Use `.self-start` to align an item to the start of the flex container's cross axis, despite the container's `align-items` value:

@component('_partials.code-sample')
<div class="flex items-stretch bg-smoke-light h-24">
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">1</div>
    <div class="self-start flex-1 text-slate-dark text-center bg-smoke-dark px-4 py-2 m-2">2</div>
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">3</div>
</div>
@endcomponent

### End

Use `.self-end` to align an item to the end of the flex container's cross axis, despite the container's `align-items` value:

@component('_partials.code-sample')
<div class="flex items-stretch bg-smoke-light h-24">
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">1</div>
    <div class="self-end flex-1 text-slate-dark text-center bg-smoke-dark px-4 py-2 m-2">2</div>
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">3</div>
</div>
@endcomponent

### Center

Use `.self-center` to align an item along the center of the flex container's cross axis, despite the container's `align-items` value:

@component('_partials.code-sample')
<div class="flex items-stretch bg-smoke-light h-24">
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">1</div>
    <div class="self-center flex-1 text-slate-dark text-center bg-smoke-dark px-4 py-2 m-2">2</div>
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">3</div>
</div>
@endcomponent

### Stretch

Use `.self-stretch` to stretch an item to fill the flex container's cross axis, despite the container's `align-items` value:

@component('_partials.code-sample')
<div class="flex items-start bg-smoke-light h-24">
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">1</div>
    <div class="self-stretch flex-1 text-slate-dark text-center bg-smoke-dark px-4 py-2 m-2">2</div>
    <div class="flex-1 text-slate text-center bg-smoke px-4 py-2 m-2">3</div>
</div>
@endcomponent
