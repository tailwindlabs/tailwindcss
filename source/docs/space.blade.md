---
extends: _layouts.documentation
title: "Space Between"
description: "Utilities for controlling the space between child elements."
featureVersion: "v1.3.0+"
---

@php
  $rows = collect([
    ['space-x', ['margin-left']],
    ['space-y', ['margin-top']],
  ])->flatMap(function ($side) use ($page) {
    return $page->config['theme']['space']->map(function ($value, $name) use ($side) {
      $class = starts_with($name, '-')
        ? ".-{$side[0]}-".substr($name, 1)
        : ".{$side[0]}-{$name}";
      $code = collect($side[1])->map(function ($property) use ($value) {
        return "{$property}: {$value};";
      })->implode("\n");
      return [$class, $code];
    })->values();
  });

  $scroll = true;
  $scroll = isset($scroll) ? $scroll : true;
  $scroll = (count($rows) > 12 && ($scroll !== false));
@endphp

<h2 style="visibility: hidden; font-size: 0; margin: 0;">Class reference</h2>
<div class="mt-0 border-t border-b border-gray-300 overflow-hidden relative">
  <div class="{{ $scroll ? 'lg:max-h-sm' : '' }} overflow-y-auto scrollbar-w-2 scrollbar-track-gray-lighter scrollbar-thumb-rounded scrollbar-thumb-gray scrolling-touch">
    <table class="w-full text-left table-collapse">
      <thead>
        <tr>
          <th class="text-sm font-semibold text-gray-700 p-2 bg-gray-100">Class</th>
          <th class="text-sm font-semibold text-gray-700 p-2 bg-gray-100">Properties</th>
        </tr>
      </thead>
      <tbody class="align-baseline">
        @foreach ($rows as $row)
        <tr>
          <td class="p-2 border-t {{ $loop->first ? 'border-gray-300' : 'border-gray-200' }} font-mono text-xs text-purple-700 whitespace-no-wrap">
          {!! $row[0] !!}
          <span class="ml-1 text-purple-300">> * + *</span>
          </td>
          <td class="p-2 border-t {{ $loop->first ? 'border-gray-300' : 'border-gray-200' }} font-mono text-xs text-blue-700 whitespace-pre">{!! $row[1] !!}</td>
        </tr>
        @endforeach
        <tr>
          <td class="p-2 border-t border-gray-200 font-mono text-xs text-purple-700 whitespace-no-wrap">
          .space-x-reverse
          <span class="ml-1 text-purple-300">> * + *</span>
          </td>
          <td class="p-2 border-t border-gray-200 font-mono text-xs text-blue-700 whitespace-pre">--space-x-reverse: 1</td>
        </tr>
        <tr>
          <td class="p-2 border-t border-gray-200 font-mono text-xs text-purple-700 whitespace-no-wrap">
          .space-y-reverse
          <span class="ml-1 text-purple-300">> * + *</span>
          </td>
          <td class="p-2 border-t border-gray-200 font-mono text-xs text-blue-700 whitespace-pre">--space-y-reverse: 1</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>


## Add horizontal space between children

Control the horizontal space between elements using the `space-x-{amount}` utilities.

@component('_partials.code-sample')
<div class="flex space-x-4 bg-gray-200">
  <div class="text-gray-700 text-center bg-gray-400 px-4 py-2">1</div>
  <div class="text-gray-700 text-center bg-gray-400 px-4 py-2">2</div>
  <div class="text-gray-700 text-center bg-gray-400 px-4 py-2">3</div>
</div>

@slot('code')
<div class="flex space-x-4">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</div>
@endslot
@endcomponent

## Add vertical space between children

Control the horizontal space between elements using the `space-y-{amount}` utilities.

@component('_partials.code-sample')
<div class="space-y-6 bg-gray-200">
  <div class="text-gray-700 text-center bg-gray-400 px-4 py-2">1</div>
  <div class="text-gray-700 text-center bg-gray-400 px-4 py-2">2</div>
  <div class="text-gray-700 text-center bg-gray-400 px-4 py-2">3</div>
