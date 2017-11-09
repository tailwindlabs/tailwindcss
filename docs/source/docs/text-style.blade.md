---
extends: _layouts.documentation
title: "Style &amp; Decoration"
description: "Utilities for controlling the style of text."
features:
  responsive: true
  customizable: true
  hover: true
  focus: false
---

@include('_partials.work-in-progress')

<div class="border-t border-grey-lighter">
  <table class="w-full text-left" style="border-collapse: collapse;">
    <colgroup>
      <col class="w-1/5">
      <col class="w-2/5">
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
        <td class="p-2 border-t border-smoke font-mono text-xs text-purple-dark">.italic</td>
        <td class="p-2 border-t border-smoke font-mono text-xs text-blue-dark">font-style: italic;</td>
        <td class="p-2 border-t border-smoke text-sm text-grey-darker">Italicizes the text within an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.roman</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">font-style: normal;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Sets the text to roman (disables italics) within an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.uppercase</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">text-transform: uppercase;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Makes all text uppercase within an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.lowercase</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">text-transform: lowercase;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Makes all text lowercase within an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.capitalize</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">text-transform: capitalize;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Capitalizes the text within an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.normal-case</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">text-transform: none;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Disables any text transformations previously applied to an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.underline</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">text-decoration: underline;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Underlines the text within an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.line-through</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">text-decoration: line-through;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Adds a line through the text within an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.no-underline</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">text-decoration: none;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Disables any text decorations previously applied to an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark">.antialiased</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">
          -webkit-font-smoothing: antialiased;<br>
          -moz-osx-font-smoothing: grayscale;
        </td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Set the font smoothing of an element to antialiased.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.subpixel-antialiased</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark">
          -webkit-font-smoothing: auto;<br>
          -moz-osx-font-smoothing: auto;
        </td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Set the font smoothing of an element to subpixel antialiasing (the default).</td>
      </tr>
    </tbody>
  </table>
</div>

## Hover

In addition to the standard responsive variations, text style utilties also come in `hover:` variations that apply the given text style on hover.

@component('_partials.code-sample', ['class' => 'text-center'])
<a href="#" class="no-underline hover:underline text-blue text-lg">Link</a>
@endcomponent

Hover utilities can also be combined with responsive utilities by adding the responsive `{screen}:` prefix *before* the `hover:` prefix.

```html
<a href="#" class="... md:no-underline md:hover:underline ...">Link</a>
```
