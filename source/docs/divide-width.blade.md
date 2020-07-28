---
extends: _layouts.documentation
title: "Divide Width"
description: "Utilities for controlling the border width between elements."
featureVersion: "v1.3.0+"
---

@php
  $rows = collect([
    ['divide-x', ['border-left-width']],
    ['divide-y', ['border-top-width']],
  ])->flatMap(function ($side) use ($page) {
    return $page->config['theme']['divideWidth']->map(function ($value, $name) use ($side) {
      $suffix = $name === 'default' ? '' : "-{$name}";
      $class =".{$side[0]}{$suffix}";
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
          .divide-x-reverse
          <span class="ml-1 text-purple-300">> * + *</span>
          </td>
          <td class="p-2 border-t border-gray-200 font-mono text-xs text-blue-700 whitespace-pre">--divide-x-reverse: 1</td>
        </tr>
        <tr>
          <td class="p-2 border-t border-gray-200 font-mono text-xs text-purple-700 whitespace-no-wrap">
          .divide-y-reverse
          <span class="ml-1 text-purple-300">> * + *</span>
          </td>
          <td class="p-2 border-t border-gray-200 font-mono text-xs text-blue-700 whitespace-pre">--divide-y-reverse: 1</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>


## Add borders between horizontal children

Add borders between horizontal elements using the `divide-x-{amount}` utilities.

@component('_partials.code-sample')
<div class="grid grid-cols-3 divide-x divide-gray-400">
  <div class="text-center">1</div>
  <div class="text-center">2</div>
  <div class="text-center">3</div>
</div>

@slot('code')
<div class="grid grid-cols-3 divide-x divide-gray-400">
  <div class="text-center">1</div>
  <div class="text-center">2</div>
  <div class="text-center">3</div>
</div>
@endslot
@endcomponent

## Add borders between stacked children

Add borders between stacked elements using the `divide-y-{amount}` utilities.

@component('_partials.code-sample')
<div class="divide-y divide-gray-400">
  <div class="text-center py-2">1</div>
  <div class="text-center py-2">2</div>
  <div class="text-center py-2">3</div>
</div>

@slot('code')
<div class="divide-y divide-gray-400">
  <div class="text-center py-2">1</div>
  <div class="text-center py-2">2</div>
  <div class="text-center py-2">3</div>
</div>
@endslot
@endcomponent

## Reversing children order

If your elements are in reverse order (using say `flex-row-reverse` or `flex-col-reverse`), use the `divide-x-reverse` or `divide-y-reverse` utilities to ensure the border is added to the correct side of each element.

@component('_partials.code-sample')
<div class="flex flex-col-reverse divide-y divide-y-reverse divide-gray-400">
  <div class="text-center py-2">1</div>
  <div class="text-center py-2">2</div>
  <div class="text-center py-2">3</div>
</div>
@endcomponent

---

## Responsive

To control the borders between elements at a specific breakpoint, add a `{screen}:` prefix to any existing divide utility. For example, adding the class `md:divide-x-8` to an element would apply the `divide-x-8` utility at medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

@component('_partials.responsive-code-sample', ['class' => 'text-center'])
@slot('none')
<div class="divide-y divide-gray-400">
  <div class="text-center py-2">1</div>
  <div class="text-center py-2">2</div>
  <div class="text-center py-2">3</div>
</div>
@endslot

@slot('sm')
<div class="divide-y-2 divide-gray-400">
  <div class="text-center py-2">1</div>
  <div class="text-center py-2">2</div>
  <div class="text-center py-2">3</div>
</div>
@endslot

@slot('md')
<div class="divide-y-4 divide-gray-400">
  <div class="text-center py-2">1</div>
  <div class="text-center py-2">2</div>
  <div class="text-center py-2">3</div>
</div>
@endslot

@slot('lg')
<div class="divide-y-8 divide-gray-400">
  <div class="text-center py-2">1</div>
  <div class="text-center py-2">2</div>
  <div class="text-center py-2">3</div>
</div>
@endslot

@slot('xl')
<div class="divide-y-0 divide-gray-400">
  <div class="text-center py-2">1</div>
  <div class="text-center py-2">2</div>
  <div class="text-center py-2">3</div>
</div>
@endslot

@slot('code')
<div class="none:divide-y sm:divide-y-2 md:divide-y-4 lg:divide-y-8 xl:divide-y-0 divide-gray-400">
  <div class="text-center py-2">1</div>
  <div class="text-center py-2">2</div>
  <div class="text-center py-2">3</div>
</div>
@endslot
@endcomponent

---

## Customizing

### Divide width scale

The divide width scale inherits its values from the `borderWidth` scale by default, so if you'd like to customize your values for both border width and divide width together, use the `theme.borderWidth` section of your `tailwind.config.js` file.

@component('_partials.customized-config', ['key' => 'theme.borderWidth'])
  default: '1px',
  '0': '0',
  '2': '2px',
+ '3': '3px',
  '4': '4px',
+ '6': '6px',
- '8': '8px',
@endcomponent

To customize only the divide width values, use the `theme.divideWidth` section of your `tailwind.config.js` file.

@component('_partials.customized-config', ['key' => 'theme.divideWidth'])
  default: '1px',
  '0': '0',
  '2': '2px',
+ '3': '3px',
  '4': '4px',
+ '6': '6px',
- '8': '8px',
@endcomponent

Learn more about customizing the default theme in the [theme customization documentation](/docs/theme#customizing-the-default-theme).


@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'divideWidth',
        'property' => 'divideWidth',
    ],
    'variants' => [
        'responsive',
    ],
])

