---
extends: _layouts.documentation
title: "Pointer Events"
description: "Utilities for controlling whether an element responds to pointer events."
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
      <col class="w-1/4">
      <col class="w-1/4">
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
        <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark">.pointer-events-none</td>
        <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark">pointer-events: none;</td>
        <td class="p-2 border-t border-smoke text-sm text-grey-darker">Make element not react to pointer events, like <code>:hover</code> or <code>click</code>.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark">.pointer-events-auto</td>
        <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark">pointer-events: auto;</td>
        <td class="p-2 border-t border-smoke text-sm text-grey-darker">Make element react to pointer events, like <code>:hover</code> or <code>click</code>.</td>
      </tr>
    </tbody>
  </table>
</div>
