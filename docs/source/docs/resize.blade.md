---
extends: _layouts.documentation
title: "Resize"
description: "Utilities for controlling the how a textarea can be resized."
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
        <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark">.resize-none</td>
        <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark">resize: none;</td>
        <td class="p-2 border-t border-smoke text-sm text-grey-darker">Make a textarea not resizable.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark">.resize-y</td>
        <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark">resize: vertical;</td>
        <td class="p-2 border-t border-smoke text-sm text-grey-darker">Make a textarea resizable vertically.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark">.resize-x</td>
        <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark">resize: horizontal;</td>
        <td class="p-2 border-t border-smoke text-sm text-grey-darker">Make a textarea resizable horizontally.</td>
      </tr>
    </tbody>
  </table>
</div>
