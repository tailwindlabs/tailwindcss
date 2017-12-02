---
extends: _layouts.documentation
title: "Background Size"
description: "Utilities for controlling the background size of an element's background image."
features:
  responsive: true
  customizable: false
  hover: false
  focus: false
---

@include('_partials.work-in-progress')

@include('_partials.class-table', [
  'rows' => [
    [
      '.bg-cover',
      'background-size: cover;',
      "Scale the image until it fills the background layer.",
    ],
    [
      '.bg-contain',
      'background-size: contain;',
      "Scale the image to the outer edges without cropping or stretching.",
    ],
  ]
])

## Customizing

### Responsive, Hover, and Focus Variants

By default, no hover, focus, or group-hover variants are generated for background size utilities.

You can control which variants are generated for the background size utilities by modifying the `backgroundSize` property in the `modules` section of your Tailwind config file.

For example, this config will _also_ generate hover and focus variants:

```js
{
    // ...
    modules: { 
        // ...
        backgroundSize: ['responsive', 'hover', 'focus'],
    }
}
```
k
### Disabling

If you aren't using the background size utilities in your project, you can disable them entirely by setting the `backgroundSize` property to `false` in the `modules` section of your config file:

```js
{
    // ...
    modules: {
        // ...
        backgroundSize: false,
    }
}
```
