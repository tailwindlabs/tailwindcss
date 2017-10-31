---
extends: _layouts.documentation
title: "Font Families"
---

# Font Families

<div class="text-xl text-slate-light mb-4">
    Utilities for controlling the font family of an element.
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
                <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark whitespace-no-wrap">.font-sans</td>
                <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark">font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue;</td>
                <td class="p-2 border-t border-smoke text-sm text-grey-darker">Set the font family to the sans font stack.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark whitespace-no-wrap">.font-serif</td>
                <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark">font-family: Constantia, Lucida Bright, Lucidabright, Lucida Serif, Lucida, DejaVu Serif, Bitstream Vera Serif, Liberation Serif, Georgia, serif;</td>
                <td class="p-2 border-t border-smoke text-sm text-grey-darker">Set the font family to the serif font stack.</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark whitespace-no-wrap">.font-mono</td>
                <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark">font-family: Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace;</td>
                <td class="p-2 border-t border-smoke text-sm text-grey-darker">Set the font family to the mono font stack.</td>
            </tr>
        </tbody>
    </table>
</div>
