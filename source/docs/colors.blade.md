---
extends: _layouts.documentation
title: "Colors"
description: null
---

Developing an organized, consistent and beautiful color palette is critical to the design success of a project. Tailwind provides a fantastic color system that makes this very easy to accomplish.

## Default color palette

To get you started, we've provided a generous palette of great looking colors that are perfect for prototyping, or even as a starting point for your color palette. That said, don't hesitate to [customize](#customizing) them for your project.

--insert new color palette preview here, currently all busted--

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
