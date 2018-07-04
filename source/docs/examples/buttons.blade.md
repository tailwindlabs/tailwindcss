---
extends: _layouts.documentation
title: "Buttons"
description: Examples of building buttons with Tailwind CSS.
---

Tailwind doesn't include pre-designed button styles out of the box, but they're easy to build using existing utilities.

## Simple

@component('_partials.code-sample', ['lang' => 'html', 'class' => 'text-center'])
<button class="bg-blue hover:bg-blue-dark text-white font-bold py-2 px-4 rounded">
  Button
</button>

@slot('code')
<!-- Using utilities: -->
<button class="bg-blue hover:bg-blue-dark text-white font-bold py-2 px-4 rounded">
  Button
</button>

<!-- Extracting component classes: -->
<button class="btn btn-blue">
  Button
</button>

<style>
  .btn {
    @@apply font-bold py-2 px-4 rounded;
  }
  .btn-blue {
    @@apply bg-blue text-white;
  }
  .btn-blue:hover {
    @@apply bg-blue-dark;
  }
</style>
@endslot
@endcomponent

## Pill

@component('_partials.code-sample', ['lang' => 'html', 'class' => 'text-center'])
<button class="bg-blue hover:bg-blue-dark text-white font-bold py-2 px-4 rounded-full">
  Button
</button>
@endcomponent

## Outline

@component('_partials.code-sample', ['lang' => 'html', 'class' => 'text-center'])
<button class="bg-transparent hover:bg-blue text-blue-dark font-semibold hover:text-white py-2 px-4 border border-blue hover:border-transparent rounded">
  Button
</button>
@endcomponent

## Bordered

@component('_partials.code-sample', ['lang' => 'html', 'class' => 'text-center'])
<button class="bg-blue hover:bg-blue-dark text-white font-bold py-2 px-4 border border-blue-darker rounded">
  Button
</button>
@endcomponent

## Disabled

@component('_partials.code-sample', ['lang' => 'html', 'class' => 'text-center'])
<button class="bg-blue text-white font-bold py-2 px-4 rounded opacity-50 cursor-not-allowed">
  Button
</button>
@endcomponent

## 3D

@component('_partials.code-sample', ['lang' => 'html', 'class' => 'text-center'])
<button class="bg-blue hover:bg-blue-light text-white font-bold py-2 px-4 border-b-4 border-blue-dark hover:border-blue rounded">
  Button
</button>
@endcomponent

## Elevated

@component('_partials.code-sample', ['lang' => 'html', 'class' => 'text-center'])
<button class="bg-white hover:bg-grey-lightest text-grey-darkest font-semibold py-2 px-4 border border-grey-light rounded shadow">
  Button
</button>
@endcomponent

## Groups

@component('_partials.code-sample', ['lang' => 'html', 'class' => 'text-center'])
<div class="inline-flex">
  <button class="bg-grey-light hover:bg-grey text-grey-darkest font-bold py-2 px-4 rounded-l">
    Prev
  </button>
  <button class="bg-grey-light hover:bg-grey text-grey-darkest font-bold py-2 px-4 rounded-r">
    Next
  </button>
</div>
@endcomponent

## Icons

@component('_partials.code-sample', ['lang' => 'html', 'class' => 'text-center'])
<button class="bg-grey-light hover:bg-grey text-grey-darkest font-bold py-2 px-4 rounded inline-flex items-center">
  <svg class="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z"/></svg>
  <span>Download</span>
</button>
@endcomponent
