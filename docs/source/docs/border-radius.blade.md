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
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.radius-sm</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">border-radius: .125rem;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Apply a small border radius to all corners of an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.radius-t-sm</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">border-top-left-radius: .125rem;<br>border-top-right-radius: .125rem;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Apply a small border radius to the top corners of an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.radius-r-sm</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">border-top-right-radius: .125rem;<br>border-bottom-right-radius: .125rem;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Apply a small border radius to the right corners of an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.radius-b-sm</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">border-bottom-right-radius: .125rem;<br>border-bottom-left-radius: .125rem;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Apply a small border radius to the bottom corners of an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.radius-l-sm</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">border-top-left-radius: .125rem;<br>border-bottom-left-radius: .125rem;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Apply a small border radius to the left corners of an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.radius-tl-sm</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">border-top-left-radius: .125rem;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Apply a small border radius to the top left corner of an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.radius-tr-sm</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">border-top-right-radius: .125rem;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Apply a small border radius to the top right corner of an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.radius-br-sm</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">border-bottom-right-radius: .125rem;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Apply a small border radius to the bottom right corner of an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.radius-bl-sm</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">border-bottom-left-radius: .125rem;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Apply a small border radius to the bottom left corner of an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.radius-md</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">border-radius: .25rem;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Apply a medium border radius to all corners of an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.radius-t-md</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">border-top-left-radius: .25rem;<br>border-top-right-radius: .25rem;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Apply a medium border radius to the top corners of an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.radius-r-md</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">border-top-right-radius: .25rem;<br>border-bottom-right-radius: .25rem;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Apply a medium border radius to the right corners of an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.radius-b-md</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">border-bottom-right-radius: .25rem;<br>border-bottom-left-radius: .25rem;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Apply a medium border radius to the bottom corners of an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.radius-l-md</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">border-top-left-radius: .25rem;<br>border-bottom-left-radius: .25rem;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Apply a medium border radius to the left corners of an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.radius-tl-md</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">border-top-left-radius: .25rem;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Apply a medium border radius to the top left corner of an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.radius-tr-md</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">border-top-right-radius: .25rem;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Apply a medium border radius to the top right corner of an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.radius-br-md</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">border-bottom-right-radius: .25rem;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Apply a medium border radius to the bottom right corner of an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.radius-bl-md</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">border-bottom-left-radius: .25rem;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Apply a medium border radius to the bottom left corner of an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.radius-lg</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">border-radius: .5rem;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Apply a large border radius to all corners of an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.radius-t-lg</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">border-top-left-radius: .5rem;<br>border-top-right-radius: .5rem;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Apply a large border radius to the top corners of an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.radius-r-lg</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">border-top-right-radius: .5rem;<br>border-bottom-right-radius: .5rem;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Apply a large border radius to the right corners of an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.radius-b-lg</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">border-bottom-right-radius: .5rem;<br>border-bottom-left-radius: .5rem;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Apply a large border radius to the bottom corners of an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.radius-l-lg</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">border-top-left-radius: .5rem;<br>border-bottom-left-radius: .5rem;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Apply a large border radius to the left corners of an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.radius-tl-lg</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">border-top-left-radius: .5rem;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Apply a large border radius to the top left corner of an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.radius-tr-lg</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">border-top-right-radius: .5rem;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Apply a large border radius to the top right corner of an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.radius-br-lg</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">border-bottom-right-radius: .5rem;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Apply a large border radius to the bottom right corner of an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.radius-bl-lg</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">border-bottom-left-radius: .5rem;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Apply a large border radius to the bottom left corner of an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.radius-full</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">border-radius: 9999px;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Fully round all corners of an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.radius-t-full</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">border-top-left-radius: 9999px;<br>border-top-right-radius: 9999px;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Fully round the top corners of an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.radius-r-full</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">border-top-right-radius: 9999px;<br>border-bottom-right-radius: 9999px;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Fully round the right corners of an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.radius-b-full</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">border-bottom-right-radius: 9999px;<br>border-bottom-left-radius: 9999px;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Fully round the bottom corners of an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.radius-l-full</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">border-top-left-radius: 9999px;<br>border-bottom-left-radius: 9999px;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Fully round the left corners of an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.radius-tl-full</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">border-top-left-radius: 9999px;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Fully round the top left corner of an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.radius-tr-full</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">border-top-right-radius: 9999px;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Fully round the top right corner of an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.radius-br-full</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">border-bottom-right-radius: 9999px;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Fully round the bottom right corner of an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.radius-bl-full</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">border-bottom-left-radius: 9999px;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Fully round the bottom left corner of an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.radius-none</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">border-radius: 0;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Remove any border radius from all corners of an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.radius-t-none</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">border-top-left-radius: 0;<br>border-top-right-radius: 0;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Remove any border radius from the top corners of an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.radius-r-none</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">border-top-right-radius: 0;<br>border-bottom-right-radius: 0;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Remove any border radius from the right corners of an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.radius-b-none</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">border-bottom-right-radius: 0;<br>border-bottom-left-radius: 0;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Remove any border radius from the bottom corners of an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.radius-l-none</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">border-top-left-radius: 0;<br>border-bottom-left-radius: 0;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Remove any border radius from the left corners of an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.radius-tl-none</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">border-top-left-radius: 0;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Remove any border radius from the top left corner of an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.radius-tr-none</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">border-top-right-radius: 0;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Remove any border radius from the top right corner of an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.radius-br-none</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">border-bottom-right-radius: 0;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Remove any border radius from the bottom right corner of an element.</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-purple-dark whitespace-no-wrap">.radius-bl-none</td>
        <td class="p-2 border-t border-smoke-light font-mono text-xs text-blue-dark whitespace-no-wrap">border-bottom-left-radius: 0;</td>
        <td class="p-2 border-t border-smoke-light text-sm text-grey-darker">Remove any border radius from the bottom left corner of an element.</td>
      </tr>
    </tbody>
  </table>
