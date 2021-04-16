---
title: Configuring Variants
shortTitle: Variants
description: Configuring which utility variants are enabled in your project.
---

import { Heading } from '@/components/Heading'
import { DefaultVariantsConfig } from '@/components/DefaultVariantsConfig'
import { TipGood, TipBad } from '@/components/Tip'

## <Heading hidden>Overview</Heading>

The `variants` section of your `tailwind.config.js` file is where you control which variants should be enabled for each core plugin:

```js
// tailwind.config.js
module.exports = {
  variants: {
    extend: {
      backgroundColor: ['active'],
      // ...
      borderColor: ['focus-visible', 'first'],
      // ...
      textColor: ['visited'],
    }
  },
}
```

Each property is a core plugin name pointing to an array of variants to generate for that plugin.

The following variants are supported out of the box:

| Variant | Description |
| --- | --- |
| `responsive` | Responsive variants like `sm`, `md`, `lg`, and `xl`. |
| `dark` | Targets dark mode. |
| `motion-safe` | Targets the `prefers-reduced-motion: no-preference` media query. |
| `motion-reduce` | Targets the `prefers-reduced-motion: reduce` media query. |
| `first` | Targets the `first-child` pseudo-class. |
| `last` | Targets the `last-child` pseudo-class.  |
| `odd` | Targets the `odd-child` pseudo-class.  |
| `even` | Targets the `even-child` pseudo-class.  |
| `visited` | Targets the `visited` pseudo-class.  |
| `checked` | Targets the `checked` pseudo-class.  |
| `group-hover` | Targets an element when a marked parent matches the `hover` pseudo-class. |
| `group-focus` | Targets an element when a marked parent matches the `focus` pseudo-class. |
| `focus-within` | Targets the `focus-within` pseudo-class. |
| `hover` | Targets the `hover` pseudo-class. |
| `focus` | Targets the `focus` pseudo-class. |
| `focus-visible` | Targets the `focus-visible` pseudo-class. |
| `active` | Targets the `active` pseudo-class. |
| `disabled` | Targets the `disabled` pseudo-class. |

For more information about how variants work, read our documentation on [responsive variants](/docs/responsive-design), [dark mode variants](/docs/dark-mode), and [hover, focus and other state variants](/docs/hover-focus-and-other-states).

---


## Enabling extra variants

If you'd like to enable extra variants for a plugin in addition to the defaults, you can configure your variants using the `extend` keyword, similar to how you can use extend inside of the `theme` section:

```js
// tailwind.config.js
module.exports = {
  variants: {
    // The 'active' variant will be generated in addition to the defaults
    extend: {
      backgroundColor: ['active']
    }
  },
}
```

Because [the order of variants is important](/docs/configuring-variants#ordering-variants), any variants added under the `extend` key are automatically ordered for you using a sensible default variant order. You can customize this order using the [variantOrder](/docs/configuration#variant-order) option if necessary.

---

## Overriding default variants

Any variants configured directly under the `variants` key will **override** the default variants for that plugin.

```js
// tailwind.config.js
module.exports = {
  variants: {
    // Only 'active' variants will be generated
    backgroundColor: ['active'],
  },
}
```

When overriding the default variants, make sure you always specify _all_ the variants you'd like to enable, not just the new ones you'd like to add.

### Ordering variants

It's important to note that when overriding variants, **variants are generated in the order you specify them**, so variants at the end of the list will take precedence over variants at the beginning of the list.

For example, here `focus` variants have the highest precedence for `backgroundColor` utilities, but `hover` variants have the highest precedence for `borderColor` utilities:

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

Generating variants in order this way gives you the most flexibility as an end-user, but it's also a sharp tool and can have unintended consequences if you aren't careful. We recommend [enabling extra variants](#enabling-extra-variants) instead of overriding the defaults whenever possible, and using this feature only as an escape hatch.

---

## Special variants

### Responsive

The `responsive` variant is a special case in Tailwind and is _not_ impacted by the order you list in your variants configuration.

This is because the `responsive` variant automatically _stacks_ with other variants, meaning that if you specify both `responsive` and `hover` variants for a utility, Tailwind will generate _responsive hover_ variants as well:

```js
// tailwind.config.js
module.exports = {
  variants: {
    backgroundColor: ['responsive', 'hover'],
    borderColor: ['responsive', 'focus'],
  },
}
```

Responsive variants are grouped together and inserted at the end of your stylesheet by default to avoid specificity issues, regardless of where `responsive` appears in your `variants` list.

If you'd like to customize this behavior for whatever reason, you can use the [@tailwind screens](/docs/functions-and-directives#tailwind) directive to specify where responsive variants should be inserted.

### Dark, motion-safe, and motion-reduce

The `dark`, `motion-safe`, and `motion-reduce` variants also stack with other variants, but unlike `responsive`, they stack in the same "slot", so you can combine them with both `responsive` and simple state variants, but not with each other.

The order of these variants matter relative to each other, but not relative to other variants. There is just about no situation imaginable where these would conflict with each other in practice, so this ends up being a non-issue anyways.

You can include these variants in any order in your `variants` configuration and never notice the difference.

### Default

You can use the special `DEFAULT` variant to control where the normal, non-prefixed version of a utility is generated relative to the other variants.

This is an advanced feature and only really useful if you have a custom variant (like `children` in the example below) that should have a lower precedence than the normal version of a utility.

```js
// tailwind.config.js
module.exports = {
  variants: {
    backgroundColor: ['children', 'DEFAULT', 'hover', 'focus'],
  },
}
```

```css
/* Generated CSS */

.children\:bg-black > * { background-color: #000; }
.children\:bg-white > * { background-color: #fff; }

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

## Using custom variants

If you've written or installed a [plugin](/docs/plugins) that adds a new variant, you can enable that variant by including it in your variants configuration just like if it were a built-in variant.

For example, the [tailwindcss-interaction-variants plugin](https://github.com/benface/tailwindcss-interaction-variants) adds a `group-disabled` variant (among others):

```js
// tailwind.config.js
{
  variants: {
    backgroundColor: ['responsive', 'hover', 'focus', 'group-disabled'],
  },
  plugins: [
    require('tailwindcss-interaction-variants'),
  ],
}
```

Learn more about creating custom variants in the [variant plugin documentation](/docs/plugins#adding-variants).

### Ordering custom variants

If you'd like to specify a default sort position for a custom variant, override your `variantOrder` to include the custom variant:

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
    'group-disabled', // Custom variant
    'disabled',
  ],
  variants: {
    extend: {
      backgroundColor: ['group-disabled'],
    }
  }
}
```

You'll need to specify the entire list when overriding the `variantOrder` to include any custom variants.

---

## Default variants reference

Here is a complete reference of Tailwind's default variants configuration, which can be useful when you'd like to add a new variant while preserving the defaults.

<DefaultVariantsConfig />
