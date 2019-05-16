---
extends: _layouts.documentation
title: "Whitespace"
description: "Utilities for controlling an element's white-space property."
---

@include('_partials.class-table', [
  'rows' => [
    [
      '.whitespace-normal',
      'white-space: normal;',
      'Cause text to wrap normally within an element.',
    ],
    [
      '.whitespace-no-wrap',
      'white-space: nowrap;',
      'Prevent text from wrapping within an element.',
    ],
    [
      '.whitespace-pre',
      'white-space: pre;',
      'Preserve line returns and spaces within an element.',
    ],
    [
      '.whitespace-pre-line',
      'white-space: pre-line;',
      'Preserve line returns but not spaces within an element.',
    ],
    [
      '.whitespace-pre-wrap',
      'white-space: pre-wrap;',
      'Preserve spaces but not line returns within an element.',
    ],
  ]
])

## Normal

Use `.whitespace-normal` to cause text to wrap normally within an element. Newlines and spaces will be collapsed.

@component('_partials.code-sample')
<div class="whitespace-normal">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis quidem itaque beatae, rem tenetur quia iure,
    eum natus enim maxime
    laudantium quibusdam illo nihil,

reprehenderit saepe quam aliquid odio accusamus.</div>
@endcomponent

## No Wrap

Use `.whitespace-no-wrap` to prevent text from wrapping within an element. Newlines and spaces will be collapsed.

@component('_partials.code-sample')
<div class="whitespace-no-wrap overflow-x-auto">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis quidem itaque beatae, rem tenetur quia iure,
    eum natus enim maxime
    laudantium quibusdam illo nihil,

reprehenderit saepe quam aliquid odio accusamus.</div>
@endcomponent

## Pre

Use `.whitespace-pre` to preserve newlines and spaces within an element. Text will not be wrapped.

@component('_partials.code-sample')
<div class="whitespace-pre overflow-x-auto">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis quidem itaque beatae, rem tenetur quia iure,
    eum natus enim maxime
    laudantium quibusdam illo nihil,

reprehenderit saepe quam aliquid odio accusamus.</div>
@endcomponent

## Pre Line

Use `.whitespace-pre-line` to preserve newlines but not spaces within an element. Text will be wrapped normally.

@component('_partials.code-sample')
<div class="whitespace-pre-line">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis quidem itaque beatae, rem tenetur quia iure,
    eum natus enim maxime
    laudantium quibusdam illo nihil,

reprehenderit saepe quam aliquid odio accusamus.</div>
@endcomponent

## Pre Wrap

Use `.whitespace-pre-wrap` to preserve newlines and spaces within an element. Text will be wrapped normally.

@component('_partials.code-sample')
<div class="whitespace-pre-wrap">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis quidem itaque beatae, rem tenetur quia iure,
    eum natus enim maxime
    laudantium quibusdam illo nihil,

reprehenderit saepe quam aliquid odio accusamus.</div>
@endcomponent

## Responsive

To control the whitespace property of an element only at a specific breakpoint, add a `{screen}:` prefix to any existing whitespace utility. For example, adding the class `md:whitespace-pre` to an element would apply the `whitespace-pre` utility at medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

@component('_partials.responsive-code-sample')
@slot('none')
<div class="whitespace-normal overflow-x-auto">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis quidem itaque beatae, rem tenetur quia iure,
    eum natus enim maxime
    laudantium quibusdam illo nihil,

reprehenderit saepe quam aliquid odio accusamus.</div>
@endslot
@slot('sm')
<div class="whitespace-no-wrap overflow-x-auto">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis quidem itaque beatae, rem tenetur quia iure,
    eum natus enim maxime
    laudantium quibusdam illo nihil,

reprehenderit saepe quam aliquid odio accusamus.</div>
@endslot
@slot('md')
<div class="whitespace-pre overflow-x-auto">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis quidem itaque beatae, rem tenetur quia iure,
    eum natus enim maxime
    laudantium quibusdam illo nihil,

reprehenderit saepe quam aliquid odio accusamus.</div>
@endslot
@slot('lg')
<div class="whitespace-pre-line overflow-x-auto">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis quidem itaque beatae, rem tenetur quia iure,
    eum natus enim maxime
    laudantium quibusdam illo nihil,

reprehenderit saepe quam aliquid odio accusamus.</div>
@endslot
@slot('xl')
<div class="whitespace-pre-wrap overflow-x-auto">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis quidem itaque beatae, rem tenetur quia iure,
    eum natus enim maxime
    laudantium quibusdam illo nihil,

reprehenderit saepe quam aliquid odio accusamus.</div>
@endslot
@slot('code')
<div class="none:whitespace-normal sm:whitespace-no-wrap md:whitespace-pre lg:whitespace-pre-line xl:whitespace-pre-wrap ...">...</div>
@endslot
@endcomponent

## Customizing

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'whitespace',
        'property' => 'whitespace',
    ],
    'variants' => [
        'responsive',
    ],
])
