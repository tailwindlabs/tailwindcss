---
extends: _layouts.documentation
title: "Theme"
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

We provide a sensible default system with a very generous set of values to get you started, but don't be afraid to change it or extend; you're encouraged to customize it as much as you need to to fit the goals of your design.

In this guide we'll be focusing on a few of the more special theme properties as well as general customization information and best practices, but for a complete reference of available theme properties, take a look at the default theme:

[**View the complete list of theme properties &rarr;**](https://github.com/tailwindcss/tailwindcss/blob/next/stubs/defaultConfig.stub.js#L5-L376)

### Extend

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
