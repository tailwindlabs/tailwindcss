---
extends: _layouts.documentation
title: "Grids"
description: Examples of building grid layouts with Tailwind CSS.
---

Tailwind doesn't include purpose-built grid classes out of the box, but grid layouts are simple to build using the existing [Flexbox](/docs/flexbox-display) and [width](/docs/width) utilities.

## Basic Grids

Use the existing [Flexbox](/docs/flexbox-display) and [percentage width](/docs/width) utilities to construct basic grids.

@component('_partials.code-sample', ['lang' => 'html'])
<!-- Full width column -->
<div class="flex mb-4">
  <div class="w-full bg-grey h-12"></div>
</div>

<!-- Two columns -->
<div class="flex mb-4">
  <div class="w-1/2 bg-grey-light h-12"></div>
  <div class="w-1/2 bg-grey h-12"></div>
</div>

<!-- Three columns -->
<div class="flex mb-4">
  <div class="w-1/3 bg-grey-light h-12"></div>
  <div class="w-1/3 bg-grey h-12"></div>
  <div class="w-1/3 bg-grey-light h-12"></div>
</div>

<!-- Four columns -->
<div class="flex mb-4">
  <div class="w-1/4 bg-grey h-12"></div>
  <div class="w-1/4 bg-grey-light h-12"></div>
  <div class="w-1/4 bg-grey h-12"></div>
  <div class="w-1/4 bg-grey-light h-12"></div>
</div>

<!-- Five columns -->
<div class="flex mb-4">
  <div class="w-1/5 bg-grey h-12"></div>
  <div class="w-1/5 bg-grey-light h-12"></div>
  <div class="w-1/5 bg-grey h-12"></div>
  <div class="w-1/5 bg-grey-light h-12"></div>
  <div class="w-1/5 bg-grey h-12"></div>
</div>

<!-- Six columns -->
<div class="flex">
  <div class="w-1/6 bg-grey-light h-12"></div>
  <div class="w-1/6 bg-grey h-12"></div>
  <div class="w-1/6 bg-grey-light h-12"></div>
  <div class="w-1/6 bg-grey h-12"></div>
  <div class="w-1/6 bg-grey-light h-12"></div>
  <div class="w-1/6 bg-grey h-12"></div>
</div>
@endcomponent

## Responsive Grids

Use the responsive variants of the width utilities to build responsive grid layouts.

@component('_partials.responsive-code-sample')
@slot('none')
<div class="flex flex-wrap">
  <div class="h-12 w-full mb-4 bg-grey"></div>
  <div class="h-12 w-full mb-4 bg-grey-light"></div>
  <div class="h-12 w-full mb-4 bg-grey"></div>
  <div class="h-12 w-full mb-4 bg-grey-light"></div>
  <div class="h-12 w-full mb-4 bg-grey"></div>
  <div class="h-12 w-full mb-4 bg-grey-light"></div>
</div>
@endslot
@slot('sm')
<div class="flex flex-wrap">
  <div class="h-12 w-1/2 mb-4 bg-grey"></div>
  <div class="h-12 w-1/2 mb-4 bg-grey-light"></div>
  <div class="h-12 w-1/2 mb-4 bg-grey"></div>
  <div class="h-12 w-1/2 mb-4 bg-grey-light"></div>
  <div class="h-12 w-1/2 mb-4 bg-grey"></div>
  <div class="h-12 w-1/2 mb-4 bg-grey-light"></div>
</div>
@endslot
@slot('md')
<div class="flex flex-wrap">
  <div class="h-12 w-1/3 mb-4 bg-grey"></div>
  <div class="h-12 w-1/3 mb-4 bg-grey-light"></div>
  <div class="h-12 w-1/3 mb-4 bg-grey"></div>
  <div class="h-12 w-1/3 mb-4 bg-grey-light"></div>
  <div class="h-12 w-1/3 mb-4 bg-grey"></div>
  <div class="h-12 w-1/3 mb-4 bg-grey-light"></div>
</div>
@endslot
@slot('lg')
<div class="flex flex-wrap">
  <div class="h-12 w-1/4 mb-4 bg-grey"></div>
  <div class="h-12 w-1/4 mb-4 bg-grey-light"></div>
  <div class="h-12 w-1/4 mb-4 bg-grey"></div>
  <div class="h-12 w-1/4 mb-4 bg-grey-light"></div>
  <div class="h-12 w-1/2 mb-4 bg-grey"></div>
  <div class="h-12 w-1/2 mb-4 bg-grey-light"></div>
</div>
@endslot
@slot('xl')
<div class="flex flex-wrap">
  <div class="h-12 w-1/6 mb-4 bg-grey"></div>
  <div class="h-12 w-1/6 mb-4 bg-grey-light"></div>
  <div class="h-12 w-1/6 mb-4 bg-grey"></div>
  <div class="h-12 w-1/6 mb-4 bg-grey-light"></div>
  <div class="h-12 w-1/6 mb-4 bg-grey"></div>
  <div class="h-12 w-1/6 mb-4 bg-grey-light"></div>
