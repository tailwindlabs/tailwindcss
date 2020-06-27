---
extends: _layouts.documentation
title: "Text Opacity"
description: "Utilities for controlling the opacity of an element's text color."
featureVersion: "v1.4.0+"
---

@include('_partials.class-table', [
  'scroll' => true,
  'rows' => $page->config['theme']['textOpacity']->map(function ($value, $name) {
    $class = $name = ".text-opacity-{$name}";
    $code = "--text-opacity: {$value};";
    return [$class, $code];
  })
])

## Usage

Control the opacity of an element's text color using the `.text-opacity-{amount}` utilities.

@component('_partials.code-sample')
<div class="space-y-4">
  @foreach ($page->config['theme']['backgroundOpacity']->reverse() as $name => $value)
  <p class="font-semibold text-xl text-purple-700 text-opacity-{{ $name }}">The quick brown fox jumped over the lazy dog.</p>
  @endforeach
</div>
@slot('code')
@foreach ($page->config['theme']['opacity']->reverse() as $name => $value)
<p class="text-purple-700 text-opacity-{{ $name }}">The quick brown fox ...</p>
@endforeach
@endslot
@endcomponent

Note that because these utilities are implemented using CSS custom properties, a `.text-{color}` utility must be present on the same element for them to work.

@component('_partials.tip-bad')
Don't try to use text opacity utilities on an inherited text color
@endcomponent

```html
<div class="text-black">
  <div class="text-opacity-50">...</div>
</div>
```

@component('_partials.tip-good')
Do make sure to add a text color utility to the same element explicitly
@endcomponent

```html
<div class="text-black">
  <div class="text-black text-opacity-50">...</div>
</div>
```

## Responsive

To control an element's text color opacity at a specific breakpoint, add a `{screen}:` prefix to any existing text color opacity utility. For example, use `md:text-opacity-50` to apply the `text-opacity-50` utility at only medium screen sizes and above.

```html
<div class="text-blue-500 text-opacity-75 md:text-opacity-50">
  <!-- ... -->
</div>
```

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

## Customizing

To customize the opacity values for all opacity-related utilities at once, use the `opacity` section of your `tailwind.config.js` theme configuration:

@component('_partials.customized-config', ['key' => 'theme.extend.opacity'])
+ '10': '0.1',
+ '20': '0.2',
+ '95': '0.95',
@endcomponent

If you want to customize only the text opacity utilities, use the `textOpacity` section:

@component('_partials.customized-config', ['key' => 'theme.extend.textOpacity'])
+ '10': '0.1',
+ '20': '0.2',
+ '95': '0.95',
@endcomponent

Learn more about customizing the default theme in the [theme customization documentation](/docs/theme#customizing-the-default-theme).

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'text opacity',
        'property' => 'textOpacity',
    ],
    'variants' => $page->config['variants']['textOpacity']->all(),
])
