---
extends: _layouts.documentation
title: "Letter Spacing"
---

# Letter Spacing

<div class="text-xl text-slate-light mb-4">
    Utilities for controlling the tracking (letter spacing) of an element.
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
                <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark whitespace-no-wrap">.tracking-tight</td>
                <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark">letter-spacing: -0.05em;</td>
                <td class="p-2 border-t border-smoke text-sm text-grey-darker">Set the letter spacing of an element to <code>-0.05em</code>.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.tracking-normal</td>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">letter-spacing: 0;</td>
                <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Set the letter spacing of an element to <code>0</code>.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.tracking-wide</td>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">letter-spacing: 0.05em;</td>
                <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Set the letter spacing of an element to <code>0.05em</code>.</td>
            </tr>
        </tbody>
    </table>
</div>
