---
extends: _layouts.markdown
title: "Alerts"
---

# Alerts

We don't ship alert components because every app has it's own visual style and they are so easy to build out of utilities.

Here's a bunch of examples:

### Traditional

@component('_partials.code-sample', ['lang' => 'html'])
<div class="bg-red-lightest border border-red-light text-red-dark px-4 py-3 rounded relative">
  <strong class="font-bold">Holy smokes!</strong> Something seriously bad happened.
  <span class="absolute pin-t pin-b pin-r px-4 py-3">
    <svg class="h-6 w-6 text-red" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
  </span>
</div>
@endcomponent

---

### Left Accent Border

@component('_partials.code-sample', ['lang' => 'html'])
<div class="bg-orange-lightest border-l-4 border-orange text-orange-darker p-4">
  <p class="font-bold">Be Warned</p>
  <p>Something not ideal might be happening.</p>
</div>
@endcomponent

---

### Titled

@component('_partials.code-sample', ['lang' => 'html'])
<div>
  <div class="bg-red text-white font-bold rounded-t px-4 py-2">
    Danger
  </div>
  <div class="border border-t-0 border-red-light rounded-b bg-red-lightest px-4 py-3 text-red-dark">
    <p>Something not ideal might be happening.</p>
  </div>
</div>
@endcomponent

---

### Solid

@component('_partials.code-sample', ['lang' => 'html'])
<div class="flex items-center bg-blue text-white text-sm font-bold px-4 py-3">
  <svg class="h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M12.432 0c1.34 0 2.01.912 2.01 1.957 0 1.305-1.164 2.512-2.679 2.512-1.269 0-2.009-.75-1.974-1.99C9.789 1.436 10.67 0 12.432 0zM8.309 20c-1.058 0-1.833-.652-1.093-3.524l1.214-5.092c.211-.814.246-1.141 0-1.141-.317 0-1.689.562-2.502 1.117l-.528-.88c2.572-2.186 5.531-3.467 6.801-3.467 1.057 0 1.233 1.273.705 3.23l-1.391 5.352c-.246.945-.141 1.271.106 1.271.317 0 1.357-.392 2.379-1.207l.6.814C12.098 19.02 9.365 20 8.309 20z"/></svg>
  <p>
    Something happened that you should know about.
  </p>
</div>
@endcomponent

---

### Top Accent Border

@component('_partials.code-sample', ['lang' => 'html'])
<div class="bg-teal-lightest border-t-4 border-teal rounded-b text-teal-darkest px-4 py-3 shadow-md">
  <div class="flex">
    <svg class="h-6 w-6 text-teal mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg>
    <div>
      <p class="font-bold">Our privacy policy has changed</p>
      <p class="text-sm">Make sure you know how these changes affect you.</p>
    </div>
  </div>
</div>
@endcomponent

---

### Banner

@component('_partials.code-sample', ['lang' => 'html'])
<div class="bg-blue-lightest border-t border-b border-blue text-blue-dark px-4 py-3">
  <p class="font-bold">Informational message</p>
  <p class="text-sm">Some additional text to explain said message.</p>
</div>
@endcomponent
