---
extends: _layouts.documentation
title: "Writing Plugins"
description: "Extending Tailwind with reusable third-party plugins."
titleBorder: true
---

<h2 style="font-size: 0" class="invisible m-0 -mb-6">Overview</h2>

At their simplest, plugins are just functions that register new styles for Tailwind to inject into the user's stylesheet. That means that to get started authoring your own plugin, all you need to do is add an anonymous function to the `plugins` list in your config file:

```js
// tailwind.config.js
module.exports = {
  plugins: [
    function({ addUtilities, addComponents, e, prefix, config }) {
      // This function is your plugin
    },
  ]
}
```

Plugin functions receive a single object argument that can be [destructured](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) into several helper functions:

- `addUtilities()`, for registering new utility styles
- `addComponents()`, for registering new component styles
- `addBase()`, for registering new base styles
- `addVariant()`, for registering custom variants
- `e()`, for escaping strings meant to be used in class names
- `prefix()`, for manually applying the user's configured prefix to parts of a selector
- `variants()`, for looking up values in the user's variants configuration
- `config()`, for looking up values in the user's Tailwind configuration

## Adding utilities

The `addUtilities` function allows you to register new styles to be output (along with the built-in utilities) at the `@@tailwind utilities` directive.

Plugin utilities are output in the order they are registered, *after* built-in utilities, so if a plugin targets any of the same properties as a built-in utility, the plugin utility will take precedence.

