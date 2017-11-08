---
extends: _layouts.documentation
title: "Background Color"
description: "Utilities for controlling an element's background color."
features:
  responsive: true
  customizable: true
  hover: true
  focus: false
---

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
                    <td class="p-2 border-t {{ $loop->first ? 'border-smoke' : 'border-smoke-light' }} font-mono text-xs text-purple-dark">.bg-{{ $name }}</td>
                    <td class="p-2 border-t {{ $loop->first ? 'border-smoke' : 'border-smoke-light' }} font-mono text-xs text-blue-dark">color: {{ $value }};</td>
                    <td class="p-2 border-t {{ $loop->first ? 'border-smoke' : 'border-smoke-light' }} text-sm text-grey-darker">Set the background color of an element to {{ implode(' ', array_reverse(explode('-', $name))) }}.</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</div>

## Hover

In addition to the standard responsive variations, background colors also come in `hover:` variations that apply the given background color on hover.

@component('_partials.code-sample')
<div class="bg-blue hover:bg-purple text-center text-white font-semibold mx-auto px-4 py-2">
  Hover over this element
</div>
@endcomponent

Hover utilities can also be combined with responsive utilities by adding the responsive `{screen}:` prefix *before* the `hover:` prefix.

```html
<button class="... md:bg-orange md:hover:bg-red ...">Button</button>
```
