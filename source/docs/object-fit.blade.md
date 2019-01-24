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

## Customizing

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'object-fit',
        'property' => 'objectFit',
    ],
    'variants' => false,
])