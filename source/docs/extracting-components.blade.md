---
extends: _layouts.documentation
title: "Extracting Components"
description: null
titleBorder: true
---

Tailwind encourages a [utility-first](/docs/utility-first) workflow, where designs are initially implemented using only utility classes to avoid premature abstraction.

@component('_partials.code-sample', ['class' => 'p-8'])
<!-- A marketing page card built entirely with utility classes -->
<div class="md:flex">
  <div class="md:flex-shrink-0">
    <img class="rounded-lg md:w-56" src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2550&q=80" alt="Woman paying for a purchase">
  </div>
  <div class="mt-4 md:mt-0 md:ml-6">
    <div class="uppercase tracking-wide text-sm text-indigo-600 font-bold">Marketing</div>
    <a href="#" class="block mt-1 text-lg leading-tight font-semibold text-gray-900 hover:underline">Finding customers for your new business</a>
    <p class="mt-2 text-gray-600">Getting a new business off the ground is a lot of hard work. Here are five ideas you can use to find your first customers.</p>
  </div>
</div>
@endcomponent

But as a project grows, you'll inevitably find yourself repeating common utility combinations to recreate the same component in many different places. This is most apparent with small components, like buttons, form elements, badges, etc.

@component('_partials.code-sample', ['class' => 'text-center'])
<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
  Button
</button>

@slot('code')
<!-- Repeating these classes for every button can be painful -->
<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
  Button
</button>
@endslot
@endcomponent

Keeping a long list of utility classes in sync across many component instances can quickly become a real maintenance burden, so when you start running into painful duplication like this, it's a good idea to extract a component.

---

## Extracting HTML components

It's very rare that all of the information needed to define a UI component can live entirely in CSS — there's almost always some important corresponding HTML structure you need to use as well.

@component('_partials.tip-bad')
Don't rely on CSS alone to extract complex components
@endcomponent

@component('_partials.code-sample')
<div class="w-64 mx-auto">
  <img class="rounded" src="https://images.unsplash.com/photo-1452784444945-3f422708fe5e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2552&q=80" alt="Beach">
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

@slot('code')
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
@endslot
@endcomponent

For this reason, it's often better to extract reusable pieces of your UI into _template partials_ or _JavaScript components_ instead of writing custom CSS classes.

By creating a single source of truth for a template, you can keep using utility classes without any of the maintenance burden created by duplicating the same classes in multiple places.

@component('_partials.tip-good')
Create a template partial or JavaScript component
@endcomponent

<pre v-pre class="language-html"><code>&lt;!-- In use --&gt;
&lt;VacationCard
  img=&quot;/img/cancun.jpg&quot;
  imgAlt=&quot;Beach in Cancun&quot;
  eyebrow=&quot;Private Villa&quot;
  title=&quot;Relaxing All-Inclusive Resort in Cancun&quot;
  pricing=&quot;$299 USD per night&quot;
  url=&quot;/vacations/cancun&quot;
/&gt;

&lt;!-- ./components/VacationCard.vue --&gt;
&lt;template&gt;
  &lt;div&gt;
    &lt;img class=&quot;rounded&quot; :src=&quot;img&quot; :alt=&quot;imgAlt&quot;&gt;
    &lt;div class=&quot;mt-2&quot;&gt;
      &lt;div&gt;
        &lt;div class=&quot;text-xs text-gray-600 uppercase font-bold&quot;&gt;@{{ eyebrow }}&lt;/div&gt;
        &lt;div class=&quot;font-bold text-gray-700 leading-snug&quot;&gt;
          &lt;a :href=&quot;url&quot; class=&quot;hover:underline&quot;&gt;@{{ title }}&lt;/a&gt;
        &lt;/div&gt;
        &lt;div class=&quot;mt-2 text-sm text-gray-600&quot;&gt;@{{ pricing }}&lt;/div&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  &lt;/div&gt;
&lt;/template&gt;

&lt;script&gt;
  export default {
    props: ['img', 'imgAlt' 'eyebrow', 'title', 'pricing', 'url']
  }
&lt;/script&gt;</code></pre>