</div>

@slot('code')
<div class="space-y-6">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</div>
@endslot
@endcomponent

## Reversing children order

If your elements are in reverse order (using say `flex-row-reverse` or `flex-col-reverse`), use the `space-x-reverse` or `space-y-reverse` utilities to ensure the space is added to the correct side of each element.

@component('_partials.code-sample')
<div class="flex flex-row-reverse space-x-4 space-x-reverse bg-gray-200">
  <div class="text-gray-700 text-center bg-gray-400 px-4 py-2">1</div>
  <div class="text-gray-700 text-center bg-gray-400 px-4 py-2">2</div>
  <div class="text-gray-700 text-center bg-gray-400 px-4 py-2">3</div>
</div>

@slot('code')
<div class="flex flex-row-reverse space-x-4 space-x-reverse">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</div>
@endslot
@endcomponent

---

## Responsive

To control the space between elements at a specific breakpoint, add a `{screen}:` prefix to any existing space utility. For example, adding the class `md:space-x-8` to an element would apply the `space-x-8` utility at medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

@component('_partials.responsive-code-sample', ['class' => 'text-center'])
@slot('none')
<div class="flex space-x-2 bg-gray-200">
  <div class="text-gray-700 text-center bg-gray-400 px-4 py-2">1</div>
  <div class="text-gray-700 text-center bg-gray-400 px-4 py-2">2</div>
  <div class="text-gray-700 text-center bg-gray-400 px-4 py-2">3</div>
</div>
@endslot

@slot('sm')
<div class="flex space-x-4 bg-gray-200">
  <div class="text-gray-700 text-center bg-gray-400 px-4 py-2">1</div>
  <div class="text-gray-700 text-center bg-gray-400 px-4 py-2">2</div>
  <div class="text-gray-700 text-center bg-gray-400 px-4 py-2">3</div>
</div>
@endslot

@slot('md')
<div class="flex space-x-6 bg-gray-200">
  <div class="text-gray-700 text-center bg-gray-400 px-4 py-2">1</div>
  <div class="text-gray-700 text-center bg-gray-400 px-4 py-2">2</div>
  <div class="text-gray-700 text-center bg-gray-400 px-4 py-2">3</div>
</div>
@endslot

@slot('lg')
<div class="flex space-x-8 bg-gray-200">
  <div class="text-gray-700 text-center bg-gray-400 px-4 py-2">1</div>
  <div class="text-gray-700 text-center bg-gray-400 px-4 py-2">2</div>
  <div class="text-gray-700 text-center bg-gray-400 px-4 py-2">3</div>
</div>
@endslot

@slot('xl')
<div class="flex space-x-12 bg-gray-200">
  <div class="text-gray-700 text-center bg-gray-400 px-4 py-2">1</div>
  <div class="text-gray-700 text-center bg-gray-400 px-4 py-2">2</div>
  <div class="text-gray-700 text-center bg-gray-400 px-4 py-2">3</div>
</div>
@endslot

@slot('code')
<div class="flex none:space-x-2 sm:space-x-4 md:space-x-6 lg:space-x-8 xl:space-x-12">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</div>
@endslot
@endcomponent

---

## Customizing

### Spacing scale

If you'd like to customize your values for space between, padding, margin, width, and height all at once, use the `theme.spacing` section of your `tailwind.config.js` file.

@component('_partials.customized-config', ['key' => 'theme.spacing'])
+ sm: '8px',
+ md: '16px',
+ lg: '24px',
+ xl: '48px',
@endcomponent

To customize only the space between values, use the `theme.space` section of your `tailwind.config.js` file.

@component('_partials.customized-config', ['key' => 'theme.space'])
+ sm: '8px',
+ md: '16px',
+ lg: '24px',
+ xl: '48px',
@endcomponent

Learn more about customizing the default theme in the [theme customization documentation](/docs/theme#customizing-the-default-theme).


@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'space',
        'property' => 'space',
    ],
    'variants' => [
        'responsive',
    ],
])

