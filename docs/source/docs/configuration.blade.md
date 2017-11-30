---
extends: _layouts.documentation
title: "Configuration"
description: "A guide to configuring and customizing your Tailwind installation."
---

At the heart of every Tailwind project is a JavaScript configuration file that serves as the home for your project's design system.

It's where you define your color palette, font stacks, type scale, border sizes, breakpoints, opacity scale, you name it. Your config file is like an executable style guide for your project.

We provide a sensible default configuration with a very generous set of values to get you started, but you own this file; you're encouraged to change it as much as you need to fit the goals of your design.

It's important to understand that unlike other CSS frameworks you might have used, **none of the settings in this file are coupled to each other**. Nothing bad will happen even if you completely delete all of the values for a given module.

## Generating your configuration file

Generate a Tailwind config file for your project using the Tailwind CLI utility included when you install the `tailwindcss` npm package:

<div class="bg-smoke-lighter font-mono text-sm p-4">
  <div class="text-purple-dark">./node_modules/.bin/tailwind <span class="text-blue-dark">init</span> <span class="text-smoke-darker">[filename]</span></div>
</div>

By default, `tailwind init` will generate a `tailwind.js` config file at the root of your project, but feel free to name this file differently or store it in a different location if you prefer.

### Default configuration

Your generated configuration file contains all of Tailwind's default configuration values, ready for you to customize.

<pre class="h-128 overflow-y-scroll language-javascript"><code>{!! str_replace('// var defaultConfig', 'var defaultConfig', file_get_contents(dirname(dirname(__DIR__)).'/defaultConfig.stub.js')) !!}</code></pre>

## Configuration Sections

### Colors

The `colors` property doesn't actually affect your generated CSS on its own, but it's the perfect place to centralize your color palette so you can refer to it in your own CSS using Tailwind's [`config()`](/docs/functions-and-directives#config) function.

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
    'sm': '576px',
    'md': '768px',
    'lg': '992px',
    'xl': '1200px',
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

### Modules

The `modules` property is where you control which modules are generated, and what state variants to generate for each module.

```js
// ...

module.exports = {
  // ...

  modules: {
    appearance: ['responsive'],
    backgroundAttachment: ['responsive'],
    backgroundColors: ['responsive', 'hover'],
    backgroundPosition: ['responsive'],
    backgroundRepeat: ['responsive'],
    // ...
  },

  // ...
}
```

Each property is a module name pointing to an array of state variants to generate for that module.

The available state variants are:

- `responsive`, for generating breakpoint-specific versions of those utilities
- `hover`, for generating versions of those utilities that only take effect on hover
- `focus`, for generating versions of those utilities that only take effect on focus
- `parent-hover`, for generating versions of those utilities that only take effect when a marked parent element is hovered

To include a module but not generate any state variants, use an empty array:

```js
// ...

module.exports = {
  // ...

  modules: {

    // Include the `appearance` utilities, but not responsive,
    // focus, hover, etc. versions.
    appearance: [],
    // ...
  },

  // ...
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

### Options

#### Prefix

The `prefix` option allows you to add a custom prefix to all of Tailwind's generated utility classes.

This can be really useful when layering Tailwind on top of existing CSS where there might be naming conflicts.

For example, you could add a `tw-` prefix by setting the `prefix` option like so:

```js
{
  // ...
  options: {
    prefix: 'tw-',
    // ...
  }
}
```

It's important to understand that this prefix is added to the beginning of each *utility* name, not to the entire class name.

That means that classes with responsive or state prefixes like `sm:` or `hover:` will still have the responsive or state prefix *first*, with your custom prefix appearing after the colon:

```html
<div class="tw-text-lg md:tw-text-xl tw-bg-red hover:tw-bg-blue">
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
@media (min-width: 576px) {
  .sm\:bg-brand-gradient { ... }
}
@media (min-width: 768px) {
  .md\:bg-brand-gradient { ... }
}
@media (min-width: 992) {
  .lg\:bg-brand-gradient { ... }
}
@media (min-width: 1200px) {
  .xl\:bg-brand-gradient { ... }
}
```

If you'd like to prefix your own utilities as well, just add the prefix to the class definition:

```css
@responsive {
  .tw-bg-brand-gradient { ... }
}
```

#### Important

The `important` option lets you control whether or not Tailwind's utilities should be marked with `!important`.

This can be really useful when using Tailwind with existing CSS that has high specificity selectors.

To generate utilities as `!important`, set the `important` key in your configuration options to `true`:

```js
{
  // ...
  options: {
    important: true,
    // ...
  }
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

#### Separator

The `separator` option lets you customize what character or string should be used to separate state variant prefixes (screen sizes, `hover`, `focus`, etc.) from utility names (`text-center`, `items-end`, etc.).

We use a colon by default (`:`), but it can be useful to change this if you're using a templating language like [Pug](https://pugjs.org) that doesn't support special characters in classnames.

```js
// ...

module.exports = {
  // ...

  options: {
    // ...
    separator: '_',
  },

}
```
