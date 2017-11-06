---
extends: _layouts.documentation
title: "Rotations"
---

# Rotations

<div class="text-xl text-slate-light mb-4">
    Utilities for controlling the rotation of an element.
</div>

@include('_partials.feature-badges', [
    'responsive' => false,
    'customizable' => true,
    'hover' => false,
    'focus' => false
])

@include('_partials.work-in-progress')

Control an element's rotation using the `.rotate-{side}-{degrees?}` utility.
For example, `.rotate-x-180` would rotate the element 180 degrees horizontally.

**Note: The X and Y axis are swapped as they represent horizontal and vertical instead of the three-dimensional axis.**

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
                <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark whitespace-no-wrap">.rotate-x</td>
                <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark">transform: rotateY(180deg);</td>
                <td class="p-2 border-t border-smoke text-sm text-grey-darker">Rotate the element 180 degrees horizontally.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark whitespace-no-wrap">.rotate-y</td>
                <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark">transform: rotateX(180deg);</td>
                <td class="p-2 border-t border-smoke text-sm text-grey-darker">Rotate the element 180 degrees vertically.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark whitespace-no-wrap">.rotate-z</td>
                <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark">transform: rotateZ(180deg);</td>
                <td class="p-2 border-t border-smoke text-sm text-grey-darker">Rotate the element 180 degrees along its Z axis.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark whitespace-no-wrap">.rotate-x-0</td>
                <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark">transform: rotateY(0deg);</td>
                <td class="p-2 border-t border-smoke text-sm text-grey-darker">Rotate the element 0 degrees horizontally.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark whitespace-no-wrap">.rotate-y-0</td>
                <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark">transform: rotateX(0deg);</td>
                <td class="p-2 border-t border-smoke text-sm text-grey-darker">Rotate the element 0 degrees vertically.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark whitespace-no-wrap">.rotate-z-0</td>
                <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark">transform: rotateZ(0deg);</td>
                <td class="p-2 border-t border-smoke text-sm text-grey-darker">Rotate the element 0 degrees along its Z axis.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark whitespace-no-wrap">.rotate-x-45</td>
                <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark">transform: rotateY(45deg);</td>
                <td class="p-2 border-t border-smoke text-sm text-grey-darker">Rotate the element 45 degrees horizontally.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark whitespace-no-wrap">.rotate-y-45</td>
                <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark">transform: rotateX(45deg);</td>
                <td class="p-2 border-t border-smoke text-sm text-grey-darker">Rotate the element 45 degrees vertically.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark whitespace-no-wrap">.rotate-z-45</td>
                <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark">transform: rotateZ(45deg);</td>
                <td class="p-2 border-t border-smoke text-sm text-grey-darker">Rotate the element 45 degrees along its Z axis.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark whitespace-no-wrap">.rotate-x-90</td>
                <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark">transform: rotateY(90deg);</td>
                <td class="p-2 border-t border-smoke text-sm text-grey-darker">Rotate the element 90 degrees horizontally.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark whitespace-no-wrap">.rotate-y-90</td>
                <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark">transform: rotateX(90deg);</td>
                <td class="p-2 border-t border-smoke text-sm text-grey-darker">Rotate the element 90 degrees vertically.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark whitespace-no-wrap">.rotate-z-90</td>
                <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark">transform: rotateZ(90deg);</td>
                <td class="p-2 border-t border-smoke text-sm text-grey-darker">Rotate the element 90 degrees along its Z axis.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark whitespace-no-wrap">.rotate-x-180</td>
                <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark">transform: rotateY(180deg);</td>
                <td class="p-2 border-t border-smoke text-sm text-grey-darker">Rotate the element 180 degrees horizontally.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark whitespace-no-wrap">.rotate-y-180</td>
                <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark">transform: rotateX(180deg);</td>
                <td class="p-2 border-t border-smoke text-sm text-grey-darker">Rotate the element 180 degrees vertically.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark whitespace-no-wrap">.rotate-z-180</td>
                <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark">transform: rotateZ(180deg);</td>
                <td class="p-2 border-t border-smoke text-sm text-grey-darker">Rotate the element 180 degrees along its Z axis.</td>
            </tr>
        </tbody>
    </table>
</div>
