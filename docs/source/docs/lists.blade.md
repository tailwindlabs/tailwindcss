---
extends: _layouts.documentation
title: "Lists"
description: "Utilities for controlling list styles."
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
        <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark">.list-reset</td>
        <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark">
          list-style: none;<br>
          margin: 0;<br>
          padding: 0;
        </td>
        <td class="p-2 border-t border-smoke text-sm text-grey-darker">Disable default browser styling for list elements.</td>
      </tr>
    </tbody>
  </table>
</div>
