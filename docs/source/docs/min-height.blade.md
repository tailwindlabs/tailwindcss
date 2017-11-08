---
extends: _layouts.documentation
title: "Min-Height"
description: "Utilities for setting the minimum height of an element"
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
                <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark">.min-h-0</td>
                <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark">min-height: 0;</td>
                <td class="p-2 border-t border-smoke text-sm text-grey-darker">Set the element's minimum height to <code>0</code>.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.min-h-full</td>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">min-height: 100%;</td>
                <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Set the element's minimum height to <code>100%</code>.</td>
            <tr>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.min-h-screen</td>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">min-height: 100vh;</td>
                <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Set the element's minimum height to <code>100vh</code>.</td>
            </tr>
            </tr>
        </tbody>
    </table>
</div>


