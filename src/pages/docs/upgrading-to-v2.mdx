---
title: "Upgrade Guide"
description: "Upgrading from Tailwind CSS v1.x to v2.0."
---

Tailwind CSS v2.0 is the first new major version since v1.0 was released in May 2019, and as such it includes a handful of small breaking changes.

We don't take breaking changes lightly and have worked hard to make sure the upgrade path is as simple as possible. For most projects, upgrading should take less than 30 minutes.

If your project uses the `@tailwindcss/ui` plugin, be sure to read the [Tailwind UI for Tailwind CSS v2.0 upgrade guide](https://tailwindui.com/changes-for-v2) as well.

----

## Install Tailwind CSS v2.0 and PostCSS 8

Tailwind CSS v2.0 has been updated for the latest PostCSS release which requires installing `postcss` and `autoprefixer` as peer dependencies alongside Tailwind itself.

Update Tailwind and install PostCSS and autoprefixer using npm:

```shell
npm install tailwindcss@latest postcss@latest autoprefixer@latest
```

If you run into issues, you may need to use our [PostCSS 7 compatibility build](/docs/installation#post-css-7-compatibility-build) instead.

## Support for IE 11 has been dropped

Prior to v2.0, we tried our best to make sure features we included in Tailwind worked in IE 11 whenever possible. This added considerable maintenance burden as well as increased build sizes (even when purging unused styles), so we have decided to drop support for IE 11 as of v2.0.

If you need to support IE 11, we recommend continuing to use Tailwind CSS v1.9 until you no longer need to support IE.

## Upgrade to Node.js 12.13 or higher

Tailwind CSS v2.0 no longer supports Node.js 8 or 10. To build your CSS you'll need to ensure you are running Node.js 12.13.0 or higher in both your local and CI environments.

## Update typography and forms plugins

If you are using `@tailwindcss/typography`, you'll want to [upgrade to v0.3.0](https://github.com/tailwindlabs/tailwindcss-typography/releases/tag/v0.3.0) which adds Tailwind CSS v2.0 support.

If you are using `@tailwindcss/custom-forms`, you will want to migrate to `@tailwindcss/forms` which replaces it. Learn more about the new forms plugin in [the release notes](https://blog.tailwindcss.com/tailwindcss-v2#utility-friendly-form-styles).

The `@tailwindcss/custom-forms` plugin is not compatible with Tailwind CSS v2.0.

## Remove future and experimental configuration options

As of v2.0 there are no `future` or `experimental` options available, so you can remove any configuration like this from your `tailwind.config.js` file:

```diff-js
  module.exports = {
-   future: {
-     defaultLineHeights: true,
-     purgeLayersByDefault: true,
-     removeDeprecatedGapUtilities: true,
-   },
-   experimental: {
-       additionalBreakpoint: true,
-       extendedFontSizeScale: true,
-       extendedSpacingScale: true,
-   },
    // ...
  }
```

We will continue to use the `experimental` option in the future for new feature ideas but the `future` option will probably not be used.

## Update renamed utility classes

A small number of utilities have been renamed in v2.0:

| Old name             | New name            |
| -------------------- | ------------------- |
| `whitespace-no-wrap` | `whitespace-nowrap` |
| `flex-no-wrap`       | `flex-nowrap`       |
| `col-gap-{n}`        | `gap-x-{n}`         |
| `row-gap-{n}`        | `gap-y-{n}`         |

You should be able to globally find and replace these classes throughout your entire project very safely, as they are very distinct strings.

Updating `whitespace-no-wrap` and `flex-no-wrap` is just a direct replacement, and for the gap utilities we recommend replacing `col-gap-` with `gap-x-` and `row-gap-` with `gap-y-` to handle all sizes at once.

## Enable hover and focus for fontWeight if needed

The `hover` and `focus` variants have been disabled for the `fontWeight` plugin by default, as changing font-weight like this tends to cause layout jank so it's uncommon to actually do it anyways.

If you need these in your project, re-enable them in your `tailwind.config.js` file:

```diff-js
  // tailwind.config.js
  module.exports = {
    variants: {
      extend: {
+       fontWeight: ['hover', 'focus']
      }
    }
  }
```

## Replace clearfix with flow-root

The `clearfix` class has been removed since `flow-root` is a simpler solution to the same problem in modern browsers.

```diff-html
- <div class="**clearfix**">
+ <div class="**flow-root**">
    <img class="float-left" src="..." alt="..." />
    <p>Lorem ipsum...</p>
  </div>
```

## Update font-weight class names for 100 and 200 weights

The class names for the `100` and `200` font weights have changed in Tailwind CSS v2.0:

| Font weight | Old name             | New name            |
|--------| -------------------- | ------------------- |
|100     | `font-hairline`           | `font-thin`              |
|200     | `font-thin`               | `font-extralight`        |

Since `font-thin` appears in both v1 and v2 for different weights, we recommend updating your classes in the following order:

1. Globally find and replace `font-thin` with `font-extralight`
2. Globally find and replace `font-hairline` with `font-thin`

## Replace shadow-outline and shadow-xs with ring utilities

Tailwind CSS v2.0 introduces a new set of `ring` utilities that let you add outline shadows/focus rings in a way that automatically composes with Tailwind's other box-shadow utilities.

These are a much better and more powerful alternative to the `shadow-outline` and `shadow-xs` classes, so we've removed those classes.

Replace `shadow-outline` with `ring`:

```diff-html
- <div class="... **focus:shadow-outline**">
+ <div class="... **focus:ring**">
```

Replace `shadow-xs` with `ring-1 ring-black ring-opacity-5`:

```diff-html
- <div class="... **shadow-xs**">
+ <div class="... **ring-1 ring-black ring-opacity-5**">
```

Alternatively, you can also add `shadow-outline` and `shadow-xs` back to your config file and leave your HTML untouched:

```js
module.exports = {
  theme: {
    extend: {
      boxShadow: {
        xs: '0 0 0 1px rgba(0, 0, 0, 0.05)',
        outline: '0 0 0 3px rgba(66, 153, 225, 0.5)',
      }
    }
  }
}
```

## Configure your breakpoints explicitly

Tailwind CSS v2.0 adds a new `2xl` breakpoint which will affect any situations where you've used the `container` class. If this impacts you, remove the `2xl` breakpoint by overriding `screens` with your existing breakpoints:

```diff-js
// tailwind.config.js
module.exports = {
  purge: [
  // ...
  ],
  theme: {
+    screens: {
+      sm: '640px',
+      md: '768px',
+      lg: '1024px',
+      xl: '1280px',
+    }
    // ...
   },
  variants: {
    // ...
  }
}
```

## Configure your color palette explicitly

**If you are already using a custom color palette, no changes are required and you can safely skip this step.**

The default color palette has changed considerably in Tailwind CSS v2.0 and is not designed to be a drop-in replacement for the color palette that was included in v1.

If you're using the default color palette, you should configure it explicitly to override the new default palette with the colors your site is already using.

Here is an example `tailwind.config.js` file that includes the default colors from v1:

```js
// tailwind.config.js
module.exports = {
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',

      black: '#000',
      white: '#fff',

      gray: {
        100: '#f7fafc',
        200: '#edf2f7',
        300: '#e2e8f0',
        400: '#cbd5e0',
        500: '#a0aec0',
        600: '#718096',
        700: '#4a5568',
        800: '#2d3748',
        900: '#1a202c',
      },
      red: {
        100: '#fff5f5',
        200: '#fed7d7',
        300: '#feb2b2',
        400: '#fc8181',
        500: '#f56565',
        600: '#e53e3e',
        700: '#c53030',
        800: '#9b2c2c',
        900: '#742a2a',
      },
      orange: {
        100: '#fffaf0',
        200: '#feebc8',
        300: '#fbd38d',
        400: '#f6ad55',
        500: '#ed8936',
        600: '#dd6b20',
        700: '#c05621',
        800: '#9c4221',
        900: '#7b341e',
      },
      yellow: {
        100: '#fffff0',
        200: '#fefcbf',
        300: '#faf089',
        400: '#f6e05e',
        500: '#ecc94b',
        600: '#d69e2e',
        700: '#b7791f',
        800: '#975a16',
        900: '#744210',
      },
      green: {
        100: '#f0fff4',
        200: '#c6f6d5',
        300: '#9ae6b4',
        400: '#68d391',
        500: '#48bb78',
        600: '#38a169',
        700: '#2f855a',
        800: '#276749',
        900: '#22543d',
      },
      teal: {
        100: '#e6fffa',
        200: '#b2f5ea',
        300: '#81e6d9',
        400: '#4fd1c5',
        500: '#38b2ac',
        600: '#319795',
        700: '#2c7a7b',
        800: '#285e61',
        900: '#234e52',
      },
      blue: {
        100: '#ebf8ff',
        200: '#bee3f8',
        300: '#90cdf4',
        400: '#63b3ed',
        500: '#4299e1',
        600: '#3182ce',
        700: '#2b6cb0',
        800: '#2c5282',
        900: '#2a4365',
      },
      indigo: {
        100: '#ebf4ff',
        200: '#c3dafe',
        300: '#a3bffa',
        400: '#7f9cf5',
        500: '#667eea',
        600: '#5a67d8',
        700: '#4c51bf',
        800: '#434190',
        900: '#3c366b',
      },
      purple: {
        100: '#faf5ff',
        200: '#e9d8fd',
        300: '#d6bcfa',
        400: '#b794f4',
        500: '#9f7aea',
        600: '#805ad5',
        700: '#6b46c1',
        800: '#553c9a',
        900: '#44337a',
      },
      pink: {
        100: '#fff5f7',
        200: '#fed7e2',
        300: '#fbb6ce',
        400: '#f687b3',
        500: '#ed64a6',
        600: '#d53f8c',
        700: '#b83280',
        800: '#97266d',
        900: '#702459',
      },
    }
  }
}
```

**We do not recommend updating existing sites to use the new default color palette.** The numbers are not meant to be transferrable, so for example `bg-red-600` in v2 is not just a "better" version of `bg-red-600` from v1 — it has different contrast characteristics. If you are happy with how your site looks, there is no reason to spend hours of your life updating your HTML. The old colors are great too!

## Configure your font-size scale explicitly

**If you are already using a custom typography scale, no changes are required and you can safely skip this step.**

In v2.0, each font-size utility includes a sensible size-specific line-height by default, so for example `text-sm` automatically sets a line-height of `1.25rem`.

This will change how your site looks anywhere where you haven't explicitly added a `leading` utility alongside a font-size utility.

The fastest way to get past this is to explicitly configure your font-size scale to use the scale from v1:

```js
// tailwind.config.js
module.exports = {
  theme: {
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '4rem',
    },
  }
}
```

Alternatively, you can go through your HTML and explicitly add a `leading` utility anywhere where you were depending on an inherited line-height:

```diff-html
- <p class="text-lg">...</p>
+ <p class="text-lg **leading-normal**">...</p>
```

## Update default theme keys to DEFAULT

In Tailwind CSS v1.x, the `default` keyword in various `theme` sections of the `tailwind.config.js` section sometimes meant "don't add a suffix to the class name".

For example, this configuration:

```js
// tailwind.config.js
module.exports = {
  theme: {
    borderRadius: {
      none: '0',
      sm: '0.125rem',
      default: '0.25rem',
      md: '0.375rem',
      lg: '0.5rem',
    },
  }
}
```

...would generated a `rounded` class with a `border-radius` of `0.25rem`, _not_ a `rounded-default` class.

In Tailwind CSS v2.0, we've updated all special usage of `default` to uppercase `DEFAULT` instead:

```js
// tailwind.config.js
module.exports = {
  theme: {
    borderRadius: {
      none: '0',
      sm: '0.125rem',
      DEFAULT: '0.25rem',
      md: '0.375rem',
      lg: '0.5rem',
    },
  }
}
```

Lowercase `default` will be treated like any other string, so a `default` value under `borderRadius` _will_ generate a `rounded-default` class in Tailwind CSS v.2.0.

You should update all usage of `default` in your config file to `DEFAULT`, _except_ where you actually want to generate a `{utility}-default` class, like for `cursor-default`.

Reference [the complete default configuration](https://github.com/tailwindlabs/tailwindcss/blob/master/stubs/defaultConfig.stub.js) to see where we now use `DEFAULT` and where we still use `default` if you are unclear about what changes you need to make to your own configuration.

## Move deliberately shallow extend to top-level

In Tailwind CSS v1.0, theme changes under `extend` were merged shallowly. So this configuration would override _all_ of the purple colors:

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        purple: {
          light: '#E9D8FD',
          medium: '#9F7AEA',
          dark: '#553C9A',
        }
      }
    }
  }
}
```

In v2.0, these are merged deeply, so the above configuration would still generate the default `purple-100` to `purple-900` shades in addition to the custom `purple-light`, `purple-medium`, and `purple-dark` shades.

For the most part this is just helpful, but if you were depending on the shallow merging you will want to move your customizations to the top-level, and manually merge in the other top-level colors:

```js
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  theme: {
    colors: {
      ...defaultTheme.colors,
      purple: {
        light: '#E9D8FD',
        medium: '#9F7AEA',
        dark: '#553C9A',
      }
    }
  }
}
```

You probably won't have to do this.


## Update `@apply` statements that rely on class order

The `@apply` feature has gotten a lot more powerful in v2.0, but a few behaviors needed to change to make that possible.

Previously, classes were applied in the order they appeared in your CSS:

```css
/* Input */
.my-class {
  @apply pt-5 p-4;
}