The above example uses [Vue](https://vuejs.org/v2/guide/components.html), but the same approach can be used with [React components](https://reactjs.org/docs/components-and-props.html), [ERB partials](https://guides.rubyonrails.org/v5.2/layouts_and_rendering.html#using-partials), [Blade components](https://laravel.com/docs/5.8/blade#components-and-slots), [Twig includes](https://twig.symfony.com/doc/2.x/templates.html#including-other-templates), etc.

---

## Extracting CSS components with @@apply

For small components like buttons and form elements, creating a template partial or JavaScript component can often feel too heavy compared to a simple CSS.

In these situations, you can use Tailwind's `@apply` directive to easily extract common utility patterns to simple CSS component classes.

Here's what a `.btn-blue` class might look like using `@apply` to compose it from existing utilities:

@component('_partials.code-sample', ['lang' => 'html', 'class' => 'text-center'])
<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
  Button
</button>

@slot('code')
<button class="btn-blue">
  Button
</button>

<style>
.btn-blue {
  @@apply bg-blue-500 text-white font-bold py-2 px-4 rounded;
}
.btn-blue:hover {
  @@apply bg-blue-700;
}
</style>
@endslot
@endcomponent

Note that variants like `hover:`, `focus:`, and `{screen}:` can't be applied directly, so instead apply the plain version of the utility to the appropriate pseudo-selector or media query.

Classes like this should be added directly after the `@@tailwind components` directive to avoid specificity issues.

@component('_partials.tip-bad')
Don't add custom component classes to the end of your CSS
@endcomponent

```css
@@tailwind base;

@@tailwind components;

@@tailwind utilities;

.btn-blue {
  @@apply bg-blue-500 text-white font-bold py-2 px-4 rounded;
}
.btn-blue:hover {
  @@apply bg-blue-700;
}
```

@component('_partials.tip-good')
Add custom component classes before your utilities
@endcomponent

```css
@@tailwind base;

@@tailwind components;

.btn-blue {
  @@apply bg-blue-500 text-white font-bold py-2 px-4 rounded;
}
.btn-blue:hover {
  @@apply bg-blue-700;
}

@@tailwind utilities;
```

### Keeping things composable

Say you have these two buttons:

@component('_partials.code-sample', ['lang' => 'html', 'class' => 'text-center'])
<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4">
  Button
</button>

<button class="bg-gray-400 hover:bg-gray-500 text-gray-800 font-bold py-2 px-4 rounded">
  Button
</button>

@slot('code')
<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
  Button
</button>

<button class="bg-gray-400 hover:bg-gray-500 text-gray-800 font-bold py-2 px-4 rounded">
  Button
</button>
@endslot
@endcomponent

It might be tempting to implement component classes for these buttons like this:

```css
.btn-blue {
  @@apply bg-blue-500 text-white font-bold py-2 px-4 rounded;
}
.btn-blue:hover {
  @@apply bg-blue-700;
}

.btn-gray {
  @@apply bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded;
}
.btn-gray:hover {
  @@apply bg-gray-500;
}
```

The issue with this approach is that **you still have potentially painful duplication.**

If you wanted to change the padding, font weight, or border radius of all the buttons on your site, you'd need to update every button class.

A better approach is to extract the parts that are the same into a separate class:

```css
.btn {
  @@apply font-bold py-2 px-4 rounded;
}

.btn-blue {
  @@apply bg-blue-500 text-white;
}
.btn-blue:hover {
  @@apply bg-blue-700;
}

.btn-gray {
  @@apply bg-gray-400 text-gray-800;
}
.btn-gray:hover {
  @@apply bg-gray-500;
}
```

Now you'd apply two classes any time you needed to style a button:

@component('_partials.code-sample', ['lang' => 'html', 'class' => 'text-center'])
<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4">
  Button
</button>

<button class="bg-gray-400 hover:bg-gray-500 text-gray-800 font-bold py-2 px-4 rounded">
  Button
</button>

@slot('code')
<button class="btn btn-blue">
  Button
</button>

<button class="btn btn-gray">
  Button
</button>
@endslot
@endcomponent

This makes it easy to change the shared styles in one place by just editing the `.btn` class.

It also allows you to add new one-off button styles without being forced to create a new component class or duplicated the shared styles:

@component('_partials.code-sample', ['lang' => 'html', 'class' => 'text-center'])
<button class="bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 rounded">
  Button
</button>

@slot('code')
<button class="btn bg-green-500 hover:bg-green-400 text-white">
  Button
</button>
@endslot
@endcomponent

### Writing a component plugin

In addition to writing component classes directly in your CSS files, you can also add component classes to Tailwind by writing your own plugin:

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

This can be a good choice if you want to publish your Tailwind components as a library or make it easier to share components across multiple projects.

Learn more in the [component plugin documentation](/docs/plugins#adding-components).


