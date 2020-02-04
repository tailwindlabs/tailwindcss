---
extends: _layouts.documentation
title: "Translate"
description: "Utilities for translating elements with transform."
features:
  responsive: true
  customizable: true
  hover: false
  focus: false
---

@include('_partials.class-table', [
  'scroll' => true,
  'rows' => collect([
    ['translate-x', ['--transform-translate-x']],
    ['translate-y', ['--transform-translate-y']],
  ])->flatMap(function ($translate) use ($page) {
    return $page->config['theme']['translate']->map(function ($value, $name) use ($translate) {
      $class = starts_with($name, '-')
        ? ".-{$translate[0]}-".substr($name, 1)
        : ".{$translate[0]}-{$name}";
      $code = collect($translate[1])->map(function ($property) use ($value) {
        return "{$property}: {$value};";
      })->implode("\n");
      return [$class, $code];
    })->values();
  })
])

## Usage

Translate an element by first enabling transforms with the `transform` utility, then specifying the translate direction and distance using the `translate-x-{amount}` and `translate-y-{amount}` utilities.

@component('_partials.code-sample', ['class' => 'bg-white lg:flex justify-around items-center text-sm py-12'])
<img class="h-16 w-16 rounded transform translate-y-6" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80">
<img class="h-16 w-16 rounded transform -translate-y-6" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80">
<img class="h-16 w-16 rounded transform translate-y-0" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80">
@slot('code')
<img class="transform translate-y-6 ...">
<img class="transform -translate-y-6 ...">
<img class="transform translate-y-0 ...">
@endslot
@endcomponent

Note that because Tailwind implements transforms using [CSS custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties), **the transform utilities are not supported in older browsers like IE11**. If you need transforms for your project and need to support older browsers, [add your own utilities](/docs/adding-new-utilities) or other custom CSS.

## Responsive

To control the scale of an element at a specific breakpoint, add a `{screen}:` prefix to any existing scale utility. For example, use `md:scale-75` to apply the `scale-75` utility at only medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

@component('_partials.responsive-code-sample', ['class' => 'bg-white flex justify-center items-center py-12'])
@slot('none')
<img class="h-16 w-16 rounded transform translate-y-6" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80">
@endslot
@slot('sm')
<img class="h-16 w-16 rounded transform -translate-y-6" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80">
@endslot
@slot('md')
<img class="h-16 w-16 rounded transform translate-y-2" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80">
@endslot
@slot('lg')
<img class="h-16 w-16 rounded transform -translate-y-8" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80">
@endslot
@slot('xl')
<img class="h-16 w-16 rounded transform translate-y-0" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80">
@endslot
@slot('code')
<img class="transform none:translate-y-6 sm:-translate-y-6 md:translate-y-2 lg:-translate-y-8 xl:translate-y-0...">
@endslot
@endcomponent

## Customizing

### Translate scale

By default Tailwind provides fixed value translate utilities that match our [spacing scale](/docs/customizing-spacing), as well as 50% and 100% variations for translating relative to the element's size.

You can customize the global spacing scale in the `theme.spacing` or `theme.extend.spacing` sections of your `tailwind.config.js` file:

@component('_partials.customized-config', ['key' => 'theme.extend.spacing'])
+ '72': '18rem',
+ '84': '21rem',
+ '96': '24rem',
@endcomponent

To customize the translate scale separately, use the `theme.translate` section of your `tailwind.config.js` file.

@component('_partials.customized-config', ['key' => 'theme.extend.translate'])
+ '1/7': '14.2857143%',
+ '2/7': '28.5714286%',
+ '3/7': '42.8571429%',
+ '4/7': '57.1428571%',
+ '5/7': '71.4285714%',
+ '6/7': '85.7142857%',
@endcomponent

Learn more about customizing the default theme in the [theme customization documentation](/docs/theme#customizing-the-default-theme).

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'translate',
        'property' => 'translate',
    ],
    'variants' => [
        'responsive',
        'hover',
        'focus',
    ],
])