/* Output */
.my-class {
  padding-top: 1.25rem;
  padding: 1rem;
}
```

Now, classes are applied in the order they appear in the original CSS:

```css
/* Input */
.my-class {
  @apply pt-5 p-4;
}

/* Output */
.my-class {
  padding: 1rem;
  padding-top: 1.25rem;
}
```

This is to make sure the behavior matches the behavior you'd get in HTML:

```html
<!-- Here `pt-5` still takes precedence even though it appears first. -->
<div class="pt-5 p-4">...</div>
```

If you were depending on the old behavior, you may see some differences in how your site is rendered. To get around this, use multiple `@apply` declarations:

```css
.my-class {
  @apply pt-5;
  @apply p-4;
}
```

This is unlikely to affect almost anyone who wasn't going out their way to do something weird.

## Add your configured prefix to any @apply statements

In Tailwind CSS v1.0, you could `@apply` unprefixed utilities even if you had configured a prefix.

This is no longer supported in v2.0, so if you have a prefix (like `tw-`) configured for your site, you'll need to make sure you include that whenever you use `@apply`:

```css
.my-class {
  @apply tw-p-4 tw-bg-red-500;
}
```

## Remove leading dot from @apply statements

We used to support writing `@apply` statements with an optional leading `.` character:

```css
.my-class {
  @apply .p-4 .bg-red-500;
}
```

We don't support this anymore, so update any `@apply` statements and remove the dot:

```css
.my-class {
  @apply p-4 bg-red-500;
}
```

The following regex can be useful to find and remove the leading dots in your `@apply` statements:

```regex
(?<=@apply.*)\.
```

## Enable any truncate variants under textOverflow

The `truncate` utility is now part of the `textOverflow` core plugin, so if you had enabled any extra variants (like `group-hover`) for the `wordBreak` plugin in order to use them with the `truncate` class, you'll want to enable them for `textOverflow` now as well or instead:

```diff-js
  // tailwind.config.js
  module.exports = {
    variants: {
      wordBreak: ['responsive', 'group-hover'],
+     textOverflow: ['responsive', 'group-hover'],
    }
  }
