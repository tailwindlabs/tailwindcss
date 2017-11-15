---
extends: _layouts.documentation
title: "Configuration"
description: null
---

Tailwind's defining feature is its ability to be customized. We understand that no two projects are the same, so why should the CSS framework you use be? Tailwind provides developers with a helpful set of front-end conventions, while still leaving room for adjustments where appropriate. This is all done using the Tailwind config file.

## Introducing the Tailwind config

The Tailwind config file is where you customize Tailwind specifically for your project. It will include your color palette, fonts, text weights, spacing and sizing definitions, borders, shadows, and much more. Think of the Tailwind config as a living definition of your design system.

Tailwind is actually built on PostCSS and therefore is configured entirely in JavaScript. This can feel a little strange at first, especially if you're more familiar with setting variables in a preprocessor like Sass or Less. In practice though, defining your CSS configuration in a real programming language like JavaScript has a lot of benefits. You can create variables to share parts of your configuration. You have the full power of JavaScript to dynamically create or manipulate values. Eventually you may even be able to automatically generate custom documentation for your project from this config file.

## Creating your Tailwind config file

We recommend creating a `tailwind.js` file in your project's root, but really it can go wherever you want. We've provided a CLI utility to do this easily:

<div class="bg-smoke-lighter font-mono text-sm p-4">
  <div class="text-purple-dark">./node_modules/.bin/tailwind <span class="text-blue-dark">init</span> <span class="text-smoke-darker">[filename]</span></div>
</div>

Alternatively, you can simply copy the default config below.

Please see the [installation](/docs/installation#4-process-your-css-with-tailwind) page for more information on how to setup Tailwind in your build process.

## The default Tailwind config file

As you can see below, the default config file is heavily documented. Read through it to get a better understanding of how each section can be customized for your project.

<pre class="h-128 overflow-y-scroll language-javascript"><code>{!! str_replace('// var defaultConfig', 'var defaultConfig', file_get_contents(dirname(dirname(__DIR__)).'/defaultConfig.stub.js')) !!}</code></pre>

## Options

In addition to defining your project's design system, the configuration file can also be used for setting a variety of global options.

These options are available under the top-level `options` key, located at the bottom of the configuration file by default.

### Prefix

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

### Important

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
