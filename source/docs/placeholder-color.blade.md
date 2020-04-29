---
extends: _layouts.documentation
title: "Placeholder Color"
description: "Utilities for controlling the color of placeholder text."
featureVersion: "v1.1.0+"
---

@include('_partials.placeholder-color-class-table', [
  'rows' => $page->config['theme']['colors']->flatMap(function ($colors, $name) {
    if (is_string($colors)) {
      return [
        [".placeholder-{$name}", "color: {$colors};"]
      ];
    }

    return collect($colors)->map(function ($value, $key) use ($name) {
      $class = ".placeholder-{$name}-{$key}";
      $code = "color: {$value};";
      return [
        $class,
        $code,
      ];
    });
  })->values()->all()
])

## Usage

Control the placeholder color of an element using the `.placeholder-{color}` utilities.

@component('_partials.code-sample', ['class' => 'text-center p-6'])
<div class="max-w-xs">
  <input class="block appearance-none placeholder-gray-500 border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="jane@example.com">
  <input class="mt-4 block appearance-none placeholder-red-300 border border-red-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="jane@example.com">
</div>
@slot('code')
<input class="placeholder-gray-500 border" placeholder="jane@example.com">
<input class="placeholder-red-300 border border-red-400" placeholder="jane@example.com">
@endslot
@endcomponent

<h3>
  <span class="flex items-center" data-heading-text>
    Changing opacity
    <span class="ml-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium leading-4 bg-green-150 text-green-900">
      v1.4.0+
    </span>
  </span>
</h3>

Control the opacity of an element's placeholder color using the `.placeholder-opacity-{amount}` utilities.

@component('_partials.code-sample')
<div class="space-y-4">
  @foreach ($page->config['theme']['backgroundOpacity']->reverse() as $name => $value)
  <div class="max-w-xs">
    <input class="block appearance-none placeholder-gray-500 placeholder-opacity-{{ $name }} border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="jane@example.com">
  </div>
  @endforeach
</div>
@slot('code')
@foreach ($page->config['theme']['opacity']->reverse() as $name => $value)
<input class="placeholder-gray-500 placeholder-opacity-{{ $name }} ..." placeholder="jane@example.com">
@endforeach
@endslot
@endcomponent

Learn more in the [placeholder opacity documentation](/docs/placeholder-opacity).

## Responsive

To control the text color of an element at a specific breakpoint, add a `{screen}:` prefix to any existing text color utility. For example, use `md:text-green-600` to apply the `text-green-600` utility at only medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

@component('_partials.responsive-code-sample', ['class' => 'text-center'])
@slot('none')
<div class="max-w-xs mx-auto">
  <input class="block appearance-none placeholder-gray-500 border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="jane@example.com">
</div>
@endslot
@slot('sm')
<div class="max-w-xs mx-auto">
  <input class="block appearance-none placeholder-red-400 border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="jane@example.com">
</div>
@endslot
@slot('md')
<div class="max-w-xs mx-auto">
  <input class="block appearance-none placeholder-blue-400 border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="jane@example.com">
</div>
@endslot
@slot('lg')
<div class="max-w-xs mx-auto">
  <input class="block appearance-none placeholder-green-400 border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="jane@example.com">
</div>
@endslot
@slot('xl')
<div class="max-w-xs mx-auto">
  <input class="block appearance-none placeholder-orange-400 border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="jane@example.com">
</div>
@endslot
@slot('code')
<input class="none:placeholder-gray-500 sm:placeholder-red-400 md:placeholder-blue-400 lg:placeholder-green-400 xl:placeholder-orange-400 " placeholder="jane@example.com">
@endslot
@endcomponent

## Focus

To control the placeholder color of an element on focus, add the `focus:` prefix to any existing placeholder color utility. For example, use `focus:placeholder-blue-600` to apply the `placeholder-blue-600` utility on focus.

@component('_partials.code-sample', ['class' => 'text-center p-6'])
<div class="max-w-xs mx-auto">
  <input class="block appearance-none bg-gray-200 placeholder-gray-600 border border-transparent focus:border-gray-300 focus:bg-white focus:placeholder-gray-500 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none" placeholder="jane@example.com">
</div>
@slot('code')
<input class="placeholder-gray-600 focus:placeholder-gray-500 ..." placeholder="jane@example.com">
@endslot
@endcomponent

Focus utilities can also be combined with responsive utilities by adding the responsive `{screen}:` prefix *before* the `focus:` prefix.

```html
<input class="... md:placeholder-gray-900 md:focus:placeholder-red-600 ...">
```

## Customizing

### Placeholder Colors

By default Tailwind makes the entire [default color palette](/docs/customizing-colors#default-color-palette) available as placeholder colors.

You can [customize your color palette](/docs/colors#customizing) by editing `theme.colors` in your `tailwind.config.js` file, or customize just your placeholder colors in the `theme.textColor` section.

@component('_partials.customized-config', ['key' => 'theme'])
- placeholderColor: theme => theme('colors'),
+ placeholderColor: {
+ &nbsp;&nbsp;'primary': '#3490dc',
+ &nbsp;&nbsp;'secondary': '#ffed4a',
+ &nbsp;&nbsp;'danger': '#e3342f',
+ }
@endcomponent

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'placeholder color',
        'property' => 'placeholderColor',
    ],
    'variants' => [
        'responsive',
        'focus',
    ],
])
