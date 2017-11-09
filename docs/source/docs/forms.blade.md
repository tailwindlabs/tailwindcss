---
extends: _layouts.documentation
title: "Forms"
description: "Utilities for styling form controls."
features:
  responsive: true
  customizable: false
  hover: false
  focus: false
---

@include('_partials.work-in-progress')

<div class="border-t border-grey-lighter">
  <table class="w-full text-left" style="border-collapse: collapse;">
    <colgroup>
      <col class="w-1/5">
      <col class="w-1/3">
      <col>
    </colgroup>
    <thead>
      <tr>
        <th class="text-sm font-semibold text-grey-darker p-2 bg-grey-lightest">Class</th>
        <th class="text-sm font-semibold text-grey-darker p-2 bg-grey-lightest">Properties</th>
        <th class="text-sm font-semibold text-grey-darker p-2 bg-grey-lightest">Description</th>
      </tr>
    </thead>
    <tbody class="align-baseline">
      <tr>
        <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark">.appearance-none</td>
        <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark">appearance: none;</td>
        <td class="p-2 border-t border-smoke text-sm text-grey-darker">Remove any special styling applied to an element by the browser.</td>
      </tr>
    </tbody>
  </table>
</div>

### Custom Select

Form controls are great candidates for component classes, but just for fun, here's how you can build a fully custom select menu with just utility classes:

@component('_partials.code-sample', ['lang' => 'html', 'class' => 'text-center'])
<div class="inline-block relative w-64">
  <select class="block appearance-none w-full bg-white border border-grey-light hover:border-grey px-4 py-2 pr-8 rounded shadow">
    <option>Really long option that will likely overlap the chevron</option>
    <option>Option 2</option>
    <option>Option 3</option>
  </select>
  <div class="pointer-events-none absolute pin-y pin-r flex items-center px-2 text-slate">
    <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
  </div>
</div>
@endcomponent
