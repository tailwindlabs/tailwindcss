---
extends: _layouts.documentation
title: "Background Color"
description: "Utilities for controlling an element's background color."
features:
  responsive: true
  customizable: true
  hover: true
  focus: false
---

@include('_partials.background-color-class-table', [
  'rows' => $page->config['theme']['colors']->flatMap(function ($colors, $name) {
    if (is_string($colors)) {
      return [
        [".bg-{$name}", "background-color: {$colors};"]
      ];
    }

    return collect($colors)->map(function ($value, $key) use ($name) {
      $class = ".bg-{$name}-{$key}";
      $code = "background-color: {$value};";
      return [
        $class,
        $code,
      ];
    });
  })->values()->all()
])

## Usage

Control the background color of an element using the `.bg-{color}` utilities.

@component('_partials.code-sample', ['class' => 'text-center'])
<button type="button" class="bg-blue-500 text-white font-semibold px-4 py-2 rounded">
  Button
</button>
@slot('code')
<button class="bg-blue-500 ...">Button</button>
@endslot
@endcomponent

## Responsive

To control the background color of an element at a specific breakpoint, add a `{screen}:` prefix to any existing background color utility. For example, use `md:bg-green-500` to apply the `bg-green-500` utility at only medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

@component('_partials.responsive-code-sample', ['class' => 'text-center'])
@slot('none')
<button type="button" class="bg-blue-500 text-white font-semibold px-4 py-2 rounded">
  Button
</button>
@endslot
@slot('sm')
<button type="button" class="bg-green-500 text-white font-semibold px-4 py-2 rounded">
  Button
</button>
@endslot
@slot('md')
<button type="button" class="bg-indigo-500 text-white font-semibold px-4 py-2 rounded">
  Button
</button>
@endslot
@slot('lg')
<button type="button" class="bg-red-500 text-white font-semibold px-4 py-2 rounded">
  Button
</button>
@endslot
@slot('xl')
<button type="button" class="bg-black text-white font-semibold px-4 py-2 rounded">
  Button
</button>
@endslot
@slot('code')
<button class="none:bg-blue-500 sm:bg-green-500 md:bg-indigo-500 lg:bg-red-500 xl:bg-black ...">Button</button>
@endslot
@endcomponent

## Hover

To control the background color of an element on hover, add the `hover:` prefix to any existing background color utility. For example, use `hover:bg-blue-500` to apply the `bg-blue-500` utility on hover.

@component('_partials.code-sample', ['class' => 'text-center'])
<button type="button" class="bg-blue-500 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded">
  Hover me
</button>

@slot('code')
<button class="bg-blue-500 hover:bg-blue-700 ...">
  Hover me
</button>
@endslot
@endcomponent

Hover utilities can also be combined with responsive utilities by adding the responsive `{screen}:` prefix *before* the `focus:` prefix.

```html
<button class="... md:bg-blue-500 md:hover:bg-blue-700 ...">Button</button>
```

## Focus

To control the background color of an element on focus, add the `focus:` prefix to any existing background color utility. For example, use `focus:bg-blue-500` to apply the `bg-blue-500` utility on focus.

@component('_partials.code-sample', ['lang' => 'html'])
<div class="max-w-xs w-full mx-auto">
  <input class="border border-gray-400 bg-gray-200 focus:bg-white text-gray-900 appearance-none inline-block w-full border rounded py-3 px-4 focus:outline-none" placeholder="Focus me">
</div>

@slot('code')
<input class="bg-gray-200 focus:bg-white ...">
@endslot
@endcomponent

Focus utilities can also be combined with responsive utilities by adding the responsive `{screen}:` prefix *before* the `focus:` prefix.

```html
<input class="... md:bg-gray-200 md:focus:bg-white ...">
```

## Customizing

### Background Colors

By default Tailwind makes the entire [default color palette](/docs/customizing-colors#default-color-palette) available as background colors.

You can [customize your color palette](/docs/colors#customizing) by editing the `theme.colors` variable in your `tailwind.config.js` file, or customize just your background colors using the `theme.backgroundColor` section of your Tailwind config.

@component('_partials.customized-config', ['key' => 'theme.backgroundColor', 'usesTheme' => true])
- ...theme('colors'),
+ 'primary': '#3490dc',
+ 'secondary': '#ffed4a',
+ 'danger': '#e3342f',
@endcomponent

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'background color',
        'property' => 'backgroundColor',
    ],
    'variants' => [
        'responsive',
        'hover',
        'focus'
    ],
])
