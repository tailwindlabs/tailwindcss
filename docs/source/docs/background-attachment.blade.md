---
extends: _layouts.documentation
title: "Background Attachment"
description: "Utilities for controlling how a background image behaves when scrolling."
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
      '.bg-fixed',
      'background-attachment: fixed;',
      'Fix the background image relative to the viewport.',
    ],
    [
      '.bg-local',
      'background-attachment: local;',
      'Scroll the background image with the container and the viewport.',
    ],
    [
      '.bg-scroll',
      'background-attachment: scroll;',
      'Scroll the background image with the viewport but not with the container.',
    ],
  ]
])

## Customizing

### Responsive, Hover, and Focus Variants

By default, only responsive variants are generated for background attachment utilities.

You can control which variants are generated for the background attachment utilities by modifying the `backgroundAttachment` property in the `modules` section of your Tailwind config file.

For example, this config will _also_ generate hover and focus variants:

```js
{
    // ...
    modules: { 
        // ...
        backgroundAttachment: ['responsive', 'hover', 'focus'],
    }
}
```

### Disabling

If you aren't using the background attachment utilities in your project, you can disable them entirely by setting the `backgroundAttachment` property to `false` in the `modules` section of your config file:

```js
{
    // ...
    modules: {
        // ...
        backgroundAttachment: false,
    }
}
```
