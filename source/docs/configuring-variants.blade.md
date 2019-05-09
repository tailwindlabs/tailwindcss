---
extends: _layouts.documentation
title: "Configuring Variants"
description: "Configuring which utility variants are enabled in your project."
titleBorder: true
---

@include('_partials.work-in-progress')

To Document:

- Demo why you might want a different variant order for different utilities
- Using the `default` variant to control default variant placement
- Link to creating your own variants using plugins
- Complete table of default enabled variants

---

The `variants` section is where you control which [pseudo-class variants](/docs/pseudo-class-variants) are generated for each core utility plugin.

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

Each property is a core plugin name pointing to an array of variants to generate for that plugin.

It's important to note that (`responsive` excluded) **variants are generated in the order you specify them**, so variants at the end of the list will take precedence over variants at the beginning of the list.

Learn more about pseudo-class variants in the ["Pseudo-Classes Variants" documentation](/docs/pseudo-class-variants).
