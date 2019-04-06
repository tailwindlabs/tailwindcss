---
extends: _layouts.documentation
title: "Object Position"
description: "Utilities for controlling the element's respond to the height and width of its content box."
features:
  responsive: true
  customizable: true
  hover: false
  focus: false
---

@include('_partials.class-table', [
    'rows' => [
        [
            '.object-bottom',
            'object-position: bottom;',
            'Place the image on the bottom edge.',
        ],
        [
            '.object-center',
            'object-position: center;',
            'Place the image in the center.',
        ],
        [
            '.object-left',
            'object-position: left;',
            'Place the image on the left edge.',
        ],
        [
            '.object-left-bottom',
            'object-position: left bottom;',
            'Place the image on the left bottom edge.',
        ],
        [
            '.object-left-top',
            'object-position: left top;',
            'Place the image on the left top edge.',
        ],
        [
            '.object-right',
            'object-position: right;',
            'Place the image on the right edge.',
        ],
        [
            '.object-right-bottom',
            'object-position: right bottom;',
            'Place the image on the right bottom edge.',
        ],
        [
            '.object-right-top',
            'object-position: right top;',
            'Place the image on the right top edge.',
        ],
        [
            '.object-top',
            'object-position: top;',
            'Place the image on the top edge.',
        ],
    ]
])

## Object Positioning

Use the `.object-{side}` utilities to specify the alignment of an element's content to a specific side.

Note that this only applies to [replaced elements](https://developer.mozilla.org/en-US/docs/Web/CSS/Replaced_element) like `<img>`, `<iframe>`, `<embed>`, and `<video>`.

@component('_partials.code-sample')
<div class="flex justify-around mb-8">
  <div class="flex-1">
    <p class="text-center text-sm text-gray-600 mb-1">.object-left-top</p>
    <img class="mx-auto bg-gray-400 w-24 h-24 object-left-top object-none" src="https://images.unsplash.com/photo-1459262838948-3e2de6c1ec80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=64&h=64&q=80">
  </div>
  <div class="flex-1">
    <p class="text-center text-sm text-gray-600 mb-1">.object-top</p>
    <img class="mx-auto bg-gray-400 w-24 h-24 object-top object-none" src="https://images.unsplash.com/photo-1459262838948-3e2de6c1ec80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=64&h=64&q=80">
  </div>
  <div class="flex-1">
    <p class="text-center text-sm text-gray-600 mb-1">.object-right-top</p>
    <img class="mx-auto bg-gray-400 w-24 h-24 object-right-top object-none" src="https://images.unsplash.com/photo-1459262838948-3e2de6c1ec80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=64&h=64&q=80">
  </div>
</div>
<div class="flex justify-around mb-8">
  <div class="flex-1">
    <p class="text-center text-sm text-gray-600 mb-1">.object-left</p>
    <img class="mx-auto bg-gray-400 w-24 h-24 object-left object-none" src="https://images.unsplash.com/photo-1459262838948-3e2de6c1ec80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=64&h=64&q=80">
  </div>
  <div class="flex-1">
    <p class="text-center text-sm text-gray-600 mb-1">.object-center</p>
    <img class="mx-auto bg-gray-400 w-24 h-24 object-center object-none" src="https://images.unsplash.com/photo-1459262838948-3e2de6c1ec80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=64&h=64&q=80">
  </div>
  <div class="flex-1">
    <p class="text-center text-sm text-gray-600 mb-1">.object-right</p>
    <img class="mx-auto bg-gray-400 w-24 h-24 object-right object-none" src="https://images.unsplash.com/photo-1459262838948-3e2de6c1ec80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=64&h=64&q=80">
  </div>
</div>
<div class="flex justify-around">
  <div class="flex-1">
    <p class="text-center text-sm text-gray-600 mb-1">.object-left-bottom</p>
    <img class="mx-auto bg-gray-400 w-24 h-24 object-left-bottom object-none" src="https://images.unsplash.com/photo-1459262838948-3e2de6c1ec80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=64&h=64&q=80">
  </div>
  <div class="flex-1">
    <p class="text-center text-sm text-gray-600 mb-1">.object-bottom</p>
    <img class="mx-auto bg-gray-400 w-24 h-24 object-bottom object-none" src="https://images.unsplash.com/photo-1459262838948-3e2de6c1ec80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=64&h=64&q=80">
  </div>
  <div class="flex-1">
    <p class="text-center text-sm text-gray-600 mb-1">.object-right-bottom</p>
    <img class="mx-auto bg-gray-400 w-24 h-24 object-right-bottom object-none" src="https://images.unsplash.com/photo-1459262838948-3e2de6c1ec80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=64&h=64&q=80">
  </div>
</div>
@slot('code')
<img class="object-none object-left-top bg-gray-400 w-24 h-24" src="...">
<img class="object-none object-top bg-gray-400 w-24 h-24" src="...">
<img class="object-none object-right-top bg-gray-400 w-24 h-24" src="...">
<img class="object-none object-left bg-gray-400 w-24 h-24" src="...">
<img class="object-none object-center bg-gray-400 w-24 h-24" src="...">
<img class="object-none object-right bg-gray-400 w-24 h-24" src="...">
<img class="object-none object-left-bottom bg-gray-400 w-24 h-24" src="...">
<img class="object-none object-bottom bg-gray-400 w-24 h-24" src="...">
<img class="object-none object-right-bottom bg-gray-400 w-24 h-24" src="...">
@endslot
@endcomponent

## Responsive

To position an object only at a specific breakpoint, add a `{screen}:` prefix to any existing object position utility. For example, adding the class `md:object-top` to an element would apply the `object-top` utility at medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

@component('_partials.responsive-code-sample')
@slot('none')
<img class="mx-auto bg-gray-400 w-48 h-48 object-center object-none" src="https://images.unsplash.com/photo-1459262838948-3e2de6c1ec80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=128&h=128&q=80">
@endslot

@slot('sm')
<img class="mx-auto bg-gray-400 w-48 h-48 object-top object-none" src="https://images.unsplash.com/photo-1459262838948-3e2de6c1ec80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=128&h=128&q=80">
@endslot

@slot('md')
<img class="mx-auto bg-gray-400 w-48 h-48 object-right object-none" src="https://images.unsplash.com/photo-1459262838948-3e2de6c1ec80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=128&h=128&q=80">
@endslot

@slot('lg')
<img class="mx-auto bg-gray-400 w-48 h-48 object-bottom object-none" src="https://images.unsplash.com/photo-1459262838948-3e2de6c1ec80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=128&h=128&q=80">
@endslot

@slot('xl')
<img class="mx-auto bg-gray-400 w-48 h-48 object-left object-none" src="https://images.unsplash.com/photo-1459262838948-3e2de6c1ec80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=128&h=128&q=80">
@endslot

@slot('code')
<img class="none:object-center sm:object-top md:object-right lg:object-bottom xl:object-left ..." src="...">
@endslot
@endcomponent

## Customizing

### Object Positioning

By default Tailwind provides nine object position utilities. You can change, add, or remove these by editing the `theme.objectPosition` section of your Tailwind config.

@component('_partials.customized-config', ['key' => 'theme.objectPosition'])
  bottom: 'bottom',
  center: 'center',
  left: 'left',
- 'left-bottom': 'left bottom',
- 'left-top': 'left top',
  right: 'right',
  'right-bottom': 'right bottom',
  'right-top': 'right top',
  top: 'top',
+ 'center-bottom': 'center bottom'
+ 'center-top': 'center top',
@endcomponent

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'object position',
        'property' => 'objectPosition',
    ],
    'variants' => ['responsive'],
])
