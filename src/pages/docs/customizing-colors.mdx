---
title: Customizing Colors
shortTitle: Colors
description: Customizing the default color palette for your project.
---

import { Heading } from '@/components/Heading'
import { ColorPaletteReference } from '@/components/ColorPaletteReference'
import { TipGood, TipBad } from '@/components/Tip'

## <Heading hidden>Overview</Heading>

Tailwind includes an expertly-crafted default color palette out-of-the-box that is a great starting point if you don't have your own specific branding in mind.

<div className="mt-10"></div>

<ColorPaletteReference colors={[
  ['Gray', 'coolGray'],
  'red',
  ['Yellow', 'amber'],
  ['Green', 'emerald'],
  'blue',
  'indigo',
  ['Purple', 'violet'],
  'pink',
]} />

<div className="mt-10"></div>

But when you do need to customize your palette, you can configure your colors under the `colors` key in the `theme` section of your `tailwind.config.js` file:

```js
// tailwind.config.js
module.exports = {
  theme: {
    colors: {
      // Configure your color palette here
    }
  }
}
```

When it comes to building a custom color palette, you can either [curate your colors](#curating-colors) from our extensive included color palette, or [configure your own custom colors](#custom-colors) by adding your specific color values directly.

---

## Curating colors

If you don't have a set of completely custom colors in mind for your project, you can curate your colors from our complete color palette by importing `'tailwindcss/colors'` into your config file and choosing the colors you like.

```js
// tailwind.config.js
const colors = require('tailwindcss/colors')

module.exports = {
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: colors.trueGray,
      indigo: colors.indigo,
      red: colors.rose,
      yellow: colors.amber,
    }
  }
}
```

Don't forget to include `transparent` and `current` if you'd like those available in your project.

Although each color has a specific name, you're encouraged to alias them however you like in your own projects. We even do this in the default configuration, aliasing `coolGray` to `gray`, `violet` to `purple`, `amber` to `yellow`, and `emerald` to `green`.

See our [complete color palette reference](#color-palette-reference) to see the colors that are available to choose from by default.

---

## Custom colors

You can build a completely custom palette by adding your own color values from scratch:

```js
// tailwind.config.js
module.exports = {
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      blue: {
        light: '#85d7ff',
        DEFAULT: '#1fb6ff',
        dark: '#009eeb',
      },
      pink: {
        light: '#ff7ce5',
        DEFAULT: '#ff49db',
        dark: '#ff16d1',
      },
      gray: {
        darkest: '#1f2d3d',
        dark: '#3c4858',
        DEFAULT: '#c0ccda',
        light: '#e0e6ed',
        lightest: '#f9fafc',
      }
    }
  }
}
```

By default, these colors are automatically shared by all color-driven utilities, like `textColor`, `backgroundColor`, `borderColor`, and more.

---

## Color object syntax

You can see above that we've defined our colors using a nested object notation where the nested keys are added to the base color name as modifiers:

```js
// tailwind.config.js
module.exports = {
  theme: {
    colors: {
      indigo: {
        light: '#b3bcf5',
        DEFAULT: '#5c6ac4',
        dark: '#202e78',
      }
    }
  }
}
```

The different segments of the color name are combined to form class names like `bg-indigo-light`.

Like many other places in Tailwind, the `DEFAULT` key is special and means "no modifier", so this configuration would generate classes like `text-indigo` and `bg-indigo`, not `text-indigo-DEFAULT` or `bg-indigo-DEFAULT`.

You can also define your colors as simple strings instead of objects:

```js
// tailwind.config.js
module.exports = {
  theme: {
    colors: {
      'indigo-lighter': '#b3bcf5',
      'indigo': '#5c6ac4',
      'indigo-dark': '#202e78',
    }
  }
}
```

Note that when accessing colors using the `theme()` function you need to use the same notation you used to define them.

```js
// tailwind.config.js
module.exports = {
  theme: {
    colors: {
      indigo: {
        // theme('colors.indigo.light')
        light: '#b3bcf5',

        // theme('colors.indigo.DEFAULT')
        DEFAULT: '#5c6ac4',
      },

      // theme('colors.indigo-dark')
      'indigo-dark': '#202e78',
    }
  }
}
```

---

## Extending the defaults

As described in the [theme documentation](/docs/theme#extending-the-default-theme), if you'd like to extend the default color palette rather than override it, you can do so using the `theme.extend.colors` section of your `tailwind.config.js` file:

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'regal-blue': '#243c5a',
      }
    }
  }
}
```

This will generate classes like `bg-regal-blue` in addition to all of Tailwind's default colors.

These extensions are merged deeply, so if you'd like to add an additional shade to one of Tailwind's default colors, you can do so like this:


```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        blue: {
          450: '#5F99F7'
        },
      }
    }
  }
}
```

This will add classes like `bg-blue-450` without losing existing classes like `bg-blue-400` or `bg-blue-500`.

---

## Disabling a default color

If you'd like to disable a default color because you aren't using it in your project, the easiest approach is to just build a new color palette that doesn't include the color you'd like to disable.

For example, this `tailwind.config.js` file excludes teal, orange, and pink, but includes the rest of the default colors:

```js
// tailwind.config.js
const colors = require('tailwindcss/colors')