</div>
@endslot
@slot('code')
<div class="flex flex-wrap">
  <div class="none:w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6 mb-4 bg-grey"></div>
  <div class="none:w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6 mb-4 bg-grey-light"></div>
  <div class="none:w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6 mb-4 bg-grey"></div>
  <div class="none:w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6 mb-4 bg-grey-light"></div>
  <div class="none:w-full sm:w-1/2 md:w-1/3 lg:w-1/2 xl:w-1/6 mb-4 bg-grey"></div>
  <div class="none:w-full sm:w-1/2 md:w-1/3 lg:w-1/2 xl:w-1/6 mb-4 bg-grey-light"></div>
</div>
@endslot
@endcomponent

## Mixed Column Sizes

Mix different percentage width utilities to build mixed size grids.

@component('_partials.code-sample', ['lang' => 'html'])
<!-- Narrower side column -->
<div class="flex mb-4">
  <div class="w-3/4 bg-grey h-12"></div>
  <div class="w-1/4 bg-grey-light h-12"></div>
</div>

<!-- Wide center column -->
<div class="flex">
  <div class="w-1/5 bg-grey h-12"></div>
  <div class="w-3/5 bg-grey-light h-12"></div>
  <div class="w-1/5 bg-grey h-12"></div>
</div>
@endcomponent

## Wrapping Columns

Add `flex-wrap` to your column container to allow columns to wrap when they run out of room.

@component('_partials.code-sample', ['lang' => 'html'])
<div class="flex flex-wrap -mb-4">
  <div class="w-1/3 mb-4 bg-grey-light h-12"></div>
  <div class="w-1/3 mb-4 bg-grey h-12"></div>
  <div class="w-1/3 mb-4 bg-grey-light h-12"></div>
  <div class="w-1/3 mb-4 bg-grey h-12"></div>
  <div class="w-1/3 mb-4 bg-grey-light h-12"></div>
</div>
@endcomponent

## Column Spacing

Add a negative horizontal margin like `-mx-2` to your column container and an equal horizontal padding like `px-2` to each column to add gutters.

To prevent horizontal scrolling in full width layouts, add `overflow-hidden` to another parent container, or compensate for the negative margin with matching horizontal padding.

@component('_partials.code-sample', ['lang' => 'html'])
<div class="px-2">
  <div class="flex -mx-2">
    <div class="w-1/3 px-2">
      <div class="bg-grey-light h-12"></div>
    </div>
    <div class="w-1/3 px-2">
      <div class="bg-grey h-12"></div>
    </div>
    <div class="w-1/3 px-2">
      <div class="bg-grey-light h-12"></div>
    </div>
  </div>
</div>
@endcomponent

## Automatic Column Widths

Use `flex-1` instead of an explicit width on your columns to have them size automatically to fill the row.

@component('_partials.code-sample', ['lang' => 'html'])
<!-- Full width column -->
<div class="flex mb-4">
  <div class="flex-1 bg-grey h-12"></div>
</div>

<!-- Five columns -->
<div class="flex mb-4">
  <div class="flex-1 bg-grey-light h-12"></div>
  <div class="flex-1 bg-grey h-12"></div>
  <div class="flex-1 bg-grey-light h-12"></div>
  <div class="flex-1 bg-grey h-12"></div>
  <div class="flex-1 bg-grey-light h-12"></div>
</div>

<!-- Seven columns -->
<div class="flex mb-4">
  <div class="flex-1 bg-grey-light h-12"></div>
  <div class="flex-1 bg-grey h-12"></div>
  <div class="flex-1 bg-grey-light h-12"></div>
  <div class="flex-1 bg-grey h-12"></div>
  <div class="flex-1 bg-grey-light h-12"></div>
  <div class="flex-1 bg-grey h-12"></div>
  <div class="flex-1 bg-grey-light h-12"></div>
</div>

<!-- Eleven columns -->
<div class="flex mb-4">
  <div class="flex-1 bg-grey-light h-12"></div>
  <div class="flex-1 bg-grey h-12"></div>
  <div class="flex-1 bg-grey-light h-12"></div>
  <div class="flex-1 bg-grey h-12"></div>
  <div class="flex-1 bg-grey-light h-12"></div>
  <div class="flex-1 bg-grey h-12"></div>
  <div class="flex-1 bg-grey-light h-12"></div>
  <div class="flex-1 bg-grey h-12"></div>
  <div class="flex-1 bg-grey-light h-12"></div>
  <div class="flex-1 bg-grey h-12"></div>
  <div class="flex-1 bg-grey-light h-12"></div>
</div>
@endcomponent

## Column Order

Use `flex-row-reverse` to reverse column order. Useful for two-column responsive layouts where the column on right should appear first on smaller screens.

@component('_partials.code-sample', ['lang' => 'html'])
<div class="flex md:flex-row-reverse flex-wrap">
  <div class="w-full md:w-3/4 bg-grey p-4 text-center text-grey-lighter">1</div>
  <div class="w-full md:w-1/4 bg-grey-light p-4 text-center text-grey-darker">2</div>
</div>
@endcomponent

## Simple Offsets

Use auto margin utilities like `ml-auto` and `mr-auto` to offset columns in a row.

@component('_partials.code-sample', ['lang' => 'html'])
<div class="flex flex-wrap">
  <div class="w-1/3 ml-auto bg-grey h-12"></div>
  <div class="w-1/3 mr-auto bg-grey-light h-12"></div>
</div>
@endcomponent
