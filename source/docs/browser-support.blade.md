---
extends: _layouts.documentation
title: "Browser Support"
description: "Understanding how to think about browser support with a utility-first framework."
titleBorder: true
---

**As a general rule, Tailwind targets IE11 and the latest version of all modern browsers like Chrome, Firefox, Safari, and Edge.**

We do include support for a few features out of the box that are not supported by IE11 (notably [object-fit](/docs/object-fit), [object-position](/docs/object-position), and [sticky positioning](/docs/position#sticky)), and have done our best to make it clear that those features require modern browsers in the documentation.

That said, because Tailwind is such a low-level framework you can still easily use it to build sites that need to support older browsers.

## Using Tailwind with older browsers

In popular component-based frameworks like Bootstrap or Bulma, it's important to know what browsers are supported because the implementation details for each component are abstracted away from you.

For example, when you are building a grid with classes like `.row` or `.col-4`, you need to know which browsers the framework author is targeting because you have no idea if those classes are implemented using floats, Flexbox, or CSS Grid.

Tailwind on the other hand is a low-level utility framework, where most of the classes map directly to individual CSS properties. This means that which browsers you support is really up to you, not the framework.

For example, here is a three column grid built with Tailwind's Flexbox utilities, so it will only work in IE10+ since Flexbox isn't supported in IE9:

```html
<div class="flex">
  <div class="w-1/3"><!-- ... --></div>
  <div class="w-1/3"><!-- ... --></div>
  <div class="w-1/3"><!-- ... --></div>
</div>
```

If you needed to support IE9, you could build your grids with floats instead, since they are supported in virtually all browsers:

```html
<div class="clearfix">
  <div class="float-left w-1/3"><!-- ... --></div>
  <div class="float-left w-1/3"><!-- ... --></div>
  <div class="float-left w-1/3"><!-- ... --></div>
</div>
```

Because Tailwind doesn't impose any opinions about *how* you build the components in your UI, you can implement them however you like according to your own browser support policy.

For the latest information about which CSS features are supported by which browsers, search the excellent [Can I Use](https://caniuse.com/) database.

## Vendor Prefixes

Tailwind doesn't automatically add vendor prefixes to any of its styles. Instead, we recommend that you use [Autoprefixer](https://github.com/postcss/autoprefixer).

To use it, install it via npm:

```bash
# Using npm
npm install autoprefixer

# Using Yarn
yarn add autoprefixer
```

Then add it to the very end of your plugin list in your PostCSS configuration:

```js
module.exports = {
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
  ]
}
```
