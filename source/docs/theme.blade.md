---
extends: _layouts.documentation
title: "Theme Configuration"
description: "Customizing the default theme for your project."
titleBorder: true
---

@include('_partials.work-in-progress')

To Document:

- Explain how default configuration is always inherited
- How it's fine to add your own custom keys
- Explain how to use closures to depend on other parts of the theme, warn about infinite recursion
- How to use `extend` and how that works
- Complete table of core plugin keys

---

The `theme` section of your `tailwind.config.js` file is like the style guide for your project — it's where you define your color palette, type scale, font stacks, breakpoints, border radius values, etc.

```js
// tailwind.config.js
module.exports = {
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    },
    fontFamily: {
      display: ['Gilroy', 'sans-serif'],
      body: ['Graphik', 'sans-serif'],
    },
    borderWidth: {
      default: '1px',
      '0': '0',
      '2': '2px',
      '4': '4px',
    },
    extend: {
      colors: {
        cyan: '#9cdbff',
      },
      spacing: {
        '96': '24rem',
        '128': '32rem',
      }
    }
  }
}
```

We provide a sensible [default theme](https://github.com/tailwindcss/tailwindcss/blob/next/stubs/defaultConfig.stub.js#L5) with a very generous set of values to get you started, but don't be afraid to change it or extend; you're encouraged to customize it as much as you need to to fit the goals of your design.

## Customizing the default theme

Out of the box, your project will automatically inherit the values from [the default theme configuration](https://github.com/tailwindcss/tailwindcss/blob/next/stubs/defaultConfig.stub.js#L5). That means that if you don't want to change anything, you don't have to create a `theme` section in your `tailwind.config.js` file at all.

```js
// tailwind.config.js
module.exports = {}
```

### Overriding the default value

If you do create a `theme` section, any keys you provide will **replace** those keys in the default theme.

```js
// tailwind.config.js
module.exports = {
  theme: {
    // Replaces all of the default `opacity` values
    opacity: {
      '0': '0',
      '20': '0.2',
      '40': '0.4',
      '60': '0.6',
      '80': '0.8',
      '100': '1',
    }
  }
}
```

Any keys you **do not** provide will be inherited from the default theme, so in the above example, the default theme configuration for things like colors, spacing, border radius, background position, etc. would be preserved.

### Extending the default theme

The `theme.extend` property allows you to extend parts of the default theme without completely replacing them.

For example, if you wanted to add an extra breakpoint but preserve the existing ones, you could extend the `screens` property:

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      screens: {
        '2xl': '1440px',
      }
    }
  }
}
```

### Referencing other values

### Removing a default value

## Screens

## Colors

## Spacing

## Core plugins

The rest of the `theme` section is used to configure which values are available for each individual core plugin.

For example, you can use `theme.borderRadius` to customize which border radius utilities will be generated:

```js
module.exports = {
  theme: {
    borderRadius: {
      'none': '0',
      'sm': '.125rem',
      default: '.25rem',
      'lg': '.5rem',
      'full': '9999px',
    },
  }
}
```

To learn more about customizing a specific core plugin, visit the documentation for that plugin.

For a complete reference of available theme properties and their default values, [see the default theme configuration](https://github.com/tailwindcss/tailwindcss/blob/next/stubs/defaultConfig.stub.js#L5).

## Adding your own keys

## Default key reference

| Key | Description |
| --- | --- |
| `screens` | Your project's responsive breakpoints |
| `colors` | Your project's color palette |
| `spacing` | Your project's spacing scale |
| `container` | Configuration for the `container` plugin |
| `backgroundColor` | Values for the `background-color` property |
| `backgroundPosition` | Values for the `background-position` property |
| `backgroundSize` | Values for the `background-size` property |
| `borderColor` | Values for the `border-color` property |
| `borderRadius` | Values for the `border-radius` property |
| `borderStyle` | Values for the `border-style` property |
| `borderWidth` | Values for the `border-width` property |
| `boxShadow` | Values for the `box-shadow` property |
| `cursor` | Values for the `cursor` property |
| `fill` | Values for the `fill` property |
| `flex` | Values for the `flex` property |
| `flexGrow` | Values for the `flex-grow` property |
| `flexShrink` | Values for the `flex-shrink` property |
| `fontFamily` | Values for the `font-family` property |
| `fontSize` | Values for the `font-size` property |
| `fontWeight` | Values for the `font-weight` property |
| `height` | Values for the `height` property |
| `inset` | Values for the `inset` property |
| `letterSpacing` | Values for the `letter-spacing` property |
| `lineHeight` | Values for the `line-height` property |
| `listStyleType` | Values for the `list-style-type` property |
| `margin` | Values for the `margin` property |
| `maxHeight` | Values for the `max-height` property |
| `maxWidth` | Values for the `max-width` property |
| `minHeight` | Values for the `min-height` property |
| `minWidth` | Values for the `min-width` property |
| `negativeMargin` | Values for the `negative-margin` property |
| `objectPosition` | Values for the `object-position` property |
| `opacity` | Values for the `opacity` property |
| `padding` | Values for the `padding` property |
| `stroke` | Values for the `stroke` property |
| `textColor` | Values for the `text-color` property |
| `width` | Values for the `width` property |
| `zIndex` | Values for the `z-index` property |



