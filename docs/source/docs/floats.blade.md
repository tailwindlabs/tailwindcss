---
extends: _layouts.documentation
title: "Floats"
description: "Utilities for controlling the wrapping of content around an element."
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
        <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark whitespace-no-wrap">.float-right</td>
        <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark whitespace-no-wrap">float: right;</td>
        <td class="p-2 border-t border-smoke text-sm text-grey-darker">Moves the element to the right side of its container.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.float-left</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">float: left;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Moves the element to the left side of its container.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.float-none</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">float: none;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Removes any previously defined float value.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.clearfix</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">
          &amp;:after {<br>
          &nbsp;&nbsp;content: "";<br>
          &nbsp;&nbsp;display: table;<br>
          &nbsp;&nbsp;clear: both;<br>
          }
        </td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Clear any floats within an element.</td>
      </tr>
    </tbody>
  </table>
</div>