```

## The scrolling-touch and scrolling-auto utilities have been removed

Since iOS 13 stopped supporting the `-webkit-overflow-scrolling` property, we've removed these two utilities from v2.0.

If you still need them because you are building something for older iOS versions, you can add them yourself as custom utilities:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer utilities {
  @responsive {
    .scrolling-touch {
      -webkit-overflow-scrolling: touch;
    }
    .scrolling-auto {
      -webkit-overflow-scrolling: auto;
    }
  }
}
```

## Update theme function references that read from arrays

The `theme` function (in CSS, the `tailwind.config.js` file, and in the plugin API) is more intelligent in v2.0 and no longer requires you to manually join arrays or access the first index explicitly.

```js
// tailwind.config.js
const plugin = require('tailwindcss/plugin')

module.exports = {
  theme: {
    fontSize: {
      // ...
      xl: ['20px', { lineHeight: '28px' }]
    }
  },
  plugins: [
    plugin(({ addBase, theme }) => {
      addBase({
        h1: {
          // Before
          fontSize: theme('fontSize.xl')[0],
          fontFamily: theme('fontFamily.sans').join(','),

          // Now
          fontSize: theme('fontSize.xl'),
          fontFamily: theme('fontFamily.sans'),
        }
      })
    })
  ]
}
```

