---
extends: _layouts.documentation
title: "Lists"
description: "Utilities for controlling list styles."
features:
  responsive: true
  customizable: false
  hover: false
  focus: false
---

@include('_partials.class-table', [
  'rows' => [
    [
      '.list-none',
      "list-style-type: none;",
    ],
    [
      '.list-disc',
      "list-style-type: disc;",
    ],
    [
      '.list-decimal',
      "list-style-type: decimal;",
    ],
    [
      '.list-inside',
      "list-style-position: inside;",
    ],
    [
      '.list-outside',
      "list-style-position: outside;",
    ],
  ]
])

## Styling lists

By default lists are unstyled. That means if you want to create lists that have the default browser styling (bullets/numbers and a bit of left padding), you need to explicitly style those.

@component('_partials.code-sample')
<div class="mb-6">
  <p class="text-sm text-gray-600">Default</p>
  <ul class="default">
    <li>Lorem ipsum dolor sit amet, consectetur adipisicing elit</li>
    <li>Assumenda, quia temporibus eveniet a libero incidunt suscipit</li>
    <li>Quidem, ipsam illum quis sed voluptatum quae eum fugit earum</li>
  </ul>
</p>
</div>
<div class="mb-6">
  <p class="text-sm text-gray-600">Styled unordered list</p>
  <ul class="list-disc list-inside">
    <li>Lorem ipsum dolor sit amet, consectetur adipisicing elit</li>
    <li>Assumenda, quia temporibus eveniet a libero incidunt suscipit</li>
    <li>Quidem, ipsam illum quis sed voluptatum quae eum fugit earum</li>
  </ul>
</div>
<div>
  <p class="text-sm text-gray-600">Styled ordered list</p>
  <ol class="list-decimal list-inside">
    <li>Lorem ipsum dolor sit amet, consectetur adipisicing elit</li>
    <li>Assumenda, quia temporibus eveniet a libero incidunt suscipit</li>
    <li>Quidem, ipsam illum quis sed voluptatum quae eum fugit earum</li>
  </ol>
</div>
@slot('code')
<ul>
  <li>Lorem ipsum dolor sit amet, consectetur adipisicing elit</li>
  ...
</ul>

<ul class="list-disc list-inside">
  <li>Lorem ipsum dolor sit amet, consectetur adipisicing elit</li>
  ...
</ul>

<ol class="list-decimal list-inside">
  <li>Lorem ipsum dolor sit amet, consectetur adipisicing elit</li>
  ...
</ol>
@endslot
@endcomponent

## Responsive

To control the list styles of an element at a specific breakpoint, add a `{screen}:` prefix to any existing list utility. For example, use `.md:list-disc` to apply the `.list-disc` utility at only medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

@component('_partials.responsive-code-sample')
@slot('none')
<ul class="default">
  <li>Lorem ipsum dolor sit amet, consectetur adipisicing elit</li>
  <li>Assumenda, quia temporibus eveniet a libero incidunt suscipit</li>
  <li>Quidem, ipsam illum quis sed voluptatum quae eum fugit earum</li>
</ul>
@endslot
@slot('sm')
<ul class="list-disc">
  <li>Lorem ipsum dolor sit amet, consectetur adipisicing elit</li>
  <li>Assumenda, quia temporibus eveniet a libero incidunt suscipit</li>
  <li>Quidem, ipsam illum quis sed voluptatum quae eum fugit earum</li>
</ul>
@endslot
@slot('md')
<ul class="list-decimal">
  <li>Lorem ipsum dolor sit amet, consectetur adipisicing elit</li>
  <li>Assumenda, quia temporibus eveniet a libero incidunt suscipit</li>
  <li>Quidem, ipsam illum quis sed voluptatum quae eum fugit earum</li>
</ul>
@endslot
@slot('lg')
<ul class="list-disc list-inside">
  <li>Lorem ipsum dolor sit amet, consectetur adipisicing elit</li>
  <li>Assumenda, quia temporibus eveniet a libero incidunt suscipit</li>
  <li>Quidem, ipsam illum quis sed voluptatum quae eum fugit earum</li>
</ul>
@endslot
@slot('xl')
<ul class="list-decimal list-inside">
  <li>Lorem ipsum dolor sit amet, consectetur adipisicing elit</li>
  <li>Assumenda, quia temporibus eveniet a libero incidunt suscipit</li>
  <li>Quidem, ipsam illum quis sed voluptatum quae eum fugit earum</li>
</ul>
@endslot
@slot('code')
<ul class="sm:list-disc md:list-decimal lg:list-disc lg:list-inside xl:list-decimal xl:list-inside">
  <li>Lorem ipsum dolor sit amet, consectetur adipisicing elit</li>
  <li>Assumenda, quia temporibus eveniet a libero incidunt suscipit</li>
  <li>Quidem, ipsam illum quis sed voluptatum quae eum fugit earum</li>
</ul>
@endslot
@endcomponent

## Customizing

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'list',
        'property' => 'lists',
    ],
    'variants' => [
        'responsive',
    ],
])
