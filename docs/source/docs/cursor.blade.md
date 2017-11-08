---
extends: _layouts.documentation
title: "Cursor"
description: "Utilities for controlling the cursor style when hovering over an element."
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
                <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark">.cursor-auto</td>
                <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark">cursor: auto;</td>
                <td class="p-2 border-t border-smoke text-sm text-grey-darker">Set the mouse cursor to the default browser behavior.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark">.cursor-pointer</td>
                <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark">cursor: pointer;</td>
                <td class="p-2 border-t border-smoke text-sm text-grey-darker">Set the mouse cursor to a pointer and indicate a link.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark">.cursor-not-allowed</td>
                <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark">cursor: not-allowed;</td>
                <td class="p-2 border-t border-smoke text-sm text-grey-darker">Set the mouse cursor to indicate that the action will not be executed.</td>
            </tr>
        </tbody>
    </table>
</div>