If for whatever reason you want to access the raw data structure, you can use the `config` function instead.

## Add hidden to any template tags within space or divide elements

We used to have a special rule for ignoring `template` elements when using the `space-x/y` and `divide-x/y` utilities, mostly to make life easier for Alpine.js users.

We've updated how this works to no longer special case `template` elements and instead just explicitly ignore any element that has a `hidden` attribute.

To update your code for this change, just add `hidden` to your `template` tags:

```diff-html
  <div class="space-y-4">
-   <template x-for="item in items">
+   <template x-for="item in items" **hidden**>
      <!-- ... -->
    </template>
  </div>
```

## Update purge options to match PurgeCSS 3.0

Internally we've upgraded to [PurgeCSS 3.0](https://github.com/FullHuman/purgecss/releases/tag/v3.0.0), so any raw options you were passing into PurgeCSS through the `options` key need to be updated to match the options exposed in PurgeCSS 3.0.

For example, if you were using `whitelist`, you'll want to update this to `safelist`:

```diff-js
  // tailwind.config.js
  module.exports = {
    purge: {
      content: [
        // ...
      ],
      options: {
-       whitelist: ['my-class']
+       safelist: ['my-class']
      }
    }
  }
```

If you weren't using the `options` key, you don't need to do anything.

## Disable preserveHtmlElements if using a custom PurgeCSS extractor

In v1.0, Tailwind ignored the `preserveHtmlElements` option if you were using a custom extractor. This option is now properly respected in v2.0, so if you want to disable it you'll need to do so explicitly:

```diff-js
  // tailwind.config.js
  module.exports = {
    purge: {
      content: [
        // ...
      ],
+     preserveHtmlElements: false,
      options: {
        defaultExtractor: () => {
          // ...
        }
      }
    }
  }
```

## Prefix any keyframe references if needed

If you've configured a prefix in your `tailwind.config.js` file, Tailwind v2.0 will automatically apply that prefix to any keyframes declarations in your `theme`.

If you are referencing any configured keyframes in custom CSS, you'll want to make sure you add your prefix:

```diff-css
  .my-class {
-   animation: spin 1s infinite;
+   animation: tw-spin 1s infinite;
  }
```

This only matters if you've configured a prefix _and_ you're referencing configured keyframes in custom CSS files. If this affects more than two people on the entire planet I will be absolutely amazed.


