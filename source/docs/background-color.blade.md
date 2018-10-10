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
  'rows' => $page->config['colors']->map(function ($value, $name) {
    $class = ".bg-{$name}";
    $code = "background-color: {$value};";
    $color = implode(' ', array_reverse(explode('-', $name)));
    $description = "Set the background color of an element to {$color}.";
    return [
      $class,
      $code,
      $description,
    ];
  })->values()->all()
])

## Usage

Control the background color of an element using the `.bg-{color}` utilities.

@component('_partials.code-sample', ['class' => 'text-center'])
<button type="button" class="bg-blue text-white font-semibold px-4 py-2 rounded">
  Button
</button>
@slot('code')
<button class="bg-blue ...">Button</button>
@endslot
@endcomponent

## Responsive

To control the background color of an element at a specific breakpoint, add a `{screen}:` prefix to any existing background color utility. For example, use `md:bg-green` to apply the `bg-green` utility at only medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

@component('_partials.responsive-code-sample', ['class' => 'text-center'])
@slot('none')
<button type="button" class="bg-blue text-white font-semibold px-4 py-2 rounded">
  Button
</button>
@endslot
@slot('sm')
<button type="button" class="bg-green text-white font-semibold px-4 py-2 rounded">
  Button
</button>
@endslot
@slot('md')
<button type="button" class="bg-indigo text-white font-semibold px-4 py-2 rounded">
  Button
</button>
@endslot
@slot('lg')
<button type="button" class="bg-red text-white font-semibold px-4 py-2 rounded">
  Button
</button>
@endslot
@slot('xl')
<button type="button" class="bg-black text-white font-semibold px-4 py-2 rounded">
  Button
</button>
@endslot
@slot('code')
<button class="none:bg-blue sm:bg-green md:bg-indigo lg:bg-red xl:bg-black ...">Button</button>
@endslot
@endcomponent

## Hover

To control the background color of an element on hover, add the `hover:` prefix to any existing background color utility. For example, use `hover:bg-blue` to apply the `bg-blue` utility on hover.

@component('_partials.code-sample', ['class' => 'text-center'])
<button type="button" class="bg-blue hover:bg-blue-dark text-white font-semibold px-4 py-2 rounded">
  Hover me
</button>

@slot('code')
<button class="bg-blue hover:bg-blue-dark ...">
  Hover me
</button>
@endslot
@endcomponent

Hover utilities can also be combined with responsive utilities by adding the responsive `{screen}:` prefix *before* the `focus:` prefix.

```html
<button class="... md:bg-blue md:hover:bg-blue-dark ...">Button</button>
```

## Focus

To control the background color of an element on focus, add the `focus:` prefix to any existing background color utility. For example, use `focus:bg-blue` to apply the `bg-blue` utility on focus.

@component('_partials.code-sample', ['lang' => 'html'])
<div class="max-w-xs w-full mx-auto">
  <input class="border border-grey-light bg-grey-lighter focus:bg-white text-black appearance-none inline-block w-full border rounded py-3 px-4 focus:outline-none" placeholder="Focus me">
</div>

@slot('code')
<input class="bg-grey-lighter focus:bg-white ...">
@endslot
@endcomponent

Focus utilities can also be combined with responsive utilities by adding the responsive `{screen}:` prefix *before* the `focus:` prefix.

```html
<input class="... md:bg-grey-lighter md:focus:bg-white ...">
```

## Customizing

### Background Colors

By default Tailwind makes the entire [default color palette](/docs/colors#default-color-palette) available as background colors.

You can [customize your color palette](/docs/colors#customizing) by editing the `colors` variable in your Tailwind config file, or customize just your background colors using the `backgroundColors` section of your Tailwind config.

@component('_partials.customized-config', ['key' => 'backgroundColors'])
- ...colors,
+ 'primary': '#3490dc',
+ 'secondary': '#ffed4a',
+ 'danger': '#e3342f',
@endcomponent

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'background color',
        'property' => 'backgroundColors',
    ],
    'variants' => [
        'responsive',
        'hover',
        'focus'
    ],
])
