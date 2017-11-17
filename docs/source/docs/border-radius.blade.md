---
extends: _layouts.documentation
title: "Border Radius"
description: "Utilities for controlling the border radius of an element."
features:
  responsive: true
  customizable: true
  hover: false
  focus: false
---

<div class="border-t border-grey-lighter">
  <table class="w-full text-left table-collapse">
    <thead>
      <tr>
        <th class="text-sm font-semibold text-grey-darker p-2 bg-grey-lightest">Class</th>
        <th class="text-sm font-semibold text-grey-darker p-2 bg-grey-lightest">Properties</th>
        <th class="text-sm font-semibold text-grey-darker p-2 bg-grey-lightest">Description</th>
      </tr>
    </thead>
    <tbody class="align-baseline">
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.rounded-sm</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">border-radius: .125rem;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Apply a small border radius to all corners of an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.rounded-t-sm</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">border-top-left-radius: .125rem;<br>border-top-right-radius: .125rem;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Apply a small border radius to the top corners of an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.rounded-r-sm</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">border-top-right-radius: .125rem;<br>border-bottom-right-radius: .125rem;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Apply a small border radius to the right corners of an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.rounded-b-sm</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">border-bottom-right-radius: .125rem;<br>border-bottom-left-radius: .125rem;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Apply a small border radius to the bottom corners of an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.rounded-l-sm</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">border-top-left-radius: .125rem;<br>border-bottom-left-radius: .125rem;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Apply a small border radius to the left corners of an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.rounded-tl-sm</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">border-top-left-radius: .125rem;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Apply a small border radius to the top left corner of an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.rounded-tr-sm</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">border-top-right-radius: .125rem;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Apply a small border radius to the top right corner of an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.rounded-br-sm</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">border-bottom-right-radius: .125rem;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Apply a small border radius to the bottom right corner of an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.rounded-bl-sm</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">border-bottom-left-radius: .125rem;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Apply a small border radius to the bottom left corner of an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.rounded</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">border-radius: .25rem;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Apply a medium border radius to all corners of an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.rounded-t</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">border-top-left-radius: .25rem;<br>border-top-right-radius: .25rem;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Apply a medium border radius to the top corners of an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.rounded-r</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">border-top-right-radius: .25rem;<br>border-bottom-right-radius: .25rem;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Apply a medium border radius to the right corners of an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.rounded-b</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">border-bottom-right-radius: .25rem;<br>border-bottom-left-radius: .25rem;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Apply a medium border radius to the bottom corners of an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.rounded-l</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">border-top-left-radius: .25rem;<br>border-bottom-left-radius: .25rem;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Apply a medium border radius to the left corners of an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.rounded-tl</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">border-top-left-radius: .25rem;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Apply a medium border radius to the top left corner of an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.rounded-tr</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">border-top-right-radius: .25rem;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Apply a medium border radius to the top right corner of an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.rounded-br</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">border-bottom-right-radius: .25rem;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Apply a medium border radius to the bottom right corner of an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.rounded-bl</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">border-bottom-left-radius: .25rem;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Apply a medium border radius to the bottom left corner of an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.rounded-lg</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">border-radius: .5rem;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Apply a large border radius to all corners of an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.rounded-t-lg</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">border-top-left-radius: .5rem;<br>border-top-right-radius: .5rem;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Apply a large border radius to the top corners of an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.rounded-r-lg</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">border-top-right-radius: .5rem;<br>border-bottom-right-radius: .5rem;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Apply a large border radius to the right corners of an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.rounded-b-lg</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">border-bottom-right-radius: .5rem;<br>border-bottom-left-radius: .5rem;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Apply a large border radius to the bottom corners of an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.rounded-l-lg</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">border-top-left-radius: .5rem;<br>border-bottom-left-radius: .5rem;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Apply a large border radius to the left corners of an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.rounded-tl-lg</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">border-top-left-radius: .5rem;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Apply a large border radius to the top left corner of an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.rounded-tr-lg</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">border-top-right-radius: .5rem;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Apply a large border radius to the top right corner of an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.rounded-br-lg</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">border-bottom-right-radius: .5rem;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Apply a large border radius to the bottom right corner of an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.rounded-bl-lg</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">border-bottom-left-radius: .5rem;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Apply a large border radius to the bottom left corner of an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.rounded-full</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">border-radius: 9999px;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Fully round all corners of an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.rounded-t-full</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">border-top-left-radius: 9999px;<br>border-top-right-radius: 9999px;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Fully round the top corners of an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.rounded-r-full</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">border-top-right-radius: 9999px;<br>border-bottom-right-radius: 9999px;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Fully round the right corners of an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.rounded-b-full</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">border-bottom-right-radius: 9999px;<br>border-bottom-left-radius: 9999px;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Fully round the bottom corners of an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.rounded-l-full</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">border-top-left-radius: 9999px;<br>border-bottom-left-radius: 9999px;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Fully round the left corners of an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.rounded-tl-full</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">border-top-left-radius: 9999px;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Fully round the top left corner of an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.rounded-tr-full</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">border-top-right-radius: 9999px;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Fully round the top right corner of an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.rounded-br-full</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">border-bottom-right-radius: 9999px;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Fully round the bottom right corner of an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.rounded-bl-full</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">border-bottom-left-radius: 9999px;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Fully round the bottom left corner of an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.rounded-none</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">border-radius: 0;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Remove any border radius from all corners of an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.rounded-t-none</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">border-top-left-radius: 0;<br>border-top-right-radius: 0;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Remove any border radius from the top corners of an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.rounded-r-none</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">border-top-right-radius: 0;<br>border-bottom-right-radius: 0;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Remove any border radius from the right corners of an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.rounded-b-none</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">border-bottom-right-radius: 0;<br>border-bottom-left-radius: 0;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Remove any border radius from the bottom corners of an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.rounded-l-none</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">border-top-left-radius: 0;<br>border-bottom-left-radius: 0;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Remove any border radius from the left corners of an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.rounded-tl-none</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">border-top-left-radius: 0;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Remove any border radius from the top left corner of an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.rounded-tr-none</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">border-top-right-radius: 0;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Remove any border radius from the top right corner of an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.rounded-br-none</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">border-bottom-right-radius: 0;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Remove any border radius from the bottom right corner of an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.rounded-bl-none</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">border-bottom-left-radius: 0;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Remove any border radius from the bottom left corner of an element.</td>
      </tr>
    </tbody>
  </table>
