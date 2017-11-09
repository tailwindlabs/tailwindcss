---
extends: _layouts.documentation
title: "Vertical Alignment"
description: "Utilities for controlling the vertical alignment of an inline or table-cell box."
features:
  responsive: true
  customizable: false
  hover: false
  focus: false
---

@include('_partials.work-in-progress')

<div class="border-t border-grey-lighter">
    <table class="w-full text-left table-collapse">
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
                <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark">.align-baseline</td>
                <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark">vertical-align: baseline;</td>
                <td class="p-2 border-t border-smoke text-sm text-grey-darker">Align the baseline of an element with the baseline of its parent.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.align-top</td>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">vertical-align: top;</td>
                <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Align the top of an element and its descendants with the top of the entire line.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.align-middle</td>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">vertical-align: middle;</td>
                <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Align the middle of an element with the baseline plus half the x-height of the parent.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.align-bottom</td>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">vertical-align: bottom;</td>
                <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Align the bottom of an element and its descendants with the bottom of the entire line.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.align-text-top</td>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">vertical-align: text-top;</td>
                <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Align the top of an element with the top of the parent element's font.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.align-text-bottom</td>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">vertical-align: text-bottom;</td>
                <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Align the bottom of an element with the bottom of the parent element's font.</td>
            </tr>
        </tbody>
    </table>
</div>
