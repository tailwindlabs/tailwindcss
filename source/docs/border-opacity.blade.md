---
extends: _layouts.documentation
title: "Border Opacity"
description: "Utilities for controlling the opacity of an element's border color."
featureVersion: "v1.4.0+"
---

@include('_partials.class-table', [
  'scroll' => true,
  'rows' => $page->config['theme']['borderOpacity']->map(function ($value, $name) {
    $class = $name = ".border-opacity-{$name}";
    $code = "--border-opacity: {$value};";
    return [$class, $code];
  })
])

## Usage

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

## Responsive

To control an element's border color opacity at a specific breakpoint, add a `{screen}:` prefix to any existing border color opacity utility. For example, use `md:border-opacity-50` to apply the `border-opacity-50` utility at only medium screen sizes and above.

```html
<div class="border-2 border-blue-500 border-opacity-75 md:border-opacity-50">
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

If you want to customize only the border opacity utilities, use the `borderOpacity` section:

@component('_partials.customized-config', ['key' => 'theme.extend.borderOpacity'])
+ '10': '0.1',
+ '20': '0.2',
+ '95': '0.95',
@endcomponent

Learn more about customizing the default theme in the [theme customization documentation](/docs/theme#customizing-the-default-theme).

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'border opacity',
        'property' => 'borderOpacity',
    ],
    'variants' => $page->config['variants']['borderOpacity']->all(),
])
