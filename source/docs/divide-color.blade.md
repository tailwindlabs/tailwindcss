---
extends: _layouts.documentation
title: "Divide Color"
description: "Utilities for controlling the border color between elements."
---

@php
  $rows = $page->config['theme']['colors']->flatMap(function ($colors, $name) {
    if (is_string($colors)) {
      return [
        [".divide-{$name}", "border-color: {$colors};"]
      ];
    }

    return collect($colors)->map(function ($value, $key) use ($name) {
      $class = ".divide-{$name}-{$key}";
      $code = "border-color: {$value};";
      return [
        $class,
        $code,
      ];
    });
  })->values()->all();

  $scroll = true;
  $scroll = isset($scroll) ? $scroll : true;
  $scroll = (count($rows) > 12 && ($scroll !== false));
@endphp

<h2 style="visibility: hidden; font-size: 0; margin: 0;">Class reference</h2>
<div class="border-t border-b border-gray-300 overflow-hidden relative">
  <div class="{{ $scroll ? 'lg:max-h-xs' : '' }} overflow-y-auto scrollbar-w-2 scrollbar-track-gray-lighter scrollbar-thumb-rounded scrollbar-thumb-gray scrolling-touch">
    <table class="relative w-full text-left table-collapse">
      <thead>
        <tr>
          <th class="z-20 sticky top-0 text-sm font-semibold text-gray-700 bg-gray-100 p-0">
            <div class="p-2 border-b border-gray-300">Class</div>
          </th>
          <th class="relative z-20 sticky top-0 text-sm font-semibold text-gray-700 bg-gray-100 p-0" colspan="2">
            <div class="sm:hidden absolute inset-0 p-2 border-b border-gray-300"></div>
            <div class="hidden sm:block p-2 border-b border-gray-300">Properties</div>
          </th>
        </tr>
      </thead>
      <tbody class="align-baseline">
        @foreach ($rows as $row)
        <tr>
          <td class="p-2 {{ $loop->first ? '' : 'border-t border-gray-200' }} font-mono text-xs text-purple-700 whitespace-no-wrap">
          {!! $row[0] !!}
          <span class="ml-1 text-purple-300">> * + *</span>
          </td>
          <td class="hidden sm:table-cell p-2 {{ $loop->first ? '' : 'border-t border-gray-200' }} font-mono text-xs text-blue-700 whitespace-pre">{!! $row[1] !!}</td>
          <td class="relative w-20 p-2 {{ $loop->first ? '' : 'border-t border-gray-200' }} font-mono text-xs text-blue-700 whitespace-pre">
            <div class="absolute inset-0 flex flex-col m-2 divide-y {{ substr($row[0], 1) }}">
              <div class="flex-1"></div>
              <div class="flex-1"></div>
            </div>
          </td>
        </tr>
        @endforeach
      </tbody>
    </table>
  </div>
</div>


## Usage

Control the border color between elements using the `divide-{color}` utilities.

@component('_partials.code-sample')
<div class="divide-y divide-blue-300">
  <div class="text-center py-2">1</div>
  <div class="text-center py-2">2</div>
  <div class="text-center py-2">3</div>
</div>

@slot('code')
<div class="divide-y divide-blue-300">
  <div class="text-center py-2">1</div>
  <div class="text-center py-2">2</div>
  <div class="text-center py-2">3</div>
</div>
@endslot
@endcomponent

---

## Responsive

To control the borders between elements at a specific breakpoint, add a `{screen}:` prefix to any existing divide utility. For example, adding the class `md:divide-x-8` to an element would apply the `divide-x-8` utility at medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

@component('_partials.responsive-code-sample', ['class' => 'text-center'])
@slot('none')
<div class="divide-y divide-teal-400">
  <div class="text-center py-2">1</div>
  <div class="text-center py-2">2</div>
  <div class="text-center py-2">3</div>
</div>
@endslot

@slot('sm')
<div class="divide-y divide-pink-400">
  <div class="text-center py-2">1</div>
  <div class="text-center py-2">2</div>
  <div class="text-center py-2">3</div>
</div>
@endslot

@slot('md')
<div class="divide-y divide-orange-400">
  <div class="text-center py-2">1</div>
  <div class="text-center py-2">2</div>
  <div class="text-center py-2">3</div>
</div>
@endslot

@slot('lg')
<div class="divide-y divide-green-400">
  <div class="text-center py-2">1</div>
  <div class="text-center py-2">2</div>
  <div class="text-center py-2">3</div>
</div>
@endslot

@slot('xl')
<div class="divide-y divide-red-400">
  <div class="text-center py-2">1</div>
  <div class="text-center py-2">2</div>
  <div class="text-center py-2">3</div>
</div>
@endslot

@slot('code')
<div class="none:divide-teal-400 sm:divide-pink-400 md:divide-orange-400 lg:divide-green-400 xl:divide-red-400 divide-y">
  <div class="text-center py-2">1</div>
  <div class="text-center py-2">2</div>
  <div class="text-center py-2">3</div>
</div>
@endslot
@endcomponent

---

## Customizing

### Border Colors

By default Tailwind makes the entire [default color palette](/docs/customizing-colors#default-color-palette) available as divide colors.

You can [customize your color palette](/docs/colors#customizing) by editing the `theme.colors` section of your `tailwind.config.js` file, customize just your border and divide colors together using the `theme.borderColor` section, or customize only the divide colors using the `theme.divideColor` section.

@component('_partials.customized-config', ['key' => 'theme.divideColor', 'usesTheme' => true])
- ...theme('borderColors'),
+ 'primary': '#3490dc',
+ 'secondary': '#ffed4a',
+ 'danger': '#e3342f',
@endcomponent

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'divide color',
        'property' => 'divideColor',
    ],
    'variants' => [
        'responsive',
    ],
])
