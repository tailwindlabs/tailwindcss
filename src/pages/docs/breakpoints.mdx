---
title: Breakpoints
description: Customizing the default breakpoints for your project.
---

import { Heading } from '@/components/Heading'

## <Heading hidden>Basic customization</Heading>

You define your project's breakpoints in the `theme.screens` section of your `tailwind.config.js` file. The keys are your screen names (used as the prefix for the responsive utility variants Tailwind generates, like `md:text-center`), and the values are the `min-width` where that breakpoint should start.

The default breakpoints are inspired by common device resolutions:

```js
// tailwind.config.js
module.exports = {
  theme: {
    screens: {
      'sm': '640px',
      // => @media (min-width: 640px) { ... }

      'md': '768px',
      // => @media (min-width: 768px) { ... }

      'lg': '1024px',
      // => @media (min-width: 1024px) { ... }

      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
    }
  }
}
```

Feel free to have as few or as many screens as you want, naming them in whatever way you'd prefer for your project.

For example, you could use device names instead of sizes:

```js
// tailwind.config.js
module.exports = {
  theme: {
    screens: {
      'tablet': '640px',
      // => @media (min-width: 640px) { ... }

      'laptop': '1024px',
      // => @media (min-width: 1024px) { ... }

      'desktop': '1280px',
      // => @media (min-width: 1280px) { ... }
    },
  }
}
```

These screen names will be reflected in your utilities, so your `text-center` utilities would now look like this:

```css
.text-center { text-align: center }

@media (min-width: 640px) {
  .tablet\:text-center { text-align: center }
}

@media (min-width: 1024px) {
  .laptop\:text-center { text-align: center }
}

@media (min-width: 1280px) {
  .desktop\:text-center { text-align: center }
}
```

## Extending the default breakpoints

The easiest way to add an additional larger breakpoint is using the `extend` key:

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      screens: {
        '3xl': '1600px',
      },
    },
  },
  variants: {},
  plugins: [],
}
```

If you want to add an additional small breakpoint, you can't use `extend` because the small breakpoint would be added to the end of the breakpoint list, and breakpoints need to be sorted from smallest to largest in order to work as expected with a min-width breakpoint system.

Instead, override the entire `screens` key, re-specifying the default breakpoints:

```js
// tailwind.config.js
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  theme: {
    screens: {
      'xs': '475px',
      ...defaultTheme.screens,
    },
  },
  variants: {},
  plugins: [],
}
```

## Max-width breakpoints

If you want to work with max-width breakpoints instead of min-width, you can specify your screens as objects with a `max` key:

```js
// tailwind.config.js
module.exports = {
  theme: {
    screens: {
      '2xl': {'max': '1535px'},
      // => @media (max-width: 1535px) { ... }

      'xl': {'max': '1279px'},
      // => @media (max-width: 1279px) { ... }

      'lg': {'max': '1023px'},
      // => @media (max-width: 1023px) { ... }

      'md': {'max': '767px'},
      // => @media (max-width: 767px) { ... }

      'sm': {'max': '639px'},
      // => @media (max-width: 639px) { ... }
    }
  }
}
```

Make sure to list them in reverse order as compared to min-width breakpoints so that they override each other as expected.

You can even create breakpoints with both `min-width` and `max-width` definitions if necessary, for example:

```js
// tailwind.config.js
module.exports = {
  theme: {
    screens: {
      'sm': {'min': '640px', 'max': '767px'},
      'md': {'min': '768px', 'max': '1023px'},
      'lg': {'min': '1024px', 'max': '1279px'},
      'xl': {'min': '1280px', 'max': '1535px'},
      '2xl': {'min': '1536px'},
    },
  }
}
```

## Multi-range breakpoints

Sometimes it can be useful to have a single breakpoint definition apply in multiple ranges.

For example, say you have a sidebar and want your breakpoints to be based on the content-area width rather than the entire viewport. You can simulate this having one of your breakpoints fall back to a smaller breakpoint when the sidebar becomes visible and shrinks the content area:

```js
// tailwind.config.js
module.exports = {
  theme: {
    screens: {
      'sm': '500px',
      'md': [
        // Sidebar appears at 768px, so revert to `sm:` styles between 768px
        // and 868px, after which the main content area is wide enough again to
        // apply the `md:` styles.
        {'min': '668px', 'max': '767px'},
        {'min': '868px'}
      ],
      'lg': '1100px',
      'xl': '1400px',
    }
  }
}
```

## Custom media queries

If you need to provide a completely custom media query for a breakpoint, you can do so using an object with a `raw` key:

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      screens: {
        'portrait': {'raw': '(orientation: portrait)'},
        // => @media (orientation: portrait) { ... }
      }
    }
  }
}
```

### Styling for print

The `raw` option can be particularly useful if you need to apply different styles specifically for print.

All you need to do is add a `print` screen under `theme.extend.screens`:

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      screens: {
        'print': {'raw': 'print'},
        // => @media print { ... }
      }
    }
  }
}
```

Then you can use classes like `print:text-black` to specify styles that should only be applied when someone tries to print the page you're working on:

```html
<div class="text-gray-700 print:text-black">
  <!-- ... -->
</div>
```
