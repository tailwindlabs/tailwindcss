---
extends: _layouts.documentation
title: "Text Color"
description: "Utilities for controlling the text color of an element."
features:
  responsive: true
  customizable: true
  hover: true
  focus: false
---

@include('_partials.text-color-class-table', [
  'rows' => $page->config['colors']->map(function ($value, $name) {
    $class = ".text-{$name}";
    $code = "color: {$value};";
    $color = implode(' ', array_reverse(explode('-', $name)));
    $description = "Set the text color of an element to {$color}.";
    return [
      $class,
      $code,
      $description,
    ];
  })->values()->all()
])

## Usage

Control the text color of an element using the `.text-{color}` utilities.

@component('_partials.code-sample', ['class' => 'text-center'])

<div class="text-purple text-xl truncate">
  The quick brown fox jumped over the lazy dog.
</div>
@slot('code')
<input class="text-purple ...">
@endslot
@endcomponent

## Responsive

To control the text color of an element at a specific breakpoint, add a `{screen}:` prefix to any existing text color utility. For example, use `md:text-green` to apply the `text-green` utility at only medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

@component('_partials.responsive-code-sample', ['class' => 'text-center'])
@slot('none')
<div class="text-blue-dark text-xl truncate">
  The quick brown fox jumped over the lazy dog.
</div>
@endslot
@slot('sm')
<div class="text-green-dark text-xl truncate">
  The quick brown fox jumped over the lazy dog.
</div>
@endslot
@slot('md')
<div class="text-indigo-dark text-xl truncate">
  The quick brown fox jumped over the lazy dog.
</div>
@endslot
@slot('lg')
<div class="text-red-dark text-xl truncate">
  The quick brown fox jumped over the lazy dog.
</div>
@endslot
@slot('xl')
<div class="text-black text-xl truncate">
  The quick brown fox jumped over the lazy dog.
</div>
@endslot
@slot('code')
<div class="none:text-blue-dark sm:text-green-dark md:text-indigo-dark lg:text-red-dark xl:text-black ...">
  The quick brown fox...
</div>
@endslot
@endcomponent

## Hover

To control the text color of an element on hover, add the `hover:` prefix to any existing text color utility. For example, use `hover:text-blue` to apply the `text-blue` utility on hover.

@component('_partials.code-sample', ['class' => 'text-center'])
<button class="border-2 border-blue hover:border-red bg-transparent text-blue-dark hover:text-red-dark py-2 px-4 font-semibold rounded">
  Button
</button>

@slot('code')
<button class="text-blue hover:text-red ...">
  Button
</button>
@endslot
@endcomponent

Hover utilities can also be combined with responsive utilities by adding the responsive `{screen}:` prefix *before* the `hover:` prefix.

```html
<button class="... md:text-blue md:hover:text-blue-dark ...">Button</button>
```

## Focus

To control the text color of an element on focus, add the `focus:` prefix to any existing text color utility. For example, use `focus:text-blue` to apply the `text-blue` utility on focus.

@component('_partials.code-sample', ['lang' => 'html'])
<div class="max-w-xs w-full mx-auto">
  <input class="border border-grey-light focus:border-red bg-white text-black appearance-none inline-block w-full focus:text-red border rounded py-3 px-4 focus:outline-none" placeholder="Focus me" value="Focus me">
</div>

@slot('code')
<input class="text-black focus:text-red ...">
@endslot
@endcomponent

Focus utilities can also be combined with responsive utilities by adding the responsive `{screen}:` prefix *before* the `focus:` prefix.

```html
<input class="... md:text-black md:focus:text-red ...">
```

## Customizing

### Text Colors

By default Tailwind makes the entire [default color palette](/docs/colors#default-color-palette) available as text colors.

You can [customize your color palette](/docs/colors#customizing) by editing the `colors` variable in your Tailwind config file, or customize just your text colors using the `textColors` section of your Tailwind config.

@component('_partials.customized-config', ['key' => 'textColors'])
- ...colors,
+ 'primary': '#3490dc',
+ 'secondary': '#ffed4a',
+ 'danger': '#e3342f',
@endcomponent

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'text color',
        'property' => 'textColors',
    ],
    'variants' => [
        'responsive',
        'hover',
        'focus',
    ],
])
