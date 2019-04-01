---
extends: _layouts.documentation
title: "Object Fit"
description: "Utilities for controlling the element's respond to the height and width of its content box."
---

@include('_partials.work-in-progress')

@include('_partials.class-table', [
    'rows' => [
        [
          '.object-contain',
          'object-fit: contain;',
          'Increase or decrease the size of the image to fill the content box whilst preserving its aspect ratio.',
        ],
        [
          '.object-cover',
          'object-fit: cover;',
          'Fill the height and width of the content box, preserving the image\'s aspect ratio but often cropping the image in the process.',
        ],
        [
            '.object-fill',
            'object-fit: fill;',
            'Stretch the image to fit the content box, regardless of the image\'s aspect ratio.',
        ],
        [
            '.object-none',
            'object-fit: none;',
            'Ignore the height and width of the content box and retain the image\'s original size.',
        ],
        [
            '.object-scale-down',
            'object-fit: scale-down;',
            'Compare the difference between \'none\' and \'contain\' in order to find the smallest concrete object size.',
        ], 
    ]
])

## Usage

@component('_partials.code-sample')
<div class="flex flex-wrap bg-gray-200">
  <div class="p-4 mb-2">
    <p class="mb-2 text-gray-700">.object-contain</p>
    <div class="h-32 w-64 bg-gray-400">
      <img class="h-full w-full object-contain" src="https://user-images.githubusercontent.com/4323180/37476373-5f8b7524-284b-11e8-8bc3-8dcb98dd2685.png" alt="">
    </div>
  </div>
  <div class="p-4 mb-2">
    <p class="mb-2 text-gray-700">.object-cover</p>
    <div class="h-32 w-64 bg-gray-400">
      <img class="h-full w-full object-cover" src="https://user-images.githubusercontent.com/4323180/37476373-5f8b7524-284b-11e8-8bc3-8dcb98dd2685.png" alt="">
    </div>
  </div>
  <div class="p-4 mb-2">
    <p class="mb-2 text-gray-700">.object-fill</p>
    <div class="h-32 w-64 bg-gray-400">
      <img class="h-full w-full object-fill" src="https://user-images.githubusercontent.com/4323180/37476373-5f8b7524-284b-11e8-8bc3-8dcb98dd2685.png" alt="">
    </div>
  </div>
  <div class="p-4 mb-2">
    <p class="mb-2 text-gray-700">.object-none</p>
    <div class="h-32 w-64 bg-gray-400">
      <img class="h-full w-full object-none" src="https://user-images.githubusercontent.com/4323180/37476373-5f8b7524-284b-11e8-8bc3-8dcb98dd2685.png" alt="">
    </div>
  </div>
  <div class="p-4 mb-2">
    <p class="mb-2 text-gray-700">.object-scale-down</p>
    <div class="h-32 w-64 bg-gray-400">
      <img class="h-full w-full object-scale-down" src="https://user-images.githubusercontent.com/4323180/37476373-5f8b7524-284b-11e8-8bc3-8dcb98dd2685.png" alt="">
    </div>
  </div>
</div>
@slot('code')
<div class="flex flex-wrap bg-gray-200">
  <div class="p-4 mb-2">
    <p class="mb-2 text-gray-700">.object-contain</p>
    <div class="h-32 w-64 bg-gray-400">
      <img class="h-full w-full object-contain ...">
    </div>
  </div>
  <div class="p-4 mb-2">
    <p class="mb-2 text-gray-700">.object-cover</p>
    <div class="h-32 w-64 bg-gray-400">
      <img class="h-full w-full object-cover ...">
    </div>
  </div>
  <div class="p-4 mb-2">
    <p class="mb-2 text-gray-700">.object-fill</p>
    <div class="h-32 w-64 bg-gray-400">
      <img class="h-full w-full object-fill ...">
    </div>
  </div>
  <div class="p-4 mb-2">
    <p class="mb-2 text-gray-700">.object-none</p>
    <div class="h-32 w-64 bg-gray-400">
      <img class="h-full w-full object-none ...">
    </div>
  </div>
  <div class="p-4 mb-2">
    <p class="mb-2 text-gray-700">.object-scale-down</p>
    <div class="h-32 w-64 bg-gray-400">
      <img class="h-full w-full object-scale-down ...">
    </div>
  </div>
</div>
@endslot
@endcomponent

## Customizing

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'object-fit',
        'property' => 'objectFit',
    ],
    'variants' => false,
])