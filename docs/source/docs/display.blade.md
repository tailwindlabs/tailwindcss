---
extends: _layouts.documentation
title: "Display"
description: "Utilities for controlling the display box type of an element."
features:
  responsive: true
  customizable: false
  hover: false
  focus: false
---

@include('_partials.work-in-progress')

<div class="border-t border-grey-lighter">
  <table class="w-full text-left" style="border-collapse: collapse;">
    <thead>
      <tr>
        <th class="text-sm font-semibold text-grey-darker p-2 bg-grey-lightest">Class</th>
        <th class="text-sm font-semibold text-grey-darker p-2 bg-grey-lightest">Properties</th>
        <th class="text-sm font-semibold text-grey-darker p-2 bg-grey-lightest">Description</th>
      </tr>
    </thead>
    <tbody class="align-baseline">
      <tr>
        <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark whitespace-no-wrap">.block</td>
        <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark whitespace-no-wrap">display: block;</td>
        <td class="p-2 border-t border-smoke text-sm text-grey-darker">Set the box type of the element to <code>block</code>.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.inline-block</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">display: inline-block;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Set the box type of the element to <code>inline-block</code>.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.inline</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">display: inline;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Set the box type of the element to <code>inline</code>.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.table</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">display: table;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Set the box type of the element to <code>table</code>.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.table-row</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">display: table-row;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Set the box type of the element to <code>table-row</code>.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.table-cell</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">display: table-cell;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Set the box type of the element to <code>table-cell</code>.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.hidden</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">display: none;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Set the box type of the element to <code>none</code>.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.flex</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">display: flex;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Set the box type of the element to <code>flex</code>.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.inline-flex</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">display: inline-flex;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Set the box type of the element to <code>inline-flex</code>.</td>
      </tr>
    </tbody>
  </table>
</div>
