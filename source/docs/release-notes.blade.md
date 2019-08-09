---
extends: _layouts.documentation
title: "Release Notes"
description: "What's new in the latest version of Tailwind CSS."
titleBorder: true
---

<h2 class="mb-0">Tailwind CSS v1.1</h2>
<div class="mt-0 text-gray-600">Aug 6, 2019</div>

The first new feature release since v1.0 has arrived! Tailwind v1.1 includes a bunch of new stuff, but I think the things you'll probably be most excited about are:

- [New screenreader visibility utilities](https://github.com/tailwindcss/tailwindcss/releases/tag/v1.1.0#added-utilities-for-screenreader-visibility)
- [New utilities for setting the placeholder color on form elements](https://github.com/tailwindcss/tailwindcss/releases/tag/v1.1.0#added-utilities-for-placeholder-color)
- [New variants for `first-child`, `last-child`, `nth-child(odd)`, and `nth-child(even)`](https://github.com/tailwindcss/tailwindcss/releases/tag/v1.1.0#first-last-even-and-odd-child-variants)

For the full list of changes, [check out the complete release notes on GitHub](https://github.com/tailwindcss/tailwindcss/releases/tag/v1.1.0).

**Important note** — although this is a minor release, it includes two bug fixes that may have a superficial impact on how your site looks if you are using horizontal rules in your site or are relying on the default placeholder color defined in Tailwind's base styles.

Be sure to read through the [fixes](https://github.com/tailwindcss/tailwindcss/releases/tag/v1.1.0#fixes) section before upgrading to understand the impact.

---

<h2 class="mb-0">Tailwind CSS v1.0</h2>
<div class="mt-0 text-gray-600">May 13, 2019</div>

A year and a half in the making, the first stable release of Tailwind CSS is finally here! 🎉

Since we released the first alpha on November 1st, 2017, the framework has seen **43 releases**, racked up **2,281 commits** from **88 contributors**, and been installed over **1.4 million times**.

It's been adopted by big companies like [Algolia](https://www.algolia.com/doc/) and [Mozilla](https://send.firefox.com/), and used to build new startups like [RightMessage](https://rightmessage.com/) and [PingPing](https://pingping.io/).

It's been a long road, but I'm super excited to finally have a truly stable version in the wild for us to build on for the future.

This release focuses mostly on solidifying the existing API and locking in any breaking changes, but does include some exciting changes too.

For a full list of changes and instructions on upgrading, [read the upgrade guide](/docs/upgrading-to-v1).

### Revamped config file format

In v1.0, the config file is completely optional, and if you do add a config file, you only need to specify your customizations, not your entire design system.

```js
// Example `tailwind.config.js` file

module.exports = {
  important: true,
  theme: {
    fontFamily: {
      display: ['Gilroy', 'sans-serif'],
      body: ['Graphik', 'sans-serif'],
    },
    extend: {
      colors: {
        cyan: '#9cdbff',
      },
      margin: {
        '96': '24rem',
        '128': '32rem',
      },
    }
  },
  variants: {
    opacity: ['responsive', 'hover']
  }
}
```

This makes it a lot easier to know what values are custom for your project and which ones are built in to Tailwind by default, and in general keeps your config file a lot simpler and more manageable.

Learn more about the new configuration format in [the configuration documentation](/docs/configuration).

### Redesigned color palette

Tailwind v1.0 includes a brand new numeric color palette, where each color now comes with nine shades instead of seven.

@include('_partials.color-palette', [
  'colorName' => 'Teal',
  'color' => 'teal',
  'breakpoint' => '400',
])

Explore the new color palette in [the customizing colors documentation](/docs/customizing-colors#default-color-palette).

### Updated breakpoints

We've updated the default breakpoints for v1.0 to better reflect common modern device resolutions.

```js
// tailwind.config.js
module.exports = {
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
    }
  }
}
```

The new breakpoints are more practical to work with and make it a bit easier to avoid annoying compromises in your responsive designs.

New to responsive design with Tailwind? Check out our [responsive design documentation](/docs/responsive-design) to learn more.

### New top/right/bottom/left utilities

Tailwind v1.0 includes new configurable utilities for `top`, `right`, `bottom`, and `left`, so you're no longer limited by the old `pin` classes.

```html
<div class="top-16"><!-- ... --></div>
```

Learn more in the [top/right/bottom/left documentation](/docs/top-right-bottom-left).

### New order utilities

Tailwind v1.0 also includes new utilities for the `order` property so you can easily re-order elements inside of flex containers.

```html
<div class="flex">
  <div class="order-last">1</div>
  <div>2</div>
  <div>3</div>
</div>
```

Learn more in the [order documentation](/docs/order).
