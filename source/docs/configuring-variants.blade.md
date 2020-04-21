---
extends: _layouts.documentation
title: "Configuring Variants"
description: "Configuring which utility variants are enabled in your project."
titleBorder: true
---

<h2 style="font-size: 0" class="invisible m-0 -mb-6">Overview</h2>

The `variants` section of your `tailwind.config.js` file is where you control which core utility plugins should have [responsive variants](/docs/responsive-design) and [pseudo-class variants](/docs/pseudo-class-variants) generated.

```js
// tailwind.config.js
module.exports = {
  variants: {
    appearance: ['responsive'],
    // ...
    borderColor: ['responsive', 'hover', 'focus'],
    // ...
    outline: ['responsive', 'focus'],
    // ...
    zIndex: ['responsive'],
  },
}
```

Each property is a core plugin name pointing to an array of variants to generate for that plugin. The following variants are supported out of the box:
- `'responsive'`
- `'group-hover'`
- `'focus-within'`
- `'first'`
- `'last'`
- `'odd'`
- `'even'`
- `'hover'`
- `'focus'`
- `'active'`
- `'visited'`
- `'disabled'`

It's important to note that **your array of variants is not merged with the defaults**, so if you'd like to enable another variant for a utility, you need to repeat the default variants for that utility as well.

@component('_partials.tip-bad')
Don't list only the extra variants you want to enable
@endcomponent

```js
// tailwind.config.js
module.exports = {
  variants: {
    backgroundColor: ['active'],
  },
}
```

@component('_partials.tip-good')
Always provide the complete list of variants you want to enable
@endcomponent

```js
// tailwind.config.js
module.exports = {
  variants: {
    backgroundColor: ['responsive', 'hover', 'focus', 'active'],
  },
}
```

---

## Ordering variants

It's important to note that **variants are generated in the order you specify them**, so variants at the end of the list will take precedence over variants at the beginning of the list.

In this example, `focus` variants have the highest precedence for `backgroundColor` utilities, but `hover` variants have the highest precedence for `borderColor` utilities:

```js
// tailwind.config.js
module.exports = {
  variants: {
    backgroundColor: ['hover', 'focus'],
    borderColor: ['focus', 'hover'],
  },
}
```

```css
/* Generated CSS */

.bg-black { background-color: #000 }
.bg-white { background-color: #fff }
/* ... */

.hover\:bg-black:hover { background-color: #000 }
.hover\:bg-white:hover { background-color: #fff }
/* ... */

.focus\:bg-black:focus { background-color: #000 }
.focus\:bg-white:focus { background-color: #fff }
/* ... */

.border-black { border-color: #000 }
.border-white { border-color: #fff }
/* ... */

.focus\:border-black:focus { border-color: #000 }
.focus\:border-white:focus { border-color: #fff }
/* ... */

.hover\:border-black:hover { border-color: #000 }
.hover\:border-white:hover { border-color: #fff }
/* ... */
```

This means that given the following HTML:

```html
<input class="focus:bg-white hover:bg-black focus:border-white hover:border-black">
```

...if the input was hovered _and_ focused at the same time, the background would be white but the border would be black.

Generally, we recommend the following order for the built-in variants, although you are free to use whatever order makes the most sense for your own project:

```js
['responsive', 'group-hover', 'group-focus', 'focus-within', 'first', 'last', 'odd', 'even', 'hover', 'focus', 'active', 'visited', 'disabled']
```

### The responsive variant

The `responsive` variant is the only variant that is _not_ impacted by the order you list in your variants configuration.

This is because the `responsive` variant automatically _stacks_ with pseudo-class variants, meaning that if you specify both `responsive` and `hover` variants for a utility, Tailwind will generate _responsive hover_ variants as well:

```js
// tailwind.config.js
module.exports = {
  variants: {
    backgroundColor: ['responsive', 'hover'],
    borderColor: ['responsive', 'focus'],
  },
}
```

