---
extends: _layouts.documentation
title: "Buttons"
---

# Buttons

<div class="mt-8">
  <div class="bg-blue-lightest border-l-4 border-blue-light rounded-b text-blue-darkest px-4 py-3">
    <div class="flex">
      <div class="py-1">
        <svg class="h-6 w-6 text-blue-light mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10 20C4.477 20 0 15.523 0 10S4.477 0 10 0s10 4.477 10 10-4.477 10-10 10zm0-2c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm-.5-5h1c.276 0 .5.224.5.5v1c0 .276-.224.5-.5.5h-1c-.276 0-.5-.224-.5-.5v-1c0-.276.224-.5.5-.5zm0-8h1c.276 0 .5.224.5.5V8l-.5 3-1 .5L9 8V5.5c0-.276.224-.5.5-.5z"/></svg>
      </div>
      <div>
        <p class="font-semibold">Work in progress!</p>
        <p class="text-sm">More detailed documentation is coming soon, but in the mean time here's a bunch of quick examples.</p>
      </div>
    </div>
  </div>
</div>

### Simple

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
    @apply&nbsp;.font-bold .py-2 .px-4 .rounded;
  }
  .btn-blue {
    @apply&nbsp;.bg-blue .text-white;
  }
  .btn-blue:hover {
    @apply&nbsp;.bg-blue-dark;
  }
</style>
@endslot
@endcomponent

### Pill

@component('_partials.code-sample', ['lang' => 'html', 'class' => 'text-center'])
<button class="bg-blue hover:bg-blue-dark text-white font-bold py-2 px-4 rounded-full">
    Button
</button>
@endcomponent

### Outline

@component('_partials.code-sample', ['lang' => 'html', 'class' => 'text-center'])
<button class="bg-transparent hover:bg-blue text-blue-dark font-semibold hover:text-white py-2 px-4 border border-blue hover:border-transparent rounded">
    Button
</button>
@endcomponent

### Bordered

@component('_partials.code-sample', ['lang' => 'html', 'class' => 'text-center'])
<button class="bg-blue hover:bg-blue-dark text-white font-bold py-2 px-4 border border-blue-darker rounded">
    Button
</button>
@endcomponent

### Disabled

@component('_partials.code-sample', ['lang' => 'html', 'class' => 'text-center'])
<button class="bg-blue text-white font-bold py-2 px-4 rounded opacity-50 cursor-not-allowed">
    Button
</button>
@endcomponent

### 3D

@component('_partials.code-sample', ['lang' => 'html', 'class' => 'text-center'])
<button class="bg-blue hover:bg-blue-light text-white font-bold py-2 px-4 border-b-4 border-blue-dark hover:border-blue rounded">
    Button
</button>
@endcomponent

### Elevated

@component('_partials.code-sample', ['lang' => 'html', 'class' => 'text-center'])
<button class="bg-white hover:bg-smoke-lighter text-slate-dark font-semibold py-2 px-4 border border-slate-lighter rounded shadow">
    Button
</button>
@endcomponent

### Button Groups

@component('_partials.code-sample', ['lang' => 'html', 'class' => 'text-center'])
<div class="inline-flex">
    <button class="bg-smoke hover:bg-smoke-dark text-slate-dark font-bold py-2 px-4 rounded-l">
        Prev
    </button>
    <button class="bg-smoke hover:bg-smoke-dark text-slate-dark font-bold py-2 px-4 rounded-r">
        Next
    </button>
</div>
@endcomponent

### w/Icon

@component('_partials.code-sample', ['lang' => 'html', 'class' => 'text-center'])
<button class="bg-smoke hover:bg-smoke-dark text-slate-dark font-bold py-2 px-4 rounded inline-flex items-center">
    <svg class="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z"/></svg>
    <span>Download</span>
</button>
@endcomponent