To add new utilities from a plugin, call `addUtilities`, passing in your styles using [CSS-in-JS syntax](#css-in-js-syntax):

```js
// tailwind.config.js
module.exports = {
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.skew-10deg': {
          transform: 'skewY(-10deg)',
        },
        '.skew-15deg': {
          transform: 'skewY(-15deg)',
        },
      }

      addUtilities(newUtilities)
    }
  ]
}
```

### Prefix and important preferences

By default, plugin utilities automatically respect the user's [`prefix`](/docs/configuration/#prefix) and [`important`](/docs/configuration/#important) preferences.

That means that given this Tailwind configuration:

```js
// tailwind.config.js
module.exports = {
  prefix: 'tw-',
  important: true,
  // ...
}
```

...the example plugin above would generate the following CSS:

```css
.tw-skew-10deg {
  transform: skewY(-10deg) !important;
}
.tw-skew-15deg {
  transform: skewY(-15deg) !important;
}
```

If necessary, you can opt out of this behavior by passing an options object as a second parameter to `addUtilities`:

```js
// tailwind.config.js
module.exports = {
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        // ...
      }

      addUtilities(newUtilities, {
        respectPrefix: false,
        respectImportant: false,
      })
    }
  ]
}
```

### Responsive and state variants

To generate responsive, hover, focus, active, or group-hover variants of your styles, specify the variants you'd like to generate using the `variants` option:

```js
// tailwind.config.js
module.exports = {
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        // ...
      }

      addUtilities(newUtilities, {
        variants: ['responsive', 'hover'],
      })
    }
  ]
}
```

If you only need to specify variants and don't need to opt-out of the default prefix or important options, you can also pass the array of variants as the second parameter directly:

```js
// tailwind.config.js
module.exports = {
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        // ...
      }

      addUtilities(newUtilities, ['responsive', 'hover'])
    }
  ]
}
```

If you'd like the user to provide the variants themselves under the `variants` section in their `tailwind.config.js` file, you can use the `variants()` function to get the variants they have configured:

```js
// tailwind.config.js
module.exports = {
  variants: {
    customPlugin: ['responsive', 'hover'],
  },
  plugins: [
    function({ addUtilities, variants }) {
      const newUtilities = {
        // ...
      }

      addUtilities(newUtilities, variants('customPlugin'))
    }
  ]
}
```

## Adding components

The `addComponents` function allows you to register new styles to be output at the `@@tailwind components` directive.

Use it to add more opinionated, complex classes like buttons, form controls, alerts, etc; the sort of pre-built components you often see in other frameworks that you might need to override with utility classes.

To add new component styles from a plugin, call `addComponents`, passing in your styles using [CSS-in-JS syntax](#css-in-js-syntax):

```js
// tailwind.config.js
module.exports = {
  plugins: [
    function({ addComponents }) {
      const buttons = {
        '.btn': {
          padding: '.5rem 1rem',
          borderRadius: '.25rem',
          fontWeight: '600',
        },
        '.btn-blue': {
          backgroundColor: '#3490dc',
          color: '#fff',
          '&:hover': {
            backgroundColor: '#2779bd'
          },
        },
        '.btn-red': {
          backgroundColor: '#e3342f',
          color: '#fff',
          '&:hover': {
            backgroundColor: '#cc1f1a'
          },
        },
      }

      addComponents(buttons)
    }
  ]
}
```

### Prefix and important preferences

By default, component classes automatically respect the user's `prefix` preference, but **they are not affected** by the user's `important` preference.

That means that given this Tailwind configuration:

```js
// tailwind.config.js
module.exports = {
  prefix: 'tw-',
  important: true,
  // ...
}
```

...the example plugin above would generate the following CSS:

```css
.tw-btn {
  padding: .5rem 1rem;
  border-radius: .25rem;
  font-weight: 600;
}
.tw-btn-blue {
  background-color: #3490dc;
  color: #fff;
}
.tw-btn-blue:hover {
  background-color: #2779bd;
}
.tw-btn-blue {
  background-color: #e3342f;
  color: #fff;
}
.tw-btn-blue:hover {
  background-color: #cc1f1a;
}
```

Although there's rarely a good reason to make component declarations important, if you really need to do it you can always add `!important` manually:

```js
// tailwind.config.js
module.exports = {
  plugins: [
    function({ addComponents }) {
      const buttons = {
        '.btn': {
          padding: '.5rem 1rem !important',
          borderRadius: '.25rem !important',
          fontWeight: '600 !important',
        },
        // ...
      }

      addComponents(buttons)
    }
  ]
}
```

All classes in a selector will be prefixed by default, so if you add a more complex style like:

```js
// tailwind.config.js
module.exports = {
  prefix: 'tw-',
  plugins: [
    function({ addComponents }) {
      const components = {
        // ...
        '.navbar-inverse a.nav-link': {
            color: '#fff',
        }
      }

      addComponents(components)
    }
  ]
}
```

...the following CSS would be generated:

```css
.tw-navbar-inverse a.tw-nav-link {
    color: #fff;
}
```

To opt out of prefixing, pass an options object as a second parameter to `addComponents`:


```js
// tailwind.config.js
module.exports = {
  prefix: 'tw-',
  plugins: [
    function({ addComponents }) {
      const components = {
        // ...
      }

      addComponents(components, {
        respectPrefix: false
      })
    }
  ]
}
```

### Responsive and state variants

The `addComponents` function doesn't provide the ability to automatically generate variants since it doesn't typically make sense to do so for component classes.

You can always do this manually if necessary by wrapping your styles in the `@@variants` at-rule:

```js
function({ addComponents }) {
  addComponents({
    '@@variants responsive, hover': {
      '.btn': {
        padding: '.5rem 1rem !important',
        borderRadius: '.25rem !important',
        fontWeight: '600 !important',
      },
      // ...
    }
  })
}
```

## Escaping class names

If your plugin generates classes that contain user-provided strings, you can use the `e` function to escape those class names to make sure non-standard characters are handled properly automatically.

For example, this plugin generates a set of `.rotate-{angle}` utilities where `{angle}` is a user provided string. The `e` function is used to escape the concatenated class name to make sure classes like `.rotate-1/4` work as expected:


```js
// tailwind.config.js
const _ = require('lodash')

module.exports = {
  theme: {
    rotate: {
      '1/4': '90deg',
      '1/2': '180deg',
      '3/4': '270deg',
    }
  },
  plugins: [
    function({ addUtilities, config }) {
      const rotateUtilities = _.map(config('theme.angles'), (value, key) => {
        return {
          [`.${e(`rotate-${key}`)}`]: {
            transform: `rotate(${value})`
          }
        }
      })

      addUtilities(rotateUtilities)
    }
  ]
}
```

This plugin would generate the following CSS:

```css
.rotate-1\/4 {
  transform: rotate(90deg);
}
.rotate-1\/2 {
  transform: rotate(180deg);
}
.rotate-3\/4 {
  transform: rotate(270deg);
}
```

Be careful to only escape content you actually want to escape; don't pass the leading `.` in a class name or the `:` at the beginning pseudo-classes like `:hover` or `:focus` or those characters will be escaped.

Additionally, because CSS has rules about the characters a class name can *start* with (a class can't start with a number, but it can contain one), it's a good idea to escape your complete class name (not just the user-provided portion) or you may end up with unnecessary escape sequences:

```js
// Will unnecessarily escape `1`
`.rotate-${e('1/4')}`
// => '.rotate-\31 \/4'

// Won't escape `1` because it's not the first character
`.${e('rotate-1/4')}`
// => '.rotate-1\/4'
```

## Manually prefixing selectors

If you're writing something complex where you only want to prefix certain classes, you can use the `prefix` function to have fine-grained control of when the user's configured prefix is applied.

For example, if you're creating a plugin to be reused across a set of internal projects that includes existing classes in its selectors, you might only want to prefix the new classes:

```js
// tailwind.config.js
module.exports = {
  prefix: 'tw-',
  plugins: [
    function({ addComponents, prefix }) {
      addComponents({
        [`.existing-class > ${prefix('.new-class')}`]: {
          backgroundColor: '#fff',
        }
      })
    }
  ]
}
```

This would generate the following CSS:

```css
.existing-class > .tw-new-class {
  background-color: #fff;
}
```

The `prefix` function will prefix all classes in a selector and ignore non-classes, so it's totally safe to pass complex selectors like this one:

```js
prefix('.btn-blue .w-1\/4 > h1.text-xl + a .bar')
// => '.tw-btn-blue .tw-w-1\/4 > h1.tw-text-xl + a .tw-bar'
```

## Referencing the user's config

The `config` function allows you to ask for a value from the user's Tailwind configuration using dot notation, providing a default value if that path doesn't exist.

For example, this simplified version of the built-in [container](/docs/container) plugin uses the config function to get the user's configured breakpoints:

```js
// tailwind.config.js
const _ = require('lodash')

module.exports = {
  plugins: [
    function({ addComponents, config }) {
      const screens = config('theme.screens', {})

      const mediaQueries = _.map(screens, width => {
        return {
          [`@media (min-width: ${width})`]: {
            '.container': {
              'max-width': width,
            },
          },
        }
      })

      addComponents([
        { '.container': { width: '100%' } },
        ...mediaQueries,
      ])
    }
  ]
}
```

If you'd like to reference the user's `variants` configuration, it's recommended that you use the `variants()` function instead of the config function.

<p class="flex items-center mt-8 mb-0">
  <svg class="h-6 w-6 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon-close-circle"><circle cx="12" cy="12" r="10" fill="#fed7d7"/><path fill="#f56565" d="M13.41 12l2.83 2.83a1 1 0 0 1-1.41 1.41L12 13.41l-2.83 2.83a1 1 0 1 1-1.41-1.41L10.59 12 7.76 9.17a1 1 0 0 1 1.41-1.41L12 10.59l2.83-2.83a1 1 0 0 1 1.41 1.41L13.41 12z"/></svg>
  <strong class="text-s  font-semibold text-gray-600">Don't use the config function to look up variants</strong>
</p>

```js
addUtilities(newUtilities, config('variants.customPlugin'))
```

<p class="flex items-center mt-8 mb-0">
  <svg class="h-6 w-6 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon-check"><circle class="text-green-200 fill-current" cx="12" cy="12" r="10" /><path class="text-green-600 fill-current" d="M10 14.59l6.3-6.3a1 1 0 0 1 1.4 1.42l-7 7a1 1 0 0 1-1.4 0l-3-3a1 1 0 0 1 1.4-1.42l2.3 2.3z"/></svg>
  <strong class="text-s  font-semibold text-gray-600">Do use the variants function instead</strong>
</p>

```js
addUtilities(newUtilities, variants('customPlugin'))
```

Since `variants` could simply be a global list of variants to configure for every plugin in the whole project, using the `variants()` function lets you easily respect the user's configuration without reimplementing that logic yourself.

```js
// tailwind.config.js
module.exports = {
  variants: ['responsive', 'hover', 'focus'],
  plugins: [
    function ({ config, variants }) {
      config('variants.customPlugin')
      // => undefined

      variants('customPlugin')
      // => ['reponsive', 'hover', 'focus']
    }
  ]
}
```


## Exposing options

It often makes sense for a plugin to expose its own options that the user can configure to customize the plugin's behavior.

The best way to accomplish this is to claim your own key in the user's `theme` and `variants` configuration and ask them to provide any options there so you can access them with the `config()` function.

For example, here's a plugin *(extracted to its own module)* for creating simple gradient utilities that accepts the gradients and variants to generate as options:

```js
// ./plugins/gradients.js
const _ = require('lodash')

module.exports = function({ addUtilities, e, config, variants }) {
  const gradients = config('theme.gradients', {})
  const variants = variants('gradients', [])

  const utilities = _.map(gradients, ([start, end], name) => ({
    [`.bg-gradient-${e(name)}`]: {
      backgroundImage: `linear-gradient(to right, ${start}, ${end})`
    }
  }))

  addUtilities(utilities, variants)
}
```

To use it, you'd `require` it in your plugins list, specifying your configuration under the `gradients` key in both `theme` and `variants`:

```js
// tailwind.config.js
module.exports = {
  theme: {
    gradients: theme => ({
      'blue-green': [theme('colors.blue.500'), theme('colors.green.500')],
      'purple-blue': [theme('colors.purple.500'), theme('colors.blue.500')],
      // ...
    })
  },
  variants: {
    gradients: ['responsive', 'hover'],
  },
  plugins: [
    require('./plugins/gradients')
  ],
}
```

## CSS-in-JS syntax

Each of `addUtilities`, `addComponents`, and `addBase` expect CSS rules written as JavaScript objects. Tailwind uses the same sort of syntax you might recognize from CSS-in-JS libraries like [Emotion](https://emotion.sh/docs/object-styles), and is powered by [postcss-js](https://github.com/postcss/postcss-js) under the hood.

Consider this simple CSS rule:

```css
.card {
  background-color: #fff;
  border-radius: .25rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}
```

Translating this to a CSS-in-JS object would look like this:

```js
addComponents({
  '.card': {
    'background-color': '#fff',
    'border-radius': '.25rem',
    'box-shadow': '0 2px 4px rgba(0,0,0,0.2)',
  }
})
```

For convenience, property names can also be written in camelCase and will be automatically translated to dash-case:

```js
addComponents({
  '.card': {
    backgroundColor: '#fff',
    borderRadius: '.25rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
  }
})
```

Nesting is also supported (powered by [postcss-nested](https://github.com/postcss/postcss-nested)), using the same syntax you might be familiar with from Sass or Less:

```js
addComponents({
  '.card': {
    backgroundColor: '#fff',
    borderRadius: '.25rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    '&:hover': {
      boxShadow: '0 10px 15px rgba(0,0,0,0.2)',
    }
    '@media (min-width: 500px)': {
      borderRadius: '.5rem',
    }
  }
})
```

Multiple rules can be defined in the same object:

```js
addComponents({
  '.btn': {
    padding: '.5rem 1rem',
    borderRadius: '.25rem',
    fontWeight: '600',
  },
  '.btn-blue': {
    backgroundColor: '#3490dc',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#2779bd'
    },
  },
  '.btn-red': {
    backgroundColor: '#e3342f',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#cc1f1a'
    },
  },
})
```

...or as an array of objects in case you need to repeat the same key:

```js
addComponents([
  {
    '@media (min-width: 500px)': {
      // ...
    }
  },
  {
    '@media (min-width: 500px)': {
      // ...
    }
  },
  {
    '@media (min-width: 500px)': {
      // ...
    }
  },
])
```

## Adding variants

The `addVariant` function allows you to register your own custom [variants](/docs/state-variants) that can be used just like the built-in hover, focus, active, etc. variants.

To add a new variant, call the `addVariant` function, passing in the name of your custom variant, and a callback that modifies the affected CSS rules as needed.

```js
// tailwind.config.js
module.exports = {
  plugins: [
    function({ addVariant, e }) {
      addVariant('disabled', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.${e(`disabled${separator}${className}`)}:disabled`
        })
      })
    }
  ]
}
```

The callback receives an object that can be destructured into the following parts:

- `modifySelectors`, a helper function to simplify adding basic variants
- `separator`, the user's configured [separator string](/docs/configuration#separator)
- `container`, a [PostCSS Container](http://api.postcss.org/Container.html) containing all of the rules the variant is being applied to, for creating complex variants

### Basic variants

If you want to add a simple variant that only needs to change the selector, use the `modifySelectors` helper.

The `modifySelectors` helper accepts a function that receives an object that can be destructured into the following parts:

- `selector`, the complete unmodified selector for the current rule
- `className`, the class name of the current rule *with the leading dot removed*

The function you pass to `modifySelectors` should simply return the modified selector.

For example, a `first-child` variant plugin could be written like this:

```js
// tailwind.config.js
module.exports = {
  plugins: [
    function({ addVariant, e }) {
      addVariant('first-child', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.${e(`first-child${separator}${className}`)}:first-child`
        })
      })
    }
  ]
}
```

### Complex variants

If you need to do anything beyond simply modifying selectors (like changing the actual rule declarations, or wrapping the rules in another at-rule), you'll need to use the `container` instance.

Using the `container` instance, you can traverse all of the rules within a given module or `@variants` block and manipulate them however you like using the standard PostCSS API.

For example, this plugin creates an `important` version of each affected utility by prepending the class with an exclamation mark and modifying each declaration to be `important`:

```js
// tailwind.config.js
module.exports = {
  plugins: [
    function({ addVariant }) {
      addVariant('important', ({ container }) => {
        container.walkRules(rule => {
          rule.selector = `.\\!${rule.selector.slice(1)}`
          rule.walkDecls(decl => {
            decl.important = true
          })
        })
      })
    }
  ]
}
```

This plugin takes all of the rules inside the container, wraps them in a `@supports (display: grid)` at-rule, and prefixes each rule with `supports-grid`:

```js
// tailwind.config.js
const postcss = require('postcss')

module.exports = {
  plugins: [
    function({ addVariant, e }) {
      addVariant('supports-grid', ({ container, separator }) => {
        const supportsRule = postcss.atRule({ name: 'supports', params: '(display: grid)' })
        supportsRule.nodes = container.nodes
        container.nodes = [supportsRule]
        supportsRule.walkRules(rule => {
          rule.selector = `.${e(`supports-grid${separator}${rule.selector.slice(1)}``)}
        })
      })
    }
  ]
}
```

To learn more about working with PostCSS directly, check out the [PostCSS API documentation](http://api.postcss.org/Container.html).

### Using custom variants

Using custom variants is no different than using Tailwind's built-in variants.

To use custom variants with Tailwind's core plugins, add them to the `variants` section of your config file:

```js
// tailwind.config.js
modules.exports = {
  variants: {
    borderWidths: ['responsive', 'hover', 'focus', 'first-child', 'disabled'],
  }
}
```

To use custom variants with custom utilities in your own CSS, use the [variants at-rule](/docs/functions-and-directives#variants):

```css
@variants hover, first-child {
  .bg-cover-image {
    background-image: url('/path/to/image.jpg');
  }
}
```

## Example plugins

To check out a few example plugins, [visit the plugin examples repository on GitHub](https://github.com/tailwindcss/plugin-examples).