```css
/* Generated CSS */

.bg-black { background-color: #000 }
/* ... */
.hover\:bg-black:hover { background-color: #000 }
/* ... */

.border-black { border-color: #000 }
/* ... */
.focus\:border-black:focus { border-color: #000 }
/* ... */


@media (min-width: 640px) {
  .sm\:bg-black { background-color: #000 }
  /* ... */
  .sm\:hover\:bg-black:hover { background-color: #000 }
  /* ... */

  .sm\:border-black { border-color: #000 }
  /* ... */
  .sm\:focus\:border-black:focus { border-color: #000 }
  /* ... */
}

@media (min-width: 768px) {
  .md\:bg-black { background-color: #000 }
  /* ... */
  .md\:hover\:bg-black:hover { background-color: #000 }
  /* ... */

  .md\:border-black { border-color: #000 }
  /* ... */
  .md\:focus\:border-black:focus { border-color: #000 }
  /* ... */
}

@media (min-width: 1024px) {
  .lg\:bg-black { background-color: #000 }
  /* ... */
  .lg\:hover\:bg-black:hover { background-color: #000 }
  /* ... */

  .lg\:border-black { border-color: #000 }
  /* ... */
  .lg\:focus\:border-black:focus { border-color: #000 }
  /* ... */
}

@media (min-width: 1280px) {
  .xl\:bg-black { background-color: #000 }
  /* ... */
  .xl\:hover\:bg-black:hover { background-color: #000 }
  /* ... */

  .xl\:border-black { border-color: #000 }
  /* ... */
  .xl\:focus\:border-black:focus { border-color: #000 }
  /* ... */
}
```

**Responsive variants are grouped together and inserted at the end of your stylesheet** by default to avoid specificity issues. If you'd like to customize this behavior for whatever reason, you can use the [@@tailwind screens](/docs/functions-and-directives#tailwind) directive to specify where responsive variants should be inserted.

### The default variant

You can use the special `default` variant to control where the normal, non-prefixed versions of a utility are generated relative to the other variants.

```js
// tailwind.config.js
module.exports = {
  variants: {
    backgroundColor: ['hover', 'default', 'focus'],
  },
}
```

```css
/* Generated CSS */

.hover\:bg-black:hover { background-color: #000 }
.hover\:bg-white:hover { background-color: #fff }
/* ... */

.bg-black { background-color: #000 }
.bg-white { background-color: #fff }
/* ... */

.focus\:bg-black:focus { background-color: #000 }
.focus\:bg-white:focus { background-color: #fff }
/* ... */
```

This is an advanced feature and only really useful if you have a custom variant (like `children` in the example below) that should have a lower precedence than the normal version of a utility.

```js
// tailwind.config.js
module.exports = {
  variants: {
    backgroundColor: ['children', 'default', 'hover', 'focus'],
  },
}
```

```css
/* Generated CSS */

.children\:bg-black > * { background-color: #000; }
.children\:bg-black > * { background-color: #000; }

.bg-black { background-color: #000 }
.bg-white { background-color: #fff }
/* ... */

.hover\:bg-black:hover { background-color: #000 }
.hover\:bg-white:hover { background-color: #fff }
/* ... */

.focus\:bg-black:focus { background-color: #000 }
.focus\:bg-white:focus { background-color: #fff }
/* ... */
```