</div>

## Rounded corners

Use the `.radius-sm`, `.radius-md`, or `.radius-lg` utilities to apply different border radius sizes to an element.

@component('_partials.code-sample', ['class' => 'flex justify-around text-sm'])
<div class="bg-grey-light mr-3 p-4 radius-sm">.radius-sm</div>
<div class="bg-grey-light mr-3 p-4 radius-md">.radius-md</div>
<div class="bg-grey-light p-4 radius-lg">.radius-lg</div>
@slot('code')
<div class="radius-sm"></div>
<div class="radius-md"></div>
<div class="radius-lg"></div>
@endslot
@endcomponent

## Pills and circles

Use the `.radius-full` utility to create pills and circles.

@component('_partials.code-sample', ['class' => 'flex items-center justify-around text-sm'])
<div class="bg-grey-light mr-3 py-2 px-4 radius-full">Pill shape</div>
<div class="bg-grey-light h-16 w-16 radius-full flex items-center justify-center">Circle</div>
@slot('code')
<div class="radius-full py-2 px-4">Pill shape</div>
<div class="radius-full h-16 w-16 flex items-center justify-center">Circle</div>
@endslot
@endcomponent

## No rounding

Use `.radius-none` to remove an existing border radius from an element.

This is most commonly used to remove a border radius that was applied at a smaller breakpoint.

@component('_partials.code-sample', ['class' => 'flex justify-around text-sm py-8'])
<div class="p-4 radius-none bg-grey-light">.radius-none</div>
@slot('code')
<div class="radius-none"></div>
@endslot
@endcomponent

## Rounding sides separately

Use `.radius-{t|r|b|l}-{size}` to only round one side an element.

@component('_partials.code-sample', ['class' => 'flex justify-around text-sm'])
<div class="bg-grey-light mr-3 p-4 radius-t-lg">.radius-t-lg</div>
<div class="bg-grey-light mr-3 p-4 radius-r-lg">.radius-r-lg</div>
<div class="bg-grey-light mr-3 p-4 radius-b-lg">.radius-b-lg</div>
<div class="bg-grey-light p-4 radius-l-lg">.radius-l-lg</div>
@slot('code')
<div class="radius-t-lg"></div>
<div class="radius-r-lg"></div>
<div class="radius-b-lg"></div>
<div class="radius-l-lg"></div>
@endslot
@endcomponent

## Rounding corners separately

Use `.radius-{tl|tr|br|bl}-{size}` to only round one corner an element.

@component('_partials.code-sample', ['class' => 'flex justify-around text-sm'])
<div class="bg-grey-light mr-3 p-4 radius-tl-lg">.radius-tl-lg</div>
<div class="bg-grey-light mr-3 p-4 radius-tr-lg">.radius-tr-lg</div>
<div class="bg-grey-light mr-3 p-4 radius-br-lg">.radius-br-lg</div>
<div class="bg-grey-light p-4 radius-bl-lg">.radius-bl-lg</div>
@slot('code')
<div class="radius-tl-lg"></div>
<div class="radius-tr-lg"></div>
<div class="radius-br-lg"></div>
<div class="radius-bl-lg"></div>
@endslot
@endcomponent

## Responsive

To control the border radius of an element at a specific breakpoint, add a `{screen}:` prefix to any existing border radius utility. For example, use `md:radius-lg` to apply the `radius-lg` utility at only medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

@component('_partials.responsive-code-sample')
@slot('none')
<div class="flex justify-center">
  <div class="bg-grey w-12 h-12 radius-md"></div>
</div>
@endslot
@slot('sm')
<div class="flex justify-center">
  <div class="bg-grey w-12 h-12 radius-t-md"></div>
</div>
@endslot
@slot('md')
<div class="flex justify-center">
  <div class="bg-grey w-12 h-12 radius-b-lg"></div>
</div>
@endslot
@slot('lg')
<div class="flex justify-center">
  <div class="bg-grey w-12 h-12 radius-none"></div>
</div>
@endslot
@slot('xl')
<div class="flex justify-center">
  <div class="bg-grey w-12 h-12 radius-r-md"></div>
</div>
@endslot
@slot('code')
<div class="none:radius-md sm:radius-t-md md:radius-b-lg lg:radius-none xlradius-r-md ...">
  <!-- ... -->
</div>
@endslot
@endcomponent

## Customizing

By default Tailwind provides five border radius size utilities. You can change, add, or remove these by editing the `borderRadius` section of your Tailwind config.

Note that only the different border radius *sizes* can be customized; the utilities for controlling which side to round (like `.radius-t`) aren't customizable.

@component('_partials.customized-config', ['key' => 'borderRadius'])
  'none': '0',
- 'sm': '.125rem',
- 'md': '.25rem',
+ 'md': '4px',
- 'lg': '.5rem',
- 'full': '9999px',
+ 'large': '12px',
@endcomponent
