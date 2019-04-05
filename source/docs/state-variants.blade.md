---
extends: _layouts.documentation
title: "State Variants"
description: "Using utilities to style elements on hover, focus, and more."
titleBorder: true
---

@include('_partials.work-in-progress')

To Document:

- Add reference table with all of the default variant configuration
- Briefly document responsive variants again, linking to responsive design docs?

---

Similar to our [responsive prefixes](/docs/responsive-design), Tailwind makes it easy to style elements on hover, focus, and more using *state* prefixes.

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

You can enable `hover` variants for a core utility plugin in the `variants` section of your `tailwind.config.js` file:

```js
// tailwind.config.js
module.exports = {
  // ...
  variants: {
    backgroundColor: ['hover'],
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

You can enable `focus` variants for a core utility plugin in the `variants` section of your `tailwind.config.js` file:

```js
// tailwind.config.js
module.exports = {
  // ...
  variants: {
    backgroundColor: ['focus'],
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

You can enable `active` variants for a core utility plugin in the `variants` section of your `tailwind.config.js` file:

```js
// tailwind.config.js
module.exports = {
  // ...
  variants: {
    backgroundColor: ['active'],
  },
}
```


## Group Hover

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

You can enable `group-hover` variants for a core utility plugin in the `variants` section of your `tailwind.config.js` file:

```js
// tailwind.config.js
module.exports = {
  // ...
  variants: {
    backgroundColor: ['group-hover'],
  },
}
```


## Focus-Within

<div class="text-sm bg-blue-100 text-blue-700 font-semi-bold px-4 py-2 mb-4 rounded">
  <div class="flex items-center">
    <div class="mr-2">
      <svg class="block text-blue-400 h-5 w-5" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M16.432 15C14.387 9.893 12 8.547 12 6V3h.5a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5H8v3c0 2.547-2.387 3.893-4.432 9-.651 1.625-2.323 4 6.432 4s7.083-2.375 6.432-4zm-1.617 1.751c-.702.21-2.099.449-4.815.449s-4.113-.239-4.815-.449c-.249-.074-.346-.363-.258-.628.22-.67.635-1.828 1.411-3.121 1.896-3.159 3.863.497 5.5.497s1.188-1.561 1.824-.497a15.353 15.353 0 0 1 1.411 3.121c.088.265-.009.553-.258.628z"/></svg>
    </div>
    <div>
      <p class="font-semibold">Note that focus-within is not supported in IE or Edge.</p>
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

You can enable `focus-within` variants for a core utility plugin in the `variants` section of your `tailwind.config.js` file:

```js
// tailwind.config.js
module.exports = {
  // ...
  variants: {
    backgroundColor: ['focus-within'],
  },
}
```

## Combining with Responsive Prefixes

State variants are also responsive, meaning you can change an element's hover style for example at different breakpoints.

To apply a state variant responsively, add the responsive prefix first, before the state prefix:

```html
<button class="... md:bg-orange-500 md:hover:bg-red-500 ...">Button</button>
```

## Custom Utilities

You can generate state variants for your own custom utilities using the `@@variants` directive:

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
.group:hover group-hover\:banana {
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
