---
extends: _layouts.documentation
title: "Background Size"
---

# Background Size

<div class="text-xl text-slate-light mb-4">
    Utilities for controlling the background size of an element's background image.
</div>

@include('_partials.feature-badges', [
    'responsive' => true,
    'customizable' => false,
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
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.bg-cover</td>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">background-position: cover</td>
                <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Scale the image until it fills the background layer</td>
            </tr>
            <tr>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.bg-contain</td>
                <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">background-position: contain</td>
                <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Scale the image to the outer edges without cropping or stretching</td>
            </tr>
        </tbody>
    </table>
</div>
