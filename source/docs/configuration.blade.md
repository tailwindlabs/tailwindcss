---
extends: _layouts.documentation
title: "Configuration"
description: "A guide to configuring and customizing your Tailwind installation."
titleBorder: true
---

Because Tailwind is a framework for building bespoke user interfaces, it has been designed from the ground up with customization in mind.

By default, Tailwind will look for a `tailwind.config.js` file at the root of your project where you can define all of your customizations.

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

This is where you can define your own color palette, font stacks, type scale, border sizes, breakpoints, you name it. Your config file is like an executable style guide for your project.

We provide a sensible default configuration with a very generous set of values to get you started, but you don't be afraid to; you're encouraged to change it as much as you need to fit the goals of your design.

It's important to understand that unlike other CSS frameworks you might have used, **none of the settings in this file are coupled to each other**. Nothing bad will happen even if you completely delete all of the values for a given module.

### Colors

The `colors` property doesn't actually affect your generated CSS on its own, but it's the perfect place to centralize your color palette so you can refer to it in your own CSS using Tailwind's [`theme()`](/docs/functions-and-directives#config) function.

```js
// ...

var colors = {
  'transparent': 'transparent',
  // ...
  'pink-lightest': '#ffebef',
}

// ...

module.exports = {
  // ...
  colors: colors,
  // ...
}
```

By default, the `colors` property simply references a `colors` variable defined earlier in the file. Using a separate variable for your color palette like this makes it easy to re-use those colors when defining the color palette for individual utilities, like background colors, text colors, or border colors.

Learn more about defining colors in Tailwind in the [Colors](/docs/colors) documentation.

### Screens

The `screens` property is where you define your project's breakpoints, and will be used to generate responsive versions of Tailwind's utility classes.

```js
// ...

module.exports = {
  // ...
  screens: {
    'sm': '640px',
    'md': '768px',
    'lg': '1024px',
    'xl': '1280px',
  },
  // ...
}
```

We provide a familiar set of breakpoints that you might recognize from [Bootstrap](http://getbootstrap.com/docs/4.0/layout/overview/#responsive-breakpoints) to get you started, but you're free to change these as needed to suit your project.

Learn more about customizing screens in the [Responsive Design](/docs/responsive-design#customizing-screens) documentation.

### Styles

The next set of properties define all of the values you'd like to use for utilities that are dynamically generated.

This includes things like:

- Background colors
- Border widths
- Font families
- Font weights
- Text sizes
- Padding, margin, and negative margin scales
- Width and height scales

...and many others.

For example, here's the section used to customize which border radius utilities will be generated:

```js
// ...

module.exports = {
  // ...

  /*
  |-----------------------------------------------------------------------------
  | Border radius                    https://tailwindcss.com/docs/border-radius
  |-----------------------------------------------------------------------------
  |
  | Here is where you define your border radius values. If a `default` radius
  | is provided, it will be made available as the non-suffixed `.rounded`
  | utility.
  |
  | If your scale includes a `0` value to reset already rounded corners, it's
  | a good idea to put it first so other values are able to override it.
  |
  | Class name: .rounded{-side?}{-size?}
  |
  */

  borderRadius: {
    'none': '0',
    'sm': '.125rem',
    default: '.25rem',
    'lg': '.5rem',
    'full': '9999px',
  },

  // ...
}
```

Read through the generated config file or visit the "customizing" documentation for each module to learn more.

## Variants

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

To include a module but not generate any state variants, use an empty array:

```js
// tailwind.config.js
module.exports = {
  // ...
  variants: {
    // Include the `appearance` utilities, but not responsive,
    // focus, hover, etc. versions.
    appearance: [],
  },
}
```

To completely disable a module, set it to `false`:

```js
// ...

module.exports = {
  // ...

  modules: {

    // Don't include this module at all.
    appearance: false,
    // ...
  },

  // ...
}
```

If a module is missing from your configuration file, the default configuration for that module will be used.

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
  .bg-brand-gradient { ... }
}
```

...the generated responsive classes will not have your configured prefix:

```css
.bg-brand-gradient { ... }
@media (min-width: 640px) {
  .sm\:bg-brand-gradient { ... }
}
@media (min-width: 768px) {
  .md\:bg-brand-gradient { ... }
}
@media (min-width: 992) {
  .lg\:bg-brand-gradient { ... }
}
@media (min-width: 1280px) {
  .xl\:bg-brand-gradient { ... }
}
```

If you'd like to prefix your own utilities as well, just add the prefix to the class definition:

```css
@responsive {
  .tw-bg-brand-gradient { ... }
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
