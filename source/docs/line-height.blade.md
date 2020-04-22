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
  'rows' => $page->config['theme']['lineHeight']->sortBy(function ($value, $name) {
    return is_numeric($name) ? 1 : 0;
  })->map(function ($value, $name) {
    $class = ".leading-{$name}";
    $code = "line-height: {$value};";
    $description = "Set the line height of an element to <code>{$value}</code>.";
    return [$class, $code, $description];
  })
])

## Relative line-heights

Use the `leading-none`, `leading-tight`, `leading-snug`, `leading-normal`, `leading-relaxed`, and `leading-loose` utilities to give an element a relative line-height based on its current font-size.

@component('_partials.code-sample')
@foreach (['none', 'tight', 'snug', 'normal', 'relaxed', 'loose'] as $name)
<div @if(!$loop->last) class="mb-6" @endif>
  <p class="text-sm text-gray-600">.leading-{{ $name }}</p>
  <p class="leading-{{ $name }} text-gray-800">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda, quia temporibus eveniet a libero incidunt suscipit laborum, rerum accusantium modi quidem, ipsam illum quis sed voluptatum quae eum fugit earum.</p>
</div>
@endforeach
@slot('code')
@foreach (['none', 'tight', 'snug', 'normal', 'relaxed', 'loose'] as $name)
<p class="leading-{{ $name }} ...">Lorem ipsum dolor sit amet ...</p>
@endforeach
@endslot
@endcomponent

<h2 class="flex items-center">
  Fixed line-heights
  <span class="ml-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium leading-4 bg-green-150 text-green-900">
    v1.2.0+
  </span>
</h2>

Use the `leading-{size}` utilities to give an element a fixed line-height, irrespective of the current font-size. These are useful when you need very precise control over an element's final size.

@component('_partials.code-sample')
@foreach (range(3, 10) as $name)
<div @if(!$loop->last) class="mb-6" @endif>
  <p class="text-sm text-gray-600">.leading-{{ $name }}</p>
  <p class="leading-{{ $name }} text-gray-800">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda, quia temporibus eveniet a libero incidunt suscipit laborum, rerum accusantium modi quidem, ipsam illum quis sed voluptatum quae eum fugit earum.</p>
</div>
@endforeach
@slot('code')
@foreach (range(3, 10) as $name)
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
<p class="leading-relaxed text-gray-800">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda, quia temporibus eveniet a libero incidunt suscipit laborum, rerum accusantium modi quidem, ipsam illum quis sed voluptatum quae eum fugit earum.</p>
@endslot
@slot('xl')
<p class="leading-loose text-gray-800">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda, quia temporibus eveniet a libero incidunt suscipit laborum, rerum accusantium modi quidem, ipsam illum quis sed voluptatum quae eum fugit earum.</p>
@endslot
@slot('code')
<p class="none:leading-none sm:leading-tight md:leading-normal lg:leading-relaxed xl:leading-loose ...">Lorem ipsum dolor sit amet ...</p>
@endslot
@endcomponent

## Customizing

By default Tailwind provides six relative and eight fixed `line-height` utilities. You change, add, or remove these by customizing the `skew` section of your Tailwind theme config.

@component('_partials.customized-config', ['key' => 'theme.extend.lineHeight'])
+ 'extra-loose': '2.5',
+ '12': '3rem',
@endcomponent

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'line height',
        'property' => 'lineHeight',
    ],
    'variants' => [
        'responsive',
    ],
])
