---
extends: _layouts.documentation
title: "List Style Type"
description: "Utilities for controlling the bullet/number style of a list."
features:
  responsive: true
  customizable: true
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
  ]
])

## Usage

To create bulleted or numeric lists, use the `list-disc` and `list-decimal` utilities.

@component('_partials.code-sample')
<div class="mb-6">
  <p class="text-sm text-gray-600">.list-disc</p>
  <ul class="list-disc list-inside">
    <li>Lorem ipsum dolor sit amet, consectetur adipisicing elit</li>
    <li>Assumenda, quia temporibus eveniet a libero incidunt suscipit</li>
    <li>Quidem, ipsam illum quis sed voluptatum quae eum fugit earum</li>
  </ul>
</div>
<div class="mb-6">
  <p class="text-sm text-gray-600">.list-decimal</p>
  <ol class="list-decimal list-inside">
    <li>Lorem ipsum dolor sit amet, consectetur adipisicing elit</li>
    <li>Assumenda, quia temporibus eveniet a libero incidunt suscipit</li>
    <li>Quidem, ipsam illum quis sed voluptatum quae eum fugit earum</li>
  </ol>
</div>
<div>
  <p class="text-sm text-gray-600">.list-none (default)</p>
  <ul class="default">
    <li>Lorem ipsum dolor sit amet, consectetur adipisicing elit</li>
    <li>Assumenda, quia temporibus eveniet a libero incidunt suscipit</li>
    <li>Quidem, ipsam illum quis sed voluptatum quae eum fugit earum</li>
  </ul>
</p>
</div>
@slot('code')
<ul class="list-disc">
  <li>Lorem ipsum dolor sit amet, consectetur adipisicing elit</li>
  ...
</ul>

<ol class="list-decimal">
  <li>Lorem ipsum dolor sit amet, consectetur adipisicing elit</li>
  ...
</ol>

<ul>
  <li>Lorem ipsum dolor sit amet, consectetur adipisicing elit</li>
  ...
</ul>
@endslot
@endcomponent

## Responsive

To control the list style type of a list element at a specific breakpoint, add a `{screen}:` prefix to any existing list utility. For example, use `.md:list-disc` to apply the `.list-disc` utility at only medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

@component('_partials.responsive-code-sample')
@slot('none')
<ul class="list-inside list-none">
  <li>Lorem ipsum dolor sit amet, consectetur adipisicing elit</li>
  <li>Assumenda, quia temporibus eveniet a libero incidunt suscipit</li>
  <li>Quidem, ipsam illum quis sed voluptatum quae eum fugit earum</li>
</ul>
@endslot
@slot('sm')
<ul class="list-inside list-disc">
  <li>Lorem ipsum dolor sit amet, consectetur adipisicing elit</li>
  <li>Assumenda, quia temporibus eveniet a libero incidunt suscipit</li>
  <li>Quidem, ipsam illum quis sed voluptatum quae eum fugit earum</li>
</ul>
@endslot
@slot('md')
<ul class="list-inside list-decimal">
  <li>Lorem ipsum dolor sit amet, consectetur adipisicing elit</li>
  <li>Assumenda, quia temporibus eveniet a libero incidunt suscipit</li>
  <li>Quidem, ipsam illum quis sed voluptatum quae eum fugit earum</li>
</ul>
@endslot
@slot('lg')
<ul class="list-inside list-disc">
  <li>Lorem ipsum dolor sit amet, consectetur adipisicing elit</li>
  <li>Assumenda, quia temporibus eveniet a libero incidunt suscipit</li>
  <li>Quidem, ipsam illum quis sed voluptatum quae eum fugit earum</li>
</ul>
@endslot
@slot('xl')
<ul class="list-inside list-none">
  <li>Lorem ipsum dolor sit amet, consectetur adipisicing elit</li>
  <li>Assumenda, quia temporibus eveniet a libero incidunt suscipit</li>
  <li>Quidem, ipsam illum quis sed voluptatum quae eum fugit earum</li>
</ul>
@endslot
@slot('code')
<ul class="none:list-none sm:list-disc md:list-decimal lg:list-disc xl:list-none">
  <li>Lorem ipsum dolor sit amet, consectetur adipisicing elit</li>
  <li>Assumenda, quia temporibus eveniet a libero incidunt suscipit</li>
  <li>Quidem, ipsam illum quis sed voluptatum quae eum fugit earum</li>
</ul>
@endslot
@endcomponent

## Customizing

By default Tailwind provides three utilities for the most common list style types. You change, add, or remove these by editing the `theme.listStyleType` section of your Tailwind config.

@component('_partials.customized-config', ['key' => 'theme.listStyleType'])
  none: 'none',
- disc: 'disc',
- decimal: 'decimal',
+ square: 'square',
+ roman: 'upper-roman',
@endcomponent

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'list style type',
        'property' => 'listStyleType',
    ],
    'variants' => [
        'responsive',
    ],
])
