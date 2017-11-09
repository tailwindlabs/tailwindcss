---
extends: _layouts.documentation
title: "Text Alignment"
description: "Utilities for controlling the alignment of text."
features:
  responsive: true
  customizable: true
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
        <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark whitespace-no-wrap">.text-left</td>
        <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark">text-align: left;</td>
        <td class="p-2 border-t border-smoke text-sm text-grey-darker">Align text to the left.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark whitespace-no-wrap">.text-center</td>
        <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark">text-align: center;</td>
        <td class="p-2 border-t border-smoke text-sm text-grey-darker">Align text to the center.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark whitespace-no-wrap">.text-right</td>
        <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark">text-align: right;</td>
        <td class="p-2 border-t border-smoke text-sm text-grey-darker">Align text to the right.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark whitespace-no-wrap">.text-justify</td>
        <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark">text-align: justify;</td>
        <td class="p-2 border-t border-smoke text-sm text-grey-darker">Justify text.</td>
      </tr>
    </tbody>
  </table>
</div>
