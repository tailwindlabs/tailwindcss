---
title: Extracting Components
description: Dealing with duplication and keeping utility-first projects maintainable.
---

import { TipGood, TipBad } from '@/components/Tip'

Tailwind encourages a [utility-first](/docs/utility-first) workflow, where designs are initially implemented using only utility classes to avoid premature abstraction.

```html indigo
<template preview class="px-6 py-8">
  <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
    <div class="md:flex">
      <div class="md:flex-shrink-0">
        <img class="h-48 w-full object-cover md:w-48" src="https://images.unsplash.com/photo-1515711660811-48832a4c6f69?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=448&q=80" width="448" height="299" alt="Man looking at item at a store">
      </div>
      <div class="p-8">
        <div class="uppercase tracking-wide text-sm text-indigo-500 font-semibold">Case study</div>
        <a href="#" class="block mt-1 text-lg leading-tight font-medium text-black hover:underline">Finding customers for your new business</a>
        <p class="mt-2 text-gray-500">Getting a new business off the ground is a lot of hard work. Here are five ideas you can use to find your first customers.</p>
      </div>
    </div>
  </div>
</template>

<div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
  <div class="md:flex">
    <div class="md:flex-shrink-0">
      <img class="h-48 w-full object-cover md:w-48" src="/img/store.jpg" alt="Man looking at item at a store">
    </div>
    <div class="p-8">
      <div class="uppercase tracking-wide text-sm text-indigo-500 font-semibold">Case study</div>
      <a href="#" class="block mt-1 text-lg leading-tight font-medium text-black hover:underline">Finding customers for your new business</a>
      <p class="mt-2 text-gray-500">Getting a new business off the ground is a lot of hard work. Here are five ideas you can use to find your first customers.</p>
    </div>
  </div>
</div>
```

But as a project grows, you'll inevitably find yourself repeating common utility combinations to recreate the same component in many different places. This is most apparent with small components, like buttons, form elements, badges, etc.

```html emerald
<template preview>
  <div class="text-center">
    <button type="button" class="py-2 px-4 bg-emerald-500 text-white font-semibold rounded-lg shadow-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-opacity-75">
      Click me
    </button>
  </div>
</template>

<!-- Repeating these classes for every button can be painful -->
<button class="py-2 px-4 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75">
  Click me
</button>
```

Keeping a long list of utility classes in sync across many component instances can quickly become a real maintenance burden, so when you start running into painful duplication like this, it's a good idea to extract a component.

---

## Extracting template components

It's very rare that all of the information needed to define a UI component can live entirely in CSS — there's almost always some important corresponding HTML structure you need to use as well.

<TipBad>Don't rely on CSS classes to extract complex components</TipBad>

```html
<template preview class="p-8">
  <div class="w-64 mx-auto">
    <img class="rounded" src="https://images.unsplash.com/photo-1452784444945-3f422708fe5e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=512&q=80" width="512" height="341" alt="Beach">
    <div class="mt-2">
      <div>
        <div class="text-xs text-gray-600 uppercase font-bold">Private Villa</div>
        <div class="font-bold text-gray-700 leading-snug">
          <a href="#" class="hover:underline">Relaxing All-Inclusive Resort in Cancun</a>
        </div>
        <div class="mt-2 text-sm text-gray-600">$299 USD per night</div>
      </div>
    </div>
  </div>
</template>

<style>
  .vacation-card { /* ... */ }
  .vacation-card-info { /* ... */ }
  .vacation-card-eyebrow { /* ... */ }
  .vacation-card-title { /* ... */ }
  .vacation-card-price { /* ... */ }
</style>

<!-- Even with custom CSS, you still need to duplicate this HTML structure -->
<div class="vacation-card">
  <img class="vacation-card-image" src="..." alt="Beach in Cancun">
  <div class="vacation-card-info">
    <div>
      <div class="vacation-card-eyebrow">Private Villa</div>
      <div class="vacation-card-title">
        <a href="/vacations/cancun">Relaxing All-Inclusive Resort in Cancun</a>
      </div>
      <div class="vacation-card-price">$299 USD per night</div>
    </div>
  </div>
</div>
```

