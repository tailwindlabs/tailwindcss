---
extends: _layouts.documentation
title: "Border Color"
description: "Utilities for controlling the color of an element's borders."
features:
  responsive: true
  customizable: true
  hover: true
  focus: false
---

@include('_partials.border-color-class-table', [
  'rows' => $page->config['colors']->map(function ($value, $name) {
    $class = ".border-{$name}";
    $code = "border-color: {$value};";
    $color = implode(' ', array_reverse(explode('-', $name)));
    $description = "Set the border color of an element to {$color}.";
    return [
      $class,
      $code,
      $description,
    ];
  })->values()->all()
])

## Usage

Control the border color of an element using the `.border-{color}` utilities.

@component('_partials.code-sample', ['class' => 'text-center'])
<div class="max-w-xs w-full mx-auto">
  <input class="border border-red focus:border-blue bg-white text-black appearance-none block w-full text-black border rounded py-3 px-4 focus:outline-none" placeholder="Your email">
</div>
@slot('code')
<input class="border border-red ...">
@endslot
@endcomponent

## Responsive

To control the border color of an element at a specific breakpoint, add a `{screen}:` prefix to any existing border color utility. For example, use `md:border-green` to apply the `border-green` utility at only medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

@component('_partials.responsive-code-sample', ['class' => 'text-center'])
@slot('none')
<button class="border-2 border-blue bg-transparent text-blue-dark py-2 px-4 font-semibold rounded">
  Button
</button>
@endslot
@slot('sm')
<button class="border-2 border-green bg-transparent text-green-dark py-2 px-4 font-semibold rounded">
  Button
</button>
@endslot
@slot('md')
<button class="border-2 border-indigo bg-transparent text-indigo-dark py-2 px-4 font-semibold rounded">
  Button
</button>
@endslot
@slot('lg')
<button class="border-2 border-red bg-transparent text-red-dark py-2 px-4 font-semibold rounded">
  Button
</button>
@endslot
@slot('xl')
<button class="border-2 border-black bg-transparent text-black py-2 px-4 font-semibold rounded">
  Button
</button>
@endslot
@slot('code')
<button class="none:border-blue sm:border-green md:border-indigo lg:border-red xl:border-black ...">
  Button
</button>
@endslot
@endcomponent

## Hover

To control the border color of an element on hover, add the `hover:` prefix to any existing border color utility. For example, use `hover:border-blue` to apply the `border-blue` utility on hover.

@component('_partials.code-sample', ['class' => 'text-center'])
<button class="border-2 border-blue hover:border-red bg-transparent text-blue-dark hover:text-red-dark py-2 px-4 font-semibold rounded">
  Button
</button>

@slot('code')
<button class="border-2 border-blue hover:border-red ...">
  Button
</button>
@endslot
@endcomponent

Hover utilities can also be combined with responsive utilities by adding the responsive `{screen}:` prefix *before* the `focus:` prefix.

```html
<button class="... md:border-blue md:hover:border-blue-dark ...">Button</button>
```

## Focus

To control the border color of an element on focus, add the `focus:` prefix to any existing border color utility. For example, use `focus:border-blue` to apply the `border-blue` utility on focus.

@component('_partials.code-sample', ['lang' => 'html'])
<div class="max-w-xs w-full mx-auto">
  <input class="border border-grey-light focus:border-blue bg-white text-black appearance-none inline-block w-full text-black border rounded py-3 px-4 focus:outline-none" placeholder="Focus me">
</div>

@slot('code')
<input class="border-grey-light focus:border-blue ...">
@endslot
@endcomponent

Focus utilities can also be combined with responsive utilities by adding the responsive `{screen}:` prefix *before* the `focus:` prefix.

```html
<input class="... md:border-grey-lighter md:focus:border-white ...">
```

## Customizing

### Border Colors

By default Tailwind makes the entire [default color palette](/docs/colors#default-color-palette) available as border colors.

You can [customize your color palette](/docs/colors#customizing) by editing the `colors` variable in your Tailwind config file, or customize just your border colors using the `borderColors` section of your Tailwind config.

@component('_partials.customized-config', ['key' => 'borderColors'])
- ...colors,
+ 'primary': '#3490dc',
+ 'secondary': '#ffed4a',
+ 'danger': '#e3342f',
@endcomponent

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'border color',
        'property' => 'borderColors',
    ],
    'variants' => [
        'responsive',
        'hover',
        'focus',
    ],
])
