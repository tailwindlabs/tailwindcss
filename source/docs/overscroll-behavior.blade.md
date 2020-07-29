---
extends: _layouts.documentation
title: "Overscroll Behavior"
description: "Utilities for controlling how the browser behaves when reaching the boundary of a scrolling area."
featureVersion: "v1.6.0+"
---

@include('_partials.class-table', [
  'rows' => [
    [
      '.overscroll-auto',
      'overscroll-behavior: auto;',
    ],
    [
      '.overscroll-contain',
      'overscroll-behavior: contain;',
    ],
    [
      '.overscroll-none',
      'overscroll-behavior: none;',
    ],
    [
      '.overscroll-y-auto',
      'overscroll-behavior-y: auto;',
    ],
    [
      '.overscroll-y-contain',
      'overscroll-behavior-y: contain;',
    ],
    [
      '.overscroll-y-none',
      'overscroll-behavior-y: none;',
    ],
    [
      '.overscroll-x-auto',
      'overscroll-behavior-x: auto;',
    ],
    [
      '.overscroll-x-contain',
      'overscroll-behavior-x: contain;',
    ],
    [
      '.overscroll-x-none',
      'overscroll-behavior-x: none;',
    ],
  ]
])

## Auto

Use `overscroll-auto` to make it possible for the user to continue scrolling a parent scroll area when they reach the boundary of the primary scroll area.

@component('_partials.code-sample')
<div class="overscroll-auto overflow-auto h-32 bg-gray-300 text-gray-700 p-4">
  <p>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eleifend rutrum auctor. Phasellus convallis sagittis augue ut ornare. Vestibulum et gravida lectus, sed ultrices sapien. Nullam aliquet elit dui, vitae hendrerit lectus volutpat eget. In porttitor tincidunt egestas. Pellentesque laoreet ligula at est vulputate facilisis. Etiam tristique justo ut odio placerat ornare. Cras bibendum, orci at ornare tincidunt, lacus nunc gravida enim, sit amet euismod nunc lectus in lectus. Ut dictum nulla et arcu aliquet ornare. Aliquam et dapibus lectus. Aenean mattis elit mi, sed ultricies augue consectetur id. Sed id magna malesuada, luctus urna a, bibendum tortor. Cras cursus cursus ex. Nulla fringilla elit vitae imperdiet scelerisque. Donec ac sem eu diam convallis mollis a sed leo. Proin congue augue turpis, eget rutrum dolor ultricies non. Nulla blandit venenatis dapibus. Sed tincidunt mollis elit, quis suscipit nibh eleifend quis. Donec ex lorem, auctor eu rutrum in, blandit id dolor. Nulla molestie arcu turpis. In id felis vulputate, tempor massa eget, malesuada mauris. Quisque fringilla consequat metus, luctus scelerisque leo fringilla vel.
  </p>
</div>
@slot('code')
<div class="overscroll-auto ...">Lorem ipsum dolor sit amet...</div>
@endslot
@endcomponent

## Contain

Use `overscroll-contain` to prevent scrolling in the target area from triggering scrolling in the parent element, but preserve "bounce" effects when scrolling past the end of the container in operating systems that support it.

@component('_partials.code-sample')
<div class="overscroll-contain overflow-auto h-32 bg-gray-300 text-gray-700 p-4">
  <p>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eleifend rutrum auctor. Phasellus convallis sagittis augue ut ornare. Vestibulum et gravida lectus, sed ultrices sapien. Nullam aliquet elit dui, vitae hendrerit lectus volutpat eget. In porttitor tincidunt egestas. Pellentesque laoreet ligula at est vulputate facilisis. Etiam tristique justo ut odio placerat ornare. Cras bibendum, orci at ornare tincidunt, lacus nunc gravida enim, sit amet euismod nunc lectus in lectus. Ut dictum nulla et arcu aliquet ornare. Aliquam et dapibus lectus. Aenean mattis elit mi, sed ultricies augue consectetur id. Sed id magna malesuada, luctus urna a, bibendum tortor. Cras cursus cursus ex. Nulla fringilla elit vitae imperdiet scelerisque. Donec ac sem eu diam convallis mollis a sed leo. Proin congue augue turpis, eget rutrum dolor ultricies non. Nulla blandit venenatis dapibus. Sed tincidunt mollis elit, quis suscipit nibh eleifend quis. Donec ex lorem, auctor eu rutrum in, blandit id dolor. Nulla molestie arcu turpis. In id felis vulputate, tempor massa eget, malesuada mauris. Quisque fringilla consequat metus, luctus scelerisque leo fringilla vel.
  </p>
</div>
@slot('code')
<div class="overscroll-contain ...">Lorem ipsum dolor sit amet...</div>
@endslot
@endcomponent

## None

Use `overscroll-none` to prevent scrolling in the target area from triggering scrolling in the parent element, and also prevent "bounce" effects when scrolling past the end of the container.

@component('_partials.code-sample')
<div class="overscroll-none overflow-auto h-32 bg-gray-300 text-gray-700 p-4">
  <p>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eleifend rutrum auctor. Phasellus convallis sagittis augue ut ornare. Vestibulum et gravida lectus, sed ultrices sapien. Nullam aliquet elit dui, vitae hendrerit lectus volutpat eget. In porttitor tincidunt egestas. Pellentesque laoreet ligula at est vulputate facilisis. Etiam tristique justo ut odio placerat ornare. Cras bibendum, orci at ornare tincidunt, lacus nunc gravida enim, sit amet euismod nunc lectus in lectus. Ut dictum nulla et arcu aliquet ornare. Aliquam et dapibus lectus. Aenean mattis elit mi, sed ultricies augue consectetur id. Sed id magna malesuada, luctus urna a, bibendum tortor. Cras cursus cursus ex. Nulla fringilla elit vitae imperdiet scelerisque. Donec ac sem eu diam convallis mollis a sed leo. Proin congue augue turpis, eget rutrum dolor ultricies non. Nulla blandit venenatis dapibus. Sed tincidunt mollis elit, quis suscipit nibh eleifend quis. Donec ex lorem, auctor eu rutrum in, blandit id dolor. Nulla molestie arcu turpis. In id felis vulputate, tempor massa eget, malesuada mauris. Quisque fringilla consequat metus, luctus scelerisque leo fringilla vel.
  </p>
</div>
@slot('code')
<div class="overscroll-none ...">Lorem ipsum dolor sit amet...</div>
@endslot
@endcomponent

## Responsive

To control the overscroll-behavior property at a specific breakpoint, add a `{screen}:` prefix to any existing overscroll-behavior utility. For example, use `md:overscroll-contain` to apply the `overscroll-contain` utility at only medium screen sizes and above.

```html
<div class="overscroll-auto md:overscroll-contain lg:overscroll-none ...">
  <!-- ... -->
</div>
```

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

## Customizing

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'overscroll-behavior',
        'property' => 'overscrollBehavior',
    ],
    'variants' => ['responsive'],
])
