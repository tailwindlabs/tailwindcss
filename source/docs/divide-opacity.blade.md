---
extends: _layouts.documentation
title: "Divide Opacity"
description: "Utilities for controlling the opacity borders between elements."
featureVersion: "v1.4.0+"
---

@include('_partials.class-table', [
  'scroll' => true,
  'rows' => $page->config['theme']['divideOpacity']->map(function ($value, $name) {
    $class = $name = ".divide-opacity-{$name}";
    $code = "--divide-opacity: {$value};";
    return [$class, $code];
  })
])

## Usage

Control the opacity of borders between elements using the `.divide-opacity-{amount}` utilities.

@component('_partials.code-sample', ['style' => "background-image: url('/img/transparent-bg.svg')"])
<div class="divide-y-4 divide-black divide-opacity-25">
  <div class="text-center py-2">1</div>
  <div class="text-center py-2">2</div>
  <div class="text-center py-2">3</div>
</div>

@slot('code')
<div class="divide-y-4 divide-black divide-opacity-25">
  <div class="text-center py-2">1</div>
  <div class="text-center py-2">2</div>
  <div class="text-center py-2">3</div>
</div>
@endslot
@endcomponent

## Responsive

To control the opacity of borders between elements at a specific breakpoint, add a `{screen}:` prefix to any existing divide opacity utility. For example, use `md:divide-opacity-50` to apply the `divide-opacity-50` utility at only medium screen sizes and above.

```html
<div class="divide-y-2 divide-blue-500 divide-opacity-75 md:divide-opacity-50">
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

If you want to customize only the divide opacity utilities, use the `divideOpacity` section:

@component('_partials.customized-config', ['key' => 'theme.extend.divideOpacity'])
+ '10': '0.1',
+ '20': '0.2',
+ '95': '0.95',
@endcomponent

Learn more about customizing the default theme in the [theme customization documentation](/docs/theme#customizing-the-default-theme).

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'divide opacity',
        'property' => 'divideOpacity',
    ],
    'variants' => $page->config['variants']['divideOpacity']->all(),
])
