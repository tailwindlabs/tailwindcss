---
extends: _layouts.documentation
title: "Colors"
description: null
---

Developing an organized, consistent and beautiful color palette is critical to the design success of a project. Tailwind provides a fantastic color system that makes this very easy to accomplish.

## Default color palette

To get you started, we've provided a generous palette of great looking colors that are perfect for prototyping, or even as a starting point for your color palette. That said, don't hesitate to [customize](#customizing) them for your project.

<div>
  @include('_partials.color-palette', [
    'colorName' => 'Grey',
    'colors' => [
      'White' => [
        'name' => 'white',
        'fg' => 'black'
      ],
      'Lightest' => [
        'name' => 'grey-lightest',
        'fg' => 'black'
      ],
      'Lighter' => [
        'name' => 'grey-lighter',
        'fg' => 'black'
      ],
      'Light' => [
        'name' => 'grey-light',
        'fg' => 'black'
      ],
      'Base' => [
        'name' => 'grey',
        'fg' => 'black'
      ],
      'Dark' => [
        'name' => 'grey-dark',
        'fg' => 'white'
      ],
      'Darker' => [
        'name' => 'grey-darker',
        'fg' => 'white'
      ],
      'Darkest' => [
        'name' => 'grey-darkest',
        'fg' => 'white'
      ],
      'Black' => [
        'name' => 'black',
        'fg' => 'white'
      ],
    ]
  ])
</div>

<div>
  @include('_partials.color-palette', [
    'colorName' => 'Red',
    'colors' => [
      'Lightest' => [
        'name' => 'red-lightest',
        'fg' => 'red-darkest'
      ],
      'Lighter' => [
        'name' => 'red-lighter',
        'fg' => 'red-darkest'
      ],
      'Light' => [
        'name' => 'red-light',
        'fg' => 'white'
      ],
      'Base' => [
        'name' => 'red',
        'fg' => 'white'
      ],
      'Dark' => [
        'name' => 'red-dark',
        'fg' => 'white'
      ],
      'Darker' => [
        'name' => 'red-darker',
        'fg' => 'white'
      ],
      'Darkest' => [
        'name' => 'red-darkest',
        'fg' => 'white'
      ],
    ]
  ])
</div>

<div>
  @include('_partials.color-palette', [
    'colorName' => 'Orange',
    'colors' => [
      'Lightest' => [
        'name' => 'orange-lightest',
        'fg' => 'orange-darkest'
      ],
      'Lighter' => [
        'name' => 'orange-lighter',
        'fg' => 'orange-darkest'
      ],
      'Light' => [
        'name' => 'orange-light',
        'fg' => 'orange-darkest'
      ],
      'Base' => [
        'name' => 'orange',
        'fg' => 'orange-darkest'
      ],
      'Dark' => [
        'name' => 'orange-dark',
        'fg' => 'white'
      ],
      'Darker' => [
        'name' => 'orange-darker',
        'fg' => 'white'
      ],
      'Darkest' => [
        'name' => 'orange-darkest',
        'fg' => 'white'
      ],
    ]
  ])
</div>

<div>
  @include('_partials.color-palette', [
    'colorName' => 'Yellow',
    'colors' => [
      'Lightest' => [
        'name' => 'yellow-lightest',
        'fg' => 'yellow-darkest'
      ],
      'Lighter' => [
        'name' => 'yellow-lighter',
        'fg' => 'yellow-darkest'
      ],
      'Light' => [
        'name' => 'yellow-light',
        'fg' => 'yellow-darkest'
      ],
      'Base' => [
        'name' => 'yellow',
        'fg' => 'yellow-darkest'
      ],
      'Dark' => [
        'name' => 'yellow-dark',
        'fg' => 'yellow-darkest'
      ],
      'Darker' => [
        'name' => 'yellow-darker',
        'fg' => 'white'
      ],
      'Darkest' => [
        'name' => 'yellow-darkest',
        'fg' => 'white'
      ],
    ]
  ])
</div>

<div>
  @include('_partials.color-palette', [
    'colorName' => 'Green',
    'colors' => [
      'Lightest' => [
        'name' => 'green-lightest',
        'fg' => 'green-darkest'
      ],
      'Lighter' => [
        'name' => 'green-lighter',
        'fg' => 'green-darkest'
      ],
      'Light' => [
        'name' => 'green-light',
        'fg' => 'green-darkest'
      ],
      'Base' => [
        'name' => 'green',
        'fg' => 'white'
      ],
      'Dark' => [
        'name' => 'green-dark',
        'fg' => 'white'
      ],
      'Darker' => [
        'name' => 'green-darker',
        'fg' => 'white'
      ],
      'Darkest' => [
        'name' => 'green-darkest',
        'fg' => 'white'
      ],
    ]
  ])
</div>

<div>
  @include('_partials.color-palette', [
    'colorName' => 'Teal',
    'colors' => [
      'Lightest' => [
        'name' => 'teal-lightest',
        'fg' => 'teal-darkest'
      ],
      'Lighter' => [
        'name' => 'teal-lighter',
        'fg' => 'teal-darkest'
      ],
      'Light' => [
        'name' => 'teal-light',
        'fg' => 'teal-darkest'
      ],
      'Base' => [
        'name' => 'teal',
        'fg' => 'white'
      ],
      'Dark' => [
        'name' => 'teal-dark',
        'fg' => 'white'
      ],
      'Darker' => [
        'name' => 'teal-darker',
        'fg' => 'white'
      ],
      'Darkest' => [
        'name' => 'teal-darkest',
        'fg' => 'white'
      ],
    ]
  ])
</div>

<div>
  @include('_partials.color-palette', [
    'colorName' => 'Blue',
    'colors' => [
      'Lightest' => [
        'name' => 'blue-lightest',
        'fg' => 'blue-darkest'
      ],
      'Lighter' => [
        'name' => 'blue-lighter',
        'fg' => 'blue-darkest'
      ],
      'Light' => [
        'name' => 'blue-light',
        'fg' => 'blue-darkest'
      ],
      'Base' => [
        'name' => 'blue',
        'fg' => 'white'
      ],
      'Dark' => [
        'name' => 'blue-dark',
        'fg' => 'white'
      ],
      'Darker' => [
        'name' => 'blue-darker',
        'fg' => 'white'
      ],
      'Darkest' => [
        'name' => 'blue-darkest',
        'fg' => 'white'
      ],
    ]
  ])
</div>

<div>
  @include('_partials.color-palette', [
    'colorName' => 'Indigo',
    'colors' => [
      'Lightest' => [
        'name' => 'indigo-lightest',
        'fg' => 'indigo-darkest'
      ],
      'Lighter' => [
        'name' => 'indigo-lighter',
        'fg' => 'indigo-darkest'
      ],
      'Light' => [
        'name' => 'indigo-light',
        'fg' => 'white'
      ],
      'Base' => [
        'name' => 'indigo',
        'fg' => 'white'
      ],
      'Dark' => [
        'name' => 'indigo-dark',
        'fg' => 'white'
      ],
      'Darker' => [
        'name' => 'indigo-darker',
        'fg' => 'white'
      ],
      'Darkest' => [
        'name' => 'indigo-darkest',
        'fg' => 'white'
      ],
    ]
  ])
</div>

<div>
  @include('_partials.color-palette', [
    'colorName' => 'Purple',
    'colors' => [
      'Lightest' => [
        'name' => 'purple-lightest',
        'fg' => 'purple-darkest'
      ],
      'Lighter' => [
        'name' => 'purple-lighter',
        'fg' => 'purple-darkest'
      ],
      'Light' => [
        'name' => 'purple-light',
        'fg' => 'white'
      ],
      'Base' => [
        'name' => 'purple',
        'fg' => 'white'
      ],
      'Dark' => [
        'name' => 'purple-dark',
        'fg' => 'white'
      ],
      'Darker' => [
        'name' => 'purple-darker',
        'fg' => 'white'
      ],
      'Darkest' => [
        'name' => 'purple-darkest',
        'fg' => 'white'
      ],
    ]
  ])
</div>

<div>
  @include('_partials.color-palette', [
    'colorName' => 'Pink',
    'colors' => [
      'Lightest' => [
        'name' => 'pink-lightest',
        'fg' => 'pink-darkest'
      ],
      'Lighter' => [
        'name' => 'pink-lighter',
        'fg' => 'pink-darkest'
      ],
      'Light' => [
        'name' => 'pink-light',
        'fg' => 'white'
      ],
      'Base' => [
        'name' => 'pink',
        'fg' => 'white'
      ],
      'Dark' => [
        'name' => 'pink-dark',
        'fg' => 'white'
      ],
      'Darker' => [
        'name' => 'pink-darker',
        'fg' => 'white'
      ],
      'Darkest' => [
        'name' => 'pink-darkest',
        'fg' => 'white'
      ],
    ]
  ])
</div>

## Customizing

Tailwind makes it a breeze to modify the default color palette for your project. Remember, you own these colors and nothing will break if you change everything about them.

By default Tailwind defines the entire color palette in a `colors` object at the top of your Tailwind config file. These colors are then assigned to `textColors`, `backgroundColors` and `borderColors`. This approach works well since it provides a consistent naming system across all the utilities. However, you're welcome to modify them independently of one-another as well.

```js
var colors = {
  'transparent': 'transparent',

  'black': '#222b2f',
  'grey-darkest': '#364349',
  'grey-darker': '#596a73',
  'grey-dark': '#70818a',
  'grey': '#9babb4',

  // ...
}

module.exports = {
  colors: colors,
  textColors: colors,
  backgroundColors: colors,
  borderColors: Object.assign({ default: colors['grey-light'] }, colors),

  // ...
}
```

You'll notice above that the color palette is also assigned to the `colors` key of your Tailwind config. This makes it easy to access them in your custom CSS using the `config()` function. For example:

```css
.error { color: config('colors.grey-darker') }
```

## Naming

In the default color palette we've used literal color names, like `red`, `green` and `blue`. Another common approach to naming colors is choosing functional names based on how the colors are used, such as `primary`, `secondary`, and `brand`.

You can also choose different approaches to how you name your color variants. In the default color palette we've again used literal variants, like `light`, `dark`, and `darker`. Another common approach here is to use a numeric scale, like `100`, `200` and `300`.

You should feel free to choose whatever color naming approach makes the most sense to you.