Learn more about creating custom variants in the [variant plugin documentation](/docs/plugins#adding-variants).

---

## Enabling all variants

To specify a global set of variants that should be applied to all utilities, you can assign an array of variants directly to the `variants` property:

```js
// tailwind.config.js
module.exports  = {
  variants: ['responsive', 'group-hover', 'focus-within', 'first', 'last', 'odd', 'even', 'hover', 'focus', 'active', 'visited', 'disabled']
}
```

Note that enabling all variants for all plugins will result in much bigger file sizes. Before you do this, be sure to read our guide on [controlling file size](/docs/controlling-file-size/).

---

## Using custom variants

If you've written or installed a [plugin](/docs/plugins) that adds a new variant, you can enable that variant by including it in your variants configuration just like if it were a built-in variant.

For example, the [tailwindcss-interaction-variants plugin](https://github.com/benface/tailwindcss-interaction-variants) adds a `visited` variant (among others):

```js
// tailwind.config.js
{
  variants: {
    backgroundColor: ['responsive', 'hover', 'focus', 'visited'],
  },
  plugins: [
    require('tailwindcss-interaction-variants')(),
  ],
}
```

Learn more about creating custom variants in the [variant plugin documentation](/docs/plugins#adding-variants).

---

## Default variants reference

Here is a complete reference of Tailwind's default variants configuration, which can be useful when you'd like to add a new variant while preserving the defaults.

```js
// Default configuration
module.exports = {
  // ...
  variants: {
    accessibility: ['responsive', 'focus'],
    alignContent: ['responsive'],
    alignItems: ['responsive'],
    alignSelf: ['responsive'],
    appearance: ['responsive'],
    backgroundAttachment: ['responsive'],
    backgroundColor: ['responsive', 'hover', 'focus'],
    backgroundPosition: ['responsive'],
    backgroundRepeat: ['responsive'],
    backgroundSize: ['responsive'],
    borderCollapse: ['responsive'],
    borderColor: ['responsive', 'hover', 'focus'],
    borderRadius: ['responsive'],
    borderStyle: ['responsive'],
    borderWidth: ['responsive'],
    boxShadow: ['responsive', 'hover', 'focus'],
    boxSizing: ['responsive'],
    clear: ['responsive'],
    cursor: ['responsive'],
    display: ['responsive'],
    fill: ['responsive'],
    flex: ['responsive'],
    flexDirection: ['responsive'],
    flexGrow: ['responsive'],
    flexShrink: ['responsive'],
    flexWrap: ['responsive'],
    float: ['responsive'],
    fontFamily: ['responsive'],
    fontSize: ['responsive'],
    fontSmoothing: ['responsive'],
    fontStyle: ['responsive'],
    fontWeight: ['responsive', 'hover', 'focus'],
    gap: ['responsive'],
    gridAutoFlow: ['responsive'],
    gridColumn: ['responsive'],
    gridColumnEnd: ['responsive'],
    gridColumnStart: ['responsive'],
    gridRow: ['responsive'],
    gridRowEnd: ['responsive'],
    gridRowStart: ['responsive'],
    gridTemplateColumns: ['responsive'],
    gridTemplateRows: ['responsive'],
    height: ['responsive'],
    inset: ['responsive'],
    justifyContent: ['responsive'],
    letterSpacing: ['responsive'],
    lineHeight: ['responsive'],
    listStylePosition: ['responsive'],
    listStyleType: ['responsive'],
    margin: ['responsive'],
    maxHeight: ['responsive'],
    maxWidth: ['responsive'],
    minHeight: ['responsive'],
    minWidth: ['responsive'],
    objectFit: ['responsive'],
    objectPosition: ['responsive'],
    opacity: ['responsive', 'hover', 'focus'],
    order: ['responsive'],
    outline: ['responsive', 'focus'],
    overflow: ['responsive'],
    padding: ['responsive'],
    placeholderColor: ['responsive', 'focus'],
    pointerEvents: ['responsive'],
    position: ['responsive'],
    resize: ['responsive'],
    rotate: ['responsive', 'hover', 'focus'],
    scale: ['responsive', 'hover', 'focus'],
    skew: ['responsive', 'hover', 'focus'],
    stroke: ['responsive'],
    strokeWidth: ['responsive'],
    tableLayout: ['responsive'],
    textAlign: ['responsive'],
    textColor: ['responsive', 'hover', 'focus'],
    textDecoration: ['responsive', 'hover', 'focus'],
    textTransform: ['responsive'],
    transform: ['responsive'],
    transformOrigin: ['responsive'],
    transitionDuration: ['responsive'],
    transitionProperty: ['responsive'],
    transitionTimingFunction: ['responsive'],
    translate: ['responsive', 'hover', 'focus'],
    userSelect: ['responsive'],
    verticalAlign: ['responsive'],
    visibility: ['responsive'],
    whitespace: ['responsive'],
    width: ['responsive'],
    wordBreak: ['responsive'],
    zIndex: ['responsive'],
  }
}
```
