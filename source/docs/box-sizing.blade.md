---
extends: _layouts.documentation
title: "Box Sizing"
description: "Utilities for controlling how the browser should calculate an element's total size."
featureVersion: "v1.2.0+"
---

@include('_partials.class-table', [
  'rows' => [
    [
      '.box-border',
      'box-sizing: border-box;',
    ],
    [
      '.box-content',
      'box-sizing: content-box;',
    ],
  ]
])

## Include borders and padding

Use `box-border` to set an element's `box-sizing` to `border-box`, telling the browser to include the element's borders and padding when you give it a height or width.

This means a 100px &times; 100px element with a 2px border and 4px of padding on all sides will be rendered as 100px &times; 100px, with an internal content area of 88px &times; 88px.

Tailwind makes this the default for all elements in our [preflight base styles](/docs/preflight).

@component('_partials.code-sample', ['class' => 'bg-white p-8 flex items-center justify-around'])
<div class="box-border h-20 w-32 p-4 border-4 border-gray-400 bg-gray-200">
  <div class="h-full w-full bg-gray-400"></div>
</div>
@slot('code')
<div class="box-border h-20 w-32 p-4 border-4 border-gray-400 bg-gray-200">
  <div class="h-full w-full bg-gray-400"></div>
</div>
@endslot
@endcomponent


## Exclude borders and padding

Use `box-content` to set an element's `box-sizing` to `content-box`, telling the browser to add borders and padding on top of the element's specified width or height.

This means a 100px &times; 100px element with a 2px border and 4px of padding on all sides will actually be rendered as 112px &times; 112px, with an internal content area of 100px &times; 100px.

@component('_partials.code-sample', ['class' => 'bg-white p-8 flex items-center justify-around'])
<div class="box-content h-20 w-32 p-4 border-4 border-gray-400 bg-gray-200">
  <div class="h-full w-full bg-gray-400"></div>
</div>
@slot('code')
<div class="box-content h-20 w-32 p-4 border-4 border-gray-400 bg-gray-200">
  <div class="h-full w-full bg-gray-400"></div>
</div>
@endslot
@endcomponent

## Responsive

To control the box-sizing at a specific breakpoint, add a `{screen}:` prefix to any existing box-sizing utility. For example, use `md:box-content` to apply the `box-content` utility at only medium screen sizes and above.

```html
<div class="box-border md:box-content ...">
  <!-- ... -->
</div>
```

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

## Customizing

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'box-sizing',
        'property' => 'boxSizing',
    ],
    'variants' => $page->config['variants']['boxSizing']->all(),
])
