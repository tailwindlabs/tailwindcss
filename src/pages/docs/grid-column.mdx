---
title: "Grid Column Start / End"
description: "Utilities for controlling how elements are sized and placed across grid columns."
---

import gridColumnPlugin from 'tailwindcss/lib/plugins/gridColumn'
import gridColumnStartPlugin from 'tailwindcss/lib/plugins/gridColumnStart'
import gridColumnEndPlugin from 'tailwindcss/lib/plugins/gridColumnEnd'
import { Disabling } from '@/components/Disabling'

export const classes = {
  plugin: [gridColumnPlugin, gridColumnStartPlugin, gridColumnEndPlugin]
}

## Spanning columns

Use the `col-span-{n}` utilities to make an element span _n_ columns.

```html purple
<template preview class="bg-white p-8">
  <div class="grid grid-cols-3 gap-4">
    <div class="bg-purple-300 h-12 rounded-md flex justify-center items-center text-white text-2xl font-extrabold">1</div>
    <div class="bg-purple-300 h-12 rounded-md flex justify-center items-center text-white text-2xl font-extrabold">2</div>
    <div class="bg-purple-300 h-12 rounded-md flex justify-center items-center text-white text-2xl font-extrabold">3</div>
    <div class="col-span-2 bg-purple-500 h-12 rounded-md flex justify-center items-center text-white text-2xl font-extrabold">4</div>
    <div class=" bg-purple-300 h-12 rounded-md flex justify-center items-center text-white text-2xl font-extrabold">5</div>
    <div class=" bg-purple-300 h-12 rounded-md flex justify-center items-center text-white text-2xl font-extrabold">6</div>
    <div class="col-span-2 bg-purple-500 h-12 rounded-md flex justify-center items-center text-white text-2xl font-extrabold">7</div>
  </div>
</template>

<div class="grid grid-cols-3 gap-4">
  <div class="...">1</div>
  <div class="...">2</div>
  <div class="...">3</div>
  <div class="**col-span-2** ...">4</div>
  <div class="...">5</div>
  <div class="...">6</div>
  <div class="**col-span-2** ...">7</div>
</div>
```

## Starting and ending lines

Use the `col-start-{n}` and `col-end-{n}` utilities to make an element start or end at the _nth_ grid line. These can also be combined with the `col-span-{n}` utilities to span a specific number of columns.

Note that CSS grid lines start at 1, not 0, so a full-width element in a 6-column grid would start at line 1 and end at line 7.

```html lightBlue
<template preview class="bg-white p-8">
  <div class="grid grid-cols-6 gap-4">
    <div class="bg-stripes bg-stripes-light-blue-500 bg-light-blue-300 bg-opacity-25 h-12 rounded-md flex items-center justify-center text-white text-2xl font-extrabold"></div>
    <div class="col-start-2 col-span-4 bg-light-blue-500 h-12 rounded-md flex items-center justify-center text-white text-2xl font-extrabold">1</div>
    <div class="bg-stripes bg-stripes-light-blue-500 bg-light-blue-300 bg-opacity-25 h-12 rounded-md flex items-center justify-center text-white text-2xl font-extrabold"></div>
    <div class="col-start-1 col-end-3 bg-light-blue-500 h-12 rounded-md flex items-center justify-center text-white text-2xl font-extrabold">2</div>
    <div class="bg-stripes bg-stripes-light-blue-500 bg-light-blue-300 bg-opacity-25 h-12 rounded-md flex items-center justify-center text-white text-2xl font-extrabold"></div>
    <div class="bg-stripes bg-stripes-light-blue-500 bg-light-blue-300 bg-opacity-25 h-12 rounded-md flex items-center justify-center text-white text-2xl font-extrabold"></div>
    <div class="col-end-7 col-span-2 bg-light-blue-500 h-12 rounded-md flex items-center justify-center text-white text-2xl font-extrabold">3</div>
    <div class="col-start-1 col-end-7 bg-light-blue-500 h-12 rounded-md flex items-center justify-center text-white text-2xl font-extrabold">4</div>
  </div>
</template>

<div class="grid grid-cols-6 gap-4">
  <div class="**col-start-2** col-span-4 ...">1</div>
  <div class="**col-start-1 col-end-3** ...">2</div>
  <div class="**col-end-7 col-span-2** ...">3</div>
  <div class="**col-start-1 col-end-7** ...">4</div>
</div>
```

## Responsive

To control the column placement of an element at a specific breakpoint, add a `{screen}:` prefix to any existing grid-column utility. For example, use `md:col-span-6` to apply the `col-span-6` utility at only medium screen sizes and above.

```html
  <div class="col-span-2 **md:col-span-6**"></div>
```

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

## Customizing

By default, Tailwind includes grid-column utilities for working with grids with up to 12 columns. You change, add, or remove these by customizing the `gridColumn`, `gridColumnStart`, and `gridColumnEnd` sections of your Tailwind theme config.

For creating more `col-{value}` utilities that control the `grid-column` shorthand property directly, customize the `gridColumn` section of your Tailwind theme config:

```diff-js
  // tailwind.config.js
  module.exports = {
    theme: {
      extend: {
        gridColumn: {
+         'span-16': 'span 16 / span 16',
        }
      }
    }
  }
```

We use this internally for our `col-span-{n}` utilities. Note that since this configures the `grid-column` shorthand property directly, we include the word `span` directly in the value name, it's _not_ baked into the class name automatically. That means you are free to add entries that do whatever you want here — they don't just have to be `span` utilities.

To add new `col-start-{n}` utilities, use the `gridColumnStart` section of your Tailwind theme config:

```diff-js
  // tailwind.config.js
  module.exports = {
    theme: {
      extend: {
        gridColumnStart: {
+         '13': '13',
+         '14': '14',
+         '15': '15',
+         '16': '16',
+         '17': '17',
        }
      }
    }
  }
```

To add new `col-end-{n}` utilities, use the `gridColumnEnd` section of your Tailwind theme config:

```diff-js
  // tailwind.config.js
  module.exports = {
    theme: {
      extend: {
        gridColumnEnd: {
+         '13': '13',
+         '14': '14',
+         '15': '15',
+         '16': '16',
+         '17': '17',
        }
      }
    }
  }
```

Learn more about customizing the default theme in the [theme customization documentation](/docs/theme#customizing-the-default-theme).

### Variants

By default, only responsive variants are generated for grid-column utilities.

You can control which variants are generated for the grid-column utilities by modifying the `gridColumn`, `gridColumnStart`, and `gridColumnEnd` properties in the `variants` section of your `tailwind.config.js` file.

```diff-js
  // tailwind.config.js
  module.exports = {
    variants: {
      // ...
+     gridColumn: ['responsive', 'hover'],
+     gridColumnStart: ['responsive', 'hover'],
+     gridColumnEnd: ['responsive', 'hover'],
    }
  }
```

Learn more about configuring variants in the [configuring variants documentation](/docs/configuring-variants/).

### Disabling

<Disabling plugin={['gridColumn', 'gridColumnStart', 'gridColumnEnd']} name="grid-column" />
