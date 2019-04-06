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

We provide a sensible default theme with a very generous set of values to get you started, but don't be afraid to change it or extend; you're encouraged to customize it as much as you need to to fit the goals of your design.

## Customizing the default theme

Out of the box, your project will automatically inherit the values from [the default theme configuration](https://github.com/tailwindcss/tailwindcss/blob/next/stubs/defaultConfig.stub.js#L5). That means that if you don't want to change anything, you don't have to create a `theme` section in your `tailwind.config.js` file at all.

If you do create a `theme` section, Tailwind will **shallowly merge** your configuration with the default configuration.

This means that if you provide a key like `opacity`, it will **replace** the default opacity values.

### Screens

### Colors

### Spacing

### Core plugin styles

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

### Extending the default values

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

### Referencing other theme values

### Adding your own keys


