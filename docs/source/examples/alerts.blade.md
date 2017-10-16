---
extends: _layouts.markdown
title: "Alerts"
---

# Alerts

We don't ship alert components because every app has it's own visual style and they are so easy to build out of utilities.

Here's a bunch of examples:

### Traditional

@component('_partials.code-sample', ['lang' => 'html'])
<div class="bg-red-lighter border border-red-light text-red px-4 py-3 rounded relative">
  <strong>Holy smokes!</strong> Something seriously bad happened.
  <span class="absolute pin-t pin-b pin-r px-4 py-3">
    <svg class="h-6 w-6 text-red" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
  </span>
</div>
@endcomponent

---

### Left Accent Border

@component('_partials.code-sample', ['lang' => 'html'])
<div class="bg-orange-lighter border-l-4 border-orange text-orange-dark p-4">
  <p class="text-bold">Be Warned</p>
  <p>Something not ideal might be happening.</p>
</div>
@endcomponent

---

### Titled

@component('_partials.code-sample', ['lang' => 'html'])
<div>
  <div class="bg-red text-light text-bold rounded-t px-4 py-2">
    Danger
  </div>
  <div class="border border-red-light rounded-b bg-red-lighter px-4 py-3 text-red">
    <p>Something not ideal might be happening.</p>
  </div>
</div>
@endcomponent

---

### Solid

@component('_partials.code-sample', ['lang' => 'html'])
<div class="bg-blue text-light text-sm text-bold px-4 py-3">
  Something happened that you should know about but is probably good or at least not bad.
</div>
@endcomponent

---

### Top Accent Border

@component('_partials.code-sample', ['lang' => 'html'])
<div class="bg-teal-lighter border-t-4 border-teal rounded-b text-dark px-4 py-3 shadow-2">
  <div class="flex">
    <svg class="h-6 w-6 text-teal mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg>
    <div>
      <p class="text-medium">Our privacy policy has changed</p>
      <p class="text-sm">Make sure you know how these changes affect you.</p>
    </div>
  </div>
</div>
@endcomponent

---

### Banner

@component('_partials.code-sample', ['lang' => 'html'])
<div class="bg-blue-lighter border-t border-b border-blue text-blue px-4 py-3">
  <p class="text-bold">Informational message</p>
  <p class="text-sm">Some additional text to explain said message.</p>
</div>
@endcomponent
