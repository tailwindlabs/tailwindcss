---
title: Configuration
description: A guide to configuring and customizing your Tailwind installation.
---

import { CorePluginReference } from '@/components/CorePluginReference'

Because Tailwind is a framework for building bespoke user interfaces, it has been designed from the ground up with customization in mind.

By default, Tailwind will look for an optional `tailwind.config.js` file at the root of your project where you can define any customizations.

```js
// Example `tailwind.config.js` file
const colors = require('tailwindcss/colors')

module.exports = {
  theme: {
    colors: {
      gray: colors.coolGray,
      blue: colors.lightBlue,
      red: colors.rose,
      pink: colors.fuchsia,
    },
    fontFamily: {
      sans: ['Graphik', 'sans-serif'],
      serif: ['Merriweather', 'serif'],
    },
    extend: {
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
      }
    }
  },
  variants: {
    extend: {
      borderColor: ['focus-visible'],
      opacity: ['disabled'],
    }
  }
}
```

Every section of the config file is optional, so you only have to specify what you'd like to change. Any missing sections will fall back to Tailwind's [default configuration](https://github.com/tailwindlabs/tailwindcss/blob/master/stubs/defaultConfig.stub.js).

## Creating your configuration file

Generate a Tailwind config file for your project using the Tailwind CLI utility included when you install the `tailwindcss` npm package:

```shell
npx tailwindcss init
```

This will create a minimal `tailwind.config.js` file at the root of your project:

```js
// tailwind.config.js
module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
```

### Using a different file name

To use a name other than `tailwind.config.js`, pass it as an argument on the command-line:

```shell
npx tailwindcss init tailwindcss-config.js
```

If you use a custom file name, you will need to specify it when including Tailwind as a plugin in your PostCSS configuration as well:

```js
// postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: { config: './tailwindcss-config.js' },
  },
}
```

### Generating a PostCSS configuration file

Use the `-p` flag if you'd like to also generate a basic `postcss.config.js` file alongside your `tailwind.config.js` file:

```shell
npx tailwindcss init -p
```

This will generate a `postcss.config.js` file in your project that looks like this:

```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### Scaffolding the entire default configuration

For most users we encourage you to keep your config file as minimal as possible, and only specify the things you want to customize.

If you'd rather scaffold a complete configuration file that includes all of Tailwind's default configuration, use the `--full` option:

```shell
npx tailwindcss init --full
```

You'll get a file that matches the [default configuration file](https://unpkg.com/browse/tailwindcss@latest/stubs/defaultConfig.stub.js) Tailwind uses internally.

## Theme

The `theme` section is where you define your color palette, fonts, type scale, border sizes, breakpoints — anything related to the visual design of your site.

```js
// tailwind.config.js
module.exports = {
  theme: {
    colors: {
      gray: colors.coolGray,
      blue: colors.lightBlue,
      red: colors.rose,
      pink: colors.fuchsia,
    },
    fontFamily: {
      sans: ['Graphik', 'sans-serif'],
      serif: ['Merriweather', 'serif'],
    },
    extend: {
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
      }
    }
  }
}
```

Learn more about the default theme and how to customize it in the [theme configuration guide](/docs/theme).

## Variants

The `variants` section lets you control which [variants](/docs/hover-focus-and-other-states) are generated for each core utility plugin.

```js
// tailwind.config.js
module.exports = {
  variants: {
    fill: [],
    extend: {
      borderColor: ['focus-visible'],
      opacity: ['disabled'],
    }
  },
}
```

Learn more in the [variants configuration guide](/docs/configuring-variants).

## Plugins

The `plugins` section allows you to register plugins with Tailwind that can be used to generate extra utilities, components, base styles, or custom variants.

```js
// tailwind.config.js
module.exports = {
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/typography'),
    require('tailwindcss-children'),
  ],
}
```

Learn more about writing your own plugins in the [plugin authoring guide](/docs/plugins).

## Presets

The `presets` section allows you to specify your own custom base configuration instead of using Tailwind's default base configuration.

```js
// tailwind.config.js
module.exports = {
  presets: [
    require('@acmecorp/base-tailwind-config')
  ],

  // Project-specific customizations
  theme: {
    //...
  },
  // ...
}
```

Learn more about presets in the [presets documentation](/docs/presets).

## Prefix

The `prefix` option allows you to add a custom prefix to all of Tailwind's generated utility classes. This can be really useful when layering Tailwind on top of existing CSS where there might be naming conflicts.

For example, you could add a `tw-` prefix by setting the `prefix` option like so:

```js
// tailwind.config.js
module.exports = {
  prefix: 'tw-',
}
```

Now every class will be generated with the configured prefix:

```css
.tw-text-left {
  text-align: left;
}
.tw-text-center {
  text-align: center;
}
.tw-text-right {
  text-align: right;
}
/* etc. */
```

It's important to understand that this prefix is added _after_ any variant prefixes. That means that classes with responsive or state prefixes like `sm:` or `hover:` will still have the responsive or state prefix *first*, with your custom prefix appearing after the colon:

```html
<div class="tw-text-lg md:tw-text-xl tw-bg-red-500 **hover:tw-bg-blue-500**">
  <!-- -->
