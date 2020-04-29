---
extends: _layouts.documentation
title: "Background Opacity"
description: "Utilities for controlling the opacity of an element's background color."
featureVersion: "v1.4.0+"
---

@include('_partials.class-table', [
  'scroll' => true,
  'rows' => $page->config['theme']['backgroundOpacity']->map(function ($value, $name) {
    $class = $name = ".bg-opacity-{$name}";
    $code = "--bg-opacity: {$value};";
    return [$class, $code];
  })
])

## Usage

Control the opacity of an element's background color using the `.bg-opacity-{amount}` utilities.

@component('_partials.code-sample', ['style' => "background-image: url('/img/transparent-bg.svg')"])
<div class="flex justify-around">
  @foreach ($page->config['theme']['backgroundOpacity']->reverse() as $name => $value)
    <div class="h-16 w-16 rounded bg-blue-500 bg-opacity-{{ $name }}">
    </div>
  @endforeach
</div>
@slot('code')
@foreach ($page->config['theme']['opacity']->reverse() as $name => $value)
<div class="bg-blue-500 bg-opacity-{{ $name }}"></div>
@endforeach
@endslot
@endcomponent

## Responsive

To control an element's background color opacity at a specific breakpoint, add a `{screen}:` prefix to any existing background color opacity utility. For example, use `md:bg-opacity-50` to apply the `bg-opacity-50` utility at only medium screen sizes and above.

```html
<div class="bg-blue-500 bg-opacity-75 md:bg-opacity-50">
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

If you want to customize only the background opacity utilities, use the `backgroundOpacity` section:

@component('_partials.customized-config', ['key' => 'theme.extend.backgroundOpacity'])
+ '10': '0.1',
+ '20': '0.2',
+ '95': '0.95',
@endcomponent

Learn more about customizing the default theme in the [theme customization documentation](/docs/theme#customizing-the-default-theme).

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'background opacity',
        'property' => 'backgroundOpacity',
    ],
    'variants' => $page->config['variants']['backgroundOpacity']->all(),
])
