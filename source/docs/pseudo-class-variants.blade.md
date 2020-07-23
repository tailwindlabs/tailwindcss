---
extends: _layouts.documentation
title: "Pseudo-Class Variants"
description: "Using utilities to style elements on hover, focus, and more."
titleBorder: true
---

<h2 style="font-size: 0" class="invisible m-0 -mb-6">Overview</h2>

Similar to how Tailwind handles [responsive design](/docs/responsive-design), styling elements on hover, focus, and more can be accomplished by prefixing utilities with the appropriate pseudo-class.

@component('_partials.code-sample')
<form class="flex w-full max-w-sm mx-auto">
  <input class="flex-1 bg-gray-200 hover:bg-white hover:border-gray-300 focus:outline-none focus:bg-white focus:shadow-outline focus:border-gray-300 appearance-none border border-transparent rounded w-full py-2 px-4 text-gray-700 leading-tight " type="email" placeholder="Your email">
  <button class="ml-4 flex-shrink-0 bg-teal-500 hover:bg-teal-600 focus:outline-none focus:shadow-outline text-white font-bold py-2 px-4 rounded" type="button">
    Sign Up
  </button>
</form>
@slot('code')
<form>
  <input class="bg-gray-200 hover:bg-white hover:border-gray-300 focus:outline-none focus:bg-white focus:shadow-outline focus:border-gray-300 ...">
  <button class="bg-teal-500 hover:bg-teal-600 focus:outline-none focus:shadow-outline ...">
    Sign Up
  </button>
</form>
@endslot
@endcomponent

**Not all pseudo-class variants are enabled for all utilities by default due to file-size considerations**, but we've tried our best to enable the most commonly used combinations out of the box.

