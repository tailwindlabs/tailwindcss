---
extends: _layouts.documentation
title: "Object Position"
description: "Utilities for controlling the element's respond to the height and width of its content box."
---

@include('_partials.work-in-progress')

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

## Customizing

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'object position',
        'property' => 'objectPosition',
    ],
    'variants' => false,
])
