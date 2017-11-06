---
extends: _layouts.documentation
title: "Configuration"
---

# Configuration

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

```js
{!! file_get_contents(dirname(dirname(__DIR__)).'/defaultConfig.js') !!}
```
