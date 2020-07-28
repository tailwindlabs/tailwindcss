---
extends: _layouts.documentation
title: "Transition Property"
description: "Utilities for controlling which CSS properties transition."
featureVersion: "v1.2.0+"
---

@include('_partials.class-table', [
  'scroll' => true,
  'rows' => $page->config['theme']['transitionProperty']->map(function ($value, $name) {
    $class = $name === 'default' ? '.transition' : ".transition-{$name}";
    $code = "transition-property: {$value};";
    return [$class, $code];
  })
])

## Usage

Use the `transition-{properties}` utilities to specify which properties should transition when they change.

@component('_partials.code-sample', ['class' => 'bg-white text-center py-12'])
<button class="transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110 bg-blue-500 hover:bg-red-500 text-white font-bold py-2 px-4 rounded">
  Hover me
</button>
@slot('code')
<button class="transition duration-500 ease-in-out bg-blue-500 hover:bg-red-500 transform hover:-translate-y-1 hover:scale-110 ...">
  Hover me
</button>
@endslot
@endcomponent


## Prefers-reduced-motion

You can conditionally apply animations and transitions using the `motion-safe` and `motion-reduce` variants:

```html
<button class="transition transform hover:-translate-y-1 motion-reduce:transition-none motion-reduce:transform-none ...">
  Hover me
</button>
```

**These variants are not enabled by default**, but you can enable them in the `variants` section of your `tailwind.config.js` file:

```js
// tailwind.config.js
module.exports = {
  // ...
  variants: {
    transitionProperty: ['responsive', 'motion-safe', 'motion-reduce']
  }
}
```

Learn more in the [variants documentation](/docs/pseudo-class-variants#motion-safe-v1-6-0).

## Responsive

To change which properties of an element transition at a specific breakpoint, add a `{screen}:` prefix to any existing transition-property utility. For example, use `md:transition-colors` to apply the `transition-colors` utility at only medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

## Customizing

### Property values

By default Tailwind provides transition-property utilities for seven common property combinations. You change, add, or remove these by customizing the `transitionProperty` section of your Tailwind theme config.

@component('_partials.customized-config', ['key' => 'theme.extend.transitionProperty'])
+ 'height': 'height',
+ 'spacing': 'margin, padding',
@endcomponent

Learn more about customizing the default theme in the [theme customization documentation](/docs/theme#customizing-the-default-theme).

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'transition-property',
        'property' => 'transitionProperty',
    ],
    'variants' => [
        'responsive',
    ],
])
