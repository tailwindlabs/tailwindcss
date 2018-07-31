---
extends: _layouts.documentation
title: "Text Alignment"
description: "Utilities for controlling the alignment of text."
features:
  responsive: true
  customizable: true
  hover: false
  focus: false
---

@include('_partials.class-table', [
  'rows' => [
    [
      '.text-left',
      'text-align: left;',
      'Align text to the left.',
    ],
    [
      '.text-center',
      'text-align: center;',
      'Align text to the center.',
    ],
    [
      '.text-right',
      'text-align: right;',
      'Align text to the right.',
    ],
    [
      '.text-justify',
      'text-align: justify;',
      'Justify text.',
    ],
  ]
])

## Usage

Control the text alignment of an element using the `.text-left`, `.text-center`, `.text-right`, and `.text-justify` utilities.

@component('_partials.code-sample')
<div class="mb-6">
  <p class="text-sm text-grey-dark">.text-left</p>
  <p class="text-left text-base text-grey-darkest">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nobis fugit, enim molestiae praesentium eveniet, recusandae et error beatae facilis ex harum consequuntur, quia pariatur non. Doloribus illo, ullam blanditiis ab.</p>
</div>
<div class="mb-6">
  <p class="text-sm text-grey-dark">.text-center</p>
  <p class="text-center text-base text-grey-darkest">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nobis fugit, enim molestiae praesentium eveniet, recusandae et error beatae facilis ex harum consequuntur, quia pariatur non. Doloribus illo, ullam blanditiis ab.</p>
</div>
<div class="mb-6">
  <p class="text-sm text-grey-dark">.text-right</p>
  <p class="text-right text-base text-grey-darkest">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nobis fugit, enim molestiae praesentium eveniet, recusandae et error beatae facilis ex harum consequuntur, quia pariatur non. Doloribus illo, ullam blanditiis ab.</p>
</div>
<div class="mb-6">
  <p class="text-sm text-grey-dark">.text-justify</p>
  <p class="text-justify text-base text-grey-darkest">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nobis fugit, enim molestiae praesentium eveniet, recusandae et error beatae facilis ex harum consequuntur, quia pariatur non. Doloribus illo, ullam blanditiis ab.</p>
</div>
@slot('code')
<p class="text-left ...">Lorem ipsum dolor sit amet ...</p>
<p class="text-center ...">Lorem ipsum dolor sit amet ...</p>
<p class="text-right ...">Lorem ipsum dolor sit amet ...</p>
<p class="text-justify ...">Lorem ipsum dolor sit amet ...</p>
@endslot
@endcomponent

## Responsive

To control the text alignment of an element at a specific breakpoint, add a `{screen}:` prefix to any existing text alignment utility. For example, use `md:text-center` to apply the `text-center` utility at only medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

@component('_partials.responsive-code-sample')
@slot('none')
<p class="text-left text-grey-darkest">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda, quia temporibus eveniet a libero incidunt suscipit laborum, rerum accusantium modi quidem, ipsam illum quis sed voluptatum quae eum fugit earum.</p>
@endslot
@slot('sm')
<p class="text-center text-grey-darkest">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda, quia temporibus eveniet a libero incidunt suscipit laborum, rerum accusantium modi quidem, ipsam illum quis sed voluptatum quae eum fugit earum.</p>
@endslot
@slot('md')
<p class="text-right text-grey-darkest">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda, quia temporibus eveniet a libero incidunt suscipit laborum, rerum accusantium modi quidem, ipsam illum quis sed voluptatum quae eum fugit earum.</p>
@endslot
@slot('lg')
<p class="text-justify text-grey-darkest">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda, quia temporibus eveniet a libero incidunt suscipit laborum, rerum accusantium modi quidem, ipsam illum quis sed voluptatum quae eum fugit earum.</p>
@endslot
@slot('xl')
<p class="text-center text-grey-darkest">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda, quia temporibus eveniet a libero incidunt suscipit laborum, rerum accusantium modi quidem, ipsam illum quis sed voluptatum quae eum fugit earum.</p>
@endslot
@slot('code')
<p class="none:text-left sm:text-center md:text-right lg:text-justify xl:text-center ...">Lorem ipsum dolor sit amet ...</p>
@endslot
@endcomponent

## Customizing

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'text alignment',
        'property' => 'textAlign',
    ],
    'variants' => [
        'responsive',
    ],
])
