---
extends: _layouts.documentation
title: "Backgrounds"
---

# Background Color

<div class="text-xl text-slate-light mb-4">
    Utilities for controlling an element's background color.
</div>

@include('_partials.feature-badges', [
    'responsive' => true,
    'customizable' => true,
    'hover' => true,
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
            @foreach ($page->config['colors'] as $name => $value)
                <tr>
                    <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark">.bg-{{ $name }}</td>
                    <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark">color: {{ $value }};</td>
                    <td class="p-2 border-t border-smoke text-sm text-grey-darker">Set the background color of an element to {{ implode(' ', array_reverse(explode('-', $name))) }}.</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</div>
