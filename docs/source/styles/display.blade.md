---
extends: _layouts.markdown
title: "Display"
---

# Display

<div class="text-xl text-slate-light mb-4">
    Utilities for controlling the box type of an element.
</div>

@include('_partials.feature-badges', [
    'responsive' => true,
    'customizable' => false,
    'hover' => false,
    'focus' => false
])

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
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.block</td>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">display: block;</td>
                <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Set the box type of the element to <code>block</code>.</td>
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
        </tbody>
    </table>
</div>

If you're looking for Flexbox utilities, please see the [Flexbox](/styles/flexbox) page.
