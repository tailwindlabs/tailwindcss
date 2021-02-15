---
title: "Divide Color"
description: "Utilities for controlling the border color between elements."
---

import plugin from 'tailwindcss/lib/plugins/divideColor'
import { Variants } from '@/components/Variants'
import { Disabling } from '@/components/Disabling'
import { Heading } from '@/components/Heading'

export const classes = {
  plugin,
  transformSelector: (selector) => (
    <>
      {selector.split('>').shift().trim().replace(/^\./, '').replace(/\\/g, '')} <span className="ml-1 text-purple-300">> * + *</span>
    </>
  ),
  preview: (css, { className }) => (
    <td className={`relative w-20 p-2 ${className}`}>
      <div className="absolute inset-0 flex flex-col m-2">
        <div className="flex-1" />
        <div
          className="flex-1 border-t"
          style={{
            borderColor: Array.isArray(css['border-color'])
              ? css['border-color'][0].replace('var(--tw-divide-opacity)', '1')
              : css['border-color'].replace('var(--tw-divide-opacity)', '1'),
          }}
        />
      </div>
    </td>
  ),
}

## Usage

Control the border color between elements using the `divide-{color}` utilities.

```html fuchsia
<template preview>
  <div class="divide-y divide-fuchsia-300">
    <div class="text-center font-extrabold text-2xl text-fuchsia-600 py-3">1</div>
    <div class="text-center font-extrabold text-2xl text-fuchsia-600 py-3">2</div>
    <div class="text-center font-extrabold text-2xl text-fuchsia-600 py-3">3</div>
  </div>
</template>

<div class="**divide-y divide-fuchsia-300**">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</div>
```

### Changing opacity

Control the opacity of borders between elements using the `divide-opacity-{amount}` utilities.

```html lightBlue
<template preview>
  <div class="divide-y-4 divide-black divide-opacity-25">
    <div class="text-center font-extrabold text-2xl text-light-blue-600 py-3">1</div>
    <div class="text-center font-extrabold text-2xl text-light-blue-600 py-3">2</div>
    <div class="text-center font-extrabold text-2xl text-light-blue-600 py-3">3</div>
  </div>
</template>

<div class="divide-y-4 **divide-black divide-opacity-25**">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</div>
```

Learn more in the [divide opacity documentation](/docs/divide-opacity).

---

## Responsive

To control the borders between elements at a specific breakpoint, add a `{screen}:` prefix to any existing divide utility. For example, adding the class `md:divide-x-8` to an element would apply the `divide-x-8` utility at medium screen sizes and above.

```html
<div class="divide-y divide-teal-400 **md:divide-pink-400**">
  <div class="py-2">1</div>
  <div class="py-2">2</div>
  <div class="py-2">3</div>
</div>
```

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

---

## Customizing

### Border Colors

By default, Tailwind makes the entire [default color palette](/docs/customizing-colors#default-color-palette) available as divide colors.

You can [customize your color palette](/docs/colors#customizing) by editing the `theme.colors` section of your `tailwind.config.js` file, customize just your border and divide colors together using the `theme.borderColor` section, or customize only the divide colors using the `theme.divideColor` section.

```diff-js
  // tailwind.config.js
  module.exports = {
    theme: {
      divideColor: theme => ({
-       ...theme('borderColors'),
+       'primary': '#3490dc',
+       'secondary': '#ffed4a',
+       'danger': '#e3342f',
      })
    }
  }
```

### Variants

<Variants plugin="divideColor" />

### Disabling

<Disabling plugin="divideColor" />