</div>
```

Prefixes are only added to classes generated by Tailwind; **no prefix will be added to your own custom classes.**

That means if you add your own responsive utility like this:

```css
@variants hover {
  .bg-brand-gradient { /* ... */ }
}
```

...the generated responsive classes will not have your configured prefix:

```css
.bg-brand-gradient { /* ... */ }
.hover\:bg-brand-gradient:hover { /* ... */ }
```

If you'd like to prefix your own utilities as well, just add the prefix to the class definition:

```css
@variants hover {
  .tw-bg-brand-gradient { /* ... */ }
}
```

## Important

The `important` option lets you control whether or not Tailwind's utilities should be marked with `!important`. This can be really useful when using Tailwind with existing CSS that has high specificity selectors.

To generate utilities as `!important`, set the `important` key in your configuration options to `true`:

```js
// tailwind.config.js
module.exports = {
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
.leading-snug {
  line-height: 1.375 !important;
}
/* etc. */
```

Note that any of your own custom utilities **will not** automatically be marked as `!important` by enabling this option.

If you'd like to make your own utilities `!important`, just add `!important` to the end of each declaration yourself:

```css
@responsive {
  .bg-brand-gradient {
    background-image: linear-gradient(#3490dc, #6574cd) !important;
  }
}
```

### Selector strategy

Setting `important` to `true` can introduce some issues when incorporating third-party JS libraries that add inline styles to your elements. In those cases, Tailwind's `!important` utilities defeat the inline styles, which can break your intended design.

To get around this, you can set `important` to an ID selector like `#app` instead:

```js
// tailwind.config.js
module.exports = {
  important: '#app',
}
```

This configuration will prefix all of your utilities with the given selector, effectively increasing their specificity without actually making them `!important`.

After you specify the `important` selector, you'll need to ensure that the root element of your site matches it.  Using the example above, we would need to set our root element's `id` attribute to `app` in order for styles to work properly.

After your configuration is all set up and your root element matches the selector in your Tailwind config, all of Tailwind's utilities will have a high enough specificity to defeat other classes used in your project, **without** interfering with inline styles:

```html
<html>
<!-- ... -->
<style>
  .high-specificity .nested .selector {
    color: blue;
  }
</style>
<body id="app">
  <div class="high-specificity">
    <div class="nested">
      <!-- Will be red-500 -->
      <div class="selector text-red-500"><!-- ... --></div>
    </div>
  </div>

  <!-- Will be #bada55 -->
  <div class="text-red-500" style="color: #bada55;"><!-- ... --></div>
</body>
</html>
```


## Separator

The `separator` option lets you customize what character or string should be used to separate variant prefixes (screen sizes, `hover`, `focus`, etc.) from utility names (`text-center`, `items-end`, etc.).

We use a colon by default (`:`), but it can be useful to change this if you're using a templating language like [Pug](https://pugjs.org) that doesn't support special characters in class names.

```js
// tailwind.config.js
module.exports = {
  separator: '_',
}
```

## Variant Order

If you are using the `extend` feature to enable extra variants, those variants are automatically sorted to respect a sensible default variant order.

You can customize this if necessary under the `variantOrder` key:

```js
// tailwind.config.js
module.exports = {
  // ...
  variantOrder: [
    'first',
    'last',
    'odd',
    'even',
    'visited',
    'checked',
    'group-hover',
    'group-focus',
    'focus-within',
    'hover',
    'focus',
    'focus-visible',
    'active',
    'disabled',
  ]
}
```

## Core Plugins

The `corePlugins` section lets you completely disable classes that Tailwind would normally generate by default if you don't need them for your project.

If you don't provide any `corePlugins` configuration, all core plugins will be enabled by default:

```js
// tailwind.config.js
module.exports = {
  // ...
}
```

If you'd like to disable specific core plugins, provide an object for `corePlugins` that sets those plugins to `false`:

```js
// tailwind.config.js
module.exports = {
  corePlugins: {
    float: false,
    objectFit: false,
    objectPosition: false,
  }
}
```

If you'd like to safelist which core plugins should be enabled, provide an array that includes a list of the core plugins you'd like to use:

```js
// tailwind.config.js
module.exports = {
  corePlugins: [
    'margin',
    'padding',
    'backgroundColor',
    // ...
  ]
}
```

If you'd like to disable all of Tailwind's core plugins and simply use Tailwind as a tool for processing your own custom plugins, provide an empty array:

```js
// tailwind.config.js
module.exports = {
  corePlugins: []
}
```


Here's a list of every core plugin for reference:

<CorePluginReference />

## Referencing in JavaScript

It can often be useful to reference your configuration values in your own client-side JavaScript — for example to access some of your theme values when dynamically applying inline styles in a React or Vue component.

To make this easy, Tailwind provides a `resolveConfig` helper you can use to generate a fully merged version of your configuration object:

```js
import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from './tailwind.config.js'

const fullConfig = resolveConfig(tailwindConfig)

fullConfig.theme.width[4]
// => '1rem'

fullConfig.theme.screens.md
// => '768px'

fullConfig.theme.boxShadow['2xl']
// => '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
```

Note that this will transitively pull in a lot of our build-time dependencies, resulting in bigger bundle client-side size. To avoid this, we recommend using a tool like [babel-plugin-preval](https://github.com/kentcdodds/babel-plugin-preval) to generate a static version of your configuration at build-time.