module.exports = {
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: colors.coolGray,
      red: colors.red,
      yellow: colors.amber,
      blue: colors.blue
    }
  }
}
```

Alternatively, you could leave the color palette untouched and rely on [tree-shaking unused styles](/docs/optimizing-for-production) to remove the colors you're not using.

---

## Naming your colors

Tailwind uses literal color names _(like red, green, etc.)_ and a numeric scale _(where 50 is light and 900 is dark)_ by default. This ends up being fairly practical for most projects, but there are good reasons to use other naming conventions as well.

For example, if you're working on a project that needs to support multiple themes, it might make sense to use more abstract names like `primary` and `secondary`:

```js
// tailwind.config.js
module.exports = {
  theme: {
    colors: {
      primary: '#5c6ac4',
      secondary: '#ecc94b',
      // ...
    }
  }
}
```

You can configure those colors explicitly like we have above, or you can pull in colors from our complete color palette and alias them:

```js
// tailwind.config.js
const colors = require('tailwindcss/colors')

module.exports = {
  theme: {
    colors: {
      primary: colors.indigo,
      secondary: colors.yellow,
      neutral: colors.gray,
    }
  }
}
```

You could even define these colors using CSS custom properties (variables) to make it easy to switch themes on the client:

```js
// tailwind.config.js
module.exports = {
  theme: {
    colors: {
      primary: 'var(--color-primary)',
      secondary: 'var(--color-secondary)',
      // ...
    }
  }
}
```

```css
/* In your CSS */
:root {
  --color-primary: #5c6ac4;
  --color-secondary: #ecc94b;
  /* ... */
}

@tailwind base;
@tailwind components;
@tailwind utilities;
```

*Note that colors defined using custom properties will not work with color opacity utilities like `bg-opacity-50` without additional configuration. See [this example repository](https://github.com/adamwathan/tailwind-css-variable-text-opacity-demo) for more information on how to make this work.*


---

## Generating colors

A common question we get is "how do I generate the 50–900 shades of my own custom colors?".

Bad news, color is complicated and despite trying dozens of different tools, we've yet to find one that does a good job generating these sorts of color palettes. We picked all of Tailwind's default colors by hand, meticulously balancing them by eye and testing them in real designs to make sure we were happy with them.

---

## Color palette reference

This is a list of all of the colors available when you import `tailwindcss/colors` into your `tailwind.config.js` file.

```js
// tailwind.config.js
const colors = require('tailwindcss/colors')

module.exports = {
  theme: {
    colors: {
      // Build your palette here
      transparent: 'transparent',
      current: 'currentColor',
      gray: colors.trueGray,
      red: colors.red,
      blue: colors.lightBlue,
      yellow: colors.amber,
    }
  }
}
```

Although each color has a specific name, you're encouraged to alias them however you like in your own projects.

<div className="mt-10"></div>

<ColorPaletteReference colors={[
  'blueGray',
  'coolGray',
  'gray',
  'trueGray',
  'warmGray',
  'red',
  'orange',
  'amber',
  'yellow',
  'lime',
  'green',
  'emerald',
  'teal',
  'cyan',
  'lightBlue',
  'blue',
  'indigo',
  'violet',
  'purple',
  'fuchsia',
  'pink',
  'rose',
]} />
