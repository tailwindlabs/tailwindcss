---
extends: _layouts.documentation
title: "Style & Decoration"
---

# Style & Decoration

<div class="text-xl text-slate-light mb-4">
    Utilities for controlling the text style of an element.
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
            <col class="w-2/5">
            <col class="w-2/5">
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
                <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark whitespace-no-wrap">.italic</td>
                <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark whitespace-no-wrap">font-style: italic;</td>
                <td class="p-2 border-t border-smoke text-sm text-grey-darker">Italicizes the text within an element.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark whitespace-no-wrap">.roman</td>
                <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark whitespace-no-wrap">font-style: normal;</td>
                <td class="p-2 border-t border-smoke text-sm text-grey-darker">Sets the text to roman (disables italics) within an element.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark whitespace-no-wrap">.uppercase</td>
                <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark whitespace-no-wrap">text-transform: uppercase;</td>
                <td class="p-2 border-t border-smoke text-sm text-grey-darker">Makes all text uppercase within an element.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark whitespace-no-wrap">.lowercase</td>
                <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark whitespace-no-wrap">text-transform: lowercase;</td>
                <td class="p-2 border-t border-smoke text-sm text-grey-darker">Makes all text lowercase within an element.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark whitespace-no-wrap">.capitalize</td>
                <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark whitespace-no-wrap">text-transform: capitalize;</td>
                <td class="p-2 border-t border-smoke text-sm text-grey-darker">Capitalizes the text within an element.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark whitespace-no-wrap">.normal-case</td>
                <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark whitespace-no-wrap">text-transform: none;</td>
                <td class="p-2 border-t border-smoke text-sm text-grey-darker">Disables any text transformations previously applied to an element.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark whitespace-no-wrap">.underline</td>
                <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark whitespace-no-wrap">text-decoration: underline;</td>
                <td class="p-2 border-t border-smoke text-sm text-grey-darker">Underlines the text within an element.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark whitespace-no-wrap">.line-through</td>
                <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark whitespace-no-wrap">text-decoration: line-through;</td>
                <td class="p-2 border-t border-smoke text-sm text-grey-darker">Adds a line through the text within an element.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark whitespace-no-wrap">.no-underline</td>
                <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark whitespace-no-wrap">text-decoration: none;</td>
                <td class="p-2 border-t border-smoke text-sm text-grey-darker">Disables any text decorations previously applied to an element.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark whitespace-no-wrap">.antialiased</td>
                <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark whitespace-no-wrap">
                    -webkit-font-smoothing: antialiased;<br>
                    -moz-osx-font-smoothing: grayscale;
                </td>
                <td class="p-2 border-t border-smoke text-sm text-grey-darker">Set the font smoothing of an element to antialiased.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark whitespace-no-wrap">.subpixel-antialiased</td>
                <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark whitespace-no-wrap">
                    -webkit-font-smoothing: auto;<br>
                    -moz-osx-font-smoothing: auto;
                </td>
                <td class="p-2 border-t border-smoke text-sm text-grey-darker">Set the font smoothing of an element to subpixel antialiasing (the default).</td>
            </tr>
        </tbody>
    </table>
</div>
