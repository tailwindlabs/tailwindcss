---
extends: _layouts.documentation
title: "Scaling"
---

# Scaling

<div class="text-xl text-slate-light mb-4">
    Utilities for controlling the scaling of an element.
</div>

@include('_partials.feature-badges', [
    'responsive' => false,
    'customizable' => true,
    'hover' => false,
    'focus' => false
])

@include('_partials.work-in-progress')

Control an element's scaling using the `.scale-{side?}-{decimal}` utility.
For example, `.scale-1/2` would scale the element to 50%.

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
                <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark whitespace-no-wrap">.scale-0</td>
                <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark">transform: scale(0, 0);</td>
                <td class="p-2 border-t border-smoke text-sm text-grey-darker">Scale the element to 0%.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark whitespace-no-wrap">.scale-1/4</td>
                <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark">transform: scale(0.25, 0.25);</td>
                <td class="p-2 border-t border-smoke text-sm text-grey-darker">Scale the element to 25%.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark whitespace-no-wrap">.scale-1/3</td>
                <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark">transform: scale(0.33, 0.33);</td>
                <td class="p-2 border-t border-smoke text-sm text-grey-darker">Scale the element to 33%.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark whitespace-no-wrap">.scale-1/2</td>
                <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark">transform: scale(0.5, 0.5);</td>
                <td class="p-2 border-t border-smoke text-sm text-grey-darker">Scale the element to 50%.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark whitespace-no-wrap">.scale-2/3</td>
                <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark">transform: scale(0.66, 0.66);</td>
                <td class="p-2 border-t border-smoke text-sm text-grey-darker">Scale the element to 66%.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark whitespace-no-wrap">.scale-3/4</td>
                <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark">transform: scale(0.75, 0.75);</td>
                <td class="p-2 border-t border-smoke text-sm text-grey-darker">Scale the element to 75%.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark whitespace-no-wrap">.scale-1</td>
                <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark">transform: scale(1, 1);</td>
                <td class="p-2 border-t border-smoke text-sm text-grey-darker">Scale the element to 100%.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark whitespace-no-wrap">.scale-x-0</td>
                <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark">transform: scaleX(0);</td>
                <td class="p-2 border-t border-smoke text-sm text-grey-darker">Scale the element to 0%.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark whitespace-no-wrap">.scale-x-1/4</td>
                <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark">transform: scaleX(0.25);</td>
                <td class="p-2 border-t border-smoke text-sm text-grey-darker">Scale the element to 25%.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark whitespace-no-wrap">.scale-x-1/3</td>
                <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark">transform: scaleX(0.33);</td>
                <td class="p-2 border-t border-smoke text-sm text-grey-darker">Scale the element to 33%.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark whitespace-no-wrap">.scale-x-1/2</td>
                <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark">transform: scaleX(0.5);</td>
                <td class="p-2 border-t border-smoke text-sm text-grey-darker">Scale the element to 50%.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark whitespace-no-wrap">.scale-x-2/3</td>
                <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark">transform: scaleX(0.66);</td>
                <td class="p-2 border-t border-smoke text-sm text-grey-darker">Scale the element to 66%.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark whitespace-no-wrap">.scale-x-3/4</td>
                <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark">transform: scaleX(0.75);</td>
                <td class="p-2 border-t border-smoke text-sm text-grey-darker">Scale the element to 75%.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark whitespace-no-wrap">.scale-x-1</td>
                <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark">transform: scaleX(1);</td>
                <td class="p-2 border-t border-smoke text-sm text-grey-darker">Scale the element to 100%.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark whitespace-no-wrap">.scale-y-0</td>
                <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark">transform: scaleY(0);</td>
                <td class="p-2 border-t border-smoke text-sm text-grey-darker">Scale the element to 0%.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark whitespace-no-wrap">.scale-y-1/4</td>
                <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark">transform: scaleY(0.25);</td>
                <td class="p-2 border-t border-smoke text-sm text-grey-darker">Scale the element to 25%.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark whitespace-no-wrap">.scale-y-1/3</td>
                <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark">transform: scaleY(0.33);</td>
                <td class="p-2 border-t border-smoke text-sm text-grey-darker">Scale the element to 33%.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark whitespace-no-wrap">.scale-y-1/2</td>
                <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark">transform: scaleY(0.5);</td>
                <td class="p-2 border-t border-smoke text-sm text-grey-darker">Scale the element to 50%.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark whitespace-no-wrap">.scale-y-2/3</td>
                <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark">transform: scaleY(0.66);</td>
                <td class="p-2 border-t border-smoke text-sm text-grey-darker">Scale the element to 66%.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark whitespace-no-wrap">.scale-y-3/4</td>
                <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark">transform: scaleY(0.75);</td>
                <td class="p-2 border-t border-smoke text-sm text-grey-darker">Scale the element to 75%.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark whitespace-no-wrap">.scale-y-1</td>
                <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark">transform: scaleY(1);</td>
                <td class="p-2 border-t border-smoke text-sm text-grey-darker">Scale the element to 100%.</td>
            </tr>
        </tbody>
    </table>
</div>
