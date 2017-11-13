---
extends: _layouts.documentation
title: "Buttons"
description: null
---

@include('_partials.work-in-progress-example')

### Simple

@component('_partials.code-sample', ['lang' => 'html', 'class' => 'text-center'])
<button class="bg-blue hover:bg-blue-dark text-white font-bold py-2 px-4 radius-md">
  Button
</button>

@slot('code')
<!-- Using utilities: -->
<button class="bg-blue hover:bg-blue-dark text-white font-bold py-2 px-4 radius-md">
  Button
</button>

<!-- Extracting component classes: -->
<button class="btn btn-blue">
  Button
</button>

<style>
  .btn {
    @apply&nbsp;.font-bold .py-2 .px-4 .radius-md;
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
<button class="bg-blue hover:bg-blue-dark text-white font-bold py-2 px-4 radius-full">
  Button
</button>
@endcomponent

### Outline

@component('_partials.code-sample', ['lang' => 'html', 'class' => 'text-center'])
<button class="bg-transparent hover:bg-blue text-blue-dark font-semibold hover:text-white py-2 px-4 border border-blue hover:border-transparent radius-md">
  Button
</button>
@endcomponent

### Bordered

@component('_partials.code-sample', ['lang' => 'html', 'class' => 'text-center'])
<button class="bg-blue hover:bg-blue-dark text-white font-bold py-2 px-4 border border-blue-darker radius-md">
  Button
</button>
@endcomponent

### Disabled

@component('_partials.code-sample', ['lang' => 'html', 'class' => 'text-center'])
<button class="bg-blue text-white font-bold py-2 px-4 radius-md opacity-50 cursor-not-allowed">
  Button
</button>
@endcomponent

### 3D

@component('_partials.code-sample', ['lang' => 'html', 'class' => 'text-center'])
<button class="bg-blue hover:bg-blue-light text-white font-bold py-2 px-4 border-b-4 border-blue-dark hover:border-blue radius-md">
  Button
</button>
@endcomponent

### Elevated

@component('_partials.code-sample', ['lang' => 'html', 'class' => 'text-center'])
<button class="bg-white hover:bg-smoke-lighter text-slate-dark font-semibold py-2 px-4 border border-slate-lighter radius-md shadow">
  Button
</button>
@endcomponent

### Groups

@component('_partials.code-sample', ['lang' => 'html', 'class' => 'text-center'])
<div class="inline-flex">
  <button class="bg-smoke hover:bg-smoke-dark text-slate-dark font-bold py-2 px-4 radius-l-md">
    Prev
  </button>
  <button class="bg-smoke hover:bg-smoke-dark text-slate-dark font-bold py-2 px-4 radius-r-md">
    Next
  </button>
</div>
@endcomponent

### Icons

@component('_partials.code-sample', ['lang' => 'html', 'class' => 'text-center'])
<button class="bg-smoke hover:bg-smoke-dark text-slate-dark font-bold py-2 px-4 radius-md inline-flex items-center">
  <svg class="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z"/></svg>
  <span>Download</span>
</button>
@endcomponent
