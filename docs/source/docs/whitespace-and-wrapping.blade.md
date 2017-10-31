---
extends: _layouts.documentation
title: "Whitespace & Wrapping"
---

# Whitespace & Wrapping

<div class="text-xl text-slate-light mb-4">
    Utilities for controlling the whitespace and wrapping of an element.
</div>

@include('_partials.feature-badges', [
    'responsive' => true,
    'customizable' => true,
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
                <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark whitespace-no-wrap">.whitespace-normal</td>
                <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark whitespace-no-wrap">white-space: normal;</td>
                <td class="p-2 border-t border-smoke text-sm text-grey-darker">Cause text to wrap normally within an element.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark whitespace-no-wrap">.whitespace-no-wrap</td>
                <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark whitespace-no-wrap">white-space: nowrap;</td>
                <td class="p-2 border-t border-smoke text-sm text-grey-darker">Prevent text from wrapping within an element.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark whitespace-no-wrap">.whitespace-pre</td>
                <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark whitespace-no-wrap">white-space: pre;</td>
                <td class="p-2 border-t border-smoke text-sm text-grey-darker">Preserve line returns and spaces within an element.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark whitespace-no-wrap">.whitespace-pre-line</td>
                <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark whitespace-no-wrap">white-space: pre-line;</td>
                <td class="p-2 border-t border-smoke text-sm text-grey-darker">Preserve line returns but not spaces within an element.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark whitespace-no-wrap">.whitespace-pre-wrap</td>
                <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark whitespace-no-wrap">white-space: pre-wrap;</td>
                <td class="p-2 border-t border-smoke text-sm text-grey-darker">Preserve spaces but not line returns within an element.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark whitespace-no-wrap">.break-words</td>
                <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark whitespace-no-wrap">word-wrap: break-word;</td>
                <td class="p-2 border-t border-smoke text-sm text-grey-darker">Allow unbreakable words to be broken within an element.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark whitespace-no-wrap">.break-normal</td>
                <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark whitespace-no-wrap">word-wrap: normal;</td>
                <td class="p-2 border-t border-smoke text-sm text-grey-darker">Break words only at allowed break points within an element.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark whitespace-no-wrap">.truncate</td>
                <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark whitespace-no-wrap">
                    overflow: hidden;<br>
                    text-overflow: ellipsis;<br>
                    white-space: nowrap;<br>
                </td>
                <td class="p-2 border-t border-smoke text-sm text-grey-darker">Cause overflowing text within an element get to truncated with an ellipsis (<code>…</code>) if required.</td>
            </tr>
        </tbody>
    </table>
</div>
