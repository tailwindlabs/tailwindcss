---
extends: _layouts.documentation
title: "Border Style"
description: "Utilities for controlling the style of an element's borders."
features:
  responsive: true
  customizable: false
  hover: false
  focus: false
---

@include('_partials.work-in-progress')

<div class="border-t border-grey-lighter">
  <table class="w-full text-left table-collapse">
    <thead>
      <tr>
        <th class="text-sm font-semibold text-grey-darker p-2 bg-grey-lightest">Class</th>
        <th class="text-sm font-semibold text-grey-darker p-2 bg-grey-lightest">Properties</th>
        <th class="text-sm font-semibold text-grey-darker p-2 bg-grey-lightest">Description</th>
      </tr>
    </thead>
    <tbody class="align-baseline">
      <tr>
          <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark">.double-solid</td>
          <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark">border-style: double;</td>
          <td class="p-2 border-t border-smoke text-sm text-grey-darker">Sets the border style on an element to double.</td>
      </tr>
      <tr>
          <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark">.groove-solid</td>
          <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark">border-style: groove;</td>
          <td class="p-2 border-t border-smoke text-sm text-grey-darker">Sets the border style on an element to groove.</td>
      </tr>
      <tr>
          <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark">.ridge-solid</td>
          <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark">border-style: ridge;</td>
          <td class="p-2 border-t border-smoke text-sm text-grey-darker">Sets the border style on an element to ridge.</td>
      </tr>
      <tr>
          <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark">.inset-solid</td>
          <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark">border-style: inset;</td>
          <td class="p-2 border-t border-smoke text-sm text-grey-darker">Sets the border style on an element to inset.</td>
      </tr>
      <tr>
          <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark">.outset-solid</td>
          <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark">border-style: outset;</td>
          <td class="p-2 border-t border-smoke text-sm text-grey-darker">Sets the border style on an element to outset.</td>
      </tr>
      <tr>
          <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark">.border-solid</td>
          <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark">border-style: solid;</td>
          <td class="p-2 border-t border-smoke text-sm text-grey-darker">Sets the border style on an element to solid.</td>
      </tr>
      <tr>
          <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark">.border-dashed</td>
          <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark">border-style: dashed;</td>
          <td class="p-2 border-t border-smoke text-sm text-grey-darker">Sets the border style on an element to dashed.</td>
      </tr>
      <tr>
          <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.border-dotted</td>
          <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">border-style: dotted;</td>
          <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Sets the border style on an element to dotted.</td>
      </tr>
      <tr>
          <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.border-none</td>
          <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">border-style: none;</td>
          <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Disables the border on an element.</td>
      </tr>
    </tbody>
  </table>
</div>
