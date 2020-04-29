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
  'rows' => $page->config['theme']['colors']->flatMap(function ($colors, $name) {
    if (is_string($colors)) {
      return [
        [".border-{$name}", "border-color: {$colors};"]
      ];
    }

    return collect($colors)->map(function ($value, $key) use ($name) {
      $class = ".border-{$name}-{$key}";
      $code = "border-color: {$value};";
      return [
        $class,
        $code,
      ];
    });
  })->values()->all()
])

## Usage

Control the border color of an element using the `.border-{color}` utilities.

@component('_partials.code-sample', ['class' => 'text-center'])
<div class="max-w-xs w-full mx-auto">
  <input class="border border-red-500 bg-white text-gray-900 appearance-none block w-full text-gray-900 border rounded py-3 px-4 focus:outline-none" placeholder="Your email">
</div>
@slot('code')
<input class="border border-red-500 ...">
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

Control the opacity of an element's background color using the `.border-opacity-{amount}` utilities.

@component('_partials.code-sample', ['style' => "background-image: url('/img/transparent-bg.svg')"])
<div class="flex justify-around" >
  @foreach ($page->config['theme']['backgroundOpacity']->reverse() as $name => $value)
    <div class="h-16 w-16 rounded border-4 border-blue-500 border-opacity-{{ $name }}">
    </div>
  @endforeach
</div>
@slot('code')
@foreach ($page->config['theme']['opacity']->reverse() as $name => $value)
<div class="bg-blue-500 bg-opacity-{{ $name }}"></div>
@endforeach
@endslot
@endcomponent

Learn more in the [border opacity documentation](/docs/border-opacity).

## Responsive

To control the border color of an element at a specific breakpoint, add a `{screen}:` prefix to any existing border color utility. For example, use `md:border-green-500` to apply the `border-green-500` utility at only medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

@component('_partials.responsive-code-sample', ['class' => 'text-center'])
@slot('none')
<button class="border-2 border-blue-500 bg-transparent text-blue-700 py-2 px-4 font-semibold rounded">
  Button
</button>
@endslot
@slot('sm')
<button class="border-2 border-green-500 bg-transparent text-green-700 py-2 px-4 font-semibold rounded">
  Button
</button>
@endslot
@slot('md')
<button class="border-2 border-indigo-500 bg-transparent text-indigo-700 py-2 px-4 font-semibold rounded">
  Button
</button>
@endslot
@slot('lg')
<button class="border-2 border-red-500 bg-transparent text-red-700 py-2 px-4 font-semibold rounded">
  Button
</button>
@endslot
@slot('xl')
<button class="border-2 border-black bg-transparent text-gray-900 py-2 px-4 font-semibold rounded">
  Button
</button>
@endslot
@slot('code')
<button class="none:border-blue-500 sm:border-green-500 md:border-indigo-500 lg:border-red-500 xl:border-black ...">
  Button
</button>
@endslot
@endcomponent

## Hover

To control the border color of an element on hover, add the `hover:` prefix to any existing border color utility. For example, use `hover:border-blue-500` to apply the `border-blue-500` utility on hover.

@component('_partials.code-sample', ['class' => 'text-center'])
<button class="border-2 border-blue-500 hover:border-red-500 bg-transparent text-blue-700 hover:text-red-700 py-2 px-4 font-semibold rounded">
  Button
</button>

@slot('code')
<button class="border-2 border-blue-500 hover:border-red-500 ...">
  Button
</button>
@endslot
@endcomponent

Hover utilities can also be combined with responsive utilities by adding the responsive `{screen}:` prefix *before* the `focus:` prefix.

```html
<button class="... md:border-blue-500 md:hover:border-blue-700 ...">Button</button>
```

## Focus

To control the border color of an element on focus, add the `focus:` prefix to any existing border color utility. For example, use `focus:border-blue-500` to apply the `border-blue-500` utility on focus.

@component('_partials.code-sample', ['lang' => 'html'])
<div class="max-w-xs w-full mx-auto">
  <input class="border border-gray-400 focus:border-blue-500 bg-white text-gray-900 appearance-none inline-block w-full text-gray-900 border rounded py-3 px-4 focus:outline-none" placeholder="Focus me">
</div>

@slot('code')
<input class="border-gray-400 focus:border-blue-500 ...">
@endslot
@endcomponent

Focus utilities can also be combined with responsive utilities by adding the responsive `{screen}:` prefix *before* the `focus:` prefix.

```html
<input class="... md:border-gray-200 md:focus:border-white ...">
```

---

## Customizing

### Border Colors

By default Tailwind makes the entire [default color palette](/docs/customizing-colors#default-color-palette) available as border colors.

You can [customize your color palette](/docs/colors#customizing) by editing the `theme.colors` section of your `tailwind.config.js` file, or customize just your border colors using the `theme.borderColor` section.

@component('_partials.customized-config', ['key' => 'theme.borderColor', 'usesTheme' => true])
- ...theme('colors'),
  default: theme('colors.gray.300', 'currentColor'),
+ 'primary': '#3490dc',
+ 'secondary': '#ffed4a',
+ 'danger': '#e3342f',
@endcomponent

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'border color',
        'property' => 'borderColor',
    ],
    'variants' => [
        'responsive',
        'hover',
        'focus',
    ],
])