For a complete list of which variants are enabled by default, see the [reference table](#default-variants-reference) at the end of this page.

Tailwind includes first-class support for styling elements on [hover](#hover), [focus](#focus), [active](#active), [disabled](#disabled), [visited](#visited), [first-child](#first-child), [last-child](#last-child), [odd-child](#odd-child), [even-child](#even-child), [group-hover](#group-hover), [group-focus](#group-focus), and [focus-within](#focus-within).

If you need to target a pseudo-class that Tailwind doesn't support, you can extend the supported variants by [writing a variant plugin](#creating-custom-variants).

---

## Hover

Add the `hover:` prefix to only apply a utility on hover.

@component('_partials.code-sample', ['lang' => 'html', 'class' => 'text-center'])
<button type="button" class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded focus:outline-none focus:shadow-outline">
  Hover me
</button>


@slot('code')
<button class="bg-transparent hover:bg-blue-500 text-blue-700 hover:text-white...">
  Hover me
</button>
@endslot
@endcomponent

You can control whether `hover` variants are enabled for a utility in the `variants` section of your `tailwind.config.js` file:

```js
// tailwind.config.js
module.exports = {
  // ...
  variants: {
    backgroundColor: ['responsive', 'hover', 'focus'],
  },
}
```

## Focus

Add the `focus:` prefix to only apply a utility on focus.

@component('_partials.code-sample', ['lang' => 'html'])
<div class="max-w-xs w-full mx-auto">
  <input class="bg-gray-200 focus:bg-white border-transparent focus:border-blue-400 text-gray-900 appearance-none inline-block w-full text-gray-900 border rounded py-3 px-4 focus:outline-none" placeholder="Focus me">
</div>

@slot('code')
<input class="bg-gray-200 focus:bg-white border-transparent focus:border-blue-400 ..." placeholder="Focus me">
@endslot
@endcomponent

You can control whether `focus` variants are enabled for a utility in the `variants` section of your `tailwind.config.js` file:

```js
// tailwind.config.js
module.exports = {
  // ...
  variants: {
    backgroundColor: ['responsive', 'hover', 'focus'],
  },
}
```

## Active

Add the `active:` prefix to only apply a utility when an element is active.

@component('_partials.code-sample', ['lang' => 'html', 'class' => 'text-center'])
<button type="button" class="bg-blue-500 active:bg-blue-700 text-white font-semibold hover:text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline">
  Click me
</button>

@slot('code')
<button class="bg-blue-500 active:bg-blue-700 text-white...">
  Click me
</button>
@endslot
@endcomponent

You can control whether `active` variants are enabled for a utility in the `variants` section of your `tailwind.config.js` file:

```js
// tailwind.config.js
module.exports = {
  // ...
  variants: {
    backgroundColor: ['responsive', 'hover', 'focus', 'active'],
  },
}
```

<h2 class="flex items-center">
  Disabled
  <span class="ml-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium leading-4 bg-green-150 text-green-900">
    v1.1.0+
  </span>
</h2>

Add the `disabled:` prefix to only apply a utility when an element is disabled.

@component('_partials.code-sample', ['lang' => 'html', 'class' => 'text-center'])
<button type="button" class="ml-4 disabled:opacity-75 bg-blue-500 active:bg-blue-700 text-white font-semibold hover:text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline">
  Submit
</button>
<button disabled type="button" class="ml-4 disabled:opacity-75 bg-blue-500 active:bg-blue-700 text-white font-semibold hover:text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline">
  Submit
</button>

@slot('code')
<button class="disabled:opacity-75 bg-blue-500...">
  Submit
</button>

<button disabled class="disabled:opacity-75 bg-blue-500...">
  Submit
</button>
@endslot
@endcomponent

You can control whether `disabled` variants are enabled for a utility in the `variants` section of your `tailwind.config.js` file:

```js
// tailwind.config.js
module.exports = {
  // ...
  variants: {
    opacity: ['responsive', 'hover', 'focus', 'disabled'],
  },
}
```

<h2 class="flex items-center">
  Visited
  <span class="ml-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium leading-4 bg-green-150 text-green-900">
    v1.1.0+
  </span>
</h2>

Add the `visited:` prefix to only apply a utility when a link has been visited.

@component('_partials.code-sample', ['lang' => 'html', 'class' => 'text-center'])
<a href="#" class="underline font-semibold text-blue-600">Unvisited link</a>
<a href="#" class="ml-4 underline font-semibold text-purple-600">Visited link</a>

@slot('code')
<a href="#" class="text-blue-600 visited:text-purple-600 ...">Link</a>
@endslot
@endcomponent

You can control whether `visited` variants are enabled for a utility in the `variants` section of your `tailwind.config.js` file:

```js
// tailwind.config.js
module.exports = {
  // ...
  variants: {
    textColor: ['responsive', 'hover', 'focus', 'visited'],
  },
}
```

<h2 class="flex items-center">
  First-child
  <span class="ml-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium leading-4 bg-green-150 text-green-900">
    v1.1.0+
  </span>
</h2>

Add the `first:` prefix to only apply a utility when it is the first-child of its parent. This is mostly useful when elements are being generated in some kind of loop.

@component('_partials.code-sample', ['lang' => 'html', 'class' => 'text-center'])
<div class="text-left max-w-sm border rounded">
  <div class="px-4 py-2 border-t first:border-t-0">One</div>
  <div class="px-4 py-2 border-t first:border-t-0">Two</div>
  <div class="px-4 py-2 border-t first:border-t-0">Three</div>
</div>

@slot('code')
<div class="border rounded">
  <div v-for="item in items" class="border-t first:border-t-0">
    @{{ item }}
  </div>
</div>
@endslot
@endcomponent

It's important to note that you should add any `first:` utilities to the child element, not the parent element.

You can control whether `first` variants are enabled for a utility in the `variants` section of your `tailwind.config.js` file:

```js
// tailwind.config.js
module.exports = {
  // ...
  variants: {
    borderWidth: ['responsive', 'first', 'hover', 'focus'],
  },
}
```

<h2 class="flex items-center">
  Last-child
  <span class="ml-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium leading-4 bg-green-150 text-green-900">
    v1.1.0+
  </span>
</h2>

Add the `last:` prefix to only apply a utility when it is the last-child of its parent. This is mostly useful when elements are being generated in some kind of loop.

@component('_partials.code-sample', ['lang' => 'html', 'class' => 'text-center'])
<div class="text-left max-w-sm border rounded">
  <div class="px-4 py-2 border-b last:border-b-0">One</div>
  <div class="px-4 py-2 border-b last:border-b-0">Two</div>
  <div class="px-4 py-2 border-b last:border-b-0">Three</div>
</div>

@slot('code')
<div class="border rounded">
  <div v-for="item in items" class="border-b last:border-b-0">
    @{{ item }}
  </div>
</div>
@endslot
@endcomponent

It's important to note that you should add any `last:` utilities to the child element, not the parent element.

You can control whether `last` variants are enabled for a utility in the `variants` section of your `tailwind.config.js` file:

```js
// tailwind.config.js
module.exports = {
  // ...
  variants: {
    borderWidth: ['responsive', 'last', 'hover', 'focus'],
  },
}
```

<h2 class="flex items-center">
  Odd-child
  <span class="ml-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium leading-4 bg-green-150 text-green-900">
    v1.1.0+
  </span>
</h2>

Add the `odd:` prefix to only apply a utility when it is an odd-child of its parent. This is mostly useful when elements are being generated in some kind of loop.

@component('_partials.code-sample', ['lang' => 'html', 'class' => 'text-center'])
<div class="rounded overflow-hidden text-left max-w-sm border">
  <div class="px-4 py-2 bg-white odd:bg-gray-200">One</div>
  <div class="px-4 py-2 bg-white odd:bg-gray-200">Two</div>
  <div class="px-4 py-2 bg-white odd:bg-gray-200">Three</div>
</div>

@slot('code')
<div class="border rounded">
  <div v-for="item in items" class="bg-white odd:bg-gray-200">
    @{{ item }}
  </div>
</div>
@endslot
@endcomponent

It's important to note that you should add any `odd:` utilities to the child element, not the parent element.

You can control whether `odd` variants are enabled for a utility in the `variants` section of your `tailwind.config.js` file:

```js
// tailwind.config.js
module.exports = {
  // ...
  variants: {
    borderWidth: ['responsive', 'odd', 'hover', 'focus'],
  },
}
```

<h2 class="flex items-center">
  Even-child
  <span class="ml-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium leading-4 bg-green-150 text-green-900">
    v1.1.0+
  </span>
</h2>

Add the `even:` prefix to only apply a utility when it is an even-child of its parent. This is mostly useful when elements are being generated in some kind of loop.

@component('_partials.code-sample', ['lang' => 'html', 'class' => 'text-center'])
<div class="rounded overflow-hidden text-left max-w-sm border">
  <div class="px-4 py-2 bg-white even:bg-gray-200">One</div>
  <div class="px-4 py-2 bg-white even:bg-gray-200">Two</div>
  <div class="px-4 py-2 bg-white even:bg-gray-200">Three</div>
</div>

@slot('code')
<div class="border rounded">
  <div v-for="item in items" class="bg-white even:bg-gray-200">
    @{{ item }}
  </div>
</div>
@endslot
@endcomponent

It's important to note that you should add any `even:` utilities to the child element, not the parent element.

You can control whether `even` variants are enabled for a utility in the `variants` section of your `tailwind.config.js` file:

```js
// tailwind.config.js
module.exports = {
  // ...
  variants: {
    borderWidth: ['responsive', 'even', 'hover', 'focus'],
  },
}
```

## Group-hover

If you need to style a child element when hovering over a specific parent element, add the `.group` class to the parent element and add the `group-hover:` prefix to the utility on the child element.

@component('_partials.code-sample', ['lang' => 'html', 'class' => 'bg-gray-200 p-8'])
<div class="group hover:bg-blue-500 p-4 cursor-pointer bg-white rounded max-w-xs w-full shadow-lg select-none overflow-hidden mx-auto">
  <p class="font-semibold text-lg mb-1 text-gray-900 group-hover:text-white">New Project</p>
  <p class="text-gray-700 group-hover:text-white mb-2">Create a new project from a variety of starting templates.</p>
</div>


@slot('code')
<div class="group bg-white hover:bg-blue-500 ...">
  <p class="text-gray-900 group-hover:text-white ...">New Project</p>
  <p class="text-gray-700 group-hover:text-white ...">Create a new project from a variety of starting templates.</p>
</div>
@endslot
@endcomponent

You can control whether `group-hover` variants are enabled for a utility in the `variants` section of your `tailwind.config.js` file:

```js
// tailwind.config.js
module.exports = {
  // ...
  variants: {
    textColor: ['responsive', 'hover', 'focus', 'group-hover'],
  },
}
```

<h2>
  <span class="flex items-center" data-heading-text>
    Group-focus
    <span class="ml-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium leading-4 bg-green-150 text-green-900">
      v1.3.0+
    </span>
  </span>
</h2>

The `group-focus` variant works just like [`group-hover`](#group-hover) except for focus:

@component('_partials.code-sample', ['lang' => 'html', 'class' => 'text-center bg-white p-8'])
<span class="inline-flex rounded-md shadow-sm">
  <button type="button" class="group inline-flex items-center px-4 py-2 border border-gray-400 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:text-gray-900 focus:outline-none focus:text-gray-900 focus:border-gray-500 hover:border-gray-500">
  <svg fill="currentColor" viewBox="0 0 20 20" class="-ml-1 mr-3 w-5 h-5 text-gray-400 group-focus:text-gray-500"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"></path></svg>
    Bookmark
  </button>
</span>

@slot('code')
<button class="group text-gray-700 focus:text-gray-900 ...">
  <svg class="h-6 w-6 text-gray-400 group-focus:text-gray-500"><!-- ... --></svg>
  Submit
</button>
@endslot
@endcomponent

You can control whether `group-focus` variants are enabled for a utility in the `variants` section of your `tailwind.config.js` file:

```js
// tailwind.config.js
module.exports = {
  // ...
  variants: {
    textColor: ['responsive', 'hover', 'focus', 'group-focus'],
  },
}
```



## Focus-within

<div class="text-sm bg-blue-100 text-blue-700 font-semi-bold px-4 py-2 mb-4 rounded">
  <div class="flex items-center">
    <div class="mr-2">
      <svg class="block text-blue-400 h-5 w-5" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M16.432 15C14.387 9.893 12 8.547 12 6V3h.5a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5H8v3c0 2.547-2.387 3.893-4.432 9-.651 1.625-2.323 4 6.432 4s7.083-2.375 6.432-4zm-1.617 1.751c-.702.21-2.099.449-4.815.449s-4.113-.239-4.815-.449c-.249-.074-.346-.363-.258-.628.22-.67.635-1.828 1.411-3.121 1.896-3.159 3.863.497 5.5.497s1.188-1.561 1.824-.497a15.353 15.353 0 0 1 1.411 3.121c.088.265-.009.553-.258.628z"/></svg>
    </div>
    <div>
      <p class="font-semibold">Note that focus-within is not supported in IE or Edge &lt; 79.</p>
    </div>
  </div>
</div>

Add the `focus-within:` prefix to only apply a utility when a child element has focus.

@component('_partials.code-sample', ['lang' => 'html', 'class' => 'bg-white p-8'])
<form class="w-full max-w-sm mx-auto">
  <div class="flex items-center border-b-2 border-gray-400 focus-within:border-teal-500 py-2">
    <input class="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" type="text" placeholder="Jane Doe" aria-label="Full name">
    <button class="focus:shadow-outline focus:outline-none flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded" type="button">
      Sign Up
    </button>
  </div>
</form>


@slot('code')
<form class="border-b-2 border-gray-400 focus-within:border-teal-500 ...">
  <input class="..." placeholder="Jane Doe" ...>
  <button class="...">
    Sign Up
  </button>
</form>
@endslot
@endcomponent

You can control whether `focus-within` variants are enabled for a utility in the `variants` section of your `tailwind.config.js` file:

```js
// tailwind.config.js
module.exports = {
  // ...
  variants: {
    borderColor: ['responsive', 'hover', 'focus', 'focus-within'],
  },
}
```


<h2 class="flex items-center">
  Focus-visible
  <span class="ml-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium leading-4 bg-green-150 text-green-900">
    v1.5.0+
  </span>
</h2>

<div class="text-sm bg-blue-100 text-blue-700 font-semi-bold px-4 py-2 mb-4 rounded">
  <div class="flex items-center">
    <div class="mr-2">
      <svg class="block text-blue-400 h-5 w-5" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M16.432 15C14.387 9.893 12 8.547 12 6V3h.5a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5H8v3c0 2.547-2.387 3.893-4.432 9-.651 1.625-2.323 4 6.432 4s7.083-2.375 6.432-4zm-1.617 1.751c-.702.21-2.099.449-4.815.449s-4.113-.239-4.815-.449c-.249-.074-.346-.363-.258-.628.22-.67.635-1.828 1.411-3.121 1.896-3.159 3.863.497 5.5.497s1.188-1.561 1.824-.497a15.353 15.353 0 0 1 1.411 3.121c.088.265-.009.553-.258.628z"/></svg>
    </div>
    <div>
      <p class="font-semibold">Note that focus-visible currently requires a polyfill for sufficient browser support.</p>
    </div>
  </div>
</div>

Add the `focus-visible:` prefix to only apply a utility when an element has focus but only if the user is using the keyboard.

@component('_partials.code-sample', ['lang' => 'html', 'class' => 'p-8'])
<ul class="flex space-x-8">
  <li>
    <a class="text-blue-500 hover:text-blue-800 focus:outline-none focus:underline" href="#" onclick="((e) => {e.stopPropagation(); e.preventDefault()})(event)">Underlined on focus</a>
  </li>
  <li>
    <a class="text-blue-500 hover:text-blue-800 focus:outline-none focus-visible:underline" href="#" onclick="((e) => {e.stopPropagation(); e.preventDefault()})(event)">Underlined on focus-visible</a>
  </li>
</ul>

@slot('code')
<ul class="flex space-x-8">
  <li>
    <a class="focus:outline-none focus:underline ..." href="#">
      Underlined on focus
    </a>
  </li>
  <li>
    <a class="focus:outline-none focus-visible:underline ..." href="#">
      Underlined on focus-visible
    </a>
  </li>
</ul>
@endslot
@endcomponent

Note that only Firefox supports `focus-visible` natively, so for sufficient browser support you should install and configure both the [focus-visible JS polyfill](https://github.com/WICG/focus-visible) and the [focus-visible PostCSS polyfill](https://github.com/csstools/postcss-focus-visible). Make sure to include the PostCSS plugin _after_ Tailwind in your list of PostCSS plugins:

```js
// postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {},
    'postcss-focus-visible': {},
    autoprefixer: {}
  }
}
```

You can control whether `focus-visible` variants are enabled for a utility in the `variants` section of your `tailwind.config.js` file:

```js
// tailwind.config.js
module.exports = {
  // ...
  variants: {
    textDecoration: ['responsive', 'hover', 'focus', 'focus-visible'],
  },
}
```

---

## Combining with responsive prefixes

Pseudo-class variants are also responsive, meaning you can do things like change an element's hover style at different breakpoints for example.

To apply a pseudo-class variant at a specific breakpoint, add the responsive prefix first, before the pseudo-class prefix:

@component('_partials.responsive-code-sample', ['class' => 'text-center'])
@slot('none')
<button class="px-4 py-2 rounded text-white font-bold bg-orange-500 hover:bg-orange-600">Button</button>
@endslot

@slot('sm')
<button class="px-4 py-2 rounded text-white font-bold bg-green-500 hover:bg-green-600">Button</button>
@endslot

@slot('md')
<button class="px-4 py-2 rounded text-white font-bold bg-red-500 hover:bg-red-600">Button</button>
@endslot

@slot('lg')
<button class="px-4 py-2 rounded text-white font-bold bg-indigo-500 hover:bg-indigo-600">Button</button>
@endslot

@slot('xl')
<button class="px-4 py-2 rounded text-white font-bold bg-pink-500 hover:bg-pink-600">Button</button>
@endslot

@slot('code')
<button class="none:bg-orange-500 none:hover:bg-orange-600 sm:bg-green-500 sm:hover:bg-green-600 md:bg-red-500 md:hover:bg-red-600 lg:bg-indigo-500 lg:hover:bg-indigo-600 xl:bg-pink-500 xl:hover:bg-pink-600 ">
  Button
</button>
@endslot
@endcomponent

---

## Generative variants for custom utilities

You can generate pseudo-class variants for your own custom utilities by wrapping them with the `@@variants` directive in your CSS:

```css
/* Input: */
@@variants group-hover, hover, focus {
  .banana {
    color: yellow;
  }
}

/* Output: */
.banana {
  color: yellow;
}
.group:hover .group-hover\:banana {
  color: yellow;
}
.hover\:banana:hover {
  color: yellow;
}
.focus\:banana:focus {
  color: yellow;
}

```

For more information, see the [@@variants directive documentation](/docs/functions-and-directives#variants).

---

## Creating custom variants

You can create your own variants for any pseudo-classes Tailwind doesn't include by default by writing a custom variant plugin.

For example, this simple plugin adds support for the `disabled` pseudo-class variant:

```js
// tailwind.config.js
const plugin = require('tailwindcss/plugin')

module.exports = {
  plugins: [
    plugin(function({ addVariant, e }) {
      addVariant('disabled', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.${e(`disabled${separator}${className}`)}:disabled`
        })
      })
    })
  ]
}
```

Learn more about writing variant plugins in the [variant plugin documentation](/docs/plugins#adding-variants).

---

## Default variants reference

Due to file-size considerations, Tailwind does not include all variants for all utilities by default.

To configure which variants are enabled for your project, see the [configuring variants documentation](/docs/configuring-variants).

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
    backgroundOpacity: ['responsive', 'hover', 'focus'],
    backgroundPosition: ['responsive'],
    backgroundRepeat: ['responsive'],
    backgroundSize: ['responsive'],
    borderCollapse: ['responsive'],
    borderColor: ['responsive', 'hover', 'focus'],
    borderOpacity: ['responsive', 'hover', 'focus'],
    borderRadius: ['responsive'],
    borderStyle: ['responsive'],
    borderWidth: ['responsive'],
    boxShadow: ['responsive', 'hover', 'focus'],
    boxSizing: ['responsive'],
    clear: ['responsive'],
    cursor: ['responsive'],
    display: ['responsive'],
    divideColor: ['responsive'],
    divideOpacity: ['responsive'],
    divideWidth: ['responsive'],
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
    placeholderOpacity: ['responsive', 'focus'],
    pointerEvents: ['responsive'],
    position: ['responsive'],
    resize: ['responsive'],
    rotate: ['responsive', 'hover', 'focus'],
    scale: ['responsive', 'hover', 'focus'],
    skew: ['responsive', 'hover', 'focus'],
    space: ['responsive'],
    stroke: ['responsive'],
    strokeWidth: ['responsive'],
    tableLayout: ['responsive'],
    textAlign: ['responsive'],
    textColor: ['responsive', 'hover', 'focus'],
    textDecoration: ['responsive', 'hover', 'focus'],
    textOpacity: ['responsive', 'hover', 'focus'],
    textTransform: ['responsive'],
    transform: ['responsive'],
    transformOrigin: ['responsive'],
    transitionDelay: ['responsive'],
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
