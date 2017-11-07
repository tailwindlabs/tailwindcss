---
extends: _layouts.documentation
title: "Text Color"
description: "Utilities for controlling the text color of an element."
---

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
                    <td class="p-2 border-t {{ $loop->first ? 'border-smoke' : 'border-smoke-light' }} font-mono text-xs text-purple-dark whitespace-no-wrap">.text-{{ $name }}</td>
                    <td class="p-2 border-t {{ $loop->first ? 'border-smoke' : 'border-smoke-light' }} font-mono text-xs text-blue-dark whitespace-no-wrap">color: {{ $value }};</td>
                    <td class="p-2 border-t {{ $loop->first ? 'border-smoke' : 'border-smoke-light' }} text-sm text-grey-darker">Set the text color of an element to {{ implode(' ', array_reverse(explode('-', $name))) }}.</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</div>

## Hover

In addition to the standard responsive variations, text colors also come in `hover:` variations that apply the given text color on hover.

@component('_partials.code-sample', ['class' => 'text-center'])
<button class="text-blue-dark hover:text-red-dark border-2 border-blue hover:border-red bg-transparent py-2 px-4 font-semibold rounded">
    Button
</button>
@endcomponent

Hover utilities can also be combined with responsive utilities by adding the responsive `{screen}:` prefix *before* the `hover:` prefix.

```html
<button class="... md:text-blue md:hover:text-red ...">Button</button>
```
