---
extends: _layouts.documentation
title: "Placeholder Opacity"
description: "Utilities for controlling the opacity of an element's placeholder color."
featureVersion: "v1.4.0+"
---

@include('_partials.class-table', [
  'scroll' => true,
  'rows' => $page->config['theme']['placeholderOpacity']->map(function ($value, $name) {
    $class = $name = ".placeholder-opacity-{$name}";
    $code = "--placeholder-opacity: {$value};";
    return [$class, $code];
  })
])

## Usage

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

## Responsive

To control an element's placeholder color opacity at a specific breakpoint, add a `{screen}:` prefix to any existing placeholder color opacity utility. For example, use `md:placeholder-opacity-50` to apply the `placeholder-opacity-50` utility at only medium screen sizes and above.

```html
<input class="placeholder-opacity-75 md:placeholder-opacity-50 placeholder-gray-500" placeholder="jane@example.com">
```

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

## Customizing

To customize the opacity values for all opacity-related utilities at once, use the `opacity` section of your `tailwind.config.js` theme configuration:

@component('_partials.customized-config', ['key' => 'theme.extend.opacity'])
+ '10': '0.1',
+ '20': '0.2',
+ '95': '0.95',
@endcomponent

If you want to customize only the placeholder opacity utilities, use the `placeholderOpacity` section:

@component('_partials.customized-config', ['key' => 'theme.extend.placeholderOpacity'])
+ '10': '0.1',
+ '20': '0.2',
+ '95': '0.95',
@endcomponent

Learn more about customizing the default theme in the [theme customization documentation](/docs/theme#customizing-the-default-theme).

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'placeholder opacity',
        'property' => 'placeholderOpacity',
    ],
    'variants' => $page->config['variants']['placeholderOpacity']->all(),
])
