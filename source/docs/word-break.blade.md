---
extends: _layouts.documentation
title: "Word Break"
description: "Utilities for controlling word breaks in an element."
---

@include('_partials.class-table', [
  'rows' => [
    [
      '.break-normal',
      "word-break: normal;\noverflow-wrap: normal",
      'Only add line breaks at normal word break points.',
    ],
    [
      '.break-words',
      'overflow-wrap: break-word;',
      'Add line breaks mid-word if needed.',
    ],
    [
      '.break-all',
      'word-break: normal;',
      'Break whenever necessary, without trying to preserve whole words.',
    ],
    [
      '.truncate',
      "overflow: hidden;\ntext-overflow: ellipsis;\nwhite-space: nowrap",
      'Truncate overflowing text with an ellipsis (<code>…</code>) if needed.',
    ],
  ]
])

## Normal

Use `.break-normal` to only add line breaks at normal word break points.

@component('_partials.code-sample')
<p class="break-normal max-w-xs p-2 bg-gray-200 mx-auto">
Lorem ipsum dolor sit amet, consectetur adipisicing elit. Blanditiisitaquequodpraesentiumexplicaboincidunt? Dolores beatae nam at sed dolorum ratione dolorem nisi velit cum.
</p>
@slot('code')
<p class="break-normal ...">...</p>
@endslot
@endcomponent

## Break Words

Use `.break-words` to add line breaks mid-word if needed.

@component('_partials.code-sample')
<p class="break-words max-w-xs p-2 bg-gray-200 mx-auto">
Lorem ipsum dolor sit amet, consectetur adipisicing elit. Blanditiisitaquequodpraesentiumexplicaboincidunt? Dolores beatae nam at sed dolorum ratione dolorem nisi velit cum.
</p>
@slot('code')
<p class="break-words ...">...</p>
@endslot
@endcomponent

## Break All

Use `.break-all` to add line breaks whenever necessary, without trying to preserve whole words.

@component('_partials.code-sample')
<p class="break-all max-w-xs p-2 bg-gray-200 mx-auto">
Lorem ipsum dolor sit amet, consectetur adipisicing elit. Blanditiisitaquequodpraesentiumexplicaboincidunt? Dolores beatae nam at sed dolorum ratione dolorem nisi velit cum.
</p>
@slot('code')
<p class="break-all ...">...</p>
@endslot
@endcomponent

## Truncate

Use `.truncate` to truncate overflowing text with an ellipsis (<code>…</code>) if needed.

@component('_partials.code-sample')
<p class="truncate max-w-xs p-2 bg-gray-200 mx-auto">
Lorem ipsum dolor sit amet, consectetur adipisicing elit. Blanditiisitaquequodpraesentiumexplicaboincidunt? Dolores beatae nam at sed dolorum ratione dolorem nisi velit cum.
</p>
@slot('code')
<p class="truncate ...">...</p>
@endslot
@endcomponent

## Responsive

To control the word breaks in an element only at a specific breakpoint, add a `{screen}:` prefix to any existing word break utility. For example, adding the class `md:break-all` to an element would apply the `break-all` utility at medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

@component('_partials.responsive-code-sample')
@slot('none')
<p class="break-normal max-w-xs p-2 bg-gray-200 mx-auto">
Lorem ipsum dolor sit amet, consectetur adipisicing elit. Blanditiisitaquequodpraesentiumexplicaboincidunt? Dolores beatae nam at sed dolorum ratione dolorem nisi velit cum.
</p>
@endslot
@slot('sm')
<p class="break-words max-w-xs p-2 bg-gray-200 mx-auto">
Lorem ipsum dolor sit amet, consectetur adipisicing elit. Blanditiisitaquequodpraesentiumexplicaboincidunt? Dolores beatae nam at sed dolorum ratione dolorem nisi velit cum.
</p>
@endslot
@slot('md')
<p class="break-all max-w-xs p-2 bg-gray-200 mx-auto">
Lorem ipsum dolor sit amet, consectetur adipisicing elit. Blanditiisitaquequodpraesentiumexplicaboincidunt? Dolores beatae nam at sed dolorum ratione dolorem nisi velit cum.
</p>
@endslot
@slot('lg')
<p class="truncate max-w-xs p-2 bg-gray-200 mx-auto">
Lorem ipsum dolor sit amet, consectetur adipisicing elit. Blanditiisitaquequodpraesentiumexplicaboincidunt? Dolores beatae nam at sed dolorum ratione dolorem nisi velit cum.
</p>
@endslot
@slot('xl')
<p class="break-normal max-w-xs p-2 bg-gray-200 mx-auto">
Lorem ipsum dolor sit amet, consectetur adipisicing elit. Blanditiisitaquequodpraesentiumexplicaboincidunt? Dolores beatae nam at sed dolorum ratione dolorem nisi velit cum.
</p>
@endslot
@slot('code')
<p class="none:break-normal sm:break-words md:break-all lg:truncate xl:break-normal ...">
    ...
</p>
@endslot
@endcomponent

## Customizing

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'word break',
        'property' => 'wordBreak',
    ],
    'variants' => [
        'responsive',
    ],
])