</div>

## Rounded corners

Use the `.rounded-sm`, `.rounded`, or `.rounded-lg` utilities to apply different border radius sizes to an element.

@component('_partials.code-sample', ['class' => 'flex justify-around text-sm'])
<div class="bg-grey-light mr-3 p-4 rounded-sm">.rounded-sm</div>
<div class="bg-grey-light mr-3 p-4 rounded">.rounded</div>
<div class="bg-grey-light p-4 rounded-lg">.rounded-lg</div>
@slot('code')
<div class="rounded-sm"></div>
<div class="rounded"></div>
<div class="rounded-lg"></div>
@endslot
@endcomponent

## Pills and circles

Use the `.rounded-full` utility to create pills and circles.

@component('_partials.code-sample', ['class' => 'flex items-center justify-around text-sm'])
<div class="bg-grey-light mr-3 py-2 px-4 rounded-full">Pill shape</div>
<div class="bg-grey-light h-16 w-16 rounded-full flex items-center justify-center">Circle</div>
@slot('code')
<div class="rounded-full py-2 px-4">Pill shape</div>
<div class="rounded-full h-16 w-16 flex items-center justify-center">Circle</div>
@endslot
@endcomponent

## No rounding

Use `.rounded-none` to remove an existing border radius from an element.

This is most commonly used to remove a border radius that was applied at a smaller breakpoint.

@component('_partials.code-sample', ['class' => 'flex justify-around text-sm py-8'])
<div class="p-4 rounded-none bg-grey-light">.rounded-none</div>
@slot('code')
<div class="rounded-none"></div>
@endslot
@endcomponent

## Rounding sides separately

Use `.rounded-{t|r|b|l}{-size?}` to only round one side an element.

@component('_partials.code-sample', ['class' => 'flex justify-around text-sm'])
<div class="bg-grey-light mr-3 p-4 rounded-t-lg">.rounded-t-lg</div>
<div class="bg-grey-light mr-3 p-4 rounded-r-lg">.rounded-r-lg</div>
<div class="bg-grey-light mr-3 p-4 rounded-b-lg">.rounded-b-lg</div>
<div class="bg-grey-light p-4 rounded-l-lg">.rounded-l-lg</div>
@slot('code')
<div class="rounded-t-lg"></div>
<div class="rounded-r-lg"></div>
<div class="rounded-b-lg"></div>
<div class="rounded-l-lg"></div>
@endslot
@endcomponent

## Rounding corners separately

Use `.rounded-{tl|tr|br|bl}{-size?}` to only round one corner an element.

@component('_partials.code-sample', ['class' => 'flex justify-around text-sm'])
<div class="bg-grey-light mr-3 p-4 rounded-tl-lg">.rounded-tl-lg</div>
<div class="bg-grey-light mr-3 p-4 rounded-tr-lg">.rounded-tr-lg</div>
<div class="bg-grey-light mr-3 p-4 rounded-br-lg">.rounded-br-lg</div>
<div class="bg-grey-light p-4 rounded-bl-lg">.rounded-bl-lg</div>
@slot('code')
<div class="rounded-tl-lg"></div>
<div class="rounded-tr-lg"></div>
<div class="rounded-br-lg"></div>
<div class="rounded-bl-lg"></div>
@endslot
@endcomponent

## Responsive

To control the border radius of an element at a specific breakpoint, add a `{screen}:` prefix to any existing border radius utility. For example, use `md:rounded-lg` to apply the `rounded-lg` utility at only medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

@component('_partials.responsive-code-sample')
@slot('none')
<div class="flex justify-center">
  <div class="bg-grey w-12 h-12 rounded"></div>
</div>
@endslot
@slot('sm')
<div class="flex justify-center">
  <div class="bg-grey w-12 h-12 rounded-t"></div>
</div>
@endslot
@slot('md')
<div class="flex justify-center">
  <div class="bg-grey w-12 h-12 rounded-b-lg"></div>
</div>
@endslot
@slot('lg')
<div class="flex justify-center">
  <div class="bg-grey w-12 h-12 rounded-none"></div>
</div>
@endslot
@slot('xl')
<div class="flex justify-center">
  <div class="bg-grey w-12 h-12 rounded-r"></div>
</div>
@endslot
@slot('code')
<div class="none:rounded sm:rounded-t md:rounded-b-lg lg:rounded-none xl:rounded-r ...">
  <!-- ... -->
</div>
@endslot
@endcomponent

## Customizing

By default Tailwind provides five border radius size utilities. You can change, add, or remove these by editing the `borderRadius` section of your Tailwind config.

Note that only the different border radius *sizes* can be customized; the utilities for controlling which side to round (like `.rounded-t`) aren't customizable.

@component('_partials.customized-config', ['key' => 'borderRadius'])
  'none': '0',
- 'sm': '.125rem',
- default: '.25rem',
+ default: '4px',
- 'lg': '.5rem',
- 'full': '9999px',
+ 'large': '12px',
@endcomponent
