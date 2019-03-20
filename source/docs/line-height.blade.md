---
extends: _layouts.documentation
title: "Line Height"
description: "Utilities for controlling the leading (line height) of an element."
features:
  responsive: true
  customizable: true
  hover: false
  focus: false
---

@include('_partials.class-table', [
  'rows' => $page->config['theme']['lineHeight']->map(function ($value, $name) {
    $class = ".leading-{$name}";
    $code = "line-height: {$value};";
    $description = "Set the line height of an element to <code>{$value}</code>.";
    return [$class, $code, $description];
  })
])

## Usage

Control the line height of an element using the `.leading-{size}` utilities.

@component('_partials.code-sample')
@foreach ($page->config['theme']['lineHeight'] as $name => $value)
<div @if(!$loop->last) class="mb-6" @endif>
  <p class="text-sm text-gray-600">.leading-{{ $name }}</p>
  <p class="leading-{{ $name }} text-gray-800">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda, quia temporibus eveniet a libero incidunt suscipit laborum, rerum accusantium modi quidem, ipsam illum quis sed voluptatum quae eum fugit earum.</p>
</div>
@endforeach
@slot('code')
@foreach ($page->config['theme']['lineHeight'] as $name => $value)
<p class="leading-{{ $name }} ...">Lorem ipsum dolor sit amet ...</p>
@endforeach
@endslot
@endcomponent

## Responsive

To control the line height of an element at a specific breakpoint, add a `{screen}:` prefix to any existing line height utility. For example, use `md:leading-loose` to apply the `leading-loose` utility at only medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

@component('_partials.responsive-code-sample')
@slot('none')
<p class="leading-none text-gray-800">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda, quia temporibus eveniet a libero incidunt suscipit laborum, rerum accusantium modi quidem, ipsam illum quis sed voluptatum quae eum fugit earum.</p>
@endslot
@slot('sm')
<p class="leading-tight text-gray-800">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda, quia temporibus eveniet a libero incidunt suscipit laborum, rerum accusantium modi quidem, ipsam illum quis sed voluptatum quae eum fugit earum.</p>
@endslot
@slot('md')
<p class="leading-normal text-gray-800">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda, quia temporibus eveniet a libero incidunt suscipit laborum, rerum accusantium modi quidem, ipsam illum quis sed voluptatum quae eum fugit earum.</p>
@endslot
@slot('lg')
<p class="leading-loose text-gray-800">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda, quia temporibus eveniet a libero incidunt suscipit laborum, rerum accusantium modi quidem, ipsam illum quis sed voluptatum quae eum fugit earum.</p>
@endslot
@slot('xl')
<p class="leading-normal text-gray-800">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda, quia temporibus eveniet a libero incidunt suscipit laborum, rerum accusantium modi quidem, ipsam illum quis sed voluptatum quae eum fugit earum.</p>
@endslot
@slot('code')
<p class="none:leading-none sm:leading-tight md:leading-normal lg:leading-loose xl:leading-normal ...">Lorem ipsum dolor sit amet ...</p>
@endslot
@endcomponent

## Customizing

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'leading',
        'property' => 'leading',
    ],
    'variants' => [
        'responsive',
    ],
])
