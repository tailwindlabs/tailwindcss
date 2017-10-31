---
extends: _layouts.documentation
title: "Forms"
---

# Forms

<div class="mt-8">
  <div class="bg-blue-lightest border-l-4 border-blue-light rounded-b text-blue-darkest px-4 py-3">
    <div class="flex">
      <div class="py-1">
        <svg class="h-6 w-6 text-blue-light mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10 20C4.477 20 0 15.523 0 10S4.477 0 10 0s10 4.477 10 10-4.477 10-10 10zm0-2c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm-.5-5h1c.276 0 .5.224.5.5v1c0 .276-.224.5-.5.5h-1c-.276 0-.5-.224-.5-.5v-1c0-.276.224-.5.5-.5zm0-8h1c.276 0 .5.224.5.5V8l-.5 3-1 .5L9 8V5.5c0-.276.224-.5.5-.5z"/></svg>
      </div>
      <div>
        <p class="font-semibold">Work in progress!</p>
        <p class="text-sm">More detailed documentation is coming soon.</p>
      </div>
    </div>
  </div>
</div>

### Custom Select

Form controls are great candidates for component classes, but just for fun, here's how you can build a fully custom select menu with just utility classes:

@component('_partials.code-sample', ['lang' => 'html', 'class' => 'text-center'])
<div class="inline-block relative w-64">
    <select class="block input-reset w-full bg-white border border-smoke-dark hover:border-slate-light px-4 py-2 pr-8 rounded shadow">
        <option>Really long option that will likely overlap the chevron</option>
        <option>Option 2</option>
        <option>Option 3</option>
    </select>
    <div class="pointer-events-none absolute pin-y pin-r flex items-center px-2 text-slate">
        <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
    </div>
</div>
@endcomponent
