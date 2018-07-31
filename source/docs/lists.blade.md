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
      '.list-reset',
      "list-style: none; padding: 0;",
      "Disable default browser styling for lists and list items.",
    ],
  ]
])

## Removing default list styling

Remove default list styles using the `.list-reset` utility.

@component('_partials.code-sample')
<div class="mb-6">
  <p class="text-sm text-grey-dark">Default</p>
  <ul class="default">
    <li>Lorem ipsum dolor sit amet, consectetur adipisicing elit</li>
    <li>Assumenda, quia temporibus eveniet a libero incidunt suscipit</li>
    <li>Quidem, ipsam illum quis sed voluptatum quae eum fugit earum</li>
  </ul>
</p>
</div>
<div>
  <p class="text-sm text-grey-dark">With .list-reset</p>
  <ul class="list-reset">
    <li>Lorem ipsum dolor sit amet, consectetur adipisicing elit</li>
    <li>Assumenda, quia temporibus eveniet a libero incidunt suscipit</li>
    <li>Quidem, ipsam illum quis sed voluptatum quae eum fugit earum</li>
  </ul>
</div>
@slot('code')
<ul class="list-reset">
  <li>Lorem ipsum dolor sit amet, consectetur adipisicing elit</li>
  <li>Assumenda, quia temporibus eveniet a libero incidunt suscipit</li>
  <li>Quidem, ipsam illum quis sed voluptatum quae eum fugit earum</li>
</ul>
@endslot
@endcomponent

## Responsive

To preserve default list styles until a specific breakpoint, add a `{screen}:` prefix to the `.list-reset` utilitiy. For example, use `.md:list-reset` to apply the `.list-reset` utility at only medium screen sizes and above.

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
<ul class="list-reset">
  <li>Lorem ipsum dolor sit amet, consectetur adipisicing elit</li>
  <li>Assumenda, quia temporibus eveniet a libero incidunt suscipit</li>
  <li>Quidem, ipsam illum quis sed voluptatum quae eum fugit earum</li>
</ul>
@endslot
@slot('md')
<ul class="list-reset">
  <li>Lorem ipsum dolor sit amet, consectetur adipisicing elit</li>
  <li>Assumenda, quia temporibus eveniet a libero incidunt suscipit</li>
  <li>Quidem, ipsam illum quis sed voluptatum quae eum fugit earum</li>
</ul>
@endslot
@slot('lg')
<ul class="list-reset">
  <li>Lorem ipsum dolor sit amet, consectetur adipisicing elit</li>
  <li>Assumenda, quia temporibus eveniet a libero incidunt suscipit</li>
  <li>Quidem, ipsam illum quis sed voluptatum quae eum fugit earum</li>
</ul>
@endslot
@slot('xl')
<ul class="list-reset">
  <li>Lorem ipsum dolor sit amet, consectetur adipisicing elit</li>
  <li>Assumenda, quia temporibus eveniet a libero incidunt suscipit</li>
  <li>Quidem, ipsam illum quis sed voluptatum quae eum fugit earum</li>
</ul>
@endslot
@slot('code')
<ul class="sm:list-reset md:list-reset lg:list-reset xl:list-reset">
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
