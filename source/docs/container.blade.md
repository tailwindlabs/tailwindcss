---
extends: _layouts.documentation
title: "Container"
description: "A component for fixing an element's width to the current breakpoint."
---

@include('_partials.work-in-progress')

<div class="border-t border-grey-lighter">
  <table class="w-full text-left table-collapse">
    <colgroup>
      <col class="w-1/4">
      <col class="w-1/4">
      <col class="w-1/2">
    </colgroup>
    <thead>
      <tr>
        <th class="text-sm font-semibold text-grey-darker p-2 bg-grey-lightest">Class</th>
        <th class="text-sm font-semibold text-grey-darker p-2 bg-grey-lightest">Breakpoint</th>
        <th class="text-sm font-semibold text-grey-darker p-2 bg-grey-lightest">Properties</th>
      </tr>
    </thead>
    <tbody class="align-baseline">
      <tr>
        <td class="p-2 border-t border-grey-light font-mono text-xs text-purple-dark" rowspan="5">.container</td>
        <td class="p-2 border-t border-grey-light font-mono text-xs text-grey-dark"><span class="italic">None</span></td>
        <td class="p-2 border-t border-grey-light font-mono text-xs text-blue-dark">width: 100%;</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-grey-light font-mono text-xs text-grey-darker">sm <span class="text-grey-dark italic">(576px)</span></td>
        <td class="p-2 border-t border-grey-light font-mono text-xs text-blue-dark">max-width: 576px;</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-grey-light font-mono text-xs text-grey-darker">md <span class="text-grey-dark italic">(768px)</span></td>
        <td class="p-2 border-t border-grey-light font-mono text-xs text-blue-dark">max-width: 768px;</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-grey-light font-mono text-xs text-grey-darker">lg <span class="text-grey-dark italic">(992px)</span></td>
        <td class="p-2 border-t border-grey-light font-mono text-xs text-blue-dark">max-width: 992px;</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-grey-light font-mono text-xs text-grey-darker">xl <span class="text-grey-dark italic">(1200px)</span></td>
        <td class="p-2 border-t border-grey-light font-mono text-xs text-blue-dark">max-width: 1200px;</td>
      </tr>
    </tbody>
  </table>
</div>

Tailwind's `.container` class sets the `max-width` of an element to match the `min-width` of the current breakpoint.

Note that unlike containers you might have used in other frameworks, **Tailwind's container does not center itself automatically and does not contain any built-in horizontal padding.**

To center a container, use the `.mx-auto` utility:

```html
<div class="container mx-auto">
  <!-- ... -->
</div>
```

To add horizontal padding, use the `.px-{size}` utilities:

```html
<div class="container mx-auto px-4">
  <!-- ... -->
</div>
```