For this reason, it's often better to extract reusable pieces of your UI into _template partials_ or _JavaScript components_ instead of writing custom CSS classes.

By creating a single source of truth for a template, you can keep using utility classes without any of the maintenance burden created by duplicating the same classes in multiple places.

<TipGood>Create a template partial or JavaScript component</TipGood>

```html
<!-- In use -->
<VacationCard
  img="/img/cancun.jpg"
  imgAlt="Beach in Cancun"
  eyebrow="Private Villa"
  title="Relaxing All-Inclusive Resort in Cancun"
  pricing="$299 USD per night"
  url="/vacations/cancun"
/>

<!-- ./components/VacationCard.vue -->
<template>
  <div>
    <img class="rounded" :src="img" :alt="imgAlt">
    <div class="mt-2">
      <div>
        <div class="text-xs text-gray-600 uppercase font-bold">{{ eyebrow }}</div>
        <div class="font-bold text-gray-700 leading-snug">
          <a :href="url" class="hover:underline">{{ title }}</a>
        </div>
        <div class="mt-2 text-sm text-gray-600">{{ pricing }}</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['img', 'imgAlt', 'eyebrow', 'title', 'pricing', 'url']
  }
</script>
```

The above example uses [Vue](https://vuejs.org/v2/guide/components.html), but the same approach can be used with [React components](https://reactjs.org/docs/components-and-props.html), [ERB partials](https://guides.rubyonrails.org/v5.2/layouts_and_rendering.html#using-partials), [Blade components](https://laravel.com/docs/5.8/blade#components-and-slots), [Twig includes](https://twig.symfony.com/doc/2.x/templates.html#including-other-templates), etc.

---

## Extracting component classes with @apply

For small components like buttons and form elements, creating a template partial or JavaScript component can often feel too heavy compared to a simple CSS class.

In these situations, you can use Tailwind's `@apply` directive to easily extract common utility patterns to CSS component classes.

Here's what a `btn-indigo` class might look like using `@apply` to compose it from existing utilities:


```html indigo
<template preview>
  <div class="text-center">
    <button type="button" class="py-2 px-4 bg-indigo-500 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75">
      Click me
    </button>
  </div>
</template>

<button class="**btn-indigo**">
  Click me
</button>

<style>
  **.btn-indigo** {
    @apply py-2 px-4 bg-indigo-500 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75;
  }
</style>
```

To avoid unintended specificity issues, we recommend wrapping your custom component styles with the `@layer components { ... }` directive to tell Tailwind what layer those styles belong to:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .btn-blue {
    @apply py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75;
  }
}
```

Tailwind will automatically move those styles to the same place as `@tailwind components`, so you don't have to worry about getting the order right in your source files.

Using the `@layer` directive will also instruct Tailwind to consider those styles for purging when purging the `components` layer. Read our [documentation on optimizing for production](/docs/optimizing-for-production) for more details.

### Writing a component plugin

In addition to writing component classes directly in your CSS files, you can also add component classes to Tailwind by writing your own plugin:

```js
// tailwind.config.js
const plugin = require('tailwindcss/plugin')

module.exports = {
  plugins: [
    plugin(function({ addComponents, theme }) {
      const buttons = {
        '.btn': {
          padding: `${theme('spacing.2')} ${theme('spacing.4')}`,
          borderRadius: theme('borderRadius.md'),
          fontWeight: theme('fontWeight.600'),
        },
        '.btn-indigo': {
          backgroundColor: theme('colors.indigo.500'),
          color: theme('colors.white'),
          '&:hover': {
            backgroundColor: theme('colors.indigo.600')
          },
        },
      }

      addComponents(buttons)
    })
  ]
}
```

This can be a good choice if you want to publish your Tailwind components as a library or make it easier to share components across multiple projects.

Learn more in the [component plugin documentation](/docs/plugins#adding-components).
