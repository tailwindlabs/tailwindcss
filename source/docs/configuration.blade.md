---
extends: _layouts.documentation
title: "Configuration"
description: "A guide to configuring and customizing your Tailwind installation."
titleBorder: true
---

Because Tailwind is a framework for building bespoke user interfaces, it has been designed from the ground up with customization in mind.

By default, Tailwind will look for a `tailwind.config.js` file at the root of your project where you can define all of your customizations.

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

## Creating your configuration file

Generate a Tailwind config file for your project using the Tailwind CLI utility included when you install the `tailwindcss` npm package:

```bash
npx tailwind init
```

This will create a minimal `tailwind.config.js` file at the root of your project:

```js
// tailwind.config.js
module.exports = {
  theme: {},
  variants: {},
  plugins: [],
}
```

### Using a different file name

To use a name other than `tailwind.config.js`, pass it as an argument on the command-line:

```bash
npx tailwind init tailwindcss-config.js
```

If you use a custom file name, you will need to specify it when including Tailwind as a plugin in your PostCSS configuration as well:

```js
// postcss.config.js
module.exports = {
  plugins: [
    require('tailwindcss')('./tailwindcss-config.js'),
  ],
}
```

### Scaffolding the entire default configuration

For most users we encourage you to keep your config file as minimal as possible, and only specify the things you want to customize.

If you'd rather scaffold a complete configuration file that includes all of Tailwind's default configuration, use the `--full` option:

```bash
npx tailwind init --full
```

You'll get a file that matches the [default configuration file](https://github.com/tailwindcss/tailwindcss/blob/next/stubs/defaultConfig.stub.js) Tailwind uses internally.

## Theme

To Document:

- Explain how default configuration is always inherited
- Explain how to use closures to depend on other parts of the theme, warn about infinite recursion
- How to use `extend` and how that works
- Complete table of core plugin keys

The `theme` section is where you define your color palette, font stacks, type scale, border sizes, breakpoints — you name it. It's like an executable design system for your project.

We provide a sensible default system with a very generous set of values to get you started, but don't be afraid to change it or extend; you're encouraged to customize it as much as you need to to fit the goals of your design.

In this guide we'll be focusing on a few of the more special theme properties as well as general customization information and best practices, but for a complete reference of available theme properties, take a look at the default theme:

[**View the complete list of theme properties &rarr;**](https://github.com/tailwindcss/tailwindcss/blob/next/stubs/defaultConfig.stub.js#L5-L376)

### Colors

The `theme.colors` property allows you to override Tailwind's default color palette.

```js
// tailwind.config.js
module.exports = {
  theme: {
    colors: {
      indigo: '#5c6ac4',
      blue: '#007ace',
      red: '#de3618',
    }
  }
}
```

By default this color palette is shared by the `textColor`, `borderColor`, and `backgroundColor` utilities. The above configuration would generate classes like `.text-indigo`, `.border-blue`, and `.bg-red`.

You can define your colors as a simple list of key-value pairs, or using a nested object notation where the nested keys are added to the base color name as modifiers:

```js
// tailwind.config.js
module.exports = {
  theme: {
    colors: {
      indigo: {
        lighter: '#b3bcf5',
        default: '#5c6ac4',
        dark: '#202e78',
      }
    }
  }
}
```

Like many other places in Tailwind, the `default` key is special and means "no modifier", so this configuration would generate classes like `.text-indigo-lighter`, `.text-indigo`, and `.text-indigo-dark`.

### Spacing

The `theme.spacing` property allows you to override Tailwind's default spacing/sizing scale.

```js
// tailwind.config.js
module.exports = {
  theme: {
    spacing: {
      '1': '8px',
      '2': '12px',
      '3': '16px',
      '4': '24px',
      '5': '32px',
      '6': '48px',
    }
  }
}
```

By default the spacing scale is shared by the `padding`, `margin`, `negativeMargin`, `width`, and `height` utilities. The above configuration would generate classes like `.p-2`, `.mt-3`, `.-mx-4`, `.w-5`, `.h-6`, etc.

### Screens

The `theme.screens` property is where you define your project's breakpoints.

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

We provide a well-considered set of default breakpoints based on common device resolutions to get you started, but you're free to change these as needed to suit your project.

Learn more about customizing screens in the [Responsive Design](/docs/responsive-design#customizing-screens) documentation.

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

## Variants

To Document:

- Demo why you might want a different variant order for different utilities
- Link to creating your own variants using plugins
- Complete table of default enabled variants

The `variants` section is where you control which [state variants](/docs/state-variants) are generated for each core utility plugin.

```js
// tailwind.config.js
module.exports = {
  // ...
  variants: {
    appearance: ['responsive'],
    backgroundColors: ['responsive', 'hover', 'focus'],
    fill: [],
  },
}
```

Each property is a core plugin name pointing to an array of state variants to generate for that plugin.

It's important to note that (`responsive` excluded) **variants are generated in the order you specify them**, so variants at the end of the list will take precedence over variants at the beginning of the list.

Learn more about state variants in the ["State Variants" documentation](/docs/state-variants).

## Plugins

// To do...

## Prefix

The `prefix` option allows you to add a custom prefix to all of Tailwind's generated utility classes.

This can be really useful when layering Tailwind on top of existing CSS where there might be naming conflicts.

For example, you could add a `tw-` prefix by setting the `prefix` option like so:

```js
// tailwind.config.js
module.exports = {
  // ...
  options: {
    prefix: 'tw-',
    // ...
  }
}
```

You can also pass a function to the `prefix` option if you need more fine-grained control:

```js
// tailwind.config.js
module.exports = {
  // ...
  prefix: function (selector) {
    if (selector === '.container') {
      return 'tw-'
    }

    return ''
  },
}
```

It's important to understand that this prefix is added to the beginning of each *utility* name, not to the entire class name.

That means that classes with responsive or state prefixes like `sm:` or `hover:` will still have the responsive or state prefix *first*, with your custom prefix appearing after the colon:

```html
<div class="tw-text-lg md:tw-text-xl tw-bg-red-500 hover:tw-bg-blue-500">
  <!-- -->
</div>
```

Prefixes are only added to standard Tailwind utilities; **no prefix will be added to your own custom utilities.**

That means if you add your own responsive utility like this:

```css
@responsive {
  .bg-brand-gradient { /* ... */ }
}
```

...the generated responsive classes will not have your configured prefix:

```css
.bg-brand-gradient { /* ... */ }
@media (min-width: 640px) {
  .sm\:bg-brand-gradient { /* ... */ }
}
@media (min-width: 768px) {
  .md\:bg-brand-gradient { /* ... */ }
}
@media (min-width: 992) {
  .lg\:bg-brand-gradient { /* ... */ }
}
@media (min-width: 1280px) {
  .xl\:bg-brand-gradient { /* ... */ }
}
```

If you'd like to prefix your own utilities as well, just add the prefix to the class definition:

```css
@responsive {
  .tw-bg-brand-gradient { /* ... */ }
}
```

## Important

The `important` option lets you control whether or not Tailwind's utilities should be marked with `!important`.

This can be really useful when using Tailwind with existing CSS that has high specificity selectors.

To generate utilities as `!important`, set the `important` key in your configuration options to `true`:

```js
// tailwind.config.js
module.exports = {
  // ...
  important: true,
}
```

Now all of Tailwind's utility classes will be generated as `!important`:

```css
.leading-none {
  line-height: 1 !important;
}
.leading-tight {
  line-height: 1.25 !important;
}
.leading-normal {
  line-height: 1.5 !important;
}
.leading-loose {
  line-height: 2 !important;
}
```

Note that any of your own custom utilities **will not** be marked as `!important` just by enabling this option.

If you'd like to make your own utilities `!important`, just add `!important` to the end of each declaration yourself:

```css
@responsive {
  .bg-brand-gradient {
    background-image: linear-gradient(#3490dc, #6574cd) !important;
  }
}
```

## Separator

The `separator` option lets you customize what character or string should be used to separate state variant prefixes (screen sizes, `hover`, `focus`, etc.) from utility names (`text-center`, `items-end`, etc.).

We use a colon by default (`:`), but it can be useful to change this if you're using a templating language like [Pug](https://pugjs.org) that doesn't support special characters in class names.

```js
// tailwind.config.js
module.exports = {
  // ...
  separator: '_',
}
```

## Core Plugins

- Explain how to disable core plugins, include complete list of keys
