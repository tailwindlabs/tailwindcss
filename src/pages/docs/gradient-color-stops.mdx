---
title: "Gradient Color Stops"
description: "Utilities for controlling the color stops in background gradients."
features:
  responsive: true
  customizable: true
  hover: true
  focus: false
---

import plugin from 'tailwindcss/lib/plugins/gradientColorStops'
import { Heading } from '@/components/Heading'
import { Variants } from '@/components/Variants'
import { Disabling } from '@/components/Disabling'
import { TipGood, TipBad } from '@/components/Tip'

export const classes = {
  plugin,
  transformProperties: ({ selector, properties }) => {
    delete properties['--tw-gradient-color-stops']
    return properties
  },
  preview: (css) => (
    <td
      className={css['background-color'] === 'transparent' ? 'bg-checkered' : undefined}
      style={{
        backgroundColor: ([
          css['--tw-gradient-from'],
          css['--tw-gradient-to'],
          css['--tw-gradient-stops']
        ]).filter(c => c !== undefined)[0].match(/(#[a-f0-9]+|transparent|currentColor)/i)[0],
      }}
    >
      <div className="w-24" />
    </td>
  ),
}

## Starting color

Set the starting color of a gradient using the `from-{color}` utilities.

```html
<template preview>
  <div class="h-24 bg-gradient-to-r from-red-500"></div>
</template>

<div class="bg-gradient-to-r **from-red-500** ..."></div>
```

## Ending color

Set the ending color of a gradient using the `to-{color}` utilities.

```html
<template preview>
  <div class="h-24 bg-gradient-to-r from-teal-400 to-blue-500"></div>
</template>

<div class="bg-gradient-to-r from-green-400 **to-blue-500** ..."></div>
```

Gradients to **do not** fade in from transparent by default. To fade in from transparent, reverse the gradient direction and use a `from-{color}` utility.

## Middle color

Add a middle color to a gradient using the `via-{color}` utilities.

```html
<template preview>
  <div class="h-24 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500"></div>
</template>

<div class="bg-gradient-to-r from-purple-400 **via-pink-500** to-red-500 ..."></div>
```

Gradients with a `from-{color}` and `via-{color}` will fade out to transparent by default if no `to-{color}` is present.

## Fading to transparent

Gradients fade out to transparent by default, without requiring you to add `to-transparent` explicitly. Tailwind intelligently calculates the _right_ "transparent" value to use based on the starting color to avoid [a bug in Safari](https://bugs.webkit.org/show_bug.cgi?id=150940) that causes fading to simply the `transparent` keyword to fade through gray, which just looks awful.

<TipBad>Don't add `to-transparent` explicitly</TipBad>

```html
<div class="bg-gradient-to-r from-blue-500 to-transparent">
  <!-- ... -->
</div>
```

<TipGood>Only specify a from color and fade to transparent automatically</TipGood>

```html
<div class="bg-gradient-to-r from-blue-500">
  <!-- ... -->
</div>
```

## Responsive

To control the gradient color stops of an element at a specific breakpoint, add a `{screen}:` prefix to any existing gradient color stop utility. For example, use `md:from-green-500` to apply the `from-green-500` utility at only medium screen sizes and above.

```html
<div class="bg-gradient-to-r from-purple-400 **md:from-yellow-500**"></div>
```

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.


## Hover

To control the gradient color stops of an element on hover, add the `hover:` prefix to any existing gradient color stop utility. For example, use `hover:bg-blue-500` to apply the `bg-blue-500` utility on hover.

```html
<template preview>
  <div class="flex justify-center">
    <button type="button" class="bg-gradient-to-r from-teal-400 to-blue-500 hover:from-pink-500 hover:to-orange-500 text-white font-semibold px-6 py-3 rounded-md">
      Hover me
    </button>
  </div>
</template>

<button type="button" class="bg-gradient-to-r from-green-400 to-blue-500 **hover:from-pink-500 hover:to-yellow-500** ...">
  Hover me
</button>
```

Hover utilities can also be combined with responsive utilities by adding the responsive `{screen}:` prefix *before* the `focus:` prefix.

```html
<button class="... **md:from-blue-500 md:hover:from-blue-700** ...">Button</button>
```

## Focus

To control the gradient color stops of an element on focus, add the `focus:` prefix to any existing gradient color stop utility. For example, use `focus:bg-blue-500` to apply the `bg-blue-500` utility on focus.

```html
<template preview>
  <div class="flex justify-center">
    <button type="button" class="bg-gradient-to-r from-teal-400 to-blue-500 focus:from-pink-500 focus:to-orange-500 text-white font-semibold px-6 py-3 rounded-md">
      Focus me
    </button>
  </div>
</template>

<button type="button" class="bg-gradient-to-r from-green-400 to-blue-500 **focus:from-pink-500 focus:to-yellow-500**">
  Focus me
</button>
```

Focus utilities can also be combined with responsive utilities by adding the responsive `{screen}:` prefix *before* the `focus:` prefix.

```html
<button class="... md:from-blue-500 md:focus:from-blue-700 ...">Button</button>
```


## Customizing

### Background Colors

By default, Tailwind makes the entire [default color palette](/docs/customizing-colors#default-color-palette) available as gradient color stops.

You can [customize your color palette](/docs/colors#customizing) by editing the `theme.colors` variable in your `tailwind.config.js` file, or customize just your gradient color stop colors using the `theme.gradientColorStops` section of your Tailwind config.

```diff-js
  // tailwind.config.js
  module.exports = {
    theme: {
      gradientColorStops: theme => ({
-       ...theme('colors'),
+       'primary': '#3490dc',
+       'secondary': '#ffed4a',
+       'danger': '#e3342f',
      })
    }
  }
```

### Variants

<Variants plugin="gradientColorStops" />

### Disabling

<Disabling plugin="gradientColorStops" />
