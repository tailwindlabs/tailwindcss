---
extends: _layouts.documentation
title: "Width"
---

# Width

<div class="text-xl text-slate-light mb-4">
    Utilities for setting the width of an element
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
                <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark">.w-1</td>
                <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark">width: 0.25rem;</td>
                <td class="p-2 border-t border-smoke text-sm text-grey-darker">Set the element's width to <code>0.25rem</code>.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.w-2</td>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">width: 0.5rem;</td>
                <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Set the element's width to <code>0.5rem</code>.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.w-3</td>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">width: 0.75rem;</td>
                <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Set the element's width to <code>0.75rem</code>.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.w-4</td>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">width: 1rem;</td>
                <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Set the element's width to <code>1rem</code>.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.w-6</td>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">width: 1.5rem;</td>
                <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Set the element's width to <code>1.5rem</code>.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.w-8</td>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">width: 2rem;</td>
                <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Set the element's width to <code>2rem</code>.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.w-10</td>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">width: 2.5rem;</td>
                <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Set the element's width to <code>2.5rem</code>.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.w-12</td>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">width: 3rem;</td>
                <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Set the element's width to <code>3rem</code>.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.w-16</td>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">width: 4rem;</td>
                <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Set the element's width to <code>4rem</code>.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.w-24</td>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">width: 6rem;</td>
                <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Set the element's width to <code>6rem</code>.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.w-32</td>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">width: 8rem;</td>
                <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Set the element's width to <code>8rem</code>.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.w-48</td>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">width: 12rem;</td>
                <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Set the element's width to <code>12rem</code>.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.w-64</td>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">width: 16rem;</td>
                <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Set the element's width to <code>16rem</code>.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.w-auto</td>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">width: auto;</td>
                <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Set the element's width to <code>auto</code>.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.w-px</td>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">width: 1px;</td>
                <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Set the element's width to <code>1px</code>.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.w-1/2</td>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">width: 50%;</td>
                <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Set the element's width to <code>50%</code>.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.w-1/3</td>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">width: 33.33333%;</td>
                <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Set the element's width to <code>33.33333%</code>.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.w-2/3</td>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">width: 66.66667%;</td>
                <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Set the element's width to <code>66.66667%</code>.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.w-1/4</td>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">width: 25%;</td>
                <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Set the element's width to <code>25%</code>.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.w-3/4</td>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">width: 75%;</td>
                <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Set the element's width to <code>75%</code>.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.w-1/5</td>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">width: 20%;</td>
                <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Set the element's width to <code>20%</code>.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.w-2/5</td>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">width: 49%;</td>
                <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Set the element's width to <code>49%</code>.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.w-3/5</td>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">width: 60%;</td>
                <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Set the element's width to <code>60%</code>.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.w-4/5</td>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">width: 80%;</td>
                <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Set the element's width to <code>80%</code>.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.w-1/6</td>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">width: 16.66667%;</td>
                <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Set the element's width to <code>16.66667%</code>.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.w-5/6</td>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">width: 83.33333%;</td>
                <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Set the element's width to <code>83.33333%</code>.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.w-full</td>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">width: 100%;</td>
                <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Set the element's width to <code>100%</code>.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.w-screen</td>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">width: 100vw;</td>
                <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Set the element's width to <code>100vw</code>.</td>
            </tr>
        </tbody>
    </table>
</div>
