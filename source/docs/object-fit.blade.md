---
extends: _layouts.documentation
title: "Object Fit"
description: "Utilities for controlling how a replaced element's content should be resized."
---

@include('_partials.class-table', [
    'rows' => [
        [
            '.object-contain',
            'object-fit: contain;',
        ],
        [
            '.object-cover',
            'object-fit: cover;',
        ],
        [
            '.object-fill',
            'object-fit: fill;',
        ],
        [
            '.object-none',
            'object-fit: none;',
        ],
        [
            '.object-scale-down',
            'object-fit: scale-down;',
        ], 
    ]
])

## Contain

Resize an element's content to stay contained within its container using `.object-contain`.

@component('_partials.code-sample')
<div class="p-4">
  <p class="text-sm text-gray-600">.object-contain</p>
  <div class="bg-gray-400">
    <img class="h-48 w-full object-contain" src="https://images.unsplash.com/photo-1459262838948-3e2de6c1ec80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80" alt="">
  </div>
</div>
@slot('code')
<div class="bg-gray-400">
  <img class="object-contain h-48 w-full ...">
</div>
@endslot
@endcomponent

## Cover

Resize an element's content to cover its container using `.object-cover`.

@component('_partials.code-sample')
<div class="p-4">
  <p class="text-sm text-gray-600">.object-cover</p>
  <div class="bg-gray-400">
    <img class="h-48 w-full object-cover" src="https://images.unsplash.com/photo-1459262838948-3e2de6c1ec80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80" alt="">
  </div>
</div>
@slot('code')
<div class="bg-gray-400">
  <img class="object-cover h-48 w-full ...">
</div>
@endslot
@endcomponent

## Fill

Stretch an element's content to fit its container using `.object-fill`.

@component('_partials.code-sample')
<div class="p-4">
  <p class="text-sm text-gray-600">.object-fill</p>
  <div class="bg-gray-400">
    <img class="h-48 w-full object-fill" src="https://images.unsplash.com/photo-1459262838948-3e2de6c1ec80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80" alt="">
  </div>
</div>
@slot('code')
<div class="bg-gray-400">
  <img class="object-fill h-48 w-full ...">
</div>
@endslot
@endcomponent

## None

Display an element's content at its original size ignoring the container size using `.object-none`.

@component('_partials.code-sample')
<div class="p-4">
  <p class="text-sm text-gray-600">.object-none</p>
  <div class="bg-gray-400">
    <img class="h-48 w-full object-none" src="https://images.unsplash.com/photo-1459262838948-3e2de6c1ec80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80" alt="">
  </div>
</div>
@slot('code')
<div class="bg-gray-400">
  <img class="object-none h-48 w-full ...">
</div>
@endslot
@endcomponent

## Scale Down

Display an element's content at its original size but scale it down to fit its container if necessary using `.object-scale-down`.

@component('_partials.code-sample')
<div class="p-4">
  <p class="text-sm text-gray-600">.object-scale-down</p>
  <div class="bg-gray-400">
    <img class="h-48 w-full object-scale-down" src="https://images.unsplash.com/photo-1459262838948-3e2de6c1ec80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&h=128&q=80" alt="">
  </div>
</div>
@slot('code')
<div class="bg-gray-400">
  <img class="object-scale-down h-48 w-full ...">
</div>
@endslot
@endcomponent

## Customizing

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'object-fit',
        'property' => 'objectFit',
    ],
    'variants' => ['responsive'],
])
