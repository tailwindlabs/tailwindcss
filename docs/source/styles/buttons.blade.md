---
extends: _layouts.markdown
title: "Buttons"
---

# Buttons

We don't ship any default button components because every app has it's own visual style and Tailwind tries to be as unopinionated as possible about how your project should look.

That said, buttons are easy to build by combining utility classes.

Here's a bunch of examples:

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

---

### Pill

@component('_partials.code-sample', ['lang' => 'html', 'class' => 'text-center'])
<button class="bg-blue hover:bg-blue-dark text-white font-bold py-2 px-4 rounded-pill">
    Button
</button>
@endcomponent

---

### Outline

@component('_partials.code-sample', ['lang' => 'html', 'class' => 'text-center'])
<button class="bg-transparent hover:bg-blue text-blue-dark font-semibold hover:text-white py-2 px-4 border border-blue hover:border-transparent rounded">
    Button
</button>
@endcomponent

---

### Bordered

@component('_partials.code-sample', ['lang' => 'html', 'class' => 'text-center'])
<button class="bg-blue hover:bg-blue-dark text-white font-bold py-2 px-4 border border-blue-darker rounded">
    Button
</button>
@endcomponent

---

### Disabled

@component('_partials.code-sample', ['lang' => 'html', 'class' => 'text-center'])
<button class="bg-blue text-white font-bold py-2 px-4 rounded opacity-50 cursor-not-allowed">
    Button
</button>
@endcomponent

---

### 3D

@component('_partials.code-sample', ['lang' => 'html', 'class' => 'text-center'])
<button class="bg-blue hover:bg-blue-dark text-white font-bold py-2 px-4 border-b-4 border-blue-dark hover:border-blue-darker rounded">
    Button
</button>
@endcomponent

---

### Elevated

@component('_partials.code-sample', ['lang' => 'html', 'class' => 'text-center'])
<button class="bg-white hover:bg-smoke-lighter text-slate-dark font-semibold py-2 px-4 border border-slate-lighter rounded shadow">
    Button
</button>
@endcomponent

---

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

---

### w/Icon

@component('_partials.code-sample', ['lang' => 'html', 'class' => 'text-center'])
<button class="bg-smoke hover:bg-smoke-dark text-slate-dark font-bold py-2 px-4 rounded inline-flex items-center">
    <svg class="h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z"/></svg>
    <span>Download</span>
</button>
@endcomponent

