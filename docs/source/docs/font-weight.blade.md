---
extends: _layouts.documentation
title: "Font Weight"
---

# Font Weight

<div class="text-xl text-slate-light mb-4">
    Utilities for controlling the font weight of an element.
</div>

@include('_partials.feature-badges', [
    'responsive' => true,
    'customizable' => true,
    'hover' => false,
    'focus' => false
])

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
                <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark whitespace-no-wrap">.font-hairline</td>
                <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark">font-weight: 100;</td>
                <td class="p-2 border-t border-smoke text-sm text-grey-darker">Set the font weight of an element to hairline.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.font-thin</td>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">font-weight: 200;</td>
                <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Set the font weight of an element to thin.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.font-light</td>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">font-weight: 300;</td>
                <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Set the font weight of an element to light.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.font-normal</td>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">font-weight: 400;</td>
                <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Set the font weight of an element to normal.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.font-medium</td>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">font-weight: 500;</td>
                <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Set the font weight of an element to medium.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.font-semibold</td>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">font-weight: 600;</td>
                <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Set the font weight of an element to semibold.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.font-bold</td>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">font-weight: 700;</td>
                <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Set the font weight of an element to bold.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.font-extrabold</td>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">font-weight: 800;</td>
                <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Set the font weight of an element to extrabold.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.font-black</td>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">font-weight: 900;</td>
                <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Set the font weight of an element to black.</td>
            </tr>
        </tbody>
    </table>
</div>
