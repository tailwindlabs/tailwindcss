---
extends: _layouts.documentation
title: "Height"
---

# Height

<div class="text-xl text-slate-light mb-4">
    Utilities for setting the height of an element
</div>

@include('_partials.feature-badges', [
    'responsive' => true,
    'customizable' => true,
    'hover' => false,
    'focus' => false
])

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
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.h-1</td>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">height: 0.25rem;</td>
                <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Set the element's height to <code>0.25rem</code>.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.h-2</td>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">height: 0.5rem;</td>
                <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Set the element's height to <code>0.5rem</code>.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.h-3</td>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">height: 0.75rem;</td>
                <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Set the element's height to <code>0.75rem</code>.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.h-4</td>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">height: 1rem;</td>
                <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Set the element's height to <code>1rem</code>.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.h-6</td>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">height: 1.5rem;</td>
                <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Set the element's height to <code>1.5rem</code>.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.h-8</td>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">height: 2rem;</td>
                <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Set the element's height to <code>2rem</code>.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.h-10</td>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">height: 2.5rem;</td>
                <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Set the element's height to <code>2.5rem</code>.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.h-12</td>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">height: 3rem;</td>
                <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Set the element's height to <code>3rem</code>.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.h-16</td>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">height: 4rem;</td>
                <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Set the element's height to <code>4rem</code>.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.h-24</td>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">height: 6rem;</td>
                <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Set the element's height to <code>6rem</code>.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.h-32</td>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">height: 8rem;</td>
                <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Set the element's height to <code>8rem</code>.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.h-48</td>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">height: 12rem;</td>
                <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Set the element's height to <code>12rem</code>.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.h-64</td>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">height: 16rem;</td>
                <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Set the element's height to <code>16rem</code>.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.h-auto</td>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">height: auto;</td>
                <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Set the element's height to <code>auto</code>.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.h-px</td>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">height: 1px;</td>
                <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Set the element's height to <code>1px</code>.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.h-full</td>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">height: 100%;</td>
                <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Set the element's height to <code>100%</code>.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.h-screen</td>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">height: 100vh</td>
                <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Set the element's height to <code>100vh</code>.</td>
            </tr>
        </tbody>
    </table>
</div>
