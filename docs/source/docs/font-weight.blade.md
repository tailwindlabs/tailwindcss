---
extends: _layouts.documentation
title: "Font Weight"
description: "Utilities for controlling the font weight of an element."
features:
  responsive: true
  customizable: true
  hover: true
  focus: false
---

@include('_partials.work-in-progress')

@include('_partials.class-table', [
  'rows' => [
    [
      '.font-hairline',
      'font-weight: 100;',
      'Set the font weight of an element to hairline.',
    ],
    [
      '.font-thin',
      'font-weight: 200;',
      'Set the font weight of an element to thin.',
    ],
    [
      '.font-light',
      'font-weight: 300;',
      'Set the font weight of an element to light.',
    ],
    [
      '.font-normal',
      'font-weight: 400;',
      'Set the font weight of an element to normal.',
    ],
    [
      '.font-medium',
      'font-weight: 500;',
      'Set the font weight of an element to medium.',
    ],
    [
      '.font-semibold',
      'font-weight: 600;',
      'Set the font weight of an element to semibold.',
    ],
    [
      '.font-bold',
      'font-weight: 700;',
      'Set the font weight of an element to bold.',
    ],
    [
      '.font-extrabold',
      'font-weight: 800;',
      'Set the font weight of an element to extrabold.',
    ],
    [
      '.font-black',
      'font-weight: 900;',
      'Set the font weight of an element to black.',
    ],
  ]
])

## Hover

In addition to the standard responsive variations, font weight utilities also come in `hover:` variations that apply the given font weight on hover.

@component('_partials.code-sample')
<div class="text-center text-blue-dark">
  <a href="#" class="font-normal hover:font-bold">Hover over this link</a>
</div>
@endcomponent

Hover utilities can also be combined with responsive utilities by adding the responsive `{screen}:` prefix *before* the `hover:` prefix.

```html
<a href="#" class="... md:font-normal md:hover:font-bold ...">Link</a>
```

## Customizing

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'font weight',
        'property' => 'fontWeights',
    ],
    'variants' => [
        'responsive',
        'hover',
    ],
])
